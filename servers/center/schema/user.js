//delete//
const moment = require('moment');
//delete//
const User = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'companyId'
    },
    // 用户唯一标识
    userId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'userId'
    },
    // 用户类型（权限控制） super 超级管理员
    userType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'userType'
    },
    // 手机号
    phone: {
      type: DataTypes.STRING(11),
      allowNull: true,
      field: 'phone'
    },
    // 登录名
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'nickname'
    },
    // 邮箱即登录名，用户登录，接收警报信息的
    emailName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'emailName'
    },
    // 登录密码
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'password'
    },
    // 头像
    avatar: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'avatar'
    },
    // 人员分组的ID，权限控制
    groupId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'groupId'
    },
    // 注册状态 0 / 1
    registerStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'registerStatus'
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
module.exports = User
//exports//