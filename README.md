 ### 前言
   怎样定位前端线上问题，一直以来，都是很头疼的问题，因为它发生于用户的一系列操作之后。错误的原因可能源于机型，网络环境，复杂的操作行为等等，在我们想要去解决的时候很难复现出来，自然也就无法解决。 当然，这些问题并非不能克服，让我们来一起看看如何去监控并定位线上的问题吧。
   

 ### 部署
![total gzip size](https://img.badgesize.io/https://www.webfunny.cn/resource/monitor.fetch.min.js?compression=gzip&label=total%20gzip%20size)
   
只需要简单几步就可以搭建一套属于自己的前端监控系统，欢迎关注和Star。


[【Demo效果】](http://www.webfunny.cn/demo/home.html) | [【部署教程】](https://github.com/a597873885/webfunny_monitor/blob/master/DES.md) |【微信号】webfunny_2020
   
   
---------------------------------------------------------

### 主体功能
1. 监控JS报错、http接口报错、静态资源加载报错等；记录页面访问、点击事件、接口请求等行为日志；

2. 统计PV/UV数据、用户7天留存数据、版本号/机型/地域分布数据

3. 提供报错具体查找和定位功能、用户详细行为追踪与分析功能、用户网络环境评估功能

4. 提供额外上报接口，上报自定义日志


### 目录结构
         ./A-monitor-code/webmonitor.js   探针代码
         ./schema  数据库建表结构
         ./views/ 前端展示代码
         ./config  数据库配置目录
         ./logs  运行报错日志目录
         ./config.js 接口配置文件

更新计划：[更新排期计划表](https://github.com/a597873885/webfunny_monitor/blob/master/UpdateList.md)

### 贡献者支持


一颗star, 一份[关注](https://zhuanlan.zhihu.com/webfunny), 都将是我前进的动力  :)

