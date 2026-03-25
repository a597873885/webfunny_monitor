const { OverviewNewController } = require("../../controllers/controllers.js")

module.exports = function (router) {
  // 获取健康评分数据
  router.post('/overviewNew/getHealthScore', OverviewNewController.getHealthScore)
  // 获取用户活跃趋势
  router.post('/overviewNew/getUserTrend', OverviewNewController.getUserTrend)
  // 获取错误趋势
  router.post('/overviewNew/getErrorTrend', OverviewNewController.getErrorTrend)
  // 获取页面性能
  router.post('/overviewNew/getPagePerf', OverviewNewController.getPagePerf)
  // 获取接口性能
  router.post('/overviewNew/getApiPerf', OverviewNewController.getApiPerf)
  // 获取应用启动性能（App专属）
  router.post('/overviewNew/getAppStartup', OverviewNewController.getAppStartup)
  // 获取分布分析
  router.post('/overviewNew/getDistribution', OverviewNewController.getDistribution)
  // 获取地域分布
  router.post('/overviewNew/getGeoData', OverviewNewController.getGeoData)
  // 获取健康评分配置
  router.post('/overviewNew/getHealthScoreConfig', OverviewNewController.getHealthScoreConfig)
  // 保存健康评分配置
  router.post('/overviewNew/saveHealthScoreConfig', OverviewNewController.saveHealthScoreConfig)
}
