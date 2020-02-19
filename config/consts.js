const UPLOAD_TYPE = {
    ON_ERROR: "on_error",
    CONSOLE_ERROR: "console_error",
    RESOURCE_ERROR: "resource_error",
    HTTP_ERROR: "http_error",
    NEW_CUSTOMER: "new_customer",
    INSTALL_COUNT: "install_count",
    HTTP_COUNT_A: "http_count_a",  // 接口耗时<=2s的
    HTTP_COUNT_B: "http_count_b",  // 接口耗时2s< <=5s的
    HTTP_COUNT_C: "http_count_c",  // 接口耗时5s< <=10s的
    HTTP_COUNT_D: "http_count_d",  // 接口耗时10s< <=30s的
    HTTP_COUNT_E: "http_count_e",  // 接口耗时>=30s的
    UV_COUNT_DAY: "uv_count_day",  // 一天的UV数量
    NEW_COUNT_DAY: "new_count_day",  // 一天的新访客数量
    PV_COUNT_DAY: "pv_count_day",  // 一天的PV数量
    IP_COUNT_DAY: "ip_count_day",  // 一天的IP数量
}
const PROJECT_INFO = {
    PROJECT_VERSION: "1.0.3",
    MONITOR_VERSION: "1.0.0"
}

module.exports = {
    UPLOAD_TYPE,
    PROJECT_INFO
}