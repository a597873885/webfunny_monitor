/**
 * 移动端性能监控数据表
 * 存储：应用启动(APP_START)、页面加载(PAGE_LOAD)、网络请求(HTTP_LOG)
 * 支持平台：HarmonyOS / Android / iOS
 */

const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')

const Columns = {
  tableName: 'MobilePerformanceLog',
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
    // 设备型号 (如: iPhone 15 Pro, HUAWEI Mate 60)
    deviceName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceName',
      fieldTitle: '设备型号 (如: iPhone 15 Pro, HUAWEI Mate 60)'
    },
    // 设备品牌
    deviceBrand: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceBrand',
      fieldTitle: '设备品牌'
    },
    // 屏幕分辨率
    deviceSize: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceSize',
      fieldTitle: '屏幕分辨率'
    },
    // 操作系统 (如: HarmonyOS 4.0, Android 14, iOS 17.1)
    os: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'os',
      fieldTitle: '操作系统 (如: HarmonyOS 4.0, Android 14, iOS 17.1)'
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
    // 网络类型: wifi / 4g / 5g / unknown
    networkType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'networkType',
      fieldTitle: '网络类型: wifi / 4g / 5g / unknown'
    },
    
    // ===== 页面信息 =====
    // 页面路径
    pagePath: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pagePath',
      fieldTitle: '页面路径'
    },
    
    // ===== 通用性能字段 =====
    // 总耗时(ms)
    totalDuration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'totalDuration',
      fieldTitle: '总耗时(ms)'
    },
    // 耗时秒数（向上取整，用于分组统计）
    durationSecond: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'durationSecond',
      fieldTitle: '耗时秒数（向上取整，用于分组统计）'
    },
    // HTTP 状态码 (仅 HTTP_LOG)
    status: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'status',
      fieldTitle: 'HTTP 状态码 (仅 HTTP_LOG)'
    },
    
    // ===== 应用启动相关 (APP_START) =====
    // 启动类型: cold(冷启动) / warm(温启动) / hot(热启动)
    startType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'startType',
      fieldTitle: '启动类型: cold(冷启动) / warm(温启动) / hot(热启动)'
    },
    // 进程启动时间(ms)
    processStartTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'processStartTime',
      fieldTitle: '进程启动时间(ms)'
    },
    // Application 初始化耗时(ms)
    applicationInitTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'applicationInitTime',
      fieldTitle: 'Application 初始化耗时(ms)'
    },
    // 闪屏页耗时(ms)
    splashScreenTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'splashScreenTime',
      fieldTitle: '闪屏页耗时(ms)'
    },
    // 主页面创建耗时(ms)
    mainPageCreateTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'mainPageCreateTime',
      fieldTitle: '主页面创建耗时(ms)'
    },
    // 首帧渲染耗时(ms)
    firstFrameRenderTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'firstFrameRenderTime',
      fieldTitle: '首帧渲染耗时(ms)'
    },
    
    // ===== 页面加载相关 (PAGE_LOAD) =====
    // 加载类型: initial(首次加载) / navigation(页面跳转) / back(返回)
    loadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'loadType',
      fieldTitle: '加载类型: initial(首次加载) / navigation(页面跳转) / back(返回)'
    },
    // 首次渲染耗时(ms)
    firstRenderTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'firstRenderTime',
      fieldTitle: '首次渲染耗时(ms)'
    },
    // onCreate 耗时(ms)
    onCreateTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'onCreateTime',
      fieldTitle: 'onCreate 耗时(ms)'
    },
    // 数据获取耗时(ms)
    dataFetchTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'dataFetchTime',
      fieldTitle: '数据获取耗时(ms)'
    },
    // 视图构建耗时(ms)
    viewBuildTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'viewBuildTime',
      fieldTitle: '视图构建耗时(ms)'
    },
    // 渲染耗时(ms)
    renderTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'renderTime',
      fieldTitle: '渲染耗时(ms)'
    },
    
    // ===== 流畅度相关 =====
    // 平均 FPS
    avgFPS: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'avgFPS',
      fieldTitle: '平均 FPS'
    },
    // 卡顿次数
    jankCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'jankCount',
      fieldTitle: '卡顿次数'
    },
    // 严重卡顿次数
    severeJankCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'severeJankCount',
      fieldTitle: '严重卡顿次数'
    },
    
    // ===== 内存相关 =====
    // 当前内存占用(MB)
    memoryUsed: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'memoryUsed',
      fieldTitle: '当前内存占用(MB)'
    },
    // 内存峰值(MB)
    memoryPeak: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'memoryPeak',
      fieldTitle: '内存峰值(MB)'
    },
    // 页面进入时内存(MB)
    memoryBefore: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'memoryBefore',
      fieldTitle: '页面进入时内存(MB)'
    },
    // 页面退出时内存(MB)
    memoryAfter: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'memoryAfter',
      fieldTitle: '页面退出时内存(MB)'
    },
    
    // ===== 网络请求相关 (HTTP_LOG) =====
    // 请求方法
    method: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'method',
      fieldTitle: '请求方法'
    },
    // 请求 URL
    httpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'httpUrl',
      fieldTitle: '请求 URL'
    },
    // 简化 URL
    simpleHttpUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleHttpUrl',
      fieldTitle: '简化 URL'
    },
    // 请求耗时(ms)
    loadTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'loadTime',
      fieldTitle: '请求耗时(ms)'
    },
    // DNS 耗时(ms)
    dnsTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'dnsTime',
      fieldTitle: 'DNS 耗时(ms)'
    },
    // TCP 连接耗时(ms)
    tcpTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'tcpTime',
      fieldTitle: 'TCP 连接耗时(ms)'
    },
    // SSL 握手耗时(ms)
    sslTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'sslTime',
      fieldTitle: 'SSL 握手耗时(ms)'
    },
    // 首字节时间(ms) - TTFB
    ttfbTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'ttfbTime',
      fieldTitle: '首字节时间(ms) - TTFB'
    },
    // 下载耗时(ms)
    downloadTime: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'downloadTime',
      fieldTitle: '下载耗时(ms)'
    },
    // 请求大小(bytes)
    requestSize: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'requestSize',
      fieldTitle: '请求大小(bytes)'
    },
    // 响应大小(bytes)
    responseSize: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'responseSize',
      fieldTitle: '响应大小(bytes)'
    },
    // 是否超时
    isTimeout: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'isTimeout',
      fieldTitle: '是否超时'
    },
    // 状态描述
    statusText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'statusText',
      fieldTitle: '状态描述'
    },
    // 状态结果: request / response
    statusResult: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'statusResult',
      fieldTitle: '状态结果: request / response'
    },
    // TraceId (用于链路追踪)
    traceId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'traceId',
      fieldTitle: 'TraceId (用于链路追踪)'
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

