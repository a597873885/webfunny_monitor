const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')

const Columns = {
  tableName: 'BuryPointUserField',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'projectId'
    },
    // 字段名称英文（Key）
    fieldName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'fieldName'
    },
    // 字段名称中文（属性名称）
    fieldAlias: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'fieldAlias'
    },
    // 字段类型：VARCHAR/INT/FLOAT/DATE
    fieldType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'fieldType',
      defaultValue: "'VARCHAR'"
    },
    // 字段长度
    fieldLength: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'fieldLength',
      defaultValue: 255
    },
    // 字段描述
    fieldDesc: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'fieldDesc'
    },
    // 是否预置字段：1-预置（不可编辑删除），0-自定义
    isPreset: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'isPreset',
      defaultValue: 0
    },
    // 是否有数据上报：1-有，0-无（有数据时不可删除）
    hasData: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'hasData',
      defaultValue: 0
    },
    // 创建人
    createBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'createBy'
    },
    // 修改人
    updateBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'updateBy'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE_TIME,
      field: "createdAt",
      defaultValue: DataTypes.NOW
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE_TIME,
      field: "updatedAt",
      defaultValue: DataTypes.NOW
    }
  },
  // 创建索引
  index: {
    freezeTableName: true
  },
  engine: "ENGINE MergeTree()",
  // 创建索引Sql
  indexSql: "",
  // 数据模型
  dataModel: "",
  // 指定分区Key
  partition: "",
  // 排序规则
  orderBy: "ORDER BY (projectId, createdAt)",
  // 设置表属性
  properties: ""
}

const DefineTable = function (sequelize) {
  return sequelize.define(Columns.tableName, Columns.structure, Columns.index)
}

module.exports = {
  Columns,
  DefineTable
}
