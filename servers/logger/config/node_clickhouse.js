const { client } = require('../config/db')
const path = require("path")
const WebfunnyNodeClickhouse = require("webfunny-node-clickhouse")

// 引入 OpenTelemetry 追踪工具（可插拔）
const { wrapClickHouseQuery } = require('../../../utils/webfunnyOtelTracer')

const showSql = false

class NodeClickhouse extends WebfunnyNodeClickhouse {
  constructor(schemaPath = "") {
    super({ schemaPath: schemaPath ? path.resolve(__dirname, schemaPath) : "", client, showSql })
    
    // 包装 query 方法，添加 OpenTelemetry 追踪（受配置控制）
    wrapClickHouseQuery(this, { serviceName: 'logger' })
  }
}

module.exports = NodeClickhouse