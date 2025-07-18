const Koa = require('koa')
const ReWriteConsole = require('./utils/rewriteConsole')
// 路由
const bodyParser = require('koa-bodyparser')
const centerRoute = require('./servers/center/router')
const monitorRoute = require('./servers/monitor/router')
const eventRoute = require('./servers/event/router')
const loggerRoute = require('./servers/logger/router')
const log = require("./config/log")
const statusCode = require('./utils/status-code')
const auth = require('./middlreware/auth')
const sqlCheck = require('./middlreware/sqlCheck')
const cacheData = require('./middlreware/cacheData')
const logger = require('./middlreware/logger')
const loggerUpload = require('./middlreware/loggerUpload')
const app = new Koa()

// import skAgent from 'skywalking-backend-js'
// skAgent.start({
//     serviceName: 'Webfunny服务端',
//     serviceInstance: 'webfunny-cloud-global',
//     collectorAddress: 'localhost:9011',
// });

// 重写 console.log
ReWriteConsole()

app.use(async (ctx, next) => {
    // const originReg = /^https?:\/\/([a-zA-Z0-9-]+\.)*xxx-data\.cn(?::\d+)?$/;
    // const origin = ctx.headers.origin;
    // if (origin && originReg.test(origin)) {
    //     ctx.set('Access-Control-Allow-Origin', origin);
    // }

    // 当ctx.headers.origin包含xxx.com时，允许访问
    

    ctx.set("Access-Control-Allow-Origin", ctx.header.origin || "*")
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    ctx.set("Access-Control-Allow-Headers", "access-token,webfunny-secret-code,x-requested-with,Content-Type,wf-t,wf-user-info,wf-signature,sw8")
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

app.use(async (ctx, next) => {
    const start = new Date()
    let ms = 0
    await next();
    // try {
    //     await next();
    //     ms = new Date() - start
    // } catch (error) {
    //     //记录异常日志
    //     console.log(error)
    //     log.error(ctx, error, ms);
    //     ctx.response.status = 500;
    //     ctx.body = statusCode.ERROR_500('服务器异常，请检查 logs/error 目录下日志文件', "")
    // }
})

// routes
app.use(centerRoute.routes(), centerRoute.allowedMethods())
app.use(monitorRoute.routes(), monitorRoute.allowedMethods())
app.use(eventRoute.routes(), eventRoute.allowedMethods())
app.use(loggerRoute.routes(), loggerRoute.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.log("server error", err)
});

module.exports = app

