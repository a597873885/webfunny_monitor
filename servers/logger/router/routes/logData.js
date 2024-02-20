// const LogDataController = require('../../controllers/logData')
const { LogDataController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.post('/getLogCountByDay', LogDataController.getLogCountByDay);
  router.post('/getLogListGroupByMsg', LogDataController.getLogListGroupByMsg);
  router.post('/getLogDataList', LogDataController.getLogDataList);
  // 查询日志详情
  router.post('/getLogDataBySearch', LogDataController.getLogDataBySearch);
}
