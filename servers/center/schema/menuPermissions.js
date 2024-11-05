const moment = require('moment');
const MenuPermissions = function (sequelize, DataTypes) {
  return sequelize.define('MenuPermissions', {
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
    // 团队ID
    teamId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'teamId'
    },
    // userId
    userId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'userId'
    },
    // 监控菜单权限，逗号分隔
    monitorMenu: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'monitorMenu'
    },
    // 埋点菜单权限，逗号分隔
    eventMenu: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'eventMenu'
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
module.exports = MenuPermissions
//exports//