/**
 * 这里是接口的拦截器的拦截器。
 * 每次上报接口日志，都会调用这个方法（可以处理报错，超时等等）
 */
const handleResultWhenHttpRequest = (res) => {
    // console.log(res) // 打印查看其他字段
    const {webMonitorId, statusResult, status, loadTime } = res
    if (statusResult === "请求返回") {
        switch(status) {
            case 200:
                break;
            case 404:
            case 500:
            case 502:
                // 填写你自己的逻辑
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