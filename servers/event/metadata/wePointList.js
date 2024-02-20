/**
 * 字段列表：
 *  weCustomerKey
    weUserId 
    wePath   路由
    stayTime: 10.00s
 */
    module.exports = [
        {
            "pointName": "心跳检测",
            "pointDesc": "心跳检测点位，包含停留时间",
            "weType": 1,
            "replacePointIdKey": "HeartBeatPointId",
            "fieldList": [
                {
                    "fieldName": "stayTime",
                    "fieldAlias": "停留时长",
                    "fieldType": "FLOAT",
                    "fieldLength": 10,
                    "fieldDesc": "停留时长",
                    "groupByFlag": 0,
                    "weType": 0
                }
            ]
        }, 
        {
            "pointName": "停留分析",
            "pointDesc": "鼠标停留分析点位，包含行为类型：点击/停留，页面地址：url，坐标x和y",
            "weType": 1,
            "replacePointIdKey": "HeatMapStopPointId",
            "fieldList": [
                {
                    "fieldName": "stayTime",
                    "fieldAlias": "停留时长",
                    "fieldType": "FLOAT",
                    "fieldLength": 10,
                    "fieldDesc": "停留时长",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "weFullPath",
                    "fieldAlias": "页面全路径",
                    "fieldType": "VARCHAR",
                    "fieldLength": 2000,
                    "fieldDesc": "页面全路径",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "weTitle",
                    "fieldAlias": "元素标题",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "元素标题",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "weXPath",
                    "fieldAlias": "元素路径",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "元素在dom结构中的详细路径，用于定位具体元素",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "wePageX",
                    "fieldAlias": "x坐标",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "用于记录鼠标点击，鼠标停留的位置x坐标",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "wePageY",
                    "fieldAlias": "y坐标",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "用于记录鼠标点击，鼠标停留的位置y坐标",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "weScrollWidth",
                    "fieldAlias": "页面内容宽度",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "用于页面内容宽度，包含滚动具体的内容总宽度",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "weScrollHeigh",
                    "fieldAlias": "页面内容高度",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "用于页面内容高度，包含滚动具体的内容总高度",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "weRatio",
                    "fieldAlias": "像素比",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "物理尺寸，像素比",
                    "groupByFlag": 0,
                    "weType": 0
                },
            ]
        },
        {
            "pointName": "点击分析",
            "pointDesc": "鼠标点击分析点位，包含行为类型：点击/停留，页面地址：url，坐标x和y",
            "weType": 1,
            "replacePointIdKey": "HeatMapClickPointId",
            "fieldList": [
                {
                    "fieldName": "weFullPath",
                    "fieldAlias": "页面全路径",
                    "fieldType": "VARCHAR",
                    "fieldLength": 2000,
                    "fieldDesc": "页面全路径",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "weTitle",
                    "fieldAlias": "元素标题",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "元素标题",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "weXPath",
                    "fieldAlias": "元素路径",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "元素在dom结构中的详细路径，用于定位具体元素",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "wePageX",
                    "fieldAlias": "x坐标",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "用于记录鼠标点击，鼠标停留的位置x坐标",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "wePageY",
                    "fieldAlias": "y坐标",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "用于记录鼠标点击，鼠标停留的位置y坐标",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "weScrollWidth",
                    "fieldAlias": "页面内容宽度",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "用于页面内容宽度，包含滚动具体的内容总宽度",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "weScrollHeigh",
                    "fieldAlias": "页面内容高度",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "用于页面内容高度，包含滚动具体的内容总高度",
                    "groupByFlag": 0,
                    "weType": 0
                },
                {
                    "fieldName": "weRatio",
                    "fieldAlias": "像素比",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "物理尺寸，像素比",
                    "groupByFlag": 0,
                    "weType": 0
                },
            ]
        },
        {
            "pointName": "浏览量",
            "pointDesc": "统计每个页面浏览数据",
            "weType": 0,
            "replacePointIdKey": "PageViewPointId",
            "fieldList": [
                {
                    "fieldName": "pageUrl",
                    "fieldAlias": "页面地址",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "标识页面的唯一性，如：demo_home、demo_setting，代表某个具体页面",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "behaviorType",
                    "fieldAlias": "行为类型",
                    "fieldType": "VARCHAR",
                    "fieldLength": 50,
                    "fieldDesc": "表示行为的类型：如：点击, 停留等",
                    "groupByFlag": 1,
                    "weType": 0
                },
            ]
        },
    ]
    
    