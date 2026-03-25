// cardType 1: 数值图 2: 柱状图 3: 饼图 4: 折线图 5: 面积图 6: Top图 7: 表格 8: 文本
module.exports = [
    {
        "id": "1766918812813",
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
            "i": "1766918812813-grid-id-10-1-0-8-数据总览",
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
        "id": "1",
        "title": "页面秒开率 (%)",
        "description": "页面秒开率 (%)",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "页面秒开率 (%)",
            "api": "wfMonitor/getOverviewStats",
            "method": "POST",
            "dataPath": "data.pageSecondOpenRate",
            "responseType": "object",
            "key": "pageSecondOpenRate"
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
                    "name": "次数",
                    "unit": ""
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
            "i": "1-grid-id-2-2-1-1-页面秒开率 (%)",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "3",
        "title": "接口成功率 (%)",
        "description": "接口成功率 (%)",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "接口成功率 (%)",
            "api": "wfMonitor/getOverviewStats",
            "method": "POST",
            "dataPath": "data.httpSuccessRate",
            "responseType": "object",
            "key": "httpSuccessRate"
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
                    "name": "个数",
                    "unit": ""
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
            "i": "3-grid-id-2-2-2-1-接口成功率 (%)",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "1767015343780",
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
            "i": "1767015343780-grid-id-10-1-3-8-数据卡片",
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
        "id": "7",
        "title": "页面访问总量",
        "description": "获取各应用页面访问总量",
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
            "name": "页面访问总量",
            "api": "wfMonitor/getPageViewByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getPageViewByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "个数",
                    "key": "count"
                },
                {
                    "title": "应用名称",
                    "key": "projectName"
                }
            ],
            "tableList": [
                {
                    "webMonitorId": "monitor_20250625_54947613_pro",
                    "count": 0,
                    "projectName": "采购管理"
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "webMonitorId": "monitor_20250625_54947613_pro",
                            "count": 0,
                            "projectName": "采购管理"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "projectName",
                    "name": "采购管理",
                    "unit": ""
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 0,
            "y": 4,
            "i": "7-grid-id-5-6-4-2-页面访问总量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "4",
        "title": "接口请求超时总量",
        "description": "接口请求超时总量",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "接口请求超时总量",
            "api": "wfMonitor/getOverviewStats",
            "method": "POST",
            "dataPath": "data.httpTimeoutCount",
            "responseType": "object",
            "key": "httpTimeoutCount"
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
                    "name": "个数",
                    "unit": ""
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
            "i": "4-grid-id-2-2-5-1-接口请求超时总量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "5",
        "title": "代码错误总量",
        "description": "代码错误总量",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "代码错误总量",
            "api": "wfMonitor/getOverviewStats",
            "method": "POST",
            "dataPath": "data.jsErrorCount",
            "responseType": "object",
            "key": "jsErrorCount"
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
                    "name": "个数",
                    "unit": ""
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
            "i": "5-grid-id-2-2-6-1-代码错误总量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "6",
        "title": "静态资源错误总量",
        "description": "静态资源错误总量",
        "cardType": 1,
        "supportCardTypes": [
            1
        ],
        "apis": {
            "name": "静态资源错误总量",
            "api": "wfMonitor/getOverviewStats",
            "method": "POST",
            "dataPath": "data.resourceErrorCount",
            "responseType": "object",
            "key": "resourceErrorCount"
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
                    "name": "个数",
                    "unit": ""
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
            "i": "6-grid-id-2-2-7-1-静态资源错误总量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "8",
        "title": "接口请求总量",
        "description": "获取各应用接口请求总量",
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
            "name": "接口请求总量",
            "api": "wfMonitor/getHttpRequestByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getHttpRequestByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "名称",
                    "key": "projectName"
                },
                {
                    "title": "数量",
                    "key": "count"
                }
            ],
            "tableList": [
                {
                    "projectName": "名称1",
                    "count": 0
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "projectName": "名称1",
                            "count": 0
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "projectName",
                    "name": "名称",
                    "unit": ""
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 5,
            "y": 4,
            "i": "8-grid-id-5-6-8-5-接口请求总量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "11",
        "title": "各应用代码错误总量",
        "description": "获取各应用代码错误总量",
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
            "name": "各应用代码错误总量",
            "api": "wfMonitor/getJsErrorByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getJsErrorByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "业务1",
                    "key": "projectName"
                },
                {
                    "title": "个数",
                    "key": "count"
                }
            ],
            "tableList": [
                {
                    "projectName": "业务1",
                    "count": 0
                },
                {
                    "projectName": "业务2",
                    "count": 0
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "projectName": "业务1",
                            "count": 0
                        },
                        {
                            "projectName": "业务2",
                            "count": 0
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "projectName",
                    "name": "个数",
                    "unit": ""
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 0,
            "y": 10,
            "i": "11-grid-id-5-6-10-5-各应用代码错误总量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "12",
        "title": "各应用自定义错误总量",
        "description": "获取各应用自定义错误总量",
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
            "name": "各应用自定义错误总量",
            "api": "wfMonitor/getConsoleErrorByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getConsoleErrorByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "业务1",
                    "key": "projectName"
                },
                {
                    "title": "个数",
                    "key": "count"
                }
            ],
            "tableList": [
                {
                    "projectName": "业务1",
                    "count": 0
                },
                {
                    "projectName": "业务2",
                    "count": 0
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "projectName": "业务1",
                            "count": 0
                        },
                        {
                            "projectName": "业务2",
                            "count": 0
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "projectName",
                    "name": "个数",
                    "unit": ""
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 5,
            "y": 10,
            "i": "12-grid-id-5-6-9-2-各应用自定义错误总量",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "14",
        "title": "各应用接口请求失败率",
        "description": "获取各应用接口请求失败率（用于图表展示",
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
            "name": "各应用接口请求失败率",
            "api": "wfMonitor/getHttpFailRateByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getHttpFailRateByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "应用名称",
                    "key": "projectName",
                },
                {
                    "title": "失败率",
                    "key": "failRate",
                    "unit": "%"
                }
            ],
            "tableList": [
                {
                    "projectName": "应用1",
                    "failRate": 0
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "webMonitorId": "11",
                            "projectName": "应用1",
                            "failRate": 0
                        }
                    ],
                    "dataKey": "failRate",
                    "labelKey": "projectName",
                    "name": "失败率",
                    "unit": "%"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 0,
            "y": 16,
            "i": "14-grid-id-5-6-12-5-各应用接口请求失败率",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "15",
        "title": "请求失败类型占比",
        "description": "获取接口请求失败类型占比（按状态码分组）",
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
            "name": "请求失败类型占比",
            "api": "wfMonitor/getHttpFailTypeDistribution",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getHttpFailTypeDistribution"
        },
        "calcData": {
            "columns": [
                {
                    "title": "状态码名称",
                    "key": "statusName"
                },
                {
                    "title": "占比",
                    "key": "percentage",
                    "unit": "%"
                }
            ],
            "tableList": [
                {
                    "statusName": "未找到",
                    "percentage": "0"
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "statusName": "未找到",
                            "percentage": "0"
                        }
                    ],
                    "dataKey": "count",
                    "labelKey": "statusName",
                    "name": "占比",
                    "unit": "%"
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 3,
            "x": 5,
            "y": 16,
            "i": "15-grid-id-5-6-11-2-请求失败类型占比",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "13",
        "title": "各应用接口请求超时率",
        "description": "获取各应用接口请求超时率（用于表格展示）",
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
            "name": "各业务应用请求失败统计",
            "api": "wfMonitor/getHttpTimeoutByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getHttpTimeoutByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "应用名称",
                    "key": "projectName"
                },
                {
                    "title": "接口平均响应时间",
                    "key": "avgLoadTime",
                    "unit": "ms"
                },
                {
                    "title": "超时率",
                    "key": "timeoutRate",
                    "unit": "%"
                }
            ],
            "tableList": [
                {
                    "webMonitorId": "monitor_20250625_54947613_pro",
                    "avgLoadTime": 0,
                    "timeoutRate": 0,
                    "projectName": "采购管理"
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "webMonitorId": "monitor_20250625_54947613_pro",
                            "avgLoadTime": 0,
                            "timeoutRate": 0,
                            "projectName": "采购管理"
                        }
                    ],
                    "dataKey": "avgLoadTime",
                    "labelKey": "projectName",
                    "name": "个数",
                    "unit": ""
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 4,
            "x": 0,
            "y": 22,
            "i": "13-grid-id-5-6-14-7-各应用接口请求超时率",
            "moved": false,
            "static": false
        }
    },
    {
        "id": "10",
        "title": "各应用页面加载超时率",
        "description": "获取各应用页面加载超时率（用于表格展示）",
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
            "name": "各应用页面加载超时率",
            "api": "wfMonitor/getPageLoadTimeoutByProject",
            "method": "POST",
            "dataPath": "data",
            "responseType": "array",
            "key": "getPageLoadTimeoutByProject"
        },
        "calcData": {
            "columns": [
                {
                    "title": "应用名称",
                    "key": "projectName"
                },
                {
                    "title": "页面加载平均耗时",
                    "key": "avgLoadTime",
                    "unit": "ms"
                },
                {
                    "title": "超时率",
                    "key": "timeoutRate",
                    "unit": "%"
                }
            ],
            "tableList": [
                {
                    "webMonitorId": "monitor_20250625_54947613_pro",
                    "avgLoadTime": 0,
                    "timeoutRate": 0,
                    "projectName": "采购管理"
                }
            ],
            "dataList": [
                {
                    "items": [
                        {
                            "webMonitorId": "monitor_20250625_54947613_pro",
                            "avgLoadTime": 0,
                            "timeoutRate": 0,
                            "projectName": "采购管理"
                        }
                    ],
                    "dataKey": "avgLoadTime",
                    "labelKey": "projectName",
                    "name": "耗时统计",
                    "unit": ""
                }
            ]
        },
        "dataGrid": {
            "w": 5,
            "h": 6,
            "minW": 3,
            "minH": 4,
            "x": 5,
            "y": 22,
            "i": "10-grid-id-5-6-13-7-各应用页面加载超时率",
            "moved": false,
            "static": false
        }
    }
]