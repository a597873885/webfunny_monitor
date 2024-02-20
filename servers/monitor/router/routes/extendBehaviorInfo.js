const { ExtendBehaviorInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 拓展行为日志
  router.post('/extendBehavior', ExtendBehaviorInfoController.create);
}
