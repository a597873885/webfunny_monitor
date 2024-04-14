require("colors")
const { UserController, CommonTableController, ApplicationConfigController, TimerCalculateController, ProductController } = require("../controllers/controllers.js")
const Utils = require('../util/utils');
const log = require("../../../config/log");
/**
 * 定时任务
 */
module.exports = async () => {
    global.centerInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
    }, 5 * 60 * 1000)
    setTimeout(() => {
        console.log(" __          __  ______   ____    ______   _    _   _   _   _   _  __     __       _____   _   _ ".cyan)
        console.log(" \\ \\        / / |  ____| |  _ \\  |  ____| | |  | | | \\ | | | \\ | | \\ \\   / /      / ____| | \\ | |".cyan)
        console.log("  \\ \\  /\\  / /  | |__    | |_) | | |__    | |  | | |  \\| | |  \\| |  \\ \\_/ /      | |      |  \\| |".cyan)
        console.log("   \\ \\/  \\/ /   |  __|   |  _ <  |  __|   | |  | | | . ` | | . ` |   \\   /       | |      | . ` |".cyan)
        console.log("    \\  /\\  /    | |____  | |_) | | |      | |__| | | |\\  | | |\\  |    | |     _  | |____  | |\\  |".cyan)
        console.log("     \\/  \\/     |______| |____/  |_|       \\____/  |_| \\_| |_| \\_|    |_|    (_)  \\_____| |_| \\_|".cyan)
        console.log(" ")
        console.log(" ")
        console.log("webfunny基座应用启动成功！".yellow)
        console.log("")

        setTimeout(() => {
            // 更新流量上限信息
            TimerCalculateController.updateCompanyData()
        }, 20 * 1000)

        // 服务器启动记录打点
        Utils.postPoint("http://monitor.webfunny.cn/tracker/upEvent", { data: JSON.stringify({
            pointId: "11",
            projectId: "event1029",
            yong_hu_id: Utils.getMac(),
            shouQuanMaId: "apply-center",
        })}).then((res) => {}).catch((e) => {})

        // 初始化登录验证码
        UserController.setValidateCode()
        

        CommonTableController.createTable(0)
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
            const hourMinuteStr = tempDate.Format("hh:mm")
            const hourTimeStr = tempDate.Format("hh:mm:ss")
            const minuteTimeStr = tempDate.Format("mm:ss")
            try {

                // 每个小时更新两次流量信息
                if (minuteTimeStr == "20:00" || minuteTimeStr == "50:00") {
                    TimerCalculateController.updateCompanyData()
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

    }, 6000)
}