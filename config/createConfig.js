module.exports = {
        localServerDomain: '//localhost:8011', // 日志服务域名
        localAssetsDomain: '//localhost:8010', // 数据可视化服务域名
        localServerPort: '8011',  // 日志服务端口号
        localAssetsPort: '8010',  // 可视化系统端口号

        messageQueue: false,  // 是否开启消息对列，订阅版可以开启
        purchaseCode: 'AAAABBBBCCCCDDDD', // 试用版激活码
        email: '',  // 接收警报的邮箱（只支持163邮箱）, 订阅版可以开启
        emailPassword: '' // 邮箱密码
}