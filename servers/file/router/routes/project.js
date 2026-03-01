const { ProjectController } = require('../../controllers/controllers')

module.exports = (router) => {
  /**
   * 应用接口
   */
  // 添加应用
  router.post('/project', ProjectController.create);
  // 获取应用详细信息
  router.get('/projectDetail', ProjectController.detail);
  // 获取应用列表
  router.get('/project/list', ProjectController.getProjectList);
}
