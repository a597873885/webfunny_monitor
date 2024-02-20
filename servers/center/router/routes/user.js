// const UserController = require('../../controllers/user')
const { UserController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 检查token是否有效
    router.post('/checkSsoToken', UserController.checkSsoToken);
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
    // 获取当前项目所在团队的用户列表
    router.post('/getUserListForTeam', UserController.getUserListForTeam);
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
    // 注册用户(saas)
    router.get('/registerForSaas', UserController.registerForSaas);
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
}
