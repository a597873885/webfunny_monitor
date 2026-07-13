const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')

/**
 * 分群结果表结构定义（动态创建，每个项目一个表）
 * 表名格式: {projectId}_segment_results
 * 使用 AggregatingMergeTree + Bitmap 存储分群用户ID集合
 * 
 * 设计理念（参考神策）：
 * - 用户ID以 Bitmap 形式存储，极省空间（10万用户仅需几十KB）
 * - 天然去重，不存在 merge 前后数据不一致问题
 * - 支持高效的交集/并集/差集运算
 */
const Columns = {
  getTableName: (projectId) => `${projectId}_segment_results`,
  structure: {
    // 分群ID
    segmentId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'segmentId'
    },
    // 用户ID位图（使用 cityHash64 将 weCustomerKey 映射为 UInt64）
    userBitmap: {
      type: 'AggregateFunction(groupBitmap, UInt64)',
      allowNull: false,
      field: 'userBitmap'
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE_TIME,
      field: "updatedAt",
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    }
  },
  index: {
    freezeTableName: true
  },
  // AggregatingMergeTree：用于聚合函数（groupBitmap）
  engine: "ENGINE AggregatingMergeTree()",
  indexSql: "",
  dataModel: "",
  partition: "",
  // 按分群ID排序
  orderBy: "ORDER BY (segmentId)",
  properties: ""
}

const DefineTable = function (sequelize) {
  return sequelize.define(Columns.tableName, Columns.structure, Columns.index)
}

module.exports = {
  Columns,
  DefineTable
}
