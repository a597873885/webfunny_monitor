const { FunctionSynchronizationController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 获取项目同步列表
    router.post("/getFunctionSynchronizationList", FunctionSynchronizationController.getList);
    // 获取功能列表
    router.get("/getFunctionListFromMemory", FunctionSynchronizationController.getFunctionListFromMemory);

    // 前端提交功能列表进行落库
    router.post("/third/functions/update", FunctionSynchronizationController.updateFunctionListByClient);
    // 提供第三方接口配置
    router.get("/third/functions/config", FunctionSynchronizationController.getThirdFunctionsConfig);
}