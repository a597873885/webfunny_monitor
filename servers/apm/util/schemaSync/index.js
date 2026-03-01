/**
 * Schema 同步模块
 * 用于自动检测和同步数据库表结构与 schema 定义的差异
 */

const path = require('path')
const NodeClickHouse = require('../../config/node_clickhouse')
const schemaLogList = require('../../schema/schemaLogList')
const { ProjectModel } = require('../../modules/models.js')
const log = require('../../../../config/log')

// 创建一个通用的 ClickHouse 实例用于执行查询
const clickhouse = new NodeClickHouse()

/**
 * 解析 Schema 文件，提取字段定义
 * @param {string} schemaPath - schema 文件路径
 * @returns {Object} { tableName, fields: [{ name, type, field }] }
 */
function parseSchema(schemaPath) {
  try {
    const schema = require(path.resolve(__dirname, '../../', schemaPath.replace('../', '')))
    const { tableName, structure } = schema.Columns
    
    const fields = Object.keys(structure).map(key => {
      const fieldDef = structure[key]
      return {
        name: key,
        field: fieldDef.field || key,
        type: typeof fieldDef.type === 'function' ? fieldDef.type() : fieldDef.type,
        allowNull: fieldDef.allowNull !== false,
        fieldTitle: fieldDef.fieldTitle || ""
      }
    })
    
    return { tableName, fields }
  } catch (error) {
    log.printError(`[SchemaSync] 解析 schema 失败: ${schemaPath}`, error)
    return null
  }
}

/**
 * 获取数据库中表的实际字段结构
 * @param {string} tableName - 表名
 * @returns {Promise<Array>} [{ name, type }]
 */
async function getTableColumns(tableName) {
  try {
    const sql = `SELECT name, type FROM system.columns WHERE table = '${tableName}'`
    const result = await clickhouse.query(sql)
    
    // 处理不同的返回格式
    let columns = []
    if (Array.isArray(result)) {
      columns = result
    } else if (result && Array.isArray(result.data)) {
      columns = result.data
    } else if (result && result.rows) {
      columns = result.rows
    }
    
    // 如果结果为空数组，说明表不存在
    if (!columns || columns.length === 0) {
      return null
    }
    return columns
  } catch (error) {
    // 表不存在的情况
    if (error.message && (error.message.includes('doesn\'t exist') || error.message.includes('not found'))) {
      return null // 返回 null 表示表不存在
    }
    log.printError(`[SchemaSync] 获取表结构失败: ${tableName}`, error)
    return []
  }
}

/**
 * 对比 schema 定义与实际表结构，找出缺失的字段
 * @param {Array} schemaFields - schema 中定义的字段
 * @param {Array} tableColumns - 数据库中的实际字段
 * @returns {Array} 缺失的字段列表
 */
function findMissingFields(schemaFields, tableColumns) {
  if (!tableColumns || tableColumns.length === 0) {
    return [] // 表不存在或为空，不处理
  }
  
  const existingFieldSet = new Set(tableColumns.map(col => col.name.toLowerCase()))
  
  return schemaFields.filter(field => {
    const fieldName = (field.field || field.name).toLowerCase()
    return !existingFieldSet.has(fieldName)
  })
}

/**
 * 生成 ALTER TABLE ADD COLUMN 的 SQL（支持一次添加多个字段）
 * @param {string} tableName - 表名
 * @param {Array} missingFields - 缺失的字段列表
 * @returns {string} ALTER TABLE SQL
 */
function generateAlterTableSql(tableName, missingFields) {
  if (!missingFields || missingFields.length === 0) {
    return null
  }
  
  // ClickHouse 支持一条 SQL 添加多个字段
  const addColumns = missingFields.map(field => {
    const fieldName = field.field || field.name
    const fieldType = field.type
    return `ADD COLUMN \`${fieldName}\` ${fieldType}`
  }).join(', ')
  
  return `ALTER TABLE ${tableName} ${addColumns}`
}

/**
 * 执行 ALTER TABLE SQL
 * @param {string} sql - SQL 语句
 * @returns {Promise<boolean>} 是否执行成功
 */
async function executeAlterTable(sql) {
  try {
    // 使用 query 方法执行 DDL 语句
    await clickhouse.query(sql)
    return true
  } catch (error) {
    log.printError(`[SchemaSync] 执行 SQL 失败: ${sql}`, error)
    return false
  }
}

