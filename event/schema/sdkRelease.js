//delete//
const moment = require('moment');
//delete//
const SdkRelease = function (sequelize, DataTypes) {
  return sequelize.define('SdkRelease', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'projectId'
    },
    // 名称
    releaseName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'releaseName'
    },

    // 所有点位id
    pointIds: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'pointIds'
    },
     // 状态
     status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: 'status'
    },
    // 发布脚本
    releaseScript: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'releaseScript'
    },
    // 发布版本
    version: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'version'
    },
    // 描述
    desc: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'desc'
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
    freezeTableName: true
  })

}
//exports//
module.exports = SdkRelease
//exports//