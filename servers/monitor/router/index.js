const Router = require('koa-router')
const { Common } = require("../controllers/controllers.js")
const NodeClickHouse = require('../config/node_clickhouse')
const { createRouter } = require("./routes");
const { customerWarningCallback } = require("../../../interceptor/customerWarning")
const timerTask = require("./timer");
const Config = new NodeClickHouse("../schema/config")

global.monitorInfo = {
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
    projectLogCountList: {}, // 每个项目当天的日志总量
    aliveCountForProjectIn5Minutes: [], // 内存中记录每个项目5分钟内的活跃量
    errorLogListForLast200: [],  // 存放最近200条报错日志
    purchaseCodeValid: false,
    warningMessageList: [],
    loginValidateCode: "",
    projectConfigs: {}, // 携带每个项目的配置信息
    alarmInfoList: {}, // 警报信息暂存
    logInfoQueue: {}, // 存放日志队列的对象
    segmentQueue: [], // segment日志队列
    tokenListInMemory: {}, //内存中的token列表 
    calculateDataInMemory: [], //流式计算相关信息
    calculateFlowData: {}, // 存储流量数据
}
global.tableTimeStamp = new Date().Format("yyyyMMdd")
global.web_monitor_version = "1.0.0"
global.BUILD_ENV = process.argv[3]

const router = new Router({
    prefix: '/wfMonitor'
})

const handleResult = () => {
    createRouter(router)
    // 启动定时任务, 如果是slave模式，则不启动定时器
    timerTask(customerWarningCallback, global.serverType)

    // 3秒后开始消费消息
    setTimeout(() => {
        Common.startReceiveMsg()
    }, 3000)
}

Config.createTable().then(() => {
    Common.checkPurchase(() => {
        handleResult()
    }, () => {
        handleResult()
    })
})

createRouter(router)


module.exports = router
