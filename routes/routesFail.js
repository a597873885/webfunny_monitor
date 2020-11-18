const Fail = require('../controllers/fail')
const { Common, UserController } = require("../controllers/controllers.js")
const createRoutesFail = (router) => {
    // 用户激活码无效
    router.get('/getSysInfo', Common.getSysInfo);

    router.post('/createPurchaseCode', Fail.createPurchaseCode);

    // 管理员注册接口
    router.post('/registerForAdmin', UserController.registerForAdmin);
    
    // 注册用户
    router.get('/register', UserController.register);

    // 登录
    router.post('/login', UserController.login);
}

module.exports = {
    createRoutesFail
}