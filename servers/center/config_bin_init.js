var fs = require('fs');
const fetch = require('node-fetch')

// 初始化bin目录
const setVariableInfo = (databaseInfo) => {
  const variableJsonPath = __dirname + "/config_variable/config.json"
  fs.readFile(variableJsonPath, "", (err) => {
    if (err) {
        console.log("× " + variableJsonPath + " 配置文件不存在，即将创建...")
        var variableJsonFile = `{
          "domain": {
            "localAssetsDomain": "localhost:8020",
            "localServerDomain": "localhost:8021",
            "localAssetsPort": "8020",
            "localServerPort": "8021",
            "mainDomain": ""
          },
          "monitorDomain": {
            "localAssetsDomain": "localhost:8022"
            "localServerDomain": "localhost:8023",
          },
          "eventDomain": {
            "localAssetsDomain": "localhost:8024",
            "localServerDomain": "localhost:8025"
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
          "business": {
            "userStayTimeScope": {
              "min": 100,
              "max": 100000
            }
          },
          "registerEntry": true,
          "resetPwdEntry": true,
          "ssoCheckUrl": "",
          "activationRequired": true,
          "emailNeeded": {
            "need": true,
            "requireVerify": true
          },
          "phoneNeeded": {
            "need": true,
            "requireVerify": false
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
 * 初始化sso目录
 */
var ssoPathArray = [__dirname + "/sso/feishu.js", __dirname + "/sso/index.js"]
var ssoFileArray = [
  `module.exports = {
    appId: "",
    appSecret: "",
    redirectUri: "http://127.0.0.1:8008/webfunny_center/ssoLoading.html?ssoType=feishu",
    jsSdk: "https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.23.js",
    getTenantTokenConfig: {
      method: "post",
      url: "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    },
    getAppTokenConfig: {
      method: "post",
      url: "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal"
    },
    getUserTokenConfig: {
      method: "post",
      url: "https://open.feishu.cn/open-apis/authen/v1/access_token"
    },
    getJsTicketConfig: {
      method: "get",
      url: "https://open.feishu.cn/open-apis/jssdk/ticket/get"
    },
    getUserInfoConfig: {
      method: "get",
      url: "https://open.feishu.cn/open-apis/authen/v1/user_info"
    },
  }`,
  `const feiShuConfig = require('./feishu')
  module.exports = {
    feiShuConfig
  }`,
]

fs.mkdir( __dirname + "/sso", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${__dirname}/sso 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${__dirname}/sso`)
  }
  ssoPathArray.forEach((path, index) => {
      fs.readFile(path, "", (err) => {
          if (err) {
              console.log("× " + path + " 配置文件不存在，即将创建...")
              fs.writeFile(path, ssoFileArray[index], (err) => {
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