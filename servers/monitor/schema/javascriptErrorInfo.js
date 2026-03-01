
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'JavascriptErrorInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId',
      fieldTitle: '分析数据id'
    },
    // 页面标识ID
    pageKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pageKey',
      fieldTitle: '页面标识ID'
    },
    // 设备名称
    deviceName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceName',
      fieldTitle: '设备名称'
    },
    // 系统信息
    os: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'os',
      fieldTitle: '系统信息'
    },
    // 平台信息
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'platform',
      fieldTitle: '平台信息'
    },
    // 浏览器名称
    browserName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserName',
      fieldTitle: '浏览器名称'
    },
    // 浏览器版本号
    browserVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserVersion',
      fieldTitle: '浏览器版本号'
    },
    // 用户的IP
    monitorIp: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'monitorIp',
      fieldTitle: '用户的IP'
    },
    // 国家
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'country',
      fieldTitle: '国家'
    },
    // 省份
    province: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'province',
      fieldTitle: '省份'
    },
    // 城市
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'city',
      fieldTitle: '城市'
    },
    // 信息类型
    infoType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'infoType',
      fieldTitle: '信息类型'
    },
    // JS报错的简易信息
    simpleErrorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleErrorMessage',
      fieldTitle: 'JS报错的简易信息'
    },
    // JS报错信息
    errorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorMessage',
      fieldTitle: 'JS报错信息'
    },
    // JS报错堆栈
    errorStack: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorStack',
      fieldTitle: 'JS报错堆栈'
    },
    // 浏览器信息
    browserInfo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserInfo',
      fieldTitle: '浏览器信息'
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