const WebfunnyConfig = require("../../../webfunny.config")
const { domainConfig, licenseConfig, mysqlConfig, otherConfig, rabbitMqConfig } = WebfunnyConfig


const accountInfo = {
    isCloud: otherConfig.isCloud,              // 云服务模式

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

    purchaseCode: licenseConfig.monitor.purchaseCode,                   // 激活码
    secretCode: licenseConfig.monitor.secretCode,                     // 解码
    protocol: otherConfig.protocol,                   // 服务器之间通信采用的协议;
    messageQueue: otherConfig.messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;
    openMonitor: otherConfig.openMonitor,                    // 开启系统监控

    saveDays: otherConfig.logSaveDays.monitor || 30,                       // 日志保存周期

    stayTimeScope: otherConfig.business.userStayTimeScope,                  // 用户停留时间范围
    batchInsert: otherConfig.business.batchInsert,

    mysqlConfig: mysqlConfig.monitor,
    rabbitMqConfig: rabbitMqConfig,
    
    segmentUrl: otherConfig.segmentUrl,                      // segment上报地址，跟skyWalking进行接入

    useCusEmailSys: otherConfig.email.useCusEmailSys,                 // 是否开启自定义邮件系统
    emailUser: otherConfig.email.emailUser,
    emailPassword: otherConfig.email.emailPassword,
    isIpCovert: otherConfig.isIpCovert || false,             // 是否使用ip地址转换

    printSql: otherConfig.printSql,  // 是否打印sql配置
    printConsole: otherConfig.printConsole,  // 是否打印console

    signature: otherConfig.signature,
}

module.exports = {
    accountInfo
}