// const Common = require('../controllers/common')
const { Common } = require("../controllers/controllers")
const TimerUtil = require("../util/timer")
const log = require("../config/log");
const AccountConfig = require("../config/AccountConfig");
const { accountInfo, localAssetsDomain } = AccountConfig
const masterUuidKey = "monitor-master-uuid"
/**
 * 定时任务
 */
module.exports = async (customerWarningCallback, serverType = "master") => {
    /**
     * 3秒后开始接收消息队列里的数据
     * */
    setTimeout(() => {
        // if (accountInfo.messageQueue === true) {
        //     // 开始接收消息队列的消息
        //     Common.startReceiveMsg()
        //     Common.startReceiveMsgForMog()
        // }
        // // 将每个项目的配置放入全局变量中
        // Common.setProjectConfigList()
        // setTimeout(() => {
        //     console.log("启动监控项目列表：", JSON.stringify(global.logServerInfo.cacheWebMonitorIdList))
        // }, 10000)
        
        // // 将项目的webMonitorId列表放入全局变量，并放入bin/webMonitorIdList.js文件中
        // // Common.setStopWebMonitorIdList()
    }, 3000)
    /**
     * 2秒后开始进行第一次分析
     * */
    setTimeout(() => {

    }, 20000)
    Common.consoleLogo()
    
    /** * 定时任务  开始 */
    setTimeout(() => {
        // Common.consoleInfo()
        Common.createTable(0)

        TimerUtil((time) => {
            const minuteTimeStr = time.Format("mm:ss")
            // 每隔10秒钟，取日志队列里的日志，执行入库操作
            if (minuteTimeStr.substring(4) == "0") {
                Common.handleLogInfoQueue()
            }
        })
    }, 6000)
}