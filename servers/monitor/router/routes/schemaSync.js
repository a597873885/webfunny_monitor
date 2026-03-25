/**
 * Schema 同步路由
 * 提供表结构检测和自动同步接口
 */

const { SchemaSyncController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 同步所有项目的表结构（直接执行）
   * POST /wfMonitor/schemaSync/syncAll
   * Body: {
   *   webMonitorId: string  // 可选，指定项目 ID。如果传入，则只同步该项目的表；如果不传入，则同步所有项目
   * }
   * 
   * 注意：此接口会直接执行同步，请先调用 checkAll 预览差异
   * 
   * 返回示例:
   * {
   *   code: 200,
   *   msg: "同步完成: 更新 5 个表, 失败 0 个",
   *   data: {
   *     startTime: "2024-01-01T00:00:00.000Z",
   *     endTime: "2024-01-01T00:01:00.000Z",
   *     summary: { ... },
   *     details: [...]
   *   }
   * }
   */
  router.post('/schemaSync/syncAll', SchemaSyncController.syncAll)
  
  /**
   * 检查所有项目的表结构差异（只检查，不执行）
   * POST /wfMonitor/schemaSync/checkAll
   * Body: {
   *   webMonitorId: string, // 可选，指定项目 ID。如果传入，则只检查该项目的表；如果不传入，则检查所有项目
   *   tableType: string     // 可选，指定表类型
   * }
   * 
   * 返回示例:
   * {
   *   code: 200,
   *   msg: "检查完成: 共 100 个项目, 5 个表需要更新",
   *   data: {
   *     checkTime: "2024-01-01T00:00:00.000Z",
   *     summary: {
   *       totalProjects: 100,
   *       totalTablesChecked: 2100,
   *       tablesNeedUpdate: 5,
   *       tableNotExists: 10
   *     },
   *     updates: [
   *       {
   *         tableName: "webfunny_xxxJavascriptErrorInfo",
   *         missingFields: [
   *           { name: "newField", type: "String" }
   *         ],
   *         sql: "ALTER TABLE ... ADD COLUMN ..."
   *       }
   *     ]
   *   }
   * }
   */
  router.post('/schemaSync/checkAll', SchemaSyncController.checkAll)
  
  /**
   * 检测单个项目的表结构差异（预览模式）
   * POST /wfMonitor/schemaSync/check
   * Body: {
   *   webMonitorId: string, // 必填，项目 ID
   *   tableType: string     // 可选，指定表类型
   * }
   */
  router.post('/schemaSync/check', SchemaSyncController.checkProject)
  
  /**
   * 获取所有表类型列表
   * GET /wfMonitor/schemaSync/tableTypes
   */
  router.get('/schemaSync/tableTypes', SchemaSyncController.getTableTypes)
  
  /**
   * 获取指定表的 Schema 字段定义
   * POST /wfMonitor/schemaSync/schemaFields
   * Body: {
   *   tableType: string // 表类型，如 JavascriptErrorInfo
   * }
   */
  router.post('/schemaSync/schemaFields', SchemaSyncController.getSchemaFields)
  
  /**
   * 获取指定表的实际数据库字段
   * POST /wfMonitor/schemaSync/tableColumns
   * Body: {
   *   tableName: string // 完整表名，如 webfunny_xxxJavascriptErrorInfo
   * }
   */
  router.post('/schemaSync/tableColumns', SchemaSyncController.getTableColumns)
  
  /**
   * 检查所有项目的日志表是否创建（支持自动执行建表）
   * POST /wfMonitor/schemaSync/syncTablesAll
   * Body: {
   *   execute: boolean  // 可选，默认为 false。true 表示自动执行建表，false 表示只检查
   * }
   * 
   * 注意：此接口仅 superAdmin 可访问
   * 权限：仅 superAdmin 可访问
   * 
   * 返回示例（execute=false 或省略）:
   * {
   *   code: 200,
   *   msg: "检查完成: 共 100 个项目, 5 个表缺失",
   *   data: {
   *     checkTime: "2024-01-01T00:00:00.000Z",
   *     summary: {
   *       totalProjects: 100,
   *       totalTablesChecked: 2100,
   *       tablesMissing: 5,
   *       tablesCreated: 0,
   *       tablesFailed: 0
   *     },
   *     missingTables: [
   *       {
   *         webMonitorId: "webfunny_xxx",
   *         tableName: "webfunny_xxxJavascriptErrorInfo",
   *         tableType: "JavascriptErrorInfo",
   *         sql: "CREATE TABLE IF NOT EXISTS ..."
   *       }
   *     ]
   *   }
   * }
   * 
   * 返回示例（execute=true）:
   * {
   *   code: 200,
   *   msg: "检查完成: 共 100 个项目, 5 个表缺失, 成功创建 5 个, 失败 0 个",
   *   data: {
   *     checkTime: "2024-01-01T00:00:00.000Z",
   *     summary: {
   *       totalProjects: 100,
   *       totalTablesChecked: 2100,
   *       tablesMissing: 5,
   *       tablesCreated: 5,
   *       tablesFailed: 0
   *     },
   *     missingTables: [...],
   *     results: [
   *       {
   *         webMonitorId: "webfunny_xxx",
   *         tableName: "webfunny_xxxJavascriptErrorInfo",
   *         status: "created",
   *         sql: "CREATE TABLE IF NOT EXISTS ..."
   *       }
   *     ]
   *   }
   * }
   */
  router.post('/schemaSync/syncTablesAll', SchemaSyncController.syncTablesAll)
}
