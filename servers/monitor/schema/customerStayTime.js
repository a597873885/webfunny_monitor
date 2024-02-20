
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'CustomerStayTime',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId'
    },
    // 日志类型
    uploadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadType'
    },
    // 用户标识ID
    customerKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKey'
    },
    // 发生的页面URL
    simpleUrl: {
      type: DataTypes.STRING,
        allowNull: true,
        field: 'simpleUrl'
    },
    // 是否在当前小时内发生(因为停留时间，有可能会跨小时)，0 不在当前小时内，1 在当前小时
    currentHour: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'currentHour'
    },
    // 停留时间(单位：秒)
    stayTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'stayTime'
    },
    // 停留时间范围
    stayScope: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'stayScope'
    },
    // 活跃时间(单位：秒)
    activeTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'activeTime'
    },
    // 活跃时间范围
    activeScope: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'activeScope'
    },
    // 离开类型(是否访问单页就离开了, 1 仅浏览一个页面就离开了，2 浏览多个页面后离开)
    leaveType: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'leaveType'
    },
    // 发生时间字符串
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate'
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