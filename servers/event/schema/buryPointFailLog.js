//delete//
const moment = require('moment');
//delete//
const BuryPointFailLog = function (sequelize, DataTypes) {
  return sequelize.define('BuryPointFailLog', {
    // ID 主键,
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    // pointId
    pointId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'pointId'
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'projectId'
    },
    // 点位名称
    pointName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'pointName'
    },
    // 上报参数
    params: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'params'
    },
    // 失败原因
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'message'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    AUTO_INCREMENT: 100,
    indexes: [
      {
        name: "idx_projectId",
        method: "BTREE",
        fields: [
          {
            attribute: "projectId"
          }
        ]
      },
    ]
  })

}
//exports//
module.exports = BuryPointFailLog
//exports//