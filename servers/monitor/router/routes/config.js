const { ConfigController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.post('/config', ConfigController.create);
  // 把有效token存入内存中
  router.post('/storeTokenToMemory', ConfigController.storeTokenToMemory);
}