const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const { schemaStructure } = require("../metadata/weUserFieldList")

/**
 * 用户表结构定义（动态创建，每个项目一个表）
 * 表名格式: {projectId}_users
 *
 * 用户字段统一从 metadata/weUserFieldList.js 派生（schemaStructure），
 * 系统字段（id / createdAt / updatedAt）在此单独定义
 */
const Columns = {
  getTableName: (projectId) => `${projectId}_users`,
  structure: {
    // ===== 系统字段 =====
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // ===== 用户字段（从 weUserFieldList 派生） =====
    ...schemaStructure,
    // ===== 时间戳字段 =====
    createdAt: {
      type: DataTypes.DATE_TIME,
      field: "createdAt",
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    },
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
  engine: "ENGINE ReplacingMergeTree(updatedAt)",
  indexSql: "",
  dataModel: "",
  partition: "PARTITION BY toYYYYMM(createdAt)",
  orderBy: "ORDER BY (weUserId)",
  properties: ""
}

const DefineTable = function (sequelize) {
  return sequelize.define(Columns.tableName, Columns.structure, Columns.index)
}

module.exports = {
  Columns,
  DefineTable
}
