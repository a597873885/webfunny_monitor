const { LogProjectController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 应用接口
   */
  // 创建新的监控项目
  router.post('/logProject/createNewProject', LogProjectController.createNewProject);
  // 创建新的监控项目API
  router.post('/logProject/createNewProjectForApi', LogProjectController.createNewProjectForApi);
  // 设置日志保存时间
  router.post('/logProject/resetSaveDays', LogProjectController.resetSaveDays);
  // 获取项目列表
  router.post('/logProject/getProjectList', LogProjectController.getProjectList);
}
