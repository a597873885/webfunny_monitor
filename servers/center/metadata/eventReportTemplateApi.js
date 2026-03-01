// cardType 1: 数值图 2: 柱状图 3: 饼图 4: 折线图 5: 面积图 6: Top图 7: 表格 8: 文本
module.exports = [
    {
        "id": "1766918110400",
        "title": "数据总览",
        "description": "",
        "cardType": 8,
        "supportCardTypes": [

        ],
        "dataGrid": {
            "w": 10,
            "h": 1,
            "minW": 10,
            "minH": 1,
            "maxW": 10,
            "maxH": 1,
            "x": 0,
            "y": 0,
            "i": "1766918110400-grid-id-10-1-0-8-数据总览",
            "moved": false,
            "static": false
        },
        "apis": [

        ],
        "calcData": {
            "columns": [

            ],
            "dataList": [

            ]
        }
    },
    {
        "id": "2",
        "title": "总浏览量",
        "description": "总浏览量",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "总浏览量(次)",
            "api": "wfEvent/dataOverviewForCenter/getTotalPageViews",
            "method": "POST",
            "dataPath": "data.totalViews",
            "responseType": "object",
            "key": "getTotalPageViews"
        },
        "calcData": {
            "columns": [

            ],
            "tableList": [

            ],
            "dataList": [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "次数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "次数"
                }
            ]
        },
        "dataGrid": {
            "w": 2,
            "h": 2,
            "minW": 2,
            "minH": 2,
            "x": 0,
            "y": 1,
            "i": "2-grid-id-2-2-1-1-总浏览量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "3",
        "title": "用户总数",
        "description": "用户总数",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "用户总数",
            "api": "wfEvent/dataOverviewForCenter/getTotalUsers",
            "method": "POST",
            "dataPath": "data.totalUsers",
            "responseType": "object",
            "key": "getTotalUsers"
        },
        "calcData": {
            "columns": [

            ],
            "tableList": [

            ],
            "dataList": [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "人数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "人数"
                }
            ]
        },
        "dataGrid": {
            "w": 2,
            "h": 2,
            "minW": 2,
            "minH": 2,
            "x": 2,
            "y": 1,
            "i": "3-grid-id-2-2-2-1-用户总数",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "1767016229007",
        "title": "数据卡片",
        "description": "",
        "cardType": 8,
        "supportCardTypes": [

        ],
        "dataGrid": {
            "w": 10,
            "h": 1,
            "minW": 10,
            "minH": 1,
            "maxW": 10,
            "maxH": 1,
            "x": 0,
            "y": 3,
            "i": "1767016229007-grid-id-10-1-3-8-数据卡片",
            "moved": false,
            "static": false
        },
        "apis": [

        ],
        "calcData": {
            "columns": [

            ],
            "dataList": [

            ]
        }
    },
    {
        "id": "8",
        "title": "各业务用户总数",
        "description": "获取各业务用户总数（Top10）",
        "cardType": 2,
        "supportCardTypes": [
            2,
            3,
            4,
            5,
            6,
            7
        ],
        "apis": {
            "name": "各业务用户总数",
            "api": "wfEvent/dataOverviewForCenter/getUsersByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getUsersByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "业务名称",
                    "key": "projectName"
                },
                {
                    "title": "总量",
                    "key": "userCount"
                }
            ],
            "tableList": [

            ],
            "dataList": [
                {
                    "items": [
                        {
                            "projectId": "event_20250625_54947613_pro",
                            "projectName": "采购管理",
                            "percent": "0",
                            "userCount": "0"
                        },
                        {
                            "projectId": "event_20250625_54947613_pro",
                            "projectName": "采购管理",
                            "percent": "0",
                            "userCount": "0"
                        }
                    ],
                    "dataKey": "userCount",
                    "labelKey": "projectName",
                    "name": "个数"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 5,
            "minW": 3,
            "minH": 3,
            "x": 0,
            "y": 4,
            "i": "8-grid-id-5-5-4-2-各业务用户总数",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "4",
        "title": "新增用户总数",
        "description": "新增用户总数",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "新增用户总数",
            "api": "wfEvent/dataOverviewForCenter/getNewUsers",
            "method": "POST",
            "dataPath": "data.newUsers",
            "responseType": "object",
            "key": "getNewUsers"
        },
        "calcData": {
            "columns": [

            ],
            "tableList": [

            ],
            "dataList": [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "个数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "个数"
                }
            ]
        },
        "dataGrid": {
            "w": 2,
            "h": 2,
            "minW": 2,
            "minH": 2,
            "x": 4,
            "y": 1,
            "i": "4-grid-id-2-2-5-1-新增用户总数",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "5",
        "title": "人均访问频次",
        "description": "人均访问频次",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "人均访问频次",
            "api": "wfEvent/dataOverviewForCenter/getAvgVisitFrequency",
            "method": "POST",
            "dataPath": "data.avgVisitFreq",
            "responseType": "object",
            "key": "getAvgVisitFrequency"
        },
        "calcData": {
            "columns": [

            ],
            "tableList": [

            ],
            "dataList": [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "个数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "个数"
                }
            ]
        },
        "dataGrid": {
            "w": 2,
            "h": 2,
            "minW": 2,
            "minH": 2,
            "x": 6,
            "y": 1,
            "i": "5-grid-id-2-2-6-1-人均访问频次",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "6",
        "title": "人均停留时间(秒)",
        "description": "人均停留时间(秒)",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "人均停留时间(秒)",
            "api": "wfEvent/dataOverviewForCenter/getAvgStayTime",
            "method": "POST",
            "dataPath": "data.avgStayTime",
            "responseType": "object",
            "key": "getAvgStayTime"
        },
        "calcData": {
            "columns": [

            ],
            "tableList": [

            ],
            "dataList": [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "个数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "个数"
                }
            ]
        },
        "dataGrid": {
            "w": 2,
            "h": 2,
            "minW": 2,
            "minH": 2,
            "x": 8,
            "y": 1,
            "i": "6-grid-id-2-2-7-1-人均停留时间",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "9",
        "title": "各业务新增用户总数",
        "description": "获取各业务新增用户总数（Top10）",
        "cardType": 2,
        "supportCardTypes": [
            2,
            3,
            4,
            5,
            6,
            7
        ],
        "apis": {
            "name": "各业务新增用户总数",
            "api": "wfEvent/dataOverviewForCenter/getNewUsersByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getNewUsersByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "业务名称",
                    "key": "projectName"
                },
                {
                    "title": "总数",
                    "key": "newUserCount"
                }
            ],
            "tableList": [

            ],
            "dataList": [
                {
                    "items": [
                        {
                            "projectId": "event_20250625_54947613_pro",
                            "projectName": "采购管理",
                            "percent": "0",
                            "newUserCount": "0"
                        },
                        {
                            "projectId": "event_20250625_54947613_pro",
                            "projectName": "采购管理",
                            "percent": "0",
                            "newUserCount": "0"
                        }
                    ],
                    "dataKey": "newUserCount",
                    "labelKey": "projectName",
                    "name": "应用"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 5,
            "minW": 3,
            "minH": 3,
            "x": 5,
            "y": 4,
            "i": "9-grid-id-5-5-8-4-各业务新增用户总数",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "11",
        "title": "各业务人均点击量",
        "description": "获取各业务人均点击量（Top10）",
        "cardType": 6,
        "supportCardTypes": [
            2,
            3,
            4,
            5,
            6,
            7
        ],
        "apis": {
            "name": "各业务人均点击量",
            "api": "wfEvent/dataOverviewForCenter/getClickPerUserByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getClickPerUserByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "应用名称",
                    "key": "projectName"
                },
                {
                    "title": "访问次数",
                    "key": "clickCount"
                }
            ],
            "tableList": [
                {
                    "projectId": "event_20251001_29241991_pro",
                    "projectName": "xxx管理2",
                    "clickCount": 0,
                    "userCount": 0,
                    "avgClickPerUser": 0
                },
                {
                    "projectId": "event_20251001_29241991_pro",
                    "projectName": "xxx管理2",
                    "clickCount": 0,
                    "userCount": 0,
                    "avgClickPerUser": 0
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "projectId": "event_20251001_29241991_pro",
                            "projectName": "xxx管理2",
                            "clickCount": 0,
                            "userCount": 0,
                            "avgClickPerUser": 0
                        },
                        {
                            "projectId": "event_20251001_29241991_pro",
                            "projectName": "xxx管理2",
                            "clickCount": 0,
                            "userCount": 0,
                            "avgClickPerUser": 0
                        }
                    ],
                    "dataKey": "clickCount",
                    "labelKey": "projectName",
                    "name": "个数"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 5,
            "minW": 3,
            "minH": 3,
            "x": 0,
            "y": 9,
            "i": "11-grid-id-5-5-9-2-各业务人均点击量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "12",
        "title": "各业务人均停留时间",
        "description": "获取各业务人均停留时间（Top10）",
        "cardType": 6,
        "supportCardTypes": [
            2,
            3,
            4,
            5,
            6,
            7
        ],
        "apis": {
            "name": "各业务人均停留时间",
            "api": "wfEvent/dataOverviewForCenter/getStayTimePerUserByProject",
            "method": "POST",
            "dataPath": "data.list",
            "responseType": "array",
            "key": "getStayTimePerUserByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "名称",
                    "key": "projectName"
                },
                {
                    "title": "人均停留时间",
                    "key": "avgStayTimePerUser",
                    "unit": "s"
                }
            ],
            "tableList": [
                    {
                            "projectName": "xxx管理2",
                            "avgStayTimePerUser": 0
                    },
                    {
                            "projectName": "xxx管理2",
                            "avgStayTimePerUser": 0
                    }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "projectId": "event_20251001_29241991_pro",
                            "projectName": "xxx管理2",
                            "totalStayTime": 0,
                            "avgStayTimePerUser": 0
                        },
                        {
                            "projectId": "event_20251001_29241991_pro",
                            "projectName": "xxx管理2",
                            "totalStayTime": 0,
                            "avgStayTimePerUser": 0
                        }
                    ],
                    "dataKey": "avgStayTimePerUser",
                    "labelKey": "projectName",
                    "name": "功能名称"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 5,
            "minW": 3,
            "minH": 3,
            "x": 5,
            "y": 9,
            "i": "12-grid-id-5-5-10-2-各业务人均停留时间",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "14",
        "title": "访问来源统计",
        "description": "获取访问来源分布（Top20）",
        "cardType": 3,
        "supportCardTypes": [
            2,
            3,
            4,
            5,
            6,
            7
        ],
        "apis": {
            "name": "访问来源统计",
            "api": "wfEvent/dataOverviewForCenter/getSourceDistribution",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getSourceDistribution"
        },
        "calcData": {
            "columns": [
                {
                    "title": "访问来源",
                    "key": "sourceName"
                },
                {
                    "title": "占比",
                    "key": "percent",
                    "unit": "%"
                }
            ],
            "tableList": [
                {
                    "sourceName": "直接访问",
                    "percent": "0"
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "sourceName": "直接访问",
                            "percent": "0"
                        }
                    ],
                    "dataKey": "percent",
                    "labelKey": "sourceName",
                    "name": "占比"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 0,
            "y": 14,
            "i": "14-grid-id-5-6-11-2-访问来源统计",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "13",
        "title": "地理位置分布",
        "description": "获取地理位置分布（Top20）",
        "cardType": 6,
        "supportCardTypes": [
            2,
            3,
            4,
            5,
            6,
            7
        ],
        "apis": {
            "name": "地理位置分布",
            "api": "wfEvent/dataOverviewForCenter/getLocationDistribution",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getLocationDistribution"
        },
        "calcData": {
            "columns": [
                {
                    "title": "省份",
                    "key": "province"
                },
                {
                    "title": "总数",
                    "key": "visitCount"
                }
            ],
            "tableList": [
                {
                    "province": "北京",
                    "visitCount": "0"
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "province": "北京",
                            "visitCount": "0"
                        },
                        {
                            "province": "上海",
                            "visitCount": "0"
                        }
                    ],
                    "dataKey": "visitCount",
                    "labelKey": "province",
                    "name": "个数"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 5,
            "y": 14,
            "i": "13-grid-id-5-6-14-2-地理位置分布",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "16",
        "title": "页面点击次数",
        "description": "获取页面点击次数（Top5）",
        "cardType": 7,
        "supportCardTypes": [
            2,
            3,
            4,
            5,
            6,
            7
        ],
        "apis": {
            "name": "页面点击次数",
            "api": "wfEvent/dataOverviewForCenter/getPageClickFrequency",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getPageClickFrequency"
        },
        "calcData": {
            "columns": [
                {
                    "title": "页面地址",
                    "key": "pagePath"
                },
                {
                    "title": "点击次数",
                    "key": "clickCount"
                },
                {
                    "title": "较上周",
                    "key": "changeRate",
                    "unit": "%"
                }
            ],
            "tableList": [
                {
                    "pagePath": "用户1",
                    "clickCount": "0",
                    "changeRate": "0"
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "pagePath": "用户1",
                            "clickCount": "0",
                            "changeRate": "0"
                        },
                        {
                            "pagePath": "用户1",
                            "clickCount": "0",
                            "changeRate": "0"
                        }
                    ],
                    "dataKey": "clickCount",
                    "labelKey": "pagePath",
                    "name": "个数"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 0,
            "y": 20,
            "i": "16-grid-id-5-6-13-7-页面点击次数",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "18",
        "title": "页面在线时长",
        "description": "获取页面在线时长（Top10）",
        "cardType": 7,
        "supportCardTypes": [
            2,
            3,
            4,
            5,
            6,
            7
        ],
        "apis": {
            "name": "页面在线时长",
            "api": "wfEvent/dataOverviewForCenter/getPageStayTime",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getPageStayTime"
        },
        "calcData": {
            "columns": [
                {
                    "title": "名称",
                    "key": "pagePath"
                },
                {
                    "title": "平均停留时长",
                    "key": "avgStayTime",
                    "unit": "s"
                }
            ],
            "tableList": [
                {
                    "pagePath": "页面1",
                    "avgStayTime": "0"
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "pagePath": "页面1",
                            "avgStayTime": "0"
                        },
                        {
                            "pagePath": "页面1",
                            "avgStayTime": "0"
                        }
                    ],
                    "dataKey": "avgStayTime",
                    "labelKey": "pagePath",
                    "name": "个数"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 5,
            "y": 20,
            "i": "18-grid-id-5-6-12-7-页面在线时长",
            "moved": false,
            "static": false
        }
    }
]
