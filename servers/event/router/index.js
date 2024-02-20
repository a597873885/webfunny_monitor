const Router = require('koa-router')
const { Common } = require("../controllers/controllers")
const { createRouter } = require("./routes");
const timerTask = require("./timer")
const NodeClickHouse = require('../config/node_clickhouse')
const Config = new NodeClickHouse("../schema/config")


global.eventInfo = {
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
    debugClearLocalInfo: [], // 记录将要清理本地缓存的userId
    logServerStatus: true, // 日志服务状态
    stopWebMonitorIdList: [], // 停止上报服务的项目列表
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
    tokenListInMemory: {}, //内存中的token列表 
    calculateFlowData: {}, // 存储流量数据
    pointAndFields: [], // 存放点位下的字段信息
    points: [], // 存放点位信息
    funnelCardAndPointRelations: {}, // 存放漏斗卡片关系数据
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
