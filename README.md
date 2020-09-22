<p align=center>
    <img width=400 src="https://images.gitee.com/uploads/images/2020/0601/173301_1013328b_1665425.png"/>
</p>


<p align="center">
  <a href="#项目大小"><img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/a597873885/webfunny_monitor"></a>
  <a href="#最近更新"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/a597873885/webfunny_monitor"></a>
  <a href="https://github.com/a597873885/webfunny_monitor/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/a597873885/webfunny_monitor"></a>
  <a href="https://github.com/a597873885/webfunny_monitor/issues?q=is%3Aissue+is%3Aclosed"><img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed-raw/a597873885/webfunny_monitor"></a>
  <a href="#开源协议"><img alt="GitHub" src="https://img.shields.io/github/license/a597873885/webfunny_monitor"></a>
</p>

> If you're a front-end engineer, you've got to solve some stubborn online problems more than once. You've also tried to reproduce the user's bug, and the results may not be satisfactory. How to locate the front-end online problem has always been a headache, because it occurs after a series of user operations. The cause of the error may be due to the model, network environment, complex operation behavior and so on. When we want to solve it, it is difficult to reproduce it, and naturally it cannot be solved.

> As a front-end engineer, I have to face a lot of online problems every day, which makes me exhausted. There are other monitoring systems in the company, but every time we solve the problem, we have to struggle between various monitoring systems, which is also exhausting. Therefore, I have customized such a monitoring system for myself (front-end Engineer). Now I'd like to share it with you. Welcome to learn more.

> Just a few simple steps, you can build your own front-end monitoring system.

