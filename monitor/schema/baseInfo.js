const moment = require('moment');
module.exports = (DataTypes) => {
  return {
    // 日志类型
    uploadType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'uploadType'
    },
    // 发生时间
    happenTime: {
      type: DataTypes.STRING(13),
      allowNull: true,
      field: 'happenTime'
    },
    // 发生时间字符串
    happenDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'happenDate'
    },
    // 发生时间小时字符串
    happenHour: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'happenHour'
    },
    // 发生时间的当前分钟数
    happenMinute: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'happenMinute'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'webMonitorId'
    },
    // 用户标识ID
    customerKey: {
      type: DataTypes.STRING(55),
      allowNull: true,
      field: 'customerKey'
    },
    // 发生的页面URL
    simpleUrl: {
      type: DataTypes.TEXT,
        allowNull: true,
        field: 'simpleUrl'
    },
    // 发生的页面完整的URL
    completeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'completeUrl'
    },
    // 自定义用户标识ID
    userId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'userId'
    },
    // 项目版本号, 有用户输入的是汉字，会很长
    projectVersion: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'projectVersion'
    },
    // 自定义用户参数1
    firstUserParam: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'firstUserParam'
    },
    // 自定义用户参数2
    secondUserParam: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'secondUserParam'
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
  }
}