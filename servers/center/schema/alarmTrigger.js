// 连接clickhouse数据库
const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'AlarmTrigger',
  structure: {
    // 主键ID
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'companyId'
    },
    // 告警内容
    alarmContent: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alarmContent'
    },
    // 推送状态 1: 已通知 2: 未通知
    pushStatus: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'pushStatus'
    },
    // 告警规则ID
    ruleId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ruleId'
    },
    // 告警等级
    ruleLevel: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'ruleLevel'
    },
    // 应用名称
    application: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'application'
    },
    // 告警条目ID
    alarmItemId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alarmItemId'
    },
    // 严重性 1: 严重, 2: 警告, 3: 提示, 4: 未分级
    seriousLevel: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'seriousLevel'
    },
    // 触发时间
    triggerTime: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'triggerTime'
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
  orderBy: "ORDER BY (triggerTime)",
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