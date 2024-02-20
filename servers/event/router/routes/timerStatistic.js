const { TimerStatisticController } = require("../../controllers/controllers")

module.exports = (router) => {
  router.get('/test/calcu', TimerStatisticController.calculateDataPreDay);
  router.get('/test/statistic', TimerStatisticController.test);
}
