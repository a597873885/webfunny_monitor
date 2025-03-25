var fs = require('fs');
const fetch = require('node-fetch')
const path = require('path')
const rootPath = path.resolve(__dirname, "..")
// 初始化bin目录
const setVariableInfo = (databaseInfo, inputPurchaseCode) => {
  const variableJsonPath = rootPath + "/webfunny.config/index.js"
  fs.readFile(variableJsonPath, "", (err) => {
    if (err) {
        console.log("× " + variableJsonPath + " 配置文件不存在，即将创建...")
        var variableJsonFile = `/**
* 授权码设置
* monitor：前端监控
* event: 埋点系统
* 配置更改后，需重启
*/
const licenseConfig = {
  "monitor": {
    "purchaseCode": "${inputPurchaseCode}", // 监控系统授权码
    "secretCode": ""  // 解码（没有可不填）
  },
  "event": {
    "purchaseCode": "${inputPurchaseCode}", // 埋点系统授权码
    "secretCode": ""  // 解码（没有可不填）
  }
}

/**
* 域名端口设置
* 配置更改后，需重启
*/
const domainConfig = {
  "host": {
    "fe": "localhost:8010", // 前端访问域名
    "be": "localhost:8011"  // 后端接口域名
  },
  "port": {
    "fe": "8010",  // 前端启动端口号
    "be": "8011"   // 后端启动端口号
  },
  "uploadDomain": {
    "monitor": "", // 指定监控系统上报域名
    "event": ""    // 指定埋点系统上报域名
  },
}

/**
* mysql数据库设置
* center: 应用中心数据库
* monitor：前端监控数据库
* event: 埋点系统数据库
* 三个可以共用一台数据库
* 配置更改后，需重启
*/
const mysqlConfig = {
  // 应用中心
  "center": {
    "write": {
      "ip": "${databaseInfo.ip}",
      "port": "${databaseInfo.port}",
      "dataBaseName": "${databaseInfo.dataBaseName}",
      "userName": "${databaseInfo.userName}",
      "password": "${databaseInfo.password}"
    },
    "read": []
  },
  // 监控
  "monitor": {
    "write": {
      "ip": "${databaseInfo.ip}",
      "port": "${databaseInfo.port}",
      "dataBaseName": "${databaseInfo.dataBaseName}",
      "userName": "${databaseInfo.userName}",
      "password": "${databaseInfo.password}"
    },
    "read": []
  },
  // 埋点
  "event": {
    "write": {
      "ip": "${databaseInfo.ip}",
      "port": "${databaseInfo.port}",
      "dataBaseName": "${databaseInfo.dataBaseName}",
      "userName": "${databaseInfo.userName}",
      "password": "${databaseInfo.password}"
    },
    "read": []
  }
}

/**
* 其他相关设置
* 配置更改后，需重启
*/
const otherConfig = {
  "email": {
    "useCusEmailSys": false, // 是否使用用户自己公司的邮箱系统
    "emailUser": "",         // 邮箱
    "emailPassword": ""      // 密码
  },
  "protocol": "",            // 内部通讯协议（一般用不上）
  "messageQueue": false,     // 是否开启消息队列
  "openMonitor": true,       // 是否开启可视化页面的监控
  "logSaveDays": 8,          // 日志存储周期
  "isOpenTodayStatistic": true, // 
  "business": {
    "batchInsert": {
      "limitQueueLength": 1000  // 一次批量插入最大数量
    },
    "userStayTimeScope": {      // 记录停留时间范围（即将废弃）
      "min": 100,
      "max": 100000
    }
  },
  "registerEntry": true,        // 是否允许注册
  "resetPwdEntry": true,        // 是否允许重置密码
  "ssoCheckUrl": "",            // SSO校验URL
  "activationRequired": false,  // 注册用户是否需要管理员激活
  "emailNeeded": {
    "need": true,               // 注册时，是否需要邮箱
    "requireVerify": true       // 注册时，是否需要验证邮箱的有效性
  },
  "phoneNeeded": {
    "need": true,               // 注册时，是否需要手机号
    "requireVerify": false      // 注册时，是否需要验证手机号的有效性
  },
  "uploadServerErrorToWebfunny": true, // 是否上报后端错误至Webfunny服务（推荐开启，便于排查问题）
  "extraCors": {                // 额外的cors配置
    "headers": ""
  },
}
module.exports = {
  licenseConfig, domainConfig, mysqlConfig, otherConfig
}`
        fs.writeFile(variableJsonPath, variableJsonFile, (err) => {
            if (err) throw err;
            console.log("√ " + variableJsonPath + " 配置文件创建完成！");
        });
    } else {
        console.log("√ " + variableJsonPath + " 配置文件已存在！")
    }
  });
}

const run = async () => {
  let databaseInfo = {
    ip: "localhost",
    port: "3306",
    dataBaseName: "demo_db",
    userName: "root",
    password: "123456"
  }
  
  let inputPurchaseCode = ""
  await fetch("http://www.webfunny.cn/config/initPurchaseCode", {webfunnyVersion: 1})
  .then(response => response.text())
  .then(async(result) => {
    const resObj = JSON.parse(result)
    inputPurchaseCode = resObj.data
  }).catch((e) => {
    console.log("webfunny启动失败了，原因可能有两种：".red)
    console.log("1. 网络异常，执行重启命令试一下$: npm run restart".red)
    console.log("2. 贵公司的环境无法访问外部网络，无法获取授权码，请联系我们解决，微信号：webfunny2、webfunny_2020 ".red)
  })

  fs.mkdir( rootPath + "/webfunny.config", function(err){
    if ( err ) { 
      console.log(`= 文件夹 ${rootPath}/webfunny.config 已经存在`)
    } else {
      console.log(`= 创建文件夹 ${rootPath}/webfunny.config`)
    }
    setVariableInfo(databaseInfo, inputPurchaseCode)
  })
}

run()