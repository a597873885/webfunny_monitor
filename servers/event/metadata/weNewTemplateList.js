module.exports = [
    {
        "templateName":"基础模板(演示,不可用)",
        "weKey":"we-base-bc874f09-1909-872d-0adc-b2d55fad5b43",
        "groupCount":5,
        "pageCount":11,
        "cardCount":75,
        "templatePoint":'[{"pointId":"74","pointName":"浏览记录","pointDesc":"用户浏览页面的统计","weType":0,"replacePointIdKey":"","fieldList":[{"fieldName":"yeMianBiaoShi","fieldAlias":"页面标识","fieldType":"VARCHAR","fieldLength":100,"fieldDesc":"标识页面的唯一性，如：demo_home、demo_setting，代表某个具体页面","groupByFlag":1,"weType":0},{"fieldName":"yeMianLuJing","fieldAlias":"页面路径","fieldType":"VARCHAR","fieldLength":200,"fieldDesc":"获取方式:window.location.pathname","groupByFlag":1,"weType":0},{"fieldName":"yeMianYuMing","fieldAlias":"页面域名","fieldType":"VARCHAR","fieldLength":200,"fieldDesc":"页面的域名地址，一般为location.host","groupByFlag":1,"weType":0},{"fieldName":"wangZhanLaiYuan","fieldAlias":"网站来源","fieldType":"VARCHAR","fieldLength":200,"fieldDesc":"一般是document.referrer","groupByFlag":1,"weType":0},{"fieldName":"tuiGuangChuangYiId","fieldAlias":"推广创意ID","fieldType":"VARCHAR","fieldLength":100,"fieldDesc":"百度推广创意ID","groupByFlag":1,"weType":0},{"fieldName":"tuiGuangDanYuan","fieldAlias":"推广单元","fieldType":"VARCHAR","fieldLength":100,"fieldDesc":"百度推广单元名称","groupByFlag":1,"weType":0},{"fieldName":"xiangChaiTianShu","fieldAlias":"相差天数","fieldType":"INT","fieldLength":10,"fieldDesc":"时间差，一般用于次日，3日，7日留存率计算","groupByFlag":1,"weType":0},{"fieldName":"fangWenCiShu","fieldAlias":"访问次数","fieldType":"INT","fieldLength":10,"fieldDesc":"用户来访问的次数","groupByFlag":1,"weType":0}]},{"pointId":"73","pointName":"行为记录","pointDesc":"行为记录，描述用户行为","weType":0,"replacePointIdKey":"","fieldList":[{"fieldName":"behaviorType","fieldAlias":"行为类型","fieldType":"VARCHAR","fieldLength":50,"fieldDesc":"表示行为的类型：如：点击, 停留等","groupByFlag":1,"weType":0},{"fieldName":"yeMianYuMing","fieldAlias":"页面域名","fieldType":"VARCHAR","fieldLength":200,"fieldDesc":"页面的域名地址，一般为location.host","groupByFlag":1,"weType":0},{"fieldName":"wangZhanLaiYuan","fieldAlias":"网站来源","fieldType":"VARCHAR","fieldLength":200,"fieldDesc":"一般是document.referrer","groupByFlag":1,"weType":0},{"fieldName":"tuiGuangChuangYiId","fieldAlias":"推广创意ID","fieldType":"VARCHAR","fieldLength":100,"fieldDesc":"百度推广创意ID","groupByFlag":1,"weType":0},{"fieldName":"tuiGuangDanYuan","fieldAlias":"推广单元","fieldType":"VARCHAR","fieldLength":100,"fieldDesc":"百度推广单元名称","groupByFlag":1,"weType":0},{"fieldName":"xingWeiMiaoShu","fieldAlias":"行为描述","fieldType":"VARCHAR","fieldLength":200,"fieldDesc":"点击了什么，发生了什么","groupByFlag":1,"weType":0}]},{"pointId":"71","pointName":"点击分析","pointDesc":"鼠标点击分析点位，包含行为类型：点击/停留，页面地址：url，坐标x和y","weType":1,"replacePointIdKey":"HeatMapClickPointId","fieldList":[{"fieldName":"weFullPath","fieldAlias":"页面全路径","fieldType":"VARCHAR","fieldLength":2000,"fieldDesc":"页面全路径","groupByFlag":1,"weType":0},{"fieldName":"weTitle","fieldAlias":"元素标题","fieldType":"VARCHAR","fieldLength":500,"fieldDesc":"元素标题","groupByFlag":1,"weType":0},{"fieldName":"weXPath","fieldAlias":"元素路径","fieldType":"VARCHAR","fieldLength":500,"fieldDesc":"元素在dom结构中的详细路径，用于定位具体元素","groupByFlag":1,"weType":0},{"fieldName":"wePageX","fieldAlias":"x坐标","fieldType":"INT","fieldLength":10,"fieldDesc":"用于记录鼠标点击，鼠标停留的位置x坐标","groupByFlag":0,"weType":0},{"fieldName":"wePageY","fieldAlias":"y坐标","fieldType":"INT","fieldLength":10,"fieldDesc":"用于记录鼠标点击，鼠标停留的位置y坐标","groupByFlag":0,"weType":0},{"fieldName":"weScrollWidth","fieldAlias":"页面内容宽度","fieldType":"INT","fieldLength":10,"fieldDesc":"用于页面内容宽度，包含滚动具体的内容总宽度","groupByFlag":0,"weType":0},{"fieldName":"weScrollHeigh","fieldAlias":"页面内容高度","fieldType":"INT","fieldLength":10,"fieldDesc":"用于页面内容高度，包含滚动具体的内容总高度","groupByFlag":0,"weType":0},{"fieldName":"weRatio","fieldAlias":"像素比","fieldType":"INT","fieldLength":10,"fieldDesc":"物理尺寸，像素比","groupByFlag":0,"weType":0}]},{"pointId":"69","pointName":"心跳检测","pointDesc":"心跳检测点位，包含停留时间","weType":1,"replacePointIdKey":"HeartBeatPointId","fieldList":[{"fieldName":"stayTime","fieldAlias":"停留时长","fieldType":"FLOAT","fieldLength":10,"fieldDesc":"停留时长","groupByFlag":0,"weType":0}]},{"pointId":"158","pointName":"事件耗时","pointDesc":"完成一个事件的消耗时间","weType":0,"replacePointIdKey":"","fieldList":[{"fieldName":"xingWeiMiaoShu","fieldAlias":"行为描述","fieldType":"VARCHAR","fieldLength":200,"fieldDesc":"点击了什么，发生了什么","groupByFlag":1,"weType":0},{"fieldName":"xiaoHaoShiJian","fieldAlias":"消耗时间","fieldType":"INT","fieldLength":10,"fieldDesc":"消耗时间，单位：秒","groupByFlag":1,"weType":0}]}]',
        "detail": {
            "type": 1,
            "projectId": "event_20240430_192356218",
            "groupList": [
                {
                    "id": "6a511b40-48dc-11ef-b190-fd06b2db912c",
                    "name": "产品大盘数据",
                    "type": 2,
                    "sort": 1,
                    "pageList": [
                        {
                            "id": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                            "name": "流量大屏",
                            "type": 3,
                            "sort": 1,
                            "cardList": [
                                {
                                    "id": "e689a4c0-48dc-11ef-b190-fd06b2db912c",
                                    "name": "今日访问流量（PV）",
                                    "type": 6,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数量\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"0\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"shuliang20240723181826\"}]"
                                },
                                {
                                    "id": "00da3f10-48dd-11ef-b190-fd06b2db912c",
                                    "name": "今日访问人数（UV）",
                                    "type": 6,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240723181911\"}]"
                                },
                                {
                                    "id": "45a35320-4969-11ef-b190-fd06b2db912c",
                                    "name": "今日关注公众号人数",
                                    "type": 6,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数据1\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]},\"calcNameKey\":\"shuju120240724110316\"}]"
                                },
                                {
                                    "id": "6c25e030-4969-11ef-b190-fd06b2db912c",
                                    "name": "今日生成账号人数",
                                    "type": 6,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"完善信息\"}]},\"calcNameKey\":\"renshu20240724110420\"}]"
                                },
                                {
                                    "id": "8412fb20-4981-11ef-b190-fd06b2db912c",
                                    "name": "新用户趋势",
                                    "type": 1,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"weNewStatus\",\"rule\":\"等于\",\"value\":\"1\"}]},\"calcNameKey\":\"renshu20240724135648\"}]"
                                },
                                {
                                    "id": "b5f545d0-48dc-11ef-b190-fd06b2db912c",
                                    "name": "地域分布",
                                    "type": 7,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-map-world",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCountry\",\"isRepeat\":\"4\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240723181705\"}]"
                                },
                                {
                                    "id": "e3e37170-4980-11ef-b190-fd06b2db912c",
                                    "name": "关注趋势",
                                    "type": 4,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart-area",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]},\"calcNameKey\":\"renshu20240724135219\"}]"
                                },
                                {
                                    "id": "23c61b20-497d-11ef-b190-fd06b2db912c",
                                    "name": "生成账号趋势",
                                    "type": 2,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"完善信息\"}]},\"calcNameKey\":\"renshu20240724132529\"}]"
                                },
                                {
                                    "id": "9d1f3a20-4977-11ef-b190-fd06b2db912c",
                                    "name": "访问量趋势（pv、uv）",
                                    "type": 3,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"访问人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"fangwenrenshu20240724124555\"},{\"calcName\":\"访问流量\",\"unit\":\"次\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"0\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"fangwenliuliang20240724124555\"}]"
                                },
                                {
                                    "id": "d9957bc0-5356-11ef-b29a-6785943714a4",
                                    "name": "词云图",
                                    "type": 4,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-words",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"yeMianBiaoShi\",\"isRepeat\":\"4\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240806021635\"}]"
                                },
                                {
                                    "id": "da967300-497c-11ef-b190-fd06b2db912c",
                                    "name": "访问人数地区Top10",
                                    "type": 4,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-histogram",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weProvince\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240724132326\"}]"
                                },
                                {
                                    "id": "2a699d40-4e8b-11ef-9302-2514d075bfd5",
                                    "name": "用户访问-关注公众号",
                                    "type": 5,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 1,
                                    "groupByFlag": 0,
                                    "chartTableShow": "trend",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"浏览人数\",\"prePoint\":{\"pointId\":\"74\",\"calcField\":{\"fieldIndex\":0,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[]},\"calcNameKey\":\"liulanrenshu20240730234828\"},{\"calcName\":\"关注公众号\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":1,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]},\"calcNameKey\":\"guanzhugongzhonghao20240730234828\"}]"
                                },
                                {
                                    "id": "fc2d0da0-497f-11ef-b190-fd06b2db912c",
                                    "name": "用户浏览器使用占比",
                                    "type": 4,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-pie",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weBrowserName\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240724134551\"}]"
                                },
                                {
                                    "id": "45bf2110-4980-11ef-b190-fd06b2db912c",
                                    "name": "网站用户来源",
                                    "type": 4,
                                    "pageId": "9dd2fd30-48dc-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "table",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"wangZhanLaiYuan\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240724134754\"}]"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "208f54f0-498f-11ef-b190-fd06b2db912c",
                    "name": "用户行为分析",
                    "type": 2,
                    "sort": 2,
                    "pageList": [
                        {
                            "id": "6ddda0c0-4b76-11ef-b702-bbeb91371afe",
                            "name": "用户喜好分析",
                            "type": 3,
                            "sort": 1,
                            "cardList": [
                                {
                                    "id": "c5d8a480-4cd1-11ef-a75a-a9da7344f3a4",
                                    "name": "整体留存率分析",
                                    "type": 8,
                                    "pageId": "6ddda0c0-4b76-11ef-b702-bbeb91371afe",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[]"
                                },
                                {
                                    "id": "56f0cec0-4cd2-11ef-a75a-a9da7344f3a4",
                                    "name": "次日留存率",
                                    "type": 2,
                                    "pageId": "6ddda0c0-4b76-11ef-b702-bbeb91371afe",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"留存率\",\"unit\":\"%\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"xiangChaiTianShu\",\"rule\":\"等于\",\"value\":\"1\"}]},\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"xiangChaiTianShu\",\"rule\":\"等于\",\"value\":\"0\"}],\"day\":-1},\"calcType\":\"/\",\"calcNameKey\":\"liucunlu20240728191255\"}]"
                                },
                                {
                                    "id": "b7521310-4e34-11ef-bf1e-1d1ca7152d56",
                                    "name": "三日留存率",
                                    "type": 2,
                                    "pageId": "6ddda0c0-4b76-11ef-b702-bbeb91371afe",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"留存率\",\"unit\":\"%\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"xiangChaiTianShu\",\"rule\":\"等于\",\"value\":\"3\"}]},\"calcNameKey\":\"liucunlu20240730132939\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"xiangChaiTianShu\",\"rule\":\"等于\",\"value\":\"0\"}],\"day\":-1},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "397ba020-4996-11ef-b190-fd06b2db912c",
                                    "name": "用户访问页面Top10",
                                    "type": 4,
                                    "pageId": "6ddda0c0-4b76-11ef-b702-bbeb91371afe",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-histogram",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数量\",\"unit\":\"次\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"yeMianBiaoShi\",\"isRepeat\":\"4\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"shuliang20240724162502\"}]"
                                },
                                {
                                    "id": "cb9329e0-4e34-11ef-bf1e-1d1ca7152d56",
                                    "name": "七日留存率",
                                    "type": 2,
                                    "pageId": "6ddda0c0-4b76-11ef-b702-bbeb91371afe",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"留存率\",\"unit\":\"%\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"xiangChaiTianShu\",\"rule\":\"等于\",\"value\":\"7\"}]},\"calcNameKey\":\"liucunlu20240730133013\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"xiangChaiTianShu\",\"rule\":\"等于\",\"value\":\"0\"}],\"day\":-1},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "b0a85260-4b76-11ef-b702-bbeb91371afe",
                                    "name": "页面用户点击量占比",
                                    "type": 4,
                                    "pageId": "6ddda0c0-4b76-11ef-b702-bbeb91371afe",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-pie",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数量\",\"unit\":\"次\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weTitle\",\"isRepeat\":\"4\"},\"pointId\":\"71\",\"queryCriteria\":[]},\"calcNameKey\":\"shuliang20240727014421\"}]"
                                },
                                {
                                    "id": "cb574f00-4e58-11ef-b9c6-319b1a40579b",
                                    "name": "用户查看Demo偏好",
                                    "type": 4,
                                    "pageId": "6ddda0c0-4b76-11ef-b702-bbeb91371afe",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-stacking",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"xingWeiMiaoShu\",\"isRepeat\":\"5\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"behaviorType\",\"rule\":\"等于\",\"value\":\"Demo点击\"}]},\"calcNameKey\":\"shuju120240730174754\"}]"
                                }
                            ]
                        },
                        {
                            "id": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                            "name": "用户停留分析",
                            "type": 3,
                            "sort": 2,
                            "cardList": [
                                {
                                    "id": "763e15f0-4b72-11ef-b702-bbeb91371afe",
                                    "name": "总体和首页",
                                    "type": 8,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[]"
                                },
                                {
                                    "id": "7cc01d00-4993-11ef-b190-fd06b2db912c",
                                    "name": "用户平均停留时长(秒)",
                                    "type": 6,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"ms\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[]},\"calcNameKey\":\"shichang20240724160527\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "a6274920-4b64-11ef-9c73-51fd4f8784ba",
                                    "name": "用户停留时间变化趋势",
                                    "type": 1,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"停留时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[]},\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[]},\"calcType\":\"/\",\"calcNameKey\":\"tingliushichang20240726233512\"}]"
                                },
                                {
                                    "id": "dac2d870-4b64-11ef-9c73-51fd4f8784ba",
                                    "name": "首页停留时长(秒)",
                                    "type": 6,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/\"}]},\"calcNameKey\":\"shichang20240726233641\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/\"}]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "b72bf240-4b67-11ef-b702-bbeb91371afe",
                                    "name": "首页停留时间变化趋势",
                                    "type": 1,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"停留时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/\"}]},\"calcNameKey\":\"tingliushichang20240726235709\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/\"}]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "b5c116a0-4b72-11ef-b702-bbeb91371afe",
                                    "name": "产品页面",
                                    "type": 8,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[]"
                                },
                                {
                                    "id": "24847470-4b72-11ef-b702-bbeb91371afe",
                                    "name": "监控首页停留时长（秒）",
                                    "type": 6,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/webfunnyMonitor\"}]},\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/webfunnyMonitor\"}]},\"calcType\":\"/\",\"calcNameKey\":\"shichang20240727011148\"}]"
                                },
                                {
                                    "id": "40fe3050-4b72-11ef-b702-bbeb91371afe",
                                    "name": "监控首页停留时间趋势",
                                    "type": 1,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"停留时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/webfunnyMonitor\"}]},\"calcNameKey\":\"tingliushichang20240727011236\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/webfunnyMonitor\"}]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "859c1c50-4b67-11ef-b702-bbeb91371afe",
                                    "name": "埋点首页停留时长（秒）",
                                    "type": 6,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/webfunnyEvent\"}]},\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/webfunnyEvent\"}]},\"calcType\":\"/\",\"calcNameKey\":\"shichang20240726235546\"}]"
                                },
                                {
                                    "id": "3aae8c00-4b71-11ef-b702-bbeb91371afe",
                                    "name": "埋点首页停留时间趋势",
                                    "type": 1,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"停留时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/webfunnyEvent\"}]},\"calcNameKey\":\"tingliushichang20240727010515\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/webfunnyEvent\"}]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "e1313c70-4b72-11ef-b702-bbeb91371afe",
                                    "name": "其他页面",
                                    "type": 8,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[]"
                                },
                                {
                                    "id": "2fafcda0-4b67-11ef-b702-bbeb91371afe",
                                    "name": "价格页停留时长(秒)",
                                    "type": 6,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/price\"}]},\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/price\"}]},\"calcType\":\"/\",\"calcNameKey\":\"shichang20240726235322\"}]"
                                },
                                {
                                    "id": "5cbe0780-4b71-11ef-b702-bbeb91371afe",
                                    "name": "价格页停留时间趋势",
                                    "type": 1,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"停留时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/price\"}]},\"calcNameKey\":\"tingliushichang20240727010613\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/price\"}]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "7970a650-4b74-11ef-b702-bbeb91371afe",
                                    "name": "关于页停留时长(秒)",
                                    "type": 6,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/aboutUs\"}]},\"calcNameKey\":\"shichang20240727012829\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/aboutUs\"}]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "94faab00-4b74-11ef-b702-bbeb91371afe",
                                    "name": "关于页停留时间趋势",
                                    "type": 1,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"停留时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/aboutUs\"}]},\"calcNameKey\":\"tingliushichang20240727012915\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/aboutUs\"}]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "16911b40-4b75-11ef-b702-bbeb91371afe",
                                    "name": "监控文档页停留时长(秒) ",
                                    "type": 6,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/desMonitor\"}]},\"calcNameKey\":\"shichang20240727013253\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/desMonitor\"}]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "31e82910-4b75-11ef-b702-bbeb91371afe",
                                    "name": "监控文档页停留时间变化趋势",
                                    "type": 1,
                                    "pageId": "4cf636d0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"停留时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"stayTime\",\"isRepeat\":\"2\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/desMonitor\"}]},\"calcNameKey\":\"tingliushichang20240727013339\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"69\",\"queryCriteria\":[{\"fieldName\":\"wePath\",\"rule\":\"等于\",\"value\":\"https://www.webfunny.com/desMonitor\"}]},\"calcType\":\"/\"}]"
                                }
                            ]
                        },
                        {
                            "id": "329d69b0-4990-11ef-b190-fd06b2db912c",
                            "name": "登录注册分析",
                            "type": 3,
                            "sort": 3,
                            "cardList": [
                                {
                                    "id": "a0cbd1c0-4e35-11ef-bf1e-1d1ca7152d56",
                                    "name": "今日登录弹框曝光次数",
                                    "type": 6,
                                    "pageId": "329d69b0-4990-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数量\",\"unit\":\"次\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"0\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"登录弹框-曝光\"}]},\"calcNameKey\":\"shuliang20240730133610\"}]"
                                },
                                {
                                    "id": "ad662340-4e35-11ef-bf1e-1d1ca7152d56",
                                    "name": "登录弹框曝光人数",
                                    "type": 6,
                                    "pageId": "329d69b0-4990-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数量\",\"unit\":\"次\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"登录弹框-曝光\"}]},\"calcNameKey\":\"shuliang20240730133632\"}]"
                                },
                                {
                                    "id": "da8d6bf0-4e56-11ef-b9c6-319b1a40579b",
                                    "name": "关注流程耗时（秒）",
                                    "type": 6,
                                    "pageId": "329d69b0-4990-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"xiaoHaoShiJian\",\"isRepeat\":\"3\"},\"pointId\":\"158\",\"queryCriteria\":[]},\"calcNameKey\":\"shichang20240730173400\"}]"
                                },
                                {
                                    "id": "f94e31a0-4e56-11ef-b9c6-319b1a40579b",
                                    "name": "完善信息流程耗时",
                                    "type": 6,
                                    "pageId": "329d69b0-4990-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"时长\",\"unit\":\"s\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"xiaoHaoShiJian\",\"isRepeat\":\"3\"},\"pointId\":\"158\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"完善信息耗时\"}]},\"calcNameKey\":\"shichang20240730173452\"}]"
                                },
                                {
                                    "id": "70103f20-4e5e-11ef-bbb4-ffad1ca9c927",
                                    "name": "登录弹框曝光量趋势",
                                    "type": 1,
                                    "pageId": "329d69b0-4990-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数量\",\"unit\":\"次\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"0\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"登录弹框-曝光\"}]},\"calcNameKey\":\"shuliang20240730182818\"}]"
                                },
                                {
                                    "id": "b60de130-4e5e-11ef-bbb4-ffad1ca9c927",
                                    "name": "登录弹框曝光人数趋势",
                                    "type": 1,
                                    "pageId": "329d69b0-4990-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数量\",\"unit\":\"次\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"登录弹框-曝光\"}]},\"calcNameKey\":\"shuliang20240730183015\"}]"
                                },
                                {
                                    "id": "13024430-4e5f-11ef-bbb4-ffad1ca9c927",
                                    "name": "登录弹框后-完成关注比例",
                                    "type": 2,
                                    "pageId": "329d69b0-4990-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"百分比\",\"unit\":\"%\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]},\"calcNameKey\":\"baifenbi20240730183251\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"73\",\"queryCriteria\":[]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "62639dd0-4e5f-11ef-bbb4-ffad1ca9c927",
                                    "name": "用户关注漏斗",
                                    "type": 5,
                                    "pageId": "329d69b0-4990-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 1,
                                    "groupByFlag": 0,
                                    "chartTableShow": "trend",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"用户访问\",\"calcNameKey\":\"yonghufangwen20240730183505\",\"prePoint\":{\"pointId\":\"74\",\"calcField\":{\"fieldIndex\":0,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[]}},{\"calcName\":\"登录弹框曝光\",\"calcNameKey\":\"dengludankuangpuguang20240730183505\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":1,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"登录弹框-曝光\"}]}},{\"calcName\":\"完成关注\",\"calcNameKey\":\"wanchengguanzhu20240730183505\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":2,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]}}]"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "c08de390-498f-11ef-b190-fd06b2db912c",
                    "name": "运营渠道分析",
                    "type": 2,
                    "sort": 3,
                    "pageList": [
                        {
                            "id": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                            "name": "百度推广分析",
                            "type": 3,
                            "sort": 1,
                            "cardList": [
                                {
                                    "id": "0b962900-4e82-11ef-bbb4-ffad1ca9c927",
                                    "name": "百度自然流量来源人数(非广告)",
                                    "type": 6,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"baidu\"},{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"等于\",\"value\":\"none\"}]},\"calcNameKey\":\"renshu20240730224310\",\"combineType\":\"a\"}]"
                                },
                                {
                                    "id": "fd45f4b0-4e82-11ef-bbb4-ffad1ca9c927",
                                    "name": "百度来源趋势（非广告）",
                                    "type": 1,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"baidu\"},{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"等于\",\"value\":\"none\"}]},\"calcNameKey\":\"renshu20240730224957\",\"combineType\":\"a\"}]"
                                },
                                {
                                    "id": "9072f530-4e83-11ef-bbb4-ffad1ca9c927",
                                    "name": "通过百度广告来源人数",
                                    "type": 6,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"不等于\",\"value\":\"none\"}]},\"calcNameKey\":\"renshu20240730225404\"}]"
                                },
                                {
                                    "id": "e9928270-4e83-11ef-bbb4-ffad1ca9c927",
                                    "name": "百度广告来源人数趋势",
                                    "type": 1,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"不等于\",\"value\":\"none\"}]},\"calcNameKey\":\"renshu20240730225633\"}]"
                                },
                                {
                                    "id": "c38fde50-4e84-11ef-bbb4-ffad1ca9c927",
                                    "name": "百度广告来源人数占比",
                                    "type": 2,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"百分比\",\"unit\":\"%\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"不等于\",\"value\":\"none\"}]},\"calcNameKey\":\"baifenbi20240730230239\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcType\":\"/\"}]"
                                },
                                {
                                    "id": "0f9d2af0-4e85-11ef-bbb4-ffad1ca9c927",
                                    "name": "百度推广单元占比",
                                    "type": 4,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-pie",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"tuiGuangDanYuan\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"tuiGuangDanYuan\",\"rule\":\"不等于\",\"value\":\"none\"}]},\"calcNameKey\":\"renshu20240730230447\"}]"
                                },
                                {
                                    "id": "f1fc0610-4e84-11ef-bbb4-ffad1ca9c927",
                                    "name": "百度创意占比",
                                    "type": 4,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-pie",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"tuiGuangChuangYiId\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"不等于\",\"value\":\"none\"}]},\"calcNameKey\":\"renshu20240730230357\"}]"
                                },
                                {
                                    "id": "d8120380-4e89-11ef-9302-2514d075bfd5",
                                    "name": "百度广告来源用户-关注漏斗",
                                    "type": 5,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 1,
                                    "groupByFlag": 0,
                                    "chartTableShow": "trend",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"百度广告来源\",\"calcNameKey\":\"baiduguanggaolaiyuan20240730233901\",\"prePoint\":{\"pointId\":\"74\",\"calcField\":{\"fieldIndex\":0,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"不等于\",\"value\":\"none\"}]}},{\"calcName\":\"登录弹框曝光\",\"calcNameKey\":\"dengludankuangpuguang20240730233901\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":1,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"登录弹框-曝光\"}]}},{\"calcName\":\"关注完成\",\"calcNameKey\":\"guanzhuwancheng20240730233901\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":2,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]}}]"
                                },
                                {
                                    "id": "8f735b50-4e8a-11ef-9302-2514d075bfd5",
                                    "name": "百度自然流量来源用户-关注漏斗",
                                    "type": 5,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 1,
                                    "groupByFlag": 0,
                                    "chartTableShow": "trend",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"百度广告来源\",\"calcNameKey\":\"baiduguanggaolaiyuan20240730234409\",\"prePoint\":{\"pointId\":\"74\",\"calcField\":{\"fieldIndex\":0,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"等于\",\"value\":\"none\"},{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"baidu\"}]}},{\"calcName\":\"登录弹框曝光\",\"calcNameKey\":\"dengludankuangpuguang20240730234409\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":1,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"登录弹框-曝光\"}]}},{\"calcName\":\"关注完成\",\"calcNameKey\":\"guanzhuwancheng20240730234409\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":2,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]}}]"
                                },
                                {
                                    "id": "2a11d5c0-4e8a-11ef-9302-2514d075bfd5",
                                    "name": "非百度广告来源用户-关注漏斗",
                                    "type": 5,
                                    "pageId": "c7b2ceb0-498f-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 1,
                                    "groupByFlag": 0,
                                    "chartTableShow": "trend",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"非百度广告来源\",\"calcNameKey\":\"baiduguanggaolaiyuan20240730234118\",\"prePoint\":{\"pointId\":\"74\",\"calcField\":{\"fieldIndex\":0,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"等于\",\"value\":\"none\"}]}},{\"calcName\":\"登录弹框曝光\",\"calcNameKey\":\"dengludankuangpuguang20240730234118\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":1,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"登录弹框-曝光\"}]}},{\"calcName\":\"关注完成\",\"calcNameKey\":\"guanzhuwancheng20240730234118\",\"prePoint\":{\"pointId\":\"73\",\"calcField\":{\"fieldIndex\":2,\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\",\"andOr\":\"a\"},\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]}}]"
                                }
                            ]
                        },
                        {
                            "id": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                            "name": "自然流量统计",
                            "type": 3,
                            "sort": 2,
                            "cardList": [
                                {
                                    "id": "0a609260-4e86-11ef-9302-2514d075bfd5",
                                    "name": "流量来源分布",
                                    "type": 4,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-histogram",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"wangZhanLaiYuan\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240730231147\"}]"
                                },
                                {
                                    "id": "cd822f60-4e86-11ef-9302-2514d075bfd5",
                                    "name": "老网址重定向人数（cn）",
                                    "type": 1,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"webfunny.cn\"}]},\"calcNameKey\":\"renshu20240730231715\"}]"
                                },
                                {
                                    "id": "f96a6b60-4e86-11ef-9302-2514d075bfd5",
                                    "name": "GitHub引流人数",
                                    "type": 1,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"github\"}]},\"calcNameKey\":\"renshu20240730231828\"}]"
                                },
                                {
                                    "id": "b405c310-4e88-11ef-9302-2514d075bfd5",
                                    "name": "谷歌来源人数",
                                    "type": 1,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"google\"}]},\"calcNameKey\":\"renshu20240730233051\"}]"
                                },
                                {
                                    "id": "80717c80-4e86-11ef-9302-2514d075bfd5",
                                    "name": "必应来源人数",
                                    "type": 1,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"bing\"}]},\"calcNameKey\":\"renshu20240730231505\"}]"
                                },
                                {
                                    "id": "1e887480-4e89-11ef-9302-2514d075bfd5",
                                    "name": "Gitee来源人数",
                                    "type": 1,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"gitee\"}]},\"calcNameKey\":\"renshu20240730233350\"}]"
                                },
                                {
                                    "id": "56910c80-4e88-11ef-9302-2514d075bfd5",
                                    "name": "CSDN来源人数",
                                    "type": 2,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"csdn\"}]},\"calcNameKey\":\"renshu20240730232814\"}]"
                                },
                                {
                                    "id": "a021e770-4e88-11ef-9302-2514d075bfd5",
                                    "name": "知乎来源人数",
                                    "type": 4,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart-area",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"wangZhanLaiYuan\",\"rule\":\"包含\",\"value\":\"zhihu\"}]},\"calcNameKey\":\"renshu20240730233018\"}]"
                                },
                                {
                                    "id": "95d42ea0-5265-11ef-b510-b54c465be621",
                                    "name": "非百度来源人数",
                                    "type": 1,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "total,average,yoyRatio,ringRatio",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"等于\",\"value\":\"none\"}]},\"calcNameKey\":\"renshu20240804212933\"}]"
                                },
                                {
                                    "id": "05209290-5265-11ef-b510-b54c465be621",
                                    "name": "非百度广告来源人数/占比",
                                    "type": 3,
                                    "pageId": "bc1085e0-499c-11ef-b190-fd06b2db912c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"等于\",\"value\":\"none\"}]},\"calcNameKey\":\"renshu20240804212530\"},{\"calcName\":\"百分比\",\"unit\":\"%\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[{\"fieldName\":\"tuiGuangChuangYiId\",\"rule\":\"等于\",\"value\":\"none\"}]},\"calcNameKey\":\"baifenbi20240804212530\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcType\":\"/\"}]"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "001faa60-0e81-11ef-8cd6-992337c63550",
                    "name": "热力分析",
                    "type": 2,
                    "sort": 4,
                    "pageList": [
                        {
                            "id": "06c4de30-0e81-11ef-8cd6-992337c63550",
                            "name": "首页鼠标停留时长热力",
                            "type": 3,
                            "sort": 1,
                            "cardList": [
                                {
                                    "id": "4615f970-0e81-11ef-8cd6-992337c63550",
                                    "name": "首页鼠标停留热力",
                                    "type": 9,
                                    "pageId": "06c4de30-0e81-11ef-8cd6-992337c63550",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "{\"pageType\":\"wePath\",\"pageTitle\":\"Webfunny前端监控系统，实时掌握线上健康状态\",\"pageUrl\":\"https://www.webfunny.com/\",\"pageWidth\":\"1900\",\"replacePointIdKey\":\"HeatMapStopPointId\",\"heatMapType\":\"1\"}"
                                }
                            ]
                        },
                        {
                            "id": "7c82ed60-0e81-11ef-8cd6-992337c63550",
                            "name": "价格鼠标停留时长热力",
                            "type": 3,
                            "sort": 2,
                            "cardList": [
                                {
                                    "id": "b150d750-0e81-11ef-8cd6-992337c63550",
                                    "name": "价格页鼠标停留热力图",
                                    "type": 9,
                                    "pageId": "7c82ed60-0e81-11ef-8cd6-992337c63550",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "{\"pageType\":\"wePath\",\"pageTitle\":\"Webfunny价格页\",\"pageUrl\":\"https://www.webfunny.com/price\",\"pageWidth\":\"1900\",\"replacePointIdKey\":\"HeatMapStopPointId\",\"heatMapType\":\"1\"}"
                                }
                            ]
                        },
                        {
                            "id": "661a4630-0e82-11ef-8cd6-992337c63550",
                            "name": "价格页点击占比",
                            "type": 3,
                            "sort": 3,
                            "cardList": [
                                {
                                    "id": "11c141b0-0e82-11ef-8cd6-992337c63550",
                                    "name": "鼠标点击占比图",
                                    "type": 9,
                                    "pageId": "661a4630-0e82-11ef-8cd6-992337c63550",
                                    "conversionCycle": 0,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "{\"pageType\":\"wePath\",\"pageTitle\":\"Webfunny价格页\",\"pageUrl\":\"https://www.webfunny.com/price\",\"pageWidth\":\"1900\",\"replacePointIdKey\":\"HeatMapClickPointId\",\"heatMapType\":\"2\"}"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "77fdf430-4b0b-11ef-a00d-4daa7709532c",
                    "name": "留存分析",
                    "type": 2,
                    "sort": 5,
                    "pageList": [
                        {
                            "id": "a1229c00-4b0e-11ef-a00d-4daa7709532c",
                            "name": "用户关注留存",
                            "type": 3,
                            "sort": 1,
                            "cardList": [
                                {
                                    "id": "e4a760c0-4fee-11ef-b218-95190af85ebf",
                                    "name": "留存分析",
                                    "type": 10,
                                    "pageId": "a1229c00-4b0e-11ef-a00d-4daa7709532c",
                                    "conversionCycle": 1,
                                    "groupByFlag": 0,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"combineType\":\"a\",\"calcName\":\"初始行为\",\"prePoint\":{\"calcField\":{\"isRepeat\":\"0\",\"andOr\":\"a\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"chushixingwei20240801181452\"},{\"combineType\":\"a\",\"calcName\":\"后续行为\",\"prePoint\":{\"calcField\":{\"isRepeat\":\"0\",\"andOr\":\"a\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]},\"calcNameKey\":\"houxuxingwei20240801181452\"}]"
                                },
                                {
                                    "id": "a6d3b410-53db-11ef-b969-d3fb0c435e98",
                                    "name": "留存分析-表格",
                                    "type": 10,
                                    "pageId": "a1229c00-4b0e-11ef-a00d-4daa7709532c",
                                    "conversionCycle": 1,
                                    "groupByFlag": 0,
                                    "chartTableShow": "table",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"combineType\":\"a\",\"calcName\":\"初始行为\",\"prePoint\":{\"calcField\":{\"isRepeat\":\"0\",\"andOr\":\"a\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"chushixingwei20240806180713\"},{\"combineType\":\"a\",\"calcName\":\"后续行为\",\"prePoint\":{\"calcField\":{\"isRepeat\":\"0\",\"andOr\":\"a\"},\"pointId\":\"73\",\"queryCriteria\":[{\"fieldName\":\"xingWeiMiaoShu\",\"rule\":\"等于\",\"value\":\"关注成功\"}]},\"calcNameKey\":\"houxuxingwei20240806180713\"}]"
                                }
                            ]
                        },
                        {
                            "id": "9bf62580-4b0e-11ef-a00d-4daa7709532c",
                            "name": "其他",
                            "type": 3,
                            "sort": 2,
                            "cardList": [
                                {
                                    "id": "923338b0-52ea-11ef-b510-b54c465be621",
                                    "name": "中国地图",
                                    "type": 7,
                                    "pageId": "9bf62580-4b0e-11ef-a00d-4daa7709532c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weProvince\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240805132129\"}]"
                                },
                                {
                                    "id": "ac32ccd0-52ea-11ef-b510-b54c465be621",
                                    "name": "世界地图",
                                    "type": 7,
                                    "pageId": "9bf62580-4b0e-11ef-a00d-4daa7709532c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-map-world",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCountry\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240805132213\"}]"
                                },
                                {
                                    "id": "f34ec240-530d-11ef-b29a-6785943714a4",
                                    "name": "词云图",
                                    "type": 4,
                                    "pageId": "9bf62580-4b0e-11ef-a00d-4daa7709532c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-words",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"人数\",\"unit\":\"人\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"yeMianBiaoShi\",\"isRepeat\":\"5\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"renshu20240805173445\"}]"
                                },
                                {
                                    "id": "66d0afe0-5489-11ef-b969-d3fb0c435e98",
                                    "name": "省份关键词云",
                                    "type": 4,
                                    "pageId": "9bf62580-4b0e-11ef-a00d-4daa7709532c",
                                    "conversionCycle": 0,
                                    "groupByFlag": 1,
                                    "chartTableShow": "chart-words",
                                    "togetherList": "",
                                    "refreshFrequency": 0,
                                    "calcRule": "[{\"calcName\":\"数据1\",\"alarmId\":\"\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weProvince\",\"isRepeat\":\"4\"},\"pointId\":\"74\",\"queryCriteria\":[]},\"calcNameKey\":\"shuju120240807145058\"}]"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
]