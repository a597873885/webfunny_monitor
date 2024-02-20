
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'PageLoadInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    loadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'loadType'
    },
    firstByte: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'firstByte'
    },
    domReady: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'domReady'
    },
    pageCompleteLoaded: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'pageCompleteLoaded'
    },
    dns: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'dns'
    },
    tcp: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'tcp'
    },
    ssl: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'ssl'
    },
    response: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'response'
    },
    conTrans: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'conTrans'
    },
    domAnalysis: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'domAnalysis'
    },
    resourceLoaded: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'resourceLoaded'
    },
    // 页面打开的秒数（整数）
    openSecond: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'openSecond'
    },
    // 网络速度评估
    effectiveType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'effectiveType'
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
    // 操作系统
    os: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'os'
    },
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