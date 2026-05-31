const { BuryPointUsersController } = require("../../controllers/controllers")

module.exports = (router) => {
  // 用户列表管理
  router.post('/buryPointUsers/list', BuryPointUsersController.list);
  router.post('/buryPointUsers/export', BuryPointUsersController.export);
  router.get('/buryPointUsers/detail', BuryPointUsersController.detail);
  router.get('/buryPointUsers/detailByWeCustomerKey', BuryPointUsersController.detailByWeCustomerKey);
  router.post('/buryPointUsers/update', BuryPointUsersController.update);
  router.post('/buryPointUsers/getCountBySegmentId', BuryPointUsersController.getCountBySegmentId);
  router.post('/buryPointUsers/userBehaviorAnalysis', BuryPointUsersController.userBehaviorAnalysis);
  router.post('/buryPointUsers/userStatistics', BuryPointUsersController.userStatistics);
}
