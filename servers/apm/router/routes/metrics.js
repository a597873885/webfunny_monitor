// const MetricsController = require('../../controllers/metrics')
const { MetricsController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * APM 指标统计接口
   */
  
  // 获取应用吞吐量和性能指标（时序数据）
  router.post('/metrics/throughput', MetricsController.getThroughputMetrics)
  
  // 获取接口级别的指标统计（TOP N）
  router.post('/metrics/endpoints', MetricsController.getEndpointMetrics)
  
  // 获取服务级别的指标统计
  router.post('/metrics/services', MetricsController.getServiceMetrics)

  // 性能概览（总体指标）
  router.post('/metrics/performanceOverview', MetricsController.getPerformanceOverview)
  
  /**
   * 接口分析页面相关接口
   */
  // 获取接口分析列表（支持分页、排序、筛选、环比）
  router.post('/metrics/apisList', MetricsController.getApisList)
  
  // 获取接口分析核心指标
  router.post('/metrics/apisMetrics', MetricsController.getApisMetrics)
  
  // 获取接口分析趋势图
  router.post('/metrics/apisTrend', MetricsController.getApisTrend)
  
  // 获取接口分析耗时分布
  router.post('/metrics/apisDistribution', MetricsController.getApisDistribution)
  
  // 获取埋点组件列表（用于筛选器选项）
  router.post('/metrics/trackSDKList', MetricsController.getTrackSDKList)
  
  // 获取接口名称列表（用于筛选器选项）
  router.post('/metrics/apiNameList', MetricsController.getApiNameList)
  
  // 获取接口详情（核心指标 + 趋势图 + 最慢 Top 10）
  router.post('/metrics/apiDetail', MetricsController.getApiDetail)
}