/**
 * 同步单个表的 schema
 * @param {string} webMonitorId - 项目 ID
 * @param {Object} schemaInfo - { tableName, fields }
 * @param {boolean} dryRun - 是否预览模式
 * @returns {Promise<Object>} 同步结果
 */
async function syncSingleTable(webMonitorId, schemaInfo, dryRun = false) {
  const fullTableName = `${webMonitorId}_${schemaInfo.tableName}`
  
  const result = {
    tableName: fullTableName,
    status: 'skipped',
    missingFields: [],
    sql: null,
    error: null
  }
  
  try {
    // 1. 获取表的实际结构
    const tableColumns = await getTableColumns(fullTableName)
    
    // 表不存在
    if (tableColumns === null) {
      result.status = 'table_not_exists'
      return result
    }
    
    // 2. 对比找出缺失字段
    const missingFields = findMissingFields(schemaInfo.fields, tableColumns)
    
    if (missingFields.length === 0) {
      result.status = 'up_to_date'
      return result
    }
    
    result.missingFields = missingFields.map(f => ({
      name: f.field || f.name,
      type: f.type
    }))
    
    // 3. 生成 SQL
    const sql = generateAlterTableSql(fullTableName, missingFields)
    result.sql = sql
    
    // 4. 预览模式不执行
    if (dryRun) {
      result.status = 'pending'
      return result
    }
    
    // 5. 执行 SQL
    const success = await executeAlterTable(sql)
    result.status = success ? 'updated' : 'failed'
    
    if (!success) {
      result.error = 'SQL execution failed'
    }
    
    return result
  } catch (error) {
    result.status = 'error'
    result.error = error.message
    return result
  }
}

/**
 * 同步所有项目的所有表
 * @param {Object} options - 配置选项
 * @param {boolean} options.dryRun - 预览模式，只检测不执行
 * @param {string} options.webMonitorId - 指定项目 ID（可选）
 * @param {string} options.tableType - 指定表类型（可选）
 * @param {Function} options.onProgress - 进度回调函数
 * @returns {Promise<Object>} 同步结果报告
 */
async function syncAllSchemas(options = {}) {
  const { dryRun = false, webMonitorId = null, tableType = null, onProgress = null } = options
  
  const report = {
    startTime: new Date().toISOString(),
    endTime: null,
    dryRun,
    summary: {
      totalProjects: 0,
      totalTables: 0,
      checked: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      tableNotExists: 0
    },
    details: []
  }
  
  try {
    // 1. 获取项目列表
    let projectList = []
    if (webMonitorId) {
      projectList = [{ webMonitorId }]
    } else {
      projectList = await ProjectModel.getWebMonitorIdList()
    }
    
    report.summary.totalProjects = projectList.length
    log.printInfo(`[SchemaSync] 开始同步，共 ${projectList.length} 个项目`)
    
    // 2. 解析所有 schema
    const schemas = []
    for (const schemaPath of schemaLogList) {
      const schemaInfo = parseSchema(schemaPath)
      if (schemaInfo) {
        // 如果指定了表类型，只处理匹配的
        if (tableType && schemaInfo.tableName.toLowerCase() !== tableType.toLowerCase()) {
          continue
        }
        schemas.push({
          ...schemaInfo,
          schemaPath
        })
      }
    }
    
    log.printInfo(`[SchemaSync] 共 ${schemas.length} 个表类型需要检查`)
    
    // 3. 串行遍历每个项目的每个表
    let processedCount = 0
    const totalCount = projectList.length * schemas.length
    report.summary.totalTables = totalCount
    
    for (const project of projectList) {
      const projectId = project.webMonitorId
      
      if (!projectId) continue
      
      for (const schemaInfo of schemas) {
        processedCount++
        report.summary.checked++
        
        // 进度回调
        if (onProgress) {
          onProgress({
            current: processedCount,
            total: totalCount,
            project: projectId,
            table: schemaInfo.tableName
          })
        }
        
        // 同步单个表（串行执行）
        const result = await syncSingleTable(projectId, schemaInfo, dryRun)
        
        // 统计结果
        switch (result.status) {
          case 'updated':
            report.summary.updated++
            break
          case 'up_to_date':
          case 'skipped':
            report.summary.skipped++
            break
          case 'failed':
          case 'error':
            report.summary.failed++
            break
          case 'table_not_exists':
            report.summary.tableNotExists++
            break
        }
        
        // 只记录有变化的或失败的详情
        if (result.status !== 'up_to_date' && result.status !== 'skipped') {
          report.details.push(result)
        }
        
        // 每处理完一个表，打印日志
        if (result.missingFields && result.missingFields.length > 0) {
          const fieldsStr = result.missingFields.map(f => f.name).join(', ')
          log.printInfo(`[SchemaSync] ${result.tableName}: ${dryRun ? '发现' : '添加'}缺失字段 [${fieldsStr}]`)
        }
      }
    }
    
    report.endTime = new Date().toISOString()
    
    log.printInfo(`[SchemaSync] 同步完成: 检查 ${report.summary.checked} 个表, ` +
      `更新 ${report.summary.updated} 个, 跳过 ${report.summary.skipped} 个, ` +
      `失败 ${report.summary.failed} 个, 表不存在 ${report.summary.tableNotExists} 个`)
    
    return report
    
  } catch (error) {
    report.endTime = new Date().toISOString()
    report.error = error.message
    log.printError('[SchemaSync] 同步过程出错:', error)
    return report
  }
}

