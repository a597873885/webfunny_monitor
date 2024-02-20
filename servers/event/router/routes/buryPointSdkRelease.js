const { SdkReleaseController } = require("../../controllers/controllers")

module.exports = (router) => {
  /**
   * SDK发布接口
   */
  router.post('/sdkRelease/create', SdkReleaseController.create);
  router.post('/sdkRelease/update', SdkReleaseController.update);
  router.post('/sdkRelease/delete', SdkReleaseController.delete);
  router.get('/sdkRelease/detail', SdkReleaseController.detail);
  router.post('/sdkRelease/changeUploadDomain', SdkReleaseController.changeUploadDomain);
  router.post('/sdkRelease/page', SdkReleaseController.getPageList);
  router.post('/sdkRelease/list', SdkReleaseController.getList);
  router.get('/sdkRelease/AllList', SdkReleaseController.getAllList);
  router.post('/sdkRelease/createReleaseScript', SdkReleaseController.createReleaseScript);
  router.get('/sdkRelease/downLoad', SdkReleaseController.downloadScript);
}
