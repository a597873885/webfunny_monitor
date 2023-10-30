
const getTableProperty = (DataTypes) => {
  const fields = {
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    // 行为类型
    behaviorType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'behaviorType'
    },
    // 元素的类名
    className: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'className'
    },
    // Input 框的placeholder
    placeholder: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'placeholder'
    },
    // 输入的内容
    inputValue: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'inputValue'
    },
    // 输入的内容
    tagName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'tagName'
    },
    // 元素包含的内容
    innerText: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      field: 'innerText'
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