const loadTimeInfoByHour = function (sequelize, DataTypes) {
  return sequelize.define('LoadTimeInfoByHour', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 展示名称
    showName: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'showName'
    },
    // 日志类型
    uploadType: {
      type: DataTypes.STRING(130),
      allowNull: true,
      field: 'uploadType'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'webMonitorId'
    },
    // 每个小时的名称 06-28 22
    hourName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'hourName'
    },
    // 每个小时的数量
    hourCount: {
      type: DataTypes.FLOAT(20),
      allowNull: true,
      field: 'hourCount'
    },
    // 每个小时的平均加载耗时
    hourLoadTime: {
      type: DataTypes.FLOAT(20),
      allowNull: true,
      field: 'hourLoadTime'
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
            attribute: "uploadType"
          }
        ]
      }
    ]
  })

}
//exports//
module.exports = loadTimeInfoByHour
//exports//