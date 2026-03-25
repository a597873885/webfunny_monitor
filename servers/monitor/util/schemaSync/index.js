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

// 并发控制配置：默认并发数为 15，可根据实际情况调整
const DEFAULT_CONCURRENCY = 15

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
 * 获取数据库中表的实际字段结构（单个表）
 * @param {string} tableName - 表名
 * @returns {Promise<Array>} [{ name, type }]
 */
async function getTableColumns(tableName) {
  try {
    const sql = `SELECT name, type FROM system.columns WHERE table = '${tableName}'`
    const result = await clickhouse.query(sql, { type: clickhouse.QueryTypes.SELECT })
    // 如果结果为空数组，说明表不存在
    if (!result || result.length === 0) {
      return null
    }
    return result
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
 * 批量获取多个表的字段结构（优化方案二）
 * @param {Array<string>} tableNames - 表名数组
 * @returns {Promise<Map<string, Array>>} Map<表名, [{ name, type }]>
 */
async function getTableColumnsBatch(tableNames) {
  if (!tableNames || tableNames.length === 0) {
    return new Map()
  }
  
  try {
    // 构建批量查询 SQL，使用 IN 子句
    // 注意：ClickHouse 的 system.columns 表中，table 字段存储的是表名
    // 转义表名中的单引号，防止 SQL 注入
    const escapedTableNames = tableNames.map(name => {
      // 转义单引号：' -> ''
      const escaped = name.replace(/'/g, "''")
      return `'${escaped}'`
    })
    
    const tableNamesStr = escapedTableNames.join(', ')
    const sql = `SELECT table, name, type FROM system.columns WHERE table IN (${tableNamesStr})`
    
    const result = await clickhouse.query(sql, { type: clickhouse.QueryTypes.SELECT })
    
    // 将结果按表名分组
    const tableColumnsMap = new Map()
    
    // 初始化所有表为 null（表示表不存在）
    tableNames.forEach(tableName => {
      tableColumnsMap.set(tableName, null)
    })
    
    // 填充存在的表的字段信息
    if (result && result.length > 0) {
      const groupedByTable = {}
      result.forEach(row => {
        const tableName = row.table
        if (!groupedByTable[tableName]) {
          groupedByTable[tableName] = []
        }
        groupedByTable[tableName].push({
          name: row.name,
          type: row.type
        })
      })
      
      // 更新 Map
      Object.keys(groupedByTable).forEach(tableName => {
        tableColumnsMap.set(tableName, groupedByTable[tableName])
      })
    }
    
    return tableColumnsMap
  } catch (error) {
    log.printError(`[SchemaSync] 批量获取表结构失败，将回退到单个查询模式`, error)
    // 如果批量查询失败，返回空 Map，后续会回退到单个查询
    return new Map()
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
    await clickhouse.execSql(sql)
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
 * @param {Map<string, Array>} tableColumnsCache - 表结构缓存（可选，用于批量查询优化）
 * @returns {Promise<Object>} 同步结果
 */
async function syncSingleTable(webMonitorId, schemaInfo, dryRun = false, tableColumnsCache = null) {
  const fullTableName = `${webMonitorId}${schemaInfo.tableName}`
  
  const result = {
    tableName: fullTableName,
    status: 'skipped',
    missingFields: [],
    sql: null,
    error: null
  }
  
  try {
    // 1. 获取表的实际结构（优先使用缓存）
    let tableColumns = null
    if (tableColumnsCache && tableColumnsCache.has(fullTableName)) {
      tableColumns = tableColumnsCache.get(fullTableName)
    } else {
      tableColumns = await getTableColumns(fullTableName)
    }
    
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
 * @param {number} options.concurrency - 并发数（可选，默认 15）
 * @param {number} options.batchSize - 批量查询大小（可选，默认 50）
 * @returns {Promise<Object>} 同步结果报告
 */
async function syncAllSchemas(options = {}) {
  const { 
    dryRun = false, 
    webMonitorId = null, 
    tableType = null, 
    onProgress = null,
    concurrency = DEFAULT_CONCURRENCY,
    batchSize = 50
  } = options
  
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
    const startTime = Date.now()
    log.printInfo(`[SchemaSync] ========== 开始同步 ==========`)
    log.printInfo(`[SchemaSync] 项目数量: ${projectList.length}, 并发数: ${concurrency}, 批量查询大小: ${batchSize}`)
    
    // 2. 解析所有 schema
    const schemaParseStart = Date.now()
    const schemas = []
    for (const schemaPath of schemaLogList) {
      const schemaInfo = parseSchema(schemaPath)
      if (schemaInfo) {
        // 如果指定了表类型，只处理匹配的
        if (tableType && schemaInfo.tableName.toLowerCase() !== tableType.toLowerCase()) {
          continue
        }
        schemas.push(schemaInfo)
      }
    }
    const schemaParseTime = Date.now() - schemaParseStart
    log.printInfo(`[SchemaSync] Schema 解析完成: ${schemas.length} 个表类型, 耗时: ${schemaParseTime}ms`)
    
    // 3. 生成所有需要检查的表名列表（用于批量查询）
    const allTableNames = []
    const tableTaskMap = new Map() // 用于快速查找任务信息
    
    for (const project of projectList) {
      const projectId = project.webMonitorId
      if (!projectId) continue
      
      for (const schemaInfo of schemas) {
        const fullTableName = `${projectId}${schemaInfo.tableName}`
        allTableNames.push(fullTableName)
        tableTaskMap.set(fullTableName, { projectId, schemaInfo })
      }
    }
    
    const totalCount = allTableNames.length
    report.summary.totalTables = totalCount
    
    log.printInfo(`[SchemaSync] 共需要检查 ${totalCount} 个表，开始批量预加载表结构...`)
    
    // 4. 批量预加载表结构（方案二：批量查询优化）
    const batchQueryStart = Date.now()
    const tableColumnsCache = new Map()
    const batchCount = Math.ceil(allTableNames.length / batchSize)
    let batchQuerySuccessCount = 0
    let batchQueryFailCount = 0
    let batchQueryTotalRows = 0
    
    log.printInfo(`[SchemaSync] [批量查询优化] 将分 ${batchCount} 批查询，每批 ${batchSize} 个表`)
    
    for (let i = 0; i < batchCount; i++) {
      const start = i * batchSize
      const end = Math.min(start + batchSize, allTableNames.length)
      const batchTableNames = allTableNames.slice(start, end)
      const batchStart = Date.now()
      
      try {
        const batchResult = await getTableColumnsBatch(batchTableNames)
        const batchTime = Date.now() - batchStart
        // 合并到缓存中
        let batchRows = 0
        batchResult.forEach((columns, tableName) => {
          tableColumnsCache.set(tableName, columns)
          if (columns && columns.length > 0) {
            batchRows += columns.length
          }
        })
        batchQueryTotalRows += batchRows
        batchQuerySuccessCount++
        
        const progress = Math.round(end / totalCount * 100)
        log.printInfo(`[SchemaSync] [批量查询] 第 ${i + 1}/${batchCount} 批: ${end}/${totalCount} (${progress}%), 耗时: ${batchTime}ms, 本批查询到 ${batchRows} 个字段`)
      } catch (error) {
        batchQueryFailCount++
        const batchTime = Date.now() - batchStart
        log.printError(`[SchemaSync] [批量查询] 第 ${i + 1}/${batchCount} 批失败，耗时: ${batchTime}ms，将回退到单个查询`, error)
        // 批量查询失败时，不填充缓存，后续会回退到单个查询
      }
    }
    
    const batchQueryTime = Date.now() - batchQueryStart
    const batchCacheHitRate = totalCount > 0 ? (tableColumnsCache.size / totalCount * 100).toFixed(1) : 0
    const avgBatchTime = batchQuerySuccessCount > 0 ? (batchQueryTime / batchQuerySuccessCount).toFixed(0) : 0
    
    log.printInfo(`[SchemaSync] [批量查询优化] 完成统计:`)
    log.printInfo(`[SchemaSync]   - 总耗时: ${batchQueryTime}ms (${(batchQueryTime / 1000).toFixed(2)}秒)`)
    log.printInfo(`[SchemaSync]   - 成功批次: ${batchQuerySuccessCount}/${batchCount}`)
    log.printInfo(`[SchemaSync]   - 失败批次: ${batchQueryFailCount}`)
    log.printInfo(`[SchemaSync]   - 缓存命中: ${tableColumnsCache.size}/${totalCount} (${batchCacheHitRate}%)`)
    log.printInfo(`[SchemaSync]   - 平均每批耗时: ${avgBatchTime}ms`)
    log.printInfo(`[SchemaSync]   - 查询总行数: ${batchQueryTotalRows} 个字段`)
    
    // 性能对比提示（如果使用单个查询需要多少次）
    const estimatedSingleQueryCount = totalCount
    const estimatedSingleQueryTime = estimatedSingleQueryCount * 50 // 假设每次查询 50ms
    const batchSpeedup = estimatedSingleQueryTime > 0 ? (estimatedSingleQueryTime / batchQueryTime).toFixed(1) : 1
    log.printInfo(`[SchemaSync]   - 性能提升: 相比单个查询(${estimatedSingleQueryCount}次)预计提升约 ${batchSpeedup}x 倍`)
    
    // 5. 使用并发控制执行同步任务（方案一：并发控制）
    const concurrentStart = Date.now()
    const limit = pLimit(concurrency)
    let processedCount = 0
    let cacheHitCount = 0
    let cacheMissCount = 0
    const tasks = []
    
    log.printInfo(`[SchemaSync] [并发控制优化] 开始并发执行 ${totalCount} 个同步任务，并发数: ${concurrency}`)
    
    // 创建所有任务
    for (const tableName of allTableNames) {
      const taskInfo = tableTaskMap.get(tableName)
      if (!taskInfo) continue
      
      const task = limit(async () => {
        processedCount++
        report.summary.checked++
        
        const { projectId, schemaInfo } = taskInfo
        
        // 统计缓存命中率
        if (tableColumnsCache.has(tableName)) {
          cacheHitCount++
        } else {
          cacheMissCount++
        }
        
        // 进度回调
        if (onProgress) {
          onProgress({
            current: processedCount,
            total: totalCount,
            project: projectId,
            table: schemaInfo.tableName
          })
        }
        
        // 每处理 100 个表打印一次进度
        if (processedCount % 100 === 0 || processedCount === totalCount) {
          const progress = Math.round(processedCount / totalCount * 100)
          const elapsed = Date.now() - concurrentStart
          const avgTime = processedCount > 0 ? (elapsed / processedCount).toFixed(0) : 0
          const remaining = totalCount - processedCount
          const estimatedRemaining = remaining > 0 ? Math.round((elapsed / processedCount) * remaining / 1000) : 0
          log.printInfo(`[SchemaSync] [并发执行] 进度: ${processedCount}/${totalCount} (${progress}%), 已耗时: ${(elapsed / 1000).toFixed(1)}秒, 平均: ${avgTime}ms/表, 预计剩余: ${estimatedRemaining}秒`)
        }
        
        // 同步单个表（使用批量查询的缓存结果）
        const result = await syncSingleTable(projectId, schemaInfo, dryRun, tableColumnsCache)
        
        // 统计结果（需要加锁保护，但 p-limit 已经保证了并发安全）
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
        
        return result
      })
      
      tasks.push(task)
    }
    
    // 等待所有任务完成
    await Promise.all(tasks)
    
    const concurrentTime = Date.now() - concurrentStart
    const cacheHitRate = processedCount > 0 ? ((cacheHitCount / processedCount) * 100).toFixed(1) : 0
    const avgConcurrentTime = processedCount > 0 ? (concurrentTime / processedCount).toFixed(0) : 0
    
    log.printInfo(`[SchemaSync] [并发控制优化] 完成统计:`)
    log.printInfo(`[SchemaSync]   - 总耗时: ${concurrentTime}ms (${(concurrentTime / 1000).toFixed(2)}秒)`)
    log.printInfo(`[SchemaSync]   - 处理表数: ${processedCount}`)
    log.printInfo(`[SchemaSync]   - 缓存命中: ${cacheHitCount} (${cacheHitRate}%)`)
    log.printInfo(`[SchemaSync]   - 缓存未命中: ${cacheMissCount} (回退到单个查询)`)
    log.printInfo(`[SchemaSync]   - 平均耗时: ${avgConcurrentTime}ms/表`)
    
    // 性能对比提示（如果串行执行需要多长时间）
    const estimatedSerialTime = processedCount * parseInt(avgConcurrentTime)
    const concurrentSpeedup = estimatedSerialTime > 0 ? (estimatedSerialTime / concurrentTime).toFixed(1) : 1
    log.printInfo(`[SchemaSync]   - 性能提升: 相比串行执行预计提升约 ${concurrentSpeedup}x 倍`)
    
    report.endTime = new Date().toISOString()
    
    const totalDuration = Date.now() - startTime
    const durationSeconds = (totalDuration / 1000).toFixed(2)
    
    log.printInfo(`[SchemaSync] ========== 同步完成 ==========`)
    log.printInfo(`[SchemaSync] 总体统计:`)
    log.printInfo(`[SchemaSync]   - 检查表数: ${report.summary.checked}`)
    log.printInfo(`[SchemaSync]   - 更新表数: ${report.summary.updated}`)
    log.printInfo(`[SchemaSync]   - 跳过表数: ${report.summary.skipped}`)
    log.printInfo(`[SchemaSync]   - 失败表数: ${report.summary.failed}`)
    log.printInfo(`[SchemaSync]   - 表不存在: ${report.summary.tableNotExists}`)
    log.printInfo(`[SchemaSync] 性能统计:`)
    log.printInfo(`[SchemaSync]   - Schema 解析耗时: ${schemaParseTime}ms`)
    log.printInfo(`[SchemaSync]   - 批量查询耗时: ${batchQueryTime}ms`)
    log.printInfo(`[SchemaSync]   - 并发执行耗时: ${concurrentTime}ms`)
    log.printInfo(`[SchemaSync]   - 总耗时: ${totalDuration}ms (${durationSeconds}秒)`)
    
    // 计算平均速度
    const tablesPerSecond = totalDuration > 0 ? (report.summary.checked / (totalDuration / 1000)).toFixed(1) : 0
    log.printInfo(`[SchemaSync]   - 处理速度: ${tablesPerSecond} 表/秒`)
    
    // 优化效果总结
    log.printInfo(`[SchemaSync] 优化效果:`)
    log.printInfo(`[SchemaSync]   - 批量查询减少数据库查询次数: ${estimatedSingleQueryCount}次 → ${batchCount}次 (减少 ${((1 - batchCount / estimatedSingleQueryCount) * 100).toFixed(1)}%)`)
    log.printInfo(`[SchemaSync]   - 并发执行提升处理速度: 约 ${concurrentSpeedup}x 倍`)
    log.printInfo(`[SchemaSync] ============================`)
    
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
    
    // 调试日志
    if (tableName.includes('ResourcePerfInfo')) {
      log.printInfo(`[SchemaSync Debug] 生成 SQL: ${tableName}, schemaPath: ${schemaPath}`)
    }
    
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
    await clickhouse.execSql(sql)
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
      // 获取所有项目，不受 purchaseCodeProjectCount 限制
      try {
        // 使用 ProjectModel 的 getAllProjectList 方法
        const allProjects = await ProjectModel.getAllProjectList()
        projectList = allProjects || []
        log.printInfo(`[SchemaSync Debug] ProjectModel.getAllProjectList 返回 ${projectList.length} 个项目`)
        
        // 如果返回为空，尝试备用方案
        if (projectList.length === 0) {
          log.printInfo('[SchemaSync Debug] 尝试备用查询方案...')
          const db = require('../config/db')
          // 尝试 Projects 表名（复数形式）
          try {
            const result = await db.sequelize.query(
              "SELECT webMonitorId FROM Projects WHERE delStatus = 0",
              { type: db.sequelize.QueryTypes.SELECT }
            )
            projectList = result || []
            log.printInfo(`[SchemaSync Debug] 从 Projects 表查询到 ${projectList.length} 个项目`)
          } catch (e1) {
            // 尝试 project 表名（小写）
            try {
              const result = await db.sequelize.query(
                "SELECT webMonitorId FROM project WHERE delStatus = 0",
                { type: db.sequelize.QueryTypes.SELECT }
              )
              projectList = result || []
              log.printInfo(`[SchemaSync Debug] 从 project 表查询到 ${projectList.length} 个项目`)
            } catch (e2) {
              log.printError('[SchemaSync Debug] 所有查询方案都失败:', e2)
            }
          }
        }
      } catch (dbError) {
        log.printError('[SchemaSync Debug] 查询失败:', dbError)
        projectList = []
      }
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
        
        // 生成表名：如果 projectId 已经包含 webfunny_ 前缀，则不再添加
        const fullTableName = projectId.startsWith('webfunny_') 
          ? `${projectId}${schemaInfo.tableName}`
          : `webfunny_${projectId}${schemaInfo.tableName}`
        
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
  getTableColumnsBatch,
  findMissingFields,
  generateAlterTableSql,
  getTableTypeList,
  checkMissingTables,
  generateCreateTableSql
}
