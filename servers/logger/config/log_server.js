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

app.listen(port, () => {
  // console.log("服务启动中...")
});

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
