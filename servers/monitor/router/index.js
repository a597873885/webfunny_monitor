const Router = require('koa-router')
const { Common } = require("../controllers/controllers.js")
const NodeClickHouse = require('../config/node_clickhouse')
const { createRouter } = require("./routes");
const { customerWarningCallback } = require("../../../interceptor/customerWarning")
const timerTask = require("./timer");
const Config = new NodeClickHouse("../schema/config")


global.monitorInfo = {
    invalidProjectIdForCloud: [],
    unLimitCountForFreeProduct: false,
    purchaseCodeType: 1,
    purchaseCodeProjectCount: 3,
    registerEmailCode: {},
    registerEmailCodeCheckError: {},
    webMonitorIdList: [],
    userIdArray: [],
    debugOnlineForUserIdArray: {connect: [], vconsole: [], videos: []},
    tempDebugInfoArray: {},
    debugInfoArray: [],
    debugInfoTimer: {},
    debugTimer: null,
    debugInfo: {},
    debugClearLocalInfo: [],
    logServerStatus: true,
    cacheWebMonitorIdList: [],
    waitCounts: 40,
    logCountInMinute: 0,
    logCountInMinuteList: [],
    projectLogCountList: {},
    aliveCountForProjectIn5Minutes: [], // 内存中记录每个项目5分钟内的活跃量
    errorLogListForLast200: [],  // 存放最近200条报错日志
    purchaseCodeValid: false,
    warningMessageList: [],
    loginValidateCode: "",
    projectConfigs: {}, // 携带每个项目的配置信息
    alarmInfoList: {}, // 警报信息暂存
    logInfoQueue: {}, // 存放日志队列的对象
    realTimeLogQueue: {}, // 实时日志队列
    segmentQueue: [], // segment日志队列
    tokenListInMemory: {}, //内存中的token列表 
    calculateDataInMemory: [], //流式计算相关信息
    calculateFlowData: {}, // 存储流量数据
    monitorSecretList: [], // 监控签名秘钥列表
    exportRandomNumber: {}  // 下载时需要用到的随机数
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
