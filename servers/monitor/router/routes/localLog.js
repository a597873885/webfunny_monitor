const { LocalLogController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 获取本地日志
  router.post('/getLocalLog', LocalLogController.getLocalLog)
  // 获取本地日志列表
  router.get('/getLocalLogList', LocalLogController.getLocalLogList)
  // 获取最近1小时本地日志列表
  router.get('/getLocalLogListForOneHour', LocalLogController.getLocalLogListForOneHour)
}
