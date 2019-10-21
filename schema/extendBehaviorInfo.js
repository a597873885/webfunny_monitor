//delete//
const moment = require('moment');
const Utils = require('../util/utils');
//delete//
const ExtendBehaviorInfo = function (sequelize, DataTypes) {
  return sequelize.define(Utils.setTableName('ExtendBehaviorInfo'), {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 自定义用户标识ID
    userId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'userId'
    },
    // 行为类型
    behaviorType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'behaviorType'
    },
    // 行为结果
    behaviorResult: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'behaviorResult'
    },
    // 上传类型
    uploadType: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'uploadType'
    },
    // 备注描述
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    // 发生时间
    happenTime: {
      type: DataTypes.STRING(13),
      allowNull: true,
      field: 'happenTime'
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
        name: "userIdIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "userId"
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
      }
    ]
  })

}
//exports//
module.exports = ExtendBehaviorInfo
//exports//