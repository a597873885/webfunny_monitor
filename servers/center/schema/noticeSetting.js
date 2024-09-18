const moment = require('moment');
const NoticeSetting = function (sequelize, DataTypes) {
  return sequelize.define('NoticeSetting', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    noticeSettingId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'noticeSettingId'
    },
    // 通知人ID
    noticePeopleId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'noticePeopleId'
    },
    // 通知团队ID
    noticeTeamId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'noticeTeamId'
    },
    // 推送渠道
    channel: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'channel'
    },
    // 通知周期
    cycle: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'cycle'
    },
    // 静默时间
    slienceTime: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'slienceTime'
    },
    // 关联的通知模板
    noticeTemplateId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'noticeTemplateId'
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
module.exports = NoticeSetting
//exports//