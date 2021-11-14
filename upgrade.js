const Utils = require('./util/utils')
const db = require('./config/db')
const Sequelize = db.sequelize;
const log = require("./config/log");

// 固定表更新sql
const stableSqlStr = `
alter table Project add column monitorFetchCode text default null comment '监控代码(含fetch)';
alter table Project add column alarmRuleId varchar(10) default null comment '规则id';
alter table Project add column alarmMembers text default null comment '通知人员';
alter table User add column phone varchar(11) default null comment '手机号码';
alter table Project add column recordConfig text default null comment '监控配置项';
alter table User add column registerStatus int(11) default 0 comment '注册状态';
`
// 动态表更新sql
const dynamicSqlStr = `
CustomerPV-deviceSize-varchar(50)-null-设备尺寸
HttpErrorInfo-method-varchar(10)-null-请求方法
HttpLogInfo-method-varchar(10)-null-请求方法
`

/** 第一步，更新固定数据表结构 */
const stableSqlArr = stableSqlStr.split('\n')
console.log("")
console.log("")
console.log("=======================================")
console.log("第一步、固定数据库表更新sql如下：")
console.log("=======================================")
for (let i = 0; i < stableSqlArr.length; i ++) {
  console.log(stableSqlArr[i])
  if (stableSqlArr[i]) {
    Sequelize.query(stableSqlArr[i], { type: Sequelize.QueryTypes.SELECT}).then(() => {
      log.info(stableSqlArr[i] + " 【执行成功】")
    }).catch((e) => {
      log.printError(stableSqlArr[i] + " 【无需更新】")
    })
  }
}

/** 第二步，删除明天的动态数据表 */
let sql1 = "select webMonitorId from Project"
console.log("")
console.log("")
console.log("=======================================")
console.log("第二步、删除明天的动态数据库表sql如下：")
console.log("=======================================")
Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT}).then((webMonitorIdList) => {
  const dynamicTableList = []
  const tempDynamicSqlList = dynamicSqlStr.split('\n')
  tempDynamicSqlList.forEach((tempSql) => {
    dynamicTableList.push(tempSql.split('-')[0])
  })
  const tableList = []
  const tomorrowDate = Utils.addDays(1).replace(/-/g, "")
  webMonitorIdList.forEach((project) => {
    dynamicTableList.forEach((dynamicTable) => {
      if (dynamicTable) {
        tableList.push(project.webMonitorId + dynamicTable + tomorrowDate)
      }
    })
  })
  tableList.forEach((tableName, index) => {
    if (tableName) {
      setTimeout(() => {
        let sql = "drop table " + tableName
        console.log(sql)
        Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT}).then(() => {
          log.info(tableName + " 【删除成功】")
        }).catch((e) => {
          log.printError(tableName + " 【表不存在或者已删除】")
        })
        if (index === tableList.length - 1) {
          console.log("")
          console.log("")
          setTimeout(() => {
            console.log("===============================================")
            console.log("第三步、定时重启")
            console.log("1. 数据表创建完成后，请在今天 23:50:00 重启服务")
            console.log("2. 请手动执行命令：npm run table_config 创建明天的数据表")
            console.log("===============================================")
          }, 2000)
        }
      }, index * 1000)
    }
  })
})
