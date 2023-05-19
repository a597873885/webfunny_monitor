const log = require("../config/log");
const AccountConfig = require("../config/AccountConfig");
const { accountInfo } = AccountConfig
const { WeHandleDataController,Common, UserController, SdkReleaseController, TimerStatisticController } = require("../controllers/controllers.js")

/**
 * 定时任务
 */
module.exports = async () => {

    /**
     * 1、每天凌晨生成今天和明天的表
     * 2、跑定时执行计算规则
     * 3、删除以前的表
     * */
    setTimeout(() => {
        // 同步数据库里的token
        ConfigController.refreshTokenList()

        // 生成event-master-uuid，主服务的判断标识
        global.eventInfo.eventMasterUuid = Utils.getUuid()
        setTimeout(() => {
            ConfigController.updateConfig("event-master-uuid", {configValue: global.eventInfo.eventMasterUuid})
        }, Math.floor(Math.random() * 1000))

        //创建今天的日志表
        SdkReleaseController.timerCreateTableByDay(0).catch((e)=>{
            log.printError(e)
        });
        // 创建系统模板和系统项目
        WeHandleDataController.createWeTemplateData().catch((e)=>{
            log.printError(e)
        });

        const startTime = new Date().getTime();
        let count = 0;
        const fixed = async () => {
            count ++;
            const tempDate = new Date()
            const tempTime = new Date().getTime()
            const wrongTime = startTime + count * 1000
            var offset = tempTime - wrongTime;
            var nextTime = 1000 - offset;
            if (nextTime < 0) nextTime = 0;
            const hourTimeStr = tempDate.Format("hh:mm:ss")
            const minuteTimeStr = tempDate.Format("mm:ss")
            try {
                // 每隔10秒钟，取日志队列里的日志，执行入库操作
                if (minuteTimeStr.substring(4) == "0") {
                    // 更新内存中的token
                    ConfigController.refreshTokenList()
                }
                // 每小时的第0秒，重新选举master
                if (minuteTimeStr == "00:00") { 
                    // 生成event-master-uuid，主服务的判断标识
                    global.eventInfo.eventMasterUuid = Utils.getUuid()
                    setTimeout(() => {
                        ConfigController.updateConfig("event-master-uuid", {configValue: global.eventInfo.eventMasterUuid})
                    }, Math.floor(Math.random() * 1000))
                }

                // 每天的0点05分，定时执行生成今天的表
                if (hourTimeStr == "00:05:01") {
                    const uuidRes = await ConfigController.getConfig("event-master-uuid")
                    if (uuidRes && uuidRes.configValue === global.eventInfo.eventMasterUuid) {
                        SdkReleaseController.timerCreateTableByDay(0).catch((e)=>{
                            log.printError(e)
                        });
                    }
                }
                 // 每天的23:55点，定时执行生成明天的表
                 if (hourTimeStr == "23:55:01") {
                    const uuidRes = await ConfigController.getConfig("event-master-uuid")
                    if (uuidRes && uuidRes.configValue === global.eventInfo.eventMasterUuid) {
                        SdkReleaseController.timerCreateTableByDay(1).catch((e)=>{
                            log.printError(e)
                        });
                    }
                }
                //每天凌晨0点10分开始分析昨天的执行计算规则
                if (hourTimeStr === '00:10:00'){
                    const uuidRes = await ConfigController.getConfig("event-master-uuid")
                    if (uuidRes && uuidRes.configValue === global.eventInfo.eventMasterUuid) {
                        TimerStatisticController.calculateDataPreDay('', -1);
                    }
                }
                // 每小时的46分，开始统计今天的数据
                let isOpenTodayStatistic = accountInfo.isOpenTodayStatistic
                if (isOpenTodayStatistic && minuteTimeStr == "46:00") {
                    const uuidRes = await ConfigController.getConfig("event-master-uuid")
                    if (uuidRes && uuidRes.configValue === global.eventInfo.eventMasterUuid) {
                        TimerStatisticController.calculateDataPreDay('', 0);
                    }
                }
                // 凌晨2点30开始删除过期的数据库表
                if (hourTimeStr == "02:30:00") {
                    const uuidRes = await ConfigController.getConfig("event-master-uuid")
                    if (uuidRes && uuidRes.configValue === global.eventInfo.eventMasterUuid) {
                        Common.startDelete()
                    }
                }
                // 每隔1分钟，取出全局变量global.eventInfo.logCountInMinute的值，并清0
                if (minuteTimeStr.substring(3) == "00") {
                    global.eventInfo.logCountInMinuteList.push(global.eventInfo.logCountInMinute)
                    global.eventInfo.logCountInMinute = 0
                    if (global.eventInfo.logCountInMinuteList.length > 60) {
                        global.eventInfo.logCountInMinuteList.shift()
                    }
                }
            } catch(e) {
                log.printError("定时器执行报错：", e)
            }
            setTimeout(fixed, nextTime);
        }
        setTimeout(fixed, 1000);
    }, 6000);
}