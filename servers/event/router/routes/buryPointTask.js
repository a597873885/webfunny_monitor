const { BuryPointTaskController } = require("../../controllers/controllers")

module.exports = (router) => {
  //任务管理
  router.post('/buryPointTask/create', BuryPointTaskController.create);
  router.post('/buryPointTask/delete', BuryPointTaskController.delete);
  router.post('/buryPointTask/batchDeletion', BuryPointTaskController.batchDeletion);
  router.post('/buryPointTask/update', BuryPointTaskController.update);
  router.post('/buryPointTask/list', BuryPointTaskController.list);
  router.post('/buryPointTask/detail', BuryPointTaskController.detail);
  router.post('/buryPointTask/updateStatus', BuryPointTaskController.updateStatus);
  router.post('/buryPointTask/changeHandleMan', BuryPointTaskController.changeHandleMan);
}
