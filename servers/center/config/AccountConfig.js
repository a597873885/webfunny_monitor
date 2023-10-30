const WebfunnyConfig = require("../../../webfunny.config")
const { domainConfig, licenseConfig, mysqlConfig, otherConfig } = WebfunnyConfig

const accountInfo = {
    uploadServerDomain: domainConfig.uploadDomain.monitor, // 上报域名
    
    localServerDomain: domainConfig.host.be,   // 监控系统后端服务域名 
    localServerPort: domainConfig.port.be,     // 监控系统后端服务端口号
    localAssetsDomain: domainConfig.host.fe,   // 数据可视化系统域名
    localAssetsPort: domainConfig.port.fe,     // 数据可视化系统端口号
    mainDomain: "",  // 主域名

    centerServerDomain: domainConfig.host.be,   // 控制台后端服务域名 
    centerServerPort: domainConfig.port.be,     // 控制台后端端口号
    centerAssetsDomain: domainConfig.host.fe,   // 数据可视化服务域名
    centerAssetsPort: domainConfig.port.be,     // 可视化系统端口号

    monitorServerDomain: domainConfig.host.be,   // 监控日志服务域名 
    monitorAssetsDomain: domainConfig.host.fe,   // 监控数据可视化服务域名
    eventServerDomain: domainConfig.host.be,   // 埋点日志服务域名 
    eventAssetsDomain: domainConfig.host.fe,   // 埋点数据可视化服务域名

    purchaseCode: licenseConfig.monitor.purchaseCode,                   // 激活码
    secretCode: licenseConfig.monitor.secretCode,                     // 解码
    protocol: otherConfig.protocol,                   // 服务器之间通信采用的协议;
    messageQueue: otherConfig.messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;
    openMonitor: otherConfig.openMonitor,                    // 开启系统监控

    saveDays: otherConfig.logSaveDays,                       // 日志保存周期

    stayTimeScope: otherConfig.business.userStayTimeScope,                  // 用户停留时间范围

    mysqlConfig: mysqlConfig.center,

    useCusEmailSys: otherConfig.email.useCusEmailSys,                 // 是否开启自定义邮件系统
    emailUser: otherConfig.email.emailUser,
    emailPassword: otherConfig.email.emailPassword,

    registerEntry: typeof otherConfig.registerEntry === "boolean" ? otherConfig.registerEntry : true,  // 是否显示注册入口
    resetPwdEntry: typeof otherConfig.resetPwdEntry === "boolean" ? otherConfig.resetPwdEntry : true,  // 是否显示忘记密码入口
    ssoCheckUrl: otherConfig.ssoCheckUrl,  // sso的token验证接口
    activationRequired: otherConfig.activationRequired,  // 是否需要激活
    emailNeeded: otherConfig.emailNeeded,  // 注册是否需要email
    phoneNeeded: otherConfig.phoneNeeded,  // 注册是否需要手机号
}

module.exports = {
    accountInfo
}