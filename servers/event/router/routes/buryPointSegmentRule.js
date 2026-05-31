const { BuryPointSegmentRuleController } = require("../../controllers/controllers")

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
  limits: { fileSize: 50 * 1024 * 1024 } // 限制文件大小50MB
});

module.exports = (router) => {
  // 分群规则管理
  router.post('/buryPointSegmentRule/create', BuryPointSegmentRuleController.create);
  router.post('/buryPointSegmentRule/importCreate', upload.fields([{ name: 'fileFieldName', maxCount: 1 }]), BuryPointSegmentRuleController.importCreate);
  // importUpdate 支持可选文件上传 - 使用中间件检查是否有文件
  router.post('/buryPointSegmentRule/importUpdate', (ctx, next) => {
    // 如果有文件上传，使用 multer 处理；否则直接下一步
    const contentType = ctx.request.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return upload.fields([{ name: 'fileFieldName', maxCount: 1 }])(ctx, next);
    }
    return next();
  }, BuryPointSegmentRuleController.importUpdate);
  router.get('/buryPointSegmentRule/downloadTemplate', BuryPointSegmentRuleController.downloadTemplate);
  router.post('/buryPointSegmentRule/update', BuryPointSegmentRuleController.update);
  router.post('/buryPointSegmentRule/saveFromCardRule', BuryPointSegmentRuleController.saveFromCardRule);
  router.post('/buryPointSegmentRule/saveFromUserList', BuryPointSegmentRuleController.saveFromUserList);
  router.post('/buryPointSegmentRule/delete', BuryPointSegmentRuleController.delete);
  router.post('/buryPointSegmentRule/batchDeletion', BuryPointSegmentRuleController.batchDeletion);
  router.get('/buryPointSegmentRule/detail', BuryPointSegmentRuleController.detail);
  router.post('/buryPointSegmentRule/list', BuryPointSegmentRuleController.list);
  router.post('/buryPointSegmentRule/updateUserCount', BuryPointSegmentRuleController.updateUserCount);
  router.post('/buryPointSegmentRule/getListByProjectId', BuryPointSegmentRuleController.getListByProjectId);
  router.get('/buryPointSegmentRule/downloadUsers', BuryPointSegmentRuleController.downloadUsers);
}
