/**
 * 这里是使用者自定义的回调方法，每隔10分钟会调用一次。
 * 由你们自行决定如何发起警报，通过接口通知你们自己的服务即可。
 * @param res 参数返回所有的警告信息。
 * 无论你想发送到邮箱，短信，钉钉等，你们自己发送接口通知吧。
 */
const jsError = require('./config/jsError')
const consoleError = require('./config/consoleError')
const httpError = require('./config/httpError')
const resourceError = require('./config/resourceError')
const dingRobot = require("./config/dingRobot")
const domain = require("../bin/domain")
const Utils = require('../util/utils')
const customerWarningCallback = (res) => {

    const {healthPercentList} = res
    if (healthPercentList !== "undefined" && healthPercentList.length > 0) {

        healthPercentList.forEach((item) => {
            const { webMonitorId, score, jsErrorPercent, consoleErrorPercent, resourceErrorPercent, httpErrorPercent } = item
            
            if (item.jsErrorPercent >= jsError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）JS错误率达到：" + jsErrorPercent + "%\r\n 查看详情：http://" + domain.localAssetsDomain + "/javascriptError.html"
                Utils.postJson(url,config) // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (item.consoleErrorPercent >= consoleError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）自定义异常率达到：" +consoleErrorPercent + "%\r\n 查看详情：http://" + domain.localAssetsDomain + "/javascriptError.html"
                Utils.postJson(url,config)  // 钉钉机器人
                
                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (item.httpErrorPercent >= httpError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）接口报错率达到：" + httpErrorPercent + "%\r\n 查看详情：http://" + domain.localAssetsDomain + "/httpError.html"
                Utils.postJson(url,config)  // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
            if (item.resourceErrorPercent >= resourceError.errorPercent) {
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）静态资源错误率达到：" + resourceErrorPercent + "%\r\n 查看详情：http://" + domain.localAssetsDomain + "/resourceError.html"
                Utils.postJson(url,config)  // 钉钉机器人

                // 如果需要其他通知方式，请在此完成报警逻辑
            }
        })
    }
}

module.exports = {
    customerWarningCallback
}