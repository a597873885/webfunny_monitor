const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointProject',
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      // defaultValue: DataTypes.UUIDV4
    },
    // 项目ID event1001开始
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectId'
    },
     // 公司ID
     companyId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'companyId'
    },
    // 父id
    parentId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'parentId'
    },
    // 名称
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name'
    },
    // 级别:1-项目，2-分组，3-看板
    type: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'type'
    },
    // 查看者列表
    viewers: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'viewers'
    },
    // 环境变量
    env: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'env'
    },
    // 删除状态 0, 1代表删除状态
    delStatus: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'delStatus'
    },
    // 禁用时间
    forbiddenTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'forbiddenTime'
    },
    // 排序
    sort: {
      type: DataTypes.INT(16),
      allowNull: true,
      field: 'sort'
    },
    // 系统项目标识：1-是，0-否
    sysType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'sysType'
    },
    // 流量开关，0，开，1 关，关闭后，服务端将会拦截流量。 探针还会继续上报
    flowSwitch: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'flowSwitch'
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