var fs = require('fs');
var path = require('path');
const rootPath = path.resolve(__dirname, "..")


/**
 * 初始化interceptor目录
 */
// 初始化interceptor/config目录

var configArray = [rootPath + "/interceptor/config/consoleError.js", rootPath + "/interceptor/config/httpError.js", rootPath + "/interceptor/config/jsError.js", rootPath + "/interceptor/config/resourceError.js"]
var configConArray = [
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
var interceptorArray = [rootPath + "/interceptor/index.js", rootPath + "/interceptor/customerWarning.js", rootPath + "/interceptor/httpRequest.js", rootPath + "/interceptor/javascriptError.js", rootPath + "/interceptor/resourceError.js"]
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
 const dingRobot = require('../alarm/dingding')
 const WebfunnyConfig = require("../webfunny.config")
 const { domainConfig } = WebfunnyConfig
 const Utils = require('../utils/utils')
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
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\nJS错误率达到：" + jsErrorPercent + "%\\r\\nJS错误量达到：" + jsErrorCount + "\\r\\n 查看详情：http://" + domainConfig.host.fe + "/webfunny/jsError.html?activeTab=2"
                warnMsg = config.text.content
                global.monitorInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config) // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (consoleErrorCount >= consoleError.errorCount || consoleErrorPercent >= consoleError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n自定义异常率达到：" +consoleErrorPercent + "%\\r\\n自定义异常量达到：" +consoleErrorCount + "\\r\\n 查看详情：http://" + domainConfig.host.fe + "/webfunny/jsError.html?activeTab=2"
                warnMsg = config.text.content
                global.monitorInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config)  // 钉钉机器人
                
                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (httpErrorCount >= httpError.errorCount || httpErrorPercent >= httpError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n接口报错率达到：" + httpErrorPercent + "%\\r\\n接口报错量达到：" + httpErrorCount + "\\r\\n 查看详情：http://" + domainConfig.host.fe + "/webfunny/httpError.html"
                warnMsg = config.text.content
                global.monitorInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config)  // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (resourceErrorCount >= resourceError.errorCount || resourceErrorPercent >= resourceError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n静态资源错误率达到：" + resourceErrorPercent + "%\\r\\n静态资源错误量达到：" + resourceErrorCount + "\\r\\n查看详情：http://" + domainConfig.host.fe + "/webfunny/resourceError.html"
                warnMsg = config.text.content
                global.monitorInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config)  // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
        })
    }
 
 }
 
 module.exports = {
     customerWarningCallback
 }`,
 `const Utils = require('../utils/utils');
 const dingRobot = require('../alarm/dingding')
 const WebfunnyConfig = require("../webfunny.config")
 const { domainConfig } = WebfunnyConfig
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
                 config.text.content = "您的前端项目（" + webMonitorId + "）发生了一个接口错误：\\r\\n状态：" + status + "\\r\\n接口：" + simpleHttpUrl + "\\r\\n页面：" + simpleUrl + "\\r\\n查看详情：http://" + domainConfig.host.fe + "/webfunny/httpError.html"
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
 `const Utils = require('../utils/utils');
 const dingRobot = require('../alarm/dingding')
 const WebfunnyConfig = require("../webfunny.config")
 const { domainConfig } = WebfunnyConfig
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
     global.monitorInfo.errorLogListForLast200.push(errorObj)
     
     if (infoType === "on_error") {
         // 根据错误类型处理
         switch(type) {
             case "TypeError":
             case "ReferenceError":
             case "UncaughtInPromiseError":
                     const {url, config} = dingRobot
                     config.text.content = "您的前端项目（" + webMonitorId + "）发生了一个错误：\\r\\n类型：" + type + "\\r\\n信息：" + tempErrorMessage + "\\r\\n页面：" + simpleUrl + "\\r\\n查看详情：http://" + domainConfig.host.fe + "/webfunny/javascriptErrorDetail.html?infoType=" + infoType + "&timeType=0&errorMsg=" + errorMessage
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

fs.mkdir( rootPath + "/interceptor", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${rootPath}/interceptor 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${rootPath}/interceptor`)
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

  fs.mkdir( rootPath + "/interceptor/config", function(err){
    if ( err ) { 
      console.log(`= 文件夹 ${rootPath}/interceptor/config 已经存在`)
    } else {
      console.log(`= 创建文件夹 ${rootPath}/interceptor/config`)
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
})