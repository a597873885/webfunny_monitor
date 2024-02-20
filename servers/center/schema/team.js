//delete//
const moment = require('moment');
//delete//
const Project = function (sequelize, DataTypes) {
  return sequelize.define('Team', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'companyId'
    },// 团队名称
    teamName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'teamName'
    },
    // 团队成员
    members: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'members'
    },

    // 团队LeaderId
    leaderId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'leaderId'
    },
    // 项目ID
    webMonitorIds: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'webMonitorIds'
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
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  })

}
//exports//
module.exports = Project
//exports//