const { 
    Common, AlarmController, UserController, TimerCalculateController,
    MessageController, ProjectController, ConfigController
} = require("../controllers/controllers.js")
const log = require("../../../config/log");
const AccountConfig = require("../config/AccountConfig");
const { accountInfo } = AccountConfig
const timerUtil = require("../../../utils/timer.js")
const Utils = require("../util/utils")
const masterUuidKey = "monitor-master-uuid"
/**
 * 定时任务
 */
module.exports = async (customerWarningCallback, serverType = "master") => {
    /**
     * 3秒后开始接收消息队列里的数据
     * */
    setTimeout(() => {
        if (accountInfo.messageQueue === true) {
            // 开始接收消息队列的消息
            Common.startReceiveMsg()
            Common.startReceiveMsgForMog()
        }
        // 将每个项目的配置放入全局变量中
        Common.setProjectConfigList()
        setTimeout(() => {
            console.log("启动监控项目列表：", JSON.stringify(global.monitorInfo.cacheWebMonitorIdList))
        }, 10000)
        
        // 将项目的webMonitorId列表放入全局变量，并放入bin/webMonitorIdList.js文件中
        // Common.setStopWebMonitorIdList()
    }, 3000)
    /**
     * 2秒后开始进行第一次分析
     * */
    setTimeout(() => {
        // TimerCalculateController.calculateCountByHour(1)
        // Common.calculateCountByDayForTenMinutes(0)
        // TimerCalculateController.calculateCountByDay(0)
        // TimerCalculateController.calculateCountByHour(1)

    }, 2000)
    Common.consoleLogo()
    // 初始化登录验证码
    UserController.setValidateCode()
    global.monitorInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
    }, 5 * 60 * 1000)
    
    /** * 定时任务  开始 */
    setTimeout(() => {
        Common.consoleInfo()
        Common.createTable(0)

        // if (process.env.LOGNAME === "jeffery") {
        //     console.log("=====本地服务，不再启动定时器====")
        //     return
        // }

        // 数据库里存放的monitor-master-uuid
        let monitorMasterUuidInDb = ""
        // 生成monitor-master-uuid，主服务的判断标识
        global.monitorInfo.monitorMasterUuid = Utils.getUuid()
        ConfigController.updateConfig(masterUuidKey, {configValue: global.monitorInfo.monitorMasterUuid})

        setTimeout(() => {
            // 优先取出数据库里的ID
            ConfigController.getConfig(masterUuidKey).then((uuidRes) => {
                if (uuidRes && uuidRes.length) {
                    monitorMasterUuidInDb = uuidRes[0].configValue
                }
            })
        }, Math.floor(Math.random() * 1000))


        let prevHourMinuteStr = new Date().Format("hh:mm")
        //启动一个定时器
        timerUtil((dateTime) => {
            const hourMinuteStr = dateTime.Format("hh:mm")
            const hourTimeStr = dateTime.Format("hh:mm:ss")
            const minuteTimeStr = dateTime.Format("mm:ss")

            // 每隔10秒钟，取日志队列里的日志，执行入库操作
            if (minuteTimeStr.substring(4) == "0") {
                // 去消息队列
                Common.handleLogInfoQueue()
                // 更新内存中的token
                ConfigController.refreshTokenList()
            }
            // 每小时结束前，重新选举master
            if (minuteTimeStr == "59:50") { 
                // 生成monitor-master-uuid，主服务的判断标识
                global.monitorInfo.monitorMasterUuid = Utils.getUuid()
                setTimeout(() => {
                    ConfigController.updateConfig(masterUuidKey, {configValue: global.monitorInfo.monitorMasterUuid})
                }, Math.floor(Math.random() * 1000))
            }
            

            // 每天的最后一分钟，更新一次日志信息
            if (hourTimeStr == "23:59:00") {
                if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                    MessageController.saveLastVersionInfo()
                }
            }
            // 每隔1分钟执行
            if (minuteTimeStr.substring(3) == "00") {
                // 查询数据库里的uuid
                ConfigController.getConfig(masterUuidKey).then((uuidRes) => {
                    if (uuidRes && uuidRes.length) {
                        monitorMasterUuidInDb = uuidRes[0].configValue
                    }
                })
                console.log("准备发起告警", monitorMasterUuidInDb, global.monitorInfo.monitorMasterUuid)
                if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                    console.log("将发起告警", monitorMasterUuidInDb, global.monitorInfo.monitorMasterUuid)
                    // 检查警报规则是否出发
                    AlarmController.checkAlarm(hourTimeStr, minuteTimeStr)
                    // 更新webMonitorId到缓存中
                    ProjectController.cacheWebMonitorId()
                    // 更新登录缓存到数据库，供从服务器使用
                }
            }

            // 每隔1分钟的第5秒执行
            if (minuteTimeStr.substring(3) == "05") {
                if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                    TimerCalculateController.calculateCountByMinute(prevHourMinuteStr, 0)
                    prevHourMinuteStr = hourMinuteStr
                }
            }

            try {
                // 如果是凌晨，则计算上一天的分析数据
                if (hourTimeStr > "00:06:00" && hourTimeStr < "00:12:00") {
                    if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                        TimerCalculateController.calculateCountByDay(minuteTimeStr, -1)
                    }
                } else if (minuteTimeStr > "06:00" && minuteTimeStr < "12:00") {
                    if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                        TimerCalculateController.calculateCountByDay(minuteTimeStr, 0)
                    }
                }
                // 每小时的前6分钟，会计算小时数据
                if (minuteTimeStr > "00:00" && minuteTimeStr < "06:00") {
                    if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                        TimerCalculateController.calculateCountByHour(minuteTimeStr, 1, customerWarningCallback)
                    }
                }
                // 每隔1分钟，取出全局变量global.monitorInfo.logCountInMinute的值，并清0
                if (minuteTimeStr.substring(3) == "00") {
                    global.monitorInfo.logCountInMinuteList.push(global.monitorInfo.logCountInMinute)
                    global.monitorInfo.logCountInMinute = 0
                    if (global.monitorInfo.logCountInMinuteList.length > 60) {
                        global.monitorInfo.logCountInMinuteList.shift()
                    }
                }
                // 每小时的51分，开始flush pm2 的日志
                if (minuteTimeStr == "51:00") {
                    Common.pm2Flush()
                }
                // 凌晨0点01分开始创建当天的数据库表
                if (hourTimeStr == "00:00:01") {
                    if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                        Common.createTable(0)
                    }
                } 
                // 晚上11点55分开始创建第二天的数据库表
                if (hourTimeStr == "23:55:01") {
                    if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                        Common.createTable(1)
                    }
                } 
                // 凌晨2点开始删除过期的数据库表
                if (hourTimeStr == "02:00:00") {
                    if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                        Common.startDelete()
                    }
                } else if (hourTimeStr == "02:30:00") {
                    // 凌晨2点半删除过期的数据库表，作为兜底操作。 数据一直删除不全，感觉像是权限导致的
                    Common.startDelete()
                }
                // 凌晨2点20分开始删除无效的数据库表
                // if (hourTimeStr == "02:20:00") {
                //     Common.startClearInvalidTable()
                // }
            } catch(e) {
                log.printError("定时器执行报错：", e)
            }
        })
    }, 6000)
}