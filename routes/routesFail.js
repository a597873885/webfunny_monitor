const Fail = require('../controllers/fail')
const { Common } = require("../controllers/controllers.js")
const createRoutesFail = (router) => {
    // 用户激活码无效
    router.get('/getSysInfo', Common.getSysInfo);

    router.post('/createPurchaseCode', Fail.createPurchaseCode);
}

module.exports = {
    createRoutesFail
}