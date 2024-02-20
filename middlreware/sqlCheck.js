/**
 * 判断判断是否有sql注入逻辑
 */
const statusCode = require('../utils/status-code')
const dangerParams = [";", "'", "<", ">", "(", ")", "update ",
                    "select ", "union ", "and ", "or ", "from ", "insert ",
                    "delete ", "database ", "drop ", "truncate ", "create ", "like "]
module.exports = function () {
    return async function (ctx, next) {
        const { url, query } = ctx
        const { body } = ctx.request
        // 过滤掉一些接口
        if ( url.indexOf("upLog") === -1 &&
            url.indexOf("upMyLog") === -1 &&
            url.indexOf("upDLog") === -1 &&
            url.indexOf("upMog") === -1 ) {
            let goOnFlag = true
            const tempQuery = JSON.stringify(query).toLowerCase()
            const tempBody = JSON.stringify(body).toLowerCase()
            dangerParams.forEach((item) => {
                if (tempBody.indexOf(item) !== -1) {
                    goOnFlag = false
                } else if (tempQuery.indexOf(item) !== -1) {
                    goOnFlag = false
                }
            })
            if (!goOnFlag) {
                ctx.response.status = 413;
                ctx.body = statusCode.ERROR_413(`请求参数不合法`);
                return
            }
        }
        await next();
    }
}
