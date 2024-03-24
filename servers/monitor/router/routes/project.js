const { ProjectController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 应用接口
   */
  // 添加应用
  router.post('/project', ProjectController.create);
  // 获取应用详细信息
  router.get('/projectDetail', ProjectController.detail);
  // 获取应用列表
  router.get('/project/list', ProjectController.getProjectList);
  // 获取应用列表
  router.get('/webMonitorIdList', ProjectController.getWebMonitorIdList);
  // 获取应用详情
  router.get('/project/detail', ProjectController.getProjectDetail);
  // 获取应用简单详情
  router.get('/project/simpleDetail', ProjectController.getProjectSimpleDetail);
  // 更新启动列表
  router.get('/project/updateStartList', ProjectController.updateStartList);
  // 更新探针代码
  router.get('/project/updateMonitorCode', ProjectController.updateMonitorCode);
  // 获取所有应用列表
  router.get('/project/list/all', ProjectController.getAllProjectList);
  // 根据公司ID, 获取所有应用列表, 健康分排序
  router.get('/getAllProjectListByCompanyId', ProjectController.getAllProjectListByCompanyId);
  // 获取所有应用列表详情
  router.get('/project/detailList', ProjectController.getProjectDetailList);
  // 根据webmonitorId获取所有应用列表详情
  router.post('/projectSimpleListByWebmonitorIds', ProjectController.projectSimpleListByWebmonitorIds);
  // 查询所有项目的实时UV信息
  router.get('/project/getProjectInfoInRealTime', ProjectController.getProjectInfoInRealTime);
  // 查询所有项目的实时UV信息
  router.post('/project/getProjectInfoListInRealTime', ProjectController.getProjectInfoListInRealTime);
  // 创建新的监控项目
  router.post('/createNewProject', ProjectController.createNewProject);
  // 创建新的监控项目API
  router.post('/createNewProjectForApi', ProjectController.createNewProjectForApi);
  // 禁用项目
  router.post('/forbiddenProject', ProjectController.forbiddenProject);
  // 删除应用
  router.post('/deleteProject', ProjectController.delete);
  // 检查项目个数
  router.get('/checkProjectCount', ProjectController.checkProjectCount);
  // 获取userTags
  router.post('/getUserTags', ProjectController.getUserTags)
  // 保存userTags
  router.post('/saveUserTags', ProjectController.saveUserTags)
  // 获取项目配置
  router.post('/getProjectConfig', ProjectController.getProjectConfig)
  // 获取项目健康数量分类
  router.post('/getProjectHealthByScore', ProjectController.getProjectHealthByScore)
  // 保存项目配置
  router.post('/saveProjectConfig', ProjectController.saveProjectConfig)
  // 查询项目流量开启状态
  router.post('/getFlowSwitch', ProjectController.getFlowSwitch)
  // 开启服务器流量插入
  router.post('/openFlowSwitch', ProjectController.openFlowSwitch)
  // 关闭服务器流量插入（关闭流量，却不会关闭上报，上报也需要消耗流量的钱，需要优化成探针侧关闭上报）
  router.post('/closeFlowSwitch', ProjectController.closeFlowSwitch)
  // 开启项目监控
  router.post('/openProject', ProjectController.openProject)
  // 关闭项目监控
  router.post('/closeProject', ProjectController.closeProject);
  // 保存警报信息相关
  router.post('/saveAlarmInfo', ProjectController.saveAlarmInfo)
  // 设置webHook
  router.post('/setWebHook', ProjectController.setWebHook);
  // 设置观察者
  router.post('/addViewers', ProjectController.addViewers);
  // 更改项目名称
  router.post('/saveNewProjectName', ProjectController.saveNewProjectName);
}
