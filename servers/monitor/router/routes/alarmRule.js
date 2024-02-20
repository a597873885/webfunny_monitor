const { AlarmRuleController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.post('/createNewAlarmRule', AlarmRuleController.createNewAlarmRule);
  router.post('/getAllAlarmRule', AlarmRuleController.getAllAlarmRule);
  router.post('/deleteAlarmRule', AlarmRuleController.deleteAlarmRule);
}
