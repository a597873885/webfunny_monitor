//delete//
const moment = require('moment');
//delete//
const ReportTemplates = function (sequelize, DataTypes) {
  return sequelize.define('ReportTemplates', {
    // ID 主键
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: 'id',
      defaultValue: DataTypes.UUIDV4
    },
    // 
    name: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: 'name'
    },
    // 
    description: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      field: 'description'
    },
    // 1 -- 监控， 2 -- 埋点
    templateType: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      field: 'templateType'
    },
    // 接口配置(JSON格式)
    apiConfig: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'apiConfig'
    },
    // 模板图片类型，1-6，其中 1 -- 监控， 2 -- 埋点， 
    imgType: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1,
      field: 'imgType'
    },
    // 卡片列表(JSON字符串格式，对象数组形式)
    cardList: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cardList'
    },
    // 公司ID
    companyId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'companyId'
    },
    // 创建人
    createBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'createBy'
    },
    // 修改人
    updateBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'updateBy'
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
  })
}
//exports//
module.exports = ReportTemplates
//exports//