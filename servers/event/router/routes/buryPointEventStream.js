const { BuryPointEventStreamController } = require("../../controllers/controllers")

module.exports = (router) => {
  // 新路径分析预览
  router.post("/buryPointEventStream/getPathAnalysis", BuryPointEventStreamController.getPathAnalysis)
}