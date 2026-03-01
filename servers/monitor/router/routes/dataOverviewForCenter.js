const { DataOverviewForCenterController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 数据概览接口（应用中心使用）
   */
  
  // 获取数据概览统计信息
  // POST /getOverviewStats
  // 参数: { companyId, startDate?, endDate? }
  // 返回: { pageSecondOpenRate, pageWhiteScreenCount, httpSuccessRate, httpTimeoutCount, jsErrorCount, resourceErrorCount }
  router.post('/getOverviewStats', DataOverviewForCenterController.getOverviewStats)

  // 获取页面秒开率（独立接口）
  // POST /getPageSecondOpenRate
  // 参数: { companyId, startDate?, endDate? }
  // 返回: { rate, totalCount, secondOpenCount }
  router.post('/getPageSecondOpenRate', DataOverviewForCenterController.getPageSecondOpenRate)

  // 获取页面白屏总量（独立接口）
  // POST /getPageWhiteScreenCount
  // 参数: { companyId, startDate?, endDate? }
  // 返回: { count }
  router.post('/getPageWhiteScreenCount', DataOverviewForCenterController.getPageWhiteScreenCount)

  // 获取接口请求成功率（独立接口）
  // POST /getHttpSuccessRate
  // 参数: { companyId, startDate?, endDate? }
  // 返回: { successRate, totalCount, successCount, errorCount }
  router.post('/getHttpSuccessRate', DataOverviewForCenterController.getHttpSuccessRate)

  // 获取接口请求超时总量（独立接口）
  // POST /getHttpTimeoutTotal
  // 参数: { companyId, startDate?, endDate? }
  // 返回: { count }
  router.post('/getHttpTimeoutTotal', DataOverviewForCenterController.getHttpTimeoutTotal)

  // 获取代码错误总量（独立接口）
  // POST /getJsErrorTotal
  // 参数: { companyId, startDate?, endDate? }
  // 返回: { count }
  router.post('/getJsErrorTotal', DataOverviewForCenterController.getJsErrorTotal)

  // 获取静态资源错误总量（独立接口）
  // POST /getResourceErrorTotal
  // 参数: { companyId, startDate?, endDate? }
  // 返回: { count }
  router.post('/getResourceErrorTotal', DataOverviewForCenterController.getResourceErrorTotal)

  // 获取各应用页面访问总量
  // POST /getPageViewByProject
  // 参数: { companyId, startDate?, endDate?, limit? }
  // 返回: { list: [{webMonitorId, projectName, count}] }
  router.post('/getPageViewByProject', DataOverviewForCenterController.getPageViewByProject)

  // 获取各应用页面访问总量（分页版本，支持搜索）
  // POST /getPageViewByProjectList
  // 参数: { companyId, startDate?, endDate?, projectName?, pageNum?, pageSize? }
  // 返回: { list: [{webMonitorId, projectName, count}], total }
  router.post('/getPageViewByProjectList', DataOverviewForCenterController.getPageViewByProjectList)

  // 导出各应用页面访问总量（全部数据）
  // POST /exportPageViewByProject
  // 参数: { companyId, startDate?, endDate?, projectName? }
  // 返回: { list: [{webMonitorId, projectName, count}] }
  router.post('/exportPageViewByProject', DataOverviewForCenterController.exportPageViewByProject)

  // 获取各应用接口请求总量（用于图表展示）
  // POST /getHttpRequestByProject
  // 参数: { companyId, startDate?, endDate?, limit? }
  // 返回: { list: [{webMonitorId, projectName, count}] }
  router.post('/getHttpRequestByProject', DataOverviewForCenterController.getHttpRequestByProject)

  // 获取各应用接口请求总量（分页版本，支持搜索）
  // POST /getHttpRequestByProjectList
  // 参数: { companyId, startDate?, endDate?, projectName?, pageNum?, pageSize? }
  // 返回: { list: [{webMonitorId, projectName, count}], total }
  router.post('/getHttpRequestByProjectList', DataOverviewForCenterController.getHttpRequestByProjectList)

  // 导出各应用接口请求总量（全部数据）
  // POST /exportHttpRequestByProject
  // 参数: { companyId, startDate?, endDate?, projectName? }
  // 返回: { list: [{webMonitorId, projectName, count}] }
  router.post('/exportHttpRequestByProject', DataOverviewForCenterController.exportHttpRequestByProject)

  // 获取各应用页面加载超时率（用于表格展示）
  // POST /getPageLoadTimeoutByProject
  // 参数: { companyId, startDate?, endDate?, timeoutThreshold?, limit? }
  // 返回: { list: [{webMonitorId, projectName, avgLoadTime, timeoutRate, totalCount}] }
  router.post('/getPageLoadTimeoutByProject', DataOverviewForCenterController.getPageLoadTimeoutByProject)

  // 获取各应用页面加载超时率（分页版本，支持搜索）
  // POST /getPageLoadTimeoutByProjectList
  // 参数: { companyId, startDate?, endDate?, timeoutThreshold?, projectName?, pageNum?, pageSize? }
  // 返回: { list: [{webMonitorId, projectName, avgLoadTime, timeoutRate, totalCount}], total }
  router.post('/getPageLoadTimeoutByProjectList', DataOverviewForCenterController.getPageLoadTimeoutByProjectList)

  // 导出各应用页面加载超时率（全部数据）
  // POST /exportPageLoadTimeoutByProject
  // 参数: { companyId, startDate?, endDate?, timeoutThreshold?, projectName? }
  // 返回: { list: [{webMonitorId, projectName, avgLoadTime, timeoutRate, totalCount}] }
  router.post('/exportPageLoadTimeoutByProject', DataOverviewForCenterController.exportPageLoadTimeoutByProject)

  // 获取各应用接口请求超时率（用于表格展示）
  // POST /getHttpTimeoutByProject
  // 参数: { companyId, startDate?, endDate?, timeoutThreshold?, limit? }
  router.post('/getHttpTimeoutByProject', DataOverviewForCenterController.getHttpTimeoutByProject)

  // 获取各应用接口请求超时率（分页版本，支持搜索）
  // POST /getHttpTimeoutByProjectList
  // 参数: { companyId, startDate?, endDate?, timeoutThreshold?, projectName?, pageNum?, pageSize? }
  router.post('/getHttpTimeoutByProjectList', DataOverviewForCenterController.getHttpTimeoutByProjectList)

  // 导出各应用接口请求超时率（全部数据）
  // POST /exportHttpTimeoutByProject
  router.post('/exportHttpTimeoutByProject', DataOverviewForCenterController.exportHttpTimeoutByProject)

  // 获取各应用接口请求失败率（用于图表展示）
  // POST /getHttpFailRateByProject
  router.post('/getHttpFailRateByProject', DataOverviewForCenterController.getHttpFailRateByProject)

  // 获取各应用接口请求失败率（分页版本，支持搜索）
  // POST /getHttpFailRateByProjectList
  router.post('/getHttpFailRateByProjectList', DataOverviewForCenterController.getHttpFailRateByProjectList)

  // 导出各应用接口请求失败率（全部数据）
  // POST /exportHttpFailRateByProject
  router.post('/exportHttpFailRateByProject', DataOverviewForCenterController.exportHttpFailRateByProject)

  // 获取接口请求失败类型占比（按状态码分组）
  // POST /getHttpFailTypeDistribution
  router.post('/getHttpFailTypeDistribution', DataOverviewForCenterController.getHttpFailTypeDistribution)

  // 获取各应用代码错误总量（用于图表展示）
  // POST /getJsErrorByProject
  router.post('/getJsErrorByProject', DataOverviewForCenterController.getJsErrorByProject)

  // 获取各应用代码错误总量（分页版本，支持搜索）
  // POST /getJsErrorByProjectList
  router.post('/getJsErrorByProjectList', DataOverviewForCenterController.getJsErrorByProjectList)

  // 导出各应用代码错误总量（全部数据）
  // POST /exportJsErrorByProject
  router.post('/exportJsErrorByProject', DataOverviewForCenterController.exportJsErrorByProject)

  // 获取各应用自定义错误总量（用于图表展示）
  // POST /getConsoleErrorByProject
  router.post('/getConsoleErrorByProject', DataOverviewForCenterController.getConsoleErrorByProject)

  // 获取各应用自定义错误总量（分页版本，支持搜索）
  // POST /getConsoleErrorByProjectList
  router.post('/getConsoleErrorByProjectList', DataOverviewForCenterController.getConsoleErrorByProjectList)

  // 导出各应用自定义错误总量（全部数据）
  // POST /exportConsoleErrorByProject
  router.post('/exportConsoleErrorByProject', DataOverviewForCenterController.exportConsoleErrorByProject)

  // 获取各应用静态资源错误总量（用于图表展示）
  // POST /getResourceErrorByProject
  router.post('/getResourceErrorByProject', DataOverviewForCenterController.getResourceErrorByProject)

  // 获取各应用静态资源错误总量（分页版本，支持搜索）
  // POST /getResourceErrorByProjectList
  router.post('/getResourceErrorByProjectList', DataOverviewForCenterController.getResourceErrorByProjectList)

  // 导出各应用静态资源错误总量（全部数据）
  // POST /exportResourceErrorByProject
  router.post('/exportResourceErrorByProject', DataOverviewForCenterController.exportResourceErrorByProject)

  // 获取接口错误总量（用于概览指标）
  // POST /getHttpErrorTotal
  router.post('/getHttpErrorTotal', DataOverviewForCenterController.getHttpErrorTotal)
  
  // 获取api接口列表
  router.get('/dataOverviewForCenter/apiList', DataOverviewForCenterController.apiList)
}
