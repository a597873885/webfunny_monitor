const { ReportTaskController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    router.post('/reportTask/createTask', ReportTaskController.createTask);
    router.post('/reportTask/getReportTasksList', ReportTaskController.getReportTasksList);
    router.get('/reportTask/getTask', ReportTaskController.getTask);
    router.put('/reportTask/updateReportTask', ReportTaskController.updateReportTask);
    router.post('/reportTask/toggleTaskStatus', ReportTaskController.toggleTaskStatus);
    router.get('/reportTask/deleteTask', ReportTaskController.deleteTask);
    router.get('/reportTask/reportDetail', ReportTaskController.reportDetail);
}
