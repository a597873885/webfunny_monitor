const { JavascriptErrorInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * JS错误信息接口
   */
  // 创建JS错误
  router.post('/javascriptErrorInfo', JavascriptErrorInfoController.create);
  // 获取JS错误列表
  router.get('/javascriptErrorInfo', JavascriptErrorInfoController.getJavascriptErrorInfoList);
  // 获取JS错误详情
  router.get('/javascriptErrorInfo/:id', JavascriptErrorInfoController.detail);
  // 删除JS错误
  router.delete('/javascriptErrorInfo/:id', JavascriptErrorInfoController.delete);
  // 根据message删除JS错误
  router.delete('/javascriptErrorInfo/:id', JavascriptErrorInfoController.delete);
  // 更改JS错误
  router.put('/javascriptErrorInfo/:id', JavascriptErrorInfoController.update);
  // 获取每分钟的js错误量
  router.post('/getJavascriptErrorCountByMinute', JavascriptErrorInfoController.getJavascriptErrorCountByMinute);
  // 获取每分钟的js错误量
  router.post('/getJsErrorTypeCountByMinute', JavascriptErrorInfoController.getJsErrorTypeCountByMinute);
  // 查询一个月内每天的错误总量
  router.get('/getJavascriptErrorInfoListByDay', JavascriptErrorInfoController.getJavascriptErrorInfoListByDay);
  // 查询一个月内每天自定义的错误总量
  router.get('/getConsoleErrorInfoListByDay', JavascriptErrorInfoController.getConsoleErrorInfoListByDay);
  // 查询一个天内每小时的错误量
  router.get('/getJavascriptErrorInfoListByHour', JavascriptErrorInfoController.getJavascriptErrorInfoListByHour);
  // 查询一个天内某个错误每小时的错误量
  router.post('/getJavascriptErrorCountListByHour', JavascriptErrorInfoController.getJavascriptErrorCountListByHour);
  // 查询一个天内某个错误每小时的错误量
  router.post('/getJsErrorCountListByHour', JavascriptErrorInfoController.getJsErrorCountListByHour);
  // 查询一个天内某个错误每小时的错误量
  router.get('/getJsErrorCountByHour', JavascriptErrorInfoController.getJsErrorCountByHour);
  // 查询一个天内每小时的自定义错误量
  router.get('/getJavascriptConsoleErrorInfoListByHour', JavascriptErrorInfoController.getJavascriptConsoleErrorInfoListByHour);
  // 根据JS错误数量进行分类排序
  router.post('/getJavascriptErrorSort', JavascriptErrorInfoController.getJavascriptErrorSort);
  // 根据JS错误数量进行分类排序
  router.post('/getJsErrorSort', JavascriptErrorInfoController.getJsErrorSort);
  // 根据JS错误获取相关信息
  router.post('/getJavascriptErrorSortInfo', JavascriptErrorInfoController.getJavascriptErrorSortInfo);
  // 根据JS错误获取相关信息
  router.post('/getJsErrorSortInfo', JavascriptErrorInfoController.getJsErrorSortInfo);
  router.post('/getConsoleErrorSort', JavascriptErrorInfoController.getConsoleErrorSort);
  // 获取最近24小时内，js错误发生数量
  router.get('/getJavascriptErrorCountByHour', JavascriptErrorInfoController.getJavascriptErrorCountByHour);
  // 获取各种平台js报错数量
  router.get('/getJavascriptErrorCountByOs', JavascriptErrorInfoController.getJavascriptErrorCountByOs);
  // 获取各种平台js分类报错数量
  router.get('/getJavascriptErrorCountByType', JavascriptErrorInfoController.getJavascriptErrorCountByType);
  // 根据ErrorMsg获取js错误列表
  router.post('/getJavascriptErrorListByMsg', JavascriptErrorInfoController.getJavascriptErrorListByMsg);
  // 根据ErrorMsg获取js相关信息
  router.post('/getJavascriptErrorAboutInfo', JavascriptErrorInfoController.getJavascriptErrorAboutInfo);
  // 根据ErrorMsg获取js相关信息
  router.post('/getJsErrorAboutInfo', JavascriptErrorInfoController.getJsErrorAboutInfo);
  // 根据页面获取js错误列表
  router.get('/getJavascriptErrorListByPage', JavascriptErrorInfoController.getJavascriptErrorListByPage);
  // 定位JS错误代码
  router.post('/getJavascriptErrorStackCode', JavascriptErrorInfoController.getJavascriptErrorStackCode);
  // 定位JS错误代码, 源码位置
  router.post('/getJavascriptErrorStackCodeForSource', JavascriptErrorInfoController.getJavascriptErrorStackCodeForSource);
  // 定位JS错误代码, url
  router.post('/getJavascriptErrorStackCodeForUrl', JavascriptErrorInfoController.getJavascriptErrorStackCodeForUrl);
  // 开始启动源码定位
  router.post('/startAnalysisSourceCode', JavascriptErrorInfoController.startAnalysisSourceCode);
  // 上传map文件
  router.post('/uploadMapFile', JavascriptErrorInfoController.uploadMapFile);
  // 根据版本号获取JS错误数量
  router.post('/getJsErrorCountByVersion', JavascriptErrorInfoController.getJsErrorCountByVersion);
  // 根据版本号获取JS错误数量,的相关详情
  router.post('/getJsErrorVersionSortInfo', JavascriptErrorInfoController.getJsErrorVersionSortInfo);

  /**大屏数据相关 */
  router.post('/getErrorInfoInRealTimeByMinute', JavascriptErrorInfoController.getErrorInfoInRealTimeByMinute);
}
