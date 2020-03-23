const Router = require('koa-router')
const { Common } = require("../controllers/controllers.js")
const { createRoutes } = require("./routes");
const timerTask = require("./timer");
global.monitorInfo = {
    userIdArray: [],
    debugInfoArray: [],
    debugTimer: null,
    debugInfo: {},
    logServerStatus: true, 
    waitCounts: 40,  
    logCountInMinute: 0,
    logCountInMinuteList: []
}
global.tableTimeStamp = new Date().Format("yyyyMMdd")
global.web_monitor_version = "1.0.0"
global.BUILD_ENV = process.argv[3]

const router = new Router({
    prefix: '/server'
})

Common.checkPurchase(() => {
    createRoutes(router)
    timerTask()
})

module.exports = router
