const { VideosController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 处理视频录制状态
    router.post('/handleVideoStatus', VideosController.handleVideoStatus)
    // 获取历史录制列表
    router.get('/getHistoryVideoList', VideosController.getHistoryVideoList)
}
