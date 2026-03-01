
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'ApmErrorInfo',
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
    // 操作名称
    operationName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'operationName'
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
    // 错误消息
    errorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorMessage'
    },
    // 简化的错误消息（用于聚合）
    simpleErrorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleErrorMessage'
    },
    // 错误堆栈
    errorStack: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorStack'
    },
    // Span类型
    spanType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'spanType'
    },
    // Span层级
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
    // 发生时间（毫秒时间戳）
    errorTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'errorTime'
    },
    // HTTP相关 - 完整URL
    httpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpUrl'
    },
    // HTTP相关 - 简洁URL（用于聚合）
    simpleHttpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleHttpUrl'
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
    // HTTP相关 - 请求头
    httpHeaders: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpHeaders'
    },
    // HTTP相关 - 请求参数
    httpRequestBody: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpRequestBody'
    },
    // HTTP相关 - 响应内容
    httpResponseBody: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpResponseBody'
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
    // 数据库相关 - 错误码
    dbErrorCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dbErrorCode'
    },
    // RPC相关 - 远程服务
    rpcService: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'rpcService'
    },
    // RPC相关 - 远程方法
    rpcMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'rpcMethod'
    },
    // 完整的Tags JSON
    tagsJson: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tagsJson'
    },
    // 完整的Logs JSON
    logsJson: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logsJson'
    },
    // 用户IP
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
  // 排序规则（针对错误查询优化）
  orderBy: "ORDER BY (webMonitorId, service, errorType, happenDate)",
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

