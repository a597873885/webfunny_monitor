const { 
    UserController, ApplicationConfigController,
    TeamController, UserTokenController
} = require("../controllers/controllers.js")

const createRoutes = (router) => {
    /**
     * 单点登录相关
     */
    // 检查token是否有效
    router.post('/checkSsoToken', UserController.checkSsoToken);
    // 验证token
    router.post('/checkToken', UserTokenController.checkToken);

    /**
     * 登录相关逻辑
     */
    // 登录
    router.post('/login', UserController.login);
    // 登出
    router.post('/logout', UserController.logout);
    // API登录
    router.post('/loginForApi', UserController.loginForApi);
    // 重置验证码
    router.post('/refreshValidateCode', UserController.refreshValidateCode)
    // 获取验证码
    router.post('/getValidateCode', UserController.getValidateCode)
    // 获取用户列表
    router.post('/getUserList', UserController.getUserList);
    // 获取用户信息
    router.post('/getUserInfo', UserController.getUserInfo);
    // 获取简单的用户信息列表
    router.post('/getAllUserInfoForSimple', UserController.getAllUserInfoForSimple);
    // 管理员获取用户列表
    router.post('/getUserListByAdmin', UserController.getUserListByAdmin);
    // 忘记密码
    router.post('/forgetPwd', UserController.forgetPwd);
    // 发送注册验证码
    router.post('/sendRegisterEmail', UserController.sendRegisterEmail);
    // 超级管理员获取注册验证码
    router.post('/getRegisterEmailForSupperAdmin', UserController.getRegisterEmailForSupperAdmin);
    // 给管理员发送确认邮件
    router.post('/registerCheck', UserController.registerCheck);
    // 管理员注册接口
    router.post('/registerForAdmin', UserController.registerForAdmin);
    
    // 注册用户
    router.get('/register', UserController.register);
    // 注册用户API
    router.post('/registerForApi', UserController.registerForApi);
    // 重置密码
    router.get('/resetPwd', UserController.resetPwd);
    // 激活用户
    router.post('/activeRegisterMember', UserController.activeRegisterMember);
    // 删除用户
    router.post('/deleteRegisterMember', UserController.deleteRegisterMember);

    // 将用户设置为管理员
    router.post('/setAdmin', UserController.setAdmin);
    // 将超级管理员移交给其他人
    router.post('/resetSuperAdmin', UserController.resetSuperAdmin);
    // 获取是否有超级管理员信息
    router.get('/hasSuperAdminAccount', UserController.hasSuperAdminAccount);


    // 检查登录信息是否存在
    router.post('/getUserTokenFromNetworkByToken', UserTokenController.getUserTokenFromNetworkByToken);


    // 添加team
    router.post('/team', TeamController.create);
    // 获取团队列表
    router.post("/getTeamList", TeamController.getTeamList)
    router.post("/getSimpleTeamList", TeamController.getSimpleTeamList)
    router.post("/getTeamListWithoutToken", TeamController.getTeamListWithoutToken)
    router.post("/getTeams", TeamController.getTeams)
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
    // 根据userId获取团队列表
    router.post("/findTeamListByLeaderId", TeamController.findTeamListByLeaderId)
    // // 根据teamId获取团队列表
    // router.post("/findTeamListByTeamId", TeamController.findTeamListByTeamId)
    // 获取team详情
    router.post("/getTeamDetail", TeamController.getTeamDetail)
    // 更新团队
    router.post("/updateTeam", TeamController.updateTeam)

    // 设置观察者
    router.post('/addViewers', TeamController.addViewers);
    // 禁用项目权限验证
    router.post('/forbiddenRightCheck', TeamController.forbiddenRightCheck);
    // 禁用项目
    router.post('/forbiddenProject', TeamController.forbiddenProject);
    // 删除项目权限验证
    router.post('/deleteProjectRightCheck', TeamController.deleteProjectRightCheck);
    // 删除项目
    router.post('/deleteProject', TeamController.deleteProject);


    // 根据teamId获取团队列表
    router.post("/applicationConfig", ApplicationConfigController.create)
    router.post("/updateSysConfigInfo", ApplicationConfigController.updateSysConfigInfo)
    router.post("/getSysConfigInfo", ApplicationConfigController.getSysConfigInfo)
    router.post('/monitorBaseInfo', ApplicationConfigController.monitorBaseInfo);
    router.post('/eventBaseInfo', ApplicationConfigController.eventBaseInfo);

}

module.exports = {
    createRoutes
}