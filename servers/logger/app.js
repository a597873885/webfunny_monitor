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
    ctx.set("Access-Control-Allow-Origin", ctx.header.origin || "*")
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    ctx.set("Access-Control-Allow-Headers", "access-token,webfunny-secret-code,x-requested-with,Content-Type")
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
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    formLimit: "50mb",
    jsonLimit: "50mb",
    textLimit: "50mb"
}))

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
