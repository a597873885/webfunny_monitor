const { client } = require('../config/db_clickhouse')
const path = require("path")
const WebfunnyNodeClickhouse = require("webfunny-node-clickhouse")
const { accountInfo } = require('./AccountConfig')

// 引入 OpenTelemetry 追踪工具（可插拔）
const { wrapClickHouseQuery } = require('../../../utils/webfunnyOtelTracer')

const showSql = accountInfo.printSql && accountInfo.printSql.center

class NodeClickhouse extends WebfunnyNodeClickhouse {
  constructor(schemaPath = "") {
    super({ schemaPath: schemaPath ? path.resolve(__dirname, schemaPath) : "", client, showSql })
    
    // 包装 query 方法，添加 OpenTelemetry 追踪（受配置控制）
    wrapClickHouseQuery(this, { serviceName: 'center' })
  }
}

module.exports = NodeClickhouse