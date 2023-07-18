const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig

const UPLOAD_TYPE = {
    ON_ERROR: "on_error",
    CONSOLE_ERROR: "console_error",
    RESOURCE_ERROR: "resource_error",
    HTTP_ERROR: "http_error",
    NEW_CUSTOMER: "new_customer",
    INSTALL_COUNT: "install_count",

    UV: "uv",
    PV: "pv",

    LOADPAGE_HOUR_COUNT: "loadpage_hour_count",  // 每小时 页面首次加载次数
    DNS_HOUR_TIME: "dns_hour_time",  // 每小时 DNS解析平均耗时
    TCP_HOUR_TIME: "tcp_hour_time",  // 每小时 TCP连接平均耗时
    TTFB_HOUR_TIME: "ttfb_hour_time",  // 每小时 读取到第一字节的平均响应时间
    RESOURCE_HOUR_TIME: "resource_hour_time", // 每小时 资源加载完成平均耗时
    DOM_ANALYSIS_HOUR_TIME: "dom_analysis_hour_time", // 每小时 dom解析平均时间
    LOADPAGE_HOUR_TIME: "loadpage_hour_time", // 每小时 页面加载完成的平均耗时


    LOADPAGE_DAY_COUNT: "loadpage_day_count",  // 每天 页面首次加载次数
    DNS_DAY_TIME: "dns_day_time",  // 每天 DNS解析平均耗时
    TCP_DAY_TIME: "tcp_day_time",  // 每天 TCP连接平均耗时
    TTFB_DAY_TIME: "ttfb_day_time",  // 每天 读取到第一字节的平均响应时间
    RESOURCE_DAY_TIME: "resource_day_time", // 每天 资源加载完成平均耗时间
    DOM_ANALYSIS_DAY_TIME: "dom_analysis_day_time", // 每天 dom解析平均时间
    LOADPAGE_DAY_TIME: "loadpage_day_time", // 每天 页面加载完成的平均耗时

    HTTP_HOUR_TIME: "http_hour_time",  // 每小时 接口接口平均耗时
    HTTP_HOUR_TOTAL_COUNT: "http_hour_total_count", // 每小时的请求总数

    HTTP_HOUR_COUNT_LOADTIME: "http_hour_count_loadtime", // 每小时接口请求总数，加载耗时平均值
    PAGE_HOUR_COUNT_LOADTIME: "page_hour_count_loadtime", // 每小时首次页面加载总数，加载耗时平均值

    HTTP_HOUR_COUNT_A: "http_hour_count_a",  // 每小时 接口耗时<=2s的
    HTTP_HOUR_COUNT_B: "http_hour_count_b",  // 每小时 接口耗时2s< <=5s的
    HTTP_HOUR_COUNT_C: "http_hour_count_c",  // 每小时 接口耗时5s< <=10s的
    HTTP_HOUR_COUNT_D: "http_hour_count_d",  // 每小时 接口耗时10s< <=30s的
    HTTP_HOUR_COUNT_E: "http_hour_count_e",  // 每小时 接口耗时>=30s的

    PAGE_HOUR_COUNT_A: "page_hour_count_a",  // 每小时 页面加载耗时<=2s的
    PAGE_HOUR_COUNT_B: "page_hour_count_b",  // 每小时 页面加载耗时2s< <=5s的
    PAGE_HOUR_COUNT_C: "page_hour_count_c",  // 每小时 页面加载耗时5s< <=10s的
    PAGE_HOUR_COUNT_D: "page_hour_count_d",  // 每小时 页面加载耗时10s< <=30s的
    PAGE_HOUR_COUNT_E: "page_hour_count_e",  // 每小时 页面加载耗时>=30s的

    HTTP_COUNT_A: "http_count_a",  // 每天 接口耗时<=1s的
    HTTP_COUNT_B: "http_count_b",  // 每天 接口耗时1s< <=5s的
    HTTP_COUNT_C: "http_count_c",  // 每天 接口耗时5s< <=10s的
    HTTP_COUNT_D: "http_count_d",  // 每天 接口耗时10s< <=30s的
    HTTP_COUNT_E: "http_count_e",  // 每天 接口耗时>=30s的

    PAGE_COUNT_A: "page_count_a",  // 每天 页面加载耗时<=2s的
    PAGE_COUNT_B: "page_count_b",  // 每天 页面加载耗时2s< <=5s的
    PAGE_COUNT_C: "page_count_c",  // 每天 页面加载耗时5s< <=10s的
    PAGE_COUNT_D: "page_count_d",  // 每天 页面加载耗时10s< <=30s的
    PAGE_COUNT_E: "page_count_e",  // 每天 页面加载耗时>=30s的

    UV_COUNT_HOUR: "uv_count_hour", // 每小时的唯一uv数量，相加可得总uv
    NEW_COUNT_HOUR: "new_count_hour", // 每小时的唯一新访客数量，相加可得总的新用户数量
    PV_COUNT_HOUR: "pv_count_hour", // 每小时的PV数量，相加可得总pv
    IP_COUNT_HOUR: "ip_count_hour", // 每小时的唯一ip数量，相加可得总IP数量

    UV_COUNT_DAY: "uv_count_day",  // 一天的UV数量
    NEW_COUNT_DAY: "new_count_day",  // 一天的新访客数量
    PV_COUNT_DAY: "pv_count_day",  // 一天的PV数量
    IP_COUNT_DAY: "ip_count_day",  // 一天的IP数量

    DEVICE_COUNT_HOUR: "device_count_hour",  // 每小时的设备数量
    CITY_COUNT_HOUR: "city_count_hour",  // 每小时的城市数量
    PROVINCE_COUNT_HOUR: "province_count_hour",  // 每小时的省份数量
    COUNTRY_COUNT_HOUR: "country_count_hour",  // 每小时的国家数量
    SYSTEM_COUNT_HOUR: "system_count_hour",  // 每小时的系统版本数量
    VERSION_COUNT_HOUR: "version_count_hour",  // 每小时的应用版本数量
    SCREEN_COUNT_HOUR: "screen_count_hour",  // 每小时的分辨率数量

    DEVICE_COUNT_DAY: "device_count_day",  // 一天的设备数量
    CITY_COUNT_DAY: "city_count_day",  // 一天的城市数量
    PROVINCE_COUNT_DAY: "province_count_day",  // 一天的省份数量
    COUNTRY_COUNT_DAY: "country_count_day",  // 一天的国家数量
    SYSTEM_COUNT_DAY: "system_count_day",  // 一天的系统版本数量
    VERSION_COUNT_DAY: "version_count_day",  // 一天的应用版本数量
    SCREEN_COUNT_DAY: "screen_count_day",  // 一天的分辨率数量

    STAY_TIME_FOR_HOUR: "s_t_f_h",  // 每小时的平均停留时间
    STAY_TIME_FOR_DAY: "s_t_f_d",   // 每天的平均停留时间

    CUS_LEAVE_FOR_HOUR: "cus_leave_for_hour",  // 每小时的跳出率
    CUS_LEAVE_FOR_DAY: "cus_leave_for_day",   // 每天的跳出率

    UV_YESTERDAY_PER: "uv_yesterday_per", // 次日留存率

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
    GET_USER_TOKEN_FROM_NET_WORK_BY_TOKEN: `${accountInfo.centerServerDomain}/wfManage/getUserTokenFromNetworkByToken`,
    GET_TEAMS: `${accountInfo.centerServerDomain}/wfManage/getTeams`,
    GET_TEAM_DETAIL: `${accountInfo.centerServerDomain}/wfManage/getTeamDetail`,
    UPDATE_TEAM: `${accountInfo.centerServerDomain}/wfManage/updateTeam`,
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
    DANGER_SQL_PARAMS
}