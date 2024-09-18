// const BuryPointVisualTrackingController = require('../../controllers/buryPointVisualTracking')
const { BuryPointVisualTrackingController } = require("../../controllers/controllers")

module.exports = (router) => {
  // 可视化全埋点
  router.post('/buryPointVisualTracking/create', BuryPointVisualTrackingController.create);
  router.post('/buryPointVisualTracking/update', BuryPointVisualTrackingController.update);
  router.post('/buryPointVisualTracking/getPageList', BuryPointVisualTrackingController.getPageList);
  router.post('/buryPointVisualTracking/delete', BuryPointVisualTrackingController.delete);
  router.get('/buryPointVisualTracking/detail', BuryPointVisualTrackingController.detail);
  router.post('/buryPointVisualTracking/updateNameById', BuryPointVisualTrackingController.updateNameById);
}
