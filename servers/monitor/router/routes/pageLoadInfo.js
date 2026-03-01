const { PageLoadInfoController, LoadPageInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    /**
   * 页面性能
   */
  // 创建加载信息
  router.post('/pageLoad', PageLoadInfoController.create);
  router.post('/getPageLoadOverview', PageLoadInfoController.getPageLoadOverview);
  router.post('/getPageLoadOverviewSimple', PageLoadInfoController.getPageLoadOverviewSimple);
  router.post('/getPerformanceDataForMinute', PageLoadInfoController.getPerformanceDataForMinute);
  router.post('/getPerformanceDataByTimeRange', PageLoadInfoController.getPerformanceDataByTimeRange);
  router.post('/getFastSlowDataForMinute', PageLoadInfoController.getFastSlowDataForMinute);
  router.post('/getFastSlowDataByTimeRange', PageLoadInfoController.getFastSlowDataByTimeRange);
  router.post('/getPercentileDataByTimeRange', PageLoadInfoController.getPercentileDataByTimeRange);
  router.post('/getPerfDataForUrlByDay', PageLoadInfoController.getPerfDataForUrlByDay);
  router.post('/getPerfDataForUrlByTimeRange', PageLoadInfoController.getPerfDataForUrlByTimeRange);
  router.post('/getPerfDataForUrlByDaySimple', PageLoadInfoController.getPerfDataForUrlByDaySimple);
  router.post('/getPerfDataForWaterfall', PageLoadInfoController.getPerfDataForWaterfall);
  router.post('/getPerfDataForUrlDetail', PageLoadInfoController.getPerfDataForUrlDetail);
  router.post('/getPerfDataForMap', PageLoadInfoController.getPerfDataForMap);
  router.post('/getPerfDataForMapByTimeRange', PageLoadInfoController.getPerfDataForMapByTimeRange);
  router.post('/getPerfInfoByVersion', PageLoadInfoController.getPerfInfoByVersion);
  router.post('/getPerfInfoByNetWork', PageLoadInfoController.getPerfInfoByNetWork);
  router.post('/getPerfInfoByNetWorkByTimeRange', PageLoadInfoController.getPerfInfoByNetWorkByTimeRange);
  router.post('/getPerfInfoByOs', PageLoadInfoController.getPerfInfoByOs);
  router.post('/getPerfInfoByOsByTimeRange', PageLoadInfoController.getPerfInfoByOsByTimeRange);
  router.post('/getPerfInfoByBrowserByTimeRange', PageLoadInfoController.getPerfInfoByBrowserByTimeRange);
  router.post('/getPerfInfoByDeviceByTimeRange', PageLoadInfoController.getPerfInfoByDeviceByTimeRange);
  router.post('/getPerfInfoByCarrierByTimeRange', PageLoadInfoController.getPerfInfoByCarrierByTimeRange);
  router.post('/getPageCompleteLoadedDataForHour', PageLoadInfoController.getPageCompleteLoadedDataForHour);
  router.post('/exportPerfDataForUrlByDay', PageLoadInfoController.exportPerfDataForUrlByDay);
  
  // 页面加载时间分类接口
  router.post('/getPageCountForLoadTimeGroupByDay', LoadPageInfoController.getPageCountForLoadTimeGroupByDay);
  router.post('/getPageCountForLoadTimeByDay', LoadPageInfoController.getPageCountForLoadTimeByDay);
  router.post('/getPageLoadTimePercent', LoadPageInfoController.getPageLoadTimePercent);
  router.post('/getPageLoadTimeDistribution', LoadPageInfoController.getPageLoadTimeDistribution);
}
