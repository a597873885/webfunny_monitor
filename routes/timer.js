const { Common } = require("../controllers/controllers.js")
const log = require("../config/log");
const AccountConfig = require("../config/AccountConfig");
const { accountInfo } = AccountConfig
/**
 * 定时任务
 */
module.exports = () => {
    /**
     * 3秒后开始接收消息队列里的数据
     * */
    setTimeout(() => {
        if (accountInfo.messageQueue === true) {
            Common.startReceiveMsg()
        }
    }, 3000)
    /**
     * 2秒后开始进行第一次分析
     * */
    setTimeout(() => {
        Common.calculateCountByHour(1)
    }, 2000)
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
                } else if (hourTimeStr == "00:10:00") {
                    // 凌晨0点10分重新计算昨天的分析数据
                    Common.calculateCountByDay(-1)
                    Common.calculateCountByDayForTenMinutes(-1)
                } else if (hourTimeStr == "02:00:00") {
                    // 凌晨2点开始删除过期的数据库表
                    Common.startDelete()
                } else if (minuteTimeStr == "01:00") {
                    // 每小时的第一分钟，开始执行小时分析结果
                    Common.calculateCountByHour(1)
                } else if (minuteTimeStr == "05:00") {
                    // 每小时的第5分钟，计算一次今天的分析结果
                    Common.calculateCountByDay(0)
                } else if (minuteTimeStr.substring(1) == "0:00") {
                    // 每隔10分钟，对一些实时数据进行计算
                    Common.calculateCountByDayForTenMinutes(0, minuteTimeStr)
                }
            } catch(e) {
                log.printError("定时器执行报错：", e)
            }
            setTimeout(fixed, nextTime);
        }
        setTimeout(fixed, 1000);
    }, 10000)
}