/**
 * 获取所有 schema 的表类型列表
 * @returns {Array} 表类型列表
 */
function getTableTypeList() {
  const tableTypes = []
  for (const schemaPath of schemaLogList) {
    const schemaInfo = parseSchema(schemaPath)
    if (schemaInfo) {
      tableTypes.push({
        tableName: schemaInfo.tableName,
        fieldCount: schemaInfo.fields.length
      })
    }
  }
  return tableTypes
}

/**
 * 生成 CREATE TABLE SQL（支持集群引擎自动转换）
 * @param {string} tableName - 完整表名
 * @param {Object} schemaInfo - schema 信息
 * @returns {string} CREATE TABLE SQL
 */
async function generateCreateTableSql(tableName, schemaInfo) {
  try {
    const schemaPath = schemaInfo.schemaPath
    
    const tableObj = new NodeClickHouse(schemaPath)
    
    // 如果有自定义表名，替换 schema 中的表名
    if (tableName !== tableObj.schema.Columns.tableName) {
      tableObj.schema.createTableSql = tableObj._generateCreateTableSql()
      tableObj.schema.createTableSql = tableObj.schema.createTableSql.replace(
        new RegExp(tableObj.schema.Columns.tableName, 'g'),
        tableName
      )
    }
    
    // 获取最终的建表 SQL
    let finalSql = tableObj.schema.createTableSql
    
    // 如果是集群模式，转换引擎
    if (tableObj.client && tableObj.client.isCluster) {
      const clusterManager = tableObj.client._clusterManager
      if (clusterManager) {
        const databaseName = clusterManager.nodes[0]?.dataBaseName || 'default_db'
        const EngineHelper = require('../../config/engineHelper')
        const zkPath = '/clickhouse/tables/{database}/{shard}/{table}'
        
        if (tableObj.schema.Columns && tableObj.schema.Columns.engine) {
          const originalEngine = tableObj.schema.Columns.engine
          const clusterEngine = EngineHelper.convertEngine(originalEngine, {
            isCluster: true,
            tableName,
            databaseName,
            zkPath
          })
          finalSql = finalSql.replace(originalEngine, clusterEngine)
        }
      }
    }
    
    return finalSql
  } catch (error) {
    log.printError(`[SchemaSync] 生成建表 SQL 失败: ${tableName}`, error)
    return null
  }
}

/**
 * 执行 CREATE TABLE SQL
 * @param {string} sql - SQL 语句
 * @returns {Promise<boolean>} 是否执行成功
 */
async function executeCreateTable(sql) {
  try {
    // 使用 query 方法执行 DDL 语句
    await clickhouse.query(sql)
    return true
  } catch (error) {
    log.printError(`[SchemaSync] 执行建表 SQL 失败: ${sql}`, error)
    return false
  }
}

/**
 * 检查缺失的表并生成建表 SQL（可选执行）
 * @param {Object} options - 配置选项
 * @param {string} options.webMonitorId - 指定项目 ID（可选）
 * @param {boolean} options.execute - 是否执行建表（默认 false）
 * @returns {Promise<Object>} 检查结果报告
 */
