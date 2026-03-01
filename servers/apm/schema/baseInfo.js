const moment = require('moment');
module.exports = (DataTypes) => {
  return {
    // 发生时间
    happenDate: {
      type: DataTypes.DATE_TIME,
      allowNull: true,
      field: 'happenDate'
    },
    // 发生时间字符串
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
    // 服务实例标识（对应监控系统的webMonitorId）
    webMonitorId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'webMonitorId'
    },
    // 用户标识ID（对应trace_id，用于关联查询）
    customerKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'customerKey'
    },
    // sessionId（对应segment_id）
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'sessionId'
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
