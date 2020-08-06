const UPLOAD_TYPE = {
    ON_ERROR: "on_error",
    CONSOLE_ERROR: "console_error",
    RESOURCE_ERROR: "resource_error",
    HTTP_ERROR: "http_error",
    NEW_CUSTOMER: "new_customer",
    INSTALL_COUNT: "install_count",

    UV: "uv",
    PV: "pv",

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

    HTTP_COUNT_A: "http_count_a",  // 接口耗时<=1s的
    HTTP_COUNT_B: "http_count_b",  // 接口耗时1s< <=5s的
    HTTP_COUNT_C: "http_count_c",  // 接口耗时5s< <=10s的
    HTTP_COUNT_D: "http_count_d",  // 接口耗时10s< <=30s的
    HTTP_COUNT_E: "http_count_e",  // 接口耗时>=30s的

    PAGE_COUNT_A: "page_count_a",  // 页面加载耗时<=2s的
    PAGE_COUNT_B: "page_count_b",  // 页面加载耗时2s< <=5s的
    PAGE_COUNT_C: "page_count_c",  // 页面加载耗时5s< <=10s的
    PAGE_COUNT_D: "page_count_d",  // 页面加载耗时10s< <=30s的
    PAGE_COUNT_E: "page_count_e",  // 页面加载耗时>=30s的

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
    SYSTEM_COUNT_HOUR: "system_count_hour",  // 每小时的系统版本数量
    VERSION_COUNT_HOUR: "version_count_hour",  // 每小时的应用版本数量

    DEVICE_COUNT_DAY: "device_count_day",  // 一天的设备数量
    CITY_COUNT_DAY: "city_count_day",  // 一天的城市数量
    SYSTEM_COUNT_DAY: "system_count_day",  // 一天的系统版本数量
    VERSION_COUNT_DAY: "version_count_day",  // 一天的应用版本数量


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
}

const PROJECT_INFO = {
    PROJECT_VERSION: "1.0.3",
    MONITOR_VERSION: "1.0.0"
}

module.exports = {
    UPLOAD_TYPE,
    USER_INFO,
    PROJECT_INFO
}