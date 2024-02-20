const { Common } = require("../../controllers/controllers.js")

module.exports = (router) => {
 // 用户上传日志（h5）
 router.post('/upLog', Common.upLog);
 router.post('/upLogs', Common.upLogs);
 router.get('/upLog', Common.upLogGet);
 // 用户上传自定义日志（h5）
 router.post('/upMyLog', Common.upMyLog);
 // 用户上传日志 (小程序)
 router.post('/upMog', Common.upMog);
 // 用户上传debug日志
 router.post('/upDLog', Common.upDLog);
 // 上传拓展日志
 router.post('/uploadExtendLog', Common.uploadExtendLog);

 // 查询用户的行为列表
 router.post('/searchCustomerBehaviors', Common.searchBehaviorsRecord);
 // 查询用户的行为列表2
 router.post('/searchCustomerRecords', Common.searchCustomerRecords);
 // 查询用户的基本信息
 router.post('/searchCustomerInfo', Common.searchCustomerInfo);
 // 查询用户的基本信息2
 router.post('/getCustomerBaseInfo', Common.getCustomerBaseInfo);
 // 查询报错情况
 router.post('/getErrorInfo', Common.getErrorInfo);
 // 获取警报信息
 router.post('/getWarningMsg', Common.getWarningMsg);
 router.post("/getWarningList", Common.getWarningList)
 // 获服务并发日志量
 router.post('/getConcurrencyByMinuteInHour', Common.getConcurrencyByMinuteInHour);

 //创建配置
 router.post('/changeLogServerStatus', Common.changeLogServerStatus)
 router.post('/changeMonitorStatus', Common.changeMonitorStatus)
 router.post('/changeWaitCounts', Common.changeWaitCounts)
 router.post('/changeSaveDays', Common.changeSaveDays)
 router.post('/saveMysqlConfigsForNew', Common.saveMysqlConfigs)
 router.get('/getLogServerStatusForNew', Common.getLogServerStatus)
 router.post('/changeMonitorStatus', Common.changeMonitorStatus)

 // 连接线上用户
 router.get('/connectUser', Common.connectUser)
 // 断开连接线上用户
 router.get('/disconnectUser', Common.disconnectUser)
 // 获取本地缓存信息
 router.get('/getDebugInfoForLocalInfo', Common.getDebugInfoForLocalInfo)
 // 清理本地缓存信息
 router.get('/clearLocalInfo', Common.clearLocalInfo)
 // 获取录屏信息
 router.get('/getDebugInfoForVideo', Common.getDebugInfoForVideo)
 // 获取行为记录信息
 router.get('/getDebugInfos', Common.getDebugInfos)
 router.get('/getHistoryDebugInfos', Common.getHistoryDebugInfos)
 router.get('/getDebugInfosForPage', Common.getDebugInfosForPage)

 /**
  * 推送信息相关
  */
 router.get('/pushInfo', Common.pushInfo);

 /**
  * 更新信息相关
  */
 router.get('/updateInfo', Common.updateInfo);

 /**
  * 版本校验
  */
 router.get('/monitorVersion', Common.monitorVersion);

 /**
  * 获取项目版本号
  */
 router.get('/projectVersion', Common.projectVersion);
 /**
  * 获取项目配置信息
  */
 router.get('/pf', Common.projectConfig);
 // 获取日志服务所有相关信息
 router.get('/getSysInfo', Common.getSysInfo);

 /**
  * mysql状态
  */
 router.get('/mysqlStatus', Common.checkMysqlStatus);




 /**
  * 应用中心相关
  */
 // 获取应用项目的基础信息
 router.post('/monitorBaseInfo', Common.monitorBaseInfo);

 /**
  * Docker 心跳检测
  */
 router.get('/health', Common.dockerHealth);

 /**
  * 测试接口
  */
 router.post('/test', Common.test);

 /**
  * 获取所有数据库表名
  */
 router.get('/getAllTableList', Common.getAllTableList);
}
