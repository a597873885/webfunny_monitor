const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig

const UPLOAD_TYPE = {

    LOCATION_POINT_TYPE: "l_p_", // 埋点类型前缀
    LOCATION_UV_TYPE: "l_u_", // 埋点UV类型前缀

}

const USER_INFO = {
    USER_TYPE_ADMIN: "admin", // 管理员类型
    USER_TYPE_SUPERADMIN: "superAdmin", // 超级管理员类型
}

const PROJECT_INFO = {
    PROJECT_VERSION: "1.0.3",
    MONITOR_VERSION: "1.0.0"
}

const MANAGE_API = {
    GET_USER_TOKEN_FROM_NET_WORK_BY_TOKEN: `${accountInfo.centerServerDomain}/wfCenter/getUserTokenFromNetworkByToken`,
    GET_TEAMS: `${accountInfo.centerServerDomain}/wfCenter/getTeams`,
    GET_TEAM_DETAIL: `${accountInfo.centerServerDomain}/wfCenter/getTeamDetail`,
    UPDATE_TEAM: `${accountInfo.centerServerDomain}/wfCenter/updateTeam`,
    GET_USERS_BY_USERIDS: `${accountInfo.centerServerDomain}/wfCenter/getUsersByUserIds`,
    GET_FUNCTION_LIST_FROM_MEMORY: `http://${accountInfo.centerServerDomain}/wfCenter/getFunctionListFromMemory`,
}

const CENTER_API = {
    GET_USER_INFO: "/wfCenter/getUserInfo",
    CREATE_FLOW_DATA: "/wfCenter/createFlowData",
    CREATE_NOTIFICATION_MESSAGE: "/wfCenter/notification/createMessage",
}

// 流量数据类型
const FLOW_TYPE = {
    TOTAL_FLOW_COUNT: "total_flow_count", // 总流量
    CARD_FLOW_COUNT: "card_flow_count", // 卡片
    FIELD_FLOW_COUNT: "field_flow_count", // 字段
    POINT_FLOW_COUNT: "point_flow_count", // 点位
    SDK_FLOW_COUNT: "sdk_flow_count", // sdk
    TEMPLATE_FLOW_COUNT: "template_flow_count", // 模板
    ALARM_FLOW_COUNT: "alarm_flow_count", // 警报
}

// 防注入参数
const DANGER_SQL_PARAMS = ["update ", "select ", "union ", "and ", "or ", "from ", "insert ",
    "delete ", "database ", "drop ", "truncate ", "create ", "like "]

//留存日期格式
const KEEP_TIME_FORMAT_TYPE = {
    FOUR_ITEMS: ["当日","次日","第7日","第30日"], // 
    SECOND_ITEMS: ["当日","次日"], //
    SEVEN_ITEMS: ["当日","次日","第2日","第3日","第4日","第5日","第6日","第7日"], //
    THIRTY_ITEMS: ["当日","次日,第2日,第3日,第4日,第5日,第6日,第7日",
    "第8日","第9日","第10日","第11日","第12日","第13日","第14日",
    "第15日","第16日","第17日","第18日","第19日","第20日","第21日","第22日"
    ,"第23日","第24日","第25日","第26日","第27日","第28日","第29日","第30日"] //
}
//流水日期格式
const LOSS_TIME_FORMAT_TYPE = {
    FOUR_ITEMS: ["次日","第7日","第30日"], // 
    SECOND_ITEMS: ["次日"], //
    SEVEN_ITEMS: ["次日","第2日","第3日","第4日","第5日","第6日","第7日"], //
    THIRTY_ITEMS: ["次日,第2日,第3日,第4日,第5日,第6日,第7日",
    "第8日","第9日","第10日","第11日","第12日","第13日","第14日",
    "第15日","第16日","第17日","第18日","第19日","第20日","第21日","第22日"
    ,"第23日","第24日","第25日","第26日","第27日","第28日","第29日","第30日"]
}

// 留存计算的日期列表
const RETENTION_CALC_INFO = {
    defaultFourItems: [0, 1, 7, 14, 30],
    secondItems: [0, 1],
    sevenItems: [0, 1, 2, 3, 4, 5, 6, 7],
    fourteenItems: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14
    ],
    thirtyItems: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30
    ],
}
// 留存计算的日期列表
const WEEK_NAME = ['日', '一', '二', '三', '四', '五', '六']

const LOCAL_SERVER = `http://127.0.0.1:${accountInfo.centerServerPort}`

//卡片分析数据按时间归类
const CARD_STATISTIC_DATE_TYPE = {
    day: "toDate", // 
    week: "toStartOfWeek", // 
    month: "toMonth", // 
    year: "toYear", // 
    hour: "toStartOfHour", // 
}

//卡片分析数据按时间归类
const CARD_STATISTIC_DATE_TYPE_GROUP_BY = {
    day: "yyyy-MM-dd", // 
    week: "", // 
    month: "yyyy-MM-01", // 
    year: "yyyy", // 
    hour: "yyyy-MM-dd hh:mm:ss", // 
}

//总次数，用户数，人均次数,人均停留时间
const CALCULATE_FIELD_TYPE = {
    allCount: "总次数", //内置ID不去重
    userCount: "用户数", //内置ID去重
    averageCount: "人均次数", //总次数/用户数
    averageStayTime: "人均停留时间" //停留时间总和/用户数
}
// 应用中心通知模板配置（先写死）
const NOTICE_TEMPLATE_ID = '3e8a3bb0-d326-11f0-b96b-714cd889455c'
const WEB_MONITOR_ID = 'webfunny_20251205_213900_pro'


/**
 * 阈值类型枚举
 * absolute:   绝对值变化（当前值与基准值的差值 vs 阈值）
 * percentage: 百分比变化（当前值与基准值的变化率 vs 阈值）
 */
const THRESHOLD_TYPE = {
    ABSOLUTE: 'absolute',
    PERCENTAGE: 'percentage'
}


/**
 * 比较类型枚举
 * lessThanAndEqual:      低于
 * greaterThanAndEqual:   高于
 * between:               区间在
 * notBetween:            区间不在
 */
const COMPARE_TYPE = {
    LTE: 'lessThanAndEqual',
    GTE: 'greaterThanAndEqual',
    BETWEEN: 'between',
    NOT_BETWEEN: 'notBetween'
}


/**
 * 对比周期枚举
 * lastHour:      上一个小时
 * lastPeriod:    昨天同期
 * specialValue:  特定值（当前值直接与阈值比较）
 */
const COMPARE_PERIOD = {
    LAST_HOUR: 'lastHour',
    LAST_PERIOD: 'lastPeriod',
    SPECIAL_VALUE: 'specialValue'
}

module.exports = {
    UPLOAD_TYPE,
    USER_INFO,
    PROJECT_INFO,
    MANAGE_API,
    CENTER_API,
    FLOW_TYPE,
    DANGER_SQL_PARAMS,
    LOCAL_SERVER,
    RETENTION_CALC_INFO,
    WEEK_NAME,
    CALCULATE_FIELD_TYPE,
    CARD_STATISTIC_DATE_TYPE,
    CARD_STATISTIC_DATE_TYPE_GROUP_BY,
    COMPARE_PERIOD,
    NOTICE_TEMPLATE_ID,
    WEB_MONITOR_ID,
    THRESHOLD_TYPE,
    COMPARE_TYPE,
}