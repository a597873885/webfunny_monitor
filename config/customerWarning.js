/**
 * 这里是使用者自定义的回调方法，每隔10分钟会调用一次。
 * 由你们自行决定如何发起警报，通过接口通知你们自己的服务即可。
 * @param res 参数返回所有的警告信息。
 * 无论你想发送到邮箱，短信，钉钉等，你们自己发送接口通知吧。
 */
const customerWarningCallback = (res) => {
    const {concurrencyCount, healthScoreList} = res
    
    /**
     * 各种报错信息统计
     * 上报条件：
     * 1.健康总评分小于某个值的时候；
     * 2.报错率超过某个值的时候；（0.1 代表 10%）
     */
    if (healthScoreList !== "undefined" && healthScoreList.length > 0) {

        healthScoreList.forEach((item) => {
            // 一般情况下，小于96分，就已经处于警报的边界
            if (item.score < 96) {
                /** 这里写你自己的报警逻辑代码 */
            }
            const defaultPercent = 0.1  // 0.1 代表报错率达到10%
            if (item.jsErrorPercent > defaultPercent || 
                item.consoleErrorPercent > defaultPercent ||
                item.resourceErrorPercent > defaultPercent ||
                item.httpErrorPercent > defaultPercent) {

                /** 这里写你自己的报警逻辑代码 */
            }

        })
    }

    /**
     * 服务并发量统计数（每分钟上报的日志数量）
     * 上报条件：
     * 1.数值为0（代表上报服务有问题了）；
     * 2.数值过高（并发量过高了，可以调整上报评率）
     */
    if (concurrencyCount !== "undefined") {

        // 当前一分钟内并发量为 0 的时候
        if (concurrencyCount === 0) {
            /** 这里写你自己的报警逻辑代码
             *  fetch 方法的demo都给你写好了 
             * 
                fetch("url",
                {
                    method: "POST", 
                    body: JSON.stringify({cdkey: "aaaa"}),
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                })
                .then( res => res.text())
                .then( async (res) => {

                }).catch((e) => {
                    
                })
            */
        }

        // 当前一分钟内并发量大于 10万 的时候
        if (concurrencyCount > 100000) {
            /** 这里写你自己的报警逻辑代码 */
        }
    }

}

module.exports = {
    customerWarningCallback
}