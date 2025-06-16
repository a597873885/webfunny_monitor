const { BuryPointTemplateController } = require("../../controllers/controllers")
const multer = require('@koa/multer');
const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      //线上
      cb(null, path.join("servers/event/lib", 'uploads'));
    },
    filename: (req, file, cb) => {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  }),
  limits: { fileSize: 100 * 1024 * 1024 } // 限制文件大小
});

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
  router.post('/buryPointTemplate/import', 
    upload.fields([{ name: 'fileFieldName', maxCount: 1 }]),
    BuryPointTemplateController.import);
  router.get('/buryPointTemplate/download', BuryPointTemplateController.download);

}
