const { createClient } = require('@clickhouse/client');

/**
 * ClickHouse 集群管理器
 * 实现偏好式智能负载均衡：优先使用偏好节点，故障时自动切换
 */
class ClickHouseClusterManager {
  constructor(nodes, config) {
    this.config = config;
    this.nodes = nodes.map(node => ({
      ...node,
      client: createClient({
        host: `http://${node.ip}:${node.port}`,
        username: node.userName,
        password: node.password,
        database: node.dataBaseName,
        request_timeout: config.timeout || 30000,
        compression: {
          response: true,
          request: false
        },
        keep_alive: { enabled: false },
      }),
      status: {
        isHealthy: true,
        lastCheck: Date.now(),
        responseTime: 0,
        activeConnections: 0,
        errorCount: 0,
        writeLoad: 0,  // 写入负载评分 0-100
        readLoad: 0,   // 查询负载评分 0-100
        lastError: null
      }
    }));

    // 负载统计
    this.loadStats = {
      writeRequests: 0,
      readRequests: 0,
      failovers: 0,
      lastReset: Date.now()
    };

    // 启动健康检查
    this.startHealthCheck();
    
    console.log(`ClickHouse集群管理器初始化完成，共${this.nodes.length}个节点`);
  }

  /**
   * 智能写入 - 偏好式负载均衡
   */
  async smartInsert(table, data, format = 'JSONEachRow') {
    const maxRetries = this.nodes.length;
    let lastError = null;

    // 获取写入节点优先级列表
    const writeNodes = await this.getWriteNodesPriority();
    
    for (let i = 0; i < Math.min(maxRetries, writeNodes.length); i++) {
      const node = writeNodes[i];
      
      try {
        const startTime = Date.now();
        
        // 执行写入操作
        const result = await node.client.insert({
          table: table,
          values: data,
          format: format
        });

        // 更新成功统计
        this.updateNodeStats(node.id, 'write', true, Date.now() - startTime);
        
        console.log(`写入成功: ${node.name} (耗时: ${Date.now() - startTime}ms)`);
        return result;

      } catch (error) {
        lastError = error;
        console.warn(`节点 ${node.name} 写入失败:`, error.message);
        
        // 更新失败统计
        this.updateNodeStats(node.id, 'write', false, Date.now() - Date.now());
        
        // 如果不是最后一个节点，继续尝试下一个
        if (i < writeNodes.length - 1) {
          this.loadStats.failovers++;
          console.log(`自动故障转移到下一个写入节点...`);
          continue;
        }
      }
    }

    // 所有节点都失败
    throw new Error(`所有写入节点都不可用。最后错误: ${lastError?.message || '未知错误'}`);
  }

  /**
   * 智能查询 - 偏好式负载均衡
   */
  async smartQuery(sql, params = {}) {
    const maxRetries = this.nodes.length;
    let lastError = null;

    // 获取读取节点优先级列表
    const readNodes = await this.getReadNodesPriority();

    for (let i = 0; i < Math.min(maxRetries, readNodes.length); i++) {
      const node = readNodes[i];
      
      try {
        const startTime = Date.now();
        
        // 执行查询操作
        const result = await node.client.query({
          query: sql,
          query_params: params,
          format: 'JSONEachRow'
        });

        // 更新成功统计
        this.updateNodeStats(node.id, 'read', true, Date.now() - startTime);
        
        console.log(`查询成功: ${node.name} (耗时: ${Date.now() - startTime}ms)`);
        return result;

      } catch (error) {
        lastError = error;
        console.warn(`节点 ${node.name} 查询失败:`, error.message);
        
        // 更新失败统计
        this.updateNodeStats(node.id, 'read', false, 0);
        
        // 如果不是最后一个节点，继续尝试下一个
        if (i < readNodes.length - 1) {
          this.loadStats.failovers++;
          console.log(`自动故障转移到下一个查询节点...`);
          continue;
        }
      }
    }

    // 所有节点都失败
    throw new Error(`所有查询节点都不可用。最后错误: ${lastError?.message || '未知错误'}`);
  }

  /**
   * 执行DDL命令 - 在集群上执行
   */
  async smartCommand(sql) {
    // DDL操作通常在第一个可用节点执行
    const healthyNodes = this.getHealthyNodes();
    
    if (healthyNodes.length === 0) {
      throw new Error('没有可用的健康节点执行命令');
    }

    const node = healthyNodes[0];
    
    try {
      const result = await node.client.command({
        query: sql
      });
      
      console.log(`命令执行成功: ${node.name}`);
      return result;
      
    } catch (error) {
      console.error(`命令执行失败 on ${node.name}:`, error.message);
      throw error;
    }
  }

  /**
   * 获取写入节点优先级列表
   */
  async getWriteNodesPriority() {
    const healthyNodes = this.getHealthyNodes();
    
    if (healthyNodes.length === 0) {
      throw new Error('没有可用的健康节点');
    }

    // 按写入优先级排序
    return healthyNodes.sort((a, b) => {
      // 1. 优先选择偏好为写入的节点
      if (a.preferred === 'write' && b.preferred !== 'write') return -1;
      if (b.preferred === 'write' && a.preferred !== 'write') return 1;
      
      // 2. 按写入负载排序（负载低的优先）
      if (a.status.writeLoad !== b.status.writeLoad) {
        return a.status.writeLoad - b.status.writeLoad;
      }
      
      // 3. 按响应时间排序
      return a.status.responseTime - b.status.responseTime;
    });
  }

