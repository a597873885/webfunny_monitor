
const getTableProperty = (DataTypes) => {
  const fields = {
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 项目版本号
    projectVersion: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'projectVersion'
    },
    // 用户标识ID
    pageKey: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'pageKey'
    },
    // 页面title
    pageTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'pageTitle'
    },
    // 设备名称
    deviceName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'deviceName'
    },
    // 设备尺寸，物理尺寸
    deviceSize: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'deviceSize'
    },
    // 系统信息
    os: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'os'
    },
    // 浏览器名称
    browserName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'browserName'
    },
    // 浏览器版本号
    browserVersion: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'browserVersion'
    },
    // 浏览器版信息
    browserInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'browserInfo'
    },
    // 用户的IP
    monitorIp: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'monitorIp'
    },
    // 国家
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'country'
    },
    // 省份
    province: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'province'
    },
    // 城市
    city: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'city'
    },
    // 运营商
    operators: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'city'
    },
    // 上报类型
    uploadType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'uploadType'
    },
    // 加载类型(首次加载或是reload)
    loadType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'loadType'
    },
    // 加载加载时间(首次加载或是reload)
    loadTime: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'loadTime'
    },
    // 判断是否为新用户 "new/old"
    newStatus: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'newStatus'
    },
    // 来源页面的URL
    referrer: {
      type: DataTypes.STRING(500),
        allowNull: true,
        field: 'referrer'
    },
    // 创建日期，用于查询留存数据
    customerKeyCreatedDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'customerKeyCreatedDate'
    }
  }
  const fieldIndex = {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true,
    indexes: [
    ]
  }
  return {fields, fieldIndex}
}

module.exports = getTableProperty