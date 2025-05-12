const { BuryPointScreenShotController } = require("../../controllers/controllers")

module.exports = (router) => {
  //任务管理
  router.post('/screenShot/upload', BuryPointScreenShotController.upload);
  router.post('/screenShot/delete', BuryPointScreenShotController.delete);
  router.post('/screenShot/batchDeletion', BuryPointScreenShotController.batchDeletion);
  router.post('/screenShot/update', BuryPointScreenShotController.update);
  router.post('/screenShot/list', BuryPointScreenShotController.list);
  router.post('/screenShot/detail', BuryPointScreenShotController.detail);
  router.post('/screenShot/updateStatus', BuryPointScreenShotController.updateStatus);
  router.post('/screenShot/changeHandleMan', BuryPointScreenShotController.changeHandleMan);
  router.post('/screenShot/uploadImgFileFake', BuryPointScreenShotController.uploadImgFileFake);
  router.post('/screenShot/uploadImgFile', BuryPointScreenShotController.uploadImgFile);
}
