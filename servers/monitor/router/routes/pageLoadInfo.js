const { PageLoadInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 页面性能
   */
  // 创建加载信息
  router.post('/pageLoad', PageLoadInfoController.create);
  router.post('/getPageLoadOverview', PageLoadInfoController.getPageLoadOverview);
  router.post('/getPageLoadOverviewSimple', PageLoadInfoController.getPageLoadOverviewSimple);
  router.post('/getPerformanceDataForMinute', PageLoadInfoController.getPerformanceDataForMinute);
  router.post('/getFastSlowDataForMinute', PageLoadInfoController.getFastSlowDataForMinute);
  router.post('/getPerfDataForUrlByDay', PageLoadInfoController.getPerfDataForUrlByDay);
  router.post('/getPerfDataForUrlByDaySimple', PageLoadInfoController.getPerfDataForUrlByDaySimple);
  router.post('/getPerfDataForWaterfall', PageLoadInfoController.getPerfDataForWaterfall);
  router.post('/getPerfDataForUrlDetail', PageLoadInfoController.getPerfDataForUrlDetail);
  router.post('/getPerfDataForMap', PageLoadInfoController.getPerfDataForMap);
  router.post('/getPerfInfoByVersion', PageLoadInfoController.getPerfInfoByVersion);
  router.post('/getPerfInfoByNetWork', PageLoadInfoController.getPerfInfoByNetWork);
  router.post('/getPerfInfoByOs', PageLoadInfoController.getPerfInfoByOs);
}
