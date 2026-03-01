// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 OpenTelemetry 初始化（必须在所有 require 之前引入）
// 配置已内联到此处，无需单独的配置文件
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { version } = require("./package.json");
const WebfunnyConfig = require("./webfunny.config");
const { initOtel } = require('./utils/webfunnyOtelTracer');
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 自动追踪加载器（必须在 Koa 等框架加载之前）
// 零侵入方案：自动包装所有 Controller 和 Model，无需修改业务代码
// 已修复：保持原方法的同步/异步特性
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { initAutoTracer } = require('./utils/webfunnyAutoTracer');

const tracingConfig = {
  ...WebfunnyConfig.otherConfig.selfMonitor,
  serviceVersion: version,
};

// 初始化 OpenTelemetry（直接传入配置）
initOtel(tracingConfig);
initAutoTracer(tracingConfig);

const Koa = require('koa')
const ReWriteConsole = require('./utils/rewriteConsole')
const otelApi = require('@opentelemetry/api')
// 路由
const bodyParser = require('koa-bodyparser')
const centerRoute = require('./servers/center/router')
const monitorRoute = require('./servers/monitor/router')
const eventRoute = require('./servers/event/router')
const loggerRoute = require('./servers/logger/router')
const apmRoute = require('./servers/apm/router')
const fileRoute = require('./servers/file/router')
const log = require("./config/log")
const statusCode = require('./utils/status-code')
const auth = require('./middlreware/auth')
const sqlCheck = require('./middlreware/sqlCheck')
const cacheData = require('./middlreware/cacheData')
const logger = require('./middlreware/logger')
const loggerUpload = require('./middlreware/loggerUpload')
const app = new Koa()

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
// app.use(logger())

app.use(async (ctx, next) => {
    const start = new Date()
    let ms = 0
    try {
        await next();
        ms = new Date() - start
    } catch (error) {
        ms = new Date() - start
        // 在 OTEL 追踪上下文中记录异常
        const activeSpan = otelApi.trace.getActiveSpan();
        if (activeSpan) {
            activeSpan.recordException(error);
            activeSpan.setStatus({ 
                code: otelApi.SpanStatusCode.ERROR, 
                message: error.message 
            });
        }
        // 记录异常日志
        log.error(ctx, error, ms);
        ctx.response.status = 500;
        ctx.body = statusCode.ERROR_500('服务器异常，请检查 logs/error 目录下日志文件', "")
    }
})

// routes
app.use(centerRoute.routes(), centerRoute.allowedMethods())
app.use(monitorRoute.routes(), monitorRoute.allowedMethods())
app.use(eventRoute.routes(), eventRoute.allowedMethods())
app.use(loggerRoute.routes(), loggerRoute.allowedMethods())
app.use(fileRoute.routes(), fileRoute.allowedMethods())
app.use(apmRoute.routes(), apmRoute.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
    console.log("server error", err)
});

module.exports = app

