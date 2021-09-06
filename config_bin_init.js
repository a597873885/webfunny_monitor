var fs = require('fs');

// 初始化bin目录
var pathArray = ["./bin/domain.js", "./bin/httpReqRes.js", "./bin/messageQueue.js", "./bin/mysqlConfig.js", "./bin/purchaseCode.js", "./bin/saveDays.js", "./bin/slave.js", "./bin/stayTimeScope.js", "./bin/stopWebMonitorIdList.js", "./bin/sysMonitor.js", "./bin/useCusEmailSys.js", "./bin/webfunny.js", "./bin/webMonitorIdList.js"]
var fileArray = [
    `module.exports = {
      // 1. 日志服务（接口）域名  书写形式：localhost:8011;
      // 2. 如果设置空字符串，则会使用浏览器域名
      localServerDomain: 'localhost:8011',

      // 数据可视化服务域名 书写形式：localhost:8010;
      localAssetsDomain: 'localhost:8010',
      
      // 数据可视化服务域名 书写形式：localhost:8010
      localAssetsDomain: 'localhost:8010',
      
      // 日志服务端口号
      localServerPort: '8011',
      // 可视化系统端口号
      localAssetsPort: '8010',
  
      /**
       * 注意：不懂可以不用设置，【千万不要乱设置】
       * 
       * 1. 什么情况设置：如果同一个主域名下有多个项目，并且同一个UserId的用户，会访问这多个项目
       * 2. 设置结果：使用userId查询，可以将一个用户在多个项目上的行为串联起来。
       * 
       * 例如：www.baidu.com  主域名就是：baidu.com
       */
      mainDomain: '' // 默认空字符串就行了
    }`,
    `module.exports = {
      requestTextLength: 1000,  // 接口请求参数内容长度限制
      responseTextLength: 1000,  // 接口返回结果内容长度限制
    }
    `,
    `module.exports = {
        messageQueue: false  // 是否开启消息队列，默认不开启
    }`,
    `module.exports = {
      write: {
        ip: '',
        port: '3306',
        dataBaseName: 'webfunny_db',
        userName: '',
        password: ''
      },
      // 高性能版支持此属性
      read: [
        // { host: "", username: "", password: "" }
      ]
    }`,
    `module.exports = {
        purchaseCode: '',
        secretCode: ''
    }`,
    `module.exports = {
        saveDays: '8',
    }`,
    `var app = require('../app');
    var { accountInfo } = require("../config/AccountConfig")
    
    global.serverType = "slave"
    
    var port = normalizePort(process.env.PORT || accountInfo.localServerPort);
    app.listen(port);
    
    function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        // named pipe
        return val;
      }
    
      if (port >= 0) {
        // port number
        return port;
      }
    
      return false;
    }
    `,
    `/**
      * 用户停留时间，去掉最大值，去掉最小值范围
      * 
      * 去掉最小值： 有些用户进来了就离开，可以不考虑在内
      * 去掉最大值： 有些用户进来了，处于不活跃状态，停留时间会很长，也可以去除
      */
    module.exports = {
        min: 100,     // 最小值
        max: 100000   // 最大值
    }`,
    `// 停止日志上报列表
    module.exports = []`,
    `module.exports = {
      openMonitor: true  // 企业版可关闭此选项
    }`,
    `module.exports = {
      useCusEmailSys: false,               // 是否使用自己的邮件系统, true: 使用配置的邮箱密码；false: 由webfunny系统给你发送邮件
      emailUser: "",                       // 163邮箱用户名
      emailPassword: ""                    // 163邮箱，网易老账号用密码， 新账号用安全码
    }`,
    `#!/usr/bin/env node

    var app = require('../app');
    var debug = require('debug')('demo:server');
    var compression = require('compression')
    var { accountInfo } = require("../config/AccountConfig")
    
    
    var port = normalizePort(process.env.PORT || accountInfo.localServerPort);
    app.listen(port);
    
    function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        // named pipe
        return val;
      }
    
      if (port >= 0) {
        // port number
        return port;
      }
    
      return false;
    }
    
    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }
    
      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    
      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }
    
    function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
    
    // 启动静态文件服务器
    var connect = require("connect");
    var serveStatic = require("serve-static");
    var app = connect();
    app.use(compression())
    app.use(serveStatic("./views"));
    app.listen(accountInfo.localAssetsPort);
    
    `,
    `module.exports = []`
]

