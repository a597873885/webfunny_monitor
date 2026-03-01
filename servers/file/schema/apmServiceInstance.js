
const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'ApmServiceInstance',
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
    // 服务层级（NodeJS/Java/.NET等）
    layer: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'layer'
    },
    // 主机名
    hostname: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'hostname'
    },
    // IPv4地址
    ipv4: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ipv4'
    },
    // 进程号
    processNo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'processNo'
    },
    // 编程语言
    language: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'language'
    },
    // 首次上报时间
    firstSeen: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'firstSeen'
    },
    // 最后上报时间
    lastSeen: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'lastSeen'
    },
    // 完整的属性JSON
    propertiesJson: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'propertiesJson'
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
  // 指定分区Key（不按时间分区，因为实例信息变化不频繁）
  partition: "",
  // 排序规则
  orderBy: "ORDER BY (webMonitorId, service, serviceInstance)",
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

