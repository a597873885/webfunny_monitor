const { AlarmController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 获取警报检查频率
    router.post('/getCheckTime', AlarmController.getCheckTime)
    // 设置警报检查频率
    router.post('/changeCheckTime', AlarmController.changeCheckTime)
    // 获取JsError报警参数
    router.post('/getJsErrorConfig', AlarmController.getJsErrorConfig)
    // 设置JsError报警参数
    router.post('/changeJsErrorConfig', AlarmController.changeJsErrorConfig)
    // 获取console Error报警参数
    router.post('/getConsoleErrorConfig', AlarmController.getConsoleErrorConfig)
    // 设置ConsoleError报警参数
    router.post('/changeConsoleErrorConfig', AlarmController.changeConsoleErrorConfig)
    // 获取Http Error报警参数
    router.post('/getHttpErrorConfig', AlarmController.getHttpErrorConfig)
    // 设置HttpError报警参数
    router.post('/changeHttpErrorConfig', AlarmController.changeHttpErrorConfig)
    // 获取Resource Error报警参数
    router.post('/getResourceErrorConfig', AlarmController.getResourceErrorConfig)
    // 设置ResourceError报警参数
    router.post('/changeResourceErrorConfig', AlarmController.changeResourceErrorConfig)
}
