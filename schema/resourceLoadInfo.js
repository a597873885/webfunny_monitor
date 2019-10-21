//delete//
const baseInfo = require('./baseInfo');
const Utils = require('../util/utils');
//delete//
const ResourceLoadInfo = function (sequelize, DataTypes) {
  return sequelize.define(Utils.setTableName('ResourceLoadInfo'), {
    ...baseInfo(DataTypes),
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 静态资源的请求路径
    sourceUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'sourceUrl'
    },
    // 静态资源的类型
    elementType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'elementType'
    },
    // 资源加载状态
    status: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'status'
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
        name: "webMonitorIdIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "webMonitorId"
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
module.exports = ResourceLoadInfo
//exports//