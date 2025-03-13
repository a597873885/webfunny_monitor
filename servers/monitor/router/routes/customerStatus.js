const { CustomerStatusController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 添加连线状态
  router.get('/addConnectStatus', CustomerStatusController.addConnectStatus);
  // 添加vconsole状态
  router.get('/addVconsoleStatus', CustomerStatusController.addVconsoleStatus);
  // 获取连线状态列表
  router.get('/getConnectStatusList', CustomerStatusController.getConnectStatusList);
  // 获取今天用户各种开启状态
  router.post('/getConnectStatusList', CustomerStatusController.getConnectStatusList);
  // 关闭连线状态
  router.post('/closeOperation', CustomerStatusController.closeOperation);
  // 开启连线状态
  router.post('/openOperation', CustomerStatusController.openOperation);
}
