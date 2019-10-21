//delete//
const baseInfo = require('./baseInfo');
const Utils = require('../util/utils');
//delete//
const HttpErrorInfo = function (sequelize, DataTypes) {
  return sequelize.define(Utils.setTableName('HttpErrorInfo'), {
    ...baseInfo(DataTypes),
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 接口请求的完整URL
    httpUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'httpUrl'
    },
    // 接口请求的简洁URL
    simpleHttpUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'simpleHttpUrl'
    },
    // 接口状态
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'status'
    },
    // 接口状态描述
    statusText: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'statusText'
    },
    // 接口结果状态
    statusResult: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'statusResult'
    },
    // 接口耗时
    loadTime: {
      type: DataTypes.STRING(13),
      allowNull: true,
      field: 'loadTime'
    },
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
module.exports = HttpErrorInfo
//exports//