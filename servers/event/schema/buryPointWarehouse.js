const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointWarehouse',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 点位id
    pointId: {
      type: DataTypes.INT(64),
      allowNull: false,
      field: 'pointId'
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectId'
    },
    // 点位名称
    pointName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pointName'
    },
    // 通用标识：1-通用点位，0-项目点位，2-备用点位
    weType: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'weType'
    },
    //是否探针代码替换
    replacePointIdKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'replacePointIdKey'
    },
    // 所有字段
    fields: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'fields'
    },
    // 描述
    pointDesc: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pointDesc'
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
  },// 创建索引
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