const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointCircleSelect',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'projectId'
    },
    // 绑定userId
    bindUserId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'bindUserId'
    },
    // 绑定人
    bindBy: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'bindBy'
    },
    // 圈选时效:3，单位小时
    circleSelectionTime: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'circleSelectionTime'
    },
    // 启用字段标识：1-是，0-否
    enableFlag: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'enableFlag'
    },
    // 截止有效时间
    deadlineValidTime: {
      type: DataTypes.DATE_TIME,
      field: 'deadlineValidTime',
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 创建人昵称
    createBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'createBy'
    },
    // 创建人Id
    createUserId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'createUserId'
    },
    // 修改人昵称
    updateBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'updateBy'
    },
    // 修改人ID
    updateUserId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'updateUserId'
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