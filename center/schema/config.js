//delete//
const moment = require('moment');
//delete//
const Config = function (sequelize, DataTypes) {
  return sequelize.define('Config', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 配置名称
    configName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'configName'
    },
    // 配置的值
    configValue: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'configValue'
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
module.exports = Config
//exports//