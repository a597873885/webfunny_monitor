const { GeneratedReportController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 获取生成报表分页列表
    router.post('/generatedReport/getGeneratedReportsList', GeneratedReportController.getGeneratedReportsList);
    
    // 根据ID获取报表详情
    router.get('/generatedReport/getGeneratedReportDetail', GeneratedReportController.getGeneratedReportDetail);
    
    // 获取报表分析数据
    router.get('/generatedReport/getReportAnalyzeData', GeneratedReportController.getReportAnalyzeData);
    
    // 根据任务ID获取报表列表
    router.get('/generatedReport/getReportsByTaskId', GeneratedReportController.getReportsByTaskId);
    
    // 手动触发报表生成
    router.post('/generatedReport/manualGenerateReport', GeneratedReportController.manualGenerateReport);
    
    // 更新报表状态
    router.put('/generatedReport/updateReportStatus', GeneratedReportController.updateReportStatus);
    
    // 删除报表记录（软删除）
    router.delete('/generatedReport/deleteGeneratedReport', GeneratedReportController.deleteGeneratedReport);
    
    // 恢复已删除的报表
    router.put('/generatedReport/restoreGeneratedReport', GeneratedReportController.restoreGeneratedReport);
    
    // 获取报表状态统计
    router.get('/generatedReport/getReportStatusStats', GeneratedReportController.getReportStatusStats);
    
    // 获取报表生成服务状态
    router.get('/generatedReport/getServiceStatus', GeneratedReportController.getServiceStatus);
    
    // 启动报表生成服务
    router.post('/generatedReport/startService', GeneratedReportController.startService);
    
    // 停止报表生成服务
    router.post('/generatedReport/stopService', GeneratedReportController.stopService);
}; 