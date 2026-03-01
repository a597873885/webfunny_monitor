const Router = require('koa-router')
const { Common } = require("../controllers/controllers.js")
const NodeClickHouse = require('../config/node_clickhouse')
const { createRouter } = require("./routes");
const { customerWarningCallback } = require("../../../interceptor/customerWarning")
const timerTask = require("./timer");
const Config = new NodeClickHouse("../schema/config")


global.monitorInfo = {
    invalidProjectIdForCloud: [],
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
    aliveCountForProjectIn5Minutes: [],
    errorLogListForLast200: [],  // 存放最近200条报错日志
    purchaseCodeValid: false,
    warningMessageList: [],
    loginValidateCode: "",
    projectConfigs: {},
    alarmInfoList: {},
    logInfoQueue: {},
    realTimeLogQueue: {},
    segmentQueue: [],
    tokenListInMemory: {},
    calculateDataInMemory: [],
    calculateFlowData: {},
    monitorSecretList: [],
    exportRandomNumber: {},  // 下载时需要用到的随机数
    simpleProjectListInMemory: {}, // 内存中存放的简单项目列表
    projectListForProjectCode: "", // 根据项目编码存放的项目列表
    projectCompanyMap: {},
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
