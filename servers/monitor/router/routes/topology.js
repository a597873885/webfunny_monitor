const { TopologyController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 获取前端应用按域名聚合的数据
  router.post('/topology/getFrontendApps', TopologyController.getFrontendApps);
}

