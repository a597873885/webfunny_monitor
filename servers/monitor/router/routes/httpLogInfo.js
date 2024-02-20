const { HttpLogInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 获取每分钟的http量
  router.post('/getHttpCountByMinute', HttpLogInfoController.getHttpCountByMinute);
  // 根据加载时间分类
  router.post('/getHttpCountForLoadTimeGroupByDay', HttpLogInfoController.getHttpCountForLoadTimeGroupByDay);
  
  // 获取分类列表
  router.post('/getHttpUrlListForLoadTime', HttpLogInfoController.getHttpUrlListForLoadTime);
  
  // 获取接口影响人数
  router.post('/getHttpUrlUserCount', HttpLogInfoController.getHttpUrlUserCount);
  
  // 获取接口发生的页面
  router.post('/getPagesByHttpUrl', HttpLogInfoController.getPagesByHttpUrl);
  // 获取24小时分布
  router.get('/getHttpUrlCountListByHour', HttpLogInfoController.getHttpUrlCountListByHour);
  // 获取24小时分布
  router.post('/getHttpUrlCountForHourByMinutes', HttpLogInfoController.getHttpUrlCountForHourByMinutes);
  // 获取http接口请求的通用信息
  router.post('/getHttpLoadTimeForAll', HttpLogInfoController.getHttpLoadTimeForAll);
  // 获取接口加载耗时占比
  router.post('/getHttpLoadTimePercent', HttpLogInfoController.getHttpLoadTimePercent);
  router.post('/getHttpLoadTimePercentSimple', HttpLogInfoController.getHttpLoadTimePercentSimple);
  router.post('/getHttpLoadTimeListByUrl', HttpLogInfoController.getHttpLoadTimeListByUrl);

  /**大屏数据相关 */
  router.post('/getHttpInfoInRealTimeByMinute', HttpLogInfoController.getHttpInfoInRealTimeByMinute);


  router.post('/getHttpLoadOverview', HttpLogInfoController.getHttpLoadOverview);
  router.post('/getHttpLogDataForMinute', HttpLogInfoController.getHttpLogDataForMinute);
  router.post('/getHttpLogDataForUrlByDay', HttpLogInfoController.getHttpLogDataForUrlByDay);
  router.post('/getHttpPerfDataForMap', HttpLogInfoController.getHttpPerfDataForMap);
  router.post('/getHttpLoadTimeForGroup', HttpLogInfoController.getHttpLoadTimeForGroup);
  router.post('/getOperatorForGroup', HttpLogInfoController.getOperatorForGroup);
  router.post('/getMethodForGroup', HttpLogInfoController.getMethodForGroup);
}
