/*!
 * APM Server with ClickHouse
 * Copyright (c) 2021-2025 上海快快查信息科技有限公司
 * 品牌：Webfunny
 * 
 * 版权所有，保留所有权利
 * 未经许可不得使用、复制、修改或分发本软件
 * 
 * https://www.webfunny.com
 */

require("colors")
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const httpRoute = require('./router')
const log = require("./config/log")
let WebSocket = require("koa-websocket");
const statusCode = require('./util/status-code')
const auth = require('./middlreware/auth')
const sqlCheck = require('./middlreware/sqlCheck')
const app = WebSocket(new Koa())
// const fundebug = require("fundebug-nodejs");
// fundebug.apikey="79b855b16c8daa6b28bccf99e22c20a9b18ecfbde2b7576fd243335af21b8f8a";

// app.on("error", fundebug.KoaErrorHandler);

app.use(async (ctx, next) => {
    console.log(ctx.req.url)
    ctx.set("Access-Control-Allow-Origin", ctx.header.origin || "*")
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    ctx.set("Access-Control-Allow-Headers", "access-token,webfunny-secret-code,x-requested-with,Content-Type,wf-t,wf-user-info,wf-signature")
    ctx.set("Access-Control-Allow-Credentials", true)
    ctx.set("X-Powered-By", "3.2.1")
    ctx.set("Content-Type", "application/json;charset=utf-8")
    ctx.set("Connection", "close")
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200; 
    } else {
        await next();
    }
})
// 登录校验
// app.use(auth())
// middlewares
// bodyParser 跳过文件上传请求（使用 formidable 处理）
app.use(async (ctx, next) => {
    // 如果是文件上传请求，跳过 bodyParser
    if (ctx.path.includes('/api/sourceMapFile/upload')) {
        return await next();
    }
    return bodyParser({
        enableTypes: ['json', 'form', 'text'],
        formLimit: "50mb",
        jsonLimit: "50mb",
        textLimit: "50mb"
    })(ctx, next);
})

// 防sql注入
app.use(sqlCheck())

app.use(async (ctx, next) => {
    const start = new Date()
    let ms = 0
    try {
        await next();
        ms = new Date() - start
    } catch (error) {
        //记录异常日志
        log.error(ctx, error, ms);
        ctx.response.status = 500;
        ctx.body = statusCode.ERROR_500('服务器异常，请检查 logs/error 目录下日志文件', "")
    }
})

// routes
app.use(httpRoute.routes(), httpRoute.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
    log.error(ctx, err, new Date().Format("yyyy-MM-dd hh:mm:ss"))
});
app.on('UnhandledPromiseRejectionWarning', (err, ctx) => {
    console.error('UnhandledPromiseRejectionWarning error', err, ctx)
    log.error(ctx, err, new Date().Format("yyyy-MM-dd hh:mm:ss"))
});

module.exports = app
