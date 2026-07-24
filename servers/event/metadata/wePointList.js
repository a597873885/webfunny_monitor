/**
 * 字段列表：
 *  weCustomerKey
    weUserId 
    wePath   路由
    stayTime: 10.00s
 */
    module.exports = [
        {
            "pointName": "【全埋点】心跳",
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
            "pointName": "【全埋点】停留",
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
            "pointName": "【全埋点】点击",
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
            "pointName": "页面浏览",
            "pointDesc": "统计每个页面浏览数据",
            "weType": 0,
            "replacePointIdKey": "PageViewPointId",
            "fieldList": [
                {
                    "fieldName": "pageUrl",
                    "fieldAlias": "页面具体地址",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "标识页面的唯一性，如：demo_home、demo_setting，代表某个具体页面",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "pageTitle",
                    "fieldAlias": "页面标题",
                    "fieldType": "VARCHAR",
                    "fieldLength": 50,
                    "fieldDesc": "标识页面的标题",
                    "groupByFlag": 1,
                    "weType": 0
                },
            ]
        },
        {
            "pointName": "【全埋点】浏览记录",
            "pointDesc": "用户访问页面的点位信息，包括页面路径,页面标题,访问地址,网站来源",
            "weType": 1,
            "replacePointIdKey": "BrowsingHistoryPointId",
            "fieldList": [
                {
                    "fieldName": "wePagePath",
                    "fieldAlias": "页面路径",
                    "fieldType": "VARCHAR",
                    "fieldLength": 100,
                    "fieldDesc": "页面简单的path信息，获取方式:window.location.pathname",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "wePageTitle",
                    "fieldAlias": "页面标题",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "访问页面的title，一般获取方式document.title",
                    "groupByFlag": 1,
                    "weType": 0
                }, 
                {
                    "fieldName": "weAccessAddress",
                    "fieldAlias": "访问地址",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "访问页面的完整地址，不带参数，一般获取方式为window.location.href",
                    "groupByFlag": 1,
                    "weType": 0
                },
                 {
                    "fieldName": "weWebsitSource",
                    "fieldAlias": "网站来源",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "访问网站来源地址，一般获取方式为document.referrer",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "weLastPageTitle",
                    "fieldAlias": "上一个页面标题",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "上一个页面的title",
                    "groupByFlag": 1,
                    "weType": 0
                }, 
                {
                    "fieldName": "weLastPagePath",
                    "fieldAlias": "上一个页面路径",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "上一个页面的path",
                    "groupByFlag": 1,
                    "weType": 0
                },
            ]
        },


        // 2026年06月30日新增
        {
            "pointName": "【全埋点】App启动",
            "pointDesc": "App启动点位，冷启动(首次Activity.onResume)或热启动(从后台回前台)，携带启动类型和冷启动耗时",
            "weType": 1,
            "replacePointIdKey": "AppStartPointId",
            "fieldList": [
                {
                    "fieldName": "appStartType",
                    "fieldAlias": "启动类型",
                    "fieldType": "VARCHAR",
                    "fieldLength": 10,
                    "fieldDesc": "启动类型：cold(冷启动) / hot(热启动)",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "appStartDuration",
                    "fieldAlias": "冷启动耗时",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "冷启动耗时(ms)，从Application.onCreate到首个Activity显示",
                    "groupByFlag": 0,
                    "weType": 0
                }
            ]
        },
        {
            "pointName": "【全埋点】App进入后台",
            "pointDesc": "App进入后台点位，最后一个Activity.onPause且Activity计数器归零时触发，携带本次会话总时长",
            "weType": 1,
            "replacePointIdKey": "AppEndPointId",
            "fieldList": [
                {
                    "fieldName": "appSessionDuration",
                    "fieldAlias": "会话时长",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "本次会话总时长(ms)",
                    "groupByFlag": 0,
                    "weType": 0
                }
            ]
        },
        {
            "pointName": "【全埋点】App页面进入",
            "pointDesc": "App页面进入点位，Activity.onResume时触发，携带页面名称和来源页面",
            "weType": 1,
            "replacePointIdKey": "AppPageEnterPointId",
            "fieldList": [
                {
                    "fieldName": "appPageTitle",
                    "fieldAlias": "页面名称",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "页面名称",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "appPagePath",
                    "fieldAlias": "页面路径",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "页面路径",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "appReferPage",
                    "fieldAlias": "来源页面",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "来源页面，首次进入时为空",
                    "groupByFlag": 1,
                    "weType": 0
                }
            ]
        },
        {
            "pointName": "【全埋点】App页面离开",
            "pointDesc": "App页面离开点位，Activity.onPause时触发，携带页面名称和停留时长",
            "weType": 1,
            "replacePointIdKey": "AppPageLeavePointId",
            "fieldList": [
                {
                    "fieldName": "appPageTitle",
                    "fieldAlias": "页面名称",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "页面名称",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "appStayDuration",
                    "fieldAlias": "停留时长",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "停留时长(ms)，从appPageEnter到appPageLeave",
                    "groupByFlag": 0,
                    "weType": 0
                }
            ]
        },
        {
            "pointName": "【全埋点】App控件点击",
            "pointDesc": "App控件点击点位，用户点击控件时触发，同控件300ms内重复点击仅上报一次，通过AccessibilityDelegate挂DecorView实现",
            "weType": 1,
            "replacePointIdKey": "AppClickPointId",
            "fieldList": [
                {
                    "fieldName": "appViewId",
                    "fieldAlias": "控件ID",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "控件resource-id名称",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "appViewText",
                    "fieldAlias": "控件文本",
                    "fieldType": "VARCHAR",
                    "fieldLength": 500,
                    "fieldDesc": "Button/TextView文本或contentDescription",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "appViewType",
                    "fieldAlias": "控件类型",
                    "fieldType": "VARCHAR",
                    "fieldLength": 100,
                    "fieldDesc": "控件类名(如Button/TextView)",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "appPageTitle",
                    "fieldAlias": "所在页面",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "所在页面",
                    "groupByFlag": 1,
                    "weType": 0
                }
            ]
        },
        {
            "pointName": "【全埋点】App心跳",
            "pointDesc": "App心跳点位，前台期间按固定间隔(5s/15s/30s/60s可配置)重复上报，单次连续最多120次(0=不限制)，防止挂机无限上报",
            "weType": 1,
            "replacePointIdKey": "AppHeartBeatPointId",
            "fieldList": [
                {
                    "fieldName": "appPageTitle",
                    "fieldAlias": "当前页面",
                    "fieldType": "VARCHAR",
                    "fieldLength": 200,
                    "fieldDesc": "当前页面",
                    "groupByFlag": 1,
                    "weType": 0
                },
                {
                    "fieldName": "appStayDuration",
                    "fieldAlias": "停留累计秒数",
                    "fieldType": "INT",
                    "fieldLength": 10,
                    "fieldDesc": "本次停留累计秒数",
                    "groupByFlag": 0,
                    "weType": 0
                }
            ]
        },
    ]
    
    