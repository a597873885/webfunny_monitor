const PerfInfoByDay = function (sequelize, DataTypes) {
  return sequelize.define('PerfInfoByDay', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 展示名称
    showName: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      field: 'showName'
    },
    // 日志类型
    infoType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'infoType'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'webMonitorId'
    },
    // 每天的名称 2019-06-28
    dayName: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'dayName'
    },
    // 每天的数量
    dayCount: {
      type: DataTypes.FLOAT(20),
      allowNull: true,
      field: 'dayCount'
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
module.exports = PerfInfoByDay
//exports//