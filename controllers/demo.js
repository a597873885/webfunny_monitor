//delete//
const CustomerPVModel = require('../modules/demo')
const statusCode = require('../util/status-code')
const Utils = require('../util/utils');
const log = require("../config/log");
const monitorKeys = require("../config/monitorKeys")
//delete//
class Demo {
  /**
   * 接受并分类处理上传的日志
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upLog(ctx) {
    try {
      var req = ctx.req
      // 获取IP地址
      const clientIpString = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
      // 日志JSON化
      const paramStr = ctx.request.body.data
      const param = JSON.parse(paramStr)
      const logArray = param.logInfo.split("$$$")
      for(var i = 0; i < logArray.length; i ++) {
        if (!logArray[i]) continue;
        const logInfo = JSON.parse(logArray[i]);
        for( let key in logInfo) {
          if (monitorKeys[key]) {
            logInfo[monitorKeys[key]] = logInfo[key]
            delete logInfo[key]
          }
        }
        logInfo.monitorIp = clientIpString
        logInfo.happenTime = logInfo.happenTime + ""
        logInfo.completeUrl = Utils.b64DecodeUnicode(logInfo.completeUrl);
        // 根据不同的类型，上传不同的日志
        switch (logInfo.uploadType) {
          case "CUSTOMER_PV":
            await CustomerPVModel.createCustomerPV(logInfo);
            break;
          default:
            break;
        }
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功')
    } catch(e) {
      log.printError(e)
    }
  }
  static async query(ctx) {
    const result = await CustomerPVModel.getCustomerPVList()
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息成功', result)
  }
}
//exports//
module.exports = Common
//exports//
