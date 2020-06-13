module.exports = {
    localServerDomain: 'localhost:8011', // 日志服务域名  书写形式：localhost:8011
    localAssetsDomain: 'localhost:8010', // 数据可视化服务域名 书写形式：localhost:8010
    localServerPort: '8011',               // 日志服务端口号
    localAssetsPort: '8010',               // 可视化系统端口号

    /**
     * 注意：不懂可以不用设置，【千万不要乱设置】
     * 
     * 1. 什么情况设置：如果同一个主域名下有多个项目，并且同一个UserId的用户，会访问这多个项目
     * 2. 设置结果：使用userId查询，可以将一个用户在多个项目上的行为串联起来。
     * 
     * 例如：www.baidu.com  主域名就是：baidu.com
     */
    mainDomain: ''                         // 公司主域名 
}