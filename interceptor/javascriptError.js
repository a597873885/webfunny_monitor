const Utils = require('../util/utils');
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
    const {webMonitorId, infoType, errorMessage} = res

    const tempErrorMessage = Utils.b64DecodeUnicode(errorMessage)
    const msgArr = tempErrorMessage.split(": ")
    const type = msgArr[0] || msgArr[1] || msgArr[2] || ""
    
    if (infoType === "on_error") {
        // 根据错误类型处理
        switch(type) {
            case "TypeError":
                // 填写你自己的逻辑
                break;
            case "Script error.":
                break;
            case "UncaughtInPromiseError":
                break;
            case "ReferenceError":
                break;
            default:
                break;  
        }
    } else if (infoType === "console_error") {
        // 这里是自定义报错：捕获的都是 console.error 打印的错误
    }
}

module.exports = handleResultWhenJavascriptError