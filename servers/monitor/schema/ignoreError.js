//delete//
const moment = require('moment');
const Utils = require('../util/utils');
//delete//
const IgnoreError = function (sequelize, DataTypes) {
  return sequelize.define('IgnoreError', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 需要忽略的JS报错信息
    ignoreErrorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ignoreErrorMessage'
    },
    // 类型，区分已解决问题和已忽略问题
    type: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'type'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'webMonitorId'
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