const db = require('../config/db');
                        const Sequelize = db.sequelize;
                        const Utils = require('../util/utils');
                        const utils = require('../util/utils');
                        const CommonSql = require('../util/commonSql')
                        const geoip = require('geoip-lite');
                        const log = require("../config/log");
                        const { UPLOAD_TYPE, FLOW_TYPE, START_YEAR } = require('../config/consts')
                        const AccountConfig = require('../config/AccountConfig')
                        const { accountInfo } = AccountConfig
                        const infoSchemaList = require("../schema/infoSchemaListByDay")
                        const infoSchemaListByYear = require("../schema/infoSchemaListByYear")
                        const fs = require('fs');
                        const fetch = require('node-fetch');
const UserToken = Sequelize.import('../schema/userToken');
UserToken.sync({force: false});


class UserTokenModel {
  /**
   * 创建UserToken信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createUserToken(data) {
    return await UserToken.create({
      ...data
    })
  }
     /**
   * 获取UserToken详情数据
   * @param userId  UserToken的userId
   * @returns {Promise<Model>}
   */
  static async getUserTokenDetail(userId) {
    return await UserToken.findOne({
      where: {
        userId,
      },
    })
  }

  /**
   * 获取UserToken详情数据
   * @param accessToken
   * @returns {Promise<Model>}
   */
  static async getUserTokenDetailByToken(accessToken) {
    return await UserToken.findOne({
      where: {
        accessToken,
      },
    })
  }

