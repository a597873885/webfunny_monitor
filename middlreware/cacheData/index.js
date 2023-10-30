/**
 * 部分接口数据做缓存
 */
const Utils = require('../../utils/utils')
const statusCode = require('../../utils/status-code')

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
      let wfParam = {}
      const { method, url, body } = ctx.request
      if (method.toLowerCase() === "get") {
          wfParam = Utils.parseQs(url)
      } else {
          wfParam = typeof body === "string" ? JSON.parse(body) : body
      }
      // 自动解析参数
      ctx.wfParam = wfParam
      const { webMonitorId } = wfParam
      // 被缓存数据拦截，不再进入真正的查询逻辑
      if (global.CacheDataList && global.CacheDataList[webMonitorId] && global.CacheDataList[webMonitorId][url]) {
        const result = global.CacheDataList[webMonitorId][url]
        const { param, data } = result
        let flag = true
        for (let key in param) {
          if (wfParam[key] === undefined || param[key] !== wfParam[key]) {
            flag = false
          }
        }
        // url和参数都一样，则使用缓存的数据
        if (flag === true) {
          ctx.response.status = 200;
          ctx.body = statusCode.SUCCESS_200('success', data);
          return
        }
        
      }

      await next();
    }
}
