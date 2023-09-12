//delete//
const moment = require('moment');
//delete//
const Product = function (sequelize, DataTypes) {
  return sequelize.define('Product', {
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
    // 订单ID
    orderId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'orderId'
    },
    // 产品类型：1 流量套餐，2 流量包
    productType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'productType'
    },
    // 已消耗流量
    usedFlowCount: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'usedFlowCount'
    },
    // 流量上限
    maxFlowCount: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'maxFlowCount'
    },
    // 月份  2023-07
    month: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'month'
    },
    // 到期时间
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'endDate'
    },
    // 是否有效 0 无效， 1 有效
    isValid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'isValid'
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
module.exports = Product
//exports//