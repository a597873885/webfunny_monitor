//delete//
const moment = require('moment');
//delete//
const OrderInfo = function (sequelize, DataTypes) {
  return sequelize.define('OrderInfo', {
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
    // userId
    userId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'userId'
    },
    // 订单ID（远程后端的订单id）
    orderId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'orderId'
    },
    // 产品类型：(120个人订阅版，121企业订阅版)
    productType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'productType'
    },
    // 流量上限（每天）
    maxFlowCount: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'maxFlowCount'
    },
    // 项目个数
    projectCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'projectCount'
    },
    // 联系电话
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone'
    },
    // email
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'email'
    },
    // 价格
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'price'
    },
    // 年限
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'year'
    },
    // 是否支付了 0未支付，1支付
    isPay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'isPay'
    },
    // 是否开票了 0未开票 1开票
    invoice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'invoice'
    },
    // 支付时间
    payTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'payTime'
    },
    // 到期时间
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'endDate'
    },
    // 最新发票申请时间
    latestInvoiceTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'latestInvoiceTime'
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
module.exports = OrderInfo
//exports//