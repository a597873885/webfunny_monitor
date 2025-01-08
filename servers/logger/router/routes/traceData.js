const { TraceDataController } = require("../../controllers/controllers")

module.exports = (router) => {
  router.post('/getLogCountByDay', TraceDataController.getLogCountByDay);
  router.post('/getLogListGroupByMsg', TraceDataController.getLogListGroupByMsg);
  router.post('/getLogDataList', TraceDataController.getTraceDataList);
  // 查询日志详情
  router.post('/getLogDataBySearch', TraceDataController.getTraceDataBySearch);
}
