const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointAlarmRules',
  structure: {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectId'
    },
    createManId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'createManId'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    },
    // 状态 1=启用 2=禁用
    status: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'status'
    },
    createBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'createBy'
    },
    updateBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'updateBy'
    },
    // 监控粒度: "hour"(默认) / "day"
    monitorGranularity: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'monitorGranularity'
    },
    // 告警级别: "high" / "medium" / "low"
    alarmLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alarmLevel'
    },
    // 分组字段 JSON: [{fieldName: "websiteSource", fieldLabel: "网站来源"}, ...]
    groupFields: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'groupFields'
    },
    // 全局筛选 JSON: {combineType: "a", queryCriteria: [{fieldName, operator, values}]}
    globalFilter: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'globalFilter'
    },
    // 是否启用分组告警: 0=否 1=是
    useGroupAlarm: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'useGroupAlarm'
    },
    // 告警指标 JSON（含 pointId, calcField, queryCriteria 等）
    metricConfig: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'metricConfig'
    },
    // 分组告警维度字段名
    groupAlarmField: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'groupAlarmField'
    },
    // 分组告警规则 JSON 数组
    // [{
    //   type: "absolute" | "percentage",  -- 绝对值变化 | 百分比变化
    //   groupValues: string[],           -- 分组值列表
    //   compareType: "lessThanAndEqual"(低于) | "greaterThanAndEqual"(高于) | "between"(区间在) | "notBetween"(区间不在),
    //   comparePeriod: "lastHour"(上一个小时) | "lastPeriod"(昨天同期) | "specialValue"(特定值),
    //   threshold: number,               -- 阈值（between/notBetween 时为下限）
    //   maxThreshold: number             -- 最大阈值（仅 between/notBetween 使用，为上限）
    // }]
    groupAlarmRules: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'groupAlarmRules'
    },
    // 可见范围: 1=所有人可见 2=仅管理员和自己
    visibleScope: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'visibleScope'
    },
    // 关联通知模板ID
    templateId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'templateId'
    },
    // 累计触发次数
    triggerCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'triggerCount'
    },
    // 最近告警时间
    lastTriggerTime: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'lastTriggerTime'
    },
    createdAt: {
      type: DataTypes.DATE_TIME,
      field: "createdAt",
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updatedAt: {
      type: DataTypes.DATE_TIME,
      field: "updatedAt",
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
  partition: "",
  orderBy: "ORDER BY (createdAt)",
  properties: ""
}
const DefineTable = function (sequelize) {
  return sequelize.define(Columns.tableName, Columns.structure, Columns.index)
}

module.exports = {
  Columns,
  DefineTable
}
