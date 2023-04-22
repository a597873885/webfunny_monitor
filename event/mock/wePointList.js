/**
 * 字段列表：
 *  weCustomerKey
    weUserId 
    wePath   路由
    stayTime: 1000ms
 */
module.exports = [
    {
        "pointName": "心跳检测",
        "pointDesc": "心跳检测点位，包含停留时间",
        "fieldList": [
            {
                "fieldName": "stayTime",
                "fieldAlias": "停留时长",
                "fieldType": "INT",
                "fieldLength": 10,
                "fieldDesc": "停留时长",
                "groupByFlag": 0,
                "weType": 0
            }
        ]
    }, 
]

