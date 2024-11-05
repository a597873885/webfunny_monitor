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

> Webfunny是一款集前端监控和埋点于一体的系统，非常轻量易用，纯私有化部署，只需要简单几步就可以搭建一套自己的监控埋点系统。

#### [Webfunny前端监控系统](https://www.webfunny.cn/webfunnyMonitor) 
实时大屏、运营数据分析、前端错误分析、页面性能分析、接口性能分析、用户细查、用户连线。

<p>
    <img width=800 src="https://www.webfunny.cn/resource/webfunny_home.png"/>
</p>

#### [Webfunny埋点系统](https://www.webfunny.cn/webfunnyEvent) 
业务数据分析、多样的可视化看板、高度自由的字段和点位设计、SDK发布。数据分析、留存分析、转化率分析、漏斗分析。

<p>
    <img width=800 src="https://www.webfunny.cn/resource/event_home.png?t=1"/>
</p>


### 本地安装

1. 克隆到本地：`git clone https://github.com/a597873885/webfunny_monitor.git`

2. 安装依赖包：`npm install && npm run bootstrap`

3. 安装pm2(已有，请忽略)：`npm install pm2 -g`

4. 运行程序：`npm run prd`

5. 访问页面：`http://localhost:8008/webfunny_center/main.html`

### 服务器安装
[【私有化部署教程】](https://www.webfunny.com/desMonitor)

### Docker 安装
[【docker部署教程】](https://www.webfunny.com/desMonitor?blogUrl=128&menuKey=menu2&blogKey=2-0)

### 历史版本  
[【版本】](https://www.webfunny.com/version)
 
   
### 官方客服微信

   微信号：webfunny2

   <img width=150 src="https://www.webfunny.cn/resource/webfunny2.png"/>


### 目录结构
```

    |── center/                                    * 应用中心
    |         |
    |         |—— config                           * 配置文件
    |         |—— controllers                      * 业务逻辑
    |         |—— logs                             * 日志文件
    |         |—— middlreware                      * 中间件
    |         |—— modules                          * 业务逻辑
    |         |—— routes                           * 路由
    |         |—— schema                           * 数据库设计
    |         |—— util                             * 工具
    |         |—— util_cus                         * 用户自定义工具
    |         |—— views                            * 可视化文件
    |
    |── event/                                     * 埋点系统
    |        |
    |        |—— config                            * 配置文件
    |        |—— config_variable                   * 用户配置文件
    |        |—— controllers                       * 业务逻辑
    |        |—— logs                              * 日志文件
    |        |—— middlreware                       * 中间件
    |        |—— modules                           * 业务逻辑
    |        |—— routes                            * 路由
    |        |—— schema                            * 数据库设计
    |        |—— util                              * 工具
    |        |—— util_cus                          * 用户自定义工具
    |        |—— views                             * 可视化文件
    |
    |──monitor/                                    * 监控系统
    |         |
    |         |—— alarm                            * 警报配置
    |         |—— config                           * 系统配置文件
    |         |—— config_variable                  * 用户配置文件
    |         |—— controllers                      * 业务逻辑
    |         |—— interceptor                      * 拦截器
    |         |—— logs                             * 日志文件
    |         |—— middlreware                      * 中间件
    |         |—— modules                          * 业务逻辑
    |         |—— routes                           * 路由
    |         |—— schema                           * 数据库设计
    |         |—— util                             * 工具
    |         |—— util_cus                         * 用户自定义工具
    |         |—— views                            * 可视化文件
```
