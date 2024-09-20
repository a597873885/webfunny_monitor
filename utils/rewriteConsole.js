const WebfunnyConfig = require('../webfunny.config')
const { otherConfig } = WebfunnyConfig
module.exports = function() {
  const consoleLog = console.log;
  console.log = (...args) => {
    const timestamp = new Date().Format('yyyy-MM-dd hh:mm:ss');

    // 配置开启了打印，打印console
    if (otherConfig.printConsole === true) {
      consoleLog(timestamp + " - ", ...args);
    }
  };
}