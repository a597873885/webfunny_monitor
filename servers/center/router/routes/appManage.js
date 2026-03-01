const { AppManageController } = require("../../controllers/controllers.js")

const createRouter = (router) => {
  // 测试数据接口
  router.get("/api/v1/test/data", AppManageController.testData)
  
  // 获取应用列表
  router.post("/api/v1/applications/list", AppManageController.getApplicationList)
  
  // 新增：更新应用维护人
  router.post("/api/v1/applications/update", AppManageController.updateApplication)
  
  // 新增：更新功能信息
  router.post("/api/v1/features/update", AppManageController.updateFeature)
  
  // 新增：删除应用
  router.post("/api/v1/applications/delete", AppManageController.deleteApplication)
  
  // 导出应用列表
  router.get("/api/v1/applications/export", AppManageController.exportApplicationList)
  
  // 导出新增应用列表
  router.get("/api/v1/applications/new/export", AppManageController.exportNewApplicationList)
  
  // 获取新增应用列表
  router.post("/api/v1/applications/new", AppManageController.getNewApplicationList)
  
  // 获取功能列表
  router.post("/api/v1/features/list", AppManageController.getFeatureList)
  
  // 获取新增功能列表
  router.post("/api/v1/features/new", AppManageController.getNewFeatureList)
  
  // 导出新增功能列表
  router.get("/api/v1/features/new/export", AppManageController.exportNewFeatureList)
  
  // 导出下线功能列表
  router.get("/api/v1/features/offline/export", AppManageController.exportOfflineFeatureList)
  
  // 获取下线功能列表
  router.post("/api/v1/features/offline", AppManageController.getOfflineFeatureList)
  
  // 获取功能迭代列表
  router.post("/api/v1/features/iterations", AppManageController.getFeatureIterationList)
  
  // 导出功能迭代列表
  router.get("/api/v1/features/iterations/export", AppManageController.exportFeatureIterationList)
  
  // 获取项目选项列表（用于功能列表的项目筛选）
  router.get("/api/v1/projects/options", AppManageController.getProjectOptions)
  
  // 新增：删除功能（根据projectCode删除对应的功能）
  router.post("/api/v1/features/delete", AppManageController.deleteFeatures)
  
  // 获取用户目标达成统计
  router.post("/api/v1/applications/userTargetAchievement", AppManageController.getUserTargetAchievement)
}

module.exports = createRouter 