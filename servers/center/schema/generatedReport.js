//delete//
const moment = require('moment');
//delete//
const GeneratedReports = function (sequelize, DataTypes) {
  return sequelize.define('GeneratedReports', {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 任务ID - 关联ReportTasks表
    taskId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'taskId'
    },
    // 报表名称（规则：任务名称+模板名称+年月日）
    reportName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'reportName'
    },
    // 生成状态：generating=生成中, success=生成成功, failed=生成失败
    generateStatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'generating',
      field: 'generateStatus'
    },
    // 生成时间
    generateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'generateTime'
    },
    // 报表状态：notexpired=未过期, expired=已过期, deleted=已删除
    reportStatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'notexpired',
      field: 'reportStatus'
    },
    //数据保存时间（天数）
    dataRetentionDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      field: 'dataRetentionDays'
    },
    // 查看链接
    viewLink: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'viewLink'
    },
    // 报表文件路径
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'filePath'
    },
    // 执行时长（秒）
    executionDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'executionDuration'
    },
    dataPeriod: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dataPeriod'
    },
    sendDate: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'sendDate'
    },
    // 错误信息
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'errorMessage'
    },
    // 报表分析数据（JSON格式）
    analyzeJSONData: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'analyzeJSONData',
      comment: '报表分析数据，JSON格式存储各种统计图表数据'
    },
    //卡片列表(JSON字符串格式，对象数组形式)
    cardList: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cardList',
      comment: '报表分析数据，新的'
    },
    // 创建人
    createBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'createBy'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  })
}
//exports//
module.exports = GeneratedReports
//exports//