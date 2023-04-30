//delete//
const moment = require('moment');
//delete//
const BuryPointTask = function (sequelize, DataTypes) {
  return sequelize.define('BuryPointTask', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 任务名称
    taskName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'taskName'
    },
    // 任务描述
    taskDes: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'taskDes'
    },
    // 所有点位信息；JSON字符串；包含点位，字段，点位说明，埋点代码等的JSON字符串
    taskPoint: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      field: 'taskPoint'
    },
    // 绑定SDK_ID
    // sdkId: {
    //   type: DataTypes.INTEGER(11),
    //   allowNull: true,
    //   field: 'sdkId'
    // },
    // 绑定项目ID
    projectId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'projectId'
    },
    // 任务状态： 10：草稿， 20：已发布（未完成）30：已发布（已完成）40：已结束（已完成）
    taskStatus: {
      type: DataTypes.STRING(3),
      allowNull: false,
      field: 'taskStatus'
    },
    // 处理人userID
    handleManId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'handleManId'
    },
    // 创建人userID
    createManId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'createManId'
    },
    // 处理人
    handleManName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'handleManName'
    },
    // 创建人
    createManName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'createManName'
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
module.exports = BuryPointTask
//exports//