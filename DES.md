### 基础环境
安装NodeJS，版本号：10.6.0及以上

### 第一步、下载最新部署包
1. 在本地执行Git命令拉取代码$：git clone https://github.com/a597873885/webfunny_monitor.git
或者直接[百度云下载](https://pan.baidu.com/s/1r2YOGLkyTNy0VY-wObIjlA) 密码:8mhp
2. 在webfunny_monitor的根目录下执行命令$：npm install

### 第二步、配置数据库连接
1. 安装 Mysql 数据库
2. 创建数据库
  Navicat是mysql数据的视图工具，用Navicat创建一个数据库，命名为：webfunny_db
  数据库的字符集（Default Character set）请设置为：utf8
3. 配置数据库连接
  在webfunny_monitor/config/ 目录下找到数据库配置文件：db_local.js。
  在db_local.js文件的上部找到变量名：defaultConfig，然后配置您数据库的相关信息。
### 第三步、尝试运行起来  
#### 1. 把生产环境中，云服务器IP地址配置上去
在webfunny_monitor/config/目录下找到端口配置文件：createConfig.js，里边有对应域名进行配置
本地环境：![image](http://www.webfunny.cn/website/src/assets/img/course/setting.jpg)
生产环境：![image](http://localhost:9999/src/assets/img/course/proSetting.jpg)
配置完成后，保证以下地址能够访问成功。www.baidu.com是域名，也可以使用ip代替
1. 探针上报接口：www.baidu.com:8011/server/upLog
2. 数据展示地址：www.baidu.com:8010/webfunny/overview.html
