const Koa = require('koa')
// 路由
const bodyParser = require('koa-bodyparser')
const centerRoute = require('./servers/center/router')
const monitorRoute = require('./servers/monitor/routes')
const eventRoute = require('./servers/event/routes')
const statusCode = require('./utils/status-code')
const auth = require('./middlreware/auth')
const logger = require('./middlreware/logger')
const sqlCheck = require('./middlreware/sqlCheck')
const cacheData = require('./middlreware/cacheData')
const loggerUpload = require('./middlreware/loggerUpload')
const WebfunnyConfig = require('./webfunny.config')
const { headers } = WebfunnyConfig.otherConfig.extraCors
const app = new Koa()

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", ctx.header.origin || "*")
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    ctx.set("Access-Control-Allow-Headers", "access-token,webfunny-secret-code,x-requested-with,Content-Type,wf-t" + headers)
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

// 错误日志拦截和上报
app.use(logger())

// routes
app.use(centerRoute.routes(), centerRoute.allowedMethods())
app.use(monitorRoute.routes(), monitorRoute.allowedMethods())
app.use(eventRoute.routes(), eventRoute.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
    loggerUpload({ error })
});

module.exports = app

