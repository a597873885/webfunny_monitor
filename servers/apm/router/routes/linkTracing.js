// const LinkTracingController = require('../../controllers/linkTracing')
const { LinkTracingController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 链路追踪接口
   */
  // 获取链路追踪列表
  router.post('/linkTracing/list', LinkTracingController.getTraceList)
  
  // 获取真实耗时（异步接口）
  router.post('/linkTracing/realDurations', LinkTracingController.getRealDurations)
  
  // 获取链路趋势数据
  router.post('/linkTracing/trend', LinkTracingController.getTraceTrend)
  
  // 获取Trace详情
  router.get('/linkTracing/detail', LinkTracingController.getTraceDetail)
  
  // 获取服务列表（用于筛选）
  router.get('/linkTracing/services', LinkTracingController.getServiceList)
  
  // 获取接口列表（用于筛选）
  router.get('/linkTracing/endpoints', LinkTracingController.getEndpointList)
  
  // 查询公司下所有应用的链路信息
  router.post('/linkTracing/companyStats', LinkTracingController.getCompanyTraceStats)
}

