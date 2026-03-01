#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var { accountInfo } = require("./AccountConfig")
// var debug = require('debug')('demo:server');
// var http = require('http');
global.serverType = "master"

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || accountInfo.localServerPort);

/**
 * Listen on provided port, on all network interfaces.
 */

const server = app.listen(port, () => {
  console.log(`📦 [APM Server] HTTP 服务启动，端口: ${port}`)
});


/**
 * 优雅退出：关闭所有服务器连接
 * 解决 nodemon 重启时端口占用问题
 */
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  // 防止重复关闭
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\n🔄 收到 ${signal} 信号，正在关闭服务...`)
  
  try {
    // 2. 再关闭 HTTP 服务器
    await new Promise((resolve) => {
      server.close(() => {
        console.log('✅ HTTP 服务器已关闭')
        resolve()
      })
      // 超时强制关闭
      setTimeout(resolve, 1000)
    })
    
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

/**
 * Normalize a port into a number, string, or false.
 */

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
