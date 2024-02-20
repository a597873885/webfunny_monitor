const { Common, AlarmController, MessageController, ProjectController, TimerCalculateController, ConfigController } = require("../controllers/controllers.js")
const Utils = require("../util/utils")
const log = require("../../../config/log");
const timerUtil = require("../../../utils/timer.js")
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

        // console.log("==============开始手动计算：")

        // 第一步，把每个小时的数据计算出来， minTimeStrList来决定是哪个类型数据
        // let timer = null
        // let hour = 0
        // timer = setInterval(() => {
        //     if (hour >= 24) {
        //         clearInterval(timer)
        //     }
        //     let minIndex = 0
        //     let timer2 = null
        //     let minTimeStrList = ["00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "04:00"]
        //     timer2 = setInterval(() => {
        //         if (minIndex >= minTimeStrList.length) {
        //             clearInterval(timer2)
        //         }
        //         minTimeStrList.forEach((minTime) => {
        //             TimerCalculateController.calculateCountByHour(minTime, hour)
        //         })
        //         minIndex ++
        //     }, 1000)
        //     hour ++
        // }, 5000)

        // 第二步，计算每天的数据
        // let dayTimeStrList = ["12:10"] // ["06:10", "08:10", "09:10", "10:15", "11:10", "12:10"]
        // dayTimeStrList.forEach((dayTime) => {
        //     TimerCalculateController.calculateCountByDay(dayTime, 0)
        // })

    }, 20000)
    Common.consoleLogo()

    setTimeout(() => {
        Common.consoleInfo()
        // if (process.env.LOGNAME === "jeffery") {
        //     console.log("=====本地服务，不再启动定时器====")
        //     return
        // }
        // Common.createTable(0)
        // 数据库里存放的monitor-master-uuid
        let monitorMasterUuidInDb = ""
        // 生成monitor-master-uuid，主服务的判断标识
        global.monitorInfo.monitorMasterUuid = Utils.getUuid()
        ConfigController.updateConfig(masterUuidKey, {configValue: global.monitorInfo.monitorMasterUuid})
        setTimeout(() => {
            ConfigController.getConfig(masterUuidKey).then((uuidRes) => {
                if (uuidRes && uuidRes.length) {
                    monitorMasterUuidInDb = uuidRes[0].configValue
                }
            })
        }, 2000)

        //启动一个定时器
        timerUtil((dateTime) => {
            const tempDate = new Date()
            const hourMinuteStr = dateTime.Format("hh:mm")
            const hourTimeStr = dateTime.Format("hh:mm:ss")
            const minuteTimeStr = dateTime.Format("mm:ss")

            // console.log("监控定时器：" + hourTimeStr)

            // 每隔10秒钟，取日志队列里的日志，执行入库操作
            if (minuteTimeStr.substring(4) == "0") {
                // 去消息队列
                Common.handleLogInfoQueue()
                // 更新内存中的token
                ConfigController.refreshTokenList()

            }
            // 每小时最后，重新选举master
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
                ConfigController.getConfig(masterUuidKey).then((uuidRes) => {
                    if (uuidRes && uuidRes.length) {
                        monitorMasterUuidInDb = uuidRes[0].configValue
                    }
                })
                if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                    // 检查警报规则是否出发
                    AlarmController.checkAlarm(hourTimeStr, minuteTimeStr)
                    // 更新webMonitorId到缓存中
                    ProjectController.cacheWebMonitorId()
                    // 更新登录缓存到数据库，供从服务器使用
                }
            }
            // 每分钟的最后一秒执行, 开发完成后移除
            // if (minuteTimeStr.substring(3) == "59") {
            //     const dayName = tempDate.Format("yyyy-MM-dd")
            //     const hourName = tempDate.Format("yyyy-MM-dd hh")
            //     // 每分钟更新流量信息
            //     TimerCalculateController.saveFlowDataByHour(dayName, hourName)
            // }


            // 每个小时的最后一秒执行
            // if (minuteTimeStr == "59:00") {
            //     const dayName = tempDate.Format("yyyy-MM-dd")
            //     const hourName = tempDate.Format("yyyy-MM-dd hh")
            //     // 每分钟更新流量信息
            //     TimerCalculateController.saveFlowDataByHour(dayName, hourName)
            // }

            // 每隔1分钟
            if (minuteTimeStr.substring(3) == "00") {
                // 每分钟更新活跃流量信息
                TimerCalculateController.updateAliveCountInfo()
            }

            // 每隔1分钟的第5秒执行
            // if (minuteTimeStr.substring(3) == "05") {
            //     if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
            //         TimerCalculateController.calculateCountByMinute(prevHourMinuteStr, 0)
            //         prevHourMinuteStr = hourMinuteStr
            //     }
            // }

            // 如果是凌晨，则计算上一天的分析数据
            if (hourTimeStr > "00:06:00" && hourTimeStr < "00:12:00") {
                // console.log("第二天的分析判断开始：", monitorMasterUuidInDb, global.monitorInfo.monitorMasterUuid)
                if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                    TimerCalculateController.calculateCountByDay(minuteTimeStr, -1)
                }
            } else if (minuteTimeStr > "06:00" && minuteTimeStr < "12:00") {
                if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                    TimerCalculateController.calculateCountByDay(minuteTimeStr, 0)
                }
            }
            // console.log(minuteTimeStr, monitorMasterUuidInDb, global.monitorInfo.monitorMasterUuid)
            // 每小时的前6分钟，会计算小时数据
            // if (minuteTimeStr > "00:00" && minuteTimeStr < "06:00") {
            //     if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
            //         TimerCalculateController.calculateCountByHour(minuteTimeStr, 1, customerWarningCallback)
            //     }
            // }
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
                // if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
                //     Common.createTable(0)
                // }
                global.monitorInfo.projectLogCountList = {}
            } 
            // // 晚上11点55分开始创建第二天的数据库表
            // if (hourTimeStr == "23:55:01") {
            //     if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
            //         Common.createTable(1)
            //     }
            // } 
            // // 凌晨2点开始删除过期的数据库表
            // if (hourTimeStr == "02:00:00") {
            //     if (monitorMasterUuidInDb === global.monitorInfo.monitorMasterUuid) {
            //         Common.startDelete()
            //     }
            // }
            
            // 凌晨2点20分开始删除无效的数据库表
            if (hourTimeStr == "02:20:00") {
                Common.startClearInvalidTable()
            }
        })
    }, 6000)
   
}