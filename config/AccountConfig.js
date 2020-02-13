/**
 * 这是用户的私人配置文件。
 * @param purchaseCode 注册码。
 * @param sourceEmail 这是你的邮箱地址，用于发送警报信息。
 * @param sourcePassword 这是你邮箱的密码，用于发送警报信息，所以需要你的邮箱地址和密码。
 * 暂时仅支持163邮箱
 */
const accountInfo = {
    purchaseCode: "AAAABBBBCCCCDDDD", // 激活码
    messageQueue: false, // 消息队列默认关闭，需手动开启。 前提：1. 安装RabbitMq; 2. 需创建订阅版激活码
    ////////////////////////////////

    sourceEmail: "source@163.com", // 只支持163邮箱, 这个是用来发送警报邮件的，需要填写，否则无法发送警报
    sourcePassword: "sourcePassword", // 163邮箱密码

    ///////////////////////////////

    targetEmail: "targetEmail" // 目标邮箱（接收警报的邮箱, 可以和sourceEmail相同）
}

/**
 * 这是警报规则配置
 * 这里可以按照你自己项目的实际情况进行设置
 */
const warningSetting = {
    minJsErrorCount: 50,           // js错误：最小警报数量, 小于该值，不触发警报
    jsErrorDividedBySevenDayAgo: 2,  // 今天的数值除以7天前的数值，倍数低于这个值的，不触发警报

    minConsoleErrorCount: 50,           // 自定义错误：最小警报数量, 小于该值，不触发警报
    consoleErrorDividedBySevenDayAgo: 2,  // 今天的数值除以7天前的数值，倍数低于这个值的，不触发警报

    minResourceErrorCount: 50,           // 静态资源加载错误：最小警报数量, 小于该值，不触发警报
    resourceErrorDividedBySevenDayAgo: 2,  // 今天的数值除以7天前的数值，倍数低于这个值的，不触发警报

    minHttpErrorCount: 50,           // 接口请求错误：最小警报数量, 小于该值，不触发警报
    HttpErrorDividedBySevenDayAgo: 2,  // 今天的数值除以7天前的数值，倍数低于这个值的，不触发警报
}
module.exports = {
    accountInfo,
    warningSetting
}