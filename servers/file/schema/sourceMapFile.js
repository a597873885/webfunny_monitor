/**
 * SourceMap 文件存储表
 */

const { DataTypes } = require("../node_clickhouse/consts")
const moment = require('moment')

const Columns = {
  tableName: 'SourceMapFile',
  structure: {
    // 文件ID
    id: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'id'
    },
    // 项目ID
    project_id: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'project_id'
    },
    // 项目名称
    project_name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'project_name'
    },
    // 文件名称
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_name'
    },
    // 版本号
    release: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'release'
    },
    // 文件内容（Gzip压缩后的Base64）
    file_content: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_content'
    },
    // 原始文件大小（字节）
    file_size: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'file_size'
    },
    // 压缩后大小（字节）
    compressed_size: {
      type: DataTypes.INT(32),
      allowNull: true,
      field: 'compressed_size'
    },
    // URL前缀（用于匹配错误堆栈）
    url_prefix: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'url_prefix'
    },
    // 上传时间
    upload_time: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: "upload_time"
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: "createdAt"
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: "updatedAt"
    }
  },
  // 创建索引
  index: {
    freezeTableName: true
  },
  // 存储引擎
  engine: "ENGINE MergeTree()",
  // 创建索引SQL
  indexSql: "",
  // 数据模型
  dataModel: "",
  // 指定分区Key（按月分区）
  partition: "PARTITION BY toYYYYMM(createdAt)",
  // 排序规则（按项目ID + 版本号 + 文件名排序）
  orderBy: "ORDER BY (project_id, release, file_name, createdAt)",
  // 设置表属性
  properties: "SETTINGS index_granularity = 8192"
}

const DefineTable = function (sequelize) {
  return sequelize.define(Columns.tableName, Columns.structure, Columns.index)
}

module.exports = {
  Columns,
  DefineTable
}
