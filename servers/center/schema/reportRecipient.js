//delete//
const moment = require('moment');
//delete//
const ReportRecipients = function (sequelize, DataTypes) {
  return sequelize.define('ReportRecipients', {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey:true,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 任务ID
    taskId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'taskId'
    }, 
    //通知人：多个用逗号隔开
    noticePeopleId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'noticePeopleId'
    },    
    //通知团队id：多个用逗号隔开
    noticeTeamId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'noticeTeamId'
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
module.exports = ReportRecipients
//exports//