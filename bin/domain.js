const default_server_port = 8011
const default_assets_port = 8010
module.exports = {
    // 后台服务域名配置
    demo_server_domain: "//47.105.132.73:" + default_server_port,
    local_server_domain: "//localhost:" + default_server_port,

    // 可视化系统域名配置，没有demo
    local_assets_domain: "//localhost:" + default_assets_port,
    default_assets_port,
    default_server_port
}