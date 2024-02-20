const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'Message',
  structure: {
    // dataId
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 用户唯一标识
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
    },
    // 消息标题
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'title'
    },
    // 消息内容
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'content'
    },
    // 消息类型
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'type'
    },
    // 阅读状态
    isRead: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'isRead'
    },
    // 跳转连接
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'link'
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
  partition: "",
  // 排序规则
  orderBy: "ORDER BY (dataId)",
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