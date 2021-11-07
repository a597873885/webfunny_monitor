const {CustomerPvLeaveController,HttpErrorInfoController,ScreenShotInfoController,BehaviorInfoController,CustomerStayTimeController,AlarmRuleController,ConfigController,FailController,ExtendBehaviorInfoController,FunnelController,IgnoreErrorController,InfoCountByHourController,LocationPointGroupController,LocationPointTypeController,ResourceLoadInfoController,LocationPointController,MessageController,TeamController,VideosInfoController,CommonUtil,HttpLogInfoController,LoadPageInfoController,JavascriptErrorInfoController,AlarmController,UserController,UserTokenController,CommonUpLog,CustomerPVController,ProjectController,Common,TimerCalculateController} = require("../controllers/controllers.js")


const createRoutes = (router) => {

    // 获取警报检查频率
    router.post('/webfunny_d48c04f4a8ddd76cd66cddc3b8dfeab7', AlarmController.getCheckTime);
    
    // 设置警报检查频率
    router.post('/webfunny_61de0626dfe147817aa6ac7cec239b49', AlarmController.changeCheckTime);
    
    // 获取JsError报警参数
    router.post('/webfunny_98beb0c667bd8636e016ab31292fe5c9', AlarmController.getJsErrorConfig);
    
    // 设置JsError报警参数
    router.post('/webfunny_fa8e83714dea63b7d68096069836b5dd', AlarmController.changeJsErrorConfig);
    
    // 获取console Error报警参数
    router.post('/webfunny_9ba51423f857f4195644288619de5651', AlarmController.getConsoleErrorConfig);
    
    // 设置ConsoleError报警参数
    router.post('/webfunny_2073e6e7be2e59ef4e9af100bf2cf883', AlarmController.changeConsoleErrorConfig);
    
    // 获取Http Error报警参数
    router.post('/webfunny_1873895e1815b41efecd5d730e333753', AlarmController.getHttpErrorConfig);
    
    // 设置HttpError报警参数
    router.post('/webfunny_938cb43456664f53820df05ac6ef5aa5', AlarmController.changeHttpErrorConfig);
    
    // 获取Resource Error报警参数
    router.post('/webfunny_47774a360f6d2fcb8659297500fe2ab6', AlarmController.getResourceErrorConfig);
    
    // 设置ResourceError报警参数
    router.post('/webfunny_1a3474cc39a85018a082615077551d06', AlarmController.changeResourceErrorConfig);
    
    // 新警报规则
    router.post('/webfunny_d6054bd110018c169297fdbd215f4fbf', AlarmRuleController.createNewAlarmRule);
    
    // 待定
    router.post('/webfunny_7929fdc8dca95035a3cba72b58172727', AlarmRuleController.getAllAlarmRule);
    
    // 待定
    router.post('/webfunny_2fa0a02c517545b1f45a8020b848cefb', AlarmRuleController.deleteAlarmRule);
    
    // h5、pc、web等日志上报接口
    router.post('/upLog', Common.upLog);
    
    // 自定义日志上报接口
    router.post('/upMyLog', Common.upMyLog);
    
    // 微信小程序，uni-app日志上报接口
    router.post('/upMog', Common.upMog);
    
    // 用户连线时，日志上报接口
    router.post('/upDLog', Common.upDLog);
    
    // 上报拓展日志
    router.post('/uploadExtendLog', Common.uploadExtendLog);

    // 更新监控系统
    router.post('/upgradeSystem', Common.upgradeSystem);
    
    // 更新激活码
    router.post('/webfunny_e6e60baa89b06acfca24bb77b92697b4', FailController.createPurchaseCode);
    
    // 查询用户的行为列表
    router.post('/webfunny_2c168ebbc31469bb915ce3d82f95247f', Common.searchBehaviorsRecord);
    
    // 查询用户的基本信息
    router.post('/webfunny_abe35d4c9b79b792e2432d5c82380e7a', Common.searchCustomerInfo);
    
    // 查询报错情况
    router.post('/webfunny_bbae20ba2cb988bd362cf5e9ed396a77', Common.getErrorInfo);
    
    // 获取警报信息
    router.post('/webfunny_3d72e0cd4d4f5b6c381892fac8bff4cb', Common.getWarningMsg);
    
    // 
    router.post('/webfunny_62a576b3d6300e7d804016ab3d6479b7', Common.getWarningList);
    
    // 获服务并发日志量
    router.post('/webfunny_2b408f8152002b325d4955c09edfd9d4', Common.getConcurrencyByMinuteInHour);
    
    // //创建配置
    router.post('/webfunny_bd76747ccc4074cc1f14e034360c84f5', Common.changeLogServerStatus);
    
    // 待定
    router.post('/webfunny_51fa2c5c7babf017d7bc4d53a68ca125', Common.changeMonitorStatus);
    
    // 待定
    router.post('/webfunny_646b8c6a08a5860823d9f6fd128ade6c', Common.changeWaitCounts);
    
    // 待定
    router.post('/webfunny_842e61891fa19433aec8c27bedb5420e', Common.changeSaveDays);
    
    // 待定
    router.post('/webfunny_c16a8758e5a2c325793114ba6d7102bb', Common.saveMysqlConfigs);
    
    // 待定
    router.get('/webfunny_a8da6d28ece2e7e187538e3127f75f5e', Common.getLogServerStatus);
    
    // 连接线上用户
    router.get('/webfunny_64d548a1aa31c2d4bb75240c0715a0e1', Common.connectUser);
    
    // 断开连接线上用户
    router.get('/webfunny_0554ea654f5825ee78cca1132c93fc92', Common.disconnectUser);
    
    // 获取本地缓存信息
    router.get('/webfunny_52b866d888e72fdf3f7322ef724d5d01', Common.getDebugInfoForLocalInfo);
    
    // 清理本地缓存信息
    router.get('/webfunny_11cd07bb477505548c06ddc4e45deeff', Common.clearLocalInfo);
    
    // 获取录屏信息
    router.get('/webfunny_60dae920d077802f2631c447cbd0014f', Common.getDebugInfoForVideo);
    
    // 获取行为记录信息
    router.get('/webfunny_761ddede6c3ca630f1baa6712fa9ecc3', Common.getDebugInfos);
    
    // 待定
    router.get('/webfunny_a58954f62339e33d28e8387cc3b63e1e', Common.getHistoryDebugInfos);
    
    // 待定
    router.get('/webfunny_da427b3e6f8e39d558683b3c3ea85c94', Common.getDebugInfosForPage);
    
    // 推送信息相关
    router.get('/webfunny_0715e091b8a852cecbcd66d2a2358d09', Common.pushInfo);
    
    // 更新信息相关
    router.get('/webfunny_014d565fdb81a1902b295b9b3cf09938', Common.updateInfo);
    
    // 版本校验
    router.get('/webfunny_4e20532b2b238885d776e7d0f09ae299', Common.monitorVersion);
    
    // 获取项目版本号
    router.get('/webfunny_5eb896ad5f6135679e77b8e32346e840', Common.projectVersion);
    
    // 获取项目配置信息
    router.get('/webfunny_7287aa2c53d0a440da9db5614937e36f', Common.projectConfig);
    
    // 获取日志服务所有相关信息
    router.get('/webfunny_a98ebb38b8588dcd81bb316d6dba26b7', Common.getSysInfo);
    
    // mysql状态
    router.get('/webfunny_0c03b19af1d88ceb6e04741f19a59433', Common.checkMysqlStatus);
    
    // Docker 心跳检测
    router.get('/health', Common.dockerHealth);
    
    // 测试接口
    router.get('/webfunny_098f6bcd4621d373cade4e832627b4f6', Common.test);
    
    // 获取所有数据库表名
    router.get('/webfunny_db1efcdac9930ae4e61358b8acbebb46', Common.getAllTableList);
    
    // 创建配置信息(如：激活码)
    router.post('/webfunny_2245023265ae4cf87d02c8b6ba991139', ConfigController.create);
    
    // 获取一个月内，每天的uv数量
    router.post('/webfunny_590a4ca9d4831830466a39002583d081', CustomerPVController.uvCountForMonth);
    
    // 获取每天的流量数据 
    router.post('/webfunny_5b4a4be01e271d383f0c7fa3defccf0a', CustomerPVController.getTodayFlowDataByTenMin);
    
    // 立即刷新每天的流量数据 
    router.post('/webfunny_54467d97dc11a902a70cc1e666bf465b', CustomerPVController.getTodayFlowData);
    
    // 获取7天的平均pv数据 
    router.post('/webfunny_15adb13e4d42666effe9f648470b4d7f', CustomerPVController.getAvgPvInSevenDay);
    
    // 获取日活量
    router.post('/webfunny_cbf6a1232d59d1a9c7771e71d84df206', CustomerPVController.getCustomerCountByTime);
    
    // 获取24小时内每小时PV量
    router.post('/webfunny_33a3aea90a8f462c4c2e1b5b6dc0e45f', CustomerPVController.getPvCountByHour);
    
    // 获取24小时内每小时新用户量
    router.post('/webfunny_dae52c09ac6e0e9a819a32385530a430', CustomerPVController.getNewCustomerCountByHour);
    
    // 获取24小时内每小时用户的平均安装量
    router.post('/webfunny_96d322568e22804e4ec91d65fa16b8c2', CustomerPVController.getInstallCountByHour);
    
    // 获取24小时内每小时UV量
    router.post('/webfunny_d000e77a43d28715788ca416e83f4527', CustomerPVController.getUvCountByHour);
    
    // 获取24小时内每小时user数量
    router.post('/webfunny_cd0d2891b533725f9631e0374f5e62ed', CustomerPVController.getUserCountByHour);
    
    // 获取每秒钟的PV/UV量
    router.post('/webfunny_0705ab4c270d08cbe0d78db4f73fb796', CustomerPVController.getPvUvCountBySecond);
    
    // 获取每分钟的PV量
    router.post('/webfunny_0c71543900fe9278299f552c85dc0f03', CustomerPVController.getPvCountByMinute);
    
    // 获取省份的人数
    router.post('/webfunny_c03749fafd5663ec58f0c6e89011f87d', CustomerPVController.getProvinceCountBySeconds);
    
    // 获取用户分布信息
    router.post('/webfunny_3f3a9936f0cd045dddbe98e9a7193ca2', CustomerPVController.getLocationDataForMap);
    
    // 获取用户标签的占比
    router.post('/webfunny_dc019cf167d03ec48c71333e60150282', CustomerPVController.getTagsPercent);
    
    // 获取每分钟的PV量
    router.post('/webfunny_0fedb0700deb9007038a44aab52a9c83', CustomerPVController.getAliveCusInRealTime);
    
    // 获取城市top10数量列表
    router.post('/webfunny_e11c260f40fd5077b7a092449cce758e', CustomerPVController.getVersionCountOrderByCount);
    
    // 获取城市top10数量列表
    router.post('/webfunny_5610ed07ffb3d6a2713bfa9c271d204d', CustomerPVController.getCityCountOrderByCount);
    
    // 获取城市top20数量列表
    router.post('/webfunny_8f6f84f6d36c8085c0691676508d7b8e', CustomerPVController.getCityCountOrderByCountTop20);
    
    // 获取设备top10数量列表
    router.post('/webfunny_65d5be965b08a678284505a90d0586aa', CustomerPVController.getDeviceCountOrderByCount);
    
    // 获取设备浏览器top10数量列表
    router.post('/webfunny_0c814245d6cee924b1ea50629c6094f8', CustomerPVController.getBrowserNameCountOrderByCount);
    
    // 获取设备分辨率top10数量列表
    router.post('/webfunny_80a8c8abdced9b5afceddf945a4a68f8', CustomerPVController.getDeviceSizeCountOrderByCount);
    
    // 获取系统版本top10数量列表
    router.post('/webfunny_1599318925a28cfec590254122f32cda', CustomerPVController.getOsCountOrderByCount);
    
    // 获取来源网站top10数量列表
    router.post('/webfunny_ee6adc547ab6cbbd580969244eb384a5', CustomerPVController.getReferrerCountOrderByCount);


    // 查询用户的访问列表，分页
    router.post('/webfunny_19f0817816899398da81f613e4be9f8d', CustomerPVController.getPvListByPage);
    
    // 获取七天留存数量
    router.post('/webfunny_add3b21b089fdcd349cfbd84528d995a', CustomerPVController.getSevenDaysLeftCount);
    
    // 次日留存率
    router.post('/webfunny_e1c5ea188555b010b6c82bbcb0841805', CustomerPVController.getYesterdayLeftPercent);
    
    // 大屏实时数据
    router.post('/webfunny_60c1842a45aa8971d993703d510b9985', CustomerPVController.getPvUvInRealTimeByMinute);
    
    // 大屏实时数据
    router.post('/webfunny_8bb5ebf2138cf6c0825a2cbec466f015', CustomerPVController.getInitErrorInfoInRealTimeByTimeSize);
    
    // 查询某一天的使用UV数量
    router.post('/webfunny_7dc6b93ec98385ac4e38be1e4a24dfdc', CustomerPVController.getUvCountForDay);
    
    // 平均停留时长
    router.post('/webfunny_0f294062b494fdd6ccacae8d3481a257', CustomerStayTimeController.getStayTimeForEveryDay);
    
    // 获取24小时内每小的跳出率
    router.post('/webfunny_fefc8cd3fe796e807172686de825800a', CustomerPvLeaveController.getCusLeavePercentByHour);
    
    // 拓展行为日志
    router.post('/webfunny_208062a1711cf39f14fa09f6a6fc4c93', ExtendBehaviorInfoController.create);
    
    // 创建漏斗分类
    router.post('/webfunny_e3cf599f5d9d94c73689b4ea1d706612', FunnelController.create);
    
    // 待定
    router.post('/webfunny_b59fab022be8af846a03c555f200a90f', FunnelController.getFunnelList);
    
    // 待定
    router.post('/webfunny_3241bd3510f243f4fc4fa93df82d6cbb', FunnelController.delete);
    
    // 获取接口请求出错的实时数据量
    router.get('/webfunny_589d5dd1912b624b93e911b56d0f5911', HttpErrorInfoController.getHttpErrorInfoListByHour);
    
    // 获取每天的接口请求出错的数据量
    router.get('/webfunny_d506a2deca625a84d6e3034326e2e264', HttpErrorInfoController.getHttpErrorCountByDay);
    
    // 获取每天的出错的接口请求列表
    router.post('/webfunny_2201d191d8e37b25cfe05e641bdd8f7f', HttpErrorInfoController.getHttpErrorListByDay);
    
    // 根据url获取的出错的接口请求列表
    router.post('/webfunny_795ea40e3a5498132f8c4ca7e783b644', HttpErrorInfoController.getHttpErrorListByUrl);
    
    // 获取每分钟的http量
    router.post('/webfunny_34d5170e34b48cb1513e39adbb37031c', HttpLogInfoController.getHttpCountByMinute);
    
    // 根据加载时间分类
    router.post('/webfunny_5d4d7756ed6852e917452db56d80b6f5', HttpLogInfoController.getHttpCountForLoadTimeGroupByDay);
    
    // 获取分类列表
    router.post('/webfunny_a75a68e04069c097adb4bba6c1069ebb', HttpLogInfoController.getHttpUrlListForLoadTime);
    
    // 获取接口影响人数
    router.post('/webfunny_39aa19f1ddfe37cae287967167bd4609', HttpLogInfoController.getHttpUrlUserCount);
    
    // 获取接口发生的页面
    router.post('/webfunny_5475e00fdd851bb9253f309c7bb84577', HttpLogInfoController.getPagesByHttpUrl);
    
    // 获取24小时分布
    router.get('/webfunny_799d5cfe67fd9d21da5418aa0164a58e', HttpLogInfoController.getHttpUrlCountListByHour);
    
    // 获取24小时分布
    router.post('/webfunny_22828702cd3630bf3a9771913eb98091', HttpLogInfoController.getHttpUrlCountForHourByMinutes);
    
    // 获取http接口请求的通用信息
    router.post('/webfunny_808a070ab1cf9bc42e60b9ccbfd677e4', HttpLogInfoController.getHttpLoadTimeForAll);
    
    // 获取接口加载耗时占比
    router.post('/webfunny_83f8a37fb3cc7dc067697a507bac4889', HttpLogInfoController.getHttpLoadTimePercent);
    
    // 待定
    router.post('/webfunny_49d3bfee6f410ad46741c56d27632140', HttpLogInfoController.getHttpLoadTimeListByUrl);
    
    // 实时大屏
    router.post('/webfunny_2a9fd5255af93027602db284345029cb', HttpLogInfoController.getHttpInfoInRealTimeByMinute);
    
    // 获取忽略js错误信息列表
    router.get('/webfunny_e87233350c458dac000f36b3694caeff', IgnoreErrorController.getIgnoreErrorList);
    
    // 获取应用忽略js错误信息列表
    router.get('/webfunny_d9fbf3a07e435f5de9386a72c9ece9e0', IgnoreErrorController.ignoreErrorByApplication);
    
    // 获取忽略js错误信息详情
    router.get('/webfunny_70d0f6f9e9b0ba2df682145b24cafb32', IgnoreErrorController.detail);
    
    // 删除忽略js错误信息
    router.post('/webfunny_088fad35c18a3c7071b4f28717033371', IgnoreErrorController.delete);
    
    // 更改忽略js错误信息
    router.post('/webfunny_5d4c3055a1530301bc632a656381a298', IgnoreErrorController.update);
    
    // 获取JS错误列表
    router.get('/webfunny_a0559e5d8b5e3293d8a8e2b11f062990', JavascriptErrorInfoController.getJavascriptErrorInfoList);
    
    // 获取JS错误详情
    router.get('/webfunny_9234656146a2b4f6571dfa487b89c53a', JavascriptErrorInfoController.detail);
    
    // 删除JS错误
    router.post('/webfunny_498b49ed8ac244dc06e329048f12058a', JavascriptErrorInfoController.delete);
    
    // 更改JS错误
    router.post('/webfunny_b86068404ebee18c0f03b8db29a61ef0', JavascriptErrorInfoController.update);
    
    // 获取每分钟的js错误量
    router.post('/webfunny_1a4b963c049c8f4e89e2afd1f6e076f7', JavascriptErrorInfoController.getJavascriptErrorCountByMinute);
    
    // 查询一个月内每天的错误总量
    router.get('/webfunny_7f7eced59f83c6d9970f01d29dfaf126', JavascriptErrorInfoController.getJavascriptErrorInfoListByDay);
    
    // 查询一个月内每天自定义的错误总量
    router.get('/webfunny_d21858faa7a693e5333e10e68fd502f5', JavascriptErrorInfoController.getConsoleErrorInfoListByDay);
    
    // 查询一个天内每小时的错误量
    router.get('/webfunny_dbce772ab6e784f59d593e5fb41da8f5', JavascriptErrorInfoController.getJavascriptErrorInfoListByHour);
    
    // 查询一个天内某个错误每小时的错误量
    router.get('/webfunny_dafe68b1588ea55cb64bb1ba42eab2be', JavascriptErrorInfoController.getJavascriptErrorCountListByHour);
    
    // 查询一个天内某个错误每小时的错误量
    router.get('/webfunny_4b2dba201cfa31fa6fdf3460964c545a', JavascriptErrorInfoController.getJsErrorCountByHour);
    
    // 查询一个天内每小时的自定义错误量
    router.get('/webfunny_8f525a3f4865d4fd7e16a1fce957c014', JavascriptErrorInfoController.getJavascriptConsoleErrorInfoListByHour);
    
    // 根据JS错误数量进行分类排序
    router.post('/webfunny_a15bd211cba11ab41a65d9393440b7f2', JavascriptErrorInfoController.getJavascriptErrorSort);
    
    // 根据JS错误获取相关信息
    router.post('/webfunny_729954ba1eec1addc7e55105de33c9e8', JavascriptErrorInfoController.getJavascriptErrorSortInfo);
    
    // 待定
    router.post('/webfunny_4a4a7e8d053b9a8ff9c2549f4a8f4d99', JavascriptErrorInfoController.getConsoleErrorSort);
    
    // 获取最近24小时内，js错误发生数量
    router.get('/webfunny_9d189a32b34d22e6fce61cb09813b05b', JavascriptErrorInfoController.getJavascriptErrorCountByHour);
    
    // 获取各种平台js报错数量
    router.get('/webfunny_7d9b8af903ce349111d777bddc15765b', JavascriptErrorInfoController.getJavascriptErrorCountByOs);
    
    // 获取各种平台js分类报错数量
    router.get('/webfunny_163e258a4c4f31e41e7ae28af83a47da', JavascriptErrorInfoController.getJavascriptErrorCountByType);
    
    // 根据ErrorMsg获取js错误列表
    router.post('/webfunny_abdefa105213772d05d8b07eed32131f', JavascriptErrorInfoController.getJavascriptErrorListByMsg);
    
    // 根据ErrorMsg获取js错误列表
    router.post('/webfunny_3f1f6dc89139dc5de5a32e089cfb4542', JavascriptErrorInfoController.getJavascriptErrorAboutInfo);
    
    // 根据页面获取js错误列表
    router.get('/webfunny_6629c08ce72d1b3b68b57caad9df93af', JavascriptErrorInfoController.getJavascriptErrorListByPage);
    
    // 定位JS错误代码
    router.post('/webfunny_9215df53185dc94208da939832ff7e7e', JavascriptErrorInfoController.getJavascriptErrorStackCode);
    
    // 定位JS错误代码, 源码位置
    router.post('/webfunny_35a8706fb05054bd16dcaf53a47af60f', JavascriptErrorInfoController.getJavascriptErrorStackCodeForSource);
    
    // 定位JS错误代码, url
    router.post('/webfunny_6bc108239be4ddf855a2bc2793bc2837', JavascriptErrorInfoController.getJavascriptErrorStackCodeForUrl);
    
    // 上传map文件
    router.post('/webfunny_d4b8ed07b6982f6d08a6d4ad12205e13', JavascriptErrorInfoController.uploadMapFile);
    
    // 实时大屏
    router.post('/webfunny_f45ea70d7ef63152abfcd6ff3406522e', JavascriptErrorInfoController.getErrorInfoInRealTimeByMinute);
    
    // 创建加载信息
    router.post('/webfunny_9f8ab53b26206c3ffa81119ed48d44f8', LoadPageInfoController.create);
    
    // 获取加载信息详情
    router.get('/webfunny_6309fd1bcfb8eb68631edb7383ce5dad', LoadPageInfoController.detail);
    
    // 删除加载信息
    router.post('/webfunny_9475acabc70ef6c11d94cd918c058ba9', LoadPageInfoController.delete);
    
    // 更改加载信息
    router.post('/webfunny_3a66523a98f599af128895cfd66caa1b', LoadPageInfoController.update);
    
    // 查询当日页面加载的平均时间
    router.post('/webfunny_d89e7e52488d9fd68c6ee3903fc9500f', LoadPageInfoController.getPageLoadTimeByDate);
    
    // 根据页面加载时间分类
    router.post('/webfunny_f8b18ead41f189fa91faa6f742c17cd3', LoadPageInfoController.getPageCountForLoadTimeGroupByDay);
    
    // 获取某一天加载耗时分类
    router.post('/webfunny_33c5933043346aa32dd90a03f223c334', LoadPageInfoController.getPageCountForLoadTimeByDay);
    
    // 获取分类列表
    router.post('/webfunny_f61d88d2d0ffd5ad4e49f4ba17bd5c6a', LoadPageInfoController.getPageUrlListForLoadTime);
    
    // 获取页面影响人数
    router.post('/webfunny_42c74c18ab979cbfa9bacc0dc0a8d571', LoadPageInfoController.getPageUrlUserCount);
    
    // 待定
    router.post('/webfunny_7a8974bf2220374802ec8d0c15822dbc', LoadPageInfoController.getDifferentKindAvgLoadTimeListByHour);
    
    // 待定
    router.post('/webfunny_3547e82b85cddd4ed274ad0ee6e1d3d1', LoadPageInfoController.getDifferentKindAvgLoadTimeByHourForPageUrl);
    
    // 获取24小时分布
    router.get('/webfunny_fb706d9eb293d61a26f57ac5e6ee01d4', LoadPageInfoController.getPageUrlCountListByHour);
    
    // 获取24小时分布
    router.post('/webfunny_76e595411aaf8f354361299f26a1c79f', LoadPageInfoController.getPageUrlCountForHourByMinutes);
    
    // 获取性能预览里边页面加载的各项指标
    router.post('/webfunny_15682087b6167b7b08e3facc300d16f9', LoadPageInfoController.getPageLoadTimeForAll);
    
    // 待定
    router.post('/webfunny_461dade4147830bfadd2edfe55cc02a2', LoadPageInfoController.getAvgLoadTimeForAllByHour);
    
    // 待定
    router.post('/webfunny_60cbcb3dee51095f919c93d11a02c16e', LoadPageInfoController.getPageLoadTimeByType);
    
    // 获取加载耗时列表top10
    router.post('/webfunny_6398d597f0ac261c60eab7e4ec748e14', LoadPageInfoController.getPageLoadTimeListByUrl);
    
    // 获取页面加载耗时占比
    router.post('/webfunny_10dc0e85d4b6e53f53e02650ec9d8ff1', LoadPageInfoController.getPageLoadTimePercent);
    
    // 获取一个月内，每天的埋点数量
    router.post('/webfunny_62e80d9b92e9ab410da422755b9aeec2', LocationPointController.locationPointCountForMonth);
    
    // 待定
    router.post('/webfunny_2009075e075ac2863ef35184425aa5fb', LocationPointController.getLocationPointForDay);
    
    // 待定
    router.post('/webfunny_05fbfa93e5667533de450b6816ead7b2', LocationPointController.getFunnelLeftCountForDay);
    
    // 待定
    router.post('/upBp', LocationPointController.createLocationPoint)
    router.get('/upBp', LocationPointController.createLocationPointForGet)
    // 待定
    router.post('/webfunny_e0037b51f4db2e4dead2debb88277e99', LocationPointController.createLocationPointForGet);
    
    // 创建埋点分组
    router.post('/webfunny_e4dfae57774e4c0df8207effb90cb71e', LocationPointGroupController.create);
    
    // 待定
    router.post('/webfunny_bf65ddd7a9c68fd427d5253774980865', LocationPointGroupController.getGroupNameList);
    
    // 待定
    router.post('/webfunny_de88c3a764ba7e39f71aab84addc4a5a', LocationPointGroupController.getLocationPointGroupList);
    
    // 待定
    router.post('/webfunny_67ebe88d34943516792732400999d1bf', LocationPointGroupController.delete);
    
    // 创建埋点大分类
    router.post('/webfunny_0e9029cc33411d000d1665d543509c92', LocationPointTypeController.create);
    
    // 获取大分类列表
    router.post('/webfunny_a5ac00ec70aad9ea8caba687dc27b605', LocationPointTypeController.getLocationPointTypeList);
    
    // 删除大分类
    router.post('/webfunny_2cd4cb03404a2f6b58be46568235c47b', LocationPointTypeController.delete);
    
    // 新增消息
    router.post('/webfunny_3d6e16888ae0d0cc085add4c11e9b783', MessageController.createNewMessage);
    
    // 获取消息
    router.post('/webfunny_2be006ba38f27adfdb6f0df33723b73c', MessageController.getMessageByType);
    
    // 阅读消息
    router.post('/webfunny_44964f0b6bad042c0b0324d86fc88da3', MessageController.readMessage);
    
    // 阅读全部
    router.post('/webfunny_257a59b85c3a51f55b57f957fe405a03', MessageController.readAll);
    
    // 添加应用
    router.post('/webfunny_46f86faa6bbf9ac94a7e459509a20ed0', ProjectController.create);
    
    // 删除应用
    router.get('/webfunny_a20310dc313e032db48839dd9cf33586', ProjectController.deleteProject);
    
    // 获取应用详情
    router.get('/webfunny_06db9aa571eae4fb6c098a0aa064f7d3', ProjectController.getProjectDetail);
    
    // 获取应用列表
    router.get('/webfunny_ab3be0baacb19d5b398e3ad4e760e2d5', ProjectController.getProjectList);
    
    // 获取应用列表
    router.get('/webfunny_0ac2bb5572eb28f41bae06913134f69b', ProjectController.getWebMonitorIdList);
    
    // 更新启动列表
    router.get('/webfunny_bdb9739ba45e47a7204c7a8a8912dfff', ProjectController.updateStartList);
    
    // 更新探针代码
    router.get('/webfunny_af5e87864af4ad4b61b960c0b547d39c', ProjectController.updateMonitorCode);
    
    // 获取所有应用列表
    router.get('/webfunny_4c0cdce68ecdc6c4982f19090d52eaf1', ProjectController.getAllProjectList);
    
    // 获取所有应用列表详情
    router.get('/webfunny_fa6261b51a9de35b86b00bcc0a68d666', ProjectController.getProjectDetailList);
    
    // 查询所有项目的实时UV信息
    router.get('/webfunny_ffdcc457211a754df89de155ac004ebf', ProjectController.getProjectInfoInRealTime);
    
    // 查询所有项目的实时UV信息
    router.post('/webfunny_a26689466245d3aba3e362fa12a82311', ProjectController.getProjectInfoListInRealTime);
    
    // 创建新的监控项目
    router.post('/webfunny_a1467dfef841a648db9f7f74b2b6d21f', ProjectController.createNewProject);
    
    // 检查项目个数
    router.get('/webfunny_c4ad0230b01ac9589ad6a47002a7e219', ProjectController.checkProjectCount);
    
    // 获取userTags
    router.post('/webfunny_75248f0c0bf6779319f2c9b670caf85c', ProjectController.getUserTags);
    
    // 保存userTags
    router.post('/webfunny_0727672dca22761e2bb4db7d3af7d56a', ProjectController.saveUserTags);
    
    // 获取项目配置
    router.post('/webfunny_e952a810178d99e3c0aed35981f0d6bd', ProjectController.getProjectConfig);
    
    // 保存项目配置
    router.post('/webfunny_e279213b781489cdd43b7927af2cf104', ProjectController.saveProjectConfig);
    
    // 开启项目监控
    router.post('/webfunny_ab030e5f49cc02e37417e90821f7b018', ProjectController.openProject);
    
    // 保存警报信息相关
    router.post('/webfunny_5e78443f3f15e2de85f48b0a47119f5a', ProjectController.saveAlarmInfo);

    // 设置webHook
    router.post('/webfunny_b224f60cdaa1e0e2a09f2a5874ca0b9d', ProjectController.setWebHook);
    
    // 获取静态资源错误分类
    router.get('/webfunny_9fd23ee2b9c48826f685311e5f571329', ResourceLoadInfoController.getResourceErrorCountByDay);
    
    // 待定
    router.post('/webfunny_6043f6777e0edea57a60ac5a209c79aa', ResourceLoadInfoController.getResourceLoadInfoListByDay);
    
    // 获取最近24小时内，静态资源加载错误发生数量
    router.get('/webfunny_b077d2eb702348b4963e75e23a331a05', ResourceLoadInfoController.getResourceErrorCountByHour);
    
    // 添加team
    router.post('/webfunny_f894427cc1c571f79da49605ef8b112f', TeamController.create);
    
    // 获取团队列表
    router.post('/webfunny_fcd2c4ea9caa80e162e88047b94c5409', TeamController.getTeamList);
    
    // 添加团队成员
    router.post('/webfunny_41d284dd8c53d22291a742265d0438a4', TeamController.addTeamMember);
    
    // 创建新团队
    router.post('/webfunny_79604df4589714fa460185254a390b23', TeamController.createNewTeam);
    
    // 删除团队
    router.post('/webfunny_29c21f2ec8b0e77fd8f736ad18dd67b1', TeamController.deleteTeam);
    
    // 项目迁移至团队
    router.post('/webfunny_eb744df882d0487ed5ccfdd420b861a6', TeamController.moveProToTeam);
    
    // 更新团队项目
    router.post('/webfunny_ad31387a685236d434ab3b77fd97cae3', TeamController.updateTeamProjects);
    
    // 获取所有团队列表
    router.post('/webfunny_4a0101687b4f6afe1e515653aad4e433', TeamController.getAllTeamList);
    
    // 登录
    router.post('/webfunny_d56b699830e77ba53855679cb1d252da', UserController.login);
    
    // 重置验证码
    router.post('/webfunny_796747e71f479b3d5fb9da41b8869fe7', UserController.refreshValidateCode);
    
    // 获取验证码
    router.post('/webfunny_a7a773f7da320241a7ec1ca401486d44', UserController.getValidateCode);
    
    // 获取用户列表
    router.post('/webfunny_045ee1f3818104c02208700b4c164337', UserController.getUserList);
    
    // 获取简单的用户信息列表
    router.post('/webfunny_4ef1d0ac27c757999dfce4c2ba0ab0c2', UserController.getAllUserInfoForSimple);
    
    // 管理员获取用户列表
    router.post('/webfunny_496232d8e72efa28e491348653e771f4', UserController.getUserListByAdmin);
    
    // 忘记密码
    router.post('/webfunny_32b8a2fb28a36a8e47d0cb9abd4be404', UserController.forgetPwd);
    
    // 发送注册验证码
    router.post('/webfunny_623f6adc78b16f773a3f344a048141d6', UserController.sendRegisterEmail);
    
    // 给管理员发送确认邮件
    router.post('/webfunny_caf195fdcd0336dfa7e9e46e25336f0b', UserController.registerCheck);
    
    // 管理员注册接口
    router.post('/webfunny_5835306c873ebe5f5420b5d5ceb332d2', UserController.registerForAdmin);
    
    // 注册用户
    router.get('/webfunny_9de4a97425678c5b1288aa70c1669a64', UserController.register);
    
    // 重置密码
    router.get('/webfunny_00417bcb83b8e64fef38f6f6bbb3adac', UserController.resetPwd);
    
    // 激活用户
    router.post('/webfunny_d1850edd4a5efbbcca25fcb60fdf084b', UserController.activeRegisterMember);
    
    // 删除用户
    router.post('/webfunny_e3a69537f57dd34e3a1247b7d49a5610', UserController.deleteRegisterMember);
    
    // 创建token信息
    router.post('/webfunny_ce4a0b029c785bfaa2b398c06e1d94c0', UserTokenController.create);

}

module.exports = {
    createRoutes
}