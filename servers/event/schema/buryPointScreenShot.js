const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointScreenShot',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 操作人
    operator: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'operator'
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'projectId'
    },
    // 页面标题
    pageTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pageTitle'
    },
    // 页面完整地址
    completeUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'completeUrl'
    },
    // 页面简单地址
    simpleUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'simpleUrl'
    },
    // 页面尺寸
    pageSize: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pageSize'
    },
    // 截屏信息
    screenInfo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'screenInfo'
    },
    // 图片类型
    imgType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'imgType'
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
  orderBy: "ORDER BY (createdAt)",
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