/**
 * 字段列表：
 *  weCustomerKey
    weUserId 
    wePath   路由
    stayTime: 10.00s
 */
    module.exports = [
        {
            // "pointName": "【可视化】点击",
            "pointDesc": "全埋点的点击事件",
            "weType": 3, //圈选点位类型
            "replacePointIdKey": "ClickEventPointId",
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
            // "pointName": "【可视化】曝光",
            "pointDesc": "全埋点的曝光事件",
            "weType": 3,//圈选点位类型
            "replacePointIdKey": "ExposureEventPointId",
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
    ]
    
    