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

<p style="text-align: center;"><a href="https://www.webfunny.com">官网地址</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.webfunny.com/des?desPath=guide/quickStart">文档地址</a></p>

> Webfunny是一款集前端监控和埋点于一体的大数据分析系统。监控系统主要帮助开发者、测试工程师排查和解决线上的疑难杂症问题；埋点系统主要用于帮助分析师、产品经理分析业务数据，提高企业转化率。一个面向技术、一个面向业务，两者配合使用，效果最好。

### Webfunny前端监控系统
主要面向技术方向，帮助开发者、测试工程师、技术Leader了解应用的健康情况，优化应用的性能，以及排查和解决线上的疑难杂症问题；

<p>
    <img width=800 src="https://www.webfunny.cn/resource/webfunny_home.png"/>
</p>

### Webfunny埋点系统
主要面向业务方向，帮助分析师、产品经理、运营人员集采集、存储、分析、可视化于一体，快速分析业务数据，提高企业转化率。

<p>
    <img width=800 src="https://www.webfunny.cn/resource/event_home.png?t=1"/>
</p>

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
