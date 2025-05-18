const { NoticeTemplateController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  router.get('/alarm/getNoticeTemplate', NoticeTemplateController.getNoticeTemplate)
  router.post('/alarm/createNoticeTemplate', NoticeTemplateController.createNoticeTemplate)
  router.get('/alarm/getNoticeTemplateById', NoticeTemplateController.getNoticeTemplateById)
  router.get('/alarm/deleteNoticeTemplate', NoticeTemplateController.deleteNoticeTemplate)
  router.post('/alarm/updateNoticeTemplate', NoticeTemplateController.updateNoticeTemplate)
  router.get('/alarm/getAllNoticeTemplate', NoticeTemplateController.getAllNoticeTemplate)
}
