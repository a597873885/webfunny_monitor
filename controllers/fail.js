//delete//
const statusCode = require('../util/status-code')
const fs = require('fs');
const { spawn, exec, execFile } = require('child_process');
const { ConfigModel } = require('../modules/models')
//delete//
class FailController {
  static async getSysInfo(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {invalid: true})
  }
  static async createPurchaseCode(ctx) {
    const req = ctx.request.body
    const param = JSON.parse(req)
    const { inputPurchaseCode } = param

    const newString = `module.exports = {
      purchaseCode: '${inputPurchaseCode}',
    }`
    await fs.writeFile("./bin/purchaseCode.js", newString, (err) => {
      if (err) {
        throw err;
      }
    });

    await ConfigModel.updateConfig("purchaseCode", {configValue: inputPurchaseCode})

    FailController.restartServer()
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 0)
  }

  /**
   * 重启服务
   */
  static async restartServer() {

    switch (process.platform) {
      // windows系统下
      case "win32":
          spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['run', 'prd_restart'], { stdio: 'inherit' });
          break;
      case "darwin":  // 默认mac系统
      default:
          try {
              execFile('./restart.sh', [], null, function (err, stdout, stderr) {
                  console.log("服务已重启")
              });
          } catch(e) {
            console.log("服务重启失败，请手动重启")
          }
          break;
    }

  }
}
//exports//
module.exports = FailController
//exports//