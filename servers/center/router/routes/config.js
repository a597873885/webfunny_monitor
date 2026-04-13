const { ConfigController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.post('/config/createExportCode', ConfigController.createExportCode)
  router.post('/config/verifyExportCode', ConfigController.verifyExportCode)
}
