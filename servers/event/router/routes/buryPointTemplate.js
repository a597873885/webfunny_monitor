const { BuryPointTemplateController } = require("../../controllers/controllers")
const multer = require('@koa/multer');
const path = require('path');
const fs = require('fs').promises;
// 确保上传目录存在的函数
async function ensureUploadDir() {
  const uploadDir = path.join("././lib", 'uploads');
  try {
    await fs.access(uploadDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 目录不存在，递归创建
      await fs.mkdir(uploadDir, { recursive: true });
      console.log(`✅ 上传目录创建成功: ${uploadDir}`);
    } else {
      throw error;
    }
  }
  return uploadDir;
}

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const uploadDir = await ensureUploadDir();
        cb(null, uploadDir);
      } catch (error) {
        cb(error, null);
      }
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
