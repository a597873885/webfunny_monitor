const {HttpLogInfoController,ScreenShotInfoController,BehaviorInfoController,HttpErrorInfoController,EmailCodeController,ExtendBehaviorInfoController,IgnoreErrorController,LoadPageInfoController,ProjectController,ResourceLoadInfoController,VideosInfoController,CustomerPVController,JavascriptErrorInfoController,Common} = require("../controllers/controllers.js")


const createRoutes = (router) => {
    /**
     * 日志相关处理
     */
    // 用户上传日志
    router.post('/upLog', Common.upLog);
    // 用户上传debug日志
    router.post('/upDLog', Common.upDLog);
    // 用户上传日志到消息队列
    // router2.post('/upLog', Common.upLogForRabbitMq);
    // 用户上传录屏信息
    // router.post('/upDebugLog', Common.upDebugLog);

    // 上传拓展日志
    router.post('/uploadExtendLog', Common.uploadExtendLog);
    router.post('/extendBehavior', ExtendBehaviorInfoController.create);

    // 立邦的开关逻辑
    router.get('/data', Common.liBangData);

    /**
     * Common 逻辑接口
     */
    // 查询用户的行为列表
    router.post('/searchCustomerBehaviors', Common.searchBehaviorsRecord);
    // 查询用户的基本信息
    router.post('/searchCustomerInfo', Common.searchCustomerInfo);
    // 查询报错情况
    router.post('/getErrorInfo', Common.getErrorInfo);
    // 获取警报信息
    router.post('/getWarningMsg', Common.getWarningMsg);
    // 获服务并发日志量
    router.post('/getConcurrencyByMinuteInHour', Common.getConcurrencyByMinuteInHour);


    /**
     * 应用接口
     */
    // 添加应用
    router.post('/project', ProjectController.create);
    // 删除应用
    router.get('/deleteProject', ProjectController.deleteProject);
    // 获取应用详细信息
    router.get('/projectDetail', ProjectController.detail);
    // 获取应用列表
    router.get('/project/list', ProjectController.getProjectList);
    // 获取应用详情
    router.get('/project/detail', ProjectController.getProjectDetail);
    // 更新启动列表
    router.get('/project/updateStartList', ProjectController.updateStartList);
    // 更新探针代码
    router.get('/project/updateMonitorCode', ProjectController.updateMonitorCode);
    // 获取所有应用列表
    router.get('/project/list/all', ProjectController.getAllProjectList);
    // 获取所有应用列表详情
    router.get('/project/detailList', ProjectController.getProjectDetailList);
    // 查询所有项目的实时UV信息
    router.get('/project/getProjectInfoInRealTime', ProjectController.getProjectInfoInRealTime);
    // 创建新的监控项目
    router.post('/createNewProject', ProjectController.createNewProject);
    // 创建新的监控项目
    router.get('/checkProjectCount', ProjectController.checkProjectCount);

    /**
     * 行为信息接口
     */
    // 创建文章
    router.post('/behaviorInfo', BehaviorInfoController.create);
    // 获取文章列表
    router.get('/behaviorInfo', BehaviorInfoController.getBehaviorInfoList);
    // 获取文章详情
    router.get('/behaviorInfo/:id', BehaviorInfoController.detail);
    // 删除文章
    router.delete('/behaviorInfo/:id', BehaviorInfoController.delete);
    // 更改文章
    router.put('/behaviorInfo/:id', BehaviorInfoController.update);

    /**
     * 用户访问信息接口
     */
    // 创建PV信息
    router.post('/customerPV', CustomerPVController.create);
    // 获取PV列表
    router.get('/customerPV', CustomerPVController.getCustomerPVList);
    // 获取PV详情
    router.get('/customerPV/:id', CustomerPVController.detail);
    // 删除PV
    router.delete('/customerPV/:id', CustomerPVController.delete);
    // 更改PV
    router.put('/customerPV/:id', CustomerPVController.update);
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
    // 获取每分钟的PV量
    router.post('/getProvinceCountBySeconds', CustomerPVController.getProvinceCountBySeconds);
    // 获取每分钟的PV量
    router.post('/getAliveCusInRealTime', CustomerPVController.getAliveCusInRealTime);
    // 获取城市top10数量列表
    router.post('/getVersionCountOrderByCount', CustomerPVController.getVersionCountOrderByCount);
    // 获取城市top10数量列表
    router.post('/getCityCountOrderByCount', CustomerPVController.getCityCountOrderByCount);
    // 获取设备top10数量列表
    router.post('/getDeviceCountOrderByCount', CustomerPVController.getDeviceCountOrderByCount);
    // 查询用户的访问列表，分页
    router.post('/getPvListByPage', CustomerPVController.getPvListByPage);
    // 获取七天留存数量
    router.post('/getSevenDaysLeftCount', CustomerPVController.getSevenDaysLeftCount);





    /**
     * 用户加载页面信息接口
     */
    // 创建加载信息
    router.post('/loadPage', LoadPageInfoController.create);
    // 获取加载信息详情
    router.get('/loadPage/:id', LoadPageInfoController.detail);
    // 删除加载信息
    router.delete('/loadPage/:id', LoadPageInfoController.delete);
    // 更改加载信息
    router.put('/loadPage/:id', LoadPageInfoController.update);
    // 查询当日页面加载的平均时间
    router.post('/getPageLoadTimeByDate', LoadPageInfoController.getPageLoadTimeByDate);

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
    // 更改JS错误
    router.put('/javascriptErrorInfo/:id', JavascriptErrorInfoController.update);
    // 获取每分钟的js错误量
    router.post('/getJavascriptErrorCountByMinute', JavascriptErrorInfoController.getJavascriptErrorCountByMinute);
    // 查询一个月内每天的错误总量
    router.get('/getJavascriptErrorInfoListByDay', JavascriptErrorInfoController.getJavascriptErrorInfoListByDay);
    // 查询一个月内每天自定义的错误总量
    router.get('/getConsoleErrorInfoListByDay', JavascriptErrorInfoController.getConsoleErrorInfoListByDay);
    // 查询一个天内每小时的错误量
    router.get('/getJavascriptErrorInfoListByHour', JavascriptErrorInfoController.getJavascriptErrorInfoListByHour);
    // 查询一个天内某个错误每小时的错误量
    router.get('/getJavascriptErrorCountListByHour', JavascriptErrorInfoController.getJavascriptErrorCountListByHour);
    // 查询一个天内某个错误每小时的错误量
    router.get('/getJsErrorCountByHour', JavascriptErrorInfoController.getJsErrorCountByHour);
    // 查询一个天内每小时的自定义错误量
    router.get('/getJavascriptConsoleErrorInfoListByHour', JavascriptErrorInfoController.getJavascriptConsoleErrorInfoListByHour);
    // 根据JS错误数量进行分类排序
    router.post('/getJavascriptErrorSort', JavascriptErrorInfoController.getJavascriptErrorSort);
    // 根据JS错误获取相关信息
    router.post('/getJavascriptErrorSortInfo', JavascriptErrorInfoController.getJavascriptErrorSortInfo);
    router.post('/getConsoleErrorSort', JavascriptErrorInfoController.getConsoleErrorSort);
    // 获取最近24小时内，js错误发生数量
    router.get('/getJavascriptErrorCountByHour', JavascriptErrorInfoController.getJavascriptErrorCountByHour);
    // 获取各种平台js报错数量
    router.get('/getJavascriptErrorCountByOs', JavascriptErrorInfoController.getJavascriptErrorCountByOs);
    // 获取各种平台js分类报错数量
    router.get('/getJavascriptErrorCountByType', JavascriptErrorInfoController.getJavascriptErrorCountByType);
    // 根据ErrorMsg获取js错误列表
    router.post('/getJavascriptErrorListByMsg', JavascriptErrorInfoController.getJavascriptErrorListByMsg);
    // 根据ErrorMsg获取js错误列表
    router.post('/getJavascriptErrorAboutInfo', JavascriptErrorInfoController.getJavascriptErrorAboutInfo);
    // 根据页面获取js错误列表
    router.get('/getJavascriptErrorListByPage', JavascriptErrorInfoController.getJavascriptErrorListByPage);
    // 定位JS错误代码
    router.post('/getJavascriptErrorStackCode', JavascriptErrorInfoController.getJavascriptErrorStackCode);

    /**
     * JS错误信息截屏接口
     */
    // 创建截屏信息
    router.post('/screenShotInfo', ScreenShotInfoController.create);
    // 获取忽略js截屏信息列表
    router.get('/getScreenShotInfoListByPage', ScreenShotInfoController.getScreenShotInfoListByPage);
    // 获取截屏详情
    router.get('/screenShotInfo/:id', ScreenShotInfoController.detail);
    // 删除截屏
    router.delete('/screenShotInfo/:id', ScreenShotInfoController.delete);
    /**
     * 忽略js错误信息接口
     */
    // 创建忽略js错误信息
    router.post('/ignoreError', IgnoreErrorController.create);
    // 获取忽略js错误信息列表
    router.get('/ignoreError', IgnoreErrorController.getIgnoreErrorList);
    // 获取应用忽略js错误信息列表
    router.get('/ignoreErrorByApplication', IgnoreErrorController.ignoreErrorByApplication);
    // 获取忽略js错误信息详情
    router.get('/ignoreError/:id', IgnoreErrorController.detail);
    // 删除忽略js错误信息
    router.delete('/ignoreError/:id', IgnoreErrorController.delete);
    // 更改忽略js错误信息
    router.put('/ignoreError/:id', IgnoreErrorController.update);

    /**
     * 静态资源加载状态接口
     */
    // 获取静态资源错误分类
    router.get('/getResourceErrorCountByDay', ResourceLoadInfoController.getResourceErrorCountByDay);
    router.post('/getResourceLoadInfoListByDay', ResourceLoadInfoController.getResourceLoadInfoListByDay);
    // 获取最近24小时内，静态资源加载错误发生数量
    router.get('/getResourceErrorCountByHour', ResourceLoadInfoController.getResourceErrorCountByHour);


    // 获取每分钟的http量
    router.post('/getHttpCountByMinute', HttpLogInfoController.getHttpCountByMinute);
    // 根据加载时间分类
    router.post('/getHttpCountForLoadTimeGroupByDay', HttpLogInfoController.getHttpCountForLoadTimeGroupByDay);
    // 获取分类列表
    router.post('/getHttpUrlListForLoadTime', HttpLogInfoController.getHttpUrlListForLoadTime);
    // 获取接口影响人数
    router.post('/getHttpUrlUserCount', HttpLogInfoController.getHttpUrlUserCount);
    // 获取24小时分布
    router.get('/getHttpUrlCountListByHour', HttpLogInfoController.getHttpUrlCountListByHour);
    // 获取24小时分布
    router.post('/getHttpUrlCountForHourByMinutes', HttpLogInfoController.getHttpUrlCountForHourByMinutes);


    /**
     * 接口请求报错相关接口
     */
    // 获取接口请求出错的实时数据量
    router.get('/getHttpErrorCountByHour', HttpErrorInfoController.getHttpErrorInfoListByHour);
    // 获取每天的接口请求出错的数据量
    router.get('/getHttpErrorCountByDay', HttpErrorInfoController.getHttpErrorCountByDay);
    // 获取每天的出错的接口请求列表
    router.post('/getHttpErrorListByDay', HttpErrorInfoController.getHttpErrorListByDay);
    // 根据url获取的出错的接口请求列表
    router.post('/getHttpErrorListByUrl', HttpErrorInfoController.getHttpErrorListByUrl);


    // 获取服务器状态数据
    // router.get('/getServerStatus', Common.getServerStatus);

    /**
     * 用户访问录屏信息
     */
    // 创建录屏信息
    // router.post('/videosInfo', VideosInfoController.create);
    // 
    router.post('/getVideosEvent', VideosInfoController.getVideosEvent)

    // 创建验证码信息
    router.post('/emailCode', EmailCodeController.create);
    // 获取加载信息详情
    router.get('/emailCode/:id', EmailCodeController.detail);
    // 删除加载信息
    router.delete('/emailCode/:id', EmailCodeController.delete);
    // 更改加载信息
    router.put('/emailCode/:id', EmailCodeController.update);
    // 生成验证码
    router.post('/sendEmailCode', EmailCodeController.sendEmailCode);

    //创建配置
    router.post('/createConfig', Common.createConfig)
    router.post('/changeLogServerStatus', Common.changeLogServerStatus)
    router.post('/changeWaitCounts', Common.changeWaitCounts)
    router.get('/getLogServerStatus', Common.getLogServerStatus)

    // 连接线上用户
    router.get('/connectUser', Common.connectUser)
    router.get('/getDebugInfoForLocalInfo', Common.getDebugInfoForLocalInfo)
    router.get('/getDebugInfoForVideo', Common.getDebugInfoForVideo)

    /**
     * git stars 相关信息
     */
    router.get('/gitStars', Common.gitStars);

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



    // 测试接口
    router.get('/testBehaviors', BehaviorInfoController.testBehavior);

    
    /**
     * 给后台提供的接口
     */
    // 查询某一天的使用UV数量
    router.post('/getUvCountForDay', CustomerPVController.getUvCountForDay);


    /**
     * 废弃接口
     */
    router.post('/searchUserBehaviors', Common.abortApis);

}

module.exports = {
    createRoutes
}