var log4js = require("log4js");
var path = require("path");
var fs = require("fs");
var basePath = path.resolve(__dirname, "../logs");

var errorPath = basePath + "/errors/";
var resPath = basePath + "/info/";

var errorFilename = errorPath + "/error";
var resFilename = resPath + "/info";

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
var confirmPath = function(pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr);
    console.log("createPath: " + pathStr);
  }
};
log4js.configure({
  appenders: {
    errorLog: {
      type: "dateFile", //日志类型
      filename: errorFilename, //日志输出位置
      alwaysIncludePattern: true, //是否总是有后缀名
      pattern: "-yyyy-MM-dd.log", //后缀，每小时创建一个新的日志文件
      //文件保留数量 
      backups: 8,
      //时间文件 保存多少天，以前的log将被删除
      numBackups:8,
    },
    responseLog: {
      type: "dateFile",
      filename: resFilename,
      alwaysIncludePattern: true,
      pattern: "-yyyy-MM-dd.log",
      //文件保留数量 
      backups: 8,
      //时间文件 保存多少天，以前的log将被删除
      numBackups:8,
    }
  },
  categories: {
    errorLog: { appenders: ['errorLog'], level: 'error' },
    responseLog: { appenders: ["responseLog"], level: "info" },
    default: { appenders: ['responseLog','errorLog',], level: 'trace' }
  },
  // pm2: true,
  // pm2InstanceVar: 'INSTANCE_ID',
  disableClustering: true
});
//创建log的根目录'logs'
if (basePath) {
  confirmPath(basePath);
  //根据不同的logType创建不同的文件目录
  confirmPath(errorPath);
  confirmPath(resPath);
}

module.exports = log4js;