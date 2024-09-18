const moment = require('moment');
const AlarmItem = function (sequelize, DataTypes) {
  return sequelize.define('AlarmItem', {
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
    // 所属应用ID
    applicationId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'applicationId'
    },
    // 告警状态 1: 告警中, 2: 已恢复, 3: 已失效
    alarmStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'alarmStatus'
    },
    // 告警规则ID
    ruleId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'ruleId'
    },
    // 最近发生时间
    latestHappen: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('latestHappen')).format('YYYY-MM-DD HH:mm:ss');
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
module.exports = AlarmItem
//exports//