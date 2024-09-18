const moment = require('moment');
const AlarmRule = function (sequelize, DataTypes) {
  return sequelize.define('AlarmRule', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'companyId'
    },
    // 规则ID
    ruleId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'ruleId'
    },
    // 规则名称
    ruleName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'ruleName'
    },
    // 规则描述
    ruleDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ruleDesc'
    },
    // 处理建议
    suggestion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'suggestion'
    },
    // 告警内容
    alarmContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'alarmContent'
    },
    // 可见范围 (0: 仅管理员和自己, 1: 所有人)
    visibleRange: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'visibleRange'
    },
    // 告警级别 1: 低 2: 中 3: 高
    alarmLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'alarmLevel'
    },
    // 关联通知ID
    relatedNoticeId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'relatedNoticeId'
    },
    // 绑定的应用ID
    applicationId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'applicationId'
    },
    // 创建人userId
    createUser: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'createUser'
    },
    // 修改人(看最后修改人)
    processorId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'processorId'
    },
    // 启用状态 1: 已启用 0: 已停用
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status'
    },
    // 最后修改时间
    lastModified: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('lastModified')).format('YYYY-MM-DD HH:mm:ss');
      }
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
module.exports = AlarmRule
//exports//