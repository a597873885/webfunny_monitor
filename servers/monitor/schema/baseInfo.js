const moment = require('moment');
module.exports = (DataTypes) => {
  return {
    // 发生时间
    happenTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'happenTime',
      fieldTitle: '发生时间'
    },
    // 日志类型
    uploadType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploadType',
      fieldTitle: '日志类型'
    },
    // 自定义用户标识ID
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'userId',
      fieldTitle: '用户ID（userId）'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId',
      fieldTitle: '监控ID'
    },
    // 用户内置ID
    customerKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKey',
      fieldTitle: '用户内置ID'
    },
    // 发生的页面URL
    simpleUrl: {
      type: DataTypes.STRING,
        allowNull: true,
        field: 'simpleUrl',
        fieldTitle: '发生的页面URL'
    },
    // 发生的页面完整的URL
    completeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'completeUrl',
      fieldTitle: '发生的页面完整的URL'
    },
    // 项目版本号
    projectVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'projectVersion',
      fieldTitle: '项目版本号'
    },
    // 自定义用户参数1
    firstUserParam: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'firstUserParam',
      fieldTitle: '自定义用户参数1'
    },
    // 自定义用户参数2
    secondUserParam: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'secondUserParam',
      fieldTitle: '自定义用户参数2'
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE_TIME,
      field: "createdAt",
      fieldTitle: '创建时间',
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE_TIME,
      field: "updatedAt",
      fieldTitle: '更新时间',
      get() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 发生时间字符串
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate',
      fieldTitle: '发生时间字符串'
    },
    // 发生时间小时字符串
    happenHour: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'happenHour',
      fieldTitle: '发生时间小时字符串'
    },
    // 发生时间的当前分钟数
    happenMinute: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'happenMinute',
      fieldTitle: '发生时间的当前分钟数'
    },
    // sessionId
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'sessionId',
      fieldTitle: 'sessionId'
    },
  }
}