const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointField',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 通用字段标识：1-是，0-否
     weType: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'weType'
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectId'
    },
    // 字段名称英文
    fieldName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'fieldName'
    },
    // 字段名称中文（用户输入的）
    fieldAlias: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'fieldAlias'
    },
    // 字段类型
    fieldType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'fieldType'
    },
    // 字段长度
    fieldLength: {
      type: DataTypes.INT(32),
      allowNull: false,
      field: 'fieldLength'
    },
    // 字段描述
    fieldDesc: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'fieldDesc'
    },
     // 是否归类：0-否，1-是
     groupByFlag: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'groupByFlag'
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
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
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
  // 创建索引
  index: {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
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
  orderBy: "ORDER BY (createdAt)",
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