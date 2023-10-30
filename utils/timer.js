/** 定时器逻辑 */
const log = require("../config/log");
module.exports = (callback) => {
  const startTime = new Date().getTime();
  let count = 0;
  const fixed = async () => {
      count ++;
      const tempDate = new Date()
      const tempTime = new Date().getTime()
      const wrongTime = startTime + count * 1000
      var offset = tempTime - wrongTime;
      var nextTime = 1000 - offset;
      if (nextTime < 0) nextTime = 0;
      try {
        callback(tempDate)
      } catch(e) {
          log.printError("定时器执行报错：", e)
      }
      setTimeout(fixed, nextTime);
  }
  setTimeout(fixed, 1000);
}