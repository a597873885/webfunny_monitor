const {BuryPointAlarmController, BuryPointAlarmMessageController,WeHandleDataController,BuryPointTaskController,SysInfoController,CommonUpLog,BuryPointCardController,BuryPointCardStatisticsController,BuryPointFieldController,BuryPointWarehouseController,BuryPointTestController,ConfigController,MessageController,TeamController,TimerStatisticController,CommonUtil,BuryPointProjectController,BuryPointTemplateController,Common,SdkReleaseController,UserController,FailController} = require("../controllers/controllers.js")

const createRoutes = (router) => {
    /**
     * 日志相关处理
     */
    // 用户上传日志（h5）
    router.post('/upLog', Common.upLog);

    // 添加team
    router.post('/config', ConfigController.create);

    /**
     * 登录相关逻辑
     */
    // 登录
    router.post('/login', UserController.login);
    // 重置验证码
    router.post('/refreshValidateCode', UserController.refreshValidateCode)
    // 获取验证码
    router.post('/getValidateCode', UserController.getValidateCode)
    // 获取用户列表
    router.post('/getUserList', UserController.getUserList);
    // 获取简单的用户信息列表
    router.post('/getAllUserInfoForSimple', UserController.getAllUserInfoForSimple);
    // 管理员获取用户列表
    router.post('/getUserListByAdmin', UserController.getUserListByAdmin);
    // 忘记密码
    router.post('/forgetPwd', UserController.forgetPwd);
    // 发送注册验证码
    router.post('/sendRegisterEmail', UserController.sendRegisterEmail);
    // 给管理员发送确认邮件
    router.post('/registerCheck', UserController.registerCheck);
    // 管理员注册接口
    router.post('/registerForAdmin', UserController.registerForAdmin);

    // 注册用户
    router.get('/register', UserController.register);
    // 重置密码
    router.get('/resetPwd', UserController.resetPwd);
    // 激活用户
    router.post('/activeRegisterMember', UserController.activeRegisterMember);
    // 删除用户
    router.post('/deleteRegisterMember', UserController.deleteRegisterMember);

    // 把有效token存入内存中
    router.post('/storeTokenToMemory', UserController.storeTokenToMemory);

    // 新增消息
    router.post('/createMessage', MessageController.createNewMessage);
    // 获取消息
    router.post('/getMessageByType', MessageController.getMessageByType);
    // 阅读消息
    router.post('/readMessage', MessageController.readMessage);
    // 阅读全部
    router.post('/readAll', MessageController.readAll)


    /**
     * Common 逻辑接口
     */
    // 获服务并发日志量
    router.post('/getConcurrencyByMinuteInHour', Common.getConcurrencyByMinuteInHour);


    // 添加team
    router.post('/team', TeamController.create);
    // 获取团队列表
    router.post("/getTeamList", TeamController.getTeamList)
    router.get("/getTeams", TeamController.getTeams)
    router.post("/addTeamMember", TeamController.addTeamMember)
    router.post("/createNewTeam", TeamController.createNewTeam)
    router.post('/deleteTeam', TeamController.deleteTeam);
    router.post('/moveProToTeam', TeamController.moveProToTeam)
    router.post('/updateTeamProjects', TeamController.updateTeamProjects)
    // 获取所有团队列表
    router.post("/getAllTeamList", TeamController.getAllTeamList)


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
    // 获取日志服务所有相关信息
    router.get('/getSysInfo', Common.getSysInfo);
    router.get('/sysInfo', SysInfoController.getSysInfo);
    router.get('/eventBaseInfo', SysInfoController.getSysInfo);
    router.get('/baseInfo', SysInfoController.getBaseInfo);

    // 更新激活码
    router.post('/createPurchaseCode', FailController.createPurchaseCode);

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
     * 点位字段接口
     */
    router.post('/buryPointField/create', BuryPointFieldController.create);
    router.get('/buryPointField/detail', BuryPointFieldController.detail);
    router.post('/buryPointField/update', BuryPointFieldController.update);
    router.post('/buryPointField/delete', BuryPointFieldController.delete);
    router.post('/buryPointField/page', BuryPointFieldController.getPageList);
    router.post('/buryPointField/list', BuryPointFieldController.getNoWeList);
    router.post('/buryPointField/getListByPointId', BuryPointFieldController.getListByPointId);
    router.post('/buryPointField/getListAndWfByPointId', BuryPointFieldController.getListAndWfByPointId);
    router.post('/buryPointField/getListAndWfByProjectId', BuryPointFieldController.getListAndWfByProjectId);
    router.get('/buryPointField/AllList', BuryPointFieldController.getAllList);
    router.post('/buryPointField/fieldExport', BuryPointFieldController.exportField);
    router.post('/buryPointField/getFieldCount', BuryPointFieldController.getFieldCount);

    /**
     * 点位仓库接口
     */
    router.post('/buryPointWarehouse/create', BuryPointWarehouseController.create);
    router.post('/buryPointWarehouse/update', BuryPointWarehouseController.update);
    router.post('/buryPointWarehouse/delete', BuryPointWarehouseController.delete);
    router.get('/buryPointWarehouse/detail', BuryPointWarehouseController.detail);
    router.post('/buryPointWarehouse/page', BuryPointWarehouseController.getPageList);
    router.post('/buryPointWarehouse/list', BuryPointWarehouseController.getList);
    router.post('/buryPointWarehouse/getProjectAndWeList', BuryPointWarehouseController.getAllPointList);
    router.post('/buryPointWarehouse/getProjectAndOldList', BuryPointWarehouseController.getProjectAndOldList);
    router.get('/buryPointWarehouse/AllList', BuryPointWarehouseController.getAllList);
    router.post('/buryPointWarehouse/pointExport', BuryPointWarehouseController.exportPoint);

    /**
     * SDK发布接口
     */
    router.post('/sdkRelease/create', SdkReleaseController.create);
    router.post('/sdkRelease/update', SdkReleaseController.update);
    router.post('/sdkRelease/delete', SdkReleaseController.delete);
    router.get('/sdkRelease/detail', SdkReleaseController.detail);
    router.post('/sdkRelease/changeUploadDomain', SdkReleaseController.changeUploadDomain);
    router.post('/sdkRelease/page', SdkReleaseController.getPageList);
    router.post('/sdkRelease/list', SdkReleaseController.getList);
    router.get('/sdkRelease/AllList', SdkReleaseController.getAllList);
    router.post('/initCf', SdkReleaseController.initFunnelConfig);
    router.post('/upEvent', SdkReleaseController.upEvent);
    router.post('/upEvents', SdkReleaseController.upEvents);
    router.post('/sdkRelease/createReleaseScript', SdkReleaseController.createReleaseScript);
    router.get('/sdkRelease/downLoad', SdkReleaseController.downloadScript);

    /**
    * 点位项目接口
    */
    router.post('/buryPointProject/create', BuryPointProjectController.create);
    router.post('/buryPointProject/update', BuryPointProjectController.update);
    router.post('/buryPointProject/delete', BuryPointProjectController.delete);
    router.post('/buryPointProject/tree', BuryPointProjectController.tree);
    router.post('/buryPointProject/getProjectList', BuryPointProjectController.getProjectList);
    router.post('/buryPointProject/projectSimpleListByWebmonitorIds', BuryPointProjectController.projectSimpleListByWebmonitorIds);
    router.post('/buryPointProject/addViewers', BuryPointProjectController.addViewers);
    router.get('/buryPointProject/all', BuryPointProjectController.getAllList);
    router.get('/buryPointProject/allProject', BuryPointProjectController.getAllProjectList);
    router.post('/buryPointProject/getProjectTree', BuryPointProjectController.getProjectTree);
    router.post('/buryPointProject/getGroupAndPage', BuryPointProjectController.getGroupAndPage);
    router.post('/buryPointProject/sort', BuryPointProjectController.sort);
    router.post('/buryPointProject/page/move', BuryPointProjectController.movePage);
    router.post('/buryPointProject/copyPage', BuryPointProjectController.copyPage);
    router.post('/buryPointProject/templateExport', BuryPointProjectController.exportTemplate);
    router.post('/buryPointProject/existTemplate', BuryPointProjectController.existTemplate);

    /**
     * 点位卡片接口
     */
    router.post('/buryPointCard/create', BuryPointCardController.create);
    router.post('/buryPointCard/card/copy', BuryPointCardController.copyCard);
    router.post('/buryPointCard/delete', BuryPointCardController.delete);
    router.post('/buryPointCard/deleteBatch', BuryPointCardController.deleteBatch);
    router.post('/buryPointCard/list', BuryPointCardController.getList);
    router.post('/buryPointCard/getList', BuryPointCardController.getListByPageIdAndName);
    router.post('/buryPointCard/update', BuryPointCardController.update);
    router.get('/buryPointCard/detail', BuryPointCardController.detail);
    router.post('/buryPointCard/sort', BuryPointCardController.sort);
    router.post('/buryPointCard/order', BuryPointCardController.order);
    router.post('/buryPointCard/refresh', BuryPointCardController.refresh);
    router.post('/buryPointCard/groupByQuery', BuryPointCardController.groupByQuery);
    router.get('/buryPointCard/export', BuryPointCardController.export);
    router.get('/buryPointCard/tableDisplay', BuryPointCardController.tableDisplay);
    router.post('/buryPointCard/moveCard', BuryPointCardController.moveCard);

    /**
     * 打点测试
     */
    router.post('/buryPointTest/page', BuryPointTestController.getPageList);
    // 点位查询
    router.post('/buryPointTest/search', BuryPointTestController.search);
    // api导出数据
    router.post('/buryPointTest/apiExport', BuryPointTestController.apiExport);
    // 根据userId查询点位列表
    router.post('/buryPointTest/searchAllRecord', BuryPointTestController.searchAllRecord);
    // 根据字段的key查询字段名称
    router.post('/buryPointTest/searchFieldName', BuryPointTestController.searchFieldName);
    // 点位查询导出
    router.get('/buryPointTest/searchExport', BuryPointTestController.exportData);

    /**
     * 模板接口
     */
    router.post('/buryPointTemplate/create', BuryPointTemplateController.create);
    router.post('/buryPointTemplate/updateName', BuryPointTemplateController.updateName);
    router.post('/buryPointTemplate/delete', BuryPointTemplateController.delete);
    router.post('/buryPointTemplate/deleteBatch', BuryPointTemplateController.deleteBatch);
    router.post('/buryPointTemplate/copy', BuryPointTemplateController.copy);
    router.post('/buryPointTemplate/createProject', BuryPointTemplateController.createProject);
    router.post('/buryPointTemplate/getMyList', BuryPointTemplateController.getMyTemplatePageList);
    router.post('/buryPointTemplate/getCommonList', BuryPointTemplateController.getCommonTemplatePageList);
    router.post('/buryPointTemplate/getSysList', BuryPointTemplateController.getSysTemplatePageList);
    router.post('/buryPointTemplate/detail', BuryPointTemplateController.detail);

    //任务管理
    router.post('/buryPointTask/create', BuryPointTaskController.create);
    router.post('/buryPointTask/delete', BuryPointTaskController.delete);
    router.post('/buryPointTask/batchDeletion', BuryPointTaskController.batchDeletion);
    router.post('/buryPointTask/update', BuryPointTaskController.update);
    router.post('/buryPointTask/list', BuryPointTaskController.list);
    router.post('/buryPointTask/detail', BuryPointTaskController.detail);
    router.post('/buryPointTask/updateStatus', BuryPointTaskController.updateStatus);
    router.post('/buryPointTask/changeHandleMan', BuryPointTaskController.changeHandleMan);

    // 告警规则
    router.post('/buryPointAlarm/create', BuryPointAlarmController.create);
    router.post('/buryPointAlarm/copy', BuryPointAlarmController.copy);
    router.post('/buryPointAlarm/update', BuryPointAlarmController.update);
    router.post('/buryPointAlarm/updateStatus', BuryPointAlarmController.updateStatus);
    router.post('/buryPointAlarm/list', BuryPointAlarmController.list);
    router.post('/buryPointAlarm/getListByProjectId', BuryPointAlarmController.getListByProjectId);
    router.post('/buryPointAlarm/delete', BuryPointAlarmController.delete);
    router.post('/buryPointAlarm/batchDeletion', BuryPointAlarmController.batchDeletion);
    router.get('/buryPointAlarm/detail', BuryPointAlarmController.detail);

    // 报警记录
    router.post('/buryPointAlarmMessage/create', BuryPointAlarmMessageController.create);
    router.post('/buryPointAlarmMessage/list', BuryPointAlarmMessageController.list);
    router.get('/buryPointAlarmMessage/detail', BuryPointAlarmMessageController.detail);
    router.post('/buryPointAlarmMessage/delete', BuryPointAlarmMessageController.delete);
    
    router.post('/buryPointAlarmMessage/test', BuryPointAlarmMessageController.testSendNotice);

    router.get('/test/calcu', TimerStatisticController.calculateDataPreDay);
    router.get('/test/statistic', TimerStatisticController.test);


    router.get('/test/deleteTable', Common.startDelete);
    /**
     * 初始化数据
     */
    router.get('/initWeFieldData', WeHandleDataController.initWeFieldData);
    router.get('/initWePointData', WeHandleDataController.initWePointData);
    router.get('/initWeTemplateData', WeHandleDataController.initWeTemplateData);
    /**升级2.0版本 */
    router.get('/upgradeVersion', WeHandleDataController.upgradeVersion_2_0);
    router.get('/createDemoTemplateData', WeHandleDataController.createDemoTemplateData);

}

module.exports = {
    createRoutes
}