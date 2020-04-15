const Fail = require('../controllers/fail')

const createRoutesFail = (router) => {
    // 用户激活码无效
    router.get('/getSysInfo', Fail.getSysInfo);

    router.post('/createPurchaseCode', Fail.createPurchaseCode);
}

module.exports = {
    createRoutesFail
}