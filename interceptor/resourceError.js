/**
 * 这里是静态资源错误的拦截器。
 * 每次发生静态资源报错，都会调用这个方法
 */
const handleResultWhenResourceError = (res) => {
    // console.log(res) // 打印查看其他字段
    const {webMonitorId, sourceUrl, simpleUrl, happenDate} = res
    // 下方书写自己的逻辑
}

module.exports = handleResultWhenResourceError