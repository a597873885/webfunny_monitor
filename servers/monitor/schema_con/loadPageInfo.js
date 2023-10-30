
const getTableProperty = (DataTypes) => {
  const fields = {
    // ID 主键
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    loadPage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'loadPage'
    },
    domReady: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'domReady'
    },
    redirect: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'redirect'
    },
    lookupDomain: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'lookupDomain'
    },
    ttfb: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ttfb'
    },
    request: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'request'
    },
    loadEvent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'loadEvent'
    },
    appcache: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'appcache'
    },
    unloadEvent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'unloadEvent'
    },
    connect: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'connect'
    },
    loadType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'loadType'
    },
    // 浏览器信息
    browserInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'browserInfo'
    }
  }
  const fieldIndex = {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
      {
        name: "userIdIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "userId"
          }
        ]
      },
      {
        name: "customerKeyIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "customerKey"
          }
        ]
      },
      {
        name: "createdAtIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "createdAt"
          }
        ]
      },
      {
        name: "happenTimeIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "happenTime"
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
      }
    ]
  }
  return {fields, fieldIndex}
}

module.exports = getTableProperty