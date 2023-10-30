
const getTableProperty = (DataTypes) => {
  const fields = {
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    // 监控ID
    webMonitorId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: 'webMonitorId'
    },
    // 日志类型
    uploadType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'uploadType'
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
    // 是否在当前小时内发生(因为停留时间，有可能会跨小时)，0 不在当前小时内，1 在当前小时
    currentHour: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'currentHour'
    },
    // 停留时间(单位：秒)
    stayTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'stayTime'
    },
    // 停留时间范围
    stayScope: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'stayScope'
    },
    // 活跃时间(单位：秒)
    activeTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'activeTime'
    },
    // 活跃时间范围
    activeScope: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'activeScope'
    },
    // 离开类型(是否访问单页就离开了, 1 仅浏览一个页面就离开了，2 浏览多个页面后离开)
    leaveType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'leaveType'
    },
    // 发生时间字符串
    happenDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'happenDate'
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
  const fieldIndex = {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
      {
        name: "stayTimeIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "stayTime"
          }
        ]
      },
      {
        name: "happenDateIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "happenDate"
          }
        ]
      },
      {
        name: "happenHourIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "happenHour"
          }
        ]
      }
    ]
  }
  return {fields, fieldIndex}
}

module.exports = getTableProperty