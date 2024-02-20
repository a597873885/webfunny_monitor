const { BuryPointAlarmMessageController } = require("../../controllers/controllers")

module.exports = (router) => {
  // 报警记录
  router.post('/buryPointAlarmMessage/create', BuryPointAlarmMessageController.create);
  router.post('/buryPointAlarmMessage/list', BuryPointAlarmMessageController.list);
  router.get('/buryPointAlarmMessage/detail', BuryPointAlarmMessageController.detail);
  router.post('/buryPointAlarmMessage/delete', BuryPointAlarmMessageController.delete);
  
  router.post('/buryPointAlarmMessage/test', BuryPointAlarmMessageController.testSendNotice);
}
