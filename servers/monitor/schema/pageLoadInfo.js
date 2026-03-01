
const { DataTypes } = require("../node_clickhouse/consts")
const BaseInfoSchema = require('./baseInfo')
const Columns = {
  tableName: 'PageLoadInfo',
  structure: {
    ...BaseInfoSchema(DataTypes),
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId',
      fieldTitle: '数据ID'
    },
    // 页面标识ID
    pageKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pageKey',
      fieldTitle: '页面标识ID'
    },
    // 加载类型
    loadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'loadType',
      fieldTitle: '加载类型'
    },
    // h5: 首字节 // 小程序：首次渲染
    firstByte: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'firstByte',
      fieldTitle: '首字节时间'  
    },
    //页面dom准备好的时间
    domReady: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'domReady',
      fieldTitle: 'DOM准备时间'
    },
    //页面完全加载时间
    pageCompleteLoaded: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'pageCompleteLoaded',
      fieldTitle: '页面完全加载时间'
    },
    // dns解析时间
    dns: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'dns',
      fieldTitle: 'DNS解析时间'
    },
    // tcp连接时间
    tcp: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'tcp',
      fieldTitle: 'TCP连接时间'
    },
    // ssl握手时间
    ssl: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'ssl',
      fieldTitle: 'SSL握手时间'
    },
    // 服务器响应时间 
    response: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'response',
      fieldTitle: '服务器响应时间'
    },
    // 通信传输时间
    conTrans: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'conTrans',
      fieldTitle: '通信传输时间'
    },
    // dom分析时间
    domAnalysis: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'domAnalysis',
      fieldTitle: 'DOM分析时间'
    },
    // 资源加载时间
    resourceLoaded: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'resourceLoaded',
      fieldTitle: '资源加载时间'
    },
    // 页面打开的秒数（整数）
    openSecond: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'openSecond',
      fieldTitle: '页面打开的秒数（整数）'
    },
    // 网络速度评估
    effectiveType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'effectiveType',
      fieldTitle: '网络速度评估'
    },
    // 页面DOM节点数量
    domCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'domCount',
      fieldTitle: '页面DOM节点数量'
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
    // 操作系统
    os: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'os',
      fieldTitle: '操作系统'
    },
    // 系统版本号
    osVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'osVersion',
      fieldTitle: '系统版本号'
    },
    // 设备品牌
    deviceBrand: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deviceBrand',
      fieldTitle: '设备品牌'
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
  orderBy: "ORDER BY (happenDate)",
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