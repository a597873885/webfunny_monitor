// const ProductController = require('../../controllers/product')
const { ProductController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 获取当月生效的产品
    router.post('/getProjectByCompanyIdForMonth', ProductController.getProjectByCompanyIdForMonth);
    // 创建产品
    router.post('/createNewProduct', ProductController.createNewProduct);
    // 批量创建产品
    router.post('/batchCreateProduct', ProductController.batchCreateProduct);
    // 批量更新产品
    router.post('/batchUpdateProduct', ProductController.batchUpdateProduct);
    // 批量更新和创建产品
    router.post('/batchCreateOrUpdateProduct', ProductController.batchCreateOrUpdateProduct);
}
