const { DataTypes } = require("../node_clickhouse/consts")
const moment = require("moment")
const Columns = {
  tableName: "BuryPointEventStream",
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "id"
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "projectId"
    },
    // 上报点位
    pointId: {
      type: DataTypes.INT(64),
      allowNull: false,
      field: "pointId"
    },
    // 内置用户ID
    weCustomerKey: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "weCustomerKey"
    },
    // 业务用户ID
    weUserId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "weUserId"
    },
    // 事件发生时间
    happenTime: {
      type: DataTypes.DATE_TIME,
      allowNull: false,
      field: "happenTime"
    },
    // 事件属性JSON（点位/通用/用户属性快照，用于路径分析筛选）
    eventData: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "eventData"
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE_TIME,
      field: "createdAt",
      get() {
        return moment().format("YYYY-MM-DD HH:mm:ss");
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE_TIME,
      field: "updatedAt",
      get() {
        return moment().format("YYYY-MM-DD HH:mm:ss");
      }
    }
  },
  // 创建索引
  index: {
    freezeTableName: true
  },
  engine: "ENGINE MergeTree()",
  // 创建索引Sql
  indexSql: "",
  // 数据模型
  dataModel: "",
  // 指定分区Key
  partition: "PARTITION BY toYYYYMMDD(createdAt)",
  // 排序规则 - 核心：按用户+时间排序让行为序列变成顺序扫描
  orderBy: "ORDER BY (projectId, weCustomerKey, happenTime)",
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