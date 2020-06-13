const LocationPointType = function (sequelize, DataTypes) {
  return sequelize.define('LocationPointType', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 分组的Id
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'groupId'
    },
    // 埋点名称
    locationPointName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'locationPointName'
    },
    // 埋点描述
    locationPointDes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'locationPointDes'
    }
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
    ]
  })

}
//exports//
module.exports = LocationPointType
//exports//