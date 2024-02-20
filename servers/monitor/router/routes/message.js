const { MessageController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 新增消息
  router.post('/createMessage', MessageController.createNewMessage);
  // 获取消息
  router.post('/getMessageByType', MessageController.getMessageByType);
  // 阅读消息
  router.post('/readMessage', MessageController.readMessage);
  // 阅读全部
  router.post('/readAll', MessageController.readAll)
}
