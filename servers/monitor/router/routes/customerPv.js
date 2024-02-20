const { CustomerPVController } = require("../../controllers/controllers.js")

module.exports = (router) => {
 // 获取一个月内，每天的uv数量
 router.post('/uvCountForMonth', CustomerPVController.uvCountForMonth);
 // 导出一个月内，每天的uv数量
 router.get('/exportUvCountForMonth', CustomerPVController.exportUvCountForMonth);
 // 获取每天的流量数据 
 router.post('/getTodayFlowDataByTenMin', CustomerPVController.getTodayFlowDataByTenMin);
 // 立即刷新每天的流量数据 
 router.post('/getTodayFlowData', CustomerPVController.getTodayFlowData);
 // 获取7天的平均pv数据 
 router.post('/getAvgPvInSevenDay', CustomerPVController.getAvgPvInSevenDay);
 // 获取日活量
 router.post('/getCustomerCountByTime', CustomerPVController.getCustomerCountByTime);
 // 获取24小时内每小时PV量
 router.post('/getPvCountByHour', CustomerPVController.getPvCountByHour);
 // 获取24小时内每小时新用户量
 router.post('/getNewCustomerCountByHour', CustomerPVController.getNewCustomerCountByHour);
 // 获取24小时内每小时用户的平均安装量
 router.post('/getInstallCountByHour', CustomerPVController.getInstallCountByHour);
 // 获取24小时内每小时UV量
 router.post('/getUvCountByHour', CustomerPVController.getUvCountByHour);
 // 获取24小时内每小时user数量
 router.post('/getUserCountByHour', CustomerPVController.getUserCountByHour);
 // 获取每秒钟的PV/UV量
 router.post('/getPvUvCountBySecond', CustomerPVController.getPvUvCountBySecond);
 // 获取每分钟的PV量
 router.post('/getPvCountByMinute', CustomerPVController.getPvCountByMinute);
 // 获取省份的人数
 router.post('/getProvinceCountBySeconds', CustomerPVController.getProvinceCountBySeconds);
 // 获取用户分布信息
 router.post('/getLocationDataForMap', CustomerPVController.getLocationDataForMap);
 // 获取用户标签的占比
 router.post('/getTagsPercent', CustomerPVController.getTagsPercent);

 // 获取每分钟的PV量
 router.post('/getAliveCusInRealTime', CustomerPVController.getAliveCusInRealTime);
 // 获取城市top10数量列表
 router.post('/getVersionCountOrderByCount', CustomerPVController.getVersionCountOrderByCount);
 // 获取城市top10数量列表
 router.post('/getCityCountOrderByCount', CustomerPVController.getCityCountOrderByCount);
 // 获取城市top20数量列表
 router.post('/getCityCountOrderByCountTop20', CustomerPVController.getCityCountOrderByCountTop20);
 // 获取设备top10数量列表
 router.post('/getDeviceCountOrderByCount', CustomerPVController.getDeviceCountOrderByCount);
 // 获取设备分辨率top10数量列表
 router.post('/getDeviceSizeCountOrderByCount', CustomerPVController.getDeviceSizeCountOrderByCount);
 // 获取系统版本top10数量列表
 router.post('/getOsCountOrderByCount', CustomerPVController.getOsCountOrderByCount);
 // 获取设备浏览器top10数量列表
 router.post('/getBrowserNameCountOrderByCount', CustomerPVController.getBrowserNameCountOrderByCount);
 // 获取来源网站top10数量列表
 router.post('/getReferrerCountOrderByCount', CustomerPVController.getReferrerCountOrderByCount);
 // 网站访问top10数量列表
 router.post('/getSimpleUrlCountOrderByCount', CustomerPVController.getSimpleUrlCountOrderByCount);
 // 查询用户的访问列表，分页
 router.post('/getPvListByPage', CustomerPVController.getPvListByPage);
 // 获取七天留存数量
 router.post('/getSevenDaysLeftCount', CustomerPVController.getSevenDaysLeftCount);
 // 次日留存率
 router.post('/getYesterdayLeftPercent', CustomerPVController.getYesterdayLeftPercent);

 /**大屏数据相关 */
 router.post('/getPvUvInRealTimeByMinute', CustomerPVController.getPvUvInRealTimeByMinute);
 router.post('/getInitErrorInfoInRealTimeByTimeSize', CustomerPVController.getInitErrorInfoInRealTimeByTimeSize);

 router.post('/getAccessCalendar', CustomerPVController.getAccessCalendar);
}
