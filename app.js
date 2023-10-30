const Koa = require('koa')
// 路由
const bodyParser = require('koa-bodyparser')
const fetch = require('node-fetch')
const centerRoute = require('./servers/center/router')
const monitorRoute = require('./servers/monitor/routes')
const eventRoute = require('./servers/event/routes')
const log = require("./config/log")
const statusCode = require('./utils/status-code')
const auth = require('./middlreware/auth')
const sqlCheck = require('./middlreware/sqlCheck')
const cacheData = require('./middlreware/cacheData')
const app = new Koa()

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
app.use(auth())
// middlewares
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    formLimit: "50mb",
    jsonLimit: "50mb",
    textLimit: "50mb"
}))

// 防sql注入
app.use(sqlCheck())

// 缓存数据拦截
app.use(cacheData())

app.use(async (ctx, next) => {
    const start = new Date()
    let ms = 0
    try {
        await next();
        ms = new Date() - start
    } catch (error) {

        const message = error.message.replace(/\'/g, " ")
        const stack = error.stack.replace(/\'/g, " ")
        fetch("http://localhost:8091/wfLog/upLogs",
        {
            method: "POST", 
            body: JSON.stringify([{
                projectId: "webfunny_log_123",
                happenTime: new Date().getTime(),
                userId: "userId1",
                tags: "标签信息，可以存放无关紧要的标识",
                others: "这是其他的备注信息",
                level: "error",
                message: message,
                content: stack
            }]),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        }).catch((e) => {
            console.log("================")
            console.log(e)
        })
        console.log(error)
        //记录异常日志
        // log.error(ctx, error, ms);

        ctx.response.status = 500;
        ctx.body = statusCode.ERROR_500('服务器异常，请检查 logs/error 目录下日志文件', "")
    }
})

// routes
app.use(centerRoute.routes(), centerRoute.allowedMethods())
app.use(monitorRoute.routes(), monitorRoute.allowedMethods())
app.use(eventRoute.routes(), eventRoute.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app

