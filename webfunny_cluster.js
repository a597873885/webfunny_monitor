#!/usr/bin/env node

var app = require('./app');
var debug = require('debug')('demo:server');
const WebfunnyConfig = require("./webfunny.config")
const { domainConfig } = WebfunnyConfig
global.serverType = "master"
const { be, fe } = domainConfig.port
var port = normalizePort(process.env.PORT || be);
app.listen(port);

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
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// 启动静态文件服务器
const KoaStatic = require('koa');
const appStatic = new KoaStatic();
const server = require('koa-static-cache');
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
const publicServer = server({dir: originPath, dynamic: true});
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
  if (ctx.url === '/' || ctx.url === '/wf_center/' || ctx.url === '/wf_event/' || ctx.url === '/wf_monitor/' || ctx.url === '/wf_logger/') {
    redirect(ctx)
  }

  let templateHtml = '/wf_center/index.html'
  if (ctx.url.startsWith("/wf_center/")) {
    templateHtml = '/wf_center/index.html'
  } else if (ctx.url.startsWith("/wf_event/")) {
    templateHtml = '/wf_event/index.html'
  } else if (ctx.url.startsWith("/wf_monitor/")) {
    templateHtml = '/wf_monitor/index.html'
  } else if (ctx.url.startsWith("/wf_logger/")) {
    templateHtml = '/wf_logger/index.html'
  }

  if (!ctx.url.endsWith('/') && !ctx.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/)) {  
    ctx.type = 'html'; // 设置响应类型为 html  
    ctx.body = fs.createReadStream(path.join(originPath, templateHtml));
  }
  await next()
});
appStatic.use(publicServer);
appStatic.listen(fe);