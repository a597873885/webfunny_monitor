const { BuryPointProjectController } = require("../../controllers/controllers")

module.exports = (router) => {
  /**
    * 点位项目接口
    */
  router.post('/buryPointProject/create', BuryPointProjectController.create);
  router.post('/buryPointProject/update', BuryPointProjectController.update);
  router.post('/buryPointProject/delete', BuryPointProjectController.delete);
  router.post('/buryPointProject/tree', BuryPointProjectController.tree);
  router.post('/buryPointProject/getProjectList', BuryPointProjectController.getProjectList);
  router.post('/buryPointProject/projectSimpleListByWebmonitorIds', BuryPointProjectController.projectSimpleListByWebmonitorIds);
  router.post('/buryPointProject/addViewers', BuryPointProjectController.addViewers);
  router.get('/buryPointProject/all', BuryPointProjectController.getAllList);
  router.get('/buryPointProject/allProject', BuryPointProjectController.getAllProjectList);
  router.post('/buryPointProject/getProjectTree', BuryPointProjectController.getProjectTree);
  router.post('/buryPointProject/getGroupAndPage', BuryPointProjectController.getGroupAndPage);
  router.post('/buryPointProject/sort', BuryPointProjectController.sort);
  router.post('/buryPointProject/page/move', BuryPointProjectController.movePage);
  router.post('/buryPointProject/copyPage', BuryPointProjectController.copyPage);
  router.post('/buryPointProject/templateExport', BuryPointProjectController.exportTemplate);
  router.post('/buryPointProject/existTemplate', BuryPointProjectController.existTemplate);

  // 查询项目流量开启状态
  router.post('/getFlowSwitch', BuryPointProjectController.getFlowSwitch)
  // 开启服务器流量插入
  router.post('/openFlowSwitch', BuryPointProjectController.openFlowSwitch)
  // 关闭服务器流量插入（关闭流量，却不会关闭上报，上报也需要消耗流量的钱，需要优化成探针侧关闭上报）
  router.post('/closeFlowSwitch', BuryPointProjectController.closeFlowSwitch)
}
