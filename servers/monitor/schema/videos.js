const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'Videos',
  structure: {
    // 数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 应用ID
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId'
    },
    // 视频记录ID（1个id的有效期是10分钟）
    videoId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'videoId'
    },
    // 创建人userId
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
    },
    // 记录状态
    recordStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'recordStatus'
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
  orderBy: "ORDER BY (webMonitorId)",
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