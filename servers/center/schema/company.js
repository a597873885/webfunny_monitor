//delete//
const moment = require('moment');
//delete//
const Company = function (sequelize, DataTypes) {
  return sequelize.define('Company', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 公司所属人ID
    ownerId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'ownerId'
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'companyId'
    },
    // 公司名称
    companyName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'companyName'
    },
    // 税号
    companyTax: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'companyTax'
    },
    // 公司地址
    companyAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'companyAddress'
    },
    // 公司电话
    companyPhone: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'companyPhone'
    },
    // 开户银行
    bankName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'bankName'
    },
    // 银行账号
    bankNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'bankNumber'
    },
    // 是否完善信息，0 未完善， 1 完善
    isComplete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0,
      field: 'isComplete'
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
module.exports = Company
//exports//