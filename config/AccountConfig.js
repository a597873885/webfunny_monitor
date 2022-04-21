var path = require("path");
const jsonfile = require('jsonfile');

var basePath = path.resolve(__dirname, "../docker_variable/");
const file = basePath + '/config.json';
var conf;
if (conf == undefined || conf == null) {
    try {
        conf = jsonfile.readFileSync(file);
    } catch (error) {
        console.log('read json config err:', error);
        throw new Error('解析配置文件docker_variable/config.json失败')
    }
}

if (conf == undefined || conf == null) {
    throw new Error('配置不存在');
}

/*
const writePurchaseCode = function(aPurchaseCode, aSecretCode) {
    if (aPurchaseCode) {
        conf.auth.purchaseCode = aPurchaseCode;
    }
    
    if (aSecretCode) {
        conf.auth.secretCode = aSecretCode;
    }
    jsonfile.writeFile(file,conf, function (err) {
        if (err) console.error('写purchaseCode失败: ' + err)
    });
}
*/

// const { saveDays } = require("../bin/saveDays")
// const stayTimeScope = require("../bin/stayTimeScope")
// const mysqlConfig = require("../bin/mysqlConfig")
// const { purchaseCode, secretCode } = require("../bin/purchaseCode")
// const { messageQueue } = require("../bin/messageQueue")
// const { openMonitor } = require("../bin/sysMonitor")
// const httpReqRes = require("../bin/httpReqRes")
// const { useCusEmailSys, emailUser, emailPassword } = require("../bin/useCusEmailSys")
// const { localServerDomain, localAssetsDomain, localServerPort, localAssetsPort, mainDomain } = require("../bin/domain")

const accountInfo = {

    localServerDomain: conf.domain.localAssetsDomain,   // 日志服务域名 
    localServerPort: conf.domain.localServerPort,     // 日志服务端口号

    localAssetsDomain: conf.domain.localAssetsDomain,   // 数据可视化服务域名
    localAssetsPort: conf.domain.localAssetsPort,     // 可视化系统端口号

    mainDomain: conf.domain.mainDomain,  // 主域名

    purchaseCode: conf.purchase.purchaseCode,                   // 激活码
    secretCode: conf.purchase.secretCode,                     // 解码
    messageQueue: conf.messageQueue,                   // 消息队列默认关闭，需手动开启。 前提：安装RabbitMq;
    openMonitor: conf.openMonitor,                    // 开启系统监控

    saveDays: conf.logSaveDays,                       // 日志保存周期

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