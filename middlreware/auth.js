const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const verify = jwt.verify
const statusCode = require('../utils/status-code')
const ignorePaths = require('./ignorePathRes')
const { UserTokenController } = require("../servers/center/controllers/controllers.js")

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        const login_error = "登录已失效，请重新登录"
        const token = ctx.header['access-token'] || ""  // 获取jwt
        let { url } = ctx
        url = url.split("?")[0]
        // 如果是根跟路径，直接返回
        if (!token && url === "/") {
            ctx.response.status = 200;
            ctx.body = {status: "OK"}
            return
        }

        // 如果日志服务的接口，也不校验登录
        // if ( !(url.indexOf("/wfLog") === -1)) {
        //     await next();
        //     return
        // }

        // 如果是上报接口，直接通过
        if ( !(url.indexOf("upLog") === -1 &&
            url.indexOf("upMyLog") === -1 &&
            url.indexOf("upDLog") === -1 &&
            url.indexOf("upMog") === -1 &&
            url.indexOf("exportUvCountForMonth") === -1 &&
            url.indexOf("uploadExtendLog") === -1)) {
            await next();
            return
        }


        let isIgnore = false
        // 检查需要过滤的接口
        for (let i = 0; i < ignorePaths.length; i ++) {
            if (url.indexOf(ignorePaths[i]) !== -1) {
                isIgnore = true
                break
            }
        }

        // 如果是根跟路径，直接返回
        // console.log(url)
        if (!token && url === "/") {
            ctx.response.status = 200;
            ctx.body = {status: "OK"}
            return
        }

        if (isIgnore || ctx.header.host.indexOf("127.0.0.1") !== -1) {
            // 如果是接口上报，则忽略登录状态判断
            await next();
        } else {
            // if (global.monitorInfo.webfunnyTokenList.indexOf(token) === -1 && ctx.header.host !== "localhost") {
            //     ctx.response.status = 401;
            //     ctx.body = statusCode.ERROR_401("用户未登录");
            //     return
            // }
            // 第一步判断数据库中是否有登录过的token, localhost不做内存里的登录态校验
            const userTokenDetail = await UserTokenController.getUserTokenDetailByToken(token)
            if (!userTokenDetail && ctx.header.host !== "localhost") {
                ctx.response.status = 401;
                ctx.body = statusCode.ERROR_401("用户未登录");
                return
            }

            // 第二步，判断token是否合法
            await verify(token, secret.sign, async (err, decode) => {
                if (err) {
                    ctx.response.status = 401;
                    ctx.body = statusCode.ERROR_401(login_error);
                    return
                }
                const { emailName, userId, userType, nickname, companyId } = decode
                // 解密payload，获取用户名和ID
                ctx.user = {
                    emailName, userId, userType, nickname, companyId
                }
                await next();
            })
        }
    }
}
