
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'HttpLogReqInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 请求方法
    method: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'method'
    },
    // 接口请求的完整URL
    httpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpUrl'
    },
    // 接口请求的简洁URL
    simpleHttpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleHttpUrl'
    },
    // 接口耗时
    loadTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'loadTime'
    },
    // 接口状态
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'status'
    },
    // 接口状态描述
    statusText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'statusText'
    },
    // 接口结果状态
    statusResult: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'statusResult'
    },
    // 接口请求的参数
    requestText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'requestText'
    },
    // 接口的返回结果
    responseText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'responseText'
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