/**
 * 字段列表：
 *  weCustomerKey
    weUserId 
    wePath   路由
    stayTime: 10.00s
 */
    module.exports = [
        {
            "pointName": "功能事件",
            "pointDesc": "功能触发的行为，如点击菜单等，路由加载等",
            "weType": 0,
            "replacePointIdKey": "GeneralFunctionEvent",
            "fieldList": [
                {
                    "fieldName": "glFunctionName",
                    "fieldAlias": "功能名称",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "功能名称",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glFunctionCode",
                    "fieldAlias": "功能编码",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "功能编码",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glAppCode",
                    "fieldAlias": "应用编码",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "应用编码",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glAppName",
                    "fieldAlias": "应用名称",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "应用名称",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glUserCode",
                    "fieldAlias": "用户编码",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "用户编码",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "glFunctionBackupOne",
                    "fieldAlias": "预留字段1",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "预留字段1",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "glFunctionBackupTwo",
                    "fieldAlias": "预留字段2",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "预留字段2",
                    "groupByFlag": 0,
                    "weType": 0
                }
            ]
        },
        {
            "pointName": "访问总量",
            "pointDesc": "访问总量包含浏览量，用户点击行为，功能事件等，它是一个多种行为数据的集合",
            "weType": 0,
            "replacePointIdKey": "GeneralAccessTotal",
            "fieldList": [
                {
                    "fieldName": "glAccessPath",
                    "fieldAlias": "访问路径",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "访问路径,不包含域名，如/home/index",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glAppCode",
                    "fieldAlias": "应用编码",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "应用编码",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glAppName",
                    "fieldAlias": "应用名称",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "应用名称",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glMenuName",
                    "fieldAlias": "菜单名称",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "菜单名称，是可以匹配到的功能名称",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glFunctionCode",
                    "fieldAlias": "功能编码",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "有功能编码的，属于菜单维度；没有的属于功能维度",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glFunctionName",
                    "fieldAlias": "功能名称",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "功能名称",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glUserCode",
                    "fieldAlias": "用户编码",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "用户编码",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "glUserNickname",
                    "fieldAlias": "用户名称",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "用户名称",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "glOriginPointId",
                    "fieldAlias": "来源点位ID",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "来源点位ID",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "glTotalBackupOne",
                    "fieldAlias": "预留字段1",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "预留字段1",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "glTotalBackupTwo",
                    "fieldAlias": "预留字段2",
                    "fieldType": "VARCHAR",
                    "fieldLength": 300,
                    "fieldDesc": "预留字段2",
                    "groupByFlag": 0,
                    "weType": 0
                }
            ]
        },
    ]