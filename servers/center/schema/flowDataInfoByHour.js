//delete//
const moment = require('moment');
//delete//
const getTableProperty = (DataTypes) => {
  const fields = {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'companyId'
    },
    // 项目ID
    projectId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'projectId'
    },
    // 项目名称
    projectName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'projectName'
    },
    // 流量来源, 套餐-subscribe，流量包-package
    flowOrigin: {
      type: DataTypes.STRING(12),
      allowNull: true,
      field: 'flowOrigin'
    },
    // 产品类型, 监控-monitor，埋点-event
    productType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'productType'
    },
    // 流量类型
    flowType: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'flowType'
    },
    // 每个小时的名称 06-28 22
    hourName: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'hourName'
    },
    // 每个小时的数量
    flowCount: {
      type: DataTypes.FLOAT(20),
      allowNull: true,
      field: 'flowCount'
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
        name: "hourNameIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "hourName"
          }
        ]
      }
    ]
  }
  return {fields, fieldIndex}
}
//exports//
module.exports = getTableProperty
//exports//