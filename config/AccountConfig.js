const CreateConfig = require("./createConfig")
const { saveDays } = require("../bin/saveDays")
/**
 * 这是用户的私人配置文件。
 * @param purchaseCode 注册码。
 * @param sourceEmail 这是你的邮箱地址，用于发送警报信息。
 * @param sourcePassword 这是你邮箱的密码，用于发送警报信息，所以需要你的邮箱地址和密码。
 * 暂时仅支持163邮箱
 */
const accountInfo = {
    purchaseCode: CreateConfig.purchaseCode, // 激活码
    messageQueue: CreateConfig.messageQueue, // 消息队列默认关闭，需手动开启。 前提：1. 安装RabbitMq; 2. 需创建订阅版激活码
    ////////////////////////////////

    sourceEmail: CreateConfig.email, // 163邮箱
    sourcePassword: CreateConfig.emailPassword, // 163邮箱密码

    ///////////////////////////////

    targetEmail: CreateConfig.email, // 目标邮箱（接收警报的邮箱）

    saveDays: saveDays, // 日志保存周期

    showPurchaseList: 1
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