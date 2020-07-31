[【部署后遇到问题】](http://www.webfunny.cn/website/faq.html) | [【自定义警报配置】](http://www.webfunny.cn/website/api.html) |  正常情况下，1个小时以后出分析数据，不要着急

### Docker部署方式

目前还无法发布云版本，所以需要使用者自己生成image文件，进行docker部署

【前提条件：需要把普通部署方式跑通了，然后再来生成镜像。】

0. 首先需要运行npm run prd 命令进行编译， 编译完成后才是能够生成镜像的版本

1. 项目内我增加了dockerfile, 生成image文件，执行命令$: docker image build -t webfunny_monitor .

2. 生成容器，执行命令$: docker container run -p 8010:8010 -p 8011:8011 -it webfunny_monitor

        监控系统会使用两个端口号：8010、8011 ，所以需要映射出来;

3. 你可以自己将镜像文件发布到云上，然后再使用。

4. 心跳检测地址： 域名 + /server/health

注意：容器配置要给项目根目录下restart.sh 脚本文件执行权限哦。 chmod 755 restart.sh


其他操作，请参考[docker入门 阮一峰](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)。
