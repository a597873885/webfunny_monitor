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
    otelGrpcPort: domainConfig.grpc?.otelPort || 9013, // OTLP gRPC服务端口（用于接收OpenTelemetry数据上报）
    grpcPort: domainConfig.grpc?.port || 11800, // SkyWalking gRPC服务端口（用于接收SkyWalking SDK上报）

    centerServerDomain: domainConfig.host.be,   // 控制台后端服务域名 
    centerServerPort: domainConfig.port.be,     // 控制台后端端口号
    centerAssetsDomain: domainConfig.host.fe,   // 数据可视化服务域名
    centerAssetsPort: domainConfig.port.be,     // 可视化系统端口号

    monitorServerDomain: domainConfig.host.be,   // 监控系统后端服务域名 
    monitorServerPort: domainConfig.port.be,     // 监控系统后端服务端口号
    monitorAssetsDomain: domainConfig.host.fe,   // 监控系统数据可视化服务域名
    monitorAssetsPort: domainConfig.port.fe,     // 监控系统数据可视化系统端口号

    purchaseCode: licenseConfig.apm.purchaseCode,                   // 激活码
    secretCode: licenseConfig.apm.secretCode,                     // 解码
    protocol: otherConfig.protocol,                   // 服务器之间通信采用的协议;
    messageQueue: otherConfig.messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;
    openMonitor: otherConfig.openMonitor,                    // 开启系统监控

    saveDays: otherConfig.logSaveDays.monitor,                       // 日志保存周期

    stayTimeScope: otherConfig.business.userStayTimeScope,                  // 用户停留时间范围
    batchInsert: otherConfig.business.batchInsert,

    mysqlConfig: mysqlConfig.apm,
    rabbitMqConfig: rabbitMqConfig,
    
    segmentUrl: otherConfig.segmentUrl,   
    selfMonitor: otherConfig.selfMonitor,                      // 自监控配置

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