var fs = require('fs');
const fetch = require('node-fetch')

// 初始化bin目录
const setVariableInfo = (databaseInfo) => {
    const variableJsonPath = __dirname + "/config_variable/config.json"
    fs.readFile(variableJsonPath, "", (err) => {
      if (err) {
          console.log("× " + variableJsonPath + " 配置文件不存在，即将创建...")
          var variableJsonFile = `{
            "purchase": {
              "purchaseCode": "",
              "secretCode": ""
            },
            "uploadDomain": {
              "localServerDomain": ""
            },
            "domain": {
              "localAssetsDomain": "localhost:8024",
              "localServerDomain": "localhost:8025",
              "localAssetsPort": "8024",
              "localServerPort": "8025",
              "mainDomain": ""
            },
            "centerDomain": {
              "localAssetsDomain": "localhost:8020",
              "localServerDomain": "localhost:8021"
            },
            "mysqlConfig": {
                "write": {
                  "ip": "${databaseInfo.ip}",
                  "port": "${databaseInfo.port}",
                  "dataBaseName": "${databaseInfo.dataBaseName}",
                  "userName": "${databaseInfo.userName}",
                  "password": "${databaseInfo.password}"
                },
                "read": []
            },
            "email": {
              "useCusEmailSys": false,
              "emailUser": "",
              "emailPassword": ""
            },
            "protocol": "",
            "messageQueue": false,
            "openMonitor": true,
            "logSaveDays": 8,
            "isOpenTodayStatistic": true,
            "business": {
              "batchInsert": {
                "limitQueueLength": 1000
              },
              "userStayTimeScope": {
                "min": 100,
                "max": 100000
              }
            }
          }`
          fs.writeFile(variableJsonPath, variableJsonFile, (err) => {
              if (err) throw err;
              console.log("√ " + variableJsonPath + " 配置文件创建完成！");
          });
      } else {
          console.log("√ " + path + " 配置文件已存在！")
      }
    });
  }

/**
 * 初始化系统模板
 */
// fs.mkdir( __dirname + "/metadata", async (err) => {
//     if ( err ) { 
//       console.log(`= 文件夹 ${__dirname}/metadata 已经存在`)
//     }
//     const variableJsonPath = __dirname + "/metadata/weTemplateList.js"
//     fs.readFile(variableJsonPath, "", (err) => {
//       if (err) {
//           console.log("× " + variableJsonPath + " 系统模板文件不存在，即将创建...")
//           var variableJsonFile = baseTemplate
//           fs.writeFile(variableJsonPath, variableJsonFile, (err) => {
//               if (err) throw err;
//               console.log("√ " + variableJsonPath + " 系统模板创建完成！");
//           });
//       } else {
//           console.log("√ " + path + " 系统模板已存在！")
//       }
//     });
// });

  fs.mkdir( __dirname + "/config_variable", async (err) => {
    if ( err ) { 
      console.log(`= 文件夹 ${__dirname}/config_variable 已经存在`)
      return
    }
    console.log(`= 创建文件夹 ${__dirname}/config_variable`)
  
    let databaseInfo = {
      ip: "localhost",
      port: "3306",
      dataBaseName: "demo_db",
      userName: "root",
      password: "123456"
    }
  
    await fetch("http://blog.webfunny.cn:8030/webfunny_manage/api/db/create")
    .then(response => response.text())
    .then((res) => {
      const resObj = JSON.parse(res)
      if (resObj.data) {
        setVariableInfo(resObj.data)
      } else {
        console.log("测试数据库生成失败，请自行填写数据库配置")
        setVariableInfo(databaseInfo)
      }
    }).catch((e) => {
      console.log("测试数据库生成失败，请自行填写数据库配置")
      setVariableInfo(databaseInfo)
    })
  
    
  });

/**
 * 初始化alarm目录
 */
