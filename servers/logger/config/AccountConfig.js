const WebfunnyConfig = require("../../../webfunny.config")
const { domainConfig, licenseConfig, mysqlConfig, otherConfig } = WebfunnyConfig


const accountInfo = {
    uploadServerDomain: domainConfig.uploadDomain.monitor, // 上报域名
    
    localServerDomain: domainConfig.host.be,   // 监控系统后端服务域名 
    localServerPort: domainConfig.port.be,     // 监控系统后端服务端口号
    localAssetsDomain: domainConfig.host.fe,   // 数据可视化系统域名
    localAssetsPort: domainConfig.port.fe,     // 数据可视化系统端口号

    centerServerDomain: domainConfig.host.be,   // 控制台后端服务域名 
    centerServerPort: domainConfig.port.be,     // 控制台后端端口号
    centerAssetsDomain: domainConfig.host.fe,   // 数据可视化服务域名
    centerAssetsPort: domainConfig.port.be,     // 可视化系统端口号

    purchaseCode: licenseConfig.monitor.purchaseCode,                   // 激活码
    secretCode: licenseConfig.monitor.secretCode,                     // 解码
    protocol: otherConfig.protocol,                   // 服务器之间通信采用的协议;
    messageQueue: otherConfig.messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;
    batchInsert: otherConfig.business.batchInsert,

    saveDays: otherConfig.logSaveDays,                       // 日志保存周期
    mysqlConfig: mysqlConfig.logger,
}

module.exports = {
    accountInfo
}