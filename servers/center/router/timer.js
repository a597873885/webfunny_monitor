require("colors")
const { UserController, CommonTableController, AlarmListController, TimerCalculateController } = require("../controllers/controllers.js")
const Utils = require('../util/utils');
const log = require("../../../config/log");
const weekDays = [0,1,2,3,4,5,6];
/**
 * 定时任务
 */
module.exports = async () => {
    global.centerInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
    }, 5 * 60 * 1000)
    setTimeout(() => {
        console.warn(" ██╗    ██╗ ███████╗ ██████╗  ███████╗ ██╗   ██╗ ███╗   ██╗ ███╗   ██╗ ██╗   ██╗".cyan)
        console.warn(" ██║    ██║ ██╔════╝ ██╔══██╗ ██╔════╝ ██║   ██║ ████╗  ██║ ████╗  ██║ ╚██╗ ██╔╝".cyan)
        console.warn(" ██║ █╗ ██║ █████╗   ██████╔╝ █████╗   ██║   ██║ ██╔██╗ ██║ ██╔██╗ ██║  ╚████╔╝".cyan)
        console.warn(" ██║███╗██║ ██╔══╝   ██╔══██╗ ██╔══╝   ██║   ██║ ██║╚██╗██║ ██║╚██╗██║   ╚██╔╝".cyan)
        console.warn(" ╚███╔███╔╝ ███████╗ ██████╔╝ ██║      ╚██████╔╝ ██║ ╚████║ ██║ ╚████║    ██║".cyan)
        console.warn("  ╚══╝╚══╝  ╚══════╝ ╚═════╝  ╚═╝       ╚═════╝  ╚═╝  ╚═══╝ ╚═╝  ╚═══╝    ╚═╝".cyan)
        console.warn(" ")
        console.warn(" ")
        console.warn("webfunny基座应用启动成功！".yellow)
        console.warn("")

        setTimeout(() => {
            // 更新流量上限信息
            TimerCalculateController.updateCompanyData()
        }, 20 * 1000)

        // 服务器启动记录打点
        // Utils.postPoint("http://monitor.webfunny.cn/tracker/upEvent", { data: JSON.stringify({
        //     pointId: "11",
        //     projectId: "event1029",
        //     yong_hu_id: Utils.getMac(),
        //     shouQuanMaId: "apply-center",
        // })}).then((res) => {}).catch((e) => {})

        // 初始化登录验证码
        UserController.setValidateCode()
        

        CommonTableController.createTable(0)
        const startTime = new Date().getTime();
        let count = 0;
        let oneMinuteCount = 0;
        const fixed = async () => {
            count ++;
            const tempDate = new Date()
            const tempTime = new Date().getTime()
            const wrongTime = startTime + count * 1000
            var offset = tempTime - wrongTime;
            var nextTime = 1000 - offset;
            if (nextTime < 0) nextTime = 0;
            const hourMinuteStr = tempDate.Format("hh:mm")
            const hourTimeStr = tempDate.Format("hh:mm:ss")
            const minuteTimeStr = tempDate.Format("mm:ss")
            const day = tempDate.getDay()
            const weekDay = weekDays[day]
            try {

                // 每个小时更新两次流量信息
                if (minuteTimeStr == "20:00" || minuteTimeStr == "50:00") {
                    TimerCalculateController.updateCompanyData()
                }

                // 告警定时器
                if (minuteTimeStr.substring(2) == ":00") {
                    oneMinuteCount++
                    await AlarmListController.calculateAlarm(oneMinuteCount, weekDay, hourTimeStr)
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
            setTimeout(fixed, nextTime);
        }
        setTimeout(fixed, 1000);

    }, 3000)
}