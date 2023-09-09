//delete//
const moment = require('moment');
//delete//
const BuryPointProject = function (sequelize, DataTypes) {
  return sequelize.define('BuryPointProject', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      AUTO_INCREMENT: 1000
    },
    // 项目ID event1001开始
    projectId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'projectId'
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'companyId'
    },
     // 父id
     parentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'parentId'
    },
    // 名称
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'name'
    },
    // 级别:1-项目，2-分组，3-看板
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: 'type'
    },
    // 查看者列表
    viewers: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'viewers'
    },
    // 环境变量
    env: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'env'
    },
    // 删除状态 0, 1代表删除状态
    delStatus: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      field: 'delStatus'
    },
    // 禁用时间
    forbiddenTime: {
      type: DataTypes.STRING(13),
      allowNull: true,
      field: 'forbiddenTime'
    },
    // 排序
    sort: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      field: 'sort'
    },
    // 系统项目标识：1-是，0-否
    sysType: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'sysType'
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
module.exports = BuryPointProject
//exports//