async function checkMissingTables(options = {}) {
  const { webMonitorId = null, execute = false, onProgress = null } = options
  
  const report = {
    startTime: new Date().toISOString(),
    endTime: null,
    summary: {
      totalProjects: 0,
      totalTables: 0,
      checked: 0,
      tablesMissing: 0,
      tablesCreated: 0,
      tablesFailed: 0
    },
    missingTables: [],
    results: []
  }
  
  try {
    // 1. 获取项目列表
    let projectList = []
    if (webMonitorId) {
      projectList = [{ webMonitorId }]
    } else {
      projectList = await ProjectModel.getAllProjectList()
    }
    
    report.summary.totalProjects = projectList.length
    log.printInfo(`[SchemaSync] 开始检查缺失表，共 ${projectList.length} 个项目，执行模式: ${execute}`)
    
    // 2. 解析所有 schema
    const schemas = []
    for (const schemaPath of schemaLogList) {
      const schemaInfo = parseSchema(schemaPath)
      if (schemaInfo) {
        schemas.push({
          ...schemaInfo,
          schemaPath
        })
      }
    }
    
    log.printInfo(`[SchemaSync] 共 ${schemas.length} 个表类型需要检查`)
    
    // 3. 遍历每个项目的每个表
    let processedCount = 0
    const totalCount = projectList.length * schemas.length
    report.summary.totalTables = totalCount
    
    for (const project of projectList) {
      const projectId = project.webMonitorId
      if (!projectId) continue
      
      for (const schemaInfo of schemas) {
        processedCount++
        report.summary.checked++
        
        // 进度回调
        if (onProgress) {
          onProgress({
            current: processedCount,
            total: totalCount,
            project: projectId,
            table: schemaInfo.tableName
          })
        }
        
        // 生成表名：APM 系统使用 {webMonitorId}_{tableName} 格式
        const fullTableName = `${projectId}_${schemaInfo.tableName}`
        
        // 检查表是否存在
        const tableColumns = await getTableColumns(fullTableName)
        
        if (tableColumns === null) {
          // 表不存在，生成建表 SQL
          const createSql = await generateCreateTableSql(fullTableName, schemaInfo)
          if (createSql) {
            report.missingTables.push({
              webMonitorId: projectId,
              tableName: fullTableName,
              tableType: schemaInfo.tableName,
              sql: createSql
            })
            report.summary.tablesMissing++
            
            // 执行建表（如果启用）
            if (execute) {
              const success = await executeCreateTable(createSql)
              if (success) {
                report.summary.tablesCreated++
                report.results.push({
                  webMonitorId: projectId,
                  tableName: fullTableName,
                  status: 'created',
                  sql: createSql
                })
                log.printInfo(`[SchemaSync] 成功创建表: ${fullTableName}`)
              } else {
                report.summary.tablesFailed++
                report.results.push({
                  webMonitorId: projectId,
                  tableName: fullTableName,
                  status: 'failed',
                  sql: createSql,
                  error: 'SQL execution failed'
                })
                log.printError(`[SchemaSync] 创建表失败: ${fullTableName}`)
              }
            } else {
              log.printInfo(`[SchemaSync] 发现缺失表: ${fullTableName}`)
            }
          }
        }
      }
    }
    
    report.endTime = new Date().toISOString()
    
    if (execute) {
      log.printInfo(`[SchemaSync] 检查完成: 共 ${report.summary.checked} 个表, ${report.summary.tablesMissing} 个表缺失, 成功创建 ${report.summary.tablesCreated} 个, 失败 ${report.summary.tablesFailed} 个`)
    } else {
      log.printInfo(`[SchemaSync] 检查完成: 共 ${report.summary.checked} 个表, ${report.summary.tablesMissing} 个表缺失`)
    }
    
    return report
    
  } catch (error) {
    report.endTime = new Date().toISOString()
    report.error = error.message
    log.printError('[SchemaSync] 检查缺失表过程出错:', error)
    return report
  }
}

module.exports = {
  syncAllSchemas,
  syncSingleTable,
  parseSchema,
  getTableColumns,
  findMissingFields,
  generateAlterTableSql,
  getTableTypeList,
  checkMissingTables,
  generateCreateTableSql
}

