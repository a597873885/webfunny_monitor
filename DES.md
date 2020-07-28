[【部署后遇到问题】](http://www.webfunny.cn/website/faq.html) | [【自定义警报配置】](http://www.webfunny.cn/website/api.html) |  正常情况下，1个小时以后出分析数据，不要着急

### 基础环境
安装NodeJS，版本号：10.6.0及以上
### 第一步、下载最新部署包
  1. 在本地执行Git命令拉取代码$：git clone https://github.com/a597873885/webfunny_monitor.git

  如果GitHub拉取太慢，可以尝试使用码云地址$：git clone https://gitee.com/webfunnyMonitor/webfunny_monitor.git
  
  2. 在webfunny_monitor的根目录下执行命令$：npm run init && npm install



### 第二步、配置数据库连接
#### 1. 安装 Mysql 数据库
#### 2. 创建数据库
  Navicat是mysql数据的视图工具，用Navicat创建一个数据库，命名为：webfunny_db
  数据库的字符集（Default Character set）请设置为：utf8
#### 3. 配置数据库连接
  在webfunny_monitor/bin/ 目录下找到数据库配置文件：mysqlConfig.js。
  在mysqlConfig.js文件的上部找到相关变量名，然后配置您数据库的相关信息。
### 第三步、尝试运行起来  
#### 1. 把生产环境中，云服务器IP地址配置上去
在webfunny_monitor/bin/目录下找到端口配置文件：domain.js，里边有对应域名进行配置

本地环境示例：![image](http://www.webfunny.cn/website/src/assets/img/course/setting.png)

生产环境示例：![image](http://www.webfunny.cn/website/src/assets/img/course/proSetting.png)

配置完成后，保证以下地址能够访问成功。

1. 探针上报接口：www.baidu.com:8011/server/upLog
2. 数据展示地址：www.baidu.com:8010/webfunny/overview.html

#### 2. 尝试在生产环境跑起来

    启动生产环境模式前，需要安装pm2，执行命令：npm install pm2 -g，已经有了就无需再安装了。

    安装完成后，执行命令$: npm run prd 来启动生产环境模式。

    启动完了怎么停啊？执行命令$：pm2 stop webfunny 停止当前服务, 然后就可以再次启动了

    启动完了怎么看日志啊？执行命令$：pm2 log webfunny 查看启动日志，排查问题

    启动完成后可以使用以下命令查看和操作：
    执行命令： pm2 log 可查看启动日志
    执行命令： pm2 list 可查已经启动的列表
    执行命令： pm2 stop webfunny 停止当前服务
    执行命令： pm2 delete webfunny 删除当前服务

#### 3. 添加执行权限

  createTable.sh, restart.sh 这两个脚本可能没有执行权限。

【注意】：linux系统，需要在项目根目录下执行命令$：chmod 755 createTable.sh， chmod 755 restart.sh ，给 createTable.sh, restart.sh 脚本文件执行权限。否则可能无法自动创建每天的数据库表

### 第三.1步、配置报警信息
webfunny提供了自定义报警拦截功能，需要使用者修改代码，以实现钉钉、短信、邮箱等报警方式，配置目录如下：

    ① /interceptor/customerWarning.js  每隔10分钟会调用一次
    ② /interceptor/httpRequest.js 每次上报接口日志，都会调用这个方法
    ③ /interceptor/javascriptError.js 每次发生js报错，都会调用这个方法
    ④ /interceptor/resourceError.js 每次发生静态资源报错，都会调用这个方法

### 第四步、更改端口号(非必须)
如非必要，不建议您更改端口号。

在webfunny_monitor/bin/目录下找到端口配置文件：domain.js，里边有对应的端口号，您可以对其进行调整

### 第五步、启动消息队列(非必须)
#### 1. 安装RabbitMq（建议您在云服务器上部署完成后再执行此步骤）

    开启消息队列之前，请先 安装RabbitMq消息队列服务，ubantu：https://www.cnblogs.com/warm-stranger/p/11000996.html 

    安装完成后可以访问Url：http://IP地址:15672 查看消息队列的情况
    
    如果需要连接远程消息队列，请在根目录下找到 lib/RabbitMq.js进行配置。
    
    【小提示】：消息队列不易安装成功，如果中途出现问题，可以选择重启或者初始化云服务器。
#### 2. 配置消息队列

   RabbitMq 安装完成后，在 webfunny_monitor/bin/messageQueue.js 文件中找到变量名：messageQueue，将此变量的值设置为：true, 重启服务即可
