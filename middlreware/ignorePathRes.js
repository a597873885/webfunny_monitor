module.exports = [
    // monitor
    "/getSysInfo", "/getValidateCode", "/refreshValidateCode", "/login", "/register",
    "/registerForAdmin", "/sendRegisterEmail", "/resetPwd", "/upBp", "/uploadMapFile",
    "/checkSsoToken", "/loginForApi", "/registerForApi", "/createNewTeamForApi", "/createNewProjectForApi",
    "/projectSimpleListByWebmonitorIds", "/addViewers", "/forbiddenProject", "/deleteProject",
    "/monitorBaseInfo", "/storeTokenToMemory", "getJavascriptErrorStackCodeForSource",

    // center
    "/hasSuperAdminAccount", "/getValidateCode", "/refreshValidateCode", "/login", "/register",
    "/registerForAdmin", "/sendRegisterEmail", "/resetPwd", "/upBp", "/uploadMapFile",
    "/checkSsoToken", "/getUserTokenFromNetworkByToken", "/getSysConfigInfo", 
    "/getTeams", "/getTeamListWithoutToken", "/getTeamDetail", "/updateTeam", "/getUserInfo",
    "/loginForApi", "/registerForApi", "/createNewTeamForApi", "/createNewProjectForApi",
    "/getSignatureForFeiShu", "/getAccessTokenByCodeForFeiShu", "/getCompanyList",

    //event
    "/sysInfo", "/getConcurrencyByMinuteInHour", "/initCf", "/upEvent", "/upEvents", "/upMyEvents",
    "/export", "/sdkRelease/downLoad", "/getSysInfo", "/getValidateCode",
    "/refreshValidateCode", "/login", "/register", "/registerForAdmin",
    "/sendRegisterEmail", "/resetPwd", "/projectSimpleListByWebmonitorIds",
    "/eventBaseInfo", "/storeTokenToMemory", "/upgradeVersion", "buryPointTest/searchExport"
]