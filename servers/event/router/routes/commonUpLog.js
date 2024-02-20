const { CommonUpLog } = require("../../controllers/controllers")

module.exports = (router) => {
  router.post('/initCf', CommonUpLog.initFunnelConfig);
  router.post('/upEvent', CommonUpLog.upEvent);
  router.post('/upEvents', CommonUpLog.upEvents);
  router.post('/upMyEvents', CommonUpLog.upMyEvents);
}
