const FlowDataInfo = function (sequelize, DataTypes) {
  return sequelize.define('FlowDataInfo', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'companyId'
    },
    // 项目ID
    projectId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'projectId'
    },
    // 流量类型
    flowType: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'flowType'
    },
    // 每天的名称 2019-06-28
    dayName: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'dayName'
    },
    // 每个小时的名称 06-28 22
    hourName: {
      type: DataTypes.STRING(12),
      allowNull: true,
      field: 'hourName'
    },
    // 每个小时的数量
    flowCount: {
      type: DataTypes.FLOAT(20),
      allowNull: true,
      field: 'flowCount'
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
      }
    ]
  })

}
//exports//
module.exports = FlowDataInfo
//exports//