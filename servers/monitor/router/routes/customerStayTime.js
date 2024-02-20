const { CustomerStayTimeController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 每小时的平均在线时长
  router.post('/getStayTimeForHour', CustomerStayTimeController.getStayTimeForHour);
  // 平均在线时长
  router.post('/getStayTimeForEveryDay', CustomerStayTimeController.getStayTimeForEveryDay);
  // 获取每天的平均在线时长和平均活跃时长
  router.post('/getAvgStayTimeForDay', CustomerStayTimeController.getAvgStayTimeForDay);
  // 获取每天的在线时长范围的正态分布图
  router.post('/getStayTimeScopeForDay', CustomerStayTimeController.getStayTimeScopeForDay);
  //根据userId获取每天的在线时长
  router.post('/getStayTimeForDayByPerson', CustomerStayTimeController.getStayTimeForDayByPerson);
  //根据userId获取每天的在线时长记录
  router.post('/getStayTimeForBehaviorByPerson', CustomerStayTimeController.getStayTimeForBehaviorByPerson);
  // 根据在线时间拍讯获取页面列表
  router.post('/getPageListOrderByStayTime', CustomerStayTimeController.getPageListOrderByStayTime);
}
