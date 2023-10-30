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
]
    
    