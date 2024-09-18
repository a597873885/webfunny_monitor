const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointVisualTracking',
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
    // 圈选创建人ID
    bindUserId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'bindUserId'
    },
    // 圈选创建人
    bindBy: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'bindBy'
    },
    // 点位名称
    pointName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pointName'
    },
    // 点位ID
    pointId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pointId'
    },
    // 事件类型 click exposure
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'eventType'
    },
    // 曝光点位key     "ExposureEventPointId",  点击点位key  "ClickEventPointId",
    replacePointIdKey: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'replacePointIdKey'
    },
    // 页面类型类型 current all
    happenPage: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'happenPage'
    },
    // 圈选元素xphtn  
    xPath: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'xPath'
    },
    // 圈选元素页面路径 
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'path'
    },
    // 页面标题  
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'title'
    },
    // 圈选元素截图
    elementIcon: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'elementIcon'
    },
    // 启用字段标识：1-是，0-否
    enableFlag: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'enableFlag'
    },
    // 点位所属人名称
    ownerName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ownerName'
    },
    // 点位所属人UserId
    ownerUserId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ownerUserId'
    },
    // 操作人昵称
    operateBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'operateBy'
    },
    // 操作人UserId
    operateUserId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'operateUserId'
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