const log = require("../config/log");
const AccountConfig = require("../config/AccountConfig");
const { accountInfo } = AccountConfig
const { Common, UserController, SdkReleaseController, TimerStatisticController } = require("../controllers/controllers.js")

/**
 * 定时任务
 */
module.exports = async (serverType = "master") => {

    /**
     * 1、每天凌晨生成今天和明天的表
     * 2、跑定时执行计算规则
     * 3、删除以前的表
     * */
    setTimeout(() => {
        // Common.consoleInfo()
        const startTime = new Date().getTime();
        let count = 0;
        const fixed = async () => {
            count++;
            const tempDate = new Date()
            const tempTime = new Date().getTime()
            const wrongTime = startTime + count * 1000
            var offset = tempTime - wrongTime;
            var nextTime = 1000 - offset;
            if (nextTime < 0) nextTime = 0;
            const hourTimeStr = tempDate.Format("hh:mm:ss")
            const minuteTimeStr = tempDate.Format("mm:ss")
            // 只有master服务才会执行计算服务
            if (serverType === "master") {
                try {
                    // 每天的0点，定时执行生成每天的表
                    if (hourTimeStr == "00:00:01") {
                        SdkReleaseController.timerCreateTableByDay().catch((e) => {
                            log.printError(e)
                        });
                    }
                    //每天凌晨0点10分开始跑定时执行计算规则
                    if (hourTimeStr === '00:10:00') {
                        TimerStatisticController.calculateDataPreDay('', -1);
                    }
                    // 凌晨2点30开始删除过期的数据库表
                    if (hourTimeStr == "02:30:00") {
                        Common.startDelete()
                    }
                    // 每小时的16分，开始统计今天的数据
                    let isOpenTodayStatistic = accountInfo.isOpenTodayStatistic
                    if (isOpenTodayStatistic && minuteTimeStr == "16:00") {
                        TimerStatisticController.calculateDataPreDay('', 0);
                    }
                    // 每隔1分钟，取出全局变量global.eventInfo.logCountInMinute的值，并清0
                    if (minuteTimeStr.substring(3) == "00") {
                        global.eventInfo.logCountInMinuteList.push(global.eventInfo.logCountInMinute)
                        global.eventInfo.logCountInMinute = 0
                        if (global.eventInfo.logCountInMinuteList.length > 60) {
                            global.eventInfo.logCountInMinuteList.shift()
                        }
                    }
                } catch (e) {
                    log.printError("定时器执行报错：", e)
                }
                setTimeout(fixed, nextTime);
            }
        }
        setTimeout(fixed, 1000);
    }, 6000);
    /**
     * 3秒后开始接收消息队列里的数据
     * */
    //setTimeout(() => {
    //    if (accountInfo.messageQueue === true) {
    // 开始接收消息队列的消息
    //        Common.startReceiveMsg()
    //        Common.startReceiveMsgForMog()
    //    }
    // 将每个项目的配置放入全局变量中
    //    Common.setProjectConfigList()

    // 将项目的webMonitorId列表放入全局变量，并放入bin/webMonitorIdList.js文件中
    // Common.setStopWebMonitorIdList()
    //}, 3000)

    // Common.consoleLogo()
    // 初始化登录验证码
    UserController.setValidateCode()
    global.eventInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
    }, 5 * 60 * 1000)
}