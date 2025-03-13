const { VideoLogController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 获取视频日志
  router.post('/getVideoLog', VideoLogController.getVideoLog)
  // 获取视频日志列表
  router.get('/getVideoLogList', VideoLogController.getVideoLogList)
  // 获取最新一条视频日志
  router.get('/getLatestVideoLog', VideoLogController.getLatestVideoLog)
}
