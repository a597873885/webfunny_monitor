const { AlarmController } = require("../../controllers/controllers")

const createRouter = (router) => {
  router.post("/alarm/checkAlarmResult", AlarmController.checkAlarmResult)
}

module.exports = createRouter
