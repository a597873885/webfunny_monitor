const fetch = require('node-fetch')
const WebfunnyConfig = require("../webfunny.config")
const { otherConfig } = WebfunnyConfig
const Utils = require('../utils/utils')
const log = require("../config/log");
module.exports = ({projectId = "webfunny_log_123", userId = Utils.getMac(), error = {message: "", stack: ""}, url = "", traceId = ""}) => {
  const message = error.message.replace(/\'/g, " ")
  const stack = error.stack.replace(/\'/g, " ")
  if (otherConfig.uploadServerErrorToWebfunny === true) {
    fetch("https://cloud.webfunny.com/wfLog/upLogs",
    {
        method: "POST", 
        body: JSON.stringify([{
            projectId,
            traceId: traceId,
            happenTime: new Date().getTime(),
            userId,
            url: `${url}`,
            tags: "",
            others: "",
            level: "error",
            message: message,
            content: stack
        }]),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    }).catch((e) => {
        console.log("日志上报接口报错")
        console.log(e)
    })
  } else {
    // 错误日志存放本地
    log.error(ctx, error, ms);
  }
  
}