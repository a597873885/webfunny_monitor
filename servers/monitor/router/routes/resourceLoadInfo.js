const { ResourceLoadInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 静态资源加载状态接口
   */
  // 获取静态资源错误分类
  router.get('/getResourceErrorCountByDay', ResourceLoadInfoController.getResourceErrorCountByDay);
  router.post('/getResourceLoadInfoListByDay', ResourceLoadInfoController.getResourceLoadInfoListByDay);
  // 获取最近24小时内，静态资源加载错误发生数量
  router.get('/getResourceErrorCountByHour', ResourceLoadInfoController.getResourceErrorCountByHour);
}
