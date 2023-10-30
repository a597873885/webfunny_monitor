const timerUtil = require("../../util/timer")
const Utils = require('../../util/utils')
global.CacheDataList = {}
//启动一个定时器，每分钟清理一次
timerUtil((time) => {
  const minuteTimeStr = time.Format("mm:ss")
  // console.log(minuteTimeStr, global.CacheDataList)
  // 每隔1分钟执行, 清理缓存数据
  if (minuteTimeStr.substring(3) == "00") {
    // 即将执行清理
    global.CacheDataList = {}
  }
})
const HandleCache = {
  cacheData: (ctx, webMonitorId, data) => {
    let wfParam = {}
    const { method, url, body } = ctx.request
    if (method.toLowerCase() === "get") {
      wfParam = Utils.parseQs(url)
    } else {
      wfParam = typeof body === "string" ? JSON.parse(body) : body
    }
    // console.log("===============", url)
    if (!global.CacheDataList[webMonitorId]) {
      global.CacheDataList[webMonitorId] = {}
    }
    // 把参数和结果都存进去
    global.CacheDataList[webMonitorId][url] = {
      param: wfParam,
      data
    }
    // console.log(global.CacheDataList[webMonitorId])
  }
}
module.exports = HandleCache