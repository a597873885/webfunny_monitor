const moment = require("moment");

const ProjectSynchronization = function (sequelize, DataTypes) {
  return sequelize.define("ProjectSynchronization", {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 项目id
    projectId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "projectId"
    },
    // 项目编码
    projectCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "projectCode"
    },
    // 领域
    field: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "field"
    },
    // 监控项目Id
    monitorProjectId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "monitorProjectId"
    },
    // 监控项目名称
    monitorProjectName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "monitorProjectName"
    },
    // 埋点项目Id
    eventProjectId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "eventProjectId"
    },
    // 埋点项目名称
    eventProjectName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "eventProjectName"
    },
    // 项目状态 0: 停用, 1: 启用
    projectStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "projectStatus"
    },
    // 是否过滤 0: 正常, 1: 过滤
    isFilter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "isFilter"
    },
    // pv总量
    pvTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "pvTotal"
    },
    // uv总量
    uvTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "uvTotal"
    },
    // 用户目标值
    uvTarget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "uvTarget"
    },
    // 是否达标
    isAchievement: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "isAchievement"
    },
    // 达标时间
    achievementDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "achievementDate"
    },
    // 维护人
    maintainer: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "maintainer"
    },
    // 项目创建时间
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "creationDate"
    },
    // 项目首次上线时间
    firstOnlineDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "firstOnlineDate"
    },
    // 项目类型
    appType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "appType"
    },
    // 平台类型
    platformType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "platformType"
    },
    // 应用描述
    appDes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "appDes"
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
module.exports = ProjectSynchronization
//exports//