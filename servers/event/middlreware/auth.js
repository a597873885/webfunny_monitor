const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const { ConfigModel } = require('../modules/models')
const verify = jwt.verify
const statusCode = require('../util/status-code')
// 检查登录白名单
const ignorePaths = [
    "/sysInfo", "/getConcurrencyByMinuteInHour", "/initCf", "/upEvent", "/upEvents",
    "/export", "/sdkRelease/downLoad", "/getSysInfo", "/getValidateCode",
    "/refreshValidateCode", "/login", "/register", "/registerForAdmin",
    "/sendRegisterEmail", "/resetPwd", "/projectSimpleListByWebmonitorIds",
    "/eventBaseInfo", "/storeTokenToMemory", "/upgradeVersion", "buryPointTest/searchExport"
]

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        const login_error = "登录已失效，请重新登录"
        const token = ctx.header['access-token']  // 获取jwt
        let { url } = ctx
        url = url.split("?")[0]
        // 如果是上报接口，直接通过
        if ( !(url.indexOf("upLog") === -1 &&
            url.indexOf("upMyLog") === -1 &&
            url.indexOf("upDLog") === -1 &&
            url.indexOf("upEvent") === -1 &&
            url.indexOf("upEvents") === -1 &&
            url.indexOf("upMog") === -1) ) {
            await next();
            return
        }

        let isIgnore = false
        // 检查需要过滤的接口
        for (let i = 0; i < ignorePaths.length; i++) {
            if (url.indexOf(ignorePaths[i]) !== -1) {
                isIgnore = true
                break
            }
        }

        if (isIgnore) {
            // 如果是接口上报，则忽略登录状态判断
            await next();
        } else {
            const tokenList = global.eventInfo.tokenListInMemory
            let loginName = ""

            // 第一步，判断token是否合法
            await verify(token, secret.sign, async (err, decode) => {
                if (err) {
                    ctx.response.status = 401;
                    ctx.body = statusCode.ERROR_401(login_error);
                    return
                }
                const { emailName, userId, userType, nickname } = decode
                loginName = emailName
                // 解密payload，获取用户名和ID
                ctx.user = {
                    emailName, userId, userType, token, nickname
                }
            })

            let tokenValid = false
            // 第一步判断数据库中是否有登录过的token
            if (tokenList[loginName]) {
                tokenValid = false
            } else {
                tokenValid = true
            }

            // 如果内存的token无效，则去数据库验证
            if (!tokenValid) {
                const tokenInfo = await ConfigModel.getConfigByName(loginName)
                if (tokenInfo) {
                    tokenValid = true
                } else {
                    tokenValid = false
                }
            }

            if (tokenValid === false) {
                ctx.response.status = 401;
                ctx.body = statusCode.ERROR_401("用户未登录");
            } else {
                await next();
            }
        }
    }
}
