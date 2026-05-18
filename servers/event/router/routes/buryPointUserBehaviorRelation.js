const { BuryPointUserBehaviorRelationController } = require('../../controllers/controllers')


module.exports = (router) => {
  // 来源点位管理
  router.post('/buryPointUserBehaviorRelation/getPointRelationList', BuryPointUserBehaviorRelationController.getPointRelationList);
  router.post('/buryPointUserBehaviorRelation/getSourceFieldValueList', BuryPointUserBehaviorRelationController.getSourceFieldValueList);
  router.post('/buryPointUserBehaviorRelation/getSingleNodeDetail', BuryPointUserBehaviorRelationController.getSingleNodeDetail);
  router.post('/buryPointUserBehaviorRelation/test', BuryPointUserBehaviorRelationController.test);
  // 数据预览
  router.post('/buryPointUserBehaviorRelation/getDataPreview', BuryPointUserBehaviorRelationController.getDataPreview);

}
