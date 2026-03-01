const { ReportTemplateController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 创建模板
    router.post('/reportTemplate/createTemplate', ReportTemplateController.createTemplate);

    // 获取模板详情
    router.get('/reportTemplate/getTemplateDetail/:id', ReportTemplateController.getTemplateDetail);

    // 更新模板
    router.put('/reportTemplate/updateTemplate/:id', ReportTemplateController.updateTemplate);

    // 删除模板
    router.put('/reportTemplate/deleteTemplate/:id', ReportTemplateController.deleteTemplate);

    // 获取模板列表（分页）
    router.post('/reportTemplate/getTemplateList', ReportTemplateController.getTemplateList);

    // 获取所有模板（用于下拉选择）
    router.get('/reportTemplate/getAllTemplates', ReportTemplateController.getAllTemplates);

    // 验证模板配置
    router.post('/reportTemplate/validateTemplateConfig', ReportTemplateController.validateTemplateConfig);
}