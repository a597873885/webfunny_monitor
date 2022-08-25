var path = require("path");
const jsonfile = require('jsonfile');

var basePath = path.resolve(__dirname, "../config_variable/");
const file = basePath + '/config.json';
var conf;
if (conf == undefined || conf == null) {
    try {
        conf = jsonfile.readFileSync(file);
    } catch (error) {
        console.log('read json config err:', error);
        throw new Error('解析配置文件config_variable/config.json失败')
    }
}

if (conf == undefined || conf == null) {
    throw new Error('配置不存在');
}

const accountInfo = {
    uploadServerDomain: conf.uploadDomain.localServerDomain,//日志服务域名 
    localServerDomain: conf.domain.localServerDomain,   // 服务域名 
    localServerPort: conf.domain.localServerPort,     // 服务端口号

    localAssetsDomain: conf.domain.localAssetsDomain,   // 数据可视化服务域名
    localAssetsPort: conf.domain.localAssetsPort,     // 可视化系统端口号

    mainDomain: conf.domain.mainDomain,  // 主域名

    centerServerDomain: conf.centerDomain.localServerDomain,   // 控制台后端服务域名 
    centerServerPort: conf.centerDomain.localServerPort,     // 控制台后端端口号
    centerAssetsDomain: conf.centerDomain.localAssetsDomain,   // 数据可视化服务域名
    centerAssetsPort: conf.centerDomain.localAssetsPort,     // 可视化系统端口号

    purchaseCode: conf.purchase.purchaseCode,                   // 激活码
    secretCode: conf.purchase.secretCode,                     // 解码
    protocol: conf.protocol,                   // 服务器之间通信采用的协议;
    messageQueue: conf.messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;
    openMonitor: conf.openMonitor,                    // 开启系统监控

    saveDays: conf.logSaveDays,                       // 日志保存周期

    isOpenTodayStatistic: conf.isOpenTodayStatistic,           //是否开启统计今天的数据（每小时分析一次，true：开启，false：不开启，默认开启）

    stayTimeScope: conf.business.userStayTimeScope,                  // 用户停留时间范围

    mysqlConfig: conf.mysqlConfig,

    useCusEmailSys: conf.email.useCusEmailSys,                 // 是否开启自定义邮件系统
    emailUser: conf.email.emailUser,
    emailPassword: conf.email.emailPassword,

    httpReqRes: conf.httpReqRes,                     // 接口内容长度限制
}

module.exports = {
    accountInfo
}