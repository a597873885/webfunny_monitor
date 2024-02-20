const { CustomerPvLeaveController } = require("../../controllers/controllers.js")
module.exports = (router) => {
  // 获取24小时内每小的跳出率
  router.post('/getCusLeavePercentByHour', CustomerPvLeaveController.getCusLeavePercentByHour);
}
