require("colors")
const { UserController, CommonTableController, AlarmListController, TimerCalculateController, ApplicationConfigController } = require("../controllers/controllers.js")
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
        console.warn("╔═════════════════════════════════════启动成功════════════════════════════════════╗".cyan)
        console.warn("║                                                                                 ║".cyan)
        console.warn("║ ██╗    ██╗ ███████╗ ██████╗  ███████╗ ██╗   ██╗ ███╗   ██╗ ███╗   ██╗ ██╗   ██╗ ║".cyan)
        console.warn("║ ██║    ██║ ██╔════╝ ██╔══██╗ ██╔════╝ ██║   ██║ ████╗  ██║ ████╗  ██║ ╚██╗ ██╔╝ ║".cyan)
        console.warn("║ ██║ █╗ ██║ █████╗   ██████╔╝ █████╗   ██║   ██║ ██╔██╗ ██║ ██╔██╗ ██║  ╚████╔╝  ║".cyan)
        console.warn("║ ██║███╗██║ ██╔══╝   ██╔══██╗ ██╔══╝   ██║   ██║ ██║╚██╗██║ ██║╚██╗██║   ╚██╔╝   ║".cyan)
        console.warn("║ ╚███╔███╔╝ ███████╗ ██████╔╝ ██║      ╚██████╔╝ ██║ ╚████║ ██║ ╚████║    ██║    ║".cyan)
        console.warn("║  ╚══╝╚══╝  ╚══════╝ ╚═════╝  ╚═╝       ╚═════╝  ╚═╝  ╚═══╝ ╚═╝  ╚═══╝    ╚═╝    ║".cyan)
        console.warn("║                                                                                 ║".cyan)
        console.warn("║".cyan + " 1. Webfunny应用中心启动成功...                                                  ".yellow + "║".cyan)

        setTimeout(() => {
            TimerCalculateController.updateCompanyDataForEvent()
            ApplicationConfigController.getMachineFingerprint()
        }, 20 * 1000)

        setTimeout(() => {
            // TimerCalculateController.updateCompanyDataForMonitor()
        }, 60 * 1000)

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

                if (minuteTimeStr == "00:00" || minuteTimeStr == "30:00") {
                    TimerCalculateController.updateCompanyDataForMonitor()
                }
                if (minuteTimeStr == "15:00" || minuteTimeStr == "45:00") {
                    TimerCalculateController.updateCompanyDataForEvent()
                }

                if (minuteTimeStr.substring(2) == ":00") {
                    oneMinuteCount++
                    await AlarmListController.calculateAlarm(oneMinuteCount, weekDay, hourTimeStr)
                }

                if (hourTimeStr == "00:00:01") {
                    CommonTableController.createTable(0)
                } 
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