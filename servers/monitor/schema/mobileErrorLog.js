/**
 * 移动端错误监控数据表
 * 存储：JS 错误(JS_ERROR)、应用崩溃(APP_CRASH)、ANR(ANR)
 * 支持平台：HarmonyOS / Android / iOS
 */

const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')

const Columns = {
  tableName: 'MobileErrorLog',
  structure: {
    ...BaseInfoSchema(DataTypes),
    
    // ===== 数据标识 =====
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId',
      fieldTitle: '分析数据id'
    },
    
    // ===== 设备信息 =====
    // 设备型号
    deviceName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceName',
      fieldTitle: '设备型号'
    },
    // 设备品牌
    deviceBrand: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceBrand',
      fieldTitle: '设备品牌'
    },
    // 操作系统
    os: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'os',
      fieldTitle: '操作系统'
    },
    // 操作系统版本
    osVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'osVersion',
      fieldTitle: '操作系统版本'
    },
    // 平台类型: harmonyos / android / ios
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'platform',
      fieldTitle: '平台类型: harmonyos / android / ios'
    },
    // App 版本
    appVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'appVersion',
      fieldTitle: 'App 版本'
    },
    // 网络类型
    networkType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'networkType',
      fieldTitle: '网络类型'
    },
    
    // ===== 页面信息 =====
    // 页面路径
    pagePath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pagePath',
      fieldTitle: '页面路径'
    },
    
    // ===== 错误基本信息 =====
    // 错误子类型 (如: NullPointerException, ArrayIndexOutOfBoundsException)
    errorType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorType',
      fieldTitle: '错误子类型 (如: NullPointerException, ArrayIndexOutOfBoundsException)'
    },
    // 信息类型: on_error / console_error
    infoType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'infoType',
      fieldTitle: '信息类型: on_error / console_error'
    },
    // 简易错误信息
    simpleErrorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleErrorMessage',
      fieldTitle: '简易错误信息'
    },
    // 错误信息 (Base64)
    errorMessage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorMessage',
      fieldTitle: '错误信息 (Base64)'
    },
    // 错误堆栈 (Base64)
    errorStack: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'errorStack',
      fieldTitle: '错误堆栈 (Base64)'
    },
    
    // ===== 崩溃相关 (APP_CRASH) =====
    // 崩溃原因
    crashReason: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'crashReason',
      fieldTitle: '崩溃原因'
    },
    // 崩溃线程名称
    crashThread: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'crashThread',
      fieldTitle: '崩溃线程名称'
    },
    // 是否前台崩溃
    isForeground: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'isForeground',
      fieldTitle: '是否前台崩溃'
    },
    // 崩溃时内存占用(MB)
    crashMemory: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'crashMemory',
      fieldTitle: '崩溃时内存占用(MB)'
    },
    // 崩溃时 CPU 使用率
    crashCpuUsage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'crashCpuUsage',
      fieldTitle: '崩溃时 CPU 使用率'
    },
    
    // ===== ANR 相关 =====
    // 主线程阻塞时长(ms)
    blockTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'blockTime',
      fieldTitle: '主线程阻塞时长(ms)'
    },
    // 阻塞方法
    blockingMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'blockingMethod',
      fieldTitle: '阻塞方法'
    },
    // CPU 使用率
    cpuUsage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cpuUsage',
      fieldTitle: 'CPU 使用率'
    },
    // 主线程堆栈
    mainThreadStack: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'mainThreadStack',
      fieldTitle: '主线程堆栈'
    },
    
    // ===== 内存相关 =====
    // 发生时内存占用(MB)
    memoryUsed: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'memoryUsed',
      fieldTitle: '发生时内存占用(MB)'
    },
    // 可用内存(MB)
    memoryAvailable: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'memoryAvailable',
      fieldTitle: '可用内存(MB)'
    },
    
    // ===== 地理位置 (服务端填充) =====
    monitorIp: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'monitorIp',
      fieldTitle: '用户的IP'
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'country',
      fieldTitle: '国家'
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'province',
      fieldTitle: '省份'
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'city',
      fieldTitle: '城市'
    }
  },
  
  index: {
    freezeTableName: true
  },
  engine: "ENGINE MergeTree()",
  indexSql: "",
  dataModel: "",
  partition: "PARTITION BY toYYYYMMDD(happenDate)",
  orderBy: "ORDER BY (happenDate, webMonitorId, uploadType)",
  properties: ""
}

const DefineTable = function (sequelize) {
  return sequelize.define(Columns.tableName, Columns.structure, Columns.index)
}

module.exports = {
  Columns,
  DefineTable
}

