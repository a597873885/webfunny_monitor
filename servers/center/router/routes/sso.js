// const ApplicationConfigController = require('../../controllers/applicationConfig')
const { ApplicationConfigController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 获取飞书的
  router.get("/getSignatureForFeiShu", ApplicationConfigController.getSignatureForFeiShu)
  // 飞书获取用于信息
  router.get("/getAccessTokenByCodeForFeiShu", ApplicationConfigController.getAccessTokenByCodeForFeiShu)

  // 获取ids的token

  router.get("/getAccessTokenByCodeForIds", ApplicationConfigController.getAccessTokenByCodeForIds)

  router.post("/apiIdsNotice", ApplicationConfigController.apiIdsNotice)
}
