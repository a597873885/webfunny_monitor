const Utils = require('../util/utils');
const dingRobot = require("./config/dingRobot")
const domain = require('../bin/domain')
/**
 * 这里是接口的拦截器的拦截器。
 * 每次上报接口日志，都会调用这个方法（可以处理报错，超时等等）
 */
const handleResultWhenHttpRequest = (res) => {
    // console.log(res) // 打印查看其他字段
    const {webMonitorId, statusResult, status, loadTime, simpleUrl } = res
    if (statusResult === "请求返回") {
        switch(status) {
            case 200:
                break;
            case 404:
            case 500:
            case 502:
                const {url, config} = dingRobot
                config.text.content = "您的前端项目（" + webMonitorId + "）发生了一个接口错误：\r\n状态：" + status + "\r\n页面：" + simpleUrl + "\r\n查看详情：http://" + domain.localAssetsDomain + "/httpError.html"
                Utils.postJson(url,config)
                break;
            default:
                break;
        }

        // 接口耗时大于10s
        if (loadTime > 10000) {
            // 填写你的逻辑
        }
    }
}

module.exports = handleResultWhenHttpRequest