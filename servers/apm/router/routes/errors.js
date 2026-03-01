// const ErrorsController = require('../../controllers/errors')
const { ErrorsController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * APM 错误监控接口
   */
  
  // 获取错误列表（分页、筛选、排序）
  router.post('/errors/list', ErrorsController.getErrorList)
  
  // 获取错误趋势数据
  router.post('/errors/trend', ErrorsController.getErrorTrend)
  
  // 获取错误核心指标（总错误数、错误率、错误类型分布）
  router.post('/errors/metrics', ErrorsController.getErrorMetrics)
  
  // 获取错误类型列表（用于筛选下拉）
  router.post('/errors/types', ErrorsController.getErrorTypes)
  
  // 获取错误详情
  router.post('/errors/detail', ErrorsController.getErrorDetail)
  
  // 获取埋点组件列表（用于筛选下拉）
  router.post('/errors/trackSDKList', ErrorsController.getTrackSDKList)
}

