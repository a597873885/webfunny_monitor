const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'User',
  structure: {
    // 数据ID
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
    // 用户类型（权限控制） super 超级管理员
    userType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userType'
    },
    // 手机号
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'phone'
    },
    // 登录名
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'nickname'
    },
    // 邮箱即登录名，用户登录，接收警报信息的
    emailName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'emailName'
    },
    // 登录密码
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'password'
    },
    // 头像
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'avatar'
    },
    // 人员分组的ID，权限控制
    groupId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'groupId'
    },
    // 注册状态 0 / 1
    registerStatus: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'registerStatus'
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