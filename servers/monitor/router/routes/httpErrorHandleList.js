const { HttpErrorHandleListController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  // 创建API接口错误处理信息
  router.post('/createHttpErrorHandleList', HttpErrorHandleListController.create);
  // 解决api接口错误
  router.post('/resolveHttpErrorInHandleList', HttpErrorHandleListController.resolveHttpErrorInHandleList);
  // 根据simpleHttpUrl判断解决状态
  router.post('/getSolveStatusBySimpleHttpUrl', HttpErrorHandleListController.getSolveStatusBySimpleHttpUrl);
}
