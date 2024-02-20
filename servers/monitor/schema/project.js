const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')
const Columns = {
  tableName: 'Project',
  structure: {
    // 数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'dataId'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId'
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'companyId'
    },
    // 项目类型
    projectType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectType'
    },
    // 项目名称
    projectName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectName'
    },
    // userId
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
    },
    // userTag，每个userTag以,分隔
    userTag: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userTag'
    },
    // userIdType，用来计算UV信息的字段
    userIdType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userIdType'
    },
    // 关联警报ID
    alarmRuleId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alarmRuleId'
    },
    // 通知人员
    alarmMembers: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alarmMembers'
    },
    // webHook配置
    chooseHook: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'chooseHook'
    },
    // 邮箱
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'email'
    },
    // 启动列表
    startList: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'startList'
    },
    // 查看者列表
    viewers: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'viewers'
    },
    // 流量开关，0，开，1 关，关闭后，服务端将会拦截流量。 探针还会继续上报
    flowSwitch: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'flowSwitch'
    },
    // 监控代码
    monitorCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'monitorCode'
    },
    // 监控代码(fetch)
    monitorFetchCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'monitorFetchCode'
    },
    // fetch代码
    fetchCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'fetchCode'
    },
    // 上报域名
    uploadDomain: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadDomain'
    },
    // 过滤域名
    filterDomain: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'filterDomain'
    },
    // 过滤类型（包含，不包含）
    filterType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'filterType'
    },
    // 是否记录
    recording: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'recording'
    },
    // 页面是否聚合
    pageAggregation: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'pageAggregation'
    },
    // 接口是否聚合
    httpAggregation: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'httpAggregation'
    },
    // 采样率
    samplingRate: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'samplingRate'
    },
    // 采样率生效周期
    samplingCircle: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'samplingCircle'
    },
    // 监控配置项
    recordConfig: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'recordConfig'
    },
    // 是否绑定traceId
    hasTrace: {
      type: DataTypes.INT(8),
      allowNull: true,
      field: 'hasTrace'
    },
    // 环境变量
    env: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'env'
    },
    // 删除状态 0, 1代表删除状态
    delStatus: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'delStatus'
    },
    // 禁用时间
    forbiddenTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'forbiddenTime'
    },
    // 健康分
    healthScore: {
      type: DataTypes.FLOAT(32),
      allowNull: true,
      field: 'healthScore'
    },
    // 活跃人数
    aliveCount: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'aliveCount'
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
  orderBy: "ORDER BY (webMonitorId)",
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