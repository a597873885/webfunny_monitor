const { client } = require('../config/db')
const path = require("path")
const WebfunnyClickHouse = require("webfunny-clickhouse")
const WhereBuilder = require('webfunny-clickhouse/src/WhereBuilder')
const SqlSanitizer = require('webfunny-clickhouse/src/utils/sqlSanitizer')
const EngineHelper = require('./engineHelper')
const crypto = require('crypto')
const uuid = require('node-uuid')
const moment = require('moment')

const showSql = false  // 是否打印sql

class NodeClickhouse extends WebfunnyClickHouse {
  constructor(schemaPath) {
    super({schemaPath: path.resolve(__dirname, schemaPath), client, showSql})
    
    // 保存 schema 引用用于后续操作
    if (schemaPath) {
      try {
        this.schema = require(path.resolve(__dirname, schemaPath))
      } catch (err) {
        console.warn(`[NodeClickhouse] 无法加载 schema: ${schemaPath}`)
      }
    }
  }

  /**
   * 生成有效的 UUID（避免全零的 UUID）
   */
  _generateValidUUID() {
    let generatedUUID
    do {
      generatedUUID = uuid.v1()
      // 确保不是全零的 UUID
    } while (generatedUUID === '00000000-0000-0000-0000-000000000000')
    
    return generatedUUID
  }
  
