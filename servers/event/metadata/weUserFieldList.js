/**
 * 预置用户属性字段列表
 * 创建项目时自动初始化
 */
module.exports = [
  { fieldName: 'weCustomerKey', fieldAlias: '内置ID', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '用户唯一标识（内置）' },
  { fieldName: 'weUserId', fieldAlias: '用户ID', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '用户唯一标识' },
  { fieldName: 'weDeviceId', fieldAlias: '设备ID', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '设备唯一标识' },
  { fieldName: 'weUserName', fieldAlias: '用户名', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '用户名称' },
  { fieldName: 'wePhone', fieldAlias: '手机号', fieldType: 'VARCHAR', fieldLength: 20, fieldDesc: '用户手机号' },
  { fieldName: 'weEmail', fieldAlias: '邮箱', fieldType: 'VARCHAR', fieldLength: 100, fieldDesc: '用户邮箱' },
  { fieldName: 'weGender', fieldAlias: '性别', fieldType: 'VARCHAR', fieldLength: 10, fieldDesc: '用户性别' },
  { fieldName: 'weBirthday', fieldAlias: '出生日期', fieldType: 'VARCHAR', fieldLength: 20, fieldDesc: '用户出生日期' },
  { fieldName: 'weCountry', fieldAlias: '国家', fieldType: 'VARCHAR', fieldLength: 50, fieldDesc: '用户所在国家' },
  { fieldName: 'weProvince', fieldAlias: '省份', fieldType: 'VARCHAR', fieldLength: 50, fieldDesc: '用户所在省份' },
  { fieldName: 'weCity', fieldAlias: '城市', fieldType: 'VARCHAR', fieldLength: 50, fieldDesc: '用户所在城市' },
  { fieldName: 'weAddress', fieldAlias: '地址', fieldType: 'VARCHAR', fieldLength: 255, fieldDesc: '用户详细地址' },
  { fieldName: 'weSignUpTime', fieldAlias: '注册时间', fieldType: 'VARCHAR', fieldLength: 20, fieldDesc: '用户注册时间' },
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
