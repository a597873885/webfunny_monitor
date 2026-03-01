const { BuryPointWarehouseController } = require("../../controllers/controllers")
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
   * 点位仓库接口
   */
  router.post('/buryPointWarehouse/create', BuryPointWarehouseController.create);
  router.post('/buryPointWarehouse/update', BuryPointWarehouseController.update);
  router.post('/buryPointWarehouse/delete', BuryPointWarehouseController.delete);
  router.get('/buryPointWarehouse/detail', BuryPointWarehouseController.detail);
  router.post('/buryPointWarehouse/page', BuryPointWarehouseController.getPageList);
  router.post('/buryPointWarehouse/list', BuryPointWarehouseController.getList);
  router.post('/buryPointWarehouse/getProjectAndWeList', BuryPointWarehouseController.getAllPointList);
  router.post('/buryPointWarehouse/getSdkPointAndWePointList', BuryPointWarehouseController.getSdkPointAndWePointList);
  router.post('/buryPointWarehouse/getProjectAndOldList', BuryPointWarehouseController.getProjectAndOldList);
  router.get('/buryPointWarehouse/AllList', BuryPointWarehouseController.getAllList);
  router.post('/buryPointWarehouse/pointExport', BuryPointWarehouseController.exportPoint);
  router.post('/buryPointWarehouse/testCreateVisualizationPoint', BuryPointWarehouseController.testCreateVisualizationPoint);
  router.get('/buryPointWarehouse/downloadExcel', BuryPointWarehouseController.downloadExcel);
  router.post('/buryPointWarehouse/importExcel', 
    upload.fields([{ name: 'fileFieldName', maxCount: 1 }])
    , BuryPointWarehouseController.importExcel, 
  );
  router.get('/buryPointWarehouse/downloadTemplate', BuryPointWarehouseController.downloadTemplateExcel);
  router.get('/buryPointWarehouse/downFileByName', BuryPointWarehouseController.downFileByName);
}
