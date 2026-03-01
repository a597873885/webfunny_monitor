//delete//
const moment = require('moment');
//delete//
const ReportTaskDetail = function (sequelize, DataTypes) {
  return sequelize.define('ReportTaskDetail', {
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
    // 模板ID
    templateId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'templateId'
    },
    // 'daily' = 1, 'weekly' = 2, 'monthly' = 3, 'custom' = 4
    frequency: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'frequency'
    },
    // 时间格式: HH:MM
    executionTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'executionTime'
    },
    // 时间格式: 1,2,3,4,5,6,7 (周一到周日)
    executionDays: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'executionDays'
    }, 
    //发送方式email, sms, webhook
    deliveryMethods: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'deliveryMethods'
    }, 
    // {"type":"robot","robotType":"weixin","webhook":"httppppasdfa:ssaa"}
    webhookType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webhookType'
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
module.exports = ReportTaskDetail
//exports//