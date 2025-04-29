module.exports = [
    // monitor
    "/getSysInfo",
    "/getValidateCode", "/refreshValidateCode", "/login", "/register",
    "/registerForAdmin", "/sendRegisterEmail", "/resetPwd", "/upBp", "/uploadMapFile",
    "/checkSsoToken", "/loginForApi", "/registerForApi", "/createNewTeamForApi", "/createNewProjectForApi",
    "/projectSimpleListByWebmonitorIds", "/addViewers", "/otel/trace", "/project/list/all", "/getAllProjectWithCompanyId",
    "/monitorBaseInfo", "/storeTokenToMemory", "getJavascriptErrorStackCodeForSource", "/wfMonitor/getLogCountInfoByDay",
    , "/wfMonitor/checkAlarmResult", "/uploadSourceMap",
    
    // center
    "/hasSuperAdminAccount", "/getValidateCode", "/refreshValidateCode", "/login", "/register", "/wfCenter/getUserByPhone",
    "/registerForAdmin", "/sendRegisterEmail", "/resetPwd", "/upBp", "/uploadMapFile",
    "/checkSsoToken", "/getUserTokenFromNetworkByToken", "/getSysConfigInfo",
    "/loginForApi", "/registerForApi", "/createNewTeamForApi", "/createNewProjectForApi", 
    "/getTeams", "/getTeamListWithoutToken", "/getTeamDetail", "/updateTeam", "/createFlowData",
    "/getUserInfo", "/getSignatureForFeiShu", "/getAccessTokenByCodeForFeiShu", "/getAccessTokenByCodeForIds", "/apiIdsNotice",
    "/getCompanyList", "/checkUserByOpenid",

    //event
    "/sysInfo", "/getSysInfo",
    "/getConcurrencyByMinuteInHour", "/initCf", "/upEvent", "/upEvents",
    "/export", "/sdkRelease/downLoad", "/getValidateCode",
    "/refreshValidateCode", "/login", "/register", "/registerForAdmin",
    "/sendRegisterEmail", "/resetPwd", "/projectSimpleListByWebmonitorIds",
    "/eventBaseInfo", "/storeTokenToMemory", "/upgradeVersion", "buryPointTest/searchExport",
    "/buryPointCard/getHeatMapPerData", "/wfMonitor/getLogCountInfoByDay", "/buryPointVisualTracking/create",

    // logger
    "/wfLog/upLogs", "/wfLog/upErrLogs",

    // walkingfunny 过滤登录校验
    "/walkingfunnyWithoutLogin/",


]