> [【中文介绍】](https://github.com/a597873885/webfunny_monitor/blob/master/README_ZH.md)

### Understanding the work 

   [【Website】](http://www.webfunny.cn/home.html?source=github_en) | 
   [【Demo】](http://www.webfunny.cn/demo/home.html) | 
   [【About open source】](http://www.webfunny.cn/faq.html?tab=2)

### Stress testing

It can support 10 million PV per day.

### Privatization deployment mode

   [【Local deployment】](https://github.com/a597873885/webfunny_monitor/blob/master/DES.md) | 
   [【Docker Containerized deployment】](https://github.com/a597873885/webfunny_monitor/blob/master/DES_DOCKER.md)
   
### Contact author
   email: 597873885@qq.com
   
   wechat number：webfunny_2020

### Deployment tutorial ★★★★★


#### Basic environment

    Install nodejs, version number: 10.6.0 +

#### Step 1: Download（clone） the latest deployment package and initialize it

    1.Local clone code $：git clone https://github.com/a597873885/webfunny_monitor.git

      Use gitee url $：git clone https://gitee.com/webfunnyMonitor/webfunny_monitor.git（if GitHub network is unstable, gitee address can be used）
  
    2.Execute the initialization and installation commands in the root of the project $：<b>npm run init && npm install</b>

    3.Confirm whether PM2 is installed or not. If PM2 is not installed, please execute the installation command $：npm install pm2 -g


#### Step 2: connect mysql to the database

<b>1. Install MySQL database</b>

<b>2. Create database</b>（webfunny_db）

    database name：webfunny_db.

    Character set settings：[Default Character set]：utf8、 [Default Collation]：utf8_bin

#### 3. Database connection configuration

enter webfunny_ monitor/bin/ mysqlConfig.js In the file
  
    module.exports = {
      write: {
        ip: 'xxx.xxx.xxx.xxx',         // remote ip address
        port: '3306',                  // port
        dataBaseName: 'webfunny_db',   // dataBaseName
        userName: 'root',              // userName
        password: '123456'             // password
      }
    }


#### Step 3: local deployment and operation


    1) At this point, the local configuration is complete, try running the command $: npm run prd

    2) Open the browser and access the address：http://localhost:8010/webfunny/register.html?type=1 (Initialize the administrator account and log in)

    3) After creating the new project, you can see the probe deployment tutorial and complete the deployment。


#### Step 4: deployment of production environment (choose one from two domain name configuration methods)

<b>1. IP address or domain name configuration (mode 1)</b>

Enter webfunny_ monitor/bin/ domain.js In the file<b>（Note that the corresponding port numbers should be consistent）</b>

    IP地址配置方式：

    module.exports = {
      localServerDomain: 'xxx.xxx.xxx.xxx:8011',    // Log report domain name
      localAssetsDomain: 'xxx.xxx.xxx.xxx:8010',    // Page domain name
      localServerPort: '8011',                      // Log reporting port 
      localAssetsPort: '8010',                      // Front page port
    }

    域名配置方式：

    module.exports = {
      localServerDomain: 'www.example.com:8011',      // Log report domain name
      localAssetsDomain: 'www.example.com:8010',      // Page domain name
      localServerPort: '8011',                      // Log reporting port
      localAssetsPort: '8010',                      // Front page port
    }

After configuration, the browser can access the following address to ensure successful access.

    1.Project list address：http://xxx.xxx.xxx.xxx:8011/server/webMonitorIdList 或 http://www.baidu.com:8011/server/webMonitorIdList

    2.Data display address：http://xxx.xxx.xxx.xxx:8010/webfunny/overview.html 或 http://www.baidu.com:8010/webfunny/overview.html

------------

<b>2. Proxy domain name configuration (mode 2)</b>

Users who use proxy domain name must understand the method of nginx proxy

    Configuration mode of proxy domain name (port number still needs to be configured)：

    module.exports = {
      localServerDomain: 'www.example.com',      // Log report domain name
      localAssetsDomain: 'www.example.com',      // Page domain name
      localServerPort: '8011',                 // Log reporting port
      localAssetsPort: '8010',                 // Front page port
    }
After configuration, the browser can access the following address to ensure successful access.

    1.Project list address：http://www.example.com/server/webMonitorIdList

    2.Data display address：http://www.example.com/webfunny/overview.html


<b>3. Add execution permission</b>

Under normal conditions createTable.sh , restart.sh The two scripts do not have execution rights and need to be manually authorized by the user

    Linux and MAC systems need to execute the command $: Chmod 755 in the root directory of the project createTable.sh ， chmod 755 restart.sh Authorization.

    For other operating systems, please search the authorization method yourself

    Note: you may not be able to automatically create daily database tables without authorization


#### Step 5: configure alarm information

Webfunny provides user-defined alarm interception function. Users need to modify the code to realize the alarm modes such as nailing, SMS, email, etc. the configuration directory is as follows：

    ① /interceptor/customerWarning.js  每隔10分钟会调用一次
    ② /interceptor/httpRequest.js 每次上报接口日志，都会调用这个方法
    ③ /interceptor/javascriptError.js 每次发生js报错，都会调用这个方法
    ④ /interceptor/resourceError.js 每次发生静态资源报错，都会调用这个方法


--------------

There is no need to perform the following steps. Users with high concurrency can continue to look down.

--------------


#### Step 6: start message queue (not required)
##### 1. Install rabbitmq (it is recommended that you perform this step after deploying on the cloud server)

    Please install rabbitmq Message Queuing service before starting message queuing

    After installation, you can access URL: http://IP Address: 15672 view message queue
    
    If you need to connect to remote message queuing, find Lib in the root directory/ RabbitMq.js Adjust the code configuration.
    
    [tip]: Message Queuing is not easy to install successfully. If there is a problem midway, you can choose to restart or initialize the cloud server.
##### 2. Start message queuing

    After rabbitmq is installed, the_ monitor/bin/ messageQueue.js Find the variable name: message queue in the file. Set the value of this variable to true and restart the service

#### Step 7: configure read / write separation (not required)

    1.Configure multiple MySQL databases with master-slave synchronization (preferably one master and multiple slaves, one master and one slave is acceptable)
    2.Enter webfunny_ monitor/bin/ mysqlConfig.js In the file

    module.exports = {
      write: {
        ip: 'xxx.xxx.xxx.xxx',         // remote ip address
        port: '3306',                  // port
        dataBaseName: 'webfunny_db',   // dataBaseName
        userName: 'root',              // user
        password: '123456'             // password
      }，
      // 高性能版支持此属性
      read: [
        { host: "xxx.xxx.xxx.xxx", username: "root1", password: "123456" },
        { host: "xxx.xxx.xxx.xxx", username: "root2", password: "123456" }
      ]
    }

### Directory structure
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
    |             |—— customerWarning.js       * 对项目总体评分的拦截
    |             |—— httpRequest.js           * 产生接口请求会被拦截到
    |             |—— javascriptError.js       * 产生js报错会被拦截到
    |             |—— resourceError.js         * 产生静态资源加载失败的情况会被拦截到
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
    |
    |——modules/
    |         |
    |         |—— models.js                    * 业务逻辑代码（已加密）
    |
    |
    |——routes/                                 * 路由、定时器
    |
    |——views/                                  * 监控系统页面代码
    |
    |
    |
    |—— app.js                                 * 程序入口文件
    |—— Dockerfile.js                          * docker部署配置文件
    |—— restart.sh                             * 程序重启脚本文件（需设置此文件的执行权限）

    |—— 其他文件或目录，使用者大可不必关注
```


