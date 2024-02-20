const { BuryPointTemplateController } = require("../../controllers/controllers")

module.exports = (router) => {
  /**
   * 模板接口
   */
  router.post('/buryPointTemplate/create', BuryPointTemplateController.create);
  router.post('/buryPointTemplate/updateName', BuryPointTemplateController.updateName);
  router.post('/buryPointTemplate/delete', BuryPointTemplateController.delete);
  router.post('/buryPointTemplate/deleteBatch', BuryPointTemplateController.deleteBatch);
  router.post('/buryPointTemplate/copy', BuryPointTemplateController.copy);
  router.post('/buryPointTemplate/createProject', BuryPointTemplateController.createProject);
  router.post('/buryPointTemplate/getMyList', BuryPointTemplateController.getMyTemplatePageList);
  router.post('/buryPointTemplate/getCommonList', BuryPointTemplateController.getCommonTemplatePageList);
  router.post('/buryPointTemplate/getSysList', BuryPointTemplateController.getSysTemplatePageList);
  router.post('/buryPointTemplate/detail', BuryPointTemplateController.detail);
}
