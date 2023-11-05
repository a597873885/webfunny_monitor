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
            "pointName": "浏览量",
            "pointDesc": "统计每个页面浏览数据",
            "weType": 0,
            "replacePointIdKey": "PageViewPointId",
            "fieldList": [
                {
                    "fieldName": "pageUrl",
                    "fieldAlias": "页面标识",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "标识页面的唯一性，如：demo_home、demo_setting，代表某个具体页面",
                    "groupByFlag": 1,
                    "weType": 0
                }
            ]
        }, 
    ]
    
    