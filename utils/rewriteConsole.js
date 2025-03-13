const WebfunnyConfig = require('../webfunny.config')
const { otherConfig } = WebfunnyConfig
const loggerUpload = require("../middlreware/loggerUpload")
module.exports = function() {
  const consoleLog = console.log;
  console.log = (...args) => {
    const timestamp = new Date().Format('yyyy-MM-dd hh:mm:ss');

    if (otherConfig.uploadServerErrorToWebfunny === true) {
      // 打印日志都进行上报
      let message = ""
      let tempMsg = args[0]
      if (typeof tempMsg === "string") {
        message = tempMsg.length > 200 ? tempMsg.substring(0,200) : tempMsg
      } else if (typeof tempMsg === "object") {
        tempMsg = JSON.stringify(tempMsg)
        message = tempMsg.length > 200 ? tempMsg.substring(0,200) : tempMsg
      }

      const content = JSON.stringify(args)
      // projectId = "", userId = Utils.getMac(), message = "", content = "", otherInfo = ""
      loggerUpload.log({
        projectId: "webfunny_log_sys",
        message,
        content,
      })
    }

    // 配置开启了打印，打印console
    if (otherConfig.printConsole === true) {
      consoleLog(timestamp + " - ", ...args);
    }
  };
}