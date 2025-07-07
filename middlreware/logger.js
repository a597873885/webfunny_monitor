/**
 * 日志中间件
 */
const WebfunnyConfig = require("../webfunny.config")
const { otherConfig, domainConfig } = WebfunnyConfig
const statusCode = require('../utils/status-code')
const loggerUpload = require("./loggerUpload")
const log = require("../config/log")
const Utils = require("../utils/utils")
const UpEvents = require("../config/upEvents")

// 批量上报配置
const BATCH_CONFIG = {
  maxBatchSize: 100,           // 批量上报的最大数量
  maxWaitTime: 30000,         // 最大等待时间(30秒)
  batchCache: [],             // 缓存数组
  timer: null                 // 定时器
}

// 批量上报函数
function batchReport() {
  if (BATCH_CONFIG.batchCache.length > 0) {
    const dataToSend = [...BATCH_CONFIG.batchCache] // 复制数组
    BATCH_CONFIG.batchCache = [] // 清空缓存
    
    // 清除定时器
    if (BATCH_CONFIG.timer) {
      clearTimeout(BATCH_CONFIG.timer)
      BATCH_CONFIG.timer = null
    }
    
    // 批量上报
    UpEvents.apiRecord(dataToSend)
    console.log(`批量上报API调用记录，数量: ${dataToSend.length}`)
  }
}

// 添加数据到批量缓存
function addToBatch(data) {
  BATCH_CONFIG.batchCache.push(data)
  
  // 如果达到最大批量大小，立即上报
  if (BATCH_CONFIG.batchCache.length >= BATCH_CONFIG.maxBatchSize) {
    batchReport()
    return
  }
  
  // 如果还没有定时器，设置一个定时器
  if (!BATCH_CONFIG.timer) {
    BATCH_CONFIG.timer = setTimeout(() => {
      batchReport()
    }, BATCH_CONFIG.maxWaitTime)
  }
}

module.exports = function () {
    return async function (ctx, next) {
        const { url, query } = ctx
        // 如果是上报接口，则直接过滤
        if (url.indexOf("wfLog/upLogs") !== -1) {
          await next();
          return
        }

        const { body } = ctx.request
        const wfTraceId = ctx.header['wf-t'] || Utils.getUuid()  // 获取traceId
        
        const start = new Date()
        let ms = 0
        try {
          await next();
          ms = new Date() - start

          if (
            otherConfig.isCloud === true &&
            url.indexOf("wfMonitor/upLogs") === -1 &&
            url.indexOf("wfMonitor/initCf") === -1 &&
            url.indexOf("wfEvent/upEvents") === -1 &&
            url.indexOf("wfEvent/initCf") === -1 &&
            url.indexOf("wfLog/upLogs") === -1
          ) {
            // 云服务模式下，并且是非上报接口
            const urlName = url.split("?")[0]
            const apiRecordData = {
              "jieKouMingCheng": Utils.b64EncodeUnicode(urlName),
              "jieKouDiZhi": Utils.b64EncodeUnicode(url),
              "qingQiuHaoShi": ms,
              "jieKouYuMing": Utils.b64EncodeUnicode(domainConfig.host.be),
              "projectId": "event_20250628_174708794_pro",
              "pointId": 531
            }
            
            // 添加到批量缓存中，而不是立即上报
            addToBatch(apiRecordData)
          }

        } catch (error) {

          let errorRes = ""
          let errorMsg = "服务器异常，请检查 logs/error 目录下日志文件"
          if (otherConfig.uploadServerErrorToWebfunny === true) {
            loggerUpload.trace({
              projectId: "webfunny_log_sys",
              url,
              error,
              traceId: wfTraceId
            })
            errorRes = {traceId: wfTraceId}
            errorMsg = "服务器异常，请查看错误日志"
          } else {
            log.error(error)
          }
          ctx.response.status = 500;
          ctx.body = statusCode.ERROR_500(errorMsg, errorRes)
        }
    }
}

// 进程退出时，确保剩余数据被上报
process.on('beforeExit', () => {
  if (BATCH_CONFIG.batchCache.length > 0) {
    batchReport()
  }
})

process.on('SIGINT', () => {
  if (BATCH_CONFIG.batchCache.length > 0) {
    batchReport()
  }
  process.exit(0)
})

process.on('SIGTERM', () => {
  if (BATCH_CONFIG.batchCache.length > 0) {
    batchReport()
  }
  process.exit(0)
})
