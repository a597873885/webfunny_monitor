const Router = require('koa-router')
const { Common } = require("../controllers/controllers.js")
const { createRoutes } = require("./routes");
const { createRoutesFail } = require("./routesFail");
const { customerWarningCallback } = require("../interceptor/customerWarning");
const timerTask = require("./timer");
global.monitorInfo = {
    registerEmailCode: {},
    userIdArray: [],
    debugInfoArray: [],
    debugTimer: null,
    debugInfo: {},
    logServerStatus: true, // 日志服务状态
    waitCounts: 40,   // 日志等待上报的时间间隔，可以调整日志上报的密度（40代表8s上报一次）
    logCountInMinute: 0, // 每分钟的日志量
    logCountInMinuteList: [], // 每分钟日志量数组
    errorLogListForLast200: [],  // 存放最近200条报错日志
}
global.tableTimeStamp = new Date().Format("yyyyMMdd")
global.web_monitor_version = "1.0.0"
global.BUILD_ENV = process.argv[3]

const router = new Router({
    prefix: '/server'
})


// 激活码校验
Common.checkPurchase(() => {
    createRoutes(router)
    // 启动定时任务
    timerTask(customerWarningCallback)
}, () => {
    createRoutesFail(router)
    Common.consoleInfo()
})

module.exports = router