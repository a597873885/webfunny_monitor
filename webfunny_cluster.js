#!/usr/bin/env node

var app = require('./app');
var debug = require('debug')('demo:server');
const WebfunnyConfig = require("./webfunny.config")
const { domainConfig } = WebfunnyConfig
global.serverType = "master"
const { be, fe } = domainConfig.port
var port = normalizePort(process.env.PORT || be);
const httpServer = app.listen(port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// 启动静态文件服务器
const KoaStatic = require('koa');
const appStatic = new KoaStatic();
const staticCache = require('koa-static-cache');
const send = require('koa-send'); 
/* gzip压缩配置 start */
const compress = require('koa-compress');
const path = require('path')
const fs = require('fs')
const options = { 
    threshold: 1024 //数据超过1kb时压缩
};
/* gzip压缩配置 end */

// 1.主页静态网页 把静态页统一放到public中管理
const originPath = path.resolve(__dirname, '') + '/views'
const publicServer = staticCache({dir: originPath, dynamic: true});
// 2.重定向判断
const redirect = async(ctx) => {
  ctx.response.redirect('/wf_center/main')
};
appStatic.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", ctx.header.origin || "*")
  ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  ctx.set("Access-Control-Allow-Headers", "access-token,webfunny-secret-code,x-requested-with,Content-Type,wf-t,wf-user-info,sw8")
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
// 3.分配路由
appStatic.use(compress(options))
appStatic.use(async (ctx, next) => {
  if (ctx.url === '/' || ctx.url === '/wf_center/' || ctx.url === '/wf_event/' || ctx.url === '/wf_monitor/' || ctx.url === '/wf_apm/' || ctx.url === '/wf_logger/' || ctx.url === '/wf_file/') {
    redirect(ctx)
  }

  let templateHtml = '/wf_center/index.html'
  if (ctx.url.startsWith("/wf_center/")) {
    templateHtml = '/wf_center/index.html'
  } else if (ctx.url.startsWith("/wf_event/")) {
    templateHtml = '/wf_event/index.html'
  } else if (ctx.url.startsWith("/wf_monitor/")) {
    templateHtml = '/wf_monitor/index.html'
  } else if (ctx.url.startsWith("/wf_apm/")) {
    templateHtml = '/wf_apm/index.html'
  } else if (ctx.url.startsWith("/wf_logger/")) {
    templateHtml = '/wf_logger/index.html'
  } else if (ctx.url.startsWith("/wf_file/")) {
    templateHtml = '/wf_file/index.html'
  }

  if (!ctx.url.endsWith('/') && !ctx.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/)) {  
    ctx.type = 'html'; // 设置响应类型为 html  
    ctx.body = fs.createReadStream(path.join(originPath, templateHtml));
  }
  await next()
});
appStatic.use(publicServer);
const staticFileServer = appStatic.listen(fe);

/**
 * 启动 APM 队列管理器
 * 用于批量插入数据到 ClickHouse，减少 parts 数量
 * 注意：这是数据入库的关键组件，必须启动
 */
const { queueManager } = require('./servers/apm/lib/apmQueueManager')
queueManager.startFlushTimer()

/**
 * 启动 OTEL gRPC 服务
 * 用于接收 OpenTelemetry 数据上报
 */
const { grpcServerManager } = require('./servers/apm/config/grpcServerConfig')

// 启动 OTEL gRPC 服务
grpcServerManager.startOTEL().then(otelServer => {
  // OTEL 服务启动成功
}).catch(err => {
  console.error('❌ OTEL gRPC 服务启动失败:', err)
})

/**
 * 优雅退出：关闭所有服务器连接
 */
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  // 防止重复关闭
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\n🔄 收到 ${signal} 信号，正在关闭服务...`)
  
  try {
    // 1. 先关闭 gRPC 服务器（强制关闭，立即释放端口）
    if (grpcServerManager && grpcServerManager.otelGrpcServer) {
      await grpcServerManager.otelGrpcServer.stop()
      console.log('✅ OTEL gRPC 服务已关闭')
    }
    
    // 2. 关闭静态文件服务器
    if (staticFileServer && staticFileServer.close) {
      await new Promise((resolve) => {
        staticFileServer.close(() => {
          console.log('✅ 静态文件服务器已关闭')
          resolve()
        })
        setTimeout(resolve, 1000)
      })
    }
    
    // 3. 关闭 HTTP 服务器
    if (httpServer && httpServer.close) {
      await new Promise((resolve) => {
        httpServer.close(() => {
          console.log('✅ HTTP 服务器已关闭')
          resolve()
        })
        setTimeout(resolve, 1000)
      })
    }
    
    console.log('👋 服务已完全关闭')
  } catch (err) {
    console.error('关闭服务时出错:', err)
  }
  
  process.exit(0)
}

// 监听退出信号
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
// nodemon 使用 SIGUSR2 信号重启
process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'))