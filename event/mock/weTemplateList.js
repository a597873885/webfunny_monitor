module.exports = [
    {
        "templateName":"基础模版",
        "weKey":"we-base-afd12sdaweawq",
        "groupCount":1,
        "pageCount":1,
        "cardCount":6,
        "detail":
            {
                "type":1,
                "projectName":"基础项目",
                "groupList":[
                    {
                        "name":"默认分组",
                        "type":2,
                        "sort":1,
                        "pageList":[
                            {
                                "name":"默认看板",
                                "type":3,
                                "sort":1,
                                "cardList":[
                                    {
                                        "name":"实时流量",
                                        "type":6,
                                        "conversionCycle":1,
                                        "groupByFlag":0,
                                        "chartTableShow":"chart",
                                        "togetherList":"total,average,yoyRatio,ringRatio",
                                        "refreshFrequency":0,
                                        "calcRule":"[{\"calcName\":\"全站流量\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"0\"},\"pointId\":71,\"queryCriteria\":[]},\"calcNameKey\":\"quanzhanliuliang20230419015555\"},{\"calcName\":\"全站日活\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":71,\"queryCriteria\":[]},\"calcNameKey\":\"quanzhanrihuo20230419015555\"},{\"calcName\":\"订单量\",\"prePoint\":{\"calcField\":{\"fieldName\":\"dingDanHao\",\"isRepeat\":\"1\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"dingdanliang20230419015555\"},{\"calcName\":\"下单转化率\",\"prePoint\":{\"calcField\":{\"fieldName\":\"dingDanHao\",\"isRepeat\":\"1\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"xiadanzhuanhualu20230419015555\",\"endPoint\":{\"calcField\":{\"fieldName\":\"shenFenBiaoShi\",\"isRepeat\":\"1\"},\"pointId\":71,\"queryCriteria\":[]},\"calcType\":\"/\"}]"
                                    },
                                    {
                                        "name":"业务数据",
                                        "type":6,
                                        "conversionCycle":1,
                                        "groupByFlag":0,
                                        "chartTableShow":"chart",
                                        "togetherList":"total,average,yoyRatio,ringRatio",
                                        "refreshFrequency":0,
                                        "calcRule":"[{\"calcName\":\"注册用户数\",\"prePoint\":{\"calcField\":{\"fieldName\":\"shouJiHao\",\"isRepeat\":\"1\"},\"pointId\":72,\"queryCriteria\":[]},\"calcNameKey\":\"zhuceyonghushu20230419015856\"},{\"calcName\":\"下单人数\",\"prePoint\":{\"calcField\":{\"fieldName\":\"shenFenBiaoShi\",\"isRepeat\":\"1\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"xiadanrenshu20230419015856\"},{\"calcName\":\"客单价\",\"prePoint\":{\"calcField\":{\"fieldName\":\"dingDanZongE\",\"isRepeat\":\"2\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"kedanjie20230419015856\",\"endPoint\":{\"calcField\":{\"fieldName\":\"shenFenBiaoShi\",\"isRepeat\":\"1\"},\"pointId\":73,\"queryCriteria\":[]},\"calcType\":\"/\"},{\"calcName\":\"App平均使用时长\",\"prePoint\":{\"calcField\":{\"fieldName\":\"tingLiuShiJian\",\"isRepeat\":\"2\"},\"pointId\":75,\"queryCriteria\":[]},\"calcNameKey\":\"shuju420230421155443\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":71,\"queryCriteria\":[]},\"calcType\":\"/\"}]"
                                    },
                                    {
                                        "name":"GMV（成交总额）",
                                        "type":1,
                                        "conversionCycle":1,
                                        "groupByFlag":0,
                                        "chartTableShow":"chart",
                                        "togetherList":"total,average,yoyRatio,ringRatio",
                                        "refreshFrequency":0,
                                        "calcRule":"[{\"calcName\":\"订单支付总额\",\"prePoint\":{\"calcField\":{\"fieldName\":\"dingDanZongE\",\"isRepeat\":\"2\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"dingdanzhifuzonge20230419020457\"}]"
                                    },
                                    {
                                        "name":"日活量",
                                        "type":2,
                                        "conversionCycle":1,
                                        "groupByFlag":0,
                                        "chartTableShow":"chart",
                                        "togetherList":"total,average,yoyRatio,ringRatio",
                                        "refreshFrequency":0,
                                        "calcRule":"[{\"calcName\":\"全站流量的用户数\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":71,\"queryCriteria\":[]},\"calcNameKey\":\"quanzhanliuliangdeyonghushu20230419172848\"}]"
                                    }
                                ]
                            }
                        ]
                    }
                ]
       }
    },
    // {
    //     "templateName":"电商项目模板",
    //     "weKey":"we-base-afd12sdaweawq",
    //     "groupCount":1,
    //     "pageCount":2,
    //     "cardCount":4,
    //     "detail":
    //       {
    //         "type":1,
    //         "projectName":"电商项目",
    //         "groupList":[
    //             {
    //                 "name":"整体概览",
    //                 "type":2,
    //                 "sort":1,
    //                 "pageList":[
    //                     {
    //                         "name":"用户画像",
    //                         "type":3,
    //                         "sort":1,
    //                         "cardList":[

    //                         ]
    //                     },
    //                     {
    //                         "name":"基础指标监控",
    //                         "type":3,
    //                         "sort":2,
    //                         "cardList":[
    //                             {
    //                                 "name":"实时流量",
    //                                 "type":6,
    //                                 "pageId":266,
    //                                 "conversionCycle":1,
    //                                 "groupByFlag":0,
    //                                 "chartTableShow":"chart",
    //                                 "togetherList":"total,average,yoyRatio,ringRatio",
    //                                 "refreshFrequency":0,
    //                                 "calcRule":"[{\"calcName\":\"全站流量\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"0\"},\"pointId\":71,\"queryCriteria\":[]},\"calcNameKey\":\"quanzhanliuliang20230419015555\"},{\"calcName\":\"全站日活\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":71,\"queryCriteria\":[]},\"calcNameKey\":\"quanzhanrihuo20230419015555\"},{\"calcName\":\"订单量\",\"prePoint\":{\"calcField\":{\"fieldName\":\"dingDanHao\",\"isRepeat\":\"1\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"dingdanliang20230419015555\"},{\"calcName\":\"下单转化率\",\"prePoint\":{\"calcField\":{\"fieldName\":\"dingDanHao\",\"isRepeat\":\"1\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"xiadanzhuanhualu20230419015555\",\"endPoint\":{\"calcField\":{\"fieldName\":\"shenFenBiaoShi\",\"isRepeat\":\"1\"},\"pointId\":71,\"queryCriteria\":[]},\"calcType\":\"/\"}]"
    //                             },
    //                             {
    //                                 "name":"业务数据",
    //                                 "type":6,
    //                                 "pageId":266,
    //                                 "conversionCycle":1,
    //                                 "groupByFlag":0,
    //                                 "chartTableShow":"chart",
    //                                 "togetherList":"total,average,yoyRatio,ringRatio",
    //                                 "refreshFrequency":0,
    //                                 "calcRule":"[{\"calcName\":\"注册用户数\",\"prePoint\":{\"calcField\":{\"fieldName\":\"shouJiHao\",\"isRepeat\":\"1\"},\"pointId\":72,\"queryCriteria\":[]},\"calcNameKey\":\"zhuceyonghushu20230419015856\"},{\"calcName\":\"下单人数\",\"prePoint\":{\"calcField\":{\"fieldName\":\"shenFenBiaoShi\",\"isRepeat\":\"1\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"xiadanrenshu20230419015856\"},{\"calcName\":\"客单价\",\"prePoint\":{\"calcField\":{\"fieldName\":\"dingDanZongE\",\"isRepeat\":\"2\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"kedanjie20230419015856\",\"endPoint\":{\"calcField\":{\"fieldName\":\"shenFenBiaoShi\",\"isRepeat\":\"1\"},\"pointId\":73,\"queryCriteria\":[]},\"calcType\":\"/\"},{\"calcName\":\"App平均使用时长\",\"prePoint\":{\"calcField\":{\"fieldName\":\"tingLiuShiJian\",\"isRepeat\":\"2\"},\"pointId\":75,\"queryCriteria\":[]},\"calcNameKey\":\"shuju420230421155443\",\"endPoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":71,\"queryCriteria\":[]},\"calcType\":\"/\"}]"
    //                             },
    //                             {
    //                                 "name":"GMV（成交总额）",
    //                                 "type":1,
    //                                 "pageId":266,
    //                                 "conversionCycle":1,
    //                                 "groupByFlag":0,
    //                                 "chartTableShow":"chart",
    //                                 "togetherList":"total,average,yoyRatio,ringRatio",
    //                                 "refreshFrequency":0,
    //                                 "calcRule":"[{\"calcName\":\"订单支付总额\",\"prePoint\":{\"calcField\":{\"fieldName\":\"dingDanZongE\",\"isRepeat\":\"2\"},\"pointId\":73,\"queryCriteria\":[]},\"calcNameKey\":\"dingdanzhifuzonge20230419020457\"}]"
    //                             },
    //                             {
    //                                 "name":"日活量",
    //                                 "type":2,
    //                                 "pageId":266,
    //                                 "conversionCycle":1,
    //                                 "groupByFlag":0,
    //                                 "chartTableShow":"chart",
    //                                 "togetherList":"total,average,yoyRatio,ringRatio",
    //                                 "refreshFrequency":0,
    //                                 "calcRule":"[{\"calcName\":\"全站流量的用户数\",\"prePoint\":{\"calcField\":{\"fieldName\":\"weCustomerKey\",\"isRepeat\":\"1\"},\"pointId\":71,\"queryCriteria\":[]},\"calcNameKey\":\"quanzhanliuliangdeyonghushu20230419172848\"}]"
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //   }
    // },
]