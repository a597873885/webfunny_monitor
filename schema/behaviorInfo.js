//delete//
const baseInfo = require('./baseInfo');
const Utils = require('../util/utils');
//delete//
const BehaviorInfo = function (sequelize, DataTypes) {
  return sequelize.define(Utils.setTableName('BehaviorInfo'), {
    ...baseInfo(DataTypes),
    // ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 行为类型
    behaviorType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'behaviorType'
    },
    // 元素的类名
    className: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'className'
    },
    // Input 框的placeholder
    placeholder: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'placeholder'
    },
    // 输入的内容
    inputValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'inputValue'
    },
    // 输入的内容
    tagName: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'tagName'
    },
    // 元素包含的内容
    innerText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'innerText'
    }
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
      {
        name: "userIdIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "userId"
          }
        ]
      },
      {
        name: "customerKeyIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "customerKey"
          }
        ]
      },
      {
        name: "createdAtIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "createdAt"
          }
        ]
      },
      {
        name: "happenTimeIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "happenTime"
          }
        ]
      }
    ]
  })

}
//exports//
module.exports = BehaviorInfo
//exports//