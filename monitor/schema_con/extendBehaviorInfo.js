
const getTableProperty = (DataTypes) => {
  const fields = {
    // ID 主键
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    // 自定义用户标识ID
    userId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'userId'
    },
    // 行为类型
    behaviorType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'behaviorType'
    },
    // 行为结果
    behaviorResult: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'behaviorResult'
    },
    // 上传类型
    uploadType: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'uploadType'
    },
    // 备注描述
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
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
        name: "userIdIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "userId"
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
      }
    ]
  }
  return {fields, fieldIndex}
}

module.exports = getTableProperty
