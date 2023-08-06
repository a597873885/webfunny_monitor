const { CompanyController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 更新公司信息
    router.post('/updateCompany', CompanyController.updateCompany);
}
