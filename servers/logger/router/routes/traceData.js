const { TraceDataController } = require("../../controllers/controllers")

module.exports = (router) => {
  router.post('/getTraceLogCountByDay', TraceDataController.getLogCountByDay);
  router.post('/getTraceLogListGroupByMsg', TraceDataController.getLogListGroupByMsg);
  router.post('/getTraceLogDataList', TraceDataController.getTraceDataList);
  // 查询日志详情
  router.post('/getTraceLogDataBySearch', TraceDataController.getTraceDataBySearch);
}
