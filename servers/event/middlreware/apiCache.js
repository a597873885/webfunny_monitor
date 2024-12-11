const statusCode = require('../util/status-code')
const Utils = require('../util/utils')

const apiPaths = [
    "/buryPointCard/list"
]
/**
 * 卡片查询分页接口缓存
 *
        {
           "event1029_31":{
               "param": { projectId,pageId, dateValue, queryStartDate, queryEndDate, cardPage , cardPageSize},
               "expireTime":"2024-10-20 06:00:00",
               "cardStatisticList":{list, totalCount}
           }
        }
 */
module.exports = function () {
    return async function (ctx, next) {
        try {

            const { url, request } = ctx

            let isCachePath = false
            let apiKey = ""

            // 检查需要过滤的接口
            for (let i = 0; i < apiPaths.length; i++) {
                const tempPath = apiPaths[i]
                if (url.indexOf(tempPath) != -1) {
                    isCachePath = true
                    apiKey = tempPath
                    break
                }
            }

            // 如果不是缓存接口，则直接跳过
            if (!isCachePath) {
                await next();
                return
            }

            let req = request.body
            const paramStr = typeof req === "string" ? req : JSON.stringify(req)
            const paramObj = typeof req === "string" ? JSON.parse(req) : req

            switch(apiKey) {
                case "/buryPointCard/list":

                    console.log("是否需要缓存接口：", request.method, apiKey, isCachePath)

                    const { projectId="", pageId } = paramObj
                    let apiCacheKey = `${projectId}_${pageId}_${apiKey}`

                    // 如果内存中有数据，并且参数相同，则直接返回内存中结果
                    if (global.eventInfo.apiDataCache[apiCacheKey] && global.eventInfo.apiDataCache[apiCacheKey].param === Utils.b64EncodeUnicode(paramStr)) {
                        console.log("取出缓存结果：", global.eventInfo.apiDataCache[apiCacheKey].data)
                        ctx.response.status = 200;
                        ctx.body = statusCode.SUCCESS_200('success', global.eventInfo.apiDataCache[apiCacheKey].data)
                        return
                    }

                    console.log("没有缓存结果，去接口重新获取")
                    ctx.apiCacheKey = `${projectId}_${pageId}_${apiKey}`
                    ctx.apiCacheParam = Utils.b64EncodeUnicode(paramStr)

                    await next()

                    break
                default:
                    break
            }

        } catch(e) {
            console.error(e)
            await next()
        }
    }
}
