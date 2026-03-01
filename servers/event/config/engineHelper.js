/**
 * ClickHouse 表引擎辅助工具（项目级）
 * 根据单节点/集群模式自动选择正确的引擎
 */

class EngineHelper {
  /**
   * 获取正确的表引擎
   * @param {object} options - 配置选项
   * @param {boolean} options.isCluster - 是否为集群模式
   * @param {string} options.tableName - 表名
   * @param {string} options.databaseName - 数据库名（用于生成唯一的 ZooKeeper 路径）
   * @param {string} options.baseEngine - 基础引擎（默认 MergeTree）
   * @param {string} options.zkPath - ZooKeeper 路径模板
   * @returns {string} - 引擎 SQL
   */
  static getEngine(options = {}) {
    const {
      isCluster = false,
      tableName,
      databaseName,
      baseEngine = 'MergeTree',
      zkPath = '/clickhouse/tables/{database}/{shard}/{table}'
    } = options
    
    if (!isCluster) {
      // 单节点模式：使用普通 MergeTree
      return `ENGINE = ${baseEngine}()`
    }
    
    // 集群模式：使用 ReplicatedMergeTree
    if (!tableName) {
      throw new Error('tableName is required for ReplicatedMergeTree')
    }
    
    // 生成唯一的 ZooKeeper 路径（包含数据库名）
    let path = zkPath
    
    // 替换 {database} 占位符
    if (databaseName) {
      path = path.replace('{database}', databaseName)
    } else {
      // 如果没有提供数据库名，使用默认值
      path = path.replace('{database}', 'default_db')
    }
    
    // 替换路径中的 {table} 占位符
    path = path.replace('{table}', tableName)
    
    // 使用 ClickHouse 宏：{replica} 会自动替换为当前节点的 replica 名称
    return `ENGINE = Replicated${baseEngine}('${path}', '{replica}')`
  }
  
  /**
   * 转换现有的 engine 字符串
   * @param {string} engineStr - 原始引擎字符串（如 "ENGINE MergeTree()"）
   * @param {object} options - 配置选项
   * @param {string} options.databaseName - 数据库名（用于生成唯一的 ZooKeeper 路径）
   * @returns {string} - 转换后的引擎 SQL
   */
  static convertEngine(engineStr, options = {}) {
    if (!engineStr) {
      return this.getEngine(options)
    }
    
    // 如果已经是 ReplicatedMergeTree，直接返回
    if (engineStr.includes('Replicated')) {
      return engineStr
    }
    
    const { 
      isCluster, 
      tableName, 
      databaseName,
      zkPath = '/clickhouse/tables/{database}/{shard}/{table}' 
    } = options
    
    if (!isCluster) {
      return engineStr
    }
    
    // 提取引擎名称和可能的参数
    // 支持格式：
    // 1. ENGINE = MergeTree
    // 2. ENGINE = MergeTree()
    // 3. ENGINE = SummingMergeTree(column)
    // 4. ENGINE = ReplacingMergeTree(version_column)
    
    const engineMatch = engineStr.match(/ENGINE\s*[=]?\s*(\w+)(\([^)]*\))?/i)
    
    if (!engineMatch) {
      console.warn('[EngineHelper] 无法解析引擎字符串:', engineStr)
      return engineStr
    }
    
    const baseEngine = engineMatch[1]  // 如 MergeTree, SummingMergeTree
    const engineParamsWithParens = engineMatch[2] || ''  // 如 (weRelationPointCount), 或空字符串
    
    // 只转换 MergeTree 系列引擎
    if (!baseEngine.includes('MergeTree')) {
      return engineStr
    }
    
    // 提取参数内容（去掉括号）
    let params = ''
    if (engineParamsWithParens && engineParamsWithParens !== '()') {
      params = engineParamsWithParens.slice(1, -1).trim()  // 去掉括号，保留参数
    }
    
    // 构建 ReplicatedXxxMergeTree 引擎
    if (!tableName) {
      throw new Error('tableName is required for ReplicatedMergeTree')
    }
    
    // 生成唯一的 ZooKeeper 路径（包含数据库名）
    let path = zkPath
    
    // 替换 {database} 占位符
    if (databaseName) {
      path = path.replace('{database}', databaseName)
    } else {
      // 如果没有提供数据库名，使用默认值
      path = path.replace('{database}', 'default_db')
    }
    
    // 替换 {table} 占位符
    path = path.replace('{table}', tableName)
    
    // 如果有参数，添加到 replica 后面
    if (params) {
      return `ENGINE = Replicated${baseEngine}('${path}', '{replica}', ${params})`
    } else {
      return `ENGINE = Replicated${baseEngine}('${path}', '{replica}')`
    }
  }
  
  /**
   * 增强 Schema 的 createTableSql（如果需要）
   * @param {object} schema - Schema 对象
   * @param {object} options - 配置选项
   * @returns {object} - 增强后的 schema
   */
  static enhanceSchemaCreateTableSql(schema, options = {}) {
    if (!schema || !schema.Columns) {
      return schema
    }
    
    const { Columns } = schema
    const { isCluster = false, zkPath, tableName } = options
    
    // 如果已有 createTableSql，直接转换引擎
    if (schema.createTableSql) {
      if (isCluster && Columns.engine) {
        const clusterEngine = this.convertEngine(Columns.engine, {
          isCluster,
          tableName: tableName || Columns.tableName,
          zkPath
        })
        
        // 替换引擎
        const originalEngine = Columns.engine
        schema.createTableSql = schema.createTableSql.replace(originalEngine, clusterEngine)
      }
      return schema
    }
    
    // 如果没有 createTableSql，可以自动生成（可选功能）
    // 这里暂时不实现，保持简单
    
    return schema
  }
}

module.exports = EngineHelper
