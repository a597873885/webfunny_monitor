
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'ApmMetricsInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
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
    // 指标类型（JVM/Service/Database/Custom）
    metricType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'metricType'
    },
    // 指标名称
    metricName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'metricName'
    },
    // 指标值
    metricValue: {
      type: DataTypes.FLOAT(64),
      allowNull: true,
      field: 'metricValue'
    },
    // 指标单位
    metricUnit: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'metricUnit'
    },
    // 指标标签（JSON）
    metricTags: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'metricTags'
    },
    // ========== JVM 指标 ==========
    // 堆内存使用（MB）
    jvmHeapUsed: {
      type: DataTypes.FLOAT(64),
      allowNull: true,
      field: 'jvmHeapUsed'
    },
    // 堆内存最大值（MB）
    jvmHeapMax: {
      type: DataTypes.FLOAT(64),
      allowNull: true,
      field: 'jvmHeapMax'
    },
    // 非堆内存使用（MB）
    jvmNonHeapUsed: {
      type: DataTypes.FLOAT(64),
      allowNull: true,
      field: 'jvmNonHeapUsed'
    },
    // GC 次数
    jvmGcCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'jvmGcCount'
    },
    // GC 耗时（ms）
    jvmGcTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'jvmGcTime'
    },
    // 线程数
    jvmThreadCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'jvmThreadCount'
    },
    // 活跃线程数
    jvmThreadActive: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'jvmThreadActive'
    },
    // CPU 使用率（%）
    cpuUsage: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'cpuUsage'
    },
    // ========== 服务指标 ==========
    // 请求吞吐量（QPS）
    serviceQps: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'serviceQps'
    },
    // 平均响应时间（ms）
    serviceAvgResponseTime: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'serviceAvgResponseTime'
    },
    // 最大响应时间（ms）
    serviceMaxResponseTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'serviceMaxResponseTime'
    },
    // 成功率（%）
    serviceSuccessRate: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'serviceSuccessRate'
    },
    // 错误率（%）
    serviceErrorRate: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'serviceErrorRate'
    },
    // ========== 数据库指标 ==========
    // 数据库连接数
    dbConnections: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'dbConnections'
    },
    // 数据库活跃连接数
    dbActiveConnections: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'dbActiveConnections'
    },
    // 数据库查询QPS
    dbQps: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'dbQps'
    },
    // 数据库平均查询时间（ms）
    dbAvgQueryTime: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'dbAvgQueryTime'
    },
    // ========== 其他 ==========
    // 采集时间戳（毫秒）
    collectionTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'collectionTime'
    },
    // 完整的指标数据（JSON）
    metricsJson: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'metricsJson'
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
  // 排序规则（针对时序查询优化）
  orderBy: "ORDER BY (webMonitorId, service, metricType, metricName, happenDate)",
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

