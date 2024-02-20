const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'PageLoadInfoByMinute',
  structure: {
    // dataId
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 日志类型
    infoType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'infoType'
    },
    // 版本号
    projectVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectVersion'
    },
    // 每个小时的名称 06-28 22
    minuteName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'minuteName'
    },
    // 每个小时的数量
    minuteValue: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'minuteValue',
    },
    // 采样的PV
    samplingPv: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'samplingPv'
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
  partition: "PARTITION BY (createdAt)",
  // 排序规则
  orderBy: "ORDER BY (minuteName)",
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