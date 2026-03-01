
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'ApmLogInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 追踪ID（关联到Trace）
    traceId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'traceId'
    },
    // Segment ID
    segmentId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'segmentId'
    },
    // Span ID
    spanId: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'spanId'
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
    // 日志级别（DEBUG/INFO/WARN/ERROR/FATAL）
    logLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logLevel'
    },
    // 日志内容
    logContent: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logContent'
    },
    // 日志消息
    logMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logMessage'
    },
    // 日志标签（JSON）
    logTags: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logTags'
    },
    // 日志数据（JSON）
    logData: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logData'
    },
    // 日志时间戳（毫秒）
    logTimestamp: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'logTimestamp'
    },
    // 端点名称
    endpoint: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'endpoint'
    },
    // 线程名称
    threadName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'threadName'
    },
    // 日志来源
    logger: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logger'
    },
    // 异常堆栈
    exceptionStack: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'exceptionStack'
    },
    // 是否有异常
    hasException: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'hasException',
      defaultValue: 0
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
  // 排序规则
  orderBy: "ORDER BY (webMonitorId, service, logLevel, happenDate)",
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

