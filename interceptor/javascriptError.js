const Utils = require('../util/utils');
const dingRobot = require("./config/dingRobot")
const domain = require('../bin/domain')
/**
 * 这里是js错误的拦截器。
 * 每次发生js报错，都会调用这个方法
 */
const handleResultWhenJavascriptError = (res) => {
    /**
     * webMonitorId: 每个项目对应的id，如果需要特殊处理某个项目，就可以用它
     * infoType: 错误类型，on_error、console_error
     * errorMessage: 错误消息
     */
    // console.log(res) // 打印查看其他字段
    const {webMonitorId, infoType, errorMessage, simpleUrl} = res

    const tempErrorMessage = Utils.b64DecodeUnicode(errorMessage)
    const msgArr = tempErrorMessage.split(": ")
    const type = msgArr[0] || msgArr[1] || msgArr[2] || ""

    const errorObj = {
        type,
        logData: res
    }
    global.monitorInfo.errorLogListForLast200.push(errorObj)
    
    if (infoType === "on_error") {
        // 根据错误类型处理
        switch(type) {
            case "TypeError":
            case "ReferenceError":
            case "UncaughtInPromiseError":
                    const {url, config} = dingRobot
                    config.text.content = "您的前端项目（" + webMonitorId + "）发生了一个错误：\r\n类型：" + type + "\r\n信息：" + tempErrorMessage + "\r\n页面：" + simpleUrl + "\r\n查看详情：http://" + domain.localAssetsDomain + "/javascriptErrorDetail.html?infoType=" + infoType + "&timeType=0&errorMsg=" + errorMessage
                    Utils.postJson(url,config)
                break;
            case "Script error.":
                break;
            default:
                break;  
        }
    } else if (infoType === "console_error") {
        // 这里是自定义报错：捕获的都是 console.error 打印的错误
    }
}

module.exports = handleResultWhenJavascriptError