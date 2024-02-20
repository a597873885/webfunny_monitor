const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointSdkRelease',
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
    // 名称
    releaseName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'releaseName'
    },
    // 上报域名
    uploadDomain: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadDomain'
    },
    // 所有点位id
    pointIds: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pointIds'
    },
     // 状态
     status: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'status'
    },
    // 发布脚本
    releaseScript: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'releaseScript'
    },
    // 版本号
    version: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'version'
    },
    // 描述
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'desc'
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