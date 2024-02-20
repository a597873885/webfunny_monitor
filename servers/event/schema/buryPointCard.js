const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'BuryPointCard',
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
    // 页面id
    pageId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'pageId'
    },
    // 名称
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name'
    },
    // 级别：卡片类型：1-柱状图，2-多折线，3-柱线图，4-堆叠图，5-漏斗图
    type: {
      type: DataTypes.INT(8),
      allowNull: false,
      field: 'type'
    },
    // 计算规则
    calcRule: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'calcRule'
    },
    // 排序
    sort: {
      type: DataTypes.INT(16),
      allowNull: true,
      field: 'sort'
    },
    // 卡片排序，和尺寸信息
    dataGrid: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dataGrid'
    },
    // 转化周期：默认是1 
    conversionCycle: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'conversionCycle'
    },
    // 是否归类：0-否，1-是
    groupByFlag: {
     type: DataTypes.INT(8),
     allowNull: true,
     field: 'groupByFlag'
   },
   //图还是表展示
   chartTableShow: {
     type: DataTypes.STRING,
     allowNull: true,
     field: 'chartTableShow'
   },
   //同时显示=合计、均值、同比、环比
   togetherList: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'togetherList'
   },
   //卡片调用刷新接口频率
   refreshFrequency: {
    type: DataTypes.INT(16),
    allowNull: true,
    field: 'refreshFrequency'
   },
   //警报通知人列表
   alarmMembers: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'alarmMembers'
   },
   //通知方式
   noticeWay: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'noticeWay'
   },
   //报警标识：1-报警，0-不报警
   alarmStatus: {
    type: DataTypes.INT(8),
    allowNull: true,
    field: 'alarmStatus'
   },
   //卡片描述
   describe: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'describe'
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