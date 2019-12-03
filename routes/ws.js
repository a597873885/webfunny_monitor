const Router = require('koa-router');
const {HttpLogInfoController,ScreenShotInfoController,BehaviorInfoController,HttpErrorInfoController,DailyActivityController,EmailCodeController,ExtendBehaviorInfoController,IgnoreErrorController,InfoCountByHourController,LoadPageInfoController,ProjectController,ResourceLoadInfoController,UserController,VideosInfoController,CustomerPVController,JavascriptErrorInfoController,Common} = require("../controllers/controllers.js")
const router = new Router({
    prefix: '/socket'
})

router.get('/wsGetProvinceCountBySeconds', async function (ctx) {
    let intervalObj = null
    const conn = ctx.websocket
    console.log("==========================1")
    conn.on('message', async function (message) {
        const param = JSON.parse(message)
        const result = await CustomerPVController.getProvinceCountBySeconds(param)
        ctx.websocket.send(JSON.stringify(result))
        // 返回给前端的数据
        intervalObj = setInterval(async () => {
            const result = await CustomerPVController.getProvinceCountBySeconds(param)
            ctx.websocket.send(JSON.stringify(result))
        }, 10 * 1000)
    })
    // 连接关闭了
    conn.on("close", function (code, reason) {
        if (intervalObj) clearInterval(intervalObj)
        console.log("wsGetProvinceCountBySeconds Connection closed")
    })
    // 必须监控error, 每当浏览器刷新时会断开链接报错
    conn.on("error", function (error) {
        if (intervalObj) clearInterval(intervalObj)
        console.log("wsGetProvinceCountBySeconds Connection error", error)
    })
})

module.exports = router
