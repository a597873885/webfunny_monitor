const { ProjectSynchronizationController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 获取项目同步列表
    router.post("/getProjectSynchronizationList", ProjectSynchronizationController.getList);
    
    // 获取业务应用统计数据
    router.post("/getApplicationStatistics", ProjectSynchronizationController.getStatistics);

    // 获取项目列表
    router.post("/projectsForCode", ProjectSynchronizationController.projectsForCode);
    
    router.get("/functionListForCache", ProjectSynchronizationController.functionListForCache);
    router.get("/projectListForCache", ProjectSynchronizationController.getProjectListForCache);
    router.get("/pointListForProjectId", ProjectSynchronizationController.pointListForProjectId);

    // 提供第三方项目接口配置
    router.get("/third/projects/config", ProjectSynchronizationController.getThirdProjectsConfig);
    // 前端提交项目列表进行落库
    router.post("/third/projects/update", ProjectSynchronizationController.updateProjectListByClient);
}