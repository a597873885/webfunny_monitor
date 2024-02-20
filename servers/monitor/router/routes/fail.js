const { FailController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 更新激活码
  router.post('/createPurchaseCode', FailController.createPurchaseCode);
}
