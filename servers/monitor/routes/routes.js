const {CustomerPvLeaveController,HttpErrorInfoController,ScreenShotInfoController,BehaviorInfoController,CustomerStayTimeController,AlarmRuleController,ConfigController,FailController,ExtendBehaviorInfoController,FunnelController,IgnoreErrorController,InfoCountByHourController,LocationPointGroupController,LocationPointTypeController,ResourceLoadInfoController,LocationPointController,MessageController,TeamController,VideosInfoController,CommonUtil,HttpLogInfoController,LoadPageInfoController,PageLoadInfoController,JavascriptErrorInfoController,AlarmController,UserController,UserTokenController,CommonUpLog,CustomerPVController,ProjectController,Common,TimerCalculateController, JsErrorHandleListController, HttpErrorHandleListController, CommonTableController} = require("../controllers/controllers.js")


const createRoutes = (router) => {
    /**
     * 日志相关处理
     */
    // 用户上传日志（h5）
    router.post('/upLog', Common.upLog);
    router.get('/upLog', Common.upLogGet);
    // 用户上传自定义日志（h5）
    router.post('/upMyLog', Common.upMyLog);
    // 用户上传日志 (小程序)
    router.post('/upMog', Common.upMog);
    // 用户上传debug日志
    router.post('/upDLog', Common.upDLog);
    // 上传拓展日志
    router.post('/uploadExtendLog', Common.uploadExtendLog);
    // 拓展行为日志
    router.post('/extendBehavior', ExtendBehaviorInfoController.create);


    /**
     * 单点登录相关
     */
    // 检查token是否有效
    router.post('/checkSsoToken', UserController.checkSsoToken);
    // 把有效token存入内存中
    router.post('/storeTokenToMemory', UserController.storeTokenToMemory);



    // 添加team
    router.post('/config', ConfigController.create);

    /**
     * 登录相关逻辑
     */
    // 获取用户列表
    router.post('/getUserList', UserController.getUserList);
    // 获取用户信息
    router.post('/getUserInfo', UserController.getUserInfo);
    // 获取简单的用户信息列表
    router.post('/getAllUserInfoForSimple', UserController.getAllUserInfoForSimple);
    // 管理员获取用户列表
    router.post('/getUserListByAdmin', UserController.getUserListByAdmin);
    

    // 新增消息
    router.post('/createMessage', MessageController.createNewMessage);
    // 获取消息
    router.post('/getMessageByType', MessageController.getMessageByType);
    // 阅读消息
    router.post('/readMessage', MessageController.readMessage);
    // 阅读全部
    router.post('/readAll', MessageController.readAll)

    // 更新激活码
    router.post('/createPurchaseCode', FailController.createPurchaseCode);
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
    router.post("/getWarningList", Common.getWarningList)
    // 获服务并发日志量
    router.post('/getConcurrencyByMinuteInHour', Common.getConcurrencyByMinuteInHour);


    // 添加team
    router.post('/team', TeamController.create);
    // 获取团队列表
    router.post("/getTeamList", TeamController.getTeamList)
    router.post("/addTeamMember", TeamController.addTeamMember)
    router.post("/createNewTeam", TeamController.createNewTeam)
    router.post("/createNewTeamForApi", TeamController.createNewTeamForApi)
    router.post('/deleteTeam', TeamController.deleteTeam);
    router.post('/moveProToTeam', TeamController.moveProToTeam)
    router.post('/updateTeamProjects', TeamController.updateTeamProjects)
    // 获取团队下的成员
    router.post("/getTeamMembersByWebMonitorId", TeamController.getTeamMembersByWebMonitorId)
    // 获取所有团队列表
    router.post("/getAllTeamList", TeamController.getAllTeamList)
    // 将团长移交给其他人
    router.post("/resetTeamLeader", TeamController.resetTeamLeader)
    

    // 更新监控系统
    router.post('/upgradeSystem', Common.upgradeSystem);
    

    /**
     * 应用接口
     */
    // 添加应用
    router.post('/project', ProjectController.create);
    // 获取应用详细信息
    router.get('/projectDetail', ProjectController.detail);
    // 获取应用列表
    router.get('/project/list', ProjectController.getProjectList);
    // 获取应用列表
    router.get('/webMonitorIdList', ProjectController.getWebMonitorIdList);
    // 获取应用详情
    router.get('/project/detail', ProjectController.getProjectDetail);
    // 获取应用简单详情
    router.get('/project/simpleDetail', ProjectController.getProjectSimpleDetail);
    // 更新启动列表
    router.get('/project/updateStartList', ProjectController.updateStartList);
    // 更新探针代码
    router.get('/project/updateMonitorCode', ProjectController.updateMonitorCode);
    // 获取所有应用列表
    router.get('/project/list/all', ProjectController.getAllProjectList);
    // 获取所有应用列表详情
    router.get('/project/detailList', ProjectController.getProjectDetailList);
    // 根据webmonitorId获取所有应用列表详情
    router.post('/projectSimpleListByWebmonitorIds', ProjectController.projectSimpleListByWebmonitorIds);
    // 查询所有项目的实时UV信息
    router.get('/project/getProjectInfoInRealTime', ProjectController.getProjectInfoInRealTime);
    // 查询所有项目的实时UV信息
    router.post('/project/getProjectInfoListInRealTime', ProjectController.getProjectInfoListInRealTime);
    // 创建新的监控项目
    router.post('/createNewProject', ProjectController.createNewProject);
    // 创建新的监控项目API
    router.post('/createNewProjectForApi', ProjectController.createNewProjectForApi);
    // 禁用项目
    router.post('/forbiddenProject', ProjectController.forbiddenProject);
    // 删除应用
    router.post('/deleteProject', ProjectController.delete);
    // 检查项目个数
    router.get('/checkProjectCount', ProjectController.checkProjectCount);
    // 获取userTags
    router.post('/getUserTags', ProjectController.getUserTags)
    // 保存userTags
    router.post('/saveUserTags', ProjectController.saveUserTags)
    // 获取项目配置
    router.post('/getProjectConfig', ProjectController.getProjectConfig)
    // 获取项目健康数量分类
    router.post('/getProjectHealthByScore', ProjectController.getProjectHealthByScore)
    // 保存项目配置
    router.post('/saveProjectConfig', ProjectController.saveProjectConfig)
    // 开启项目监控
    router.post('/openProject', ProjectController.openProject)
    // 关闭项目监控
    router.post('/closeProject', ProjectController.closeProject);
    // 保存警报信息相关
    router.post('/saveAlarmInfo', ProjectController.saveAlarmInfo)
    // 设置webHook
    router.post('/setWebHook', ProjectController.setWebHook);
    // 设置观察者
    router.post('/addViewers', ProjectController.addViewers);
    // 更新项目名称
    router.post('/saveNewProjectName', ProjectController.saveNewProjectName);
    /**
     * 用户访问信息接口
     */
    // 创建PV信息
    // router.post('/customerPV', CustomerPVController.create);
    // // 获取PV列表
    // router.get('/customerPV', CustomerPVController.getCustomerPVList);
    // // 获取PV详情
    // router.get('/customerPV/:id', CustomerPVController.detail);
    // // 删除PV
    // router.delete('/customerPV/:id', CustomerPVController.delete);
    // // 更改PV
    // router.put('/customerPV/:id', CustomerPVController.update);
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


    // 获取24小时内每小的跳出率
    router.post('/getCusLeavePercentByHour', CustomerPvLeaveController.getCusLeavePercentByHour);
    
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
    // 根据页面加载时间分类
    router.post('/getPageCountForLoadTimeGroupByDay', LoadPageInfoController.getPageCountForLoadTimeGroupByDay);
    // 获取某一天加载耗时分类
    router.post('/getPageCountForLoadTimeByDay', LoadPageInfoController.getPageCountForLoadTimeByDay);
    // 获取分类列表
    router.post('/getPageUrlListForLoadTime', LoadPageInfoController.getPageUrlListForLoadTime);
    // 获取页面影响人数
    router.post('/getPageUrlUserCount', LoadPageInfoController.getPageUrlUserCount);
    router.post('/getDifferentKindAvgLoadTimeListByHour', LoadPageInfoController.getDifferentKindAvgLoadTimeListByHour);
    router.post('/getDifferentKindAvgLoadTimeByHourForPageUrl', LoadPageInfoController.getDifferentKindAvgLoadTimeByHourForPageUrl);
    
    // 获取24小时分布
    router.get('/getPageUrlCountListByHour', LoadPageInfoController.getPageUrlCountListByHour);
    // 获取24小时分布
    router.post('/getPageUrlCountForHourByMinutes', LoadPageInfoController.getPageUrlCountForHourByMinutes);

    // 获取性能预览里边页面加载的各项指标
    router.post('/getPageLoadTimeForAll', LoadPageInfoController.getPageLoadTimeForAll);
    router.post('/getAvgLoadTimeForAllByHour', LoadPageInfoController.getAvgLoadTimeForAllByHour);
    router.post('/getPageLoadTimeByType', LoadPageInfoController.getPageLoadTimeByType);
    // 获取加载耗时列表top10
    router.post('/getPageLoadTimeListByUrl', LoadPageInfoController.getPageLoadTimeListByUrl);
    // 获取页面加载耗时占比
    router.post('/getPageLoadTimePercent', LoadPageInfoController.getPageLoadTimePercent);

    /**
     * 页面性能
     */
    // 创建加载信息
    router.post('/pageLoad', PageLoadInfoController.create);
    router.post('/getPageLoadOverview', PageLoadInfoController.getPageLoadOverview);
    router.post('/getPageLoadOverviewSimple', PageLoadInfoController.getPageLoadOverviewSimple);
    router.post('/getPerformanceDataForMinute', PageLoadInfoController.getPerformanceDataForMinute);
    router.post('/getPageCompleteLoadedDataForHour', PageLoadInfoController.getPageCompleteLoadedDataForHour);
    router.post('/getFastSlowDataForMinute', PageLoadInfoController.getFastSlowDataForMinute);
    router.post('/getPerfDataForUrlByDay', PageLoadInfoController.getPerfDataForUrlByDay);
    router.post('/getPerfDataForUrlByDaySimple', PageLoadInfoController.getPerfDataForUrlByDaySimple);
    router.post('/getPerfDataForWaterfall', PageLoadInfoController.getPerfDataForWaterfall);
    router.post('/getPerfDataForUrlDetail', PageLoadInfoController.getPerfDataForUrlDetail);
    router.post('/getPerfDataForMap', PageLoadInfoController.getPerfDataForMap);
    router.post('/getPerfInfoByVersion', PageLoadInfoController.getPerfInfoByVersion);
    router.post('/getPerfInfoByNetWork', PageLoadInfoController.getPerfInfoByNetWork);
    router.post('/getPerfInfoByOs', PageLoadInfoController.getPerfInfoByOs);

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



    /**
     * JS错误处理接口
     */
    // 创建JS错误处理信息
    router.post('/createJsErrorHandleList', JsErrorHandleListController.create);
    // 解决JS错误
    router.post('/resolveJsErrorInHandleList', JsErrorHandleListController.resolveJsErrorInHandleList);
    // 根据errorMessage判断解决状态
    router.post('/getSolveStatusByErrorMsg', JsErrorHandleListController.getSolveStatusByErrorMsg);
    // 处理概览
    router.post('/getSolveChartByErrorMsg', JsErrorHandleListController.getSolveChartByErrorMsg);

    /**
     * API接口错误处理接口
     */
    // 创建API接口错误处理信息
    router.post('/createHttpErrorHandleList', HttpErrorHandleListController.create);
    // 解决api接口错误
    router.post('/resolveHttpErrorInHandleList', HttpErrorHandleListController.resolveHttpErrorInHandleList);
    // 根据simpleHttpUrl判断解决状态
    router.post('/getSolveStatusBySimpleHttpUrl', HttpErrorHandleListController.getSolveStatusBySimpleHttpUrl);

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
    
    // 获取接口发生的页面
    router.post('/getPagesByHttpUrl', HttpLogInfoController.getPagesByHttpUrl);
    // 获取24小时分布
    router.get('/getHttpUrlCountListByHour', HttpLogInfoController.getHttpUrlCountListByHour);
    // 获取24小时分布
    router.post('/getHttpUrlCountForHourByMinutes', HttpLogInfoController.getHttpUrlCountForHourByMinutes);
    // 获取http接口请求的通用信息
    router.post('/getHttpLoadTimeForAll', HttpLogInfoController.getHttpLoadTimeForAll);
    // 获取接口加载耗时占比
    router.post('/getHttpLoadTimePercent', HttpLogInfoController.getHttpLoadTimePercent);
    router.post('/getHttpLoadTimePercentSimple', HttpLogInfoController.getHttpLoadTimePercentSimple);
    router.post('/getHttpLoadTimeListByUrl', HttpLogInfoController.getHttpLoadTimeListByUrl);

    /**大屏数据相关 */
    router.post('/getPvUvInRealTimeByMinute', CustomerPVController.getPvUvInRealTimeByMinute);
    router.post('/getHttpInfoInRealTimeByMinute', HttpLogInfoController.getHttpInfoInRealTimeByMinute);
    router.post('/getErrorInfoInRealTimeByMinute', JavascriptErrorInfoController.getErrorInfoInRealTimeByMinute);
    router.post('/getInitErrorInfoInRealTimeByTimeSize', CustomerPVController.getInitErrorInfoInRealTimeByTimeSize);
    

    /**
     * 埋点数据相关
     */
    // 创建埋点分组
    router.post('/createLocationPointGroup', LocationPointGroupController.create);
    router.post('/getGroupNameList', LocationPointGroupController.getGroupNameList);
    router.post("/getLocationPointGroupList", LocationPointGroupController.getLocationPointGroupList)
    router.post("/deleteLocationPointGroup", LocationPointGroupController.delete)


    // 创建埋点大分类
    router.post('/createLocationPointType', LocationPointTypeController.create);
    // 获取大分类列表
    router.post('/getLocationPointTypeList', LocationPointTypeController.getLocationPointTypeList)
    // 删除大分类
    router.post('/deleteLocationPointType', LocationPointTypeController.delete)
    // 获取一个月内，每天的埋点数量
    router.post('/locationPointCountForMonth', LocationPointController.locationPointCountForMonth);
    router.post("/getLocationPointForDay", LocationPointController.getLocationPointForDay)
    router.post("/getFunnelLeftCountForDay", LocationPointController.getFunnelLeftCountForDay)
    // 埋点上报接口
    router.post('/upBp', LocationPointController.createLocationPoint)
    router.get('/upBp', LocationPointController.createLocationPointForGet)

    // 创建漏斗分类
    router.post('/createFunnelType', FunnelController.create);
    router.post('/getFunnelList', FunnelController.getFunnelList)
    router.post('/deleteFunnel', FunnelController.delete)
    

    


    /**
     * 接口请求报错相关接口
     */
    // 获取接口请求出错的实时数据量
    router.get('/getHttpErrorCountByHour', HttpErrorInfoController.getHttpErrorInfoListByHour);
    // 获取每天的接口请求出错的数据量
    router.get('/getHttpErrorCountByDay', HttpErrorInfoController.getHttpErrorCountByDay);
    // 获取每天的出错的接口请求列表
    router.post('/getHttpErrorListByDay', HttpErrorInfoController.getHttpErrorListByDay);
    // 获取每天的出错的ErrorCode数量
    router.post('/getStatusListGroupByErrorCode', HttpErrorInfoController.getStatusListGroupByErrorCode);
    // 获取每天的出错的HttpUrl列表
    router.post('/getHttpErrorSort', HttpErrorInfoController.getHttpErrorSort);
    // 获取httpError详情
    router.post('/getHttpErrorSortInfo', HttpErrorInfoController.getHttpErrorSortInfo);
    // 根据版本号获取Http错误数量
    router.post('/getHttpErrorCountByVersion', HttpErrorInfoController.getHttpErrorCountByVersion);
    // 根据版本号获取HTTP错误数量,的相关详情
    router.post('/getHttpErrorVersionSortInfo', HttpErrorInfoController.getHttpErrorVersionSortInfo);
    // // 根据版本号获取JS错误数量
    // router.post('/getJsErrorCountByVersion', JavascriptErrorInfoController.getJsErrorCountByVersion);
    // // 根据版本号获取JS错误数量,的相关详情
    // router.post('/getJsErrorVersionSortInfo', JavascriptErrorInfoController.getJsErrorVersionSortInfo);
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

    //创建配置
    router.post('/changeLogServerStatus', Common.changeLogServerStatus)
    router.post('/changeMonitorStatus', Common.changeMonitorStatus)
    router.post('/changeWaitCounts', Common.changeWaitCounts)
    router.post('/changeSaveDays', Common.changeSaveDays)
    router.post('/saveMysqlConfigsForNew', Common.saveMysqlConfigs)
    router.get('/getLogServerStatusForNew', Common.getLogServerStatus)
    router.post('/changeMonitorStatus', Common.changeMonitorStatus)

    // 获取警报检查频率
    router.post('/getCheckTime', AlarmController.getCheckTime)
    // 设置警报检查频率
    router.post('/changeCheckTime', AlarmController.changeCheckTime)
    // 获取JsError报警参数
    router.post('/getJsErrorConfig', AlarmController.getJsErrorConfig)
    // 设置JsError报警参数
    router.post('/changeJsErrorConfig', AlarmController.changeJsErrorConfig)
    // 获取console Error报警参数
    router.post('/getConsoleErrorConfig', AlarmController.getConsoleErrorConfig)
    // 设置ConsoleError报警参数
    router.post('/changeConsoleErrorConfig', AlarmController.changeConsoleErrorConfig)
    // 获取Http Error报警参数
    router.post('/getHttpErrorConfig', AlarmController.getHttpErrorConfig)
    // 设置HttpError报警参数
    router.post('/changeHttpErrorConfig', AlarmController.changeHttpErrorConfig)
    // 获取Resource Error报警参数
    router.post('/getResourceErrorConfig', AlarmController.getResourceErrorConfig)
    // 设置ResourceError报警参数
    router.post('/changeResourceErrorConfig', AlarmController.changeResourceErrorConfig)

    // 新警报规则
    router.post('/createNewAlarmRule', AlarmRuleController.createNewAlarmRule);
    router.post('/getAllAlarmRule', AlarmRuleController.getAllAlarmRule);
    router.post('/deleteAlarmRule', AlarmRuleController.deleteAlarmRule);

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
     * 给后台提供的接口
     */
    // 查询某一天的使用UV数量
    router.post('/getUvCountForDay', CustomerPVController.getUvCountForDay);

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

    /**
     * 查询表名
     */
    router.post('/getTableList', CommonTableController.getTableList);
    /**
     * drop 表结构
     */
    router.post('/dropTable', CommonTableController.dropTable);
    /**
     * create表结构
     */
    router.post('/createLogTable', CommonTableController.createLogTable);
    /**
     * 更新表结构
     */
    router.post('/updateTableBySql', CommonTableController.updateTableBySql);
}

module.exports = {
    createRoutes
}