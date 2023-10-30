const InfoCountByHour = function (sequelize, DataTypes) {
  return sequelize.define('PageLoadInfoByDayAndHour', {
    // ID 主键
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    // 日志类型
    infoType: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'infoType'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'webMonitorId'
    },
    // 版本号
    projectVersion: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'projectVersion'
    },
    // 每天的名称 06-28
    dayName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'dayName'
    },
    // 每个小时的名称 06-28 22
    hourName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'hourName'
    },
    // 每个小时的数量
    hourValue: {
      type: DataTypes.FLOAT(20),
      allowNull: true,
      field: 'hourValue'
    },
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
      {
        name: "hourNameIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "hourName"
          }
        ]
      },
      {
        name: "webMonitorIdIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "webMonitorId"
          },
          {
            attribute: "infoType"
          }
        ]
      }
    ]
  })

}
//exports//
module.exports = InfoCountByHour
//exports//