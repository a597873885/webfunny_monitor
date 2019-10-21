//delete//
const moment = require('moment');
//delete//
const Project = function (sequelize, DataTypes) {
  return sequelize.define('Project', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'webMonitorId'
    },
    // 项目类型
    projectType: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'projectType'
    },
    // 项目名称
    projectName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'projectName'
    },
    // 项目名称
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'email'
    },
    // 监控代码
    monitorCode: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'monitorCode'
    },
    // fetch代码
    fetchCode: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'fetchCode'
    },
    // 过滤域名
    filterDomain: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'filterDomain'
    },
    // 过滤类型（包含，不包含）
    filterType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'filterType'
    },
    // 是否记录
    recording: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'recording'
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