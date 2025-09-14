const Router = require('koa-router')
const { Common } = require("../controllers/controllers")
const { createRouter } = require("./routes");
const timerTask = require("./timer")
const NodeClickHouse = require('../config/node_clickhouse')
const Config = new NodeClickHouse("../schema/config")

global.EventCacheDataList = {}
global.eventInfo = {
    invalidProjectIdForCloud: [],
    unLimitCountForFreeProduct: false,
    
    purchaseCodeCardCount: 10,
    webfunnyTokenList: [],
    registerEmailCode: {},
    registerEmailCodeCheckError: {},
    webMonitorIdList: [],
    userIdArray: [],
    tempDebugInfoArray: {},
    debugInfoArray: [],
    debugInfoTimer: {},
    debugTimer: null,
    debugInfo: {},
    debugClearLocalInfo: [],
    logServerStatus: true,
    stopWebMonitorIdList: [],
    waitCounts: 40,
    logCountInMinute: 0,
    logCountInMinuteList: [],
    errorLogListForLast200: [],
    purchaseCodeValid: false,
    warningMessageList: [],
    loginValidateCode: "",
    projectConfigs: {},
    alarmInfoList: {},
    logInfoQueue: {},
    relationQueue: {},
    tokenListInMemory: {},
    calculateFlowData: {},
    pointAndFields: [],
    points: [],
    funnelCardAndPointRelations: {},
    eventSecretList: [],
    exportRandomNumber: {}
}
global.tableTimeStamp = new Date().Format("yyyyMMdd")
global.web_monitor_version = "1.0.0"
global.BUILD_ENV = process.argv[3]

const router = new Router({
    prefix: '/wfEvent'
})

const handleResult = () => {
    createRouter(router)
    // 启动定时任务, 如果是slave模式，则不启动定时器
    timerTask(global.serverType)

    // 3秒后开始消费消息
    // setTimeout(() => {
    //     Common.startReceiveMsg()
    // }, 3000)
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
