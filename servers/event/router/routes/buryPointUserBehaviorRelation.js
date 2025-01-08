const BuryPointUserBehaviorRelationController = require('../../controllers/controllers')


module.exports = (router) => {
  // 来源点位管理
  router.post('/buryPointUserBehaviorRelation/getPointRelationList', BuryPointUserBehaviorRelationController.BuryPointUserBehaviorRelationController.getPointRelationList);
  router.post('/buryPointUserBehaviorRelation/getSourceFieldValueList', BuryPointUserBehaviorRelationController.BuryPointUserBehaviorRelationController.getSourceFieldValueList);
  router.post('/buryPointUserBehaviorRelation/test', BuryPointUserBehaviorRelationController.BuryPointUserBehaviorRelationController.test);
}
