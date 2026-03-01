const Router = require('koa-router')
const { Common } = require("../controllers/controllers")
const { createRouter } = require("./routes");
const timerTask = require("./timer")
const NodeClickHouse = require('../config/node_clickhouse')
const Config = new NodeClickHouse("../schema/config")


global.fileInfo = {
    invalidProjectIdForCloud: [],  // 流量用尽的项目（云服务开启后生效）
    // unLimitCountForProduct: false,
    // purchaseCodeType: 1,
    // purchaseCodeProjectCount: 3,
    registerEmailCode: {},
    registerEmailCodeCheckError: {},
    webMonitorIdList: [],
    userIdArray: [],
    debugOnlineForUserIdArray: {connect: [], vconsole: [], videos: []},      // 存放每个用户的连线状态，vconsole开启状态，videos开启状态
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
    prefix: '/wfFile'
})

// ====== ClickHouse 集群状态监控接口 ======
const { client } = require('../config/db')

// 获取详细集群状态
router.get('/cluster/status', async (ctx) => {
    try {
        const status = client.getClusterStatus()
        ctx.body = {
            code: 200,
            msg: 'success',
            data: status
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            msg: error.message,
            data: null
        }
    }
})

// 获取简化健康状态
router.get('/cluster/health', async (ctx) => {
    try {
        const status = client.getClusterStatus()
        ctx.body = {
            code: 200,
            msg: 'success',
            data: {
                healthy: status.cluster.isHealthy,
                totalNodes: status.cluster.totalNodes,
                healthyNodes: status.cluster.healthyNodes,
                mode: client.isCluster ? 'cluster' : 'single'
            }
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            msg: error.message,
            data: null
        }
    }
})

const handleResult = () => {
    createRouter(router)
    // 启动定时任务, 如果是slave模式，则不启动定时器
    timerTask()

    // 3秒后开始消费消息
    setTimeout(() => {
        Common.startReceiveMsg()
    }, 3000)
}

Config.createTable().then(() => {
    handleResult()
})

createRouter(router)


module.exports = router
