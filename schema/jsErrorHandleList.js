//delete//
const moment = require('moment');
const Utils = require('../util/utils');
//delete//
const IgnoreError = function (sequelize, DataTypes) {
  return sequelize.define('JsErrorHandleList', {
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
    // 报错信息
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'errorMessage'
    },
    // 处理状态：未解决，已解决，已忽略
    // 处理状态：unsolved, solved, ignored
    errorStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'errorStatus'
    },
    // 处理人：userId
    handleMan: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'handleMan'
    },
    // 处理开始时间
    handleStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'handleStartDate'
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
module.exports = IgnoreError
//exports//