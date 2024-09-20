const { client } = require('../config/db_clickhouse')
const path = require("path")
const WebfunnyNodeClickhouse = require("webfunny-node-clickhouse")
const { accountInfo } = require('./AccountConfig')
const showSql = accountInfo.printSql && accountInfo.printSql.center
class NodeClickhouse extends WebfunnyNodeClickhouse {
  constructor(schemaPath = "") {
    super({ schemaPath: schemaPath ? path.resolve(__dirname, schemaPath) : "", client, showSql })
  }
}

module.exports = NodeClickhouse