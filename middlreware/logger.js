/**
 * 日志中间件
 */
const WebfunnyConfig = require("../webfunny.config")
const { otherConfig } = WebfunnyConfig
const statusCode = require('../utils/status-code')
const loggerUpload = require("./loggerUpload")
const log = require("../config/log")
const Utils = require("../utils/utils")
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
        } catch (error) {

          let errorRes = ""
          let errorMsg = "服务器异常，请检查 logs/error 目录下日志文件"
          if (otherConfig.uploadServerErrorToWebfunny === true) {
            loggerUpload({
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
