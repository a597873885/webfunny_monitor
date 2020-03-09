### 基础环境
安装NodeJS，版本号：10.6.0及以上
### 第一步、下载最新部署包
1. 在本地执行Git命令拉取代码$：git clone https://github.com/a597873885/webfunny_monitor.git
或者直接[百度云下载](https://pan.baidu.com/s/1VgEEoxsLQxlSDTaLe9zdgQ) 密码:nxug
2. 在webfunny_monitor的根目录下执行命令$：npm install

### 第二步、配置数据库连接
#### 1. 安装 Mysql 数据库
#### 2. 创建数据库
  Navicat是mysql数据的视图工具，用Navicat创建一个数据库，命名为：webfunny_db
  数据库的字符集（Default Character set）请设置为：utf8
#### 3. 配置数据库连接
  在webfunny_monitor/config/ 目录下找到数据库配置文件：db_local.js。
  在db_local.js文件的上部找到变量名：defaultConfig，然后配置您数据库的相关信息。
### 第三步、尝试运行起来  
#### 1. 把生产环境中，云服务器IP地址配置上去
在webfunny_monitor/config/目录下找到端口配置文件：createConfig.js，里边有对应域名进行配置

本地环境：![image](http://www.webfunny.cn/website/src/assets/img/course/setting.jpg)

生产环境：![image](http://www.webfunny.cn/website/src/assets/img/course/proSetting.jpg)

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

【注意】：linux系统，需要在项目根目录下执行命令$：chmod 755 restart.sh ，给 restart.sh 脚本文件执行权限。否则可能无法自动创建每天的数据库表

### 第四步、更改端口号(非必须)
如非必要，不建议您更改端口号。

在webfunny_monitor/config/目录下找到端口配置文件：createConfig.js，里边有对应的端口号，您可以对其进行调整

### 第五步、启动消息队列(非必须)
#### 1. 安装RabbitMq（建议您在云服务器上部署完成后再执行此步骤）
    不建议您在本地执行此步骤。

    开启消息队列之前，请先 安装RabbitMq消息队列服务，ubantu：https://www.cnblogs.com/warm-stranger/p/11000996.html 

    安装完成后可以访问Url：http://IP地址:15672 查看消息队列的情况
    
    【小提示】：消息队列不易安装成功，如果中途出现问题，可以选择重启或者初始化云服务器。
#### 2. 配置消息队列

   RabbitMq 安装完成后，在 webfunny_monitor/config/createConfig.js 文件中找到变量名：messageQueue，将此变量的值设置为：true, 重启服务即可
