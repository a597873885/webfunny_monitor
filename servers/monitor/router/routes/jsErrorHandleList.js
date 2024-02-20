const { JsErrorHandleListController } = require("../../controllers/controllers.js")

module.exports = (router) => {
  /**
   * JS错误处理接口
   */
  // 创建JS错误处理信息
  router.post('/createJsErrorHandleList', JsErrorHandleListController.create);
  // 解决JS错误
  router.post('/resolveJsErrorInHandleList', JsErrorHandleListController.resolveJsErrorInHandleList);
  // 根据errorMessage判断解决状态
  router.post('/getSolveStatusByErrorMsg', JsErrorHandleListController.getSolveStatusByErrorMsg);
  // 处理概览
  router.post('/getSolveChartByErrorMsg', JsErrorHandleListController.getSolveChartByErrorMsg);
}
