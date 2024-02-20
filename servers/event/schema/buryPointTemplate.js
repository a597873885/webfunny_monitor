const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointTemplate',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 用户id
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectId'
    },
    // 模板名称
    templateName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'templateName'
    },
    // 模板类型：1-我的模板，2-公共模板，3-系统模板
    type: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'type'
    },
    // 系统模板KEY
    weKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weKey'
    },
    // 分组个数
    groupCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'groupCount'
    },
    // 看板个数
    pageCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'pageCount'
    },
    // 卡片个数
    cardCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'cardCount'
    },
    // 详情JSON
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'detail'
    },
    // 点位信息
    templatePoint: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'templatePoint'
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