const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointSegmentRule',
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
    // 名称
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name'
    },
    // 显示名称
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'displayName'
    },
    // 1-导入进来的，0-自然上报
    type: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'type'
    },
    // 创建方式：1-规则创建，2-导入创建，3-保存分群
    createMethod: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'createMethod',
      defaultValue: 1
      },
    // 创建规则来源：1-规则创建，2-卡片列表，3-点位细查，4-用户列表
    createSourceType: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'createSourceType',
      defaultValue: 1
    },
    // 计算规则
    calcRule: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'calcRule'
    },
    // 备注
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'remark'
    },
    //创建人id
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
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
    },
    // 数据更新时间（用于记录分群数据的最后更新时间）
    dataUpdatedAt: {
      type: DataTypes.DATE_TIME,
      field: "dataUpdatedAt",
      allowNull: true,
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