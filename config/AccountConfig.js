require('dotenv').config() // dotenv autoload
const { saveDays } = require("../bin/saveDays")
const stayTimeScope = require("../bin/stayTimeScope")
const mysqlConfig = require("../bin/mysqlConfig")
const { purchaseCode } = require("../bin/purchaseCode")
const { messageQueue } = require("../bin/messageQueue")
const { openMonitor } = require("../bin/sysMonitor")
const httpReqRes = require("../bin/httpReqRes")
const { useCusEmailSys, emailUser, emailPassword } = require("../bin/useCusEmailSys")
const { localServerDomain, localAssetsDomain, localServerPort, localAssetsPort, mainDomain } = require("../bin/domain")

const { getenv, decodeUri } = require("../util/utils")

const accountInfo = {

    localServerDomain: getenv('LOCAL_SERVER_DOMAIN', localServerDomain),   // 日志服务域名
    localServerPort: getenv('LOCAL_SERVER_PORT', localServerPort),     // 日志服务端口号

    localAssetsDomain:  getenv('LOCAL_ASSETS_DOMAIN', localAssetsDomain),   // 数据可视化服务域名
    localAssetsPort: getenv('LOCAL_ASSETS_PORT', localAssetsPort),     // 可视化系统端口号

    mainDomain: getenv('MAIN_DOMAIN', mainDomain),  // 主域名

    purchaseCode: getenv('PURCHASE_CODE', purchaseCode),                   // 激活码
    messageQueue: getenv('MESSAGE_QUEUE', messageQueue),                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;
    openMonitor: getenv('OPEN_MONITOR', openMonitor),                    // 开启系统监控

    saveDays: getenv('SAVE_DAYS', saveDays),                       // 日志保存周期

    stayTimeScope: {
      min: getenv('STAY_TIME_SCOPE_MIN', stayTimeScope.min),
      max: getenv('STAY_TIME_SCOPE_MAX', stayTimeScope.max),
    },                  // 用户停留时间范围

    mysqlConfig: {
      write: {
        ip: getenv('MYSQL_HOST', mysqlConfig.write.ip),
        port: getenv('MYSQL_PORT', mysqlConfig.write.port),
        dataBaseName: getenv('MYSQL_DBNAME', mysqlConfig.write.dataBaseName),
        userName: getenv('MYSQL_USER', mysqlConfig.write.userName),
        password: getenv('MYSQL_PASS', mysqlConfig.write.password)
      },
      read: !!getenv('MYSQL_READ') ? getenv('MYSQL_READ').split(',').map(uri => decodeUri(uri)): [],
    },

    useCusEmailSys: !!getenv('USE_CUS_EMAIL_SYS', useCusEmailSys),                 // 是否开启自定义邮件系统
    emailUser: getenv('EMAIL_USER', emailUser),
    emailPassword: getenv('EMAIL_PASS', emailPassword),

    httpReqRes: {
      requestTextLength: getenv('REQUEST_TEXT_LENGTH', httpReqRes.requestTextLength),
      responseTextLength: getenv('RESPONSE_TEXT_LENGTH', httpReqRes.responseTextLength),
    },                     // 接口内容长度限制
}

module.exports = {
    accountInfo
}
