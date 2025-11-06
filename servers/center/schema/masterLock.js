//delete//
const moment = require('moment');
//delete//
const MasterLock = function (sequelize, DataTypes) {
  return sequelize.define('MasterLock', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 锁的key
    lockKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'lockKey'
    },
    // 节点ID
    nodeId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nodeId'
    },
    // 节点IP地址
    nodeIp: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'nodeIp'
    },
    // 过期时间
    expireTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expireTime'
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
    indexes: [
      {
        unique: true,
        fields: ['lockKey']
      },
      {
        fields: ['expireTime']
      }
    ]
  })

}
//exports//
module.exports = MasterLock
//exports//

