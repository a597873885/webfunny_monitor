// const Common = require('../../controllers/common')
const { Common } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 上报日志信息
  router.post('/upLogs', Common.upLogs);

  // 上报错误日志信息
  router.post('/upTraceLogs', Common.upTraceLogs);
}
