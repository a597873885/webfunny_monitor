//delete//
const moment = require('moment');
//delete//
const BuryPointWarehouse = function (sequelize, DataTypes) {
  return sequelize.define('BuryPointWarehouse', {
    // ID 主键,点位id，从100开始
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      AUTO_INCREMENT: 100
    },
    // 点位名称
    pointName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'pointName'
    },

    // 所有字段
    fields: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'fields'
    },
    // 描述
    desc: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'desc'
    },
    // 创建人
    createBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'createBy'
    },
    // 修改人
    updateBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'updateBy'
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
    freezeTableName: true,
    AUTO_INCREMENT: 100
  })

}
//exports//
module.exports = BuryPointWarehouse
//exports//