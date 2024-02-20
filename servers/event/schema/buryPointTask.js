const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointTask',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 任务名称
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'taskName'
    },
    // 任务描述
    taskDes: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'taskDes'
    },
    // 所有点位信息；JSON字符串；包含点位，字段，点位说明，埋点代码等的JSON字符串
    taskPoint: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'taskPoint'
    },
    // 绑定项目ID
    projectId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'projectId'
    },
    // 任务状态： 10：草稿， 20：已发布（未完成）30：已发布（已完成）40：已结束（已完成）
    taskStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'taskStatus'
    },
    // 处理人userID
    handleManId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'handleManId'
    },
    // 创建人userID
    createManId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'createManId'
    },
    // 处理人
    handleManName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'handleManName'
    },
    // 创建人
    createManName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'createManName'
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