const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'User',
  structure: {
    // 数据ID
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 用户Id（业务）
    customerId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
    },
    // 用户名称
    customerName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerName'
    },
    // 内置ID
    customerKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKey'
    },
    // 用户的IP
    monitorIp: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'monitorIp'
    },
    // 国家
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'country'
    },
    // 省份
    province: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'province'
    },
    // 城市
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'city'
    },
    // 最新在线时间，
    lastOnlineTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'lastOnlineTime'
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
  orderBy: "ORDER BY (dataId)",
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