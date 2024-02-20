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
}

const CENTER_API = {
    GET_USER_INFO: "/wfCenter/getUserInfo",
    CREATE_FLOW_DATA: "/wfCenter/createFlowData",
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
const DANGER_SQL_PARAMS = [";", "'", "<", ">", "update ",
                    "select ", "union ", "and ", "or ", "from ", "insert ",
                    "delete ", "database ", "drop ", "truncate ", "create ", "like "]

module.exports = {
    UPLOAD_TYPE,
    USER_INFO,
    PROJECT_INFO,
    MANAGE_API,
    CENTER_API,
    FLOW_TYPE,
    DANGER_SQL_PARAMS
}