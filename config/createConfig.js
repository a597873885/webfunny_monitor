const { purchaseCode } = require("../bin/purchaseCode")
module.exports = {
    purchaseCode: purchaseCode || 'AAAABBBBCCCCDDDD',    // 分享版激活码

    webfunnyNeedLogin: false,              // 前端是否验证登录状态
                                           // 开启登录验证后，只能看到自己创建的项目。
                                           // 不开启登录验证，可以看到所有的项目列表。

    messageQueue: false,                   // 是否开启消息对列, 使用消息队列，需安装rabbitMq，请勿随意开启

    localServerDomain: '//localhost:8011', // 日志服务域名 
    localAssetsDomain: '//localhost:8010', // 数据可视化服务域名
    localServerPort: '8011',               // 日志服务端口号
    localAssetsPort: '8010',               // 可视化系统端口号

    email: '',                             // 接收警报的邮箱（只支持163邮箱）
    emailPassword: ''                      // 邮箱密码
}