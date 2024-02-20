
const { DataTypes } = require("../node_clickhouse/consts")
const Columns = {
  tableName: 'LogData',
  structure: {
    // 分析数据id
    dataId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'dataId'
    },
    // 发生时间字符串
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate'
    },
    // 项目ID
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectId'
    },
    // url 访问地址
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'url'
    },
    // 追踪id
    traceId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'traceId'
    },
    // 用户ID
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
    },
    // 标签信息
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tags'
    },
    // 其他信息
    others: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'others'
    },
    /**
     * 日志级别
     * all - 最低级
     * trace - 低级别
     * debug - 调试信息
     * info - 感兴趣的信息
     * warn - 警告信息，潜在的错误信息
     * error - 错误信息，虽然出错，但不影响运行
     * fatal - 严重错误，导致程序中断或者无法运行
     * off - 用于关闭所有日志记录
     */
    level: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'level'
    },
    // 日志缩略信息
    message: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'message'
    },
    // 日志内容
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'content'
    },
    // 用户的IP
    monitorIp: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'monitorIp'
    },
    // 国家
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'country'
    },
    // 省份
    province: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'province'
    },
    // 城市
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'city'
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
  partition: "PARTITION BY toYYYYMMDD(happenDate)",
  // 排序规则
  orderBy: "ORDER BY (happenDate)",
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