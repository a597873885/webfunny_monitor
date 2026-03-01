// const TopologyController = require('../../controllers/topology');
const { TopologyController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 拓扑关系接口
   */
  // 获取拓扑关系
  router.post('/topology/relation', TopologyController.getTopologyRelation);
  
  // 获取项目列表
  router.get('/topology/projects', TopologyController.getProjectList);
  
  // 获取拓扑概览统计
  router.post('/topology/overview', TopologyController.getTopologyOverview);
  
  // 获取节点详情
  router.post('/topology/node/detail', TopologyController.getNodeDetail);
};