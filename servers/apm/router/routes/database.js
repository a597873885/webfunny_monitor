// const DatabaseController = require('../../controllers/database')
const { DatabaseController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 获取数据库筛选器选项
  router.post('/database/options', DatabaseController.getDatabaseOptions)
  
  // 获取数据库调用分析列表
  router.post('/database/callAnalysis/list', DatabaseController.getCallAnalysisList)
  
  // 获取SQL分析列表
  router.post('/database/sqlAnalysis/list', DatabaseController.getSQLAnalysisList)
  
  // 获取慢SQL列表
  router.post('/slowSql/list', DatabaseController.getSlowSqlList)
  
  // 获取慢SQL趋势数据
  router.post('/slowSql/trend', DatabaseController.getSlowSqlTrend)
  
  // 获取慢SQL筛选器选项
  router.post('/slowSql/filterOptions', DatabaseController.getSlowSqlFilterOptions)
  
  // 获取SQL详情
  router.post('/slowSql/detail', DatabaseController.getSqlDetail)
  
  // 获取数据库调用拓扑关系
  router.post('/database/topology', DatabaseController.getDatabaseTopology)
  
  // 获取数据库概览时序指标
  router.post('/database/overview/metrics', DatabaseController.getDatabaseOverviewMetrics)
  
  // 获取数据库概览TOP10列表
  router.post('/database/overview/topList', DatabaseController.getDatabaseTopList)
}
