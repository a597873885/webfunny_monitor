// const OrderController = require('../../controllers/order')
const { OrderController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 更新公司信息
    router.post('/getOrderList', OrderController.getOrderList);
}
