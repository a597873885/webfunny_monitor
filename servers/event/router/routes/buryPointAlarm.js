const { BuryPointAlarmController } = require("../../controllers/controllers")

module.exports = (router) => {
  // 告警规则
  router.post('/buryPointAlarm/create', BuryPointAlarmController.create);
  router.post('/buryPointAlarm/copy', BuryPointAlarmController.copy);
  router.post('/buryPointAlarm/update', BuryPointAlarmController.update);
  router.post('/buryPointAlarm/updateStatus', BuryPointAlarmController.updateStatus);
  router.post('/buryPointAlarm/list', BuryPointAlarmController.list);
  router.post('/buryPointAlarm/getListByProjectId', BuryPointAlarmController.getListByProjectId);
  router.post('/buryPointAlarm/delete', BuryPointAlarmController.delete);
  router.post('/buryPointAlarm/batchDeletion', BuryPointAlarmController.batchDeletion);
  router.get('/buryPointAlarm/detail', BuryPointAlarmController.detail);
}
