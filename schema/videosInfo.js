//delete//
const baseInfo = require('./baseInfo');
const Utils = require('../util/utils');
//delete//
const VideosInfo = function (sequelize, DataTypes) {
  return sequelize.define(Utils.setTableName('VideosInfo'), {
    ...baseInfo(DataTypes),
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 录屏数据
    event: {
      type: "mediumblob",
      allowNull: true,
      field: 'event'
    },
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
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
      }
    ]
  })

}
//exports//
module.exports = VideosInfo
//exports//