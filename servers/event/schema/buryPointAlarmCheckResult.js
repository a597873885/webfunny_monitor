const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointAlarmCheckResult',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectId'
    },
    // 告警规则id
    alarmId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'alarmId'
    },
    // 触发规则下标（groupAlarmRules 数组下标，0=规则1）
    ruleIndex: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'ruleIndex'
    },
    // 分组值（全局告警为空字符串）
    groupValue: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'groupValue'
    },
    // 统计时段开始（整点）
    hourStart: {
      type: DataTypes.DATE_TIME,
      allowNull: false,
      field: 'hourStart'
    },
    // 统计时段结束
    hourEnd: {
      type: DataTypes.DATE_TIME,
      allowNull: false,
      field: 'hourEnd'
    },
    // 指标值（当前时段）
    currentValue: {
      type: DataTypes.FLOAT(64),
      allowNull: true,
      field: 'currentValue'
    },
    // 对比值（上一小时/昨天同期/特定值阈值）
    baselineValue: {
      type: DataTypes.FLOAT(64),
      allowNull: true,
      field: 'baselineValue'
    },
    // 较对比项差异值（currentValue - baselineValue）
    diffValue: {
      type: DataTypes.FLOAT(64),
      allowNull: true,
      field: 'diffValue'
    },
    // 较对比项差异率（百分比，如 130 表示 130%）
    diffRate: {
      type: DataTypes.FLOAT(64),
      allowNull: true,
      field: 'diffRate'
    },
    // 告警状态 0=正常 1=异常
    triggered: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'triggered'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE_TIME,
      field: "createdAt",
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    }
  },
  index: {
    freezeTableName: true
  },
  engine: "ENGINE MergeTree()",
  indexSql: "",
  dataModel: "",
  partition: "toYYYYMM(hourStart)",
  // TTL：90 天后自动清理历史检测结果
  orderBy: "ORDER BY (alarmId, ruleIndex, hourStart) TTL createdAt + INTERVAL 90 DAY DELETE",
  properties: ""
}
const DefineTable = function (sequelize) {
  return sequelize.define(Columns.tableName, Columns.structure, Columns.index)
}

module.exports = {
  Columns,
  DefineTable
}
