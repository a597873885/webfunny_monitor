const { Common, ConfigController } = require("../controllers/controllers.js")
const Utils = require("../util/utils")
const log = require("../config/log");
const AccountConfig = require("../config/AccountConfig");
const { accountInfo, localAssetsDomain } = AccountConfig
const masterUuidKey = "monitor-master-uuid"
/**
 * 定时任务
 */
module.exports = async () => {
    
    /** * 定时任务  开始 */
    setTimeout(() => {
        // Common.createTable(0)
        // TimerCalculateController.setMonitorSecretList()
        // 数据库里存放的monitor-master-uuid
        let monitorMasterUuidInDb = ""
        // 生成monitor-master-uuid，主服务的判断标识
        global.fileInfo.monitorMasterUuid = Utils.getUuid()
        ConfigController.updateConfig(masterUuidKey, {configValue: global.fileInfo.monitorMasterUuid})
        setTimeout(() => {
            ConfigController.getConfig(masterUuidKey).then((uuidRes) => {
                if (uuidRes && uuidRes.length) {
                    monitorMasterUuidInDb = uuidRes[0].configValue
                }
            })
        }, 2000)

        const startTime = new Date().getTime();
        let count = 0;
        let prevHourMinuteStr = new Date().Format("hh:mm")
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


            } catch(e) {
                log.printError("定时器执行报错：", e)
            }
            setTimeout(fixed, nextTime);
        }
        setTimeout(fixed, 1000);
    }, 6000)
}