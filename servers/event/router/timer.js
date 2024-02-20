const { Common, CommonInitDataController,SdkReleaseController, TimerStatisticController, WeHandleDataController, ConfigController, TimerCalculateController } = require("../controllers/controllers")
const log = require("../../../config/log");
const AccountConfig = require("../config/AccountConfig");
const { accountInfo, mysqlConfig } = AccountConfig
const Utils = require("../util/utils")
const masterUuidKey = "event-master-uuid"

/**
 * 定时任务
 */
module.exports = async () => {

    /**
     * 1、每天凌晨生成今天和明天的表
     * 2、跑定时执行计算规则
     * 3、删除以前的表
     * */
     /**
     * 1、每天凌晨生成今天和明天的表
     * 2、跑定时执行计算规则
     * 3、删除以前的表
     * */
     setTimeout(() => {
        // 同步数据库里的token
        ConfigController.refreshTokenList()

        // 数据库里存放的event-master-uuid
        let eventMasterUuidInDb = ""
        // 生成event-master-uuid，主服务的判断标识
        global.eventInfo.eventMasterUuid = Utils.getUuid()
        ConfigController.updateConfig(masterUuidKey, {configValue: global.eventInfo.eventMasterUuid})
        setTimeout(() => {
            ConfigController.getConfig(masterUuidKey).then((uuidRes) => {
                if (uuidRes && uuidRes.length) {
                    eventMasterUuidInDb = uuidRes[0].configValue
                }
            })
        }, Math.floor(Math.random() * 1000))

        //创建今天的日志表
        // SdkReleaseController.timerCreateTableByDay(0).catch((e)=>{
        //     log.printError(e)
        // });
        
        setTimeout(() => {
            //创建项目和初始化五个卡片
            CommonInitDataController.initData().catch((e)=>{
                log.printError("创建项目和初始化卡片",e)
            });
        }, 5000)

        // 创建系统模板和系统项目
        WeHandleDataController.createWeTemplateData().catch((e)=>{
            log.printError("创建系统模板和系统项目",e)
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
                // 每隔1分钟执行
                if (minuteTimeStr.substring(3) == "00") {
                    ConfigController.getConfig(masterUuidKey).then((uuidRes) => {
                        if (uuidRes && uuidRes.length) {
                            eventMasterUuidInDb = uuidRes[0].configValue
                        }
                    })
                }
                
                // 每小时的结束前，重新选举master
                if (minuteTimeStr == "59:50") { 
                    // 生成event-master-uuid，主服务的判断标识
                    global.eventInfo.eventMasterUuid = Utils.getUuid()
                    setTimeout(() => {
                        ConfigController.updateConfig(masterUuidKey, {configValue: global.eventInfo.eventMasterUuid})
                    }, Math.floor(Math.random() * 1000))
                }

                // 每天的0点05分，定时执行生成今天的表
                // if (hourTimeStr == "00:05:01") {
                //     if (eventMasterUuidInDb === global.eventInfo.eventMasterUuid) {
                //         SdkReleaseController.timerCreateTableByDay(0).catch((e)=>{
                //             log.printError(e)
                //         });
                //     }
                // }
                // 每天的23:55点，定时执行生成明天的表
                //  if (hourTimeStr == "23:55:01") {
                //     if (eventMasterUuidInDb === global.eventInfo.eventMasterUuid) {
                //         SdkReleaseController.timerCreateTableByDay(1).catch((e)=>{
                //             log.printError(e)
                //         });
                //     }
                // }
                //每天凌晨0点10分开始分析昨天的执行计算规则
                if (hourTimeStr === '00:10:00'){
                    if (eventMasterUuidInDb === global.eventInfo.eventMasterUuid) {
                        TimerStatisticController.calculateDataPreDay('', -1);
                    }
                }
                // console.log(minuteTimeStr, eventMasterUuidInDb, global.eventInfo.eventMasterUuid)
                // 每小时的46分，开始统计今天的数据
                let isOpenTodayStatistic = accountInfo.isOpenTodayStatistic
                // if (isOpenTodayStatistic && minuteTimeStr == "46:00") {
                    // if (eventMasterUuidInDb === global.eventInfo.eventMasterUuid) {
                        // TimerStatisticController.calculateDataPreDay('', 0);
                    // }
                // }
                // 凌晨0点03分，开始统计昨天的数据
                if (isOpenTodayStatistic && hourTimeStr == "00:03:00") {
                    if (eventMasterUuidInDb === global.eventInfo.eventMasterUuid) {
                        TimerStatisticController.calculateDataPreDay('', -1);
                    }
                }
                // 凌晨2点30开始删除过期的数据库表
                if (hourTimeStr == "02:00:00") {
                    if (eventMasterUuidInDb === global.eventInfo.eventMasterUuid) {
                        Common.startDelete()
                    }
                } else if (hourTimeStr == "02:30:00") {
                    Common.startDelete()
                }
                // 每隔1分钟，取出全局变量global.eventInfo.logCountInMinute的值，并清0
                if (minuteTimeStr.substring(3) == "00") {
                    global.eventInfo.logCountInMinuteList.push(global.eventInfo.logCountInMinute)
                    global.eventInfo.logCountInMinute = 0
                    if (global.eventInfo.logCountInMinuteList.length > 60) {
                        global.eventInfo.logCountInMinuteList.shift()
                    }
                }

                // 每分钟的最后一秒执行, 开发完成后移除
                // if (minuteTimeStr.substring(3) == "59") {
                //     const dayName = tempDate.Format("yyyy-MM-dd")
                //     const hourName = tempDate.Format("yyyy-MM-dd hh")
                //     // 每分钟更新流量信息
                //     TimerCalculateController.saveFlowDataByHour(dayName, hourName)
                // }

                // 每隔10秒钟，取日志队列里的日志，执行入库操作
                if (minuteTimeStr.substring(4) == "0") {
                    // 取日志队列批量插入
                    Common.handleLogInfoQueue()
                    // 更新内存中的token
                    ConfigController.refreshTokenList()
                }
            
                // 每个小时的最后一秒执行
                if (minuteTimeStr == "59:00") {
                    const dayName = tempDate.Format("yyyy-MM-dd")
                    const hourName = tempDate.Format("yyyy-MM-dd hh")
                    // 每分钟更新流量信息
                    TimerCalculateController.saveFlowDataByHour(dayName, hourName)
                }

            } catch(e) {
                log.printError("定时器执行报错：", e)
            }
            setTimeout(fixed, nextTime);
        }
        setTimeout(fixed, 1000);
    }, 6000);
}