const { saveDays } = require("../bin/saveDays")
const stayTimeScope = require("../bin/stayTimeScope")
const mysqlConfig = require("../bin/mysqlConfig")
const { purchaseCode } = require("../bin/purchaseCode")
const { messageQueue } = require("../bin/messageQueue")
const { useCusEmailSys } = require("../bin/useCusEmailSys")
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
}

/**
 * 这是警报规则
 */
const warningSetting = {
    minJsErrorCount: 300,           // js错误：最小警报数量, 小于该值，不触发警报
    jsErrorDividedBySevenDayAgo: 2,  // 今天的数值除以7天前的数值，倍数低于这个值的，不触发警报

    minConsoleErrorCount: 300,           // 自定义错误：最小警报数量, 小于该值，不触发警报
    consoleErrorDividedBySevenDayAgo: 2,  // 今天的数值除以7天前的数值，倍数低于这个值的，不触发警报

    minResourceErrorCount: 300,           // 静态资源加载错误：最小警报数量, 小于该值，不触发警报
    resourceErrorDividedBySevenDayAgo: 2,  // 今天的数值除以7天前的数值，倍数低于这个值的，不触发警报

    minHttpErrorCount: 150,           // 接口请求错误：最小警报数量, 小于该值，不触发警报
    HttpErrorDividedBySevenDayAgo: 2,  // 今天的数值除以7天前的数值，倍数低于这个值的，不触发警报
}
module.exports = {
    accountInfo,
    warningSetting
}