<p align=center>
    <img width=400 src="http://www.webfunny.cn/resource/logo-letter.png"/>
</p>


<p align="center">
  <a href="#项目大小"><img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/a597873885/webfunny_monitor"></a>
  <a href="#最近更新"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/a597873885/webfunny_monitor"></a>
  <a href="https://github.com/a597873885/webfunny_monitor/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/a597873885/webfunny_monitor"></a>
  <a href="https://github.com/a597873885/webfunny_monitor/issues?q=is%3Aissue+is%3Aclosed"><img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed-raw/a597873885/webfunny_monitor"></a>
  <a href="#开源协议"><img alt="GitHub" src="https://img.shields.io/github/license/a597873885/webfunny_monitor"></a>
</p>

> 如果你是一位前端工程师，那你一定不止一次去解决一些顽固的线上问题，你也曾想方设法复现用户的bug，结果可能都不太理想。 怎样定位前端线上问题，一直以来，都是很头疼的问题，因为它发生于用户的一系列操作之后。错误的原因可能源于机型，网络环境，复杂的操作行为等等，在我们想要去解决的时候很难复现出来，自然也就无法解决。

> 身为一名前端工程师，我每天都要面临很多线上的问题，一时间让我焦头烂额。公司其他的监控系统也有，但是每次解决问题都需要辗转于各种监控系统之间，亦是疲惫不堪。所以，我便为自己（前端工程师）量身定做了这样一款监控系统，现在分享给大家使用，欢迎点击了解。

> 只需要简单几步，你就可以搭建一套属于自己的前端监控系统了。

### 了解作品  

   [【官网简介】](http://www.webfunny.cn/home.html) | 
   [【Demo效果】](http://www.webfunny.cn/demo/home.html) | 
   [【更新日志】](http://www.webfunny.cn/update.html)
 
   

### 私有化部署方式

   [【部署教程】](https://www.webfunny.cn/des.html)
   
   [【Docker部署】](https://www.webfunny.cn/des.html?blogUrl=https%3A%2F%2Fwww.webfunny.cn%2Fblog%2Fpost%2Finfo%2F70)
   
### 联系作者微信

   微信号：webfunny_2020

   <img width=150 src="http://www.webfunny.cn/src/assets/img/wx_add.jpeg"/>

### 压力测试

可支持日活千万级别PV量。

### 目录结构
```
    |
    |──bin/                                    * 项目启动目录
    |     |
    |     |
    |     |—— domain.js                        * 域名配置文件
    |     |—— messageQueue.js                  * 消息队列开关配置文件
    |     |—— mysqlConfig.js                   * mysql数据库连接配置文件
    |     |—— purchaseCode.js                  * 激活码配置文件
    |     |—— saveDays.js                      * 日志存储周期配置文件
    |     |—— webfunny.js                      * 服务启动文件
    | 
    |
    |——config/                                 * 基础配置目录（使用者可以不用关注）
    |
    |——controllers/                            * 业务逻辑代码（已加密）
    |
    |——interceptor/                            * 拦截器代码（监控到的异常都会经过拦截器，使用者可以自定义报警）
    |             |
    |             |—— config/dingRobot.js      * 钉钉机器人配置
    |
    |——lib/
    |     |
    |     |—— RabbitMq.js                      * 消息对列创建文件
    |     |—— webfunny.min.js                  * 探针生成的模板文件
    |
    |——logs/
    |      |
    |      |——errors/                          * 监控系统运行错误日志目录（排查部署问题）
    |      |
    |      |——info/                            * 普通日志打印目录
    |
    |——schema/                                 * 基础表数据库字段设计
    |——schema_con/                             * 需要分表的数据库字段设计
    |
    |——modules/
    |         |
    |         |—— models.js                    * 业务逻辑代码（已加密）
    |
    |
    |——routes/                                 * 路由、定时器
    |
    |——views/                                  * 监控系统页面代码（压缩版）
    |
    |
    |
    |—— app.js                                 * 程序入口文件
    |—— Dockerfile.js                          * docker部署配置文件
    |—— restart.sh                             * 程序重启脚本文件（需设置此文件的执行权限）

    |—— 其他文件或目录，使用者大可不必关注
```
