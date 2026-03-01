
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'CustomerPvLeave',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId',
      fieldTitle: '分析数据id'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId',
      fieldTitle: '监控ID'
    },
    // 用户内置ID
    customerKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKey',
      fieldTitle: '用户内置ID'
    },
    // 日志类型
    uploadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadType',
      fieldTitle: '日志类型'
    },
    // 发生的页面URL
    simpleUrl: {
      type: DataTypes.STRING,
        allowNull: true,
        field: 'simpleUrl',
        fieldTitle: '发生的页面URL'
    },
    // 离开类型(是否访问单页就离开了, 1 仅浏览一个页面就离开了，2 浏览多个页面后离开)
    leaveType: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'leaveType',
      fieldTitle: '离开类型(是否访问单页就离开了, 1 仅浏览一个页面就离开了，2 浏览多个页面后离开)'
    },
    // 发生时间字符串
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate',
      fieldTitle: '发生时间字符串'
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