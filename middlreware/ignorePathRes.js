module.exports = [
    // monitor
    "/getSysInfo", "/getValidateCode", "/refreshValidateCode", "/login", "/register",
    "/registerForAdmin", "/sendRegisterEmail", "/resetPwd", "/upBp", "/uploadMapFile",
    "/checkSsoToken", "/loginForApi", "/registerForApi", "/createNewTeamForApi", "/createNewProjectForApi",
    "/projectSimpleListByWebmonitorIds", "/addViewers", "/otel/trace", "/project/list/all", "/getAllProjectWithCompanyId",
    "/monitorBaseInfo", "/storeTokenToMemory", "getJavascriptErrorStackCodeForSource", 
    
    // center
    "/hasSuperAdminAccount", "/getValidateCode", "/refreshValidateCode", "/login", "/register",
    "/registerForAdmin", "/sendRegisterEmail", "/resetPwd", "/upBp", "/uploadMapFile",
    "/checkSsoToken", "/getUserTokenFromNetworkByToken", "/getSysConfigInfo",
    "/loginForApi", "/registerForApi", "/createNewTeamForApi", "/createNewProjectForApi", 
    "/getTeams", "/getTeamListWithoutToken", "/getTeamDetail", "/updateTeam", "/createFlowData",
    "/getUserInfo", "/getSignatureForFeiShu", "/getAccessTokenByCodeForFeiShu", "/getCompanyList",

    //event
    "/sysInfo", "/getConcurrencyByMinuteInHour", "/initCf", "/upEvent", "/upEvents",
    "/export", "/sdkRelease/downLoad", "/getSysInfo", "/getValidateCode",
    "/refreshValidateCode", "/login", "/register", "/registerForAdmin",
    "/sendRegisterEmail", "/resetPwd", "/projectSimpleListByWebmonitorIds",
    "/eventBaseInfo", "/storeTokenToMemory", "/upgradeVersion", "buryPointTest/searchExport",
    "/buryPointCard/getHeatMapPerData",

    // walkingfunny 过滤登录校验
    "/walkingfunnyWithoutLogin/",
]