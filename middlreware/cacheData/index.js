/**
 * 部分接口数据做缓存
 */
const Utils = require('../../utils/utils')
const statusCode = require('../../utils/status-code')
const timerUtil = require("../../utils/timer")
const WebfunnyConfig = require("../../webfunny.config/index")
const crypto = require('crypto');

global.WebfunnyCacheDataList = {}

const defaultCacheDataTime = [0, 1, 5, 10, 30, 60]
//启动一个定时器，每分钟清理一次
timerUtil((time) => {
  const minuteTimeStr = time.Format("mm:ss")
  // console.log(minuteTimeStr, global.CacheDataList)
  const cacheDataTime = WebfunnyConfig.otherConfig.cacheDataTime
  if (defaultCacheDataTime.indexOf(cacheDataTime) === -1) {
    console.warn("cacheDataTime并非枚举类型，请重新设置...")
  }
  // 0、1、5、10、30、60
  switch(cacheDataTime) {
    case 1:
      // 每隔1分钟, 清理缓存数据
      if (minuteTimeStr.substring(3) == "00") {
        // 即将执行清理
        global.WebfunnyCacheDataList = {}
      }
      break
    case 5:
      // 每隔5分钟, 清理缓存数据
      if (minuteTimeStr.substring(1) == "0:00" || minuteTimeStr.substring(1) == "5:00") {
        // 即将执行清理
        global.WebfunnyCacheDataList = {}
      }
      break
    case 10:
      // 每隔10分钟, 清理缓存数据
      if (minuteTimeStr.substring(1) == "00:00") {
        // 即将执行清理
        global.WebfunnyCacheDataList = {}
      }
      break
    case 30:
      // 每隔30分钟, 清理缓存数据
      if (minuteTimeStr == "00:00" || minuteTimeStr == "30:00") {
        // 即将执行清理
        global.WebfunnyCacheDataList = {}
      }
      break
    case 60:
      // 每隔60分钟, 清理缓存数据
      if (minuteTimeStr == "00:00") {
        // 即将执行清理
        global.WebfunnyCacheDataList = {}
      }
      break
    default:
      // 即将执行清理
      global.WebfunnyCacheDataList = {}
      break
  }
  
})

// 需要缓存的接口列表
const apiPaths = [
  "/wfEvent/buryPointCard/getCardListByIds"
]
/**
 * 判断是否使用缓存数据
 */
module.exports = function () {
    return async function (ctx, next) {
      try {
        let finalProjectId = ""
        let finalApiPath = ""
        let wfParam = {}
        const { method, url, body } = ctx.request
        if (method.toLowerCase() === "get") {
            wfParam = Utils.parseQs(url)
        } else {
            wfParam = typeof body === "string" ? JSON.parse(body) : body
        }
        // 自动解析参数
        ctx.wfParam = wfParam

        // 匹配是否属于缓存接口
        const apiIndex = apiPaths.indexOf(url)
        if (apiIndex === -1 || WebfunnyConfig.cacheDataTime === 0) {
          await next()
          return
        }
        finalApiPath = apiPaths[apiIndex]

        const paramHash = crypto.createHash('md5').update(JSON.stringify(wfParam)).digest('hex');

        
        if (url.indexOf("/wfEvent/") !== -1) {
          // 埋点系统
          const { projectId } = wfParam
          finalProjectId = projectId
        } else if (url.indexOf("/wfMonitor/") !== -1) {
          // 监控系统
          const { webMonitorId } = wfParam
          finalProjectId = webMonitorId
        }

        let finalApiCacheKey = `${finalProjectId}${finalApiPath}/${paramHash}`
        // 有缓存结果
        if (global.WebfunnyCacheDataList[finalApiCacheKey]) {
          ctx.response.status = 200;
          ctx.body = statusCode.SUCCESS_200('success for cache', global.WebfunnyCacheDataList[finalApiCacheKey]);
          return
        }

        // 没有缓存结果，去接口重新获取，并将结果放入到apiCacheKey中
        ctx.apiCacheKey = finalApiCacheKey
        await next();
      } catch(e) {
        console.error(e)
        await next()
      }
    }
}
