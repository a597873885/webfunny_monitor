const { saveDays } = require("../bin/saveDays")
const mysqlConfig = require("../bin/mysqlConfig")
const { purchaseCode } = require("../bin/purchaseCode")
const { messageQueue } = require("../bin/messageQueue")
const { webfunnyNeedLogin } = require("../bin/webfunnyNeedLogin")
const { localServerDomain, localAssetsDomain, localServerPort, localAssetsPort } = require("../bin/domain")
/**
 * 这是用户的私人配置文件。
 * @param purchaseCode 注册码。
 * @param sourceEmail 这是你的邮箱地址，用于发送警报信息。
 * @param sourcePassword 这是你邮箱的密码，用于发送警报信息，所以需要你的邮箱地址和密码。
 * 暂时仅支持163邮箱
 */
const accountInfo = {

    localServerDomain,   // 日志服务域名 
    localServerPort,     // 日志服务端口号

    localAssetsDomain,   // 数据可视化服务域名
    localAssetsPort,     // 可视化系统端口号

    purchaseCode,                   // 激活码
    messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;

    saveDays,                       // 日志保存周期
    webfunnyNeedLogin,              // 前端是否验证登录状态
                                           // 开启登录验证后，只能看到自己创建的项目。
                                           // 不开启登录验证，可以看到所有的项目列表。
    mysqlConfig
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