const { BuryPointAlarmRulesController } = require("../../controllers/controllers")

module.exports = (router) => {
  router.post('/buryPointAlarmRules/create', BuryPointAlarmRulesController.create);
  router.get('/buryPointAlarmRules/detail', BuryPointAlarmRulesController.detail);
  router.post('/buryPointAlarmRules/list', BuryPointAlarmRulesController.list);
  router.post('/buryPointAlarmRules/update', BuryPointAlarmRulesController.update);
  router.post('/buryPointAlarmRules/updateStatus', BuryPointAlarmRulesController.updateStatus);
  router.post('/buryPointAlarmRules/delete', BuryPointAlarmRulesController.delete);
  router.post('/buryPointAlarmRules/batchDeletion', BuryPointAlarmRulesController.batchDeletion);
  router.post('/buryPointAlarmRules/getAlarmDetailTrend', BuryPointAlarmRulesController.getAlarmDetailTrend);
}
