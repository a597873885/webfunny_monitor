
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'HttpErrorInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId',
      fieldTitle: '分析数据id'
    },
    // 请求方法
    method: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'method',
      fieldTitle: '请求方法'
    },
    // 接口请求的完整URL
    httpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpUrl',
      fieldTitle: '接口请求的完整URL'
    },
    // 接口请求的简洁URL
    simpleHttpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleHttpUrl',
      fieldTitle: '接口请求的简洁URL'
    },
    // 接口状态
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'status',
      fieldTitle: '接口状态'
    },
    // 接口状态描述
    statusText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'statusText',
      fieldTitle: '接口状态描述'
    },
    // 接口结果状态
    statusResult: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'statusResult',
      fieldTitle: '接口结果状态'
    },
    // 接口请求头
    headerText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'headerText',
      fieldTitle: '接口请求头'
    },
    // 接口请求的参数
    requestText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'requestText',
      fieldTitle: '接口请求的参数'
    },
    // 接口的返回结果
    responseText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'responseText',
      fieldTitle: '接口的返回结果'
    },
    // 接口耗时
    loadTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'loadTime',
      fieldTitle: '接口耗时'
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
    // 浏览器版信息
    browserInfo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserInfo',
      fieldTitle: '浏览器版信息'
    },
    // 请求域名或IP
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'domain',
      fieldTitle: '请求域名或IP'
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