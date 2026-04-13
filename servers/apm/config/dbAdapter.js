const { dbType } = require('./local_db')

/**
 * 根据 dbType 返回对应的数据库适配器实例
 * ClickHouse → NodeClickhouse（基于 webfunny-clickhouse）
 * PostgreSQL  → NodePostgres（基于 Sequelize）
 *
 * @param {string} schemaPath - schema 文件相对路径（相对于 modules/ 下的调用方）
 * @param {number} depth - 调用方相对 config/ 的层级数，用于解析路径（默认 1 层，即 modules/）
 */
function createAdapter(schemaPath = '', depth = 1) {
  if (dbType === 'postgres') {
    const NodePostgres = require('./node_postgres')
    return new NodePostgres(schemaPath, depth)
  }
  const NodeClickHouse = require('./node_clickhouse')
  return new NodeClickHouse(schemaPath)
}

module.exports = { createAdapter, dbType }
