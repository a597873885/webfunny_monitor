const UPLOAD_TYPE = {
    ON_ERROR: "on_error",
    CONSOLE_ERROR: "console_error",
    RESOURCE_ERROR: "resource_error",
    HTTP_ERROR: "http_error",
    NEW_CUSTOMER: "new_customer",
    INSTALL_COUNT: "install_count"
}
const PROJECT_INFO = {
    PROJECT_VERSION: "",
    MONITOR_VERSION: ""
}

module.exports = {
    ...UPLOAD_TYPE,
    ...PROJECT_INFO
}