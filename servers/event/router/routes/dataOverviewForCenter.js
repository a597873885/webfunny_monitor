const { DataOverviewForCenterController } = require("../../controllers/controllers")

module.exports = (router) => {
  // 获取当前在线人数
  router.post('/dataOverviewForCenter/getOnlineUserCount', DataOverviewForCenterController.getOnlineUserCount)

  // 获取总浏览量（PV）
  router.post('/dataOverviewForCenter/getTotalPageViews', DataOverviewForCenterController.getTotalPageViews)

  // 获取用户总数（UV）
  router.post('/dataOverviewForCenter/getTotalUsers', DataOverviewForCenterController.getTotalUsers)

  // 获取新增用户总数
  router.post('/dataOverviewForCenter/getNewUsers', DataOverviewForCenterController.getNewUsers)

  // 获取人均访问频次
  router.post('/dataOverviewForCenter/getAvgVisitFrequency', DataOverviewForCenterController.getAvgVisitFrequency)

  // 获取人均停留时间
  router.post('/dataOverviewForCenter/getAvgStayTime', DataOverviewForCenterController.getAvgStayTime)

  // 获取各业务浏览总数（Top5）
  router.post('/dataOverviewForCenter/getPageViewsByProject', DataOverviewForCenterController.getPageViewsByProject)

  // 获取各业务浏览总数（分页版本）
  router.post('/dataOverviewForCenter/getPageViewsByProjectList', DataOverviewForCenterController.getPageViewsByProjectList)

  // 导出各业务浏览总数
  router.post('/dataOverviewForCenter/exportPageViewsByProject', DataOverviewForCenterController.exportPageViewsByProject)

  // 获取各业务用户总数（Top10）
  router.post('/dataOverviewForCenter/getUsersByProject', DataOverviewForCenterController.getUsersByProject)

  // 获取各业务用户总数（分页版本）
  router.post('/dataOverviewForCenter/getUsersByProjectList', DataOverviewForCenterController.getUsersByProjectList)

  // 导出各业务用户总数
  router.post('/dataOverviewForCenter/exportUsersByProject', DataOverviewForCenterController.exportUsersByProject)

  // 获取各业务新增用户总数（Top10）
  router.post('/dataOverviewForCenter/getNewUsersByProject', DataOverviewForCenterController.getNewUsersByProject)

  // 获取各业务新增用户总数（分页版本）
  router.post('/dataOverviewForCenter/getNewUsersByProjectList', DataOverviewForCenterController.getNewUsersByProjectList)

  // 导出各业务新增用户总数
  router.post('/dataOverviewForCenter/exportNewUsersByProject', DataOverviewForCenterController.exportNewUsersByProject)

  // 获取各业务活跃人数（最近10分钟，Top10）
  router.post('/dataOverviewForCenter/getActiveUsersByProject', DataOverviewForCenterController.getActiveUsersByProject)

  // 获取各业务活跃人数（最近10分钟，分页版本）
  router.post('/dataOverviewForCenter/getActiveUsersByProjectList', DataOverviewForCenterController.getActiveUsersByProjectList)

  // 导出各业务活跃人数
  router.post('/dataOverviewForCenter/exportActiveUsersByProject', DataOverviewForCenterController.exportActiveUsersByProject)

  // 获取各业务人均点击量（Top10）
  router.post('/dataOverviewForCenter/getClickPerUserByProject', DataOverviewForCenterController.getClickPerUserByProject)

  // 获取各业务人均点击量（分页版本）
  router.post('/dataOverviewForCenter/getClickPerUserByProjectList', DataOverviewForCenterController.getClickPerUserByProjectList)

  // 导出各业务人均点击量
  router.post('/dataOverviewForCenter/exportClickPerUserByProject', DataOverviewForCenterController.exportClickPerUserByProject)

  // 获取各业务人均停留时间（Top10）
  router.post('/dataOverviewForCenter/getStayTimePerUserByProject', DataOverviewForCenterController.getStayTimePerUserByProject)

  // 获取各业务人均停留时间（分页版本）
  router.post('/dataOverviewForCenter/getStayTimePerUserByProjectList', DataOverviewForCenterController.getStayTimePerUserByProjectList)

  // 导出各业务人均停留时间
  router.post('/dataOverviewForCenter/exportStayTimePerUserByProject', DataOverviewForCenterController.exportStayTimePerUserByProject)

  // 获取地理位置分布（Top20）
  router.post('/dataOverviewForCenter/getLocationDistribution', DataOverviewForCenterController.getLocationDistribution)

  // 获取地理位置分布（分页版本）
  router.post('/dataOverviewForCenter/getLocationDistributionList', DataOverviewForCenterController.getLocationDistributionList)

  // 导出地理位置分布
  router.post('/dataOverviewForCenter/exportLocationDistribution', DataOverviewForCenterController.exportLocationDistribution)

  // 获取访问来源分布（Top20）
  router.post('/dataOverviewForCenter/getSourceDistribution', DataOverviewForCenterController.getSourceDistribution)

  // 获取访问来源分布（分页版本）
  router.post('/dataOverviewForCenter/getSourceDistributionList', DataOverviewForCenterController.getSourceDistributionList)

  // 导出访问来源分布
  router.post('/dataOverviewForCenter/exportSourceDistribution', DataOverviewForCenterController.exportSourceDistribution)

  // 获取浏览器分布（Top10）
  router.post('/dataOverviewForCenter/getBrowserDistribution', DataOverviewForCenterController.getBrowserDistribution)

  // 获取浏览器分布（分页版本）
  router.post('/dataOverviewForCenter/getBrowserDistributionList', DataOverviewForCenterController.getBrowserDistributionList)

  // 导出浏览器分布
  router.post('/dataOverviewForCenter/exportBrowserDistribution', DataOverviewForCenterController.exportBrowserDistribution)

  // 获取页面操作频次（Top5）
  router.post('/dataOverviewForCenter/getPageClickFrequency', DataOverviewForCenterController.getPageClickFrequency)

  // 获取页面操作频次（分页版本）
  router.post('/dataOverviewForCenter/getPageClickFrequencyList', DataOverviewForCenterController.getPageClickFrequencyList)

  // 导出页面操作频次
  router.post('/dataOverviewForCenter/exportPageClickFrequency', DataOverviewForCenterController.exportPageClickFrequency)

  // 获取页面访问量（Top10）
  router.post('/dataOverviewForCenter/getPageVisits', DataOverviewForCenterController.getPageVisits)

  // 获取页面访问量（分页版本）
  router.post('/dataOverviewForCenter/getPageVisitsList', DataOverviewForCenterController.getPageVisitsList)

  // 导出页面访问量
  router.post('/dataOverviewForCenter/exportPageVisits', DataOverviewForCenterController.exportPageVisits)

  // 获取页面在线时长（Top10）
  router.post('/dataOverviewForCenter/getPageStayTime', DataOverviewForCenterController.getPageStayTime)

  // 获取页面在线时长（分页版本）
  router.post('/dataOverviewForCenter/getPageStayTimeList', DataOverviewForCenterController.getPageStayTimeList)

  // 导出页面在线时长
  router.post('/dataOverviewForCenter/exportPageStayTime', DataOverviewForCenterController.exportPageStayTime)

  // 获取api接口列表
  router.get('/dataOverviewForCenter/apiList', DataOverviewForCenterController.apiList)
}