var alarmPathArray = [__dirname + "/alarm/alarmName.js", __dirname + "/alarm/dingding.js", __dirname + "/alarm/feishu.js",__dirname + "/alarm/weixin.js", __dirname + "/alarm/index.js",]
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
  const feiShu = require('../alarm/feishu')
  const Utils = require('../util/utils')
  const AccountConfig = require('../config/AccountConfig')
  const { accountInfo } = AccountConfig
  const AlarmNames = require('./alarmName')
  
  const alarmCallback = (noticeWay, content, users) => {
    /**生成警报配置 多种 */
    //{ type: "email" },
    //{ type: "robot", robotType: "dingding", webhook: "" }
    const noticeConfigArr = JSON.parse(noticeWay)

    // 添加用户手机号
    let atMemberPhone = []
    users.forEach((user) => {
        atMemberPhone.push(user.phone)
    })
    dingDing.config.at.atMobiles = atMemberPhone
    weiXin.config.text.mentioned_mobile_list = atMemberPhone
    // 生成警报内容
    dingDing.config.text.content = content
    weiXin.config.text.content = content
    feiShu.config.content.text = content

    noticeConfigArr.forEach((noticeConfig) => {
        if(noticeConfig.type === 'robot'){
            switch(noticeConfig.robotType) {
                case "dingding":
                    // 1. 通知钉钉机器人
                    Utils.postJson(noticeConfig.webhook, dingDing.config)  // 钉钉机器人
                    break
                case "weixin":
                    // 2. 通知微信机器人
                    Utils.postJson(noticeConfig.webhook, weiXin.config)  // 微信机器人
                    break
                case "feishu":
                    // 3. 通知飞书机器人
                    Utils.postJson(noticeConfig.webhook, feiShu.config)  // 飞书机器人
                    break
            }
        }else{
            // 5. 发送邮件通知
            const { useCusEmailSys, emailUser, emailPassword} = accountInfo
            if (useCusEmailSys === true) {
                // 使用用户的邮箱系统
                if (users && users.length) {
                    users.forEach((user) => {
                        const email = user.email
                        sendEmail(email,  "警报！", content, emailUser, emailPassword)
                    })
                }
            } else {
                // 使用webfunny的邮箱系统
                if (users && users.length) {
                    users.forEach((user) => {
                        const email = user.email
                        Utils.sendWfEmail(email, "警报！", content)
                    })
                }
            }
        }
    })
}
module.exports = {
    alarmCallback
}`,
]

fs.mkdir( __dirname + "/alarm", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${__dirname}/alarm 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${__dirname}/alarm`)
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

/**
 * 初始化util_cus目录
 */
