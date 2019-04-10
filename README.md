怎样定位前端线上问题，一直以来，都是很头疼的问题，因为它发生于用户的一系列操作之后。错误的原因可能源于机型，网络环境，复杂的操作行为等等，在我们想要去解决的时候很难复现出来，自然也就无法解决。 当然，这些问题并非不能克服，让我们来一起看看如何去定位线上的问题吧。

　　所谓，工欲善其事必先利其器，你不能撸起袖子蛮干，所以，我们需要一个工具。我们曾经尝试用过很多监控工具去统计这些错误，比如，听云、OneApm、sentry、FundBug、growingIo 等等。 每家工具都各有所长，但也都各有所短，而且要花不少的钱（感觉是痛点，哈哈）。
# 阅读须知
1. webmonitor.js 为探针的源码

2. /resource/fetchCode.js 为fetch的源码

3. /resource/html2canvas0.js 为截图插件的源码

4. 执行命令 webpack 可得压缩版监控代码（有截图版） - /lib/monitor.fetch.html2.min.js 
   执行命令 webpack 可得压缩版监控代码（无截图版） - /lib/monitor.fetch.min.js 


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

    [搭建前端监控系统（三）NodeJs服务器部署篇](https://www.cnblogs.com/warm-stranger/p/9556442.html) 
    
     源码：[NodeJs后台服务](https://github.com/a597873885/webfunny_servers)
    
5. 启动分析平台界面，可以参考教程（README.md）：
    
    源码：[React数据可视化](https://github.com/a597873885/webfunny_admin)
    
如果有问题，欢迎提问。

## 系统简介
### 前端错误统计
![前端错误统计](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E9%94%99%E8%AF%AF%E7%BB%9F%E8%AE%A1.png)
### 错误详情分析
![错误详情分析](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E9%94%99%E8%AF%AF%E8%AF%A6%E6%83%85.png)
### 用户行为检索
![用户行为检索](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E8%A1%8C%E4%B8%BA%E6%A3%80%E7%B4%A2.png)

