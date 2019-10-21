const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const index = require('./routes/index')
const err = require('./middlreware/error')
const log = require("./config/log")

// error handler
onerror(app)

app.use(err())

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    ctx.set("Access-Control-Allow-Credentials", true)
    ctx.set("X-Powered-By", "3.2.1")
    ctx.set("Content-Type", "application/json;charset=utf-8")
    await next()
})
// app.use(cors())
// 过滤不用jwt验证
// app.use(jwt({secret: secret.sign}).unless({
//     path: [
//         /^\/api\/v1\/*/,
//     ]
// }))

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text'],
    formLimit: "5mb",
    jsonLimit: "5mb",
    textLimit: "5mb"
}))
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    // await next()
    // const ms = new Date() - start
    // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    let ms = 0
    try {
        //开始进入到下一个中间件
        await next();
        ms = new Date() - start
        //记录响应日志
        // log.info(ctx, ms);
    } catch (error) {
        //记录异常日志
        log.error(ctx, error, ms);
    }
    console.log(`${ctx.req.method} ${ctx.req.url} - ${ms}ms`)
})

// routes
app.use(index.routes())
app.use(index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
