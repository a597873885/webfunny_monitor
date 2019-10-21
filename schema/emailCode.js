//delete//
const Utils = require('../util/utils');
//delete//
const EmailCode = function (sequelize, DataTypes) {
  return sequelize.define(Utils.setTableName('EmailCode'), {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 邮箱
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'email'
    },
    // 验证码
    emailCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'emailCode'
    },
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  })

}
//exports//
module.exports = EmailCode
//exports//