const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointAlarm',
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
      allowNull: true,
      field: 'projectId'
    },
    // 创建人userID
    createManId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'createManId'
    },
    // 规则名称
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name'
    },
    // 查询频率
    frequency: {
      type: DataTypes.INT(32),
      allowNull: false,
      field: 'frequency'
    },
    // 查询频率单位 'hour' 'minute' 'seconds'
    frequencyUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'frequencyUnit'
    },
    // 规则描述
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    },
    // 静默时间 00:00-23:59,01:00-22:59
    silentTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'silentTime'
    },
    // 紧急程度 normal 一般，urgent 紧急，critical 严重
    urgency: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'urgency'
    },
    // 状态 1 正常，2 已禁用
    status: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'status'
    },
    // 阈值条件 大于等于 greaterThanAndEqual 、小于等于 lessThanAndEqual  demo: greaterThanAndEqual,1,1
    rule: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'rule',
    },
    // 警报内容
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'content',
    },
    // 创建人
    createBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'createBy'
    },
    // 修改人
    updateBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'updateBy'
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