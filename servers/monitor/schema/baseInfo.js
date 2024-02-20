const moment = require('moment');
module.exports = (DataTypes) => {
  return {
    // 发生时间字符串
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate'
    },
    // 日志类型
    uploadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadType'
    },
    // 发生时间
    happenTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'happenTime'
    },
    // 发生时间小时字符串
    happenHour: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'happenHour'
    },
    // 发生时间的当前分钟数
    happenMinute: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'happenMinute'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId'
    },
    // 用户标识ID
    customerKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKey'
    },
    // 发生的页面URL
    simpleUrl: {
      type: DataTypes.STRING,
        allowNull: true,
        field: 'simpleUrl'
    },
    // 发生的页面完整的URL
    completeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'completeUrl'
    },
    // 自定义用户标识ID
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId'
    },
    // 项目版本号
    projectVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectVersion'
    },
    // 自定义用户参数1
    firstUserParam: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'firstUserParam'
    },
    // 自定义用户参数2
    secondUserParam: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'secondUserParam'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE_TIME,
      field: "createdAt",
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE_TIME,
      field: "updatedAt",
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }
}