const { AlarmListController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.get('/alarm/alarmList', AlarmListController.getAlarmList)
  router.post('/alarm/getAlarmTriggerByAlarmId', AlarmListController.getAlarmTriggerByAlarmId)
  router.get('/alarm/getAlarmDetailById', AlarmListController.getAlarmDetailById)
  router.post('/alarm/getAlarmHistory', AlarmListController.getAlarmHistory)
  router.post('/alarm/getAlarmTriggerListBySize', AlarmListController.getAlarmTriggerListBySize)
  router.post('/alarm/getAlarmStatsForLast7Days', AlarmListController.getAlarmStatsForLast7Days)
}
