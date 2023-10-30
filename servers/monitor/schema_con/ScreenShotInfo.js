
const getTableProperty = (DataTypes) => {
  const fields = {
    // ID 主键
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    // 描述信息
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    // 截屏信息
    screenInfo: {
      type: "mediumblob",
      allowNull: true,
      field: 'screenInfo'
    },
    // 图片类型
    imgType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'imgType'
    }
  }
  const fieldIndex = {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
      {
        name: "searchIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "userId",
          },
          {
            attribute: "customerKey",
          },
          {
            attribute: "createdAt",
          }
        ]
      }
    ]
  }
  return {fields, fieldIndex}
}

module.exports = getTableProperty