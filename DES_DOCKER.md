### 请先完成正常部署

完成[正常部署](https://github.com/a597873885/webfunny_monitor/blob/master/DES.md)后，才能够生成正确的镜像文件。

### Docker部署方式

0.完成正常部署后，就可以将整个系统作为镜像文件进行打包。

1.项目内我增加了dockerfile, 生成image文件，执行命令$: docker image build -t webfunny_monitor .

2.生成容器，执行命令$: docker container run -p 8008:8008 -p 8009:8009 -p 8010:8010 -p 8011:8011 -p 8014:8014 -p 8015:8015 -it webfunny_monitor

        监控系统会使用两个端口号：8008、8009、8010、8011、8014、8015 ，所以需要映射出来;

3.你可以自己将镜像文件发布到云上，然后再使用。

4.心跳检测地址： 域名 + /server/health

注意：容器配置要给项目根目录下 createTable.sh，restart.sh 脚本文件执行权限哦。 chmod 755 restart.sh，chmod 755 createTable.sh


其他操作，请参考[docker入门 阮一峰](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)。
