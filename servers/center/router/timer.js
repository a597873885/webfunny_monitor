require("colors")
const { UserController, CommonTableController, AlarmListController, TimerCalculateController, ApplicationConfigController, ReportGeneratorServiceController } = require("../controllers/controllers.js")
const Utils = require('../util/utils');
const AccountConfig = require("../config/AccountConfig");
const { accountInfo } = AccountConfig;
const log = require("../../../config/log");
const weekDays = [0,1,2,3,4,5,6];
const MasterElection = require('../util/masterElection');
// 创建 Master 选举实例
const masterElection = new MasterElection({
    lockKey: 'center-master-lock',
    lockTimeout: 30,  // 锁超时30秒
    renewInterval: 10, // 每10秒续约一次
    onBecomeMaster: () => {
        console.log('🎉 当前节点成为 Master，开始执行主节点任务'.yellow)
    },
    onLoseMaster: () => {
        console.log('⚠️  当前节点失去 Master 身份，停止执行主节点任务'.red)
    }
});

// 将实例挂载到全局，方便其他模块使用
global.masterElection = masterElection;
/**
 * 定时任务
 */
module.exports = async () => {
    global.centerInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
    }, 5 * 60 * 1000)
    setTimeout(() => {
        console.warn("╔═════════════════════════════════════启动成功════════════════════════════════════╗".cyan)
        console.warn("                                                                                 ".cyan)
        console.warn(" ██╗    ██╗ ███████╗ ██████╗  ███████╗ ██╗   ██╗ ███╗   ██╗ ███╗   ██╗ ██╗   ██╗ ".cyan)
        console.warn(" ██║    ██║ ██╔════╝ ██╔══██╗ ██╔════╝ ██║   ██║ ████╗  ██║ ████╗  ██║ ╚██╗ ██╔╝ ".cyan)
        console.warn(" ██║ █╗ ██║ █████╗   ██████╔╝ █████╗   ██║   ██║ ██╔██╗ ██║ ██╔██╗ ██║  ╚████╔╝   ".cyan)
        console.warn(" ██║███╗██║ ██╔══╝   ██╔══██╗ ██╔══╝   ██║   ██║ ██║╚██╗██║ ██║╚██╗██║   ╚██╔╝    ".cyan)
        console.warn(" ╚███╔███╔╝ ███████╗ ██████╔╝ ██║      ╚██████╔╝ ██║ ╚████║ ██║ ╚████║    ██║     ".cyan)
        console.warn("  ╚══╝╚══╝  ╚══════╝ ╚═════╝  ╚═╝       ╚═════╝  ╚═╝  ╚═══╝ ╚═╝  ╚═══╝    ╚═╝     ".cyan)
        console.warn("                                                                                  ".cyan)
        console.warn(" 1. 应用中心-服务启动成功...                                                  ".yellow)

        
        // 启动 Master 选举心跳机制
        masterElection.startHeartbeat()

        
        setTimeout(() => {
            ApplicationConfigController.getMachineFingerprint()
        }, 20 * 1000)

        setTimeout(() => {
            // TimerCalculateController.updateCompanyDataForMonitor()
            // TimerCalculateController.updateCompanyDataForApm()
            TimerCalculateController.updateCompanyDataForEvent()
        }, 30 * 1000)

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

                // 只在 Master 节点执行的任务
                if (masterElection.isMasterNode()) {
                    if (minuteTimeStr == "00:00") {
                        console.log('[Master任务] 执行更新监控系统公司数据'.cyan)
                        TimerCalculateController.updateCompanyDataForMonitor(minuteTimeStr)
                    }
                    if (minuteTimeStr == "20:00") {
                        console.log('[Master任务] 执行更新APM系统公司数据'.cyan)
                        TimerCalculateController.updateCompanyDataForApm(minuteTimeStr)
                    }
                    if (minuteTimeStr == "40:00") {
                        console.log('[Master任务] 执行更新埋点系统公司数据'.cyan)
                        TimerCalculateController.updateCompanyDataForEvent(minuteTimeStr)
                    }
    

                    // 本地环境不执行以下操作：告警定时器、报表分析数据定时器、报表发送时间定时器
                    if (!Utils.isLocalEnvironment(accountInfo)) {
                        if (minuteTimeStr.substring(2) == ":00") {
                            oneMinuteCount++
                            await AlarmListController.calculateAlarm(oneMinuteCount, weekDay, hourTimeStr)
                        }
    
                         // 报表分析数据定时器，（0点到2点半之间分析）按公司来分析
                        if (hourTimeStr == "00:05:00") {
                            // 启动按公司分批处理的报表生成服务
                            ReportGeneratorServiceController.startByCompany();
                            log.info('Report generator service started successfully');
                        }
                        // 报表发送时间定时器，每天十点后，每分钟执行一次
                        if (hourMinuteStr >= "04:00" && minuteTimeStr.substring(2) == ":00") {
                                ReportGeneratorServiceController.startSendReport(1); // 每分钟检查一次
                                log.info('Report send service send successfully');
                        }
                    }
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