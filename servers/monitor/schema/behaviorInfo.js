
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'BehaviorInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 行为类型
    behaviorType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'behaviorType'
    },
    // 元素的类名
    className: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'className'
    },
    // Input 框的placeholder
    placeholder: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'placeholder'
    },
    // 输入的内容
    inputValue: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'inputValue'
    },
    // 输入的内容
    tagName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tagName'
    },
    // 元素包含的内容
    innerText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'innerText'
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
  partition: "PARTITION BY toYYYYMMDD(happenDate)",
  // 排序规则
  orderBy: "ORDER BY (happenDate)",
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