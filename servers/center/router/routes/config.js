const { ConfigController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.post('/config/createExportCode', ConfigController.createExportCode)
  router.post('/config/verifyExportCode', ConfigController.verifyExportCode)
  router.get('/config/getSelfMonitorConfig', ConfigController.getSelfMonitorConfig)
  router.post('/config/updateSelfMonitorConfig', ConfigController.updateSelfMonitorConfig)
}
