const { CompanyController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 更新公司信息
    router.post('/updateCompany', CompanyController.updateCompany);
    // 获取公司信息
    router.post('/getCompanyInfo', CompanyController.getCompanyInfo);
    // 获取公司列表
    router.post('/getCompanyList', CompanyController.getCompanyList);
    // 获取公司下项目总数量
    router.post('/getProjectCountByCompanyId', CompanyController.getProjectCountByCompanyId);
    // 获取公司下产品信息
    router.post('/getProductInfoByCompanyId', CompanyController.getProductInfoByCompanyId);
}
