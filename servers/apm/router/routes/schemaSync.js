/**
 * Schema 同步路由
 * 提供表结构检测和自动同步接口
 */

const { SchemaSyncController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 同步所有项目的表结构（直接执行）
   * POST /wfApm/schemaSync/syncAll
   * 
   * 注意：此接口会直接执行同步，请先调用 checkAll 预览差异
   */
  router.post('/schemaSync/syncAll', SchemaSyncController.syncAll)
  
  /**
   * 检查所有项目的表结构差异（只检查，不执行）
   * POST /wfApm/schemaSync/checkAll
   * Body: {
   *   tableType: string  // 可选，指定表类型
   * }
   */
  router.post('/schemaSync/checkAll', SchemaSyncController.checkAll)
  
  /**
   * 检测单个项目的表结构差异（预览模式）
   * POST /wfApm/schemaSync/check
   * Body: {
   *   webMonitorId: string, // 必填，项目 ID
   *   tableType: string     // 可选，指定表类型
   * }
   */
  router.post('/schemaSync/check', SchemaSyncController.checkProject)
  
  /**
   * 获取所有表类型列表
   * GET /wfApm/schemaSync/tableTypes
   */
  router.get('/schemaSync/tableTypes', SchemaSyncController.getTableTypes)
  
  /**
   * 获取指定表的 Schema 字段定义
   * POST /wfApm/schemaSync/schemaFields
   * Body: {
   *   tableType: string // 表类型，如 ApmSpanInfo
   * }
   */
  router.post('/schemaSync/schemaFields', SchemaSyncController.getSchemaFields)
  
  /**
   * 获取指定表的实际数据库字段
   * POST /wfApm/schemaSync/tableColumns
   * Body: {
   *   tableName: string // 完整表名，如 apm_xxx_ApmSpanInfo
   * }
   */
  router.post('/schemaSync/tableColumns', SchemaSyncController.getTableColumns)
  
  /**
   * 检查所有项目的日志表是否创建（支持自动执行建表）
   * POST /wfApm/schemaSync/syncTablesAll
   * Body: {
   *   execute: boolean  // 可选，默认为 false。true 表示自动执行建表，false 表示只检查
   * }
   * 
   * 注意：此接口仅 superAdmin 可访问
   */
  router.post('/schemaSync/syncTablesAll', SchemaSyncController.syncTablesAll)
}

