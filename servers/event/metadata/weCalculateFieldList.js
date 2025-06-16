module.exports = [
    {
        "id": "-1", //id -1
        "fieldName": "allCount", //名称为空
        "fieldAlias": "总次数",
        "fieldType": "INT",
        "fieldDesc": "内置ID不去重",
        "groupByFlag": 0,
        "weType": -1
    },
    {
        "id": "-2", //id -1
        "fieldName": "userCount", //名称为空
        "fieldAlias": "用户数",
        "fieldType": "INT",
        "fieldDesc": "内置ID去重",
        "groupByFlag": 0,
        "weType": -1
    },
    {
        "id": "-3", //id -1
        "fieldName": "averageCount", //名称为空
        "fieldAlias": "人均次数",
        "fieldType": "INT",
        "fieldDesc": "总次数/用户数",
        "groupByFlag": 0,
        "weType": -1
    },
    {
        "id": "-4", //id -1
        "fieldName": "averageStayTime", //名称为空
        "fieldAlias": "人均停留时间（心跳）",
        "fieldType": "FLOAT",
        "fieldDesc": "停留时间总和/用户数",
        "groupByFlag": 0,
        "weType": -1
    }
]

