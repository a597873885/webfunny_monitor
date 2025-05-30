var fs = require('fs');
const fetch = require('node-fetch')
const path = require('path')
require('colors')
const rootPath = path.resolve(__dirname, "..")
// 初始化bin目录
const setVariableInfo = (databaseInfo, clickHouseDatabaseInfo, inputPurchaseCode) => {
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
    "fe": "localhost:9010", // 前端访问域名
    "be": "localhost:9011"  // 后端接口域名
  },
  "port": {
    "fe": "9010",  // 前端启动端口号
    "be": "9011"   // 后端启动端口号
  },
  "uploadDomain": {
    "monitor": "", // 指定监控系统上报域名
    "event": ""    // 指定埋点系统上报域名
  },
}

/**
* 数据库设置
* center: 应用中心数据库
* monitor：前端监控数据库
* event: 埋点系统数据库
* monitor、event可以共用一台数据库
* 配置更改后，需重启
*/
const mysqlConfig = {
  // 应用中心(mysql)
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
  // 监控（Clickhouse）
  "monitor": {
    "write": {
      "ip": "${clickHouseDatabaseInfo.ip}",
      "port": "${clickHouseDatabaseInfo.port}",
      "dataBaseName": "${clickHouseDatabaseInfo.dataBaseName}",
      "userName": "${clickHouseDatabaseInfo.userName}",
      "password": "${clickHouseDatabaseInfo.password}"
    },
    "read": []
  },
  // 埋点（Clickhouse）
  "event": {
    "write": {
      "ip": "${clickHouseDatabaseInfo.ip}",
      "port": "${clickHouseDatabaseInfo.port}",
      "dataBaseName": "${clickHouseDatabaseInfo.dataBaseName}",
      "userName": "${clickHouseDatabaseInfo.userName}",
      "password": "${clickHouseDatabaseInfo.password}"
    },
    "read": []
  },
  // 日志（Clickhouse）
  "logger": {
    "write": {
      "ip": "${clickHouseDatabaseInfo.ip}",
      "port": "${clickHouseDatabaseInfo.port}",
      "dataBaseName": "${clickHouseDatabaseInfo.dataBaseName}",
      "userName": "${clickHouseDatabaseInfo.userName}",
      "password": "${clickHouseDatabaseInfo.password}"
    },
    "read": []
  }
}

/**
* 其他相关设置
* 配置更改后，需重启
*/
const otherConfig = {
  isCloud: false,            // 云服务模式
  "email": {
    "useCusEmailSys": false, // 是否使用用户自己公司的邮箱系统
    "emailUser": "",         // 邮箱
    "emailPassword": ""      // 密码
  },
  "protocol": "",            // 内部通讯协议（一般用不上）
  "segmentUrl": "",          // segment 上报地址，对接skyWalking
  "messageQueue": false,     // 是否开启消息队列
  "openMonitor": true,       // 是否开启可视化页面的监控
  "uploadServerErrorToWebfunny": true, // 是否上报后端错误日志至logger服务（推荐开启，便于排查问题）
  "logSaveDays": {           // 日志存储周期
    "monitor": 30,
    "event": 30,
    "logger": 3
  },
  "isOpenTodayStatistic": true, // 是否开启统计今天的数据（每小时分析一次，true：开启，false：不开启，默认开启）
  "cacheDataTime": 60,        // 开启数据缓存，单位：分钟；0代表不开启接口数据缓存；枚举：1、5、10、30、60
  "business": {
    "batchInsert": {
      "limitQueueLength": 1000  // 一次批量插入最大数量
    },
    "userStayTimeScope": {      // 记录停留时间范围（即将废弃）
      "min": 100,
      "max": 100000
    }
  },
  "printSql": {                 // 是否打印sql
    "center": false,
    "monitor": false,
    "event": false
  },
  "signature": {
    "enable": false,            // 是否开启签名
  },
  "printConsole": false,        // 是否显示console打印日志
  "registerEntry": true,        // 是否允许注册
  "resetPwdEntry": true,        // 是否允许重置密码
  "thirdLoginConfig": {
    "enable": false,            // true 直接跳转到第三方登录页面，false 显示第三方登录入口
    "text": "第三方登录",         // 第三方登录链接名称
    "link": "",                 // 第三方登录链接，如果是空，则不显示第三方入口；如果有内容，则显示第三方入口;
    "logoutLink": ""            // 第三方登出链接
  },
  "ssoCheckUrl": "",            // SSO校验URL
  "invoiceHookForDingding": "", // 开票钉钉的hook地址
  "activationRequired": false,  // 注册用户是否需要管理员激活
  "showEndTime": true,  // 是否显示到期时间
  "emailNeeded": {
    "need": true,               // 注册时，是否需要邮箱
    "requireVerify": true       // 注册时，是否需要验证邮箱的有效性
  },
  "phoneNeeded": {
    "need": true,               // 注册时，是否需要手机号
    "requireVerify": false      // 注册时，是否需要验证手机号的有效性
  },
  "extraCors": {                // 额外的cors配置
    "headers": ""
  },
  "defaultCompanyId": "1",      // 默认公司Id，用于飞书登录
  "isIpCovert": false,          // 是否开启ip地址转换，用于接口获取地理位置
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
    dataBaseName: "mysql_demo_db",
    userName: "root",
    password: "123456"
  }
  let clickHouseDatabaseInfo = {
    ip: "localhost",
    port: "3306",
    dataBaseName: "clickhouse_demo_db",
    userName: "root",
    password: "123456"
  }
  // 获取数据库配置信息
  
  let inputPurchaseCode = ""
  await fetch("http://www.webfunny.cn/config/initPurchaseCode", {webfunnyVersion: 1})
  .then(response => response.text())
  .then(async(result) => {
    const resObj = JSON.parse(result)
    inputPurchaseCode = resObj.data
  }).catch((e) => {
    console.log("webfunny启动失败了，原因可能有两种：".red)
    console.log("1. 网络异常，执行重启命令试一下$: npm run restart".red)
    console.log("2. 贵公司的环境无法访问外部网络，可在官网（www.webfunny.com）扫码联系客服获取".red)
  })

  const box = `
╔════════════════════════════════════════════初始化提示═════════════════════════════════════════════╗
║                                                                                                   ║
║ 【授权码】Webfunny私有化部署需要授权码（License），可在官网（www.webfunny.com）扫码联系客服获取。 ║
║                                                                                                   ║
║ 【数据库】系统运行需要 Mysql 数据、Clickhouse 数据库，需要提前准备好数据库连接参数！              ║
║                                                                                                   ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
`;
console.log(box.red);

  fs.mkdir( rootPath + "/webfunny.config", function(err){
    if ( err ) { 
      console.log(`= 文件夹 ${rootPath}/webfunny.config 已经存在`)
    } else {
      console.log(`= 创建文件夹 ${rootPath}/webfunny.config`)
    }
    setVariableInfo(databaseInfo, clickHouseDatabaseInfo, inputPurchaseCode)
  })
}

run()