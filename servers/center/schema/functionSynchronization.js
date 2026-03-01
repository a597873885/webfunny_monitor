const moment = require("moment");

const FunctionSynchronization = function (sequelize, DataTypes) {
  return sequelize.define("FunctionSynchronization", {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 功能编码
    functionCode: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: "functionCode"
    },
    // 功能名称
    functionName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "functionName"
    },
    // 父级功能编码
    parentId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "parentId"
    },
    // 项目编码
    appCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "appCode"
    },
    // 功能状态 0: 停用, 1: 启用
    functionStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      field: "functionStatus"
    },
    // 是否过滤 0: 正常, 1: 过滤
    isFilter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "isFilter"
    },
    // 功能创建时间
    creationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "creationDate"
    },
    // 应用功能状态 (online: 上线, offline: 下线)
    appFunctionStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'online',
      field: "appFunctionStatus"
    },
    // 功能下线时间
    functionOfflineDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "functionOfflineDate"
    },
    // 是否过滤 0: 正常, 1: 过滤
    isFilter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "isFilter"
    },
    // 迭代次数
    iterationCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "iterationCount"
    },
    // 最后更新时间
    lastUpdateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "lastUpdateDate"
    },
    // 创建时间
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    // 更新时间
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  })
}
//exports//
module.exports = FunctionSynchronization
//exports//