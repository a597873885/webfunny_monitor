
const { DataTypes } = require("../node_clickhouse/consts")
const Columns = {
  tableName: 'LocalLog',
  structure: {
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },    
    // 应用ID
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId'
    }, 
    // 用户ID
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
    },
    // 内置ID
    customerKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKey'
    },
    // 日志类型
    uploadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadType'
    },
    // 完整URL
    completeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'completeUrl'
    },
    // 简单URL
    simpleUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'simpleUrl'
    },
    // 日志内容
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'content'
    },
    // 发生时间戳
    happenTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'happenTime'
    },
    // 发生时间
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate'
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