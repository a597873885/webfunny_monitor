const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'HttpErrorHandleList',
  structure: {
    // dataId
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 报错信息
    simpleHttpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleHttpUrl'
    },
    // 处理状态：未解决，已解决，已忽略
    // 处理状态：unsolved, solved, ignored
    errorStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorStatus'
    },
    // 处理人：userId
    handleMan: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'handleMan'
    },
    // 处理开始时间
    handleStartDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'handleStartDate'
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
  orderBy: "ORDER BY (simpleHttpUrl)",
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