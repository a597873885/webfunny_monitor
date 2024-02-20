
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'CustomerPV',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 用户标识ID
    pageKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pageKey'
    },
    // 页面title
    pageTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pageTitle'
    },
    // 设备名称
    deviceName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceName'
    },
    // 设备尺寸，物理尺寸
    deviceSize: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceSize'
    },
    // 系统信息
    os: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'os'
    },
    // 浏览器名称
    browserName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserName'
    },
    // 浏览器版本号
    browserVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserVersion'
    },
    // 浏览器版信息
    browserInfo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserInfo'
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
    // 运营商
    operators: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'operators'
    },
    // 上报类型
    uploadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadType'
    },
    // 加载类型(首次加载或是reload)
    loadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'loadType'
    },
    // 加载加载时间(首次加载或是reload)
    loadTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'loadTime'
    },
    // 判断是否为新用户 "new/old"
    newStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'newStatus'
    },
    // 来源页面的URL
    referrer: {
      type: DataTypes.STRING,
        allowNull: true,
        field: 'referrer'
    },
    // 创建日期，用于查询留存数据
    customerKeyCreatedDate: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKeyCreatedDate'
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