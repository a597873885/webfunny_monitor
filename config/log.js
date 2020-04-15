var log4js = require("./log_config");

var errorLog = log4js.getLogger("errorLog"); //此处使用category的值
var resLog = log4js.getLogger("responseLog"); //此处使用category的值

var log = {};
log.info = function(ctx, resTime) {
  resLog.info(formatRes(ctx, resTime));
};

log.error = function(ctx, error, resTime) {
  if (ctx && error) {
    errorLog.error(formatError(ctx, error, resTime));
  }
};
log.printInfo = function (msg, err) {
  var logText = "msg: " + msg + "\n";
  if (err) {
    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";
  }
  resLog.info(logText)
}

log.printError = function (msg, err) {
  var errorText = "msg: " + msg + "\n";
  if (err) {
    //错误名称
    errorText += "err name: " + err.name + "\n";
    //错误信息
    errorText += "err message: " + err.message + "\n";
    //错误详情
    errorText += "err stack: " + err.stack + "\n";
  }
  errorLog.error(errorText)
  // console.log(errorText)
}

log.errorDetail = function(param, err) {
  if (param && err) {
    var logText = "param: " + param + "\n";
    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";
    errorLog.error(logText);
  }
};

//格式化请求日志
var formatReqLog = function(ctx, resTime) {
  var req = ctx.req
  var res = ctx.res
  var body = ctx.request.body
  let getClientIp = function (req) {
    return  req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  };
  let ip = getClientIp(req);

  var logText = new String();
  //访问方法
  var method = req.method;
  logText += "method: " + method + "\n";
  //请求原始地址

  logText += "originalUrl:  " + req.url + "\n";
  //客户端ip
  logText += "client ip:  " + ip + "\n";

  //请求参数
  if (method === "GET") {
    logText += "query:  " + JSON.stringify(req.query) + "\n";
  } else {
    if (typeof body === "string") {
      logText += "body: " + "\n" + body + "\n";
    } else {
      logText += "body: " + "\n" + JSON.stringify(body) + "\n";
    }
  }

  //服务器响应时间
  logText += "response time: " + resTime + "\n";

  return logText;
};

//格式化响应日志
var formatRes = function(ctx, resTime) {
  var req = ctx.req
  var res = ctx.res
  var logText = new String();
  //响应日志开始
  logText += "\n" + "*************** response log start ***************" + "\n";

  //添加请求日志
  logText += formatReqLog(ctx, resTime);

  //响应状态码
  logText += "response status: " + res.statusCode + "\n";

  //响应内容
  logText += "response body: " + "\n" + JSON.stringify(res.body) + "\n";

  //响应日志结束
  logText += "*************** response log end ***************" + "\n";

  return logText;
};

//格式化错误日志
var formatError = function(ctx, err, resTime) {
  var req = ctx.req
  var res = ctx.res
  var logText = new String();

  //错误信息开始
  logText += "\n" + "*************** error log start ***************" + "\n";

  //添加请求日志
  logText += formatReqLog(ctx, resTime);

  //错误名称

  logText += "err name: " + err.name + "\n";
  //错误信息

  logText += "err message: " + err.message + "\n";
  //错误详情

  logText += "err stack: " + err.stack + "\n";

  //错误信息结束
  logText += "*************** error log end ***************" + "\n";

  return logText;
};

module.exports = log;