const { WeHandleDataController } = require("../../controllers/controllers")

module.exports = (router) => {
  /**
   * 初始化数据
   */
  router.get('/initWeFieldData', WeHandleDataController.initWeFieldData);
  router.get('/initWePointData', WeHandleDataController.initWePointData);
  router.get('/initWeTemplateData', WeHandleDataController.initWeTemplateData);
  /**升级2.0版本 */
  router.get('/upgradeVersion', WeHandleDataController.upgradeVersion_2_0);
  router.get('/createDemoTemplateData', WeHandleDataController.createDemoTemplateData);
}
