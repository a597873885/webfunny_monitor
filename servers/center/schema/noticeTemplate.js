const moment = require('moment');
const NoticeTemplate = function (sequelize, DataTypes) {
  return sequelize.define('NoticeTemplate', {
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
    noticeTemplateId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'noticeTemplateId'
    },
    // 模板名称
    templateName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'templateName'
    },
    // 通知类型 1:告警触发 2:告警恢复
    noticeType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'noticeType'
    },
    // 最后修改
    lastModified: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('lastModified')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 修改人
    modifyPeopleId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'modifyPeopleId'
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
module.exports = NoticeTemplate
//exports//