const { ApplicationConfigController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 通用配置接口
  router.post("/applicationConfig", ApplicationConfigController.create)
  router.post("/updateSysConfigInfo", ApplicationConfigController.updateSysConfigInfo)
  router.post("/getSysConfigInfo", ApplicationConfigController.getSysConfigInfo)
  router.post('/monitorBaseInfo', ApplicationConfigController.monitorBaseInfo);
  router.post('/eventBaseInfo', ApplicationConfigController.eventBaseInfo);
}
