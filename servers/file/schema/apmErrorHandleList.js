
const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'ApmErrorHandleList',
  structure: {
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 服务实例标识（对应监控系统的webMonitorId）
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId'
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
    // 错误类型（Http/Database/RPC/MQ/Custom）
    errorType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorType'
    },
    // 错误级别（Error/Warning/Fatal）
    errorLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorLevel'
    },
    // 简化的错误消息（用于分组聚合）
    simpleErrorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleErrorMessage'
    },
    // 完整的错误消息示例（最新一次）
    errorMessageSample: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorMessageSample'
    },
    // 错误堆栈示例（最新一次）
    errorStackSample: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorStackSample'
    },
    // 操作名称（最常见的）
    operationName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'operationName'
    },
    // Span层级
    spanLayer: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'spanLayer'
    },
    // HTTP URL（最常见的）
    httpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpUrl'
    },
    // HTTP状态码
    httpStatusCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpStatusCode'
    },
    // 数据库类型
    dbType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dbType'
    },
    // 数据库实例
    dbInstance: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dbInstance'
    },
    // ========== 统计信息 ==========
    // 错误总次数
    errorCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'errorCount',
      defaultValue: 0
    },
    // 影响的Trace数量
    affectedTraces: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'affectedTraces',
      defaultValue: 0
    },
    // 影响的用户数（根据customerKey统计）
    affectedUsers: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'affectedUsers',
      defaultValue: 0
    },
    // 首次发生时间
    firstOccurrence: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'firstOccurrence'
    },
    // 最后发生时间
    lastOccurrence: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'lastOccurrence'
    },
    // 发生日期（用于分区和查询）
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate'
    },
    // ========== 错误处理状态 ==========
    // 处理状态（0-未处理，1-处理中，2-已解决，3-已忽略）
    handleStatus: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'handleStatus',
      defaultValue: 0
    },
    // 处理人
    handleBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'handleBy'
    },
    // 处理时间
    handleTime: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'handleTime'
    },
    // 处理备注
    handleNote: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'handleNote'
    },
    // 是否已通知（0-未通知，1-已通知）
    isNotified: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'isNotified',
      defaultValue: 0
    },
    // 通知时间
    notifyTime: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'notifyTime'
    },
    // ========== 相关信息 ==========
    // 相关TraceID列表（JSON数组，最多保存10个）
    relatedTraceIds: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'relatedTraceIds'
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
    freezeTableName: true
  },
  engine: "ENGINE MergeTree()",
  // 创建索引Sql
  indexSql: "",
  // 数据模型
  dataModel: "",
  // 指定分区Key（按天分区）
  partition: "PARTITION BY toYYYYMMDD(happenDate)",
  // 排序规则（针对错误统计和管理优化）
  orderBy: "ORDER BY (webMonitorId, service, errorType, handleStatus, happenDate)",
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

