const { AlarmRuleController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.get('/alarm/getAlarmRuleList', AlarmRuleController.getAlarmRule)
  router.post('/alarm/createAlarmRule', AlarmRuleController.createAlarmRule)
  router.get('/alarm/getAlarmRuleById', AlarmRuleController.getAlarmRuleById)
  router.post('/alarm/deleteAlarmRule', AlarmRuleController.deleteAlarmRule)
  router.post('/alarm/updateAlarmRule', AlarmRuleController.updateAlarmRule)
  router.post('/alarm/updateAlarmRuleStatus', AlarmRuleController.updateAlarmRuleStatus)
  router.post('/alarm/addRuleForApplication', AlarmRuleController.addRuleForApplication)
  router.post('/alarm/getRulesOfApplication', AlarmRuleController.getRulesOfApplication)
}
