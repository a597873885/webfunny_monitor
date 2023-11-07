var fs = require('fs');
var path = require('path');
const rootPath = path.resolve(__dirname, "..")

/**
 * 初始化alarm目录
 */
var alarmPathArray = [rootPath + "/alarm/alarmName.js", rootPath + "/alarm/dingding.js", rootPath + "/alarm/feishu.js", rootPath + "/alarm/weixin.js", rootPath + "/alarm/index.js",]
var alarmFileArray = [
  `module.exports = {
    PV: "浏览页面次数",
    UV: "浏览页面人数",
    JsError: "JS代码错误次数",
    ConsoleError: "自定义错误次数",
    http: "接口请求次数",
    httpError: "接口错误次数",
    resourceError: "静态资源错误次数",
  }`,
  `/**
    * 这里是钉钉机器人（关键字）的相关配置
    * 关键字列表： 
    * 1. 警报
    */
  module.exports = {
      url: "", // 钉钉机器人的 webHook URL
      config: {
          "msgtype": "text",
          "text": {
              "content": ""
          },
          "at": {
              "atMobiles": [    // 想要@的成员列表
                  "000"
              ], 
              "isAtAll": false  // 是否@所有人
          }
        }
  }`,
  `/**
  * 这里是飞书的机器人（关键字）的相关配置
  * 关键字列表： 
  * 1. 警报
  */
 module.exports = {
     url: "", // 飞书机器人的URL
     config: {
         "msg_type": "text",
         "content": {
             "text": ""
         },
       }
 }`,
  `/**
  * 这里是企业微信机器人的相关配置
  */
 module.exports = {
     url: "", // 企业微信机器人的 webHook URL
     config: {
         "msgtype": "text",
         "text": {
             "content": "我只是一个机器人测试，请忽略我",
             "mentioned_list":["xxx",],
             "mentioned_mobile_list":["182xxxx4111"]  // 将要艾特的人
         }
     }
 }`,
  `const sendEmail = require('../util_cus/sendEmail');
  const dingDing = require('../alarm/dingding')
  const weiXin = require('../alarm/weixin')
  const feiSHu = require('../alarm/feishu')
  const Utils = require('../utils/utils')
  const WebfunnyConfig = require("../webfunny.config")
  const { otherConfig } = WebfunnyConfig
  const AlarmNames = require('./alarmName')
  
  const alarmCallback = (project, rule, users) => {
    const { projectName, projectType, chooseHook } = project
    const {type, happenCount, compareType, limitValue} = rule
    const compareStr = compareType === "up" ? ">=" : "<"
    const projectHook = chooseHook ? JSON.parse(chooseHook) : {value: "", name: "", webHook: ""}
    /**生成警报配置 */
    // 添加用户手机号
    let atMemberPhone = []
    users.forEach((user) => {
        atMemberPhone.push(user.phone)
    })
    dingDing.config.at.atMobiles = atMemberPhone
    weiXin.config.text.mentioned_mobile_list = atMemberPhone
    // 生成警报内容
    const contentStr = type + "警报！" +
        "您的" + projectType + "项目【" + projectName + "】发出警报：" +
        type + "数量 " + compareStr + " " + limitValue + " 已经发生" + happenCount + "次了，请及时处理。"
    dingDing.config.text.content = contentStr
    weiXin.config.text.content = contentStr
    feiSHu.config.content.text = contentStr
    switch(projectHook.value) {
        case "dingding":
            // 1. 通知钉钉机器人
            Utils.postJson(projectHook.webHook, dingDing.config)  // 钉钉机器人
            break
        case "weixin":
            // 2. 通知微信机器人
            Utils.postJson(projectHook.webHook, weiXin.config)  // 微信机器人
            break
        case "feishu":
            // 3. 通知飞书机器人
            Utils.postJson(projectHook.webHook, feiSHu.config)  // 飞书机器人
            break
        default:
            break
    }
  
    // 4. 发送邮件通知
    const { useCusEmailSys, emailUser, emailPassword} = otherConfig
    if (useCusEmailSys === true) {
        // 使用用户的邮箱系统
        if (users && users.length) {
            users.forEach((user) => {
                const email = user.emailName
                sendEmail(email, AlarmNames[type] + "警报！", contentStr, emailUser, emailPassword)
            })
        }
    } else {
        // 使用webfunny的邮箱系统
        if (users && users.length) {
            users.forEach((user) => {
                const email = user.emailName
                Utils.sendWfEmail(email, AlarmNames[type] + "警报！", contentStr)
            })
        }
    }
  }
  module.exports = {
      alarmCallback
  }`,
]

fs.mkdir( rootPath + "/alarm", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${rootPath}/alarm 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${rootPath}/alarm`)
  }
  alarmPathArray.forEach((path, index) => {
      fs.readFile(path, "", (err) => {
          if (err) {
              console.log("× " + path + " 配置文件不存在，即将创建...")
              fs.writeFile(path, alarmFileArray[index], (err) => {
                  if (err) throw err;
                  console.log("√ " + path + " 配置文件创建完成！");
              });
          } else {
              console.log("√ " + path + " 配置文件已存在！")
          }
      });
  })
});
