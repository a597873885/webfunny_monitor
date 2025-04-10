const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointUserBehaviorRelation',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id'
      // defaultValue: DataTypes.UUIDV4
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectId'
    },
    // 上报点位
    pointId: {
      type: DataTypes.INT(64),
      allowNull: false,
      field: 'pointId'
    },
    // 来源点位
    weRelationPointId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'weRelationPointId'
    },
     // 来源点位统计
     weRelationPointCount: {
      type: DataTypes.INT(64),
      allowNull: false,
      field: 'weRelationPointCount'
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
  engine: "ENGINE SummingMergeTree((weRelationPointCount))",
  // 创建索引Sql
  indexSql: "",
  // 数据模型
  dataModel: "",
  // 指定分区Key
  partition: "PARTITION BY toYYYYMMDD(createdAt)",
  // 排序规则
  orderBy: "ORDER BY (pointId,weRelationPointId)",
  // 设置表属性
  // properties: "SUMMING COLUMN(sourcePointCount)"
}
const DefineTable = function (sequelize) {
  return sequelize.define(Columns.tableName, Columns.structure, Columns.index)
}

module.exports = {
  Columns,
  DefineTable
}