  static async updateUserToken(userId, data) {
    await UserToken.update({
      ...data
    }, {
      where: {
        userId
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async deleteUserToken(userId) {
    await UserToken.destroy({
      where: {
        userId,
      }
    })
    return true
  }

  static async getAllTokens() {
    let sql = "select userId, accessToken from UserToken"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 检查token是否存在
   * @param userId  UserToken的userId
   * @returns {Promise<Model>}
   */
  static async checkTokenExist(userId, accessToken) {
    return await UserToken.findOne({
      where: {
        userId,
        accessToken,
      },
    })
  }
}

const ApplicationConfig = Sequelize.import('../schema/applicationConfig');
ApplicationConfig.sync({force: false});


class ApplicationConfigModel {
  /**
   * 创建Config信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createApplicationConfig(data) {
    return await ApplicationConfig.create({
      ...data
    })
  }
     /**
   * 获取Config详情数据
   * @param id  Config的ID
   * @returns {Promise<Model>}
   */
  static async getApplicationConfigDetail(id) {
    return await ApplicationConfig.findOne({
      where: {
        id,
      },
    })
  }

  static async updateApplicationConfig(systemName, data) {
    await ApplicationConfig.update({
      ...data
    }, {
      where: {
        systemName
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async getApplicationConfigByConfigName(systemName) {
    let sql = "select * from ApplicationConfig where systemName='" + systemName + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getAllApplicationConfig() {
    let sql = "select systemName, configValue from ApplicationConfig"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const Config = Sequelize.import('../schema/config');
Config.sync({force: false});


class ConfigModel {
  /**
   * 创建Config信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createConfig(data) {
    return await Config.create({
      ...data
    })
  }
     /**
   * 获取Config详情数据
   * @param id  Config的ID
   * @returns {Promise<Model>}
   */
  static async getConfigDetail(id) {
    return await Config.findOne({
      where: {
        id,
      },
    })
  }

  static async updateConfig(configName, data) {
    await Config.update({
      ...data
    }, {
      where: {
        configName
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async getConfigByConfigName(configName) {
    let sql = "select * from Config where configName='" + configName + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getAllConfigList() {
    let sql = "select * from Config"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const Message = Sequelize.import('../schema/message');
Message.sync({force: false});


class MessageModel {
  /**
   * 创建Message信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createMessage(data) {
    return await Message.create({
      ...data
    })
  }

  static async deleteMessage(id) {
    await Message.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async getAllMessage() {
    let sql = "select * from Message"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getMessageByType(param) {
    const { messageType, page, pageSize, userId } = param
    const start = page * pageSize
    const userIdSql = userId ? ` and userId='${userId}' ` : ''
    let sql = `select * from Message where type='${messageType}' ${userIdSql} order by createdAt desc limit ${start},${pageSize}`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getUnReadMessageCountByType(param) {
    const { userId, messageType } = param
    // let sql = `select count(*) as unReadCount from Message where type='${messageType}' and userId='${userId}' and isRead=0`
    let sql = `select isRead, count(isRead) as count from Message where  type='${messageType}' and userId='${userId}' GROUP BY isRead`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async readAll(userId, messageType) {
    // let sql = `UPDATE Message SET isRead = 1 WHERE type='${messageType}' and userId = '${userId}'`
    // await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
    const data = {isRead: 1}
    await Message.update({
      ...data
    }, {
      where: {
        userId,
        type: messageType,
      },
      fields: Object.keys(data)
    })
    return true
  }
  /**
   * 获取Message详情数据
   * @param id  Message的ID
   * @returns {Promise<Model>}
   */
  static async getMessageDetail(id) {
    return await Message.findOne({
      where: {
        id,
      },
    })
  }

  static async updateMessage(id, data) {
    await Message.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }
}

class FlowDataInfoByHourModel {
  /**
   * 创建FlowDataInfoByHour信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createFlowDataInfoByHour(data) {

    let keys = ""
    let values = ""
    const keyArray = [`id`, `createdAt`, `updatedAt`, `companyId`, `projectId`, `flowOrigin`, `flowType`, "hourName", "flowCount"]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        // createdAt， updatedAt 不能位于 keyArray的最后一个
        switch (key) {
          case "id":
            val = new Date().getTime() + Utils.getUuid()
            break
          case "createdAt":
          case "updatedAt":
            // 填写创建时间
            val = new Date().Format("yyyy-MM-dd hh:mm:ss")
            break
          default:
            break
        }

        if (val != undefined) {
          values += "'" + val + "', "

        } else {
          values += "DEFAULT, "
        }
      }
    })
    const dateEnd = new Date().Format("yyyyMMdd")
    const table = "FlowDataInfoByHour" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  static async createFlowDataInfosByHour(insertSql) {
    return await Sequelize.query(insertSql, { type: Sequelize.QueryTypes.INSERT })
  }
  /**
   * 计算当天各种流量数据
   */
  static async calculateFlowCountByDay(dayIndex) {
    const tableName = CommonSql.setTableName("FlowDataInfoByHour", dayIndex, "")
    let sql = ` select companyId, projectId, projectName, flowType, productType, sum(flowCount) as flowCount from ${tableName} group by companyId, projectId, projectName, flowType, productType `
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  static async getHourFlowTrendDataForCompanyId(companyId, productType, projectIds) {
    // const nowDay = new Date().Format("yyyyMMdd")
    const nowDay = '20230806'
    const tableName = "FlowDataInfoByHour" + nowDay
    //把参数ids处理下添加'' 
    const ids = projectIds.split(',').map(item => `'${item}'`).join(',')
    let sql = `SELECT projectId, productType, sum(flowCount) as count, hourName FROM ${tableName} where companyId = '${companyId}' and flowType!='total_flow_count' and productType='${productType}' and projectId in (${ids}) group by hourName, projectId order by field(projectId, ${ids})`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
}

const Team = Sequelize.import('../schema/team');
Team.sync({force: false});


class TeamModel {
  /**
   * 创建Team信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createTeam(data) {
    return await Team.create({
      ...data
    })
  }

  static async deleteTeam(id) {
    await Team.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取Team详情数据
   * @param id  Team的ID
   * @returns {Promise<Model>}
   */
  static async getTeamDetail(id) {
    return await Team.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 根据名称获取Team详情数据
   * @param id  Team的ID
   * @returns {Promise<Model>}
   */
  static async getTeamDetailByName(teamName) {
    return await Team.findOne({
      where: {
        teamName,
      },
    })
  }

  static async updateTeam(id, data) {
    await Team.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async getTeamList(userId, userType, companyId) {
    let sql = ""
    if (userType === "admin" || userType === "superAdmin") {
      sql = `select * from Team where companyId='${companyId}'`
    } else {
      sql = `select * from Team where companyId='${companyId}' and members like '%${userId}%'`
      // sql = "select * from Team"
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getAllTeamList() {
    let sql = "select * from Team"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getTeamMembersByWebMonitorId(webMonitorId) {
    let sql = `select leaderId, members from Team where FIND_IN_SET('${webMonitorId}', webMonitorIds)`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async findTeamListByLeaderId(userId) {
    let sql = "select * from Team where FIND_IN_SET('" + userId + "', members)" //leaderId='" + userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  // 检查是不是团长
  static async checkTeamLeader(teamId, userId) {
    let sql = `select * from Team where id='${teamId}' and leaderId='${userId}'` //leaderId='" + userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  // 检查是不是团队成员
  static async checkTeamMember(teamId, userId) {
    let sql = `select * from Team where id='${teamId}' and  FIND_IN_SET('${userId}', members)` //leaderId='" + userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

class FlowDataInfoByDayModel {
  /**
   * 创建FlowDataInfoByDay信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createFlowDataInfoByDay(data) {

    let keys = ""
    let values = ""
    const keyArray = [`id`, `createdAt`, `updatedAt`, `companyId`, `projectId`, `flowOrigin`, `flowType`, `monthName`, "dayName", "flowCount"]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        // createdAt， updatedAt 不能位于 keyArray的最后一个
        switch (key) {
          case "id":
            val = new Date().getTime() + Utils.getUuid()
            break
          case "createdAt":
          case "updatedAt":
            // 填写创建时间
            val = new Date().Format("yyyy-MM-dd hh:mm:ss")
            break
          default:
            break
        }

        if (val != undefined) {
          values += "'" + val + "', "

        } else {
          values += "DEFAULT, "
        }
      }
    })
    const dateEnd = new Date().Format("yyyyMMdd")
    const table = "FlowDataInfoByDay" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  static async createFlowDataInfosByDay(flowArray, dayName, monthName) {
    let valueSql = ""
    for (let i = 0; i < flowArray.length; i++) {
      const { flowCount } = flowArray[i]
      if (flowCount === 0) continue
      valueSql += FlowDataInfoByDayModel.handleFlowArray(flowArray[i], dayName, monthName)
    }
    valueSql = valueSql.substring(0, valueSql.length - 1)
    const dateEnd = dayName.substring(0, 4)
    const table = "FlowDataInfoByDay" + dateEnd
    let sql = ""
    if (valueSql) {
      sql = `INSERT INTO ${table} (companyId, projectId, flowOrigin, flowType, monthName, dayName, flowCount, createdAt, updatedAt) 
      VALUES
      ${valueSql}
      `
    }
    if (sql) {
      return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
    }
    return await Promise.resolve("无数据")
  }

  static handleFlowArray(flowData, dayName, monthName) {
    const createdAt = new Date().Format("yyyy-MM-dd hh:mm:ss")
    const updatedAt = createdAt
    const { companyId, projectId, flowType, flowCount } = flowData
    const flowOrigin = "subscribe"
    let sqlStr = `('${companyId}', '${projectId}', '${flowOrigin}', '${flowType}', '${monthName}', '${dayName}', ${flowCount}, '${createdAt}', '${updatedAt}'),`
    return sqlStr
  }
  static async getMonthFlowDataForCompanyId(companyId) {
    const nowMonth = new Date().Format("yyyy-MM")
    const nowYear = new Date().getFullYear()
    const tableName = "FlowDataInfoByDay" + nowYear
    let sql = `SELECT flowOrigin, sum(flowCount) as count, monthName FROM ${tableName} where companyId = '${companyId}' and flowType = 'total_flow_count' and monthName='${nowMonth}' group by flowOrigin`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  static async getTotalFlowDataForCompanyId(companyId) {
    const nowYear = new Date().getFullYear()
    let sql = ""
    for (let i = START_YEAR; i <= nowYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      sql += `SELECT sum(flowCount) as count, min(dayName) as minDay  FROM ${tableName} where companyId = '${companyId}' and flowType = 'total_flow_count'`
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  /**
  * 事件趋势
  * @param {String} companyId 公司ID
  * @param {String} startDate 起始时间  '2022-07-28'
  * @param {String} endDate 截止时间 '2023-07-28'
  * @returns 
  */
  static async getFlowTrendDataForCompanyIdByDate(companyId, startDate = '', endDate = '') {
    const nowYear = new Date().getFullYear()
    const startYear = startDate ? parseInt(startDate.substring(0, 4)) : nowYear
    const endYear = endDate ? parseInt(endDate.substring(0, 4)) : nowYear
    let sql = ""
    for (let i = startYear; i <= endYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      if (startDate && endDate) {
        sql += `SELECT dayName, sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' and dayName between '${startDate}' and '${endDate}' group by dayName`
      } else {
        sql += `SELECT dayName, sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' group by dayName`
      }
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  /**
   * 事件分布
   * @param {String} companyId 公司ID
   * @param {String} startDate 起始时间
   * @param {String} endDate 截止时间
   * @returns 
   */
  static async getFlowDistributeDataForCompanyIdByDate(companyId, startDate = '', endDate = '') {
    const nowYear = new Date().getFullYear()
    const startYear = startDate ? parseInt(startDate.substring(0, 4)) : nowYear
    const endYear = endDate ? parseInt(endDate.substring(0, 4)) : nowYear
    let sql = ""
    for (let i = startYear; i <= endYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      if (startDate && endDate) {
        sql += `SELECT productType, sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' and dayName between '${startDate}' and '${endDate}' group by productType`
      } else {
        sql += `SELECT productType, sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' group by productType`
      }
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }

  /**
  * 事件分布
  * @param {String} companyId 公司ID
  * @param {String} productType 产品类型 监控 埋点
  * @param {Number} page 页码 起始位为1
  * @param {Number} pageSize 每页查询条数
  * @param {String} projectName 项目名称
  * @returns 
  */
  static async getFlowTableListDataForCompanyId({ companyId, productType, page, pageSize, projectName }) {
    // TOTAL_FLOW_COUNT: "total_flow_count", // 总流量
    // PV_FLOW_COUNT: "pv_flow_count", // PV流量
    // BEHAVIOR_FLOW_COUNT: "behavior_flow_count", // 行为流量
    // HTTP_FLOW_COUNT: "http_flow_count", // 接口流量(请求，返回，错误)
    // ERROR_FLOW_COUNT: "error_flow_count", // 错误流量(代码错误，静态资源错误)
    // PERF_FLOW_COUNT: "perf_flow_count", // 性能流量(页面加载)
    // OTHER_FLOW_COUNT: "other_flow_count", // 其他流量(自定义日志)
    // FLOW_PACKAGE_COUNT: "flow_package_count", // 流量包

    const _offset = (page - 1) * pageSize
    const nowYear = new Date().getFullYear()
    let sql = ""
    let nameCondition = projectName ? `and projectName like '%${projectName}%'` : ''
    for (let i = START_YEAR; i <= nowYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      sql += `SELECT sum(if(flowType='total_flow_count', flowCount, 0)) as totalCount, 
              sum(if(flowType='pv_flow_count', flowCount, 0)) as pvCount,  
              sum(if(flowType='http_flow_count', flowCount, 0)) as httpCount, 
              sum(if(flowType='behavior_flow_count', flowCount, 0)) as behaviorCount,  
              sum(if(flowType='error_flow_count', flowCount, 0)) as errorCount, 
              sum(if(flowType='perf_flow_count', flowCount, 0)) as perfCount, 
              sum(if(flowType='other_flow_count', flowCount, 0)) as otherCount, 
              sum(if(flowType='flow_package_count', flowCount, 0)) as flowCount, 
              projectId, companyId, productType, projectName
              FROM ${tableName} where companyId = '${companyId}' and productType = '${productType}' ${nameCondition} group by projectId, projectName LIMIT ${Number(_offset)},${Number(pageSize)} `

      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }

  /**
  * 获取流量流量列表总条数
  * @param {String} companyId 公司ID
  * @param {String} productType 产品类型 监控 埋点
  * @param {String} projectName 项目名称
  * @returns 
  */
  static async getFlowTotalCountForCompanyId(companyId, productType = 'monitor', projectName = '') {
    const nowYear = new Date().getFullYear()
    let sql = ""
    let nameCondition = projectName ? `and projectName like '%${projectName}%'` : ''
    for (let i = START_YEAR; i <= nowYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      sql += `SELECT COUNT(DISTINCT projectId) as count FROM ${tableName} where companyId = '${companyId}' and productType = '${productType}' ${nameCondition} group by projectId`
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
}

class CommonTableModel {
  /**
   * 删除表结构
   */
  static async dropTable(tableNameStr) {
    let sql = `
    DROP TABLE 
    ${tableNameStr} 
    `
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 动态建表（分析类）
   */
  static async createInfoTable(dateStr) {
    infoSchemaList.forEach((schema) => {
      const SchemaModal = Sequelize.define(schema.name + dateStr, schema.fields, schema.index);
      SchemaModal.sync({force: false});
    })
  }

  /**
   * 动态建表（分析类）,按年份建表
   */
  static async createInfoTableByYear(yearStr) {
    infoSchemaListByYear.forEach((schema) => {
      const SchemaModal = Sequelize.define(schema.name + yearStr, schema.fields, schema.index);
      SchemaModal.sync({force: false});
    })
  }
}

const Product = Sequelize.import('../schema/product');
Product.sync({ force: false });


class ProductModel {
  /**
   * 创建Product信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createProduct(data) {
    return await Product.create({
      ...data
    })
  }
  /**
* 获取Product详情数据
* @param userId  Product的userId
* @returns {Promise<Model>}
*/
  static async getProductDetail(id) {
    return await Product.findOne({
      where: {
        id,
      },
    })
  }

  static async getProductDetailByCompanyId(companyId) {
    return await Product.findOne({
      where: {
        companyId,
      },
    })
  }
  static async updateProduct(companyId, month, data) {
    await Product.update({
      ...data
    }, {
      where: {
        companyId,
        month
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async deleteProduct(id) {
    await Product.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async getProjectByCompanyIdForMonth(companyId, month) {
    let sql = `select * from Product where companyId='${companyId}' and month='${month}' and isValid=1`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  //60, 61 流量套餐，62 流量包
  static async getProjectPackageByCompanyId(companyId) {
    let sql = `select * from Product where companyId='${companyId}' and productType=62 and isValid=1`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  //批量根据订单号查询查找有效的产品
  static async batchQueryProductByOrderId(ids) {
    return Product.findAll({
      where: {
        orderId: ids,
        isValid: 1
      },
      attributes: ['orderId', 'month', 'usedFlowCount', 'maxFlowCount', 'companyId', 'productType']
    });
  }
  // 批量增加数据
  static async batchCreateProduct(data) {
    return await Product.bulkCreate(data)
  }

  // 批量更新数据
  static async batchUpdateProductByOrderId(ids, data) {
    return await Product.update({
      ...data
    }, {
      where: {
        orderId: ids
      },
      fields: Object.keys(data)
    })
  }
}

const Company = Sequelize.import('../schema/company');
Company.sync({force: false});


class CompanyModel {
  /**
   * 创建Company信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createCompany(data) {
    return await Company.create({
      ...data
    })
  }
  /**
   * 根据userId, 获取Company详情数据
   * @param userId  Company的userId
   * @returns {Promise<Model>}
   */
  static async getCompanyDetailByOwnerId(userId) {
    return await Company.findOne({
      where: {
        ownerId: userId,
      },
    })
  }
  /**
   * 根据companyId, 获取Company详情数据
   * @param userId  Company的userId
   * @returns {Promise<Model>}
   */
  static async getCompanyInfo(companyId) {
    return await Company.findOne({
      where: {
        companyId,
      },
    })
  }
  static async getCompanyList() {
    const sql = "select companyId, companyName from Company"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }

  static async updateCompany(companyId, data) {
    await Company.update({
      ...data
    }, {
      where: {
        companyId
      },
      fields: Object.keys(data)
    })
    return true
  }

}

const User = Sequelize.import('../schema/user');
User.sync({force: false});


class UserModel {
  /**
   * 创建User信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createUser(data) {
    return await User.create({
      ...data
    })
  }

  /**
   * 更新User数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateUser(id, data) {
    await User.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 重置密码
   * @returns {Promise.<boolean>}
   */
  static async resetPwd(emailName, data) {
    await User.update({
      ...data
    }, {
      where: {
        emailName
      },
      fields: Object.keys(data)
    })
    return true
  }
  /**
   * 获取User列表
   * @returns {Promise<*>}
   */
  static async getUserList() {
    let sql = "select id, userId, nickname from User where registerStatus='1'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取管理员账号
   * @returns {Promise<*>}
   */
  static async getUserForAdmin(companyId) {
    const companyIdSql = companyId ? ` and companyId='${companyId}' ` : ""
    let sql = "select id, companyId, userId, userType, phone, nickname, emailName, avatar, groupId, registerStatus, createdAt, updatedAt from User where userType='admin' or userType='superAdmin' " + companyIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

   /**
   * 获取User列表
   * @returns {Promise<*>}
   */
  static async getUserListByAdmin(registerStatus, companyId) {
    let companyIdSql = ` where companyId='${companyId}'`
    let registerStatusSql = ""
    switch(registerStatus) {
      case 0:
      case 1:
          registerStatusSql = ` and registerStatus=${registerStatus} `
        break
      default:
        break
    }

    let sql = "select id, userId, userType, nickname, emailName, avatar, registerStatus, groupId, createdAt, updatedAt from User " + companyIdSql + registerStatusSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getUserInfo(userId) {
    let sql = `select companyId, userId, userType, phone, nickname, emailName, avatar from User where userId='${userId}'`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getUserListByMembers(members) {
    let sql = "select id, companyId, userId, userType, phone, nickname, emailName, avatar, groupId, registerStatus, createdAt, updatedAt  from User where FIND_IN_SET(userId, '" + members + "')"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getUserListByViewers(viewers) {
    let sql = "select id, companyId, userId, userType, phone, nickname, emailName, avatar, groupId, registerStatus, createdAt, updatedAt from User where FIND_IN_SET(userId, '" + viewers + "')"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getAllUserInfoForSimple() {
    let sql = "select id, userId, nickname, emailName, avatar from User where registerStatus='1'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getUsersByUserIds(userIds) {
    let userIdStr = ''
    userIds.forEach((userId, index) => {
      if (index === userIds.length - 1) {
        userIdStr += `'${userId}'`
      } else {
        userIdStr += `'${userId}',`
      }
    })
    const userSql = userIdStr.length ? ` where userId in (${userIdStr}) ` : ''
    let sql = `select userId, nickName, emailName, phone, avatar from User ${userSql}`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 激活用户
   */
  static async activeRegisterMember(userId) {
    const data = {registerStatus: 1}
    await User.update({
      ...data
    }, {
      where: {
        userId
      },
      fields: Object.keys(data)
    })
    return true
  }
  
  /**
   * 获取User详情数据
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getUserDetail(id) {
    return await User.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 根据属性获取User详情数据
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getUserDetailByEmail(emailName) {
    return await User.findOne({
      where: {
        emailName,
      },
    })
  }

  /**
   * 根据用户名密码
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getUserForPwd(data) {
    return await User.findOne({
      where: {
        ...data
      },
    })
  }

  /**
   * 根据类型获取管理员邮箱
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getAdminByType(userType) {
    return await User.findOne({
      where: {
        userType
      },
    })
  }
  /**
   * 检查账号是否已经存在
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async checkUserAccount(email) {
    return await User.findOne({
      where: {
        emailName: email
      },
    })
  }
  /**
   * 根据手机号或者邮箱，检查账号是否已经存在
   * @param phone, email
   * @returns {Promise<Model>}
   */
  static async checkUserByPhoneOrEmail(phone, email) {
    // let sql = "select count(id) as count from User where userType='superAdmin'"
    let whereSql = ""
    if (phone && email) {
      whereSql = `phone='${phone}' or emailName='${email}'`
    } else if (phone) {
      whereSql = `phone='${phone}'`
    } else if (email) {
      whereSql = `emailName='${email}'`
    }
    let sql = `select id, companyId, userId, userType, phone, nickname, emailName, avatar, groupId, registerStatus, createdAt, updatedAt from User where ${whereSql}`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 判断是否是管理员账号
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async isAdminAccount(email, userType) {
    return await User.findOne({
      where: {
        emailName: email,
        userType
      },
    })
  }
  /**
   * 删除User
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteUser(id) {
    await User.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async checkAdminAccount() {
    let sql = "select count(id) as count from User where userType='superAdmin'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除User
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteUserByUserId(userId) {
    await User.destroy({
      where: {
        userId,
      }
    })
    return true
  }

  /**
   * 将成员设置为管理员
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async setAdmin(userId, setType) {
    let data = {userType: 'admin'}
    if (setType === 'a') {
      data = {userType: 'admin'}
    } else if (setType === 'c') {
      data = {userType: 'customer'}
    }
    await User.update({
      ...data
    }, {
      where: {
        userId
      },
      fields: Object.keys(data)
    })
    return true
  }
  /**
   * 将超级管理员移交给他人
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async resetSuperAdmin(userId, targetUserId) {
    // 设置超级管理员
    const targetData = {userType: 'superAdmin'}
    await User.update({
      ...targetData
    }, {
      where: {
        userId: targetUserId
      },
      fields: Object.keys(targetData)
    })
    // 移除当前用户超级管理员的角色
    const data = {userType: 'customer'}
    await User.update({
      ...data
    }, {
      where: {
        userId
      },
      fields: Object.keys(data)
    })
    return true
  }
}
module.exports = {UserTokenModel,ApplicationConfigModel,CommonTableModel,ConfigModel,FlowDataInfoByHourModel,MessageModel,FlowDataInfoByDayModel,TeamModel,ProductModel,CompanyModel,UserModel}