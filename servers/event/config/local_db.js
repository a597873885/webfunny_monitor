
const Sequelize = require('sequelize');
const { accountInfo } = require('./AccountConfig');

const {write, read} = accountInfo.mysqlConfig;

// 智能集群客户端
const ClickHouseClusterManager = require('./clusterManager');
const { createClient } = require('@clickhouse/client');

// 创建智能客户端
const createSmartClient = () => {
  const config = accountInfo.mysqlConfig;
  
  // 检查是否启用集群模式
  if (config.cluster && config.cluster.enabled) {
    console.log('🚀 启动 ClickHouse 集群模式...');
    
    // 创建集群管理器
    const clusterManager = new ClickHouseClusterManager(
      config.cluster.nodes,
      config.cluster.config
    );
    
    // 获取写入节点的原生客户端（用于 ORM）
    const writeNodes = clusterManager.nodes.filter(n => n.preferred === 'write');
    const primaryClient = writeNodes.length > 0 ? writeNodes[0].client : clusterManager.nodes[0].client;
    
    // 直接返回原生客户端 + 集群状态方法
    // webfunny-clickhouse 会直接使用这个客户端
    primaryClient.getClusterStatus = () => clusterManager.getClusterStatus();
    primaryClient.isCluster = true;
    primaryClient._clusterManager = clusterManager;
    
    return primaryClient;
    
  } else {
    console.log('📍 使用 ClickHouse 单节点模式...');
    
    // 单节点模式（向后兼容）
    const singleClient = createClient({
      host: `http://${write.ip}:${write.port}`,
      username: write.userName,
      password: write.password,
      database: write.dataBaseName,
      keep_alive: { enabled: false },
    });
    
    // 直接添加集群状态方法（保持接口一致）
    singleClient.getClusterStatus = () => ({
      cluster: {
        totalNodes: 1,
        healthyNodes: 1,
        unhealthyNodes: 0,
        isHealthy: true
      },
      mode: 'single'
    });
    singleClient.isCluster = false;
    
    return singleClient;
  }
};

const client = createSmartClient();

module.exports = {
  sequelize: client,
  client: client,
}
