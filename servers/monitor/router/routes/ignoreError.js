const { IgnoreErrorController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 忽略js错误信息接口
   */
  // 创建忽略js错误信息
  router.post('/ignoreError', IgnoreErrorController.create);
  // 获取忽略js错误信息列表
  router.get('/ignoreError', IgnoreErrorController.getIgnoreErrorList);
  // 获取应用忽略js错误信息列表
  router.get('/ignoreErrorByApplication', IgnoreErrorController.ignoreErrorByApplication);
  // 获取忽略js错误信息详情
  router.get('/ignoreError/:id', IgnoreErrorController.detail);
  // 删除忽略js错误信息
  router.delete('/ignoreError/:id', IgnoreErrorController.delete);
  // 更改忽略js错误信息
  router.put('/ignoreError/:id', IgnoreErrorController.update);
}
