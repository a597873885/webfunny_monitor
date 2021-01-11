const { Common, TimerCalculateController } = require("../controllers/controllers.js")
const log = require("../config/log");
const AccountConfig = require("../config/AccountConfig");
const { accountInfo } = AccountConfig
/**
 * 定时任务
 */
module.exports = (customerWarningCallback) => {
    /**
     * 2秒后开始进行第一次分析
     * */
    setTimeout(() => {
        // TimerCalculateController.calculateCountByHour(1)
        // Common.calculateCountByDayForTenMinutes(0)
        // TimerCalculateController.calculateCountByDay(0)
        // TimerCalculateController.calculateCountByHour(1, customerWarningCallback)
        // Common.restartServer()
        // Common.createTable()
    }, 15000)
    Common.consoleLogo()
    /** * 定时任务  开始 */
    setTimeout(() => {
        Common.consoleInfo()
        const startTime = new Date().getTime();
        let count = 0;
        const fixed = () => {
            count++;
            const tempDate = new Date()
            const tempTime = new Date().getTime()
            const wrongTime = startTime + count * 1000
            var offset = tempTime - wrongTime;
            var nextTime = 1000 - offset;
            if (nextTime < 0) nextTime = 0;
            const hourTimeStr = tempDate.Format("hh:mm:ss")
            const minuteTimeStr = tempDate.Format("mm:ss")
            try {
                if (hourTimeStr == "00:00:00" || hourTimeStr == "08:00:00") {
                    // 每天凌晨零点执行重启服务
                    log.printInfo("当前时间：" + hourTimeStr)
                    console.log("当前时间：" + hourTimeStr)
                    log.printInfo("即将重启服务....")
                    console.log("即将重启服务....")
                    Common.restartServer()
                    return
                }
                if (hourTimeStr == "00:10:00") {
                    // 凌晨0点10分重新计算昨天的分析数据
                    TimerCalculateController.calculateCountByDay(-1)
                    // Common.calculateCountByDayForTenMinutes(1)
                } 

                if (hourTimeStr == "00:12:00") {
                    // 凌晨0点12分开始创建第二天的数据库表
                    console.log("开始创建第二天的数据库表...")
                    Common.createTable()
                } 

                if (hourTimeStr == "02:00:00") {
                    // 凌晨2点开始删除过期的数据库表
                    Common.startDelete()
                }
                if (minuteTimeStr == "00:10") {
                    // 每小时的第10秒钟，开始执行上一个小时的分析结果
                    TimerCalculateController.calculateCountByHour(1)
                }
                if (minuteTimeStr == "05:00") {
                    //  TODO 每小时的第5分钟，开始执行上一个小时的分析结果（防止主从同步延迟）
                    TimerCalculateController.calculateCountByHour(1, customerWarningCallback)

                    // 每小时的第5分钟，检查一遍所有的统计信息，并发出警告
                    // Common.checkAnalysisData(customerWarningCallback)
                }
                if (minuteTimeStr == "06:00") {
                    // 每小时的第6分钟，计算一次今天的分析结果
                    TimerCalculateController.calculateCountByDay(0)
                }
                if (minuteTimeStr == "33:00") {
                    // 每小时的第33分钟，开始修复上一个小时的分析结果，因为读写分离数据有可能会延时
                    TimerCalculateController.calculateCountByHour(1)
                }
                if (minuteTimeStr == "39:00") {
                    // 每小时的第36分钟，开始修复今天的分析结果，因为读写分离有可能数据会延时
                    TimerCalculateController.calculateCountByDay(0)
                }
                if (minuteTimeStr.substring(1) == "0:00") {
                    // 每隔10分钟，对一些实时数据进行计算
                    Common.calculateCountByDayForTenMinutes(0)
                }
                if (minuteTimeStr.substring(3) == "00") {
                    // 每隔1分钟，取出全局变量global.monitorInfo.logCountInMinute的值，并清0
                    global.monitorInfo.logCountInMinuteList.push(global.monitorInfo.logCountInMinute)
                    global.monitorInfo.logCountInMinute = 0
                    if (global.monitorInfo.logCountInMinuteList.length > 60) {
                        global.monitorInfo.logCountInMinuteList.shift()
                    }
                }
            } catch(e) {
                log.printError("定时器执行报错：", e)
            }
            setTimeout(fixed, nextTime);
        }
        setTimeout(fixed, 1000);
    }, 6000)
}