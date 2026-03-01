/**
 * WebfunnyClickHouse 配置入口
 * 封装配置，提供统一的实例化接口
 * 使用 npm 包：webfunny-clickhouse
 */

const WebfunnyClickHouse = require('webfunny-clickhouse')
const { client } = require('./db')
const path = require('path')

/**
 * ClickHouse 封装类（新版本，推荐使用）
 * 提供参数化查询和 ORM 风格的 API
 */
class ClickHouse extends WebfunnyClickHouse {
  constructor(schemaPath = "", options = {}) {
    super({ 
      schemaPath: schemaPath ? path.resolve(__dirname, schemaPath) : "", 
      client, 
      showSql: options.showSql || false 
    })
  }
}

// 动态表名白名单（用于安全验证）
ClickHouse.ALLOWED_TABLE_PREFIXES = [
  'JavascriptErrorInfo',
  'HttpLogInfo',
  'HttpErrorInfo',
  'CustomerPV',
  'CustomerPvLeave',
  'PageLoadInfo',
  'ResourceLoadInfo',
  'BehaviorInfo',
  'VideoLog',
  'HttpLogReqInfo',
  'LocalLog',
  'ScreenshotInfo',
  'ExtendBehaviorInfo',
]

/**
 * 验证动态表名是否在白名单中
 * @param {string} tableName - 表名
 * @returns {boolean}
 */
ClickHouse.validateDynamicTable = function(tableName) {
  const isAllowed = ClickHouse.ALLOWED_TABLE_PREFIXES.some(
    prefix => tableName.includes(prefix)
  )
  
  if (!isAllowed) {
    console.warn(`[ClickHouse] Dynamic table not in whitelist: ${tableName}`)
    return false
  }
  
  return true
}

module.exports = ClickHouse