var cusUtilPathArray = [__dirname + '/util_cus/index.js', __dirname + '/util_cus/sendEmail.js']
var cusUtilFileArray = [
  `const sendEmail = require("./sendEmail")

  module.exports = {
      sendEmail
  }`,
  `const nodemailer = require('nodemailer')
  const AccountConfig = require('../config/AccountConfig')
  const { accountInfo } = AccountConfig
  /**
   * 自己配置邮箱：在 bin/useCusEmailSys.js文件中 参数改为true，并配置自己的163邮箱和密码
   * @param targetEmail 目标邮箱地址
   * @param emailTitle 邮件标题
   * @param emailContent 邮件正文
   * @param user 系统邮箱地址（不传参，则默认使用配置的邮箱地址）
   * @param pass 系统邮箱密码（不传参，则默认使用配置的邮箱密码）
   */
  const sendEmail = (targetEmail, emailTitle, emailContent, user = accountInfo.emailUser, pass = accountInfo.emailPassword) => {
      const company = "webfunny"
      let transporter = nodemailer.createTransport({
          host: "smtp.163.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: { user,pass }
      });
      // send mail with defined transport object
      transporter.sendMail({
          from: "'" + company + "' <" + user + ">", // sender address
          to: targetEmail, // list of receivers
          subject: emailTitle, // Subject line
          text: emailContent, // plain text body
          html: emailContent // html body
      });
  }
  module.exports = sendEmail`
]
fs.mkdir( __dirname + "/util_cus", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${__dirname}/util_cus 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${__dirname}/util_cus`)
  }
  cusUtilPathArray.forEach((path, index) => {
      fs.readFile(path, "", (err) => {
          if (err) {
              console.log("× " + path + " 配置文件不存在，即将创建...")
              fs.writeFile(path, cusUtilFileArray[index], (err) => {
                  if (err) throw err;
                  console.log("√ " + path + " 配置文件创建完成！");
              });
          } else {
              console.log("√ " + path + " 配置文件已存在！")
          }
      });
  })
});

/**
 * 初始化interceptor目录
 */
// 初始化interceptor/config目录

var configArray = [__dirname + "/interceptor/config/dingRobot.js", __dirname + "/interceptor/config/consoleError.js", __dirname + "/interceptor/config/httpError.js", __dirname + "/interceptor/config/jsError.js", __dirname + "/interceptor/config/resourceError.js"]
var configConArray = [
  `/**
  * 这里是钉钉机器人（关键字）的相关配置
  * 关键字列表： 
  * 1. 发生了一个
  * 2. JS错误数量达到
  * 3. JS错误率达到
  * 4. 自定义异常数量达到
  * 5. 自定义异常率达到
  * 6. 接口报错数量达到
  * 7. 接口报错率达到
  * 8. 静态资源错误量达到
  * 9. 静态资源错误率达到
  */
 module.exports = {
     url: "", // 钉钉机器人的URL
     config: {
         "msgtype": "text",
         "text": {
             "content": ""
         },
         "at": {
             "atMobiles": [    // 想要@的成员列表
                 "18501754111"
             ], 
             "isAtAll": false  // 是否@所有人
         }
       }
 }
 `,
 `/**
 * consoleError异常报警配置
 */
 module.exports = {
     errorCount: 100,
     errorPercent: 10  // 这里是百分比
 }`,
 `/**
 * consoleError异常报警配置
 */
 module.exports = {
     errorCount: 100,
     errorPercent: 10  // 这里是百分比
 }`,
 `/**
 * JS异常报警配置
 */
 module.exports = {
     errorCount: 100,
     errorPercent: 10  // 这里是百分比
 }`,
 `/**
 * resourceError异常报警配置
 */
 module.exports = {
     errorCount: 100,
     errorPercent: 10  // 这里是百分比
 }`
]

// 初始化interceptor警报文件
var interceptorArray = [__dirname + "/interceptor/index.js", __dirname + "/interceptor/customerWarning.js", __dirname + "/interceptor/httpRequest.js", __dirname + "/interceptor/javascriptError.js", __dirname + "/interceptor/resourceError.js"]
var interceptorConArray = [
  `const handleResultWhenJavascriptError = require('../interceptor/javascriptError')
  const handleResultWhenHttpRequest = require('../interceptor/httpRequest')
  const handleResultWhenResourceError = require('../interceptor/resourceError')
  
  module.exports = {
      handleResultWhenJavascriptError, handleResultWhenHttpRequest, handleResultWhenResourceError
  }`,
  `/**
  * 这里是使用者自定义的回调方法，每隔10分钟会调用一次。
  * 由你们自行决定如何发起警报，通过接口通知你们自己的服务即可。
  * @param res 参数返回所有的警告信息。
  * 无论你想发送到邮箱，短信，钉钉等，你们自己发送接口通知吧。
  */
 const jsError = require('./config/jsError')
 const consoleError = require('./config/consoleError')
 const httpError = require('./config/httpError')
 const resourceError = require('./config/resourceError')
 const dingRobot = require("./config/dingRobot")
 const AccountConfig = require('../config/AccountConfig')
 const { accountInfo } = AccountConfig
 const Utils = require('../util/utils')
 const customerWarningCallback = (warningInfoList) => {
    if (warningInfoList !== "undefined" && warningInfoList.length > 0) {
        warningInfoList.forEach((item) => {
            const { webMonitorId, hour, uv, jsErrorCount, consoleErrorCount, resourceErrorCount, httpErrorCount, jsErrorUvCount, consoleErrorUvCount, resourceErrorUvCount, httpErrorUvCount } = item
            
            todayUvCount = parseInt(uv, 10)
            let jsErrorPercent = todayUvCount > 0 ? jsErrorUvCount / todayUvCount : 0
            let consoleErrorPercent = todayUvCount > 0 ? consoleErrorUvCount / todayUvCount : 0
            let resourceErrorPercent = todayUvCount > 0 ? resourceErrorUvCount / todayUvCount : 0
            let httpErrorPercent = todayUvCount > 0 ? httpErrorUvCount / todayUvCount : 0

            jsErrorPercent = Utils.toFixed(jsErrorPercent * 100, 2)
            consoleErrorPercent = Utils.toFixed(consoleErrorPercent * 100, 2)
            resourceErrorPercent = Utils.toFixed(resourceErrorPercent * 100, 2)
            httpErrorPercent = Utils.toFixed(httpErrorPercent * 100, 2)

            let warnMsg = ""
            if (jsErrorCount >= jsError.errorCount || jsErrorPercent >= jsError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\nJS错误率达到：" + jsErrorPercent + "%\\r\\nJS错误量达到：" + jsErrorCount + "\\r\\n 查看详情：http://" + accountInfo.localAssetsDomain + "/webfunny_event/javascriptError.html"
                warnMsg = config.text.content
                global.eventInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config) // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (consoleErrorCount >= consoleError.errorCount || consoleErrorPercent >= consoleError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n自定义异常率达到：" +consoleErrorPercent + "%\\r\\n自定义异常量达到：" +consoleErrorCount + "\\r\\n 查看详情：http://" + accountInfo.localAssetsDomain + "/webfunny_event/javascriptError.html"
                warnMsg = config.text.content
                global.eventInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config)  // 钉钉机器人
                
                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (httpErrorCount >= httpError.errorCount || httpErrorPercent >= httpError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n接口报错率达到：" + httpErrorPercent + "%\\r\\n接口报错量达到：" + httpErrorCount + "\\r\\n 查看详情：http://" + accountInfo.localAssetsDomain + "/webfunny_event/httpError.html"
                warnMsg = config.text.content
                global.eventInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config)  // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (resourceErrorCount >= resourceError.errorCount || resourceErrorPercent >= resourceError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n静态资源错误率达到：" + resourceErrorPercent + "%\\r\\n静态资源错误量达到：" + resourceErrorCount + "\\r\\n查看详情：http://" + accountInfo.localAssetsDomain + "/webfunny_event/resourceError.html"
                warnMsg = config.text.content
                global.eventInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config)  // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
        })
    }
 
 }
 
 module.exports = {
     customerWarningCallback
 }`,
 `const Utils = require('../util/utils');
 const dingRobot = require("./config/dingRobot")
 const AccountConfig = require('../config/AccountConfig')
 const { accountInfo } = AccountConfig
 /**
  * 这里是接口的拦截器的拦截器。
  * 每次上报接口日志，都会调用这个方法（可以处理报错，超时等等）
  */
 const handleResultWhenHttpRequest = (res) => {
     // console.log(res) // 打印查看其他字段
     const {webMonitorId, statusResult, status, loadTime, simpleUrl, httpUrl } = res
     const simpleHttpUrl = Utils.b64DecodeUnicode(httpUrl)
     if (statusResult === "请求返回") {
         switch(status) {
             case 200:
                 break;
             case 404:
             case 500:
             case 502:
                 const {url, config} = dingRobot
                 config.text.content = "您的前端项目（" + webMonitorId + "）发生了一个接口错误：\\r\\n状态：" + status + "\\r\\n接口：" + simpleHttpUrl + "\\r\\n页面：" + simpleUrl + "\\r\\n查看详情：http://" + accountInfo.localAssetsDomain + "/webfunny_event/httpError.html"
                 Utils.postJson(url,config) // 通知机器人

                 // 如果需要其他通知方式，请在此完成报警逻辑
                 break;
             default:
                 break;
         }
 
         // 接口耗时大于10s
         if (loadTime > 10000) {
             // 填写你的逻辑
         }
     }
 }
 
 module.exports = handleResultWhenHttpRequest`,
 `const Utils = require('../util/utils');
 const dingRobot = require("./config/dingRobot")
 const AccountConfig = require('../config/AccountConfig')
 const { accountInfo } = AccountConfig
 /**
  * 这里是js错误的拦截器。
  * 每次发生js报错，都会调用这个方法
  */
 const handleResultWhenJavascriptError = (res) => {
     /**
      * webMonitorId: 每个项目对应的id，如果需要特殊处理某个项目，就可以用它
      * infoType: 错误类型，on_error、console_error
      * errorMessage: 错误消息
      */
     // console.log(res) // 打印查看其他字段
     const {webMonitorId, infoType, errorMessage, simpleUrl} = res
 
     const tempErrorMessage = Utils.b64DecodeUnicode(errorMessage)
     const msgArr = tempErrorMessage.split(": ")
     const type = msgArr[0] || msgArr[1] || msgArr[2] || ""
 
     const errorObj = {
         type,
         logData: res
     }
     global.eventInfo.errorLogListForLast200.push(errorObj)
     
     if (infoType === "on_error") {
         // 根据错误类型处理
         switch(type) {
             case "TypeError":
             case "ReferenceError":
             case "UncaughtInPromiseError":
                     const {url, config} = dingRobot
                     config.text.content = "您的前端项目（" + webMonitorId + "）发生了一个错误：\\r\\n类型：" + type + "\\r\\n信息：" + tempErrorMessage + "\\r\\n页面：" + simpleUrl + "\\r\\n查看详情：http://" + accountInfo.localAssetsDomain + "/webfunny_event/javascriptErrorDetail.html?infoType=" + infoType + "&timeType=0&errorMsg=" + errorMessage
                     Utils.postJson(url,config) // 通知机器人

                     // 如果需要其他通知方式，请在此完成报警逻辑
                 break;
             case "Script error.":
                 break;
             default:
                 break;  
         }
     } else if (infoType === "console_error") {
         // 这里是自定义报错：捕获的都是 console.error 打印的错误
     }
 }
 
 module.exports = handleResultWhenJavascriptError`,
 `/**
 * 这里是静态资源错误的拦截器。
 * 每次发生静态资源报错，都会调用这个方法
 */
