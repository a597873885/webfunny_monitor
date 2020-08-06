const Router = require('koa-router');
const {CustomerPVController, Common} = require("../controllers/controllers.js")

const router = new Router({
    prefix: '/socket'
})


// 获取连线用户的实时日志记录
router.get('/wsGetDebugInfo', async function (ctx) {
    let intervalObj = null
    const conn = ctx.websocket
    conn.on('message', async function (message) {
        const param = JSON.parse(message)
        // 返回给前端的数据
        intervalObj = setInterval(async () => {
            const behaviorResult = await Common.getDebugInfoFromConnectUser(param)
            const consoleResult = await Common.getConsoleInfoFromConnectUser(param) || null
            const result = JSON.stringify({behaviorResult, consoleResult})
            ctx.websocket.send(result)
        }, 200)
    })
    // 连接关闭了
    conn.on("close", function (code, reason) {
        global.monitorInfo.debugInfo = {}
        global.monitorInfo.userIdArray = []
        if (intervalObj) clearInterval(intervalObj)
        console.log("wsGetDebugInfo Connection closed")
    })
    // 必须监控error, 每当浏览器刷新时会断开链接报错
    conn.on("error", function (error) {
        global.monitorInfo.debugInfo = {}
        global.monitorInfo.userIdArray = []
        if (intervalObj) clearInterval(intervalObj)
        console.log("wsGetDebugInfo Connection error", error)
    })
})
// router.get('/wsGetProvinceCountBySeconds', async function (ctx) {
//     let intervalObj = null
//     const conn = ctx.websocket
//     conn.on('message', async function (message) {
//         const param = JSON.parse(message)
//         const result = await CustomerPVController.getProvinceCountBySeconds(param)
//         ctx.websocket.send(JSON.stringify(result))
//         // 返回给前端的数据
//         intervalObj = setInterval(async () => {
//             const result = await CustomerPVController.getProvinceCountBySeconds(param)
//             ctx.websocket.send(JSON.stringify(result))
//         }, 10 * 1000)
//     })
//     // 连接关闭了
//     conn.on("close", function (code, reason) {
//         if (intervalObj) clearInterval(intervalObj)
//         console.log("wsGetProvinceCountBySeconds Connection closed")
//     })
//     // 必须监控error, 每当浏览器刷新时会断开链接报错
//     conn.on("error", function (error) {
//         if (intervalObj) clearInterval(intervalObj)
//         console.log("wsGetProvinceCountBySeconds Connection error", error)
//     })
// })


module.exports = router
