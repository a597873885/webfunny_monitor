var fs = require('fs');
const Utils = require('./util/utils');
let msgList = {
    PROJECT_COUNT: "项目个数",
    PROJECT_TYPE: "项目类型",
    PRODUCT_TYPE0: "试用版",
    PRODUCT_TYPE1: "专业版",
    PRODUCT_TYPE28: "监控系统至尊VIP",
    PRODUCT_TYPE70: "监控系统企业版",
    PRODUCT_TYPE71: "监控系统社区版",
    PRODUCT_TYPE72: "监控系统企业版",
    PRODUCT_TYPE73: "监控系统单机版",
    PRODUCT_TYPE74: "监控系统尊享版",
    PRODUCT_TYPE75: "监控系统至尊版",
    PRODUCT_LIMIT_TYPE_X: "流量上限",
    PRODUCT_LIMIT_TYPE_Y: "日活上限",
    PRODUCT_LIMIT_TYPE_Z: "启动次数上限",
    END_DATE: "到期时间",

    SERVER_STARTING: "服务启动中，请等待...",
    SERVER_START_SUCCESS: "服务启动成功...",
    SERVER_AUTHOR: "作 者：一步一个脚印一个坑",
    SERVER_WECHAT: "微 信：【 webfunny2 】",
    STARTING_MSG1: "应用中心首页：",
    STARTING_MSG2: "监控系统首页：",
    STARTING_MSG3: "部署问题集合：",
    STARTING_MSG4: "启动服务：",
    STARTING_MSG5: "重启服务：",
    STARTING_MSG6: "停止、删除进程：",
    STARTING_MSG7: "服务已在后台运行，命令行（终端）可关闭。",
    STARTING_MSG8: "查看进程：",
    STARTING_MSG9: "研发不易，需要鼓励。去给我们的项目点个 Star 吧",

    VALID_MSG0: "您好，【监控系统】授权码失效了，可能原因：1. 授权码到期了；2. 未绑定机器码；",
    VALID_MSG1: "如果您想继续使用，可以加我的微信（webfunny2），申请授权码哦...",
    VALID_MSG: "您也可以成为我们的企业版用户，将会获得更好的维保和售后服务，感谢您的支持！",

    INVALID_MSG1: "授权码失效了，请联系我们，微信号：webfunny2。",
    INVALID_MSG2: "授权码失效了，请按照页面引导，创建授权码。",
    SERVER_STOP: "服务已暂停",


    // SECRETS_LIST: JSON.stringify([
    //     {P: "1", X: "2", D: "3", W: "4", U: "5", B: "6", S: "7", M: "8", G: "9", K: "0"},
    //     {Z: "1", A: "2", D: "3", V: "4", M: "5", C: "6", N: "7", K: "8", J: "9", L: "0"},
    //     {Y: "1", Q: "2", I: "3", T: "4", V: "5", R: "6", H: "7", C: "8", P: "9", U: "0"},
    //     {S: "1", W: "2", Z: "3", F: "4", Q: "5", J: "6", T: "7", B: "8", V: "9", I: "0"},
    //     {E: "1", B: "2", Q: "3", V: "4", X: "5", Y: "6", T: "7", G: "8", S: "9", M: "0"},
    // ])
}

let keyStr = ""
for (key in msgList) {
    keyStr += `${key}: "${Utils.b64EncodeUnicode(msgList[key])}",
    `
}

const result = `
module.exports = {
    ${keyStr}
}
`
const fileName = './config/constMsg.js';
fs.unlink(fileName,() => {
    console.log("删除旧的转码文件： " + fileName)
    fs.writeFile(fileName, result, function(err) {
        if (err) { throw err; }
        console.log("中文提示转码完成")
    });
});
