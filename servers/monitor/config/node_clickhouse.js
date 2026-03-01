const { client } = require('../config/db')
const path = require("path")
const WebfunnyClickHouse = require("webfunny-clickhouse")
const EngineHelper = require('./engineHelper')
const crypto = require('crypto')
const uuid = require('node-uuid')
const moment = require('moment')

// 引入 OpenTelemetry 追踪工具（可插拔）
const { wrapClickHouseQuery } = require('../../../utils/webfunnyOtelTracer')

const showSql = false

class NodeClickhouse extends WebfunnyClickHouse {
  constructor(schemaPath = "") {
    super({ schemaPath: schemaPath ? path.resolve(__dirname, schemaPath) : "", client, showSql })
    
    // 包装 query 方法，添加 OpenTelemetry 追踪（受配置控制）
    wrapClickHouseQuery(this, { serviceName: 'monitor' })
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

    if (!data.createdAt) {
      data.createdAt = this._getCurrentTimestamp()
    }
    
    if (!data.updatedAt) {
      data.updatedAt = data.createdAt
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
    //   const { v4: uuidv4 } = require('uuid')
    //   data.id = uuidv4()
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
    // 常见的唯一字段: webMonitorId, projectId 等
    const uniqueFields = ['webMonitorId', 'projectId', 'userId']
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
   * 从 Columns 生成 createTableSql（兼容旧 schema）
   * @private
   */
  _generateCreateTableSql() {
    if (!this.schema || !this.schema.Columns) {
      return null
    }
    
    const { Columns } = this.schema
    const { tableName, structure, engine, partition, orderBy, indexSql } = Columns
    
    if (!tableName || !structure) {
      return null
    }
    
    // 构建字段定义
    const fields = []
    for (const key in structure) {
      const field = structure[key]
      const { type, field: fieldName, allowNull = true, comment = '', defaultValue = '', dataModel = '' } = field
      
      const nullSql = allowNull ? '' : 'NOT NULL'
      const commentSql = comment ? `COMMENT '${comment}'` : ''
      const dataModelSql = dataModel ? dataModel : ''
      const defaultValueSql = typeof defaultValue === 'number' ? `DEFAULT ${defaultValue}` : ''
      
      fields.push(`\`${fieldName}\` ${type} ${nullSql} ${dataModelSql} ${defaultValueSql} ${commentSql}`.trim())
    }
    
    // 构建完整 SQL
    const sql = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${fields.join(',\n        ')}${indexSql ? ',\n        ' + indexSql : ''}
      )
      ${engine || 'ENGINE = MergeTree()'}
      ${partition || ''}
      ${orderBy || 'ORDER BY tuple()'}
    `.trim().replace(/\n\s+/g, '\n')
    
    return sql
  }
  
  /**
   * 创建表（支持集群引擎自动转换 + 多节点同步）
   * @param {object} options - 选项
   * @returns {Promise}
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
      // console.log(`[NodeClickhouse] 📡 集群模式: 在所有节点创建表 "${tableName}"`)
      
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
        // console.log(`[NodeClickhouse] 📝 表名替换: ${this.schema.Columns.tableName} → ${tableName}`)
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
        // console.log(`[NodeClickhouse] 📌 数据库名: ${databaseName}`)
        
        const clusterEngine = EngineHelper.convertEngine(originalEngine, {
          isCluster: true,
          tableName,
          databaseName,  // 添加数据库名，生成唯一的 ZooKeeper 路径
          zkPath
        })
        finalSql = finalSql.replace(originalEngine, clusterEngine)
        // console.log(`[NodeClickhouse] 🔧 引擎转换: ${originalEngine} → ${clusterEngine}`)
      }
      
      // 在所有节点上创建表
      const createPromises = clusterManager.nodes.map(async (node) => {
        try {
          // console.log(`[NodeClickhouse] 📝 在节点 ${node.name} 创建表...`)
          await node.client.command({ query: finalSql })
          // console.log(`[NodeClickhouse] ✅ 节点 ${node.name} 创建表成功`)
          return { node: node.name, success: true }
        } catch (err) {
          // 表已存在不算错误
          if (err.message && err.message.includes('already exists')) {
            console.log(`[NodeClickhouse] ℹ️  节点 ${node.name} 表已存在`)
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
        // console.log(`[NodeClickhouse] ✅ 所有节点 (${results.length}) 创建表成功`)
      }
      
      return results
    }
    
    // 单节点模式，直接调用父类
    return await super.createTable(options)
  }
  
  /**
   * 删除表（支持集群模式，删除所有节点）
   * @param {object} options - 选项
   * @param {string} options.tableName - 表名（可选，默认使用 this.tableName）
   * @returns {Promise}
   */
  async dropTable(options = {}) {
    const tableName = options.tableName || this.tableName
    
    if (!tableName) {
      throw new Error('Table name is required for dropTable')
    }
    
    // 检测是否为集群模式
    const isCluster = this.client && this.client.isCluster
    
    if (isCluster) {
      // console.log(`[NodeClickhouse] 🗑️  集群模式: 从所有节点删除表 "${tableName}"`)
      
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

module.exports = NodeClickhouse