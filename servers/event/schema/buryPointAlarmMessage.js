//delete//
const moment = require('moment');
//delete//

const BuryPointAlarmMessage = function (sequelize, DataTypes) {
  return sequelize.define('BuryPointAlarmMessage', {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'projectId'
    },
    // 页面ID
    pageId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'pageId'
    },
    // 告警id
    alarmId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'alarmId'
    },
    // 警告名称
    alarmName: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: 'alarmName'
    },
    // 警告内容
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'message'
    },
    // 警告级别 normal 一般，urgent 紧急，critical 严重
    urgency: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'urgency'
    },
    // 告警创建时间
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 通知人
    notifyUsers: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'notifyUsers'
    }
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
      {
        name: "idx_urgency",
        method: "BTREE",
        fields: [
          {
            attribute: "urgency"
          }
        ]
      },
      {
        name: "idx_alarmName",
        method: "BTREE",
        fields: [
          {
            attribute: "alarmName"
          }
        ]
      },
      {
        name: "idx_projectId",
        method: "BTREE",
        fields: [
          {
            attribute: "projectId"
          }
        ]
      },
    ]
  })

}
//exports//
module.exports = BuryPointAlarmMessage
//exports//