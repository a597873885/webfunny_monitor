
const getTableProperty = (DataTypes) => {
  const fields = {
    // ID 主键
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    loadType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'loadType'
    },
    firstByte: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'firstByte'
    },
    domReady: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'domReady'
    },
    pageCompleteLoaded: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pageCompleteLoaded'
    },
    dns: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'dns'
    },
    tcp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'tcp'
    },
    ssl: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ssl'
    },
    response: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'response'
    },
    conTrans: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'conTrans'
    },
    domAnalysis: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'domAnalysis'
    },
    resourceLoaded: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'resourceLoaded'
    },
    // 页面打开的秒数（整数）
    openSecond: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'openSecond'
    },
    // 网络速度评估
    effectiveType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'effectiveType'
    },
    // 国家
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'country'
    },
    // 省份
    province: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'province'
    },
    // 城市
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'city'
    },
    // 操作系统
    os: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'os'
    },
  }
  const fieldIndex = {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
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
      },
      {
        name: "happenMinuteIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "happenMinute"
          }
        ]
      }
    ]
  }
  return {fields, fieldIndex}
}

module.exports = getTableProperty