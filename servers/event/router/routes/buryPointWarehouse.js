const { BuryPointWarehouseController } = require("../../controllers/controllers")

module.exports = (router) => {
  /**
   * 点位仓库接口
   */
  router.post('/buryPointWarehouse/create', BuryPointWarehouseController.create);
  router.post('/buryPointWarehouse/update', BuryPointWarehouseController.update);
  router.post('/buryPointWarehouse/delete', BuryPointWarehouseController.delete);
  router.get('/buryPointWarehouse/detail', BuryPointWarehouseController.detail);
  router.post('/buryPointWarehouse/page', BuryPointWarehouseController.getPageList);
  router.post('/buryPointWarehouse/list', BuryPointWarehouseController.getList);
  router.post('/buryPointWarehouse/getProjectAndWeList', BuryPointWarehouseController.getAllPointList);
  router.post('/buryPointWarehouse/getProjectAndOldList', BuryPointWarehouseController.getProjectAndOldList);
  router.get('/buryPointWarehouse/AllList', BuryPointWarehouseController.getAllList);
  router.post('/buryPointWarehouse/pointExport', BuryPointWarehouseController.exportPoint);
}
