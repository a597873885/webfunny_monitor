//delete//
const moment = require('moment');
//delete//
const Message = function (sequelize, DataTypes) {
  return sequelize.define('Message', {
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
    // 消息标题
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'title'
    },
    // 消息内容
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'content'
    },
    // 消息类型
    type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'type'
    },
    // 阅读状态
    isRead: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'isRead'
    },
    // 跳转连接
    link: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'link'
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
        name: "userIdIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "userId"
          }
        ]
      }
    ]
  })

}
//exports//
module.exports = Message
//exports//