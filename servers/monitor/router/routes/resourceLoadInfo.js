const { ResourceLoadInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 静态资源加载状态接口
   */
  // 获取静态资源错误概览
  router.post('/getResourceErrorOverview', ResourceLoadInfoController.getResourceErrorOverview);
  // 获取分布数据
  router.post('/getResourceErrorDistribution', ResourceLoadInfoController.getResourceErrorDistribution);
  // 获取排行数据
  router.post('/getResourceErrorRank', ResourceLoadInfoController.getResourceErrorRank);
  // 获取趋势数据
  router.post('/getResourceErrorTrend', ResourceLoadInfoController.getResourceErrorTrend);

  // 获取静态资源错误分类
  router.get('/getResourceErrorCountByDay', ResourceLoadInfoController.getResourceErrorCountByDay);
  router.post('/getResourceLoadInfoListByDay', ResourceLoadInfoController.getResourceLoadInfoListByDay);
  // 获取最近24小时内，静态资源加载错误发生数量
  router.get('/getResourceErrorCountByHour', ResourceLoadInfoController.getResourceErrorCountByHour);
}
