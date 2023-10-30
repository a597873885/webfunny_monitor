
const getTableProperty = (DataTypes) => {
  const fields = {
    // ID 主键
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    // 请求方法
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'method'
    },
    // 接口请求的完整URL
    httpUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'httpUrl'
    },
    // 接口请求的简洁URL
    simpleHttpUrl: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'simpleHttpUrl'
    },
    // 接口状态
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'status'
    },
    // 接口状态描述
    statusText: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'statusText'
    },
    // 接口结果状态
    statusResult: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'statusResult'
    },
    // 接口耗时
    loadTime: {
      type: DataTypes.STRING(13),
      allowNull: true,
      field: 'loadTime'
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