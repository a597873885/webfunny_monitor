/**
 * 预置用户属性字段列表（唯一数据源）
 * 创建项目时自动初始化
 *
 * 所有用户字段名称均以本文件为准，其他位置（schema、controller、module）均从此派生：
 *   - fieldList:       完整字段定义数组（创建项目元数据用）
 *   - userFieldNames:  字段名称数组（controller 提取上报数据用）
 *   - userFieldSqlColumns: SQL 列名片段（module SELECT 查询用）
 *   - schemaStructure: ClickHouse 表结构对象（schema 定义用）
 */

const { DataTypes } = require("../node_clickhouse/consts")

// ============ 唯一数据源：字段定义列表 ============
const fieldList = [
  { fieldName: 'weCustomerKey', fieldAlias: '内置ID', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '用户唯一标识（内置）', isShowUserList: 1 },
  { fieldName: 'weUserId', fieldAlias: '用户ID', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '用户唯一标识', isShowUserList: 1 },
  { fieldName: 'weDeviceId', fieldAlias: '设备ID', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '设备唯一标识', isShowUserList: 1 },
  { fieldName: 'weUserName', fieldAlias: '用户名', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '用户名称', isShowUserList: 1 },
  { fieldName: 'wePhone', fieldAlias: '手机号', fieldType: 'VARCHAR', fieldLength: 20, fieldDesc: '用户手机号', isShowUserList: 1 },
  { fieldName: 'weEmail', fieldAlias: '邮箱', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '用户邮箱', isShowUserList: 1 },
  { fieldName: 'weGender', fieldAlias: '性别', fieldType: 'VARCHAR', fieldLength: 10, fieldDesc: '用户性别', isShowUserList: 1 },
  { fieldName: 'weBirthday', fieldAlias: '出生日期', fieldType: 'VARCHAR', fieldLength: 20, fieldDesc: '用户出生日期', isShowUserList: 1 },
  { fieldName: 'weCountry', fieldAlias: '国家', fieldType: 'VARCHAR', fieldLength: 50, fieldDesc: '用户所在国家', isShowUserList: 1 },
  { fieldName: 'weProvince', fieldAlias: '省份', fieldType: 'VARCHAR', fieldLength: 50, fieldDesc: '用户所在省份', isShowUserList: 1 },
  { fieldName: 'weCity', fieldAlias: '城市', fieldType: 'VARCHAR', fieldLength: 50, fieldDesc: '用户所在城市', isShowUserList: 1 },
  { fieldName: 'weAddress', fieldAlias: '地址', fieldType: 'VARCHAR', fieldLength: 255, fieldDesc: '用户详细地址' },
  { fieldName: 'weSignUpTime', fieldAlias: '注册时间', fieldType: 'VARCHAR', fieldLength: 20, fieldDesc: '用户注册时间', isShowUserList: 1 },
  { fieldName: 'weFirstVisitTime', fieldAlias: '首次访问时间', fieldType: 'VARCHAR', fieldLength: 20, fieldDesc: '用户首次访问时间' },
  { fieldName: 'weFirstAccessSource', fieldAlias: '首次访问来源', fieldType: 'VARCHAR', fieldLength: 255, fieldDesc: '用户首次访问来源页面' },
  { fieldName: 'weFirstAccessPage', fieldAlias: '首次访问页面', fieldType: 'VARCHAR', fieldLength: 255, fieldDesc: '用户首次访问页面域名' },
  { fieldName: 'weFirstBrowserLanguage', fieldAlias: '首次浏览器语言', fieldType: 'VARCHAR', fieldLength: 50, fieldDesc: '用户首次访问浏览器语言' },
  { fieldName: 'weFirstBrowserCharset', fieldAlias: '首次浏览器字符集', fieldType: 'VARCHAR', fieldLength: 50, fieldDesc: '用户首次访问浏览器字符集' },
  { fieldName: 'weFirstSearchKeyword', fieldAlias: '首次搜索关键词', fieldType: 'VARCHAR', fieldLength: 255, fieldDesc: '用户首次搜索关键词' },
  { fieldName: 'weFirstUtmSource', fieldAlias: '首次广告来源', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '首次UTM广告来源' },
  { fieldName: 'weFirstUtmMedium', fieldAlias: '首次广告媒介', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '首次UTM广告媒介' },
  { fieldName: 'weFirstUtmCampaign', fieldAlias: '首次广告名称', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '首次UTM广告名称' },
  { fieldName: 'weFirstUtmContent', fieldAlias: '首次广告内容', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '首次UTM广告内容' },
  { fieldName: 'weFirstUtmTerm', fieldAlias: '首次广告关键词', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '首次UTM广告关键词' },
  { fieldName: 'weFirstTrafficSource', fieldAlias: '首次流量来源', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '首次流量来源' }
]

// ============ 派生1：字段名称数组 ============
// 用途：controllers/buryPointUsers.js batchInsertUserData 提取上报用户字段
const userFieldNames = fieldList.map(f => f.fieldName)

// ============ 派生2：SQL 列名片段 ============
// 用途：modules/buryPointUsers.js SELECT 查询中的列名列表
const userFieldSqlColumns = userFieldNames.join(', ')

// ============ 派生3：schema structure 对象 ============
// 用途：schema/buryPointUsers.js 表结构定义（系统字段 id/createdAt/updatedAt 单独定义）
// fieldType → DataTypes 映射
const typeMap = {
  'VARCHAR': DataTypes.STRING,
  'STRING': DataTypes.STRING,
  'INT': DataTypes.INT,
  'INTEGER': DataTypes.INT,
  'BIGINT': DataTypes.BIGINT,
  'FLOAT': DataTypes.FLOAT,
  'DOUBLE': DataTypes.FLOAT,
  'DATE': DataTypes.DATE,
  'DATETIME': DataTypes.DATE_TIME,
  'BOOLEAN': DataTypes.BOOLEAN
}

const schemaStructure = {}
for (const field of fieldList) {
  schemaStructure[field.fieldName] = {
    type: typeMap[field.fieldType] || DataTypes.STRING,
    allowNull: true,
    field: field.fieldName
  }
}

// ============ 派生4：前端暂不展示的字段集合 ============
// 用途：controllers/buryPointField.js、buryPointUserField.js 过滤返回给前端的字段列表
const excludeUserFields = [
  'weFirstBrowserLanguage', 'weFirstBrowserCharset', 'weFirstSearchKeyword',
  'weFirstUtmSource', 'weFirstUtmMedium', 'weFirstUtmCampaign',
  'weFirstUtmContent', 'weFirstUtmTerm', 'weFirstTrafficSource'
]

module.exports = fieldList

// 附加导出（通过属性挂载，不影响原有的 module.exports = fieldList 用法）
module.exports.fieldList = fieldList
module.exports.userFieldNames = userFieldNames
module.exports.userFieldSqlColumns = userFieldSqlColumns
module.exports.schemaStructure = schemaStructure
module.exports.excludeUserFields = excludeUserFields
