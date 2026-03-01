/**
 * Schema 字段同步路由
 * 提供表结构检测和自动同步接口
 * 用于同步 Product 和 Company 表的新增字段
 */

const { SchemaSyncController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * 检查所有表的字段差异（只检查，不执行）
   * POST /wfCenter/schemaSync/checkAll
   * 
   * 返回示例:
   * {
   *   code: 200,
   *   msg: "检查完成: 共检查 2 个表, 2 个表需要更新",
   *   data: {
   *     checkTime: "2024-01-01T00:00:00.000Z",
   *     summary: {
   *       totalTablesChecked: 2,
   *       tablesNeedUpdate: 2,
   *       tablesUpToDate: 0
   *     },
   *     updates: [
   *       {
   *         tableName: "Product",
   *         missingFields: [
   *           { name: "pointCount", type: "INTEGER" }
   *         ],
   *         sql: "ALTER TABLE `Product` ADD COLUMN `pointCount` INT NULL COMMENT '点位数量'"
   *       },
   *       {
   *         tableName: "Company",
   *         missingFields: [
   *           { name: "userSeats", type: "INTEGER" }
   *         ],
   *         sql: "ALTER TABLE `Company` ADD COLUMN `userSeats` INT NULL COMMENT '用户席位'"
   *       }
   *     ]
   *   }
   * }
   */
  router.post('/schemaSync/checkAll', SchemaSyncController.checkAll)
  
  /**
   * 同步所有表的字段（直接执行）
   * POST /wfCenter/schemaSync/syncAll
   * 
   * 注意：此接口会直接执行同步，请先调用 checkAll 预览差异
   * 
   * 返回示例:
   * {
   *   code: 200,
   *   msg: "同步完成: 更新 2 个字段, 失败 0 个",
   *   data: {
   *     startTime: "2024-01-01T00:00:00.000Z",
   *     endTime: "2024-01-01T00:00:05.000Z",
   *     summary: {
   *       totalTablesChecked: 2,
   *       updated: 2,
   *       failed: 0,
   *       skipped: 0
   *     },
   *     details: [
   *       {
   *         tableName: "Product",
   *         field: "pointCount",
   *         status: "added",
   *         sql: "ALTER TABLE `Product` ADD COLUMN `pointCount` INT NULL COMMENT '点位数量'"
   *       },
   *       {
   *         tableName: "Company",
   *         field: "userSeats",
   *         status: "added",
   *         sql: "ALTER TABLE `Company` ADD COLUMN `userSeats` INT NULL COMMENT '用户席位'"
   *       }
   *     ]
   *   }
   * }
   */
  router.post('/schemaSync/syncAll', SchemaSyncController.syncAll)
}

