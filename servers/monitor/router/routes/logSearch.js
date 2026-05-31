const { LogSearchController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 获取日志列表
  router.post('/getLogList', LogSearchController.getLogList);
  // 导出日志列表
  router.post('/exportLogList', LogSearchController.exportLogList);
  // 导出日志列表（GET，window.open 触发下载）
  router.get('/exportLogList', LogSearchController.exportLogList);
}
