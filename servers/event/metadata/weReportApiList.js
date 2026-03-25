// cardType 1: 数值图 2: 柱状图 3: 饼图 4: 折线图 5: 面积图 6: Top图 7: 表格 8: 文本
module.exports = [
    {
        id: "1",
        title: "当前在线人数",
        description: "当前在线人数",
        cardType: 1,
        supportCardTypes: [1],
        apis: {
            name: "当前在线人数",
            api: "wfEvent/dataOverviewForCenter/getOnlineUserCount",
            method: "POST",
            dataPath: "data.onlineCount",
            responseType: "object",
            key: "getOnlineUserCount"
        },
        // 计算和demo数据
        calcData: {
            columns: [],
            tableList: [],
            dataList: [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "人数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "人数",
                    "unit": ""
                }
            ]
        }
    },
     {
        id: "2",
        title: "总浏览量",
        description: "总浏览量",
        cardType: 1,
        supportCardTypes: [1],
        apis: {
            name: "总浏览量(次)",
            api: "wfEvent/dataOverviewForCenter/getTotalPageViews",
            method: "POST",
            dataPath: "data.totalViews",
            responseType: "object",
            key: "getTotalPageViews"
        },
        // 计算和demo数据
        calcData: {
            columns: [],
            tableList: [],
            dataList: [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "次数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "次数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "3",
        title: "用户总数",
        description: "用户总数",
        cardType: 1,
        supportCardTypes: [1],
        apis: {
            name: "用户总数",
            api: "wfEvent/dataOverviewForCenter/getTotalUsers",
            method: "POST",
            dataPath: "data.totalUsers",
            responseType: "object",
            key: "getTotalUsers"
        },
        // 计算和demo数据
        calcData: {
            columns: [],
            tableList: [],
            dataList: [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "人数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "人数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "4",
        title: "新增用户总数",
        description: "新增用户总数",
        cardType: 1,
        supportCardTypes: [1],
        apis: {
            name: "新增用户总数",
            api: "wfEvent/dataOverviewForCenter/getNewUsers",
            method: "POST",
            dataPath: "data.newUsers",
            responseType: "object",
            key: "getNewUsers"
        },
        // 计算和demo数据
        calcData: {
            columns: [],
            tableList: [],
            dataList: [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "个数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "个数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "5",
        title: "人均访问频次",
        description: "人均访问频次",
        cardType: 1,
        supportCardTypes: [1],
        apis: {
            name: "人均访问频次",
            api: "wfEvent/dataOverviewForCenter/getAvgVisitFrequency",
            method: "POST",
            dataPath: "data.avgVisitFreq",
            responseType: "object",
            key: "getAvgVisitFrequency"
        },
        // 计算和demo数据
        calcData: {
            columns: [],
            tableList: [],
            dataList: [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "个数"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "个数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "6",
        title: "人均停留时间(秒)",
        description: "人均停留时间(秒)",
        cardType: 1,
        supportCardTypes: [1],
        apis: {
            name: "人均停留时间(秒)",
            api: "wfEvent/dataOverviewForCenter/getAvgStayTime",
            method: "POST",
            dataPath: "data.avgStayTime",
            responseType: "object",
            key: "getAvgStayTime"
        },
        // 计算和demo数据
        calcData: {
            columns: [],
            tableList: [],
            dataList: [
                {
                    "items": [
                        {
                            "count": 0,
                            "name": "个数"
                        }],
                    "dataKey": "count",
                    "labelKey": "name",
                    "name": "个数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "7",
        title: "各业务浏览总数",
        description: "各业务浏览总数（Top5）",
        cardType: 2,
        supportCardTypes: [2,3,4,5,6,7],
        apis: {
            name: "各业务浏览总数",
            api: "wfEvent/dataOverviewForCenter/getPageViewsByProject",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getPageViewsByProject"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "业务名称",
                    "key": "projectName"
                },
                {
                    "title": "浏览量",
                    "key": "pageViews"
                },
                {
                    "title": "浏览占比",
                    "key": "percent",
                    "unit": "%"
                },
            ],
            tableList: [],
            dataList: [
                {
                    "items": [
                        {
                            "projectId": "event_20250625_54947613_pro",
                            "projectName": "采购管理1",
                            "percent": "0",
                            "pageViews": "0"
                        },
                        {
                            "projectId": "event_20250625_54947612_pro",
                            "projectName": "采购管理2",
                            "percent": "0",
                            "pageViews": "0"
                        }
                    ],
                    "dataKey": "pageViews",
                    "labelKey": "projectName",
                    "name": "个数",
                    "unit": "%"
                } 
            ]
        }
    },
    {
        id: "8",
        title: "各业务用户总数",
        description: "获取各业务用户总数（Top10）",
        cardType: 6,
        supportCardTypes: [2,3,4,5,6,7],
        apis: {
            name: "各业务用户总数",
            api: "wfEvent/dataOverviewForCenter/getUsersByProject",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getUsersByProject"
        },
        // 计算和demo数据
        calcData: {
            columns: [ 
                {
                    "title": "业务名称",
                    "key": "projectName"
                },
                {
                    "title": "总量",
                    "key": "userCount"
                },
            ],
            tableList: [],
            dataList: [
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
                    "name": "个数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "9",
        title: "各业务新增用户总数",
        description: "获取各业务新增用户总数（Top10）",
        cardType: 6,
        supportCardTypes: [2,3,4,5,6,7],
        apis: {
            name: "各业务新增用户总数",
            api: "wfEvent/dataOverviewForCenter/getNewUsersByProject",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getNewUsersByProject"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "业务名称",
                    "key": "projectName"
                },
                {
                    "title": "总数",
                    "key": "newUserCount"
                },
            ],
            tableList: [],
            dataList: [
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
                    "name": "应用",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "10",
        title: "各业务活跃人数",
        description: "获取各业务活跃人数（最近10分钟，Top10）",
        cardType: 2,
        supportCardTypes: [2,3,4,5,6,7],
        apis: {
            name: "各业务活跃人数",
            api: "wfEvent/dataOverviewForCenter/getActiveUsersByProject",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getActiveUsersByProject"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "应用名称",
                    "key": "projectName"
                },
                {
                    "title": "个数",
                    "key": "activeCount"
                },
            ],
            tableList: [
                
            ],
            dataList: [
                {
                    "items": [
                        {
                            "projectId": "event_20250625_54947613_pro",
                            "projectName": "采购管理",
                            "percent": "0",
                            "activeCount": 0
                        },
                        {
                            "projectId": "event_20250625_54947613_pro",
                            "projectName": "采购管理",
                            "percent": "0",
                            "activeCount": 0
                        }
                    ],
                    "dataKey": "activeCount",
                    "labelKey": "projectName",
                    "name": "个数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "11",
        title: "各业务人均点击量",
        description: "获取各业务人均点击量（Top10）",
        cardType: 2,
        supportCardTypes: [2,3,4,5,6,7],
        apis: {
            name: "各业务人均点击量",
            api: "wfEvent/dataOverviewForCenter/getClickPerUserByProject",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getClickPerUserByProject"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "应用名称",
                    "key": "projectName"
                },
                {
                    "title": "人均点击量",
                    "key": "avgClickPerUser"
                },
            ],
            tableList: [
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
                },
            ],
            dataList: [
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
                    "dataKey": "avgClickPerUser",
                    "labelKey": "projectName",
                    "name": "个数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "12",
        title: "各业务人均停留时间",
        description: "获取各业务人均停留时间（Top10）",
        cardType: 6,
        supportCardTypes: [2,3,4,5,6,7],
        apis: {
            name: "各业务人均停留时间",
            api: "wfEvent/dataOverviewForCenter/getStayTimePerUserByProject",
            method: "POST",
            dataPath: "data.list",
            responseType: "array",
            key: "getStayTimePerUserByProject"
        },
        // 计算和demo数据
        calcData: {
            columns: [
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
                    "name": "功能名称",
                    "unit": "s"
                }
            ]
        }
    },
    {
        id: "13",
        title: "地理位置分布",
        description: "获取地理位置分布（Top20）",
        cardType: 2,
        supportCardTypes: [2, 3,4, 5, 6, 7],
        apis: {
            name: "地理位置分布",
            api: "wfEvent/dataOverviewForCenter/getLocationDistribution",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getLocationDistribution"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "省份",
                    "key": "province"
                },
                {
                    "title": "总数",
                    "key": "visitCount"
                },
            ],
            tableList: [
                {
                    "province": "北京",
                    "visitCount": "0"
                }
            ],
            dataList: [
                {
                    "items": [
                        {
                            "province": "北京",
                            "visitCount": "0"
                        },
                        {
                            "province": "上海",
                            "visitCount": "0"
                        },
                    ],
                    "dataKey": "visitCount",
                    "labelKey": "province",
                    "name": "个数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "14",
        title: "访问来源统计",
        description: "获取访问来源分布（Top20）",
        cardType: 3,
        supportCardTypes: [2, 3,4, 5, 6,7],
        apis: {
            name: "访问来源统计",
            api: "wfEvent/dataOverviewForCenter/getSourceDistribution",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getSourceDistribution"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "访问来源",
                    "key": "sourceName"
                },
                {
                    "title": "占比",
                    "key": "percent",
                    "unit": "%"
                },
            ],
            tableList: [
                {
                    "sourceName": "直接访问",
                    "percent": "0"
                }
            ],
            dataList: [
                {
                    "items": [
                        {
                            "sourceName": "直接访问",
                            "percent": "0"
                        }
                    ],
                    "dataKey": "visitCount",
                    "labelKey": "sourceName",
                    "name": "占比",
                    "unit": "%"
                }
            ]
        }
    },
    {
        id: "15",
        title: "浏览器分布占比",
        description: "获取浏览器分布（Top10）",
        cardType: 6,
        supportCardTypes: [2, 3, 4, 5, 6, 7],
        apis: {
            name: "浏览器分布占比",
            api: "wfEvent/dataOverviewForCenter/getBrowserDistribution",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getBrowserDistribution"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "浏览器",
                    "key": "browserName"
                },
                {
                    "title": "占比",
                    "key": "percent",
                    "unit": "%"
                },
            ],
            tableList: [
                {
                    "browserName": "ie",
                    "percent": "0"
                }
            ],
            dataList: [
                {
                    "items": [
                       {
                            "browserName": "ie",
                            "percent": "0"
                        }
                    ],
                    "dataKey": "userCount",
                    "labelKey": "browserName",
                    "name": "占比",
                    "unit": "%"
                }
            ]
        }
    },
    {
        id: "16",
        title: "页面点击次数",
        description: "获取页面点击次数（Top5）",
        cardType: 6,
        supportCardTypes: [2, 3, 4, 5, 6, 7],
        apis: {
            name: "页面点击次数",
            api: "wfEvent/dataOverviewForCenter/getPageClickFrequency",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getPageClickFrequency"
        },
        // 计算和demo数据
        calcData: {
            columns: [
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
                },
            ],
            tableList: [
                {
                    "pagePath": "页面1",
                    "clickCount": "0",
                    "changeRate": "0"
                }
            ],
            dataList: [
                {
                    "items": [
                       {
                            "pagePath": "页面1",
                            "clickCount": "0",
                            "changeRate": "0"
                        },
                        {
                            "pagePath": "页面1",
                            "clickCount": "0",
                            "changeRate": "0"
                        }
                    ],
                    "dataKey": "clickCount",
                    "labelKey": "pagePath",
                    "name": "个数",
                    "unit": "%"
                }
            ]
        }
    },
    {
        id: "17",
        title: "页面访问量",
        description: "获取页面访问量（Top10）",
        cardType: 6,
        supportCardTypes: [2, 3, 4, 5, 6, 7],
        apis: {
            name: "页面访问量",
            api: "wfEvent/dataOverviewForCenter/getPageVisits",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getPageVisits"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "名称",
                    "key": "pagePath"
                },
                {
                    "title": "总数",
                    "key": "visitCount"
                },
            ],
            tableList: [
                {
                    "pagePath": "用户1",
                    "visitCount": "0"
                }
            ],
            dataList: [
                {
                    "items": [
                       {
                            "pagePath": "用户1",
                            "visitCount": "0"
                       },
                       {
                            "pagePath": "用户1",
                            "visitCount": "0"
                       }
                    ],
                    "dataKey": "visitCount",
                    "labelKey": "pagePath",
                    "name": "个数",
                    "unit": ""
                }
            ]
        }
    },
    {
        id: "18",
        title: "页面在线时长",
        description: "获取页面在线时长（Top10）",
        cardType: 6,
        supportCardTypes: [2, 3, 4, 5, 6, 7],
        apis: {
            name: "页面在线时长",
            api: "wfEvent/dataOverviewForCenter/getPageStayTime",
            method: "POST",
            dataPath: "data",
            responseType: "array",
            key: "getPageStayTime"
        },
        // 计算和demo数据
        calcData: {
            columns: [
                {
                    "title": "名称",
                    "key": "pagePath"
                },
                {
                    "title": "平均停留时长",
                    "key": "avgStayTime",
                    "unit": "s"
                },
            ],
            tableList: [
                {
                    "pagePath": "页面1",
                    "avgStayTime": "0"
                }
            ],
            dataList: [
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
                    "name": "个数",
                    "unit": "s"
                }
            ]
        }
    }
]

