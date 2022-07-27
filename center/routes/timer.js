require("colors")
const { 
    UserController, ApplicationConfigController,
} = require("../controllers/controllers.js")
const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig
/**
 * 定时任务
 */
module.exports = async () => {
    global.monitorInfo.loginValidateCodeTimer = setInterval(() => {
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
        console.log("服务启动成功...".yellow)
        console.log("")
        console.log("作者：一步一个脚印一个坑".white)
        console.log("微信：webfunny2".white)
        console.log(" ")
        console.log("访问首页地址：", ("http://" + accountInfo.localAssetsDomain + "/webfunny_center/main.html ").blue.underline)
        console.log("部署问题集合：", "http://www.webfunny.cn/website/faq.html".blue.underline)
        console.log(" ")
        console.log("启动服务：", "npm run prd".cyan)
        console.log("重启服务：", "npm run restart".cyan)
        console.log(" ")
        console.log("服务已在后台运行，命令行（终端）可关闭。".cyan)
        console.log("查看进程：", "pm2 list".cyan)
        console.log(" ")
        console.log("研发不易，需要鼓励。去给我们的项目点个 Star 吧".green, "https://github.com/a597873885/webfunny_monitor".cyan.underline)
        console.log(" ")

        // 初始化登录验证码
        UserController.setValidateCode()
        // 初始化监控系统的域名配置信息
        ApplicationConfigController.setInitSysConfigInfo("localhost:8011", "localhost:8010", "monitor")
        // 初始化埋点系统的域名配置信息
        ApplicationConfigController.setInitSysConfigInfo("localhost:8015", "localhost:8014", "event")
    }, 6000)
}