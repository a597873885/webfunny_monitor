const statusCode = require('../util/status-code')
const Utils = require('../util/utils')

const apiPaths = [
    "/buryPointCard/create",
    "/buryPointCard/card/copy",
    "/buryPointCard/delete",
    "/buryPointCard/deleteBatch",
    "/buryPointCard/update",
    "/buryPointCard/sort",
    "/buryPointCard/order",
    "/buryPointCard/refresh",
    "/buryPointCard/moveCard",
]
module.exports = function () {
    return async function (ctx, next) {
        try {

            const { url, request } = ctx

            let isClearCache = false

            // 检查需要过滤的接口
            for (let i = 0; i < apiPaths.length; i++) {
                const tempPath = apiPaths[i]
                if (url.indexOf(tempPath) != -1) {
                    isClearCache = true
                    break
                }
            }

            // 清理缓存
            if (isClearCache === true) {
                console.log("符合接口，清理缓存")
                global.eventInfo.apiDataCache = {}
            }

            await next()

        } catch(e) {
            console.error(e)
            await next()
        }
    }
}
