// const OrderInfoController = require('../../controllers/orderInfo')
const { OrderInfoController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 创建订单
    router.post('/createOrder', OrderInfoController.createOrder);   
    // 查询订单
    router.post('/getOrderList', OrderInfoController.getOrderInfoList);
    // 检查相同订单
    router.post('/checkSameOrder', OrderInfoController.checkSameOrder);
    // 申请发票
    router.post('/applyInvoice', OrderInfoController.applyInvoice);
}
