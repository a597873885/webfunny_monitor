const { AlarmOverviewController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.post('/alarm/alarmOverview', AlarmOverviewController.getOverviewTrend)
  router.get('/alarm/getAlarmLatestTop10', AlarmOverviewController.getAlarmLatestTop10)
  router.get('/alarm/getAlarmApplicationTop10', AlarmOverviewController.getAlarmApplicationTop10)
  router.get('/alarm/getAlarmCountOverview', AlarmOverviewController.getAlarmCountOverview)
}
