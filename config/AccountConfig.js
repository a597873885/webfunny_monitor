const { saveDays } = require("../bin/saveDays")
const stayTimeScope = require("../bin/stayTimeScope")
const mysqlConfig = require("../bin/mysqlConfig")
const { purchaseCode } = require("../bin/purchaseCode")
const { messageQueue } = require("../bin/messageQueue")
const httpReqRes = require("../bin/httpReqRes")
const { useCusEmailSys, emailUser, emailPassword } = require("../bin/useCusEmailSys")
const { localServerDomain, localAssetsDomain, localServerPort, localAssetsPort } = require("../bin/domain")

const accountInfo = {

    localServerDomain,   // 日志服务域名 
    localServerPort,     // 日志服务端口号

    localAssetsDomain,   // 数据可视化服务域名
    localAssetsPort,     // 可视化系统端口号

    purchaseCode,                   // 激活码
    messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;

    saveDays,                       // 日志保存周期

    stayTimeScope,                  // 用户停留时间范围

    mysqlConfig,

    useCusEmailSys,                 // 是否开启自定义邮件系统
    emailUser,
    emailPassword,

    httpReqRes,                     // 接口内容长度限制
}

module.exports = {
    accountInfo
}