  /**
   * 获取读取节点优先级列表
   */
  async getReadNodesPriority() {
    const healthyNodes = this.getHealthyNodes();
    
    if (healthyNodes.length === 0) {
      throw new Error('没有可用的健康节点');
    }

    // 按读取优先级排序
    return healthyNodes.sort((a, b) => {
      // 1. 优先选择偏好为读取的节点
      if (a.preferred === 'read' && b.preferred !== 'read') return -1;
      if (b.preferred === 'read' && a.preferred !== 'read') return 1;
      
      // 2. 按读取负载排序（负载低的优先）
      if (a.status.readLoad !== b.status.readLoad) {
        return a.status.readLoad - b.status.readLoad;
      }
      
      // 3. 按响应时间排序
      return a.status.responseTime - b.status.responseTime;
    });
  }

  /**
   * 获取健康节点列表
   */
  getHealthyNodes() {
    return this.nodes.filter(node => node.status.isHealthy);
  }

  /**
   * 更新节点统计信息
   */
  updateNodeStats(nodeId, operation, success, responseTime) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    // 更新全局统计
    if (operation === 'write') {
      this.loadStats.writeRequests++;
    } else {
      this.loadStats.readRequests++;
    }

    // 更新节点状态
    if (success) {
      node.status.responseTime = responseTime;
      node.status.errorCount = Math.max(0, node.status.errorCount - 1);
      
      // 更新负载（成功操作会增加负载）
      if (operation === 'write') {
        node.status.writeLoad = Math.min(100, node.status.writeLoad + 2);
      } else {
        node.status.readLoad = Math.min(100, node.status.readLoad + 3);
      }
    } else {
      node.status.errorCount++;
      node.status.lastError = new Date();
      
      // 连续3次错误标记为不健康
      if (node.status.errorCount >= 3) {
        node.status.isHealthy = false;
        console.warn(`节点 ${node.name} 标记为不健康 (连续${node.status.errorCount}次错误)`);
      }
    }

    // 负载衰减（防止负载值永久过高）
    setTimeout(() => {
      if (operation === 'write') {
        node.status.writeLoad = Math.max(0, node.status.writeLoad - 1);
      } else {
        node.status.readLoad = Math.max(0, node.status.readLoad - 1);
      }
    }, 5000);
  }

  /**
   * 健康检查
   */
  startHealthCheck() {
    const interval = this.config.healthCheckInterval || 10000; // 默认10秒
    
    setInterval(async () => {
      for (const node of this.nodes) {
        try {
          const startTime = Date.now();
          
          // 发送心跳查询
          await node.client.query({ 
            query: 'SELECT 1 as ping',
            query_params: {},
            format: 'JSONEachRow'
          });
          
          const responseTime = Date.now() - startTime;
          
          // 更新健康状态
          node.status.isHealthy = true;
          node.status.lastCheck = Date.now();
          node.status.responseTime = responseTime;
          node.status.errorCount = Math.max(0, node.status.errorCount - 1);
          node.status.lastError = null;
          
          if (node.status.errorCount === 0) {
            // console.log(`节点 ${node.name} 健康检查通过 (${responseTime}ms)`);
          }
          
        } catch (error) {
          console.error(`节点 ${node.name} 健康检查失败:`, error.message);
          
          node.status.errorCount++;
          node.status.lastCheck = Date.now();
          node.status.lastError = error.message;
          
          // 连续3次失败标记为不健康
          if (node.status.errorCount >= 3) {
            node.status.isHealthy = false;
            console.warn(`节点 ${node.name} 已标记为不健康`);
          }
        }
      }
      
      // 定期重置负载统计
      const now = Date.now();
      if (now - this.loadStats.lastReset > 300000) { // 5分钟重置一次
        this.resetLoadStats();
      }
      
    }, interval);

    console.log(`健康检查已启动，间隔: ${interval}ms`);
  }

  /**
   * 重置负载统计
   */
  resetLoadStats() {
    this.loadStats = {
      ...this.loadStats,
      writeRequests: 0,
      readRequests: 0,
      failovers: 0,
      lastReset: Date.now()
    };

    // 逐步降低所有节点的负载值
    this.nodes.forEach(node => {
      node.status.writeLoad = Math.max(0, node.status.writeLoad * 0.7);
      node.status.readLoad = Math.max(0, node.status.readLoad * 0.7);
    });
    
    console.log('负载统计已重置');
  }

  /**
   * 获取集群状态（用于监控）
   */
  getClusterStatus() {
    const healthyCount = this.nodes.filter(n => n.status.isHealthy).length;
    
    return {
      cluster: {
        totalNodes: this.nodes.length,
        healthyNodes: healthyCount,
        unhealthyNodes: this.nodes.length - healthyCount,
        isHealthy: healthyCount > 0
      },
      nodes: this.nodes.map(node => ({
        id: node.id,
        name: node.name,
        ip: node.ip,
        port: node.port,
        preferred: node.preferred,
        healthy: node.status.isHealthy,
        responseTime: node.status.responseTime,
        writeLoad: node.status.writeLoad,
        readLoad: node.status.readLoad,
        errorCount: node.status.errorCount,
        lastCheck: node.status.lastCheck,
        lastError: node.status.lastError
      })),
      stats: {
        ...this.loadStats,
        uptime: Date.now() - this.loadStats.lastReset
      }
    };
  }

  /**
   * 关闭所有连接
   */
  async close() {
    console.log('关闭ClickHouse集群连接...');
    
    for (const node of this.nodes) {
      try {
        await node.client.close();
      } catch (error) {
        console.warn(`关闭节点 ${node.name} 连接失败:`, error.message);
      }
    }
  }
}

module.exports = ClickHouseClusterManager;
