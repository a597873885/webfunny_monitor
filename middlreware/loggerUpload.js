const fetch = require('node-fetch')
const Utils = require('../utils/utils')
module.exports = ({projectId = "webfunny_log_123", userId = Utils.getMac(), error = {message: "", stack: ""}, url = "", traceId = ""}) => {
  const message = error.message.replace(/\'/g, " ")
  const stack = error.stack.replace(/\'/g, " ")
  const { version } = Utils.getJsonData()
  fetch("https://cloud.webfunny.com/wfLog/upLogs",
  {
      method: "POST", 
      body: JSON.stringify([{
          projectId,
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
      console.log("日志上报接口报错")
      console.log(e)
  })
}