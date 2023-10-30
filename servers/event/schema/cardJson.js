var cardJson = {
  pageId:1, //页面ID
  type:1,//卡片类型：1-柱状图，2-多折线，3-柱线图，4-堆叠图
  name:'卡片名称',
  calcRule: [
      { //计算规则
      calcName:"数据1",
      prePoint: {
        pointId:'点位ID1',
        calcField: { //计数字段
          fieldName:'字段名称',
          isRepeat:'0/1'//是否去重
        },
        queryCriteria: [//查询条件
          {
            fieldName:'字段名称',
            rule:'>=',//计算规则：>=，<=，=，>，<
            value:'数值'//（字符串）
          },
          {
            fieldName:'字段名称',
            rule:'<=',//计算规则：>=，<=，=，>，<
            value:'数值'//（字符串）
          }
        ]
      },
      calcType: '+-/',//加减除
      endPoint: {
        pointId:'点位ID2',
        calcField: { //计数字段
          fieldName:'字段名称',
          isRepeat:'0/1'//是否去重
        },
        queryCriteria: [//查询条件
          {
            fieldName:'字段名称',
            rule:'>=',//计算规则：>=，<=，=，>，<
            value:'数值'//（字符串）
          },
          {
            fieldName:'字段名称',
            rule:'<=',//计算规则：>=，<=，=，>，<
            value:'数值'//（字符串）
          }
        ]
      }
    }
  ]
}

