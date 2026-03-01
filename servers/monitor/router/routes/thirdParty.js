const { ThirdPartyController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.post('/thirdParty/getAllProjectOverviewData', ThirdPartyController.getAllProjectOverviewData);
  router.post('/thirdParty/getAllProjectHttpCostDistribution', ThirdPartyController.getAllProjectHttpCostDistribution);
  router.post('/thirdParty/getAllProjectHttpTop10CostList', ThirdPartyController.getAllProjectHttpTop10CostList);
  router.post('/thirdParty/getAllProjectHttpTop10CostListWithPagination', ThirdPartyController.getAllProjectHttpTop10CostListWithPagination);
  router.get('/thirdParty/exportHttpTop10CostList', ThirdPartyController.exportHttpTop10CostList);
  router.post('/thirdParty/getHttpRequestDetailList', ThirdPartyController.getHttpRequestDetailList);
  router.get('/thirdParty/exportHttpRequestDetailList', ThirdPartyController.exportHttpRequestDetailList);
  router.post('/thirdParty/getAllProjectAvgCostList', ThirdPartyController.getAllProjectAvgCostList);
  router.get('/thirdParty/exportAllProjectHttpAvgCostList', ThirdPartyController.exportAllProjectHttpAvgCostList);
  router.post('/thirdParty/getAllProjectHttpAvgCostListWithPagination', ThirdPartyController.getAllProjectHttpAvgCostListWithPagination);
  router.get('/thirdParty/exportPageLoadTop10List', ThirdPartyController.exportPageLoadTop10List);
  router.get('/thirdParty/exportPageLoadDetailList', ThirdPartyController.exportPageLoadDetailList);
  router.get('/thirdParty/exportAllProjectPageLoadAvgCostList', ThirdPartyController.exportAllProjectPageLoadAvgCostList);
  router.get('/thirdParty/exportAllProjectHttpErrorTop10List', ThirdPartyController.exportAllProjectHttpErrorTop10List);
  router.get('/thirdParty/exportHttpErrorDetailList', ThirdPartyController.exportHttpErrorDetailList);
  router.get('/thirdParty/exportAllProjectHttpErrorCountList', ThirdPartyController.exportAllProjectHttpErrorCountList);
  router.get('/thirdParty/exportHttpErrorStatsDetailList', ThirdPartyController.exportHttpErrorStatsDetailList);
  router.get('/thirdParty/exportBrowserErrorDetailList', ThirdPartyController.exportBrowserErrorDetailList);
  router.post('/thirdParty/getAllProjectPageLoadTimeDistribution', ThirdPartyController.getAllProjectPageLoadTimeDistribution);
  router.post('/thirdParty/getAllProjectPageLoadTop10List', ThirdPartyController.getAllProjectPageLoadTop10List);
  router.post('/thirdParty/getAllProjectAvgPageLoadCostList', ThirdPartyController.getAllProjectAvgPageLoadCostList);
  router.post('/thirdParty/getAllProjectErrorTypeRatio', ThirdPartyController.getAllProjectErrorTypeRatio);
  router.post('/thirdParty/getAllProjectErrorTop10List', ThirdPartyController.getAllProjectErrorTop10List);
  router.post('/thirdParty/getAllProjectErrorCountList', ThirdPartyController.getAllProjectErrorCountList);
  router.post('/thirdParty/getAllProjectAvgCostList', ThirdPartyController.getAllProjectAvgCostList);
  router.post('/thirdParty/getAllProjectHttpAvgCostListWithPagination', ThirdPartyController.getAllProjectHttpAvgCostListWithPagination);
  router.post('/thirdParty/getAllProjectPageLoadTop10ListWithPagination', ThirdPartyController.getAllProjectPageLoadTop10ListWithPagination);
  router.post('/thirdParty/getPageLoadDetailList', ThirdPartyController.getPageLoadDetailList);
  router.post('/thirdParty/getAllProjectErrorTop10ListWithPagination', ThirdPartyController.getAllProjectErrorTop10ListWithPagination);
  router.post('/thirdParty/getErrorDetailList', ThirdPartyController.getErrorDetailList);
  router.post('/thirdParty/getAllProjectPageLoadAvgCostListWithPagination', ThirdPartyController.getAllProjectPageLoadAvgCostListWithPagination);
  router.post('/thirdParty/getAllProjectErrorCountListWithPagination', ThirdPartyController.getAllProjectErrorCountListWithPagination);
  router.post('/thirdParty/getAllProjectHttpErrorCountListWithPagination', ThirdPartyController.getAllProjectHttpErrorCountListWithPagination);
  router.post('/thirdParty/getAllProjectErrorSourceStats', ThirdPartyController.getAllProjectErrorSourceStats);
  router.post('/thirdParty/getErrorDeviceDistribution', ThirdPartyController.getErrorDeviceDistribution);
  router.post('/thirdParty/getErrorDeviceDistributionDetail', ThirdPartyController.getErrorDeviceDistributionDetail);
  router.post('/thirdParty/getErrorDeviceRecordDetail', ThirdPartyController.getErrorDeviceRecordDetail);
  router.get('/thirdParty/apiList', ThirdPartyController.apiList);
}