
const { DataTypes } = require("../node_clickhouse/consts")
const Columns = {
  tableName: 'LocalLog',
  structure: {
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId',
      fieldTitle: '分析数据id'
    },    
    // 应用ID
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId',
      fieldTitle: '应用ID'
    }, 
    // 用户ID
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId',
      fieldTitle: '用户ID'
    },
    // 内置ID
    customerKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKey',
      fieldTitle: '内置ID'
    },
    // 日志类型
    uploadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadType',
      fieldTitle: '日志类型'
    },
    // 完整URL
    completeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'completeUrl',
      fieldTitle: '完整URL'
    },
    // 简单URL
    simpleUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleUrl',
      fieldTitle: '简单URL'
    },
    // 日志内容
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'content',
      fieldTitle: '日志内容'
    },
    // 发生时间戳
    happenTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'happenTime',
      fieldTitle: '发生时间戳'
    },
    // 发生时间
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate',
      fieldTitle: '发生时间'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE_TIME,
      field: "createdAt",
      fieldTitle: '创建时间',
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE_TIME,
      field: "updatedAt",
      fieldTitle: '更新时间',
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
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