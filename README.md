# 阅读须知
1. webmonitor.js 为探针的源码

2. /resource/fetchCode.js 为fetch的源码

3. /resource/html2canvas0.js 为截图插件的源码

4. 执行命令 webpack 可得压缩版监控代码 - /lib/monitor.fetch.html2.min.js 


# 讲解须知
监控系统的探针代码

[点击前往线上Demo](https://www.webfunny.cn/)

[点击前往博客讲解](https://www.cnblogs.com/warm-stranger/p/10209990.html)    

# 探针部署方式：

1. 根目录下执行命令$: webpack
   得到一个压缩js文件(探针)  monitor.fetch.html2.min.js 
   
2. 将探针代码插入到html页面head的最顶部   
   
   <!-- 判断生产环境加载监控代码 开始 -->
    <script type="text/javascript" src="//localhost:8000/monitor.fetch.html2.min.js"></script>
   <!-- 判断生产环境加载监控代码 结束 -->
   
3. 启动mysql数据库，如果使用远程数据库可以参考教程：

    搭建前端监控系统（一）阿里云服务器搭建篇：https://www.cnblogs.com/warm-stranger/p/8837784.html
    
4. 启动node服务器，可以参考教程： 

    搭建前端监控系统（三）NodeJs服务器部署篇：https://www.cnblogs.com/warm-stranger/p/9556442.html
    
    源码： https://github.com/a597873885/webfunny_servers
    
5. 启动分析平台界面，可以参考教程（README.md）：
    
    源码： https://github.com/a597873885/webfunny_admin
    
如果有问题，欢迎提问。