const handleResultWhenResourceError = (res) => {
    // console.log(res) // 打印查看其他字段
    const {webMonitorId, sourceUrl, simpleUrl, happenDate} = res
    // 下方书写自己的逻辑
    const errorObj = {
        type: "resourceError",
        logData: res
    }
}

module.exports = handleResultWhenResourceError`
]

fs.mkdir( __dirname + "/interceptor", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${__dirname}/interceptor 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${__dirname}/interceptor`)
  }
  interceptorArray.forEach((path, index) => {
      fs.readFile(path, "", (err) => {
          if (err) {
              console.log("× " + path + " 配置文件不存在，即将创建...")
              fs.writeFile(path, interceptorConArray[index], (err) => {
                  if (err) throw err;
                  console.log("√ " + path + " 配置文件创建完成！");
              });
          } else {
              console.log("√ " + path + " 配置文件已存在！")
          }
      });
  })

  fs.mkdir( __dirname + "/interceptor/config", function(err){
    if ( err ) { 
      console.log(`= 文件夹 ${__dirname}/interceptor/config 已经存在`)
    } else {
      console.log(`= 创建文件夹 ${__dirname}/interceptor/config`)
    }
    configArray.forEach((path, index) => {
        fs.readFile(path, "", (err) => {
            if (err) {
                console.log("× " + path + " 配置文件不存在，即将创建...")
                fs.writeFile(path, configConArray[index], (err) => {
                    if (err) throw err;
                    console.log("√ " + path + " 配置文件创建完成！");
                });
            } else {
                console.log("√ " + path + " 配置文件已存在！")
            }
        });
    })
  });
});