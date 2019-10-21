//delete//
const baseInfo = require('./baseInfo');
const Utils = require('../util/utils');
//delete//
const JavascriptErrorInfo = function (sequelize, DataTypes) {
  return sequelize.define(Utils.setTableName('JavascriptErrorInfo'), {
    ...baseInfo(DataTypes),
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 用户标识ID
    pageKey: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'pageKey'
    },
    // 设备名称
    deviceName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'deviceName'
    },
    // 系统信息
    os: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'os'
    },
    // 浏览器名称
    browserName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'browserName'
    },
    // 浏览器版本号
    browserVersion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'browserVersion'
    },
    // 用户的IP
    monitorIp: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'monitorIp'
    },
    // 国家
    country: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'country'
    },
    // 省份
    province: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'province'
    },
    // 城市
    city: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'city'
    },
    // 信息类型
    infoType: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'infoType'
    },
    // JS报错信息
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'errorMessage'
    },
    // JS报错堆栈
    errorStack: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'errorStack'
    },
    // 浏览器信息
    browserInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'browserInfo'
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
        name: "infoTypeIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "infoType"
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
module.exports = JavascriptErrorInfo
//exports//