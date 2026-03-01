
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'ResourcePerfInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId',
      fieldTitle: '分析数据id'
    },
    // 静态资源的请求路径
    sourceUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'sourceUrl',
      fieldTitle: '静态资源的请求路径'
    },
    // 静态资源的类型
    elementType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'elementType',
      fieldTitle: '静态资源的类型'
    },
    // 资源加载状态
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'status',
      fieldTitle: '资源加载状态'
    },
    // 加载耗时
    duration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'duration',
      fieldTitle: '加载耗时'
    },
    // 传输大小
    transferSize: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'transferSize',
      fieldTitle: '传输大小'
    },
    // 压缩前大小
    encodedBodySize: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'encodedBodySize',
      fieldTitle: '压缩前大小'
    },
    // 压缩后大小
    decodedBodySize: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'decodedBodySize',
      fieldTitle: '压缩后大小'
    },
    // 是否命中缓存
    isCache: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'isCache',
      fieldTitle: '是否命中缓存'
    },
    // 网络协议
    nextHopProtocol: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'nextHopProtocol',
      fieldTitle: '网络协议'
    },
    // 开始时间
    startTime: {
      type: DataTypes.INT(64),
      allowNull: true,
      field: 'startTime',
      fieldTitle: '开始时间'
    },
    // 重定向耗时
    redirectDuration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'redirectDuration',
      fieldTitle: '重定向耗时'
    },
    // DNS耗时
    dnsDuration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'dnsDuration',
      fieldTitle: 'DNS耗时'
    },
    // TCP耗时
    tcpDuration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'tcpDuration',
      fieldTitle: 'TCP耗时'
    },
    // SSL耗时
    sslDuration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'sslDuration',
      fieldTitle: 'SSL耗时'
    },
    // TTFB耗时
    ttfbDuration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'ttfbDuration',
      fieldTitle: 'TTFB耗时'
    },
    // 内容下载耗时
    contentDuration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'contentDuration',
      fieldTitle: '内容下载耗时'
    },
    // ServiceWorker耗时
    workerDuration: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'workerDuration',
      fieldTitle: 'ServiceWorker耗时'
    },
    // 页面标识ID
    pageKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pageKey',
      fieldTitle: '页面标识ID'
    },
    // 设备名称
    deviceName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceName',
      fieldTitle: '设备名称'
    },
    // 设备品牌
    deviceBrand: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceBrand',
      fieldTitle: '设备品牌'
    },
    // 分辨率
    deviceSize: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceSize',
      fieldTitle: '分辨率'
    },
    // 系统信息
    os: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'os',
      fieldTitle: '系统信息'
    },
    // 系统版本号
    osVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'osVersion',
      fieldTitle: '系统版本号'
    },
    // 浏览器名称
    browserName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserName',
      fieldTitle: '浏览器名称'
    },
    // 浏览器版本号
    browserVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserVersion',
      fieldTitle: '浏览器版本号'
    },
    // 浏览器信息
    browserInfo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'browserInfo',
      fieldTitle: '浏览器信息'
    },
    // 网络类型
    netType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'netType',
      fieldTitle: '网络类型'
    },
    // 来源页面
    referrer: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'referrer',
      fieldTitle: '来源页面'
    },
    // 用户的IP
    monitorIp: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'monitorIp',
      fieldTitle: '用户的IP'
    },
    // 国家
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'country',
      fieldTitle: '国家'
    },
    // 省份
    province: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'province',
      fieldTitle: '省份'
    },
    // 城市
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'city',
      fieldTitle: '城市'
    },
    // 运营商
    operators: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'operators',
      fieldTitle: '运营商'
    }
  },
  // 创建索引
  index: {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  },
  engine: "ENGINE MergeTree()",
  // 创建索引Sql
  indexSql: "",
  // 数据模型
  dataModel: "",
  // 指定分区Key
  partition: "PARTITION BY toYYYYMMDD(happenDate)",
  // 排序规则
  orderBy: "ORDER BY (happenDate, webMonitorId)",
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
