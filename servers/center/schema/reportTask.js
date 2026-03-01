//delete//
const moment = require('moment');
//delete//
const ReportTasks = function (sequelize, DataTypes) {
  return sequelize.define('ReportTasks', {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey:true,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'companyId'
    },
    // 任务名称
    name: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'name'
    },
    // 描述
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    },
    //最后发送时间
    lastExecution: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'lastExecution'
    },    
    // 
    nextExecution: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'nextExecution'
    },
  // 'active' = 1, 'paused' = 2, 'deleted' = 3
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      field: 'status'
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
module.exports = ReportTasks
//exports//