const Router = require('koa-router')
const Utils = require('../util/utils');
const { createRouter } = require("./routes");
const timerTask = require("./timer");


global.centerInfo = {
    ssoForFeiShu: {},
    purchaseCodeProjectCount: 3,
    registerEmailCode: {},
    registerEmailCodeCheckError: {},
    webMonitorIdList: [],
    userIdArray: [],
    tempDebugInfoArray: {},
    debugInfoArray: [],
    debugInfoTimer: {},
    debugTimer: null,
    debugInfo: {},
    debugClearLocalInfo: [], // 记录将要清理本地缓存的userId
    logServerStatus: true, // 日志服务状态
    cacheWebMonitorIdList: [], // 开启上报服务的项目列表
    waitCounts: 40,   // 日志等待上报的时间间隔，可以调整日志上报的密度（40代表8s上报一次）
    logCountInMinute: 0, // 每分钟的日志量
    logCountInMinuteList: [], // 每分钟日志量数组
    errorLogListForLast200: [],  // 存放最近200条报错日志
    purchaseCodeValid: false,
    warningMessageList: [],
    loginValidateCode: "",
    projectConfigs: {}, // 携带每个项目的配置信息
    alarmInfoList: {}, // 警报信息暂存
    logInfoQueue: {}, // 存放日志队列的对象
}
global.tableTimeStamp = new Date().Format("yyyyMMdd")
global.web_monitor_version = "1.0.0"
global.BUILD_ENV = process.argv[3]

const router = new Router({
    prefix: '/wfCenter'
})

createRouter(router)
timerTask()

module.exports = router
