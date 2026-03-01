
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'ApmSpanInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 追踪ID
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
    // 父Span ID（-1表示根span）
    parentSpanId: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'parentSpanId'
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
    // 操作名称（如：POST /api/users, Mysql/query）
    operationName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'operationName'
    },
    // Span类型（Entry/Exit/Local）
    spanType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'spanType'
    },
    // Span层级（Http/Database/RPC/MQ/Cache）
    spanLayer: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'spanLayer'
    },
    // 对端地址
    peer: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'peer'
    },
    // 开始时间（毫秒时间戳）
    startTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'startTime'
    },
    // 结束时间（毫秒时间戳）
    endTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'endTime'
    },
    // 耗时（ms）
    duration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'duration'
    },
    // 是否错误（0-正常，1-错误）
    isError: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'isError'
    },
    // 组件ID
    componentId: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'componentId'
    },
    // HTTP相关 - 完整URL
    httpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpUrl'
    },
    // HTTP相关 - 请求方法
    httpMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpMethod'
    },
    // HTTP相关 - 状态码
    httpStatusCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpStatusCode'
    },
    // 数据库相关 - 数据库类型
    dbType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dbType'
    },
    // 数据库相关 - 数据库实例
    dbInstance: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dbInstance'
    },
    // 数据库相关 - SQL语句
    dbStatement: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dbStatement'
    },
    // 完整的Tags JSON（便于后续扩展查询）
    tagsJson: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tagsJson'
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
  // 排序规则（针对常见查询优化）
  orderBy: "ORDER BY (webMonitorId, service, spanType, spanLayer, happenDate)",
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

