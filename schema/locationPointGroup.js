const LocationPointGroup = function (sequelize, DataTypes) {
  return sequelize.define('LocationPointGroup', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 用户唯一标识
    userId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'userId'
    },
    // 埋点分组名称
    groupName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'groupName'
    },
    // 埋点分组描述
    groupDes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'groupDes'
    },
    // 分组排序索引
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'orderIndex'
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
module.exports = LocationPointGroup
//exports//