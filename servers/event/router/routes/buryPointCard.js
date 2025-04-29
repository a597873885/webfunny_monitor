const { BuryPointCardController } = require("../../controllers/controllers")

module.exports = (router) => {
  /**
   * 点位卡片接口
   */
  router.post('/buryPointCard/create', BuryPointCardController.create);
  router.post('/buryPointCard/card/copy', BuryPointCardController.copyCard);
  router.post('/buryPointCard/delete', BuryPointCardController.delete);
  router.post('/buryPointCard/deleteBatch', BuryPointCardController.deleteBatch);
  router.post('/buryPointCard/list', BuryPointCardController.getList);
  router.post('/buryPointCard/getList', BuryPointCardController.getListByPageIdAndName);
  router.post('/buryPointCard/update', BuryPointCardController.update);
  router.get('/buryPointCard/detail', BuryPointCardController.detail);
  router.get('/buryPointCard/getCardQuery', BuryPointCardController.getCardQuery);
  router.post('/buryPointCard/sort', BuryPointCardController.sort);
  router.post('/buryPointCard/order', BuryPointCardController.order);
  router.post('/buryPointCard/refresh', BuryPointCardController.refresh);
  router.post('/buryPointCard/getTempBuryPointCardList', BuryPointCardController.getTempBuryPointCardList);
  router.post('/buryPointCard/groupByQuery', BuryPointCardController.groupByQuery);
  router.get('/buryPointCard/export', BuryPointCardController.export);
  router.get('/buryPointCard/tableDisplay', BuryPointCardController.tableDisplay);
  router.post('/buryPointCard/moveCard', BuryPointCardController.moveCard);
  router.post('/buryPointCard/getPathPage', BuryPointCardController.getPathPage);
  router.post('/buryPointCard/getPageWidthList', BuryPointCardController.getPageWidthList);
  router.post('/buryPointCard/getHeatMapPerData', BuryPointCardController.getHeatMapPerStatisticData);
  router.post('/buryPointCard/getHeatMapValueTimeSlotData', BuryPointCardController.getHeatMapValueTimeSlotStatisticData);
  router.post('/buryPointCard/getFunnelEveryDay', BuryPointCardController.getFunnelEveryDayStatisticList);
  router.post('/buryPointCard/getRealOnlineCount', BuryPointCardController.getRealOnlineCount);
  router.post('/buryPointCard/getDataPreview', BuryPointCardController.getDataPreview);
  router.post('/buryPointCard/getCardList', BuryPointCardController.getCardList);//先返回不带分析数据的list
  router.post('/buryPointCard/getCardListByIds', BuryPointCardController.getCardListByIds);//根据卡片ids得到分析数据list
}