fs.mkdir( "./bin", function(err){
  if ( err ) { 
    console.log("= 文件夹 /bin 已经存在")
  } else {
    console.log("= 创建文件夹 /bin")
  }
  pathArray.forEach((path, index) => {
      fs.readFile(path, "", (err) => {
          if (err) {
              console.log("× " + path + " 配置文件不存在，即将创建...")
              fs.writeFile(path, fileArray[index], (err) => {
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
 * 初始化alarm目录
 */
var alarmPathArray = ["./alarm/alarmName.js", "./alarm/dingding.js", "./alarm/index.js",]
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
      url: "", // 钉钉机器人的URL
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
  `const sendEmail = require('../util_cus/sendEmail');
  const dingDing = require('../alarm/dingding')
  const Utils = require('../util/utils')
  const alarmCallback = (project, rule) => {
      const { projectName, projectType } = project
      const {type, happenCount, compareType, limitValue} = rule
      const compareStr = compareType === "up" ? ">=" : "<"
      const {url, config} = dingDing
      config.text.content = type + "警报！" +
          "您的" + projectType + "项目【" + projectName + "】发出警报：" +
          type + "数量 " + compareStr + " " + limitValue + " 已经发生" + happenCount + "次了，请及时处理。"
      Utils.postJson(url,config)  // 钉钉机器人
      // sendEmail("收件人", type + "警报！", config.text.content, 'xxx@163.com', 'xxx')
  }
  module.exports = {
      alarmCallback
  }`,
]

fs.mkdir( "./alarm", function(err){
  if ( err ) { 
    console.log("= 文件夹 /alarm 已经存在")
  } else {
    console.log("= 创建文件夹 /alarm")
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
var cusUtilPathArray = ['./util_cus/index.js', './util_cus/sendEmail.js']
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
fs.mkdir( "./util_cus", function(err){
  if ( err ) { 
    console.log("= 文件夹 /util_cus 已经存在")
  } else {
    console.log("= 创建文件夹 /util_cus")
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

var configArray = ["./interceptor/config/dingRobot.js", "./interceptor/config/consoleError.js", "./interceptor/config/httpError.js", "./interceptor/config/jsError.js", "./interceptor/config/resourceError.js"]
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
var interceptorArray = ["./interceptor/index.js", "./interceptor/customerWarning.js", "./interceptor/httpRequest.js", "./interceptor/javascriptError.js", "./interceptor/resourceError.js"]
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
 const domain = require("../bin/domain")
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
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\nJS错误率达到：" + jsErrorPercent + "%\\r\\nJS错误量达到：" + jsErrorCount + "\\r\\n 查看详情：http://" + domain.localAssetsDomain + "/webfunny/javascriptError.html"
                warnMsg = config.text.content
                global.monitorInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config) // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (consoleErrorCount >= consoleError.errorCount || consoleErrorPercent >= consoleError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n自定义异常率达到：" +consoleErrorPercent + "%\\r\\n自定义异常量达到：" +consoleErrorCount + "\\r\\n 查看详情：http://" + domain.localAssetsDomain + "/webfunny/javascriptError.html"
                warnMsg = config.text.content
                global.monitorInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config)  // 钉钉机器人
                
                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (httpErrorCount >= httpError.errorCount || httpErrorPercent >= httpError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n接口报错率达到：" + httpErrorPercent + "%\\r\\n接口报错量达到：" + httpErrorCount + "\\r\\n 查看详情：http://" + domain.localAssetsDomain + "/webfunny/httpError.html"
                warnMsg = config.text.content
                global.monitorInfo.warningMessageList.push({msg: warnMsg, time: new Date().Format("yyyy-MM-dd hh:mm:ss")})
                Utils.postJson(url,config)  // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (resourceErrorCount >= resourceError.errorCount || resourceErrorPercent >= resourceError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）\\r\\n时间：" + hour + "\\r\\n静态资源错误率达到：" + resourceErrorPercent + "%\\r\\n静态资源错误量达到：" + resourceErrorCount + "\\r\\n查看详情：http://" + domain.localAssetsDomain + "/webfunny/resourceError.html"
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
 `const Utils = require('../util/utils');
 const dingRobot = require("./config/dingRobot")
 const domain = require('../bin/domain')
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
                 config.text.content = "您的前端项目（" + webMonitorId + "）发生了一个接口错误：\\r\\n状态：" + status + "\\r\\n接口：" + simpleHttpUrl + "\\r\\n页面：" + simpleUrl + "\\r\\n查看详情：http://" + domain.localAssetsDomain + "/webfunny/httpError.html"
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
 const domain = require('../bin/domain')
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
                     config.text.content = "您的前端项目（" + webMonitorId + "）发生了一个错误：\\r\\n类型：" + type + "\\r\\n信息：" + tempErrorMessage + "\\r\\n页面：" + simpleUrl + "\\r\\n查看详情：http://" + domain.localAssetsDomain + "/webfunny/javascriptErrorDetail.html?infoType=" + infoType + "&timeType=0&errorMsg=" + errorMessage
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

fs.mkdir( "./interceptor", function(err){
  if ( err ) { 
    console.log("= 文件夹 /interceptor 已经存在")
  } else {
    console.log("= 创建文件夹 /interceptor")
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

  fs.mkdir( "./interceptor/config", function(err){
    if ( err ) { 
      console.log("= 文件夹 /interceptor/config 已经存在")
    } else {
      console.log("= 创建文件夹 /interceptor/config")
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
