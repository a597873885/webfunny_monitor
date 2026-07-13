module.exports = [
    {
        "fieldName": "weCustomerKey",
        "fieldAlias": "内置ID",
        "fieldType": "VARCHAR",
        "fieldLength": 60,
        "fieldDesc": "我们会为每个用户分配一个用户ID，代表他的唯一性",
        "groupByFlag": 0,
        "weType": 1
    },
    {
        "fieldName": "weDeviceId",
        "fieldAlias": "设备ID",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "设备唯一标识",
        "groupByFlag": 0,
        "weType": 1
    },
    {
        "fieldName": "weUserId",
        "fieldAlias": "用户ID",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "由用户主动传入的唯一性标识，一般是userId，手机号，身份证号等",
        "groupByFlag": 0,
        "weType": 1
    }, 
    {
        "fieldName": "weNickname",
        "fieldAlias": "昵称",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "用户昵称",
        "groupByFlag": 0,
        "weType": 1
    }, 
    {
        "fieldName": "wePath",
        "fieldAlias": "页面地址",
        "fieldType": "VARCHAR",
        "fieldLength": 2000,
        "fieldDesc": "我们将会自动获取页面地址，路由等",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weDeviceBrand",
        "fieldAlias": "设备品牌",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "设备品牌，如：Apple、华为、小米、三星、VIVO、OPPO等",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weDeviceName",
        "fieldAlias": "设备名称",
        "fieldType": "VARCHAR",
        "fieldLength": 1000,
        "fieldDesc": "设备名称",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "wePlatform",
        "fieldAlias": "平台",
        "fieldType": "VARCHAR",
        "fieldLength": 1000,
        "fieldDesc": "平台",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weSystem",
        "fieldAlias": "系统和版本号",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "系统和版本号",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weOs",
        "fieldAlias": "系统",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "系统",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weOsVersion",
        "fieldAlias": "系统版本",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "操作系统版本号，如：10/11、10.15.7、17.1、Android 14等",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weBrowserName",
        "fieldAlias": "浏览器",
        "fieldType": "VARCHAR",
        "fieldLength": 500,
        "fieldDesc": "浏览器",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weBrowserVersion",
        "fieldAlias": "浏览器版本",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "浏览器版本号，如：120.0.0.0、17.1、8.0.43等",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weNewStatus",
        "fieldAlias": "是否新用户",
        "fieldType": "INT",
        "fieldLength": 1,
        "fieldDesc": "是否新用户(1为新用户，2为老用户，如果是新用户，当天一整天都是新用户)",
        "groupByFlag": 0,
        "weType": 1
    },
    {
        "fieldName": "weIp",
        "fieldAlias": "IP",
        "fieldType": "VARCHAR",
        "fieldLength": 50,
        "fieldDesc": "IP地址",
        "groupByFlag": 0,
        "weType": 1
    },
     {
        "fieldName": "weCountryId",
        "fieldAlias": "国家ID",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "国家ID",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weCountry",
        "fieldAlias": "国家",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "国家",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weProvinceId",
        "fieldAlias": "省份ID",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "省份ID",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weProvince",
        "fieldAlias": "省份",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "省份",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weCityId",
        "fieldAlias": "城市ID",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "城市ID",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weCity",
        "fieldAlias": "城市",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "城市",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weCountyId",
        "fieldAlias": "区县ID",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "区县ID",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weCounty",
        "fieldAlias": "区县",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "区县",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weHappenTime",
        "fieldAlias": "发生时间",
        "fieldType": "VARCHAR",
        "fieldLength": 20,
        "fieldDesc": "点位发生的时间，格式：yyyy-mm-dd hh:mm:ss",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weHappenDate",
        "fieldAlias": "发生天",
        "fieldType": "VARCHAR",
        "fieldLength": 20,
        "fieldDesc": "点位发生的日期，格式：yyyy-mm-dd",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weHappenHour",
        "fieldAlias": "发生小时",
        "fieldType": "VARCHAR",
        "fieldLength": 20,
        "fieldDesc": "点位发生的小时，格式：hh",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weHappenMinute",
        "fieldAlias": "发生分钟",
        "fieldType": "VARCHAR",
        "fieldLength": 20,
        "fieldDesc": "点位发生的分钟，格式：hh:mm",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weRelationPointId",
        "fieldAlias": "来源点位",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "来源点位",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weRelationField",
        "fieldAlias": "来源字段",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "来源字段",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weUserType",
        "fieldAlias": "用户类型",
        "fieldType": "VARCHAR",
        "fieldLength": 2000,
        "fieldDesc": "用户类型",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weUserLabel",
        "fieldAlias": "用户标签",
        "fieldType": "VARCHAR",
        "fieldLength": 2000,
        "fieldDesc": "用户标签",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weRemark",
        "fieldAlias": "备注",
        "fieldType": "VARCHAR",
        "fieldLength": 2000,
        "fieldDesc": "备注",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weCommonGrgs",
        "fieldAlias": "通用属性合集",
        "fieldType": "VARCHAR",
        "fieldLength": 2000,
        "fieldDesc": "用户属性，通用属性合集",
        "groupByFlag": 0,
        "weType": 1
    },
    {
        "fieldName": "weEventGrgs",
        "fieldAlias": "事件属性合集",
        "fieldType": "VARCHAR",
        "fieldLength": 2000,
        "fieldDesc": "事件属性，用户属性，通用属性合集，",
        "groupByFlag": 0,
        "weType": 1
    },


    // 2026年06月30日新增
    {
        "fieldName": "weScreenWidth",
        "fieldAlias": "屏幕宽度",
        "fieldType": "INT",
        "fieldLength": 10,
        "fieldDesc": "屏幕分辨率宽度（px）",
        "groupByFlag": 0,
        "weType": 1
    },
    {
        "fieldName": "weScreenHeight",
        "fieldAlias": "屏幕高度",
        "fieldType": "INT",
        "fieldLength": 10,
        "fieldDesc": "屏幕分辨率高度（px）",
        "groupByFlag": 0,
        "weType": 1
    },
    {
        "fieldName": "weDensity",
        "fieldAlias": "屏幕密度",
        "fieldType": "INT",
        "fieldLength": 10,
        "fieldDesc": "屏幕密度（dpi）",
        "groupByFlag": 0,
        "weType": 1
    },
    {
        "fieldName": "weNetworkType",
        "fieldAlias": "网络类型",
        "fieldType": "VARCHAR",
        "fieldLength": 20,
        "fieldDesc": "网络类型（WiFi/4G/5G/unknown）",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weCarrier",
        "fieldAlias": "运营商",
        "fieldType": "VARCHAR",
        "fieldLength": 50,
        "fieldDesc": "运营商（移动/联通/电信）",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weManufacturer",
        "fieldAlias": "设备厂商",
        "fieldType": "VARCHAR",
        "fieldLength": 200,
        "fieldDesc": "设备厂商",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weAppVersion",
        "fieldAlias": "应用版本号",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "应用版本号",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weSdkVersion",
        "fieldAlias": "SDK版本号",
        "fieldType": "VARCHAR",
        "fieldLength": 50,
        "fieldDesc": "SDK版本号，硬编码常量",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weLanguage",
        "fieldAlias": "系统语言",
        "fieldType": "VARCHAR",
        "fieldLength": 20,
        "fieldDesc": "系统语言",
        "groupByFlag": 1,
        "weType": 1
    },
    {
        "fieldName": "weTimezone",
        "fieldAlias": "时区",
        "fieldType": "VARCHAR",
        "fieldLength": 100,
        "fieldDesc": "时区",
        "groupByFlag": 1,
        "weType": 1
    },
    
]