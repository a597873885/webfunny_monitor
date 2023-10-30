var fs = require('fs');
const fetch = require('node-fetch')
const path = require('path')
const rootPath = path.resolve(__dirname, "..")
// 初始化bin目录
const setVariableInfo = (databaseInfo, inputPurchaseCode) => {
  const variableJsonPath = rootPath + "/webfunny.config.js"
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
* monitor：前端监控数据库（与应用中心共用）
* event: 埋点系统数据库
* 配置更改后，需重启
*/
const mysqlConfig = {
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
  "activationRequired": false,
  "emailNeeded": {
    "need": true,
    "requireVerify": true
  },
  "phoneNeeded": {
    "need": true,
    "requireVerify": false
  }
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
  // 获取数据库配置信息
  await fetch("http://blog.webfunny.cn:8030/webfunny_manage/api/db/create")
  .then(response => response.text())
  .then((res) => {
    const resObj = JSON.parse(res)
    if (resObj.data) {
    //   setVariableInfo(resObj.data)
      databaseInfo = resObj.data
    } else {
      console.log("测试数据库生成失败，请自行填写数据库配置")
    //   setVariableInfo(databaseInfo)
    }
  }).catch((e) => {
    console.log("测试数据库生成失败，请自行填写数据库配置")
    // setVariableInfo(databaseInfo)
  })
  
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
  setVariableInfo(databaseInfo, inputPurchaseCode)
}

run()