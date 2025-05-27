const fetch = require('node-fetch')
const Utils = require('../utils/utils')
const WebfunnyConfig = require("../webfunny.config")
const { domainConfig } = WebfunnyConfig
module.exports = {
  // 错误追踪
  trace: ({projectId = "webfunny_log_123", userId = Utils.getMac(), error = {message: "", stack: ""}, url = "", traceId = ""}) => {
    let message = ""
    let stack = ""
    try {
      if (error.message && typeof error.message === "string") {
        message = error.message.replace(/\'/g, " ")
      }
      if (error.stack && typeof error.stack === "string") {
        message = error.stack.replace(/\'/g, " ")
      }
    } catch(e) {
      console.log(e)
    }
    const { version } = Utils.getJsonData()

    fetch(`http://127.0.0.1:${domainConfig.port.be}/wfLog/upTraceLogs`,
    {
        method: "POST", 
        body: JSON.stringify([{
            logType: "trace",
            webMonitorId: projectId,
            version,
            traceId: traceId,
            happenTime: new Date().getTime(),
            userId,
            url: `${url}`,
            tags: "",
            others: "",
            level: "error",
            message: message,
            content: stack,
        }]),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    }).catch((e) => {
        console.log("/wfLog/upTraceLogs日志上报接口报错")
        console.log(e)
    })
  },

  // 日志
  log: ({projectId = "", userId = "", secondId = "", message = "", content = "", otherInfo = ""}) => {

    // 如果projectId为空，则不进行上报
    if (!projectId) return
    // 如果content和message都为空，则不进行上报
    if (!content && !message) return

    let finalMessage = ""
    if (typeof message === "object") {
      finalMessage = Utils.b64EncodeUnicode(JSON.stringify(message))
    } else if (typeof message === "string") {
      finalMessage = Utils.b64EncodeUnicode(message)
    } else {
      finalMessage = message
    }

    let finalContent = ""
    if (typeof content === "object") {
      finalContent = Utils.b64EncodeUnicode(JSON.stringify(content))
    } else if (typeof content === "string") {
      finalContent = Utils.b64EncodeUnicode(content)
    } else {
      finalContent = content
    }

    let finalOtherInfo = ""
    if (typeof otherInfo === "object") {
      finalOtherInfo = Utils.b64EncodeUnicode(JSON.stringify(otherInfo))
    } else if (typeof otherInfo === "string") {
      finalOtherInfo = Utils.b64EncodeUnicode(otherInfo)
    } else {
      finalOtherInfo = otherInfo
    }

    
    const { version } = Utils.getJsonData()
    fetch(`http://127.0.0.1:${domainConfig.port.be}/wfLog/upLogs`,
    {
        method: "POST", 
        body: JSON.stringify([{
          logType: "logs",
          webMonitorId: projectId,
          userId,
          secondId,
          version,
          happenTime: new Date().getTime(),
          message: finalMessage,
          content: finalContent,
          tags: "",
          thirdInfo: finalOtherInfo,
          logLevel: "log",
        }]),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    }).catch((e) => {
        console.log("wfLog/upLogs日志上报接口报错")
        console.log(e)
    })
  }
} 