const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')

/**
 * 用户表结构定义（动态创建，每个项目一个表）
 * 表名格式: {projectId}_users
 * 注意：移除了 projectId 字段，因为每个项目有独立的表
 */
const Columns = {
  // tableName 改为动态获取
  getTableName: (projectId) => `${projectId}_users`,
  structure: {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // weCustomerKey（用户唯一标识）
    weCustomerKey: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'weCustomerKey'
    },
    // 设备id
    weDeviceId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weDeviceId'
    },
    // 登录id
    weUserId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weUserId'
    },
    // 注册时间
    weSignUpTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weSignUpTime'
    },
    // 出生日期
    weBirthday: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weBirthday'
    },
    // 手机号
    wePhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'wePhone'
    },
    // email
    weEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weEmail'
    },
    // 性别
    weGender: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weGender'
    },
    // 地址
    weAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weAddress'
    },
    // 国家
    weCountry: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weCountry'
    },
    // 省份
    weProvince: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weProvince'
    },
    // 城市
    weCity: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weCity'
    },
    // 首次访问时间
    weFirstVisitTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstVisitTime'
    },
    // 首次前向地址
    weFirstAccessSource: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstAccessSource'
    },
    // 首次前向域名/首次流量来源类型
    weFirstAccessPage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstAccessPage'
    },
    // 首次使用的浏览器语言
    weFirstBrowserLanguage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstBrowserLanguage'
    },
    // 首次浏览器字符类型
    weFirstBrowserCharset: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstBrowserCharset'
    },
    // 首次搜索引擎的关键词
    weFirstSearchKeyword: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstSearchKeyword'
    },
    // 首次广告来源
    weFirstUtmSource: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstUtmSource'
    },
    // 首次广告媒介
    weFirstUtmMedium: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstUtmMedium'
    },
    // 首次广告名称
    weFirstUtmCampaign: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstUtmCampaign'
    },
    // 首次广告内容
    weFirstUtmContent: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstUtmContent'
    },
    // 首次广告关键词
    weFirstUtmTerm: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstUtmTerm'
    },
    // 首次流量来源
    weFirstTrafficSource: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'weFirstTrafficSource'
    },
    // 分群id数组
    segmentIds: {
      type: 'Array(String)',
      allowNull: true,
      field: 'segmentIds',
      defaultValue: []
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
    freezeTableName: true
  },
  engine: "ENGINE ReplacingMergeTree(updatedAt)",
  // 创建索引Sql
  indexSql: "",
  // 数据模型
  dataModel: "",
  // 指定分区Key（按月分区）
  partition: "PARTITION BY toYYYYMM(createdAt)",
  // 排序规则（只按 weCustomerKey，因为每个项目独立表）
  orderBy: "ORDER BY (weCustomerKey)",
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