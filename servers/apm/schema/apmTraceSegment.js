
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'ApmTraceSegment',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 追踪ID（全局唯一，用于串联整个调用链）
    traceId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'traceId'
    },
    // Segment ID（当前服务段的唯一标识）
    segmentId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'segmentId'
    },
    // 服务名称
    service: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'service'
    },
    // 服务实例名称
    serviceInstance: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'serviceInstance'
    },
    // Span数量
    spanCount: {
      type: DataTypes.INT(16),
      allowNull: true,
      field: 'spanCount'
    },
    // 总耗时（ms）
    duration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'duration'
    },
    // 是否有错误（0-正常，1-有错误）
    hasError: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'hasError'
    },
    // 完整的Segment JSON数据（用于详细查询和调用链展示）
    segmentJson: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'segmentJson'
    }
  },
  // 创建索引
  index: {
    freezeTableName: true
  },
  engine: "ENGINE MergeTree()",
  // 创建索引Sql
  indexSql: "",
  // 数据模型
  dataModel: "",
  // 指定分区Key（按天分区）
  partition: "PARTITION BY toYYYYMMDD(happenDate)",
  // 排序规则（优化查询性能）
  orderBy: "ORDER BY (webMonitorId, service, happenDate, traceId)",
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

