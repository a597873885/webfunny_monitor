const { accountInfo } = require("../config/AccountConfig")
// 流量数据类型
const FLOW_TYPE = {
    TOTAL_FLOW_COUNT: "total_flow_count", // 总流量
    PV_FLOW_COUNT: "pv_flow_count", // PV流量
    BEHAVIOR_FLOW_COUNT: "behavior_flow_count", // 行为流量
    HTTP_FLOW_COUNT: "http_flow_count", // 接口流量(请求，返回，错误)
    ERROR_FLOW_COUNT: "error_flow_count", // 错误流量(代码错误，静态资源错误)
    PERF_FLOW_COUNT: "perf_flow_count", // 性能流量(页面加载)
    OTHER_FLOW_COUNT: "other_flow_count", // 其他流量(自定义日志)
    FLOW_PACKAGE_COUNT: "flow_package_count", // 流量包
}

const USER_INFO = {
    USER_TYPE_ADMIN: "admin", // 管理员类型
}

const PROJECT_INFO = {
    PROJECT_VERSION: "1.0.3",
    MONITOR_VERSION: "1.0.0"
}

const ALARM_INDEX_ENUM = {
    pvCount: "访问量",
    uvCount: "访问人数",
    healthScore: "健康分",
    jsErrorCount: "代码错误量",
    jsErrorPer: "代码错误率",
    consoleErrorCount: "自定义错误量",
    consoleErrorPer: "自定义错误率",
    resourceErrorCount: "静态资源错误量",
    resourceErrorPer: "静态资源错误率",
    httpErrorCount: "接口错误量",
    httpErrorPer: "接口错误率"
}

global.MONITOR_PUBLISH_PREFIX = "/wfMonitor"
global.EVENT_PUBLISH_PREFIX = "/wfEvent"
const PROJECT_API = {
    MONITOR_PROJECT_SIMPLE_LIST_BY_WEBMONITOR_IDS: `${global.MONITOR_PUBLISH_PREFIX}/projectSimpleListByWebmonitorIds`,
    MONITOR_ADD_VIEWERS: `${global.MONITOR_PUBLISH_PREFIX}/addViewers`,
    MONITOR_BASE_INFO: `${global.MONITOR_PUBLISH_PREFIX}/monitorBaseInfo`,
    FORBIDDEN_PROJECT: `${global.MONITOR_PUBLISH_PREFIX}/forbiddenProject`,
    DELETE_PROJECT: `${global.MONITOR_PUBLISH_PREFIX}/deleteProject`,
    CHECK_ALARM_RESULT: `${global.MONITOR_PUBLISH_PREFIX}/checkAlarmResult`,
    GET_LOG_COUNT_INFO_BY_DAY: `${global.MONITOR_PUBLISH_PREFIX}/getLogCountInfoByDay`,
    GET_PROJECT_LIST_ALL: `${global.MONITOR_PUBLISH_PREFIX}/project/list/all`,
    GET_MONITOR_PROJECT_COUNT_BY_COMPANY_ID: `${global.MONITOR_PUBLISH_PREFIX}/getProjectCountByCompanyId`,

    EVENT_PROJECT_SIMPLE_LIST_BY_WEBMONITOR_IDS: `${global.EVENT_PUBLISH_PREFIX}/buryPointProject/projectSimpleListByWebmonitorIds`,
    EVENT_ADD_VIEWERS: `${global.EVENT_PUBLISH_PREFIX}/buryPointProject/addViewers`,
    GET_EVENT_LOG_COUNT_INFO_BY_DAY: `${global.EVENT_PUBLISH_PREFIX}/getLogCountInfoByDay`,
    GET_EVENT_SYS_INFO: `${global.EVENT_PUBLISH_PREFIX}/sysInfo`,
    GET_EVENT_PROJECT_COUNT_BY_COMPANY_ID: `${global.EVENT_PUBLISH_PREFIX}/buryPointProject/getProjectCountByCompanyId`,

    SAAS_PRODUCT_INFO: "/webfunny_manage/api/productInfo/get",
}
const WEBFUNNY_CONFIG_URI = "http://localhost:8012" // "http://www.webfunny.cn"

const START_YEAR = 2024

const PRODUCT_INFO_URI = '139.224.102.107:8030'

const LOCAL_SERVER = `http://127.0.0.1:${accountInfo.localServerPort}`
const MONITOR_LOCAL_SERVER = `http://127.0.0.1:${accountInfo.localServerPort}`
const EVENT_LOCAL_SERVER = `http://127.0.0.1:${accountInfo.localServerPort}`

module.exports = {
    FLOW_TYPE,
    USER_INFO,
    PROJECT_INFO,
    ALARM_INDEX_ENUM,
    PROJECT_API,
    WEBFUNNY_CONFIG_URI,
    START_YEAR,
    PRODUCT_INFO_URI,
    LOCAL_SERVER,
    MONITOR_LOCAL_SERVER,
    EVENT_LOCAL_SERVER
}