const { client } = require('../config/db')
const path = require("path")
const WebfunnyNodeClickhouse = require("webfunny-node-clickhouse")
const showSql = true
class NodeClickhouse extends WebfunnyNodeClickhouse {
  constructor(schemaPath = "") {
    super({ schemaPath: schemaPath ? path.resolve(__dirname, schemaPath) : "", client, showSql })
  }
}

module.exports = NodeClickhouse