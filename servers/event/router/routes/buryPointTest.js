const { BuryPointTestController } = require("../../controllers/controllers")

module.exports = (router) => {
  /**
   * 打点测试
   */
  router.post('/buryPointTest/page', BuryPointTestController.getPageList);
  // 查询失败的
  router.post('/buryPointTest/page/error', BuryPointTestController.failList);
  // 点位查询
  router.post('/buryPointTest/search', BuryPointTestController.search);
  // api导出数据
  router.post('/buryPointTest/apiExport', BuryPointTestController.apiExport);
  // 根据userId查询点位列表
  router.post('/buryPointTest/searchAllRecord', BuryPointTestController.searchAllRecord);
  // 根据字段的key查询字段名称
  router.post('/buryPointTest/searchFieldName', BuryPointTestController.searchFieldName);
  // 点位查询导出
  router.get('/buryPointTest/searchExport', BuryPointTestController.exportData);
}
