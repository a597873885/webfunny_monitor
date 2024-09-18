const moment = require('moment');
const TriggerCondition = function (sequelize, DataTypes) {
  return sequelize.define('TriggerCondition', {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 告警指标 ()
    /*
      健康分、
      流量，
      错误量，
      错误率，
      接口错误量，
      接口错误率，
      静态资源错误量，
      静态资源错误率，
      响应时间
    */
    alarmIndex: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'alarmIndex'
    },
    // 统计周期
    statCycle: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'statCycle'
    },
    // 告警规则ID
    ruleId: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'ruleId'
    },
    // 计算方式
    calculateType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'calculateType'
    },
    // 条件符号
    conditionSymbol: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'conditionSymbol'
    },
    // 严重数值
    seriousData: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'seriousData'
    },
    // 警告数值
    warningData: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'warningData'
    },
    // 提示数值
    infoData: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'infoData'
    },
    // 不分级数值
    commonData: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'commonData'
    },
    // 持续周期
    duration: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'duration'
    },
    // 间隔时间
    timeInterval: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'timeInterval'
    },
    // 满足条件方式(0: 任意 1: 所有)
    conditionMeetWay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'conditionMeetWay'
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
  })
}
//exports//
module.exports = TriggerCondition
//exports//