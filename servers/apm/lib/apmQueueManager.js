/**
 * APM 数据队列管理器
 * 用于批量插入数据到 ClickHouse，减少 parts 数量
 * 
 * 设计参考：monitor_server_clickhouse/controllers/CommonUpLog.js
 */
const NodeClickHouse = require('../config/node_clickhouse')
const log = require('../config/log')

// 配置参数
const CONFIG = {
  // 队列长度上限，超过立即刷新
  QUEUE_LENGTH_LIMIT: 1000,
  // 定时刷新间隔（毫秒）
  FLUSH_INTERVAL_MS: 10000,
  // 表类型
  TABLE_TYPES: {
    SPAN: 'ApmSpanInfo',
    ERROR: 'ApmErrorInfo',
    TRACE_SEGMENT: 'ApmTraceSegment'
  }
}

/**
 * APM 队列管理器
 * 
 * 队列结构：
 * {
 *   [serviceInstance]: {
 *     [tableType]: [data1, data2, ...]
 *   }
 * }
 */
class ApmQueueManager {
  constructor() {
    // 数据队列
    this.queue = {}
    // 定时器引用
    this.flushTimer = null
    // 是否正在刷新（防止并发）
    this.isFlushing = false
    // 统计信息
    this.stats = {
      totalAdded: 0,
      totalFlushed: 0,
      flushCount: 0
    }
  }

  /**
   * 添加数据到队列
   * @param {string} serviceInstance - 项目ID（表名前缀）
   * @param {string} tableType - 表类型 (ApmSpanInfo, ApmErrorInfo, ApmTraceSegment)
   * @param {Object|Array} data - 要插入的数据（单条或数组）
   */
  addToQueue(serviceInstance, tableType, data) {
    // 初始化队列结构
    if (!this.queue[serviceInstance]) {
      this.queue[serviceInstance] = {}
    }
    if (!this.queue[serviceInstance][tableType]) {
      this.queue[serviceInstance][tableType] = []
    }

    // 添加数据（支持单条和数组）
    if (Array.isArray(data)) {
      this.queue[serviceInstance][tableType].push(...data)
      this.stats.totalAdded += data.length
    } else {
      this.queue[serviceInstance][tableType].push(data)
      this.stats.totalAdded += 1
    }

    // 检查是否超过队列长度上限
    if (this.queue[serviceInstance][tableType].length >= CONFIG.QUEUE_LENGTH_LIMIT) {
      console.log(`[ApmQueue] 队列 ${serviceInstance}.${tableType} 达到上限(${CONFIG.QUEUE_LENGTH_LIMIT})，立即刷新`)
      this.flushTable(serviceInstance, tableType)
    }
  }

  /**
   * 刷新单个表的队列
   * @param {string} serviceInstance - 项目ID
   * @param {string} tableType - 表类型
   */
  async flushTable(serviceInstance, tableType) {
    const data = this.queue[serviceInstance]?.[tableType]
    if (!data || data.length === 0) {
      return
    }

    // 取出数据并清空队列（原子操作）
    const toInsert = [...data]
    this.queue[serviceInstance][tableType] = []

    const tableName = `${serviceInstance}_${tableType}`
    
    try {
      const clickhouse = new NodeClickHouse(`../schema/${this.getSchemaName(tableType)}`)
      
      await clickhouse.bulkCreate(toInsert, tableName)
      
      this.stats.totalFlushed += toInsert.length
      // console.log(`✅ [ApmQueue] 批量插入 ${tableName}: ${toInsert.length} 条`)
    } catch (error) {
      console.error(`❌ [ApmQueue] 批量插入 ${tableName} 失败:`, error)
      // log.printError(`[ApmQueue] 批量插入 ${tableName} 失败:`, error)
      // 失败的数据可以选择重新入队或丢弃
      // 这里选择丢弃，因为重试可能导致内存堆积
    }
  }

  /**
   * 获取 schema 文件名
   * @param {string} tableType - 表类型
   * @returns {string} schema 文件名
   */
  getSchemaName(tableType) {
    const schemaMap = {
      'ApmSpanInfo': 'apmSpanInfo',
      'ApmErrorInfo': 'apmErrorInfo',
      'ApmTraceSegment': 'apmTraceSegment'
    }
    return schemaMap[tableType] || tableType.toLowerCase()
  }

  /**
   * 刷新所有队列
   */
  async flushAll() {
    if (this.isFlushing) {
      console.log('[ApmQueue] 正在刷新中，跳过本次调用')
      return
    }

    this.isFlushing = true
    this.stats.flushCount++

    try {
      const tasks = []

      for (const serviceInstance in this.queue) {
        const tables = this.queue[serviceInstance]
        for (const tableType in tables) {
          if (tables[tableType] && tables[tableType].length > 0) {
            tasks.push(this.flushTable(serviceInstance, tableType))
          }
        }
      }

      if (tasks.length > 0) {
        await Promise.all(tasks)
        // console.log(`[ApmQueue] 刷新完成，共 ${tasks.length} 个表`)
      }
    } catch (error) {
      log.printError('[ApmQueue] 刷新队列异常:', error)
    } finally {
      this.isFlushing = false
    }
  }

  /**
   * 启动定时刷新
   */
  startFlushTimer() {
    if (this.flushTimer) {
      console.log('[ApmQueue] 定时器已启动，跳过')
      return
    }

    this.flushTimer = setInterval(() => {
      this.flushAll()
    }, CONFIG.FLUSH_INTERVAL_MS)

    console.log(`[ApmQueue] ✓ 定时刷新已启动，间隔: ${CONFIG.FLUSH_INTERVAL_MS / 1000}s，队列上限: ${CONFIG.QUEUE_LENGTH_LIMIT}`)
  }

  /**
   * 停止定时刷新
   */
  stopFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
      console.log('[ApmQueue] 定时刷新已停止')
    }
  }

  /**
   * 获取队列状态
   * @returns {Object} 队列统计信息
   */
  getStatus() {
    let totalQueued = 0
    const tableStats = {}

    for (const serviceInstance in this.queue) {
      const tables = this.queue[serviceInstance]
      for (const tableType in tables) {
        const count = tables[tableType]?.length || 0
        totalQueued += count
        
        if (!tableStats[tableType]) {
          tableStats[tableType] = 0
        }
        tableStats[tableType] += count
      }
    }

    return {
      totalQueued,
      tableStats,
      projectCount: Object.keys(this.queue).length,
      ...this.stats
    }
  }

  /**
   * 清空所有队列（不插入）
   */
  clearAll() {
    this.queue = {}
    console.log('[ApmQueue] 队列已清空')
  }
}

// 单例模式
const queueManager = new ApmQueueManager()

module.exports = {
  queueManager,
  ApmQueueManager,
  CONFIG
}

