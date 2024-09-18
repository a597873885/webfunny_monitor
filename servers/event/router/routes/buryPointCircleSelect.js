// const BuryPointCircleSelectController = require('../../controllers/buryPointCircleSelect')
const { BuryPointCircleSelectController } = require("../../controllers/controllers")

module.exports = (router) => {
  // 圈选人管理
  router.post('/buryPointCircleSelect/create', BuryPointCircleSelectController.create);
  router.post('/buryPointCircleSelect/update', BuryPointCircleSelectController.update);
  router.post('/buryPointCircleSelect/getPageList', BuryPointCircleSelectController.getPageList);
  router.post('/buryPointCircleSelect/delete', BuryPointCircleSelectController.delete);
  router.get('/buryPointCircleSelect/detail', BuryPointCircleSelectController.detail);
  router.post('/buryPointCircleSelect/getAllBindUserId', BuryPointCircleSelectController.getAllBindUserId);
}
