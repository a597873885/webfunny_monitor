const { Common, ProjectController, TimerCalculateController, ConfigController, CommonUtil } = require("../controllers/controllers.js")
const Utils = require("../util/utils");
const log = require("../../../config/log");
const timerUtil = require("../../../utils/timer.js")
const AccountConfig = require("../config/AccountConfig");
const { accountInfo, localAssetsDomain } = AccountConfig
/**
 * 定时任务
 */
module.exports = async (customerWarningCallback, serverType = "master") => {
    /**
     * 3秒后开始接收消息队列里的数据
     * */
    setTimeout(() => {
        if (accountInfo.messageQueue.enable === true) {
            // 开始接收消息队列的消息
            Common.startReceiveMsg()
        }
    }, 3000)

    setTimeout(() => {
        // 更新流量上限信息
        TimerCalculateController.checkLimitForCloud()
        TimerCalculateController.checkCommonProduct()
    }, 25 * 1000)

    setTimeout(() => {
        Common.consoleInfo()

        //启动一个定时器
        timerUtil(async (dateTime) => {
            const tempDate = new Date()
            const hourMinuteStr = dateTime.Format("hh:mm")
            const hourTimeStr = dateTime.Format("hh:mm:ss")
            const minuteTimeStr = dateTime.Format("mm:ss")

            const loopGap = accountInfo.batchInsert.loopGap || 10
            switch(loopGap) {
                case 10:
                    // 每隔10秒钟
                    if (minuteTimeStr.substring(4) == "0") {
                        // 取内存中的数据入库
                        Common.handleLogInfoQueue()
                    }
                    break
                case 20:
                    // 每隔20秒钟
                    if (["00", "20", "40"].includes(minuteTimeStr.substring(3))) {
                        // 取内存中的数据入库
                        Common.handleLogInfoQueue()
                    }
                    break
                case 30:
                    // 每隔30秒钟
                    if (["00", "30"].includes(minuteTimeStr.substring(3))) {
                        // 取内存中的数据入库
                        Common.handleLogInfoQueue()
                    }
                    break
                case 60:
                    // 每隔30秒钟
                    if (["00"].includes(minuteTimeStr.substring(3))) {
                        // 取内存中的数据入库
                        Common.handleLogInfoQueue()
                    }
                    break
                default:
                    // 每隔10秒钟
                    if (minuteTimeStr.substring(4) == "0") {
                        // 取内存中的数据入库
                        Common.handleLogInfoQueue()
                    }
                    break
            }


            // 每隔10分钟
            if (minuteTimeStr.substring(1) == "0:00") {
                TimerCalculateController.checkLimitForCloud()
                TimerCalculateController.checkCommonProduct()
            }


            // 每隔10秒钟
            if (minuteTimeStr.substring(4) == "0") {
                // 更新内存中的token
                ConfigController.refreshTokenList()
                // 检查导出随机码是否过期
                TimerCalculateController.checkExportCode()
            }

            // 每隔1秒钟，取实时日志队列里的日志，执行入库操作
            Common.handleRealTimeLogInfoQueue()

            
            // 每隔1分钟执行
            if (minuteTimeStr.substring(3) == "00") {
                // 每隔1分钟，生成一个动态的secret
                // CommonUtil.setMonitorSecretList()
            }

            // 每隔1分钟
            if (minuteTimeStr.substring(3) == "00") {
                // 每分钟更新活跃流量信息
                // TimerCalculateController.updateAliveCountInfo()
            }
            
            // if (!Utils.isLocalEnvironment(accountInfo)) {
            //     // 判断是否是主节点
            //     if (global.masterElection && global.masterElection.isMasterNode()) {
            //         // 如果是凌晨，则计算上一天的分析数据
            //         if (hourTimeStr > "00:06:00" && hourTimeStr < "00:12:00") {
            //             TimerCalculateController.calculateCountByDay(minuteTimeStr, -1)
            //         }
            //     }
            // }

            // 每隔1分钟，取出全局变量global.apmInfo.logCountInMinute的值，并清0
            if (minuteTimeStr.substring(3) == "00") {
                global.apmInfo.logCountInMinuteList.push(global.apmInfo.logCountInMinute)
                global.apmInfo.logCountInMinute = 0
                if (global.apmInfo.logCountInMinuteList.length > 60) {
                    global.apmInfo.logCountInMinuteList.shift()
                }
            }
            // 每小时的51分，开始flush pm2 的日志
            if (minuteTimeStr == "51:00") {
                Common.pm2Flush()
            }
            // 凌晨0点01分开始创建当天的数据库表
            if (hourTimeStr == "00:00:01") {
                global.apmInfo.projectLogCountList = {}
            } 
        })
    }, 8000)
   
}