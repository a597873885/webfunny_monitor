//delete//
const moment = require('moment');
//delete//
const BuryPointCardStatistics = function (sequelize, DataTypes) {
  return sequelize.define('BuryPointCardStatistics', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 页面id
    pageId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'pageId'
    },
    // 卡片id
    cardId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'cardId'
    },
     // 卡片名称
     cardName: {
      type: DataTypes.STRING(128),
      allowNull: true,
      field: 'cardName'
    },
     // 计数字段：代表图中哪种数据
     calcField: {
      type: DataTypes.STRING(190),
      allowNull: true,
      field: 'calcField'
    },
     // 计数字段：代表图中哪种数据
     calcFieldKey: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'calcFieldKey'
    },
    // 发生日期
    happenDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'happenDate'
    },
    // 统计数值
    count: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'count'
    },
    // 百分比
    percentage: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'percentage'
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
    indexes: [
      {
        name: "idx_pageId",
        method: "BTREE",
        fields: [
          {
            attribute: "pageId"
          }
        ]
      },
      {
        name: "idx_cardId",
        method: "BTREE",
        fields: [
          {
            attribute: "cardId"
          }
        ]
      },
      {
        name: "idx_happenDate",
        method: "BTREE",
        fields: [
          {
            attribute: "happenDate"
          }
        ]
      },
      {
        name: "idx_calcField",
        method: "BTREE",
        fields: [
          {
            attribute: "calcField"
          }
        ]
      },
    ]
  })

}
//exports//
module.exports = BuryPointCardStatistics
//exports//