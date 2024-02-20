const Utils = require('../util/utils')
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
        ctx.wfParam = wfParam
        await next()
    }   
}
