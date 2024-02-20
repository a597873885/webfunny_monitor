const { SysInfoController } = require("../../controllers/controllers")

module.exports = (router) => {
  router.get('/sysInfo', SysInfoController.getSysInfo);
  router.get('/eventBaseInfo', SysInfoController.getSysInfo);
  router.get('/baseInfo', SysInfoController.getBaseInfo);
  router.get('/saas/projectInfo', SysInfoController.getProjectInfo);
}
