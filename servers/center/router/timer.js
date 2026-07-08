require("colors")
const { UserController, CommonTableController, ApplicationConfigController, TimerCalculateController } = require("../controllers/controllers.js")
const timerUtil = require("../../../utils/timer.js")
const Utils = require('../util/utils.js');
const log = require("../../../config/log.js");
/**
 * 定时任务
 */
module.exports = async () => {
    global.centerInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
    }, 5 * 60 * 1000)
    setTimeout(() => {
        // 服务器启动记录打点
        Utils.postPoint("http://monitor.webfunny.cn/tracker/upEvent", { data: JSON.stringify({
            pointId: "11",
            projectId: "event1029",
            yong_hu_id: Utils.getMac(),
            shouQuanMaId: "apply-center",
        })}).then((res) => {}).catch((e) => {})

        // 初始化登录验证码
        UserController.setValidateCode()
        // 初始化监控系统的域名配置信息
        ApplicationConfigController.setInitSysConfigInfo("localhost:8011", "localhost:8010", "monitor")
        // 初始化埋点系统的域名配置信息
        ApplicationConfigController.setInitSysConfigInfo("localhost:8015", "localhost:8014", "event")

        CommonTableController.createTable(0)

        //启动一个定时器
        timerUtil((dateTime) => {
            const hourMinuteStr = dateTime.Format("hh:mm")
            const hourTimeStr = dateTime.Format("hh:mm:ss")
            const minuteTimeStr = dateTime.Format("mm:ss")
            try {
                // 每分钟的第一秒，（应该每个小时的第一秒执行）
                if (minuteTimeStr.substring(3) == "01") {
                    // 每分钟更新流量信息
                    TimerCalculateController.calculateCountByDay(0)
                }
                // 凌晨0点01分开始创建当天的数据库表
                if (hourTimeStr == "00:00:01") {
                    CommonTableController.createTable(0)
                } 
                // 晚上11点55分开始创建第二天的数据库表
                if (hourTimeStr == "23:55:01") {
                    CommonTableController.createTable(1)
                } 
            } catch(e) {
                log.printError("定时器执行报错：", e)
            }
        })
    }, 6000)
}