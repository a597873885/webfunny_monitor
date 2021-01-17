const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const util = require('util')
const verify = jwt.verify
const statusCode = require('../util/status-code')

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        const login_error = "登录已失效，请重新登录"
        const token = ctx.header['access-token']  // 获取jwt
        if (token === undefined) {
            await next();
        } else {
            await verify(token, secret.sign, async (err, decode) => {
                if (err) {
                    err.status = 401;
                    ctx.body = statusCode.ERROR_401(login_error);
                    return
                }
                const { emailName, userId, userType } = decode
                // 解密payload，获取用户名和ID
                ctx.user = {
                    emailName, userId, userType
                }
                await next();
            })
        }
    }
}
