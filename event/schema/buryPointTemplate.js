//delete//
const moment = require('moment');
//delete//
const BuryPointTemplate = function (sequelize, DataTypes) {
  return sequelize.define('BuryPointTemplate', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 用户id
    userId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'userId'
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'projectId'
    },
    // 模板名称
    templateName: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: 'templateName'
    },
    // 模板类型：1-我的模板，2-公共模板，3-系统模板
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: 'type'
    },
    // 系统模板KEY
    weKey: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'weKey'
    },
    // 分组个数
    groupCount: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      field: 'groupCount'
    },
    // 看板个数
    pageCount: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      field: 'pageCount'
    },
    // 卡片个数
    cardCount: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      field: 'cardCount'
    },
    // 详情JSON
    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'detail'
    },
    // 点位信息
    templatePoint: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'templatePoint'
    },
    // 创建人
    createBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'createBy'
    },
    // 修改人
    updateBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'updateBy'
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
        name: "idx_projectId",
        method: "BTREE",
        fields: [
          {
            attribute: "projectId"
          }
        ]
      },
      {
        name: "idx_userId",
        method: "BTREE",
        fields: [
          {
            attribute: "userId"
          }
        ]
      },
    ]
  })

}
//exports//
module.exports = BuryPointTemplate
//exports//