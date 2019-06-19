怎样定位前端线上问题，一直以来，都是很头疼的问题，因为它发生于用户的一系列操作之后。错误的原因可能源于机型，网络环境，复杂的操作行为等等，在我们想要去解决的时候很难复现出来，自然也就无法解决。 当然，这些问题并非不能克服，让我们来一起看看如何去监控并定位线上的问题吧。

背景：市面上的监控系统有很多，大多收费，对于小型前端项目来说，必然是痛点。另一点主要原因是，功能通用，却未必能够满足我们自己的需求。

这是搭建前端监控系统的第一章，主要是搭建环境，跟着我一步步做，你也能搭建出一个属于自己的前端监控系统。

# 上报功能列表
1. 前端异常上报（window.onerror, console.error）【完成】
2. 用户PV/UV统计（pageKey, customerKey）【完成】
3. 页面加载时间统计【完成】
4. 用户点击行为统计【完成】
5. 接口请求日志统计【完成】
6. 接口请求耗时统计【完成】
7. 静态资源加载异常统计【完成】
8. 实现JS页面截图【完成】
9. 自定义日志上传【完成】

# 分析功能列表
1. js报错实时监控【完成】[前往](https://www.webfunny.cn/webfunny/javascriptError)
2. js报错的统计分析【完成】
3. js报错的详情分析和代码定位【完成】
4. 静态资源加载异常实时监控【完成】[前往](https://www.webfunny.cn/webfunny/resourceError)
5. 静态资源加载异常的统计分析【完成】
6. 接口请求报错实时监控【完成】[前往](https://www.webfunny.cn/webfunny/httpError)
7. 接口请求报错的统计分析【完成】
8. 用户pv/uv实时统计【完成】
9. 记录回放功能（详细记录用户使用的足迹）【完成】[前往](https://www.webfunny.cn/webfunny/behaviors)

具体内容：[请移步线上监控系统](https://www.webfunny.cn/)


# 讲解须知
监控系统的探针代码

[监控系统地址](https://www.webfunny.cn/)

[介绍](https://zhuanlan.zhihu.com/webfunny)    

# 探针部署方式：

1. 前往 [新建应用](https://www.webfunny.cn/webfunny/createProject)  

2. 根目录下执行命令$: webpack
   得到一个压缩js文件(探针) lib/monitor.fetch.min.js
  
    
如果有问题，欢迎提问。

## 系统简介
### 前端错误统计
![前端错误统计](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E9%94%99%E8%AF%AF%E7%BB%9F%E8%AE%A1.png)
### 错误详情分析
![错误详情分析](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E9%94%99%E8%AF%AF%E8%AF%A6%E6%83%85.png)
### 用户行为检索
![用户行为检索](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E8%A1%8C%E4%B8%BA%E6%A3%80%E7%B4%A2.png)

