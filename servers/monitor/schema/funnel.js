const Funnel = function (sequelize, DataTypes) {
  return sequelize.define('Funnel', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 漏斗组合名称
    funnelName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'funnelName'
    },
    // 漏斗组合埋点的id   1,2,3
    funnelIds: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'funnelIds'
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
module.exports = Funnel
//exports//