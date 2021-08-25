//delete//
const moment = require('moment');
//delete//
const Project = function (sequelize, DataTypes) {
  return sequelize.define('AlarmRule', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 规则名称
    ruleName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'ruleName'
    },
    // 查询周期
    loopTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'loopTime'
    },
    // 静默开始时间
    quietStartTime: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'quietStartTime'
    },
    // 静默截止时间
    quietEndTime: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'quietEndTime'
    },
    // 规则详情
    ruleList: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ruleList'
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
module.exports = Project
//exports//