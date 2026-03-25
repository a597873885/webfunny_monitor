module.exports = [
    // monitor
    "/getSysInfo",
    "/getValidateCode", "/refreshValidateCode", "/login", "/register",
    "/registerForAdmin", "/sendRegisterEmail", "/resetPwd", "/upBp", "/uploadMapFile",
    "/checkSsoToken", "/loginForApi", "/registerForApi", "/createNewTeamForApi", "/createNewProjectForApi",
    "/projectSimpleListByWebmonitorIds", "/addViewers", "/otel/trace", "/project/list/all", "/getAllProjectWithCompanyId",
    "/monitorBaseInfo", "/storeTokenToMemory", "getJavascriptErrorStackCodeForSource", "/wfMonitor/getLogCountInfoByDay",
    , "/wfMonitor/checkAlarmResult", "/uploadSourceMap", "/wfMonitor/getProjectCountByCompanyId", "/wfMonitor/topology/getFrontendApps",
    
    // center
    // "/getUserInfo", 
    "/hasSuperAdminAccount", "/getValidateCode", "/refreshValidateCode", "/login", "/register", "/wfCenter/getUserByPhone",
    "/registerForAdmin", "/sendRegisterEmail", "/resetPwd", "/upBp", "/uploadMapFile", "/health",
    "/checkSsoToken", "/getUserTokenFromNetworkByToken", "/getSysConfigInfo", "/wfCenter/getTotalFlowCountByCompanyForDay",
    "/loginForApi", "/registerForApi", "/createNewTeamForApi", "/createNewProjectForApi", "/wfCenter/getLimitCompanyIdForCloud",
    "/getTeams", "/getTeamListWithoutToken", "/getTeamDetail", "/updateTeam", "/createFlowData",
    "/getSignatureForFeiShu", "/getAccessTokenByCodeForFeiShu", "/getAccessTokenByCodeForIds", "/apiIdsNotice",
    "/getCompanyList", "/checkUserByOpenid", "/alarm/getAlarmTriggerList", "/generatedReport/getReportAnalyzeData", "/getProductInfoByCompanyId",

    //event
    "/sysInfo", "/getSysInfo",
    "/getConcurrencyByMinuteInHour", "/initCf", "/upEvent", "/upEvents","/upMyEvents",
    "/export", "/sdkRelease/downLoad", "/getValidateCode",
    "/refreshValidateCode", "/login", "/register", "/registerForAdmin",
    "/sendRegisterEmail", "/resetPwd", "/projectSimpleListByWebmonitorIds", "screenShot/upload",
    "/eventBaseInfo", "/storeTokenToMemory", "/upgradeVersion", "buryPointTest/searchExport",
    "/buryPointCard/getHeatMapPerData", "/buryPointVisualTracking/create", "/wfEvent/checkWeFieldData",
    "/getExportCode", "/buryPointProject/getProjectCountByCompanyId", "/wfEvent/getLogCountInfoByDay",
    "/buryPointWarehouse/downloadExcel", "/sdkRelease/downloadJavaJar",
    "/buryPointWarehouse/downloadTemplate",
    "/buryPointWarehouse/downFileByName",
    "/buryPointTemplate/download",

    // logger
    "/wfLog/upLogs", "/wfLog/upErrLogs",

    // file
    "/wfFile/api/sourceMapFile/upload", "/wfFile/api/sourceMapFile",

    // apm
    "/wfApm/downloadTracerFile", "/wfApm/getLogCountInfoByDay", "/wfApm/apmBaseInfo",

    // walkingfunny 过滤登录校验
    "/walkingfunnyWithoutLogin/",


]