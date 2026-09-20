const { BuryPointUserFieldController } = require("../../controllers/controllers")

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
      await fs.mkdir(uploadDir, { recursive: true });
      console.log(`✅ 上传目录创建成功: ${uploadDir}`);
    } else {
      throw error;
    }
  }
  return uploadDir;
}

// 配置multer上传
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
  limits: { fileSize: 10 * 1024 * 1024 } // 限制文件大小10MB
});

module.exports = (router) => {
    router
    .post('/buryPointUserField/create', BuryPointUserFieldController.create)
    .post('/buryPointUserField/update', BuryPointUserFieldController.update)
    .post('/buryPointUserField/delete', BuryPointUserFieldController.delete)
    .get('/buryPointUserField/detail', BuryPointUserFieldController.detail)
    .post('/buryPointUserField/list', BuryPointUserFieldController.list)
    .get('/buryPointUserField/export', BuryPointUserFieldController.export)
    .get('/buryPointUserField/exportAll', BuryPointUserFieldController.exportAll)
    .post('/buryPointUserField/import', upload.fields([{ name: 'file', maxCount: 1 }]), BuryPointUserFieldController.import)
    .get('/buryPointUserField/downloadTemplate', BuryPointUserFieldController.downloadTemplate)
    .get('/buryPointUserField/downFileByName', BuryPointUserFieldController.downFileByName)
    .get('/buryPointUserField/getAllByProjectId', BuryPointUserFieldController.getAllByProjectId)
    .get('/buryPointUserField/getPresetFields', BuryPointUserFieldController.getPresetFields)
    .get('/buryPointUserField/getCustomFields', BuryPointUserFieldController.getCustomFields)
    .post('/buryPointUserField/queryCommonFields', BuryPointUserFieldController.queryCommonFields)
    .post('/buryPointUserField/batchUpdateShowUserList', BuryPointUserFieldController.batchUpdateShowUserList)
}
