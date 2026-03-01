const { ThirdPartyController } = require("../../controllers/controllers")

module.exports = (router) => {
  router.post('/thirdParty/getPageViewTotal', ThirdPartyController.getPageViewTotal);
  router.post('/thirdParty/getOnlinePersonCount', ThirdPartyController.getOnlinePersonCount);
  router.post('/thirdParty/getProjectOnlinePersonCount', ThirdPartyController.getProjectOnlinePersonCount);
  router.post('/thirdParty/getProjectOnlinePersonPage', ThirdPartyController.getProjectOnlinePersonPage);
  router.post('/thirdParty/getProjectCount', ThirdPartyController.getProjectCount);
  router.post('/thirdParty/getAddProjectCount', ThirdPartyController.getAddProjectCount);
  router.post('/thirdParty/getNewUserCount', ThirdPartyController.getNewUserCount);
  router.post('/thirdParty/getUserTotal', ThirdPartyController.getUserTotal);
  router.post('/thirdParty/getUserCount', ThirdPartyController.getUserCount);
  router.post('/thirdParty/getUserClickStats', ThirdPartyController.getUserClickStats);
  router.post('/thirdParty/getProjectPVAndUV', ThirdPartyController.getProjectPVAndUV)
  router.post('/thirdParty/getProjectPVAndUVForLocal', ThirdPartyController.getProjectPVAndUV)
  router.post('/thirdParty/getProjectPVAndUVPage', ThirdPartyController.getProjectPVAndUVPage);
  router.post('/thirdParty/getProjectMonthlyUVTrend', ThirdPartyController.getProjectMonthlyUVTrend);
  router.post('/thirdParty/getProjectMonthlyClickStats', ThirdPartyController.getProjectMonthlyClickStats);
  router.post('/thirdParty/getProjectAccessTrendsTop5', ThirdPartyController.getProjectAccessTrendsTop5);
  router.post('/thirdParty/getRealProjectAccessTrendsTop5', ThirdPartyController.getRealProjectAccessTrendsTop5);
  router.post('/thirdParty/getProjectClickCount', ThirdPartyController.getProjectClickCount);
  router.post('/thirdParty/getProjectAverageStayTime', ThirdPartyController.getProjectAverageStayTime);
  router.post('/thirdParty/getProjectAverageStayTimePage', ThirdPartyController.getProjectAverageStayTimePage);
  router.get('/thirdParty/exportProjectAverageStayTime', ThirdPartyController.exportProjectAverageStayTime);
  // router.post('/thirdParty/getAddPointCount', ThirdPartyController.getAddPointCount);
  router.post('/thirdParty/getProjectPlatformCount', ThirdPartyController.getProjectPlatformCount);
  router.post('/thirdParty/getProjectPlatformCountDetail', ThirdPartyController.getProjectPlatformCountDetail);
  router.get('/thirdParty/exportProjectPlatformCountDetail', ThirdPartyController.exportProjectPlatformCountDetail);
  router.post('/thirdParty/getProjectPlatformCountUserDetail', ThirdPartyController.getProjectPlatformCountUserDetail);
  router.get('/thirdParty/exportPlatformSourceUserDetail', ThirdPartyController.exportPlatformSourceUserDetail);
  router.get('/thirdParty/exportProjectPlatformCountUserDetail', ThirdPartyController.exportProjectPlatformCountUserDetail);
  router.post('/thirdParty/getProjectBrowserCount', ThirdPartyController.getProjectBrowserCount);
  router.get('/thirdParty/exportProjectBrowserCount', ThirdPartyController.exportProjectBrowserCount);
  router.post('/thirdParty/getProjectDeviceCount', ThirdPartyController.getProjectDeviceCount);
  router.post('/thirdParty/getDeviceDetailCount', ThirdPartyController.getDeviceDetailCount);
  router.get('/thirdParty/exportDeviceDetailCount', ThirdPartyController.exportDeviceDetailCount);
  router.post('/thirdParty/getProjectFunctionActiveStats', ThirdPartyController.getProjectFunctionActiveStats);
  router.post('/thirdParty/getProjectFunctionActiveStatsPage', ThirdPartyController.getProjectFunctionActiveStatsPage);
  router.get('/thirdParty/exportFunctionActiveStatsPage', ThirdPartyController.exportFunctionActiveStatsPage);
  router.post('/thirdParty/getProjectFunctionActiveUserDetail', ThirdPartyController.getProjectFunctionActiveUserDetail);
  router.get('/thirdParty/exportFunctionActiveUserDetail', ThirdPartyController.exportFunctionActiveUserDetail);
  router.post('/thirdParty/getProjectAccessTrends', ThirdPartyController.getProjectAccessTrends);
  router.post('/thirdParty/getDetail', ThirdPartyController.getProjectCountDetail);
  router.post('/thirdParty/getOnlineUserDetail', ThirdPartyController.getOnlineUserDetail);
  router.post('/thirdParty/getClickCountDetail', ThirdPartyController.getClickCountDetail);
  router.get('/thirdParty/exportDetailData', ThirdPartyController.exportDetailData);
  router.get('/thirdParty/exportOnlineUserDetail', ThirdPartyController.exportOnlineUserDetail);
  router.get('/thirdParty/exportOnlineUserDetailData', ThirdPartyController.exportOnlineUserDetailData);
  router.get('/thirdParty/exportOnlineUserStats', ThirdPartyController.exportOnlineUserStats);
  router.post('/thirdParty/getApplicationActiveUserList', ThirdPartyController.getApplicationActiveUserList);
  router.get('/thirdParty/exportApplicationActiveUserList', ThirdPartyController.exportApplicationActiveUserList);
  router.post('/thirdParty/getNewUserList', ThirdPartyController.getNewUserList);
  router.get('/thirdParty/exportNewUserList', ThirdPartyController.exportNewUserList);
  router.get('/thirdParty/exportApplicationActiveMainData', ThirdPartyController.exportApplicationActiveMainData);
  router.get('/thirdParty/exportApplicationClickCountData', ThirdPartyController.exportApplicationClickCountData);
  router.get('/thirdParty/apiList', ThirdPartyController.apiList);
}