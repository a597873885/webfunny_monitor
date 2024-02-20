/**
 * 判断判断是否有sql注入逻辑
 */
const statusCode = require('../util/status-code')
const { DANGER_SQL_PARAMS } = require('../config/consts')
module.exports = function () {
    return async function (ctx, next) {
        const { url, query } = ctx
        const { body } = ctx.request
        // 过滤掉一些接口
        if ( url.indexOf("upEvent") === -1) {
            let goOnFlag = true
            const tempQuery = JSON.stringify(query).toLowerCase()
            const tempBody = JSON.stringify(body).toLowerCase()
            DANGER_SQL_PARAMS.forEach((item) => {
                if (tempBody.indexOf(item) !== -1) {
                    goOnFlag = false
                } else if (tempQuery.indexOf(item) !== -1) {
                    goOnFlag = false
                }
            })
            if (!goOnFlag) {
                ctx.response.status = 413;
                ctx.body = statusCode.ERROR_413(`请求参数不合法，不能包含;,',<,>,(,)`);
                return
            }
        }
        await next();
    }
}
