const WebfunnyConfig = require("../../../webfunny.config")
const { domainConfig, licenseConfig, mysqlConfig, otherConfig } = WebfunnyConfig

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

    purchaseCode: licenseConfig.event.purchaseCode,                   // 激活码
    secretCode: licenseConfig.event.secretCode,                     // 解码
    protocol: otherConfig.protocol,                   // 服务器之间通信采用的协议;
    messageQueue: otherConfig.messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;
    openMonitor: otherConfig.openMonitor,                    // 开启系统监控

    saveDays: otherConfig.logSaveDays.event || 30,                       // 日志保存周期
    isOpenTodayStatistic: otherConfig.isOpenTodayStatistic,   //是否开启统计今天的数据（每小时分析一次，true：开启，false：不开启，默认开启）

    stayTimeScope: otherConfig.business.userStayTimeScope,                  // 用户停留时间范围
    batchInsert: otherConfig.business.batchInsert,

    mysqlConfig: mysqlConfig.event,

    useCusEmailSys: otherConfig.email.useCusEmailSys,                 // 是否开启自定义邮件系统
    emailUser: otherConfig.email.emailUser,
    emailPassword: otherConfig.email.emailPassword,

    printSql: otherConfig.printSql,  // 是否打印sql配置
    printConsole: otherConfig.printConsole,  // 是否打印console

    cacheDataTime: otherConfig.cacheDataTime, // 接口缓存时间
    signature: otherConfig.signature,  // 签名配置
}

module.exports = {
    accountInfo
}