const Koa = require('koa')
// 路由
const bodyparser = require('koa-bodyparser')
const httpRoute = require('./routes')
const wsRoute = require('./routes/ws')
const log = require("./config/log")
let WebSocket = require("koa-websocket")
const statusCode = require('./util/status-code')
const app = WebSocket(new Koa())

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    ctx.set("Access-Control-Allow-Credentials", true)
    ctx.set("X-Powered-By", "3.2.1")
    ctx.set("Content-Type", "application/json;charset=utf-8")
    await next()
})

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text'],
    formLimit: "5mb",
    jsonLimit: "5mb",
    textLimit: "5mb"
}))

app.use(async (ctx, next) => {
    const start = new Date()
    let ms = 0
    try {
        //开始进入到下一个中间件
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
app.ws.use(wsRoute.routes(), wsRoute.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
