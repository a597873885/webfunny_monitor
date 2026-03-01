const { ResourcePerfInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 资源性能接口
   */
  // 获取资源性能概览
  router.post('/getResourcePerfOverview', ResourcePerfInfoController.getResourcePerfOverview);
  // 获取资源性能分布数据
  router.post('/getResourcePerfDistribution', ResourcePerfInfoController.getResourcePerfDistribution);
  // 获取资源性能趋势数据
  router.post('/getResourcePerfTrend', ResourcePerfInfoController.getResourcePerfTrend);
  // 获取资源性能明细列表
  router.post('/getResourcePerfList', ResourcePerfInfoController.getResourcePerfList);
  // 获取资源性能地域分布
  router.post('/getResourcePerfRegionDist', ResourcePerfInfoController.getResourcePerfRegionDist);
  // 根据 pageKey 获取资源列表
  router.post('/getResourceListByPageKey', ResourcePerfInfoController.getResourceListByPageKey);
}