  /**
   * 获取当前时间戳（适用于 ClickHouse）
   */
  _getCurrentTimestamp() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }
  
  /**
   * 自动为 UUID 类型字段生成 UUID
   * @param {Object} data - 数据对象
   * @param {Object} structure - schema structure
   * @returns {Object} 处理后的数据
   */
  _autoGenerateUUID(data, structure) {
    if (!structure) return data
    
    // 遍历 schema 中的所有字段
    for (const key in structure) {
      const field = structure[key]
      // 如果字段类型是 UUID 且数据中没有提供值，则自动生成
      if (field.type === 'UUID' && !data[key]) {
        data[key] = crypto.randomUUID()
      }
    }
    
    return data
  }
  
  /**
   * 重写 create 方法，自动生成 UUID
   * @param {Object} data - 数据对象
   * @param {string} tableName - 表名
   * @returns {Promise}
   */
  async create(data, tableName = this.tableName) {
    // 自动为 UUID 类型字段生成 UUID
    const structure = this.schema?.Columns?.structure
    if (structure) {
      this._autoGenerateUUID(data, structure)
    }
    
    // 调用父类的 create 方法
    return await super.create(data, tableName)
  }
  
  /**
   * 重写 bulkCreate 方法，自动生成 UUID
   * @param {Array} dataArray - 数据数组
   * @param {string} tableName - 表名
   * @returns {Promise}
   */
  async bulkCreate(dataArray, tableName = this.tableName) {
    // 为每条数据自动生成 UUID
    const structure = this.schema?.Columns?.structure
    if (structure) {
      dataArray.forEach(data => this._autoGenerateUUID(data, structure))
    }
    
    // 调用父类的 bulkCreate 方法
    return await super.bulkCreate(dataArray, tableName)
  }
  
  /**
   * 兼容 webfunny-node-clickhouse 的 createWithRes 方法
   * @param {Object} data - 要插入的数据
   * @returns {Promise<Object>} 返回插入的数据（包含ID）
   */
  async createWithRes(data) {
    // 0. 如果没有 id 且 schema 定义了 UUID 类型的 id，自动生成
    // if (!data.id && this.schema?.Columns?.structure?.id?.type === 'UUID') {
    //   data.id = uuid.v1()
    // }

     // 确保必填字段有值
    if (!data.id && this.schema?.Columns?.structure?.id?.type === 'UUID') {
      data.id = this._generateValidUUID()
    }
    
    if (!data.createdAt) {
      data.createdAt = this._getCurrentTimestamp()
    }
    
    if (!data.updatedAt) {
      data.updatedAt = data.createdAt
    }
    
    // 1. 执行插入
    await super.create(data)
    
    // 2. 如果数据包含 id，直接查询返回
    if (data.id) {
      const result = await this.findByPk(data.id)
      return result || data
    }
    
    // 3. 如果数据包含 dataId，用 dataId 查询返回
    if (data.dataId) {
      const result = await this.findOne({
        where: { dataId: data.dataId },
        limit: 1
      })
      if (result) return result
    }
    
    // 4. 如果没有 id/dataId，尝试使用其他唯一字段查询
    // 常见的唯一字段: projectId, pointId, name 等
    const uniqueFields = ['projectId', 'pointId', 'fieldId', 'cardId']
    for (const field of uniqueFields) {
      if (data[field]) {
        const result = await this.findOne({
          where: { [field]: data[field] },
          order: [['createdAt', 'DESC']],  // ✅ 必须是数组格式
          limit: 1
        })
        if (result) return result
      }
    }
    
    // 5. 如果都找不到，返回原始数据（至少保证有数据返回）
    return data
  }
  
  /**
   * 将值转义为 ClickHouse 字符串字面量（防注入）
   */
  _escapeLiteral(value) {
    if (value === null || value === undefined) {
      return 'NULL'
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? String(value) : 'NULL'
    }
    if (typeof value === 'boolean') {
      return value ? '1' : '0'
    }
    if (value instanceof Date) {
      return `'${moment(value).format('YYYY-MM-DD HH:mm:ss')}'`
    }
    const escaped = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    return `'${escaped}'`
  }

  /**
   * 重写 update：将值转义后内联进 SQL，整条 SQL 走 POST body 发送
   * 原因：父类把参数放进 URL query 参数（?param_xxx=），单个参数值超过 128KB 时会被
   * ClickHouse 的 http_max_field_value_size 拦截（HTML Form Exception: Field value too long），
   * 导致 detail、templatePoint 等大 JSON 字段更新失败。内联后大值不再经过 URL。
   */
  async update(data, options = {}) {
    const { where = {}, tableName = this.tableName } = options

    if (!tableName) {
      throw new Error('Table name is required')
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Update data is required')
    }

    SqlSanitizer.validateTableName(tableName)

    // SET 子句：字段名走校验，值转义后内联（字段名不会出现在 URL 里，不受 128KB 限制）
    // undefined 表示未提供该字段，跳过（Sequelize 语义），避免误写成 NULL 打非空列
    const setClauses = Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([field, value]) => {
        SqlSanitizer.validateFieldName(field)
        return `${field} = ${this._escapeLiteral(value)}`
      })

    if (setClauses.length === 0) {
      throw new Error('Update data has no effective fields (all undefined)')
    }

    let sql = `ALTER TABLE ${tableName} UPDATE ${setClauses.join(', ')}`

    // WHERE 条件：复用 WhereBuilder，再把 :param_N 占位符替换为内联字面量（WHERE 值都是 id 等小值）
    const whereBuilder = new WhereBuilder()
    const { sql: whereSql, params } = whereBuilder.build(where)
    if (whereSql) {
      sql += ' ' + whereSql.replace(/:([a-zA-Z0-9_]+)/g, (match, paramName) => {
        if (!Object.prototype.hasOwnProperty.call(params, paramName)) {
          throw new Error(`Parameter :${paramName} not found in where params`)
        }
        return this._escapeLiteral(params[paramName])
      })
    }

    if (this.showSql) {
      console.log('[NodeClickhouse UPDATE]', sql.substring(0, 200) + (sql.length > 200 ? `...(共${sql.length}字符)` : ''))
    }

    try {
      // max_query_size：整条 SQL 走 body，默认 256KB 不够，提升到 64MB（会话级小参数，不受限制）
      // mutations_sync=1：等 mutation 执行完再返回，避免 update 后立即查询读不到新值；
      // 配置表数据量小，同步等待开销可忽略；失败时回退为异步重试，保证不劣于原有行为
      await this.client.command({
        query: sql,
        clickhouse_settings: { max_query_size: 67108864, mutations_sync: 1 }
      })
      return { affectedRows: 1 }
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('mutations_sync') || msg.includes('Unknown setting')) {
        console.warn('[NodeClickhouse] mutations_sync 不受支持，回退为异步 mutation:', msg)
        await this.client.command({
          query: sql,
          clickhouse_settings: { max_query_size: 67108864 }
        })
        return { affectedRows: 1 }
      }
      console.error('[NodeClickhouse] Update error:', msg)
      console.error('SQL length:', sql.length)
      throw err
    }
  }

  /**
   * 兼容 webfunny-node-clickhouse 的 updateWithRes 方法
   * @param {Object} data - 要更新的数据
   * @param {Object} options - 更新选项（包含 where 条件）
   * @returns {Promise<Object>} 返回更新后的数据
   */
  async updateWithRes(data, options) {
    data.updatedAt = this._getCurrentTimestamp()
    // 1. 执行更新
    await this.update(data, options)
    
    // 2. 查询并返回更新后的数据
    if (options && options.where) {
      const result = await this.findOne({ where: options.where })
      return result || data
    }
    
    // 3. 如果没有 where 条件，返回更新的数据
    return data
  }
  
  /**
   * 生成 createTableSql（如果 schema 中没有定义）
   */
  _generateCreateTableSql() {
    if (!this.schema || !this.schema.Columns) {
      return null
    }
    
    const { Columns } = this.schema
    const tableName = Columns.tableName
    const structure = Columns.structure
    
    if (!structure) {
      console.warn('[NodeClickhouse] Schema 缺少 structure 定义')
      return null
    }
    
    const columns = []
    
    // 从 structure 中生成列定义
    for (const [fieldName, fieldDef] of Object.entries(structure)) {
      // 跳过没有 type 定义的字段
      if (!fieldDef.type) {
        continue
      }
      
      // 映射类型
      let clickhouseType = this._mapTypeToClickHouse(fieldDef.type, fieldDef)
      
      // 处理 allowNull
      const nullable = fieldDef.allowNull !== false ? '' : ' NOT NULL'
      
      // 处理默认值
      let defaultValue = ''
      if (fieldDef.type === 'UUID') {
        defaultValue = ' DEFAULT generateUUIDv4()'
      } else if (fieldDef.defaultValue !== undefined) {
        defaultValue = ' DEFAULT ' + (Array.isArray(fieldDef.defaultValue) ? '[' + fieldDef.defaultValue.map(v => "'" + v + "'").join(',') + ']' : fieldDef.defaultValue)
      }
      
      columns.push(`\`${fieldName}\` ${clickhouseType}${nullable}${defaultValue}`)
    }
    
    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n  ${columns.join(',\n  ')}\n)\n`
    sql += Columns.engine + '\n'
    
    if (Columns.partition) {
      // 检查 partition 是否已经包含 PARTITION BY，避免重复
      const partitionSql = Columns.partition.toUpperCase().includes('PARTITION BY') 
        ? Columns.partition 
        : `PARTITION BY ${Columns.partition}`
      sql += `${partitionSql}\n`
    }
    
    if (Columns.orderBy) {
      // 检查 orderBy 是否已经包含 ORDER BY，避免重复
      const orderBySql = Columns.orderBy.toUpperCase().includes('ORDER BY') 
        ? Columns.orderBy 
        : `ORDER BY ${Columns.orderBy}`
      sql += `${orderBySql}\n`
    } else if (Columns.order) {
      sql += `ORDER BY ${Columns.order}\n`
    }
    
    sql += `SETTINGS index_granularity = 8192`
    
    return sql
  }
  
  /**
   * 映射数据类型到 ClickHouse 类型
   */
  _mapTypeToClickHouse(type, fieldDef) {
    // 如果 type 已经是 ClickHouse 类型，直接使用
    if (typeof type === 'string') {
      // 处理常见的数据类型
      const typeMap = {
        'UUID': 'UUID',
        'STRING': 'String',
        'INT': fieldDef.length ? `Int${fieldDef.length}` : 'Int32',
        'DATE_TIME': 'DateTime',
        'DATE': 'Date',
        'FLOAT': 'Float64',
        'DOUBLE': 'Float64',
        'BOOLEAN': 'UInt8'
      }
      
      return typeMap[type] || type
    }
    
    return 'String'
  }
  
  /**
   * 创建表（支持集群模式）
   */
  async createTable(options = {}) {
    const tableName = options.tableName || this.tableName
    const zkPath = options.zkPath || '/clickhouse/tables/{database}/{shard}/{table}'
    
    // 如果没有 createTableSql，从 Columns 生成
    if (!this.schema.createTableSql && this.schema.Columns) {
      this.schema.createTableSql = this._generateCreateTableSql()
    }
    
    // 检测是否为集群模式
    const isCluster = this.client && this.client.isCluster
    
    if (isCluster) {
      // 获取集群管理器
      const clusterManager = this.client._clusterManager
      if (!clusterManager) {
        console.warn('[NodeClickhouse] ⚠️  集群管理器不存在，使用单节点模式')
        return await super.createTable(options)
      }
      
      // 准备 SQL
      let finalSql = this.schema.createTableSql
      
      // 1. 替换动态表名（如果传入了自定义表名）
      if (this.schema.Columns && this.schema.Columns.tableName && tableName !== this.schema.Columns.tableName) {
        finalSql = finalSql.replace(new RegExp(this.schema.Columns.tableName, 'g'), tableName)
      }
      
      // 2. 确保使用 IF NOT EXISTS
      if (!finalSql.toUpperCase().includes('IF NOT EXISTS')) {
        finalSql = finalSql.replace(/CREATE TABLE\s+/i, 'CREATE TABLE IF NOT EXISTS ')
      }
      
      // 3. 转换引擎（包含数据库名，确保 ZooKeeper 路径唯一）
      if (this.schema.Columns && this.schema.Columns.engine) {
        const originalEngine = this.schema.Columns.engine
        
        // 从集群节点获取数据库名
        const databaseName = clusterManager.nodes[0]?.dataBaseName || 'default_db'
        
        const clusterEngine = EngineHelper.convertEngine(originalEngine, {
          isCluster: true,
          tableName,
          databaseName,  // 添加数据库名，生成唯一的 ZooKeeper 路径
          zkPath
        })
        finalSql = finalSql.replace(originalEngine, clusterEngine)
      }
      
      // 在所有节点上创建表
      const createPromises = clusterManager.nodes.map(async (node) => {
        try {
          await node.client.command({ query: finalSql })
          return { node: node.name, success: true }
        } catch (err) {
          if (err.message && err.message.includes('already exists')) {
            return { node: node.name, success: true, existed: true }
          }
          console.error(`[NodeClickhouse] ❌ 节点 ${node.name} 创建表失败:`, err.message)
          return { node: node.name, success: false, error: err.message }
        }
      })
      
      const results = await Promise.all(createPromises)
      
      // 检查结果
      const failed = results.filter(r => !r.success)
      if (failed.length > 0) {
        console.warn(`[NodeClickhouse] ⚠️  ${failed.length}/${results.length} 个节点创建表失败`)
        failed.forEach(f => console.warn(`  - ${f.node}: ${f.error}`))
      } else {
        return results
      }
      
      return results
    }
    
    // 单节点模式，直接调用父类
    return await super.createTable(options)
  }
  
  /**
   * 执行动态生成的建表 SQL（支持集群模式）
   * 用于非 schema 驱动的动态建表场景（如点位日志表、用户表、分群结果表等）
   * @param {string} rawSql - 原始建表 SQL
   * @param {string} tableName - 表名（用于生成 ZooKeeper 路径）
   * @returns {Promise}
   */
  async executeCreateTableSql(rawSql, tableName) {
    // 检测是否为集群模式
    const isCluster = this.client && this.client.isCluster
    
    if (!isCluster) {
      // 单节点模式：直接执行
      return await this.execSql(rawSql)
    }
    
    
    const clusterManager = this.client._clusterManager
    if (!clusterManager) {
      console.warn('[NodeClickhouse] ⚠️ 集群管理器不存在，降级为单节点模式')
      return await this.execSql(rawSql)
    }
    
    // 提取 SQL 中的引擎定义并转换为集群版
    // 匹配格式: ENGINE MergeTree() 或 ENGINE = MergeTree() 或 ENGINE ReplacingMergeTree(updatedAt) 等
    let finalSql = rawSql
    const engineMatch = rawSql.match(/ENGINE\s*[=]?\s*\w+\([^)]*\)/i)
    
    if (engineMatch) {
      const originalEngine = engineMatch[0]
      const databaseName = clusterManager.nodes[0]?.dataBaseName || 'default_db'
      
      const clusterEngine = EngineHelper.convertEngine(originalEngine, {
        isCluster: true,
        tableName,
        databaseName
      })
      finalSql = finalSql.replace(originalEngine, clusterEngine)
    } else {
      console.warn(`[NodeClickhouse] ⚠️ 无法从 SQL 中提取引擎，使用原始 SQL`)
    }
    
    // 在所有节点上执行
    const results = await Promise.all(
      clusterManager.nodes.map(async (node) => {
        try {
          await node.client.command({ query: finalSql })
          return { node: node.name, success: true }
        } catch (err) {
          if (err.message && err.message.includes('already exists')) {
            return { node: node.name, success: true, existed: true }
          }
          console.error(`[NodeClickhouse] ❌ 节点 ${node.name} 动态建表失败:`, err.message)
          return { node: node.name, success: false, error: err.message }
        }
      })
    )
    
    const failed = results.filter(r => !r.success)
    if (failed.length > 0) {
      console.warn(`[NodeClickhouse] ⚠️ ${failed.length}/${results.length} 个节点动态建表失败`)
      failed.forEach(f => console.warn(`  - ${f.node}: ${f.error}`))
    } else {
      return results
    }
    
    return results
  }
  
  /**
   * 删除表（支持集群模式）
   */
  async dropTable(options = {}) {
    const tableName = options.tableName || this.tableName
    
    if (!tableName) {
      throw new Error('Table name is required for dropTable')
    }
    
    // 检测是否为集群模式
    const isCluster = this.client && this.client.isCluster
    
    if (isCluster) {
      console.log(`[NodeClickhouse] 🗑️  集群模式: 从所有节点删除表 "${tableName}"`)
      
      // 获取集群管理器
      const clusterManager = this.client._clusterManager
      if (!clusterManager) {
        console.warn('[NodeClickhouse] ⚠️  集群管理器不存在，使用单节点模式')
        return await super.dropTable(tableName)
      }
      
      // 并行在所有节点删除表
      const deletePromises = clusterManager.nodes.map(async (node) => {
        try {
          console.log(`[NodeClickhouse] 🗑️  从节点 ${node.name} 删除表...`)
          await node.client.command({
            query: `DROP TABLE IF EXISTS ${tableName}`
          })
          console.log(`[NodeClickhouse] ✅ 节点 ${node.name} 删除成功`)
          return { node: node.name, success: true }
        } catch (err) {
          // 表不存在不算错误
          if (err.message && err.message.includes('doesn\'t exist')) {
            console.log(`[NodeClickhouse] ℹ️  节点 ${node.name} 表不存在`)
            return { node: node.name, success: true, notExist: true }
          }
          console.error(`[NodeClickhouse] ❌ 节点 ${node.name} 删除失败:`, err.message)
          return { node: node.name, success: false, error: err.message }
        }
      })
      
      const results = await Promise.all(deletePromises)
      
      // 检查结果
      const failed = results.filter(r => !r.success)
      if (failed.length > 0) {
        console.warn(`[NodeClickhouse] ⚠️  ${failed.length}/${results.length} 个节点删除失败`)
        failed.forEach(f => console.warn(`  - ${f.node}: ${f.error}`))
        throw new Error(`Failed to drop table ${tableName} on ${failed.length} nodes`)
      } else {
        console.log(`[NodeClickhouse] ✅ 所有节点 (${results.length}) 删除表 "${tableName}" 成功`)
      }
      
      return results
    }
    
    // 单节点模式，调用父类
    return await super.dropTable(tableName)
  }
}

// 导出 Op 操作符
NodeClickhouse.Op = WebfunnyClickHouse.Op

module.exports = NodeClickhouse
