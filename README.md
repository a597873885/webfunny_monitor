   怎样定位前端线上问题，一直以来，都是很头疼的问题，因为它发生于用户的一系列操作之后。错误的原因可能源于机型，网络环境，复杂的操作行为等等，在我们想要去解决的时候很难复现出来，自然也就无法解决。 当然，这些问题并非不能克服，让我们来一起看看如何去监控并定位线上的问题吧。

   市面上的前端监控系统有很多，功能齐全，种类繁多，不管你用或是不用，它都在那里，密密麻麻。往往我需要的功能都在别人家的监控系统里，手动无奈，罢鸟，怎么才能拥有一个私人定制的前端监控系统呢？做一个自带前端监控系统的前端工程狮是一种怎样的体验呢？


## 系统特点
1. 稳定运行，欢迎试用。
2. 定期维护，保证准确率。
3. 敏感信息加密，功能不断升级。

## 上报功能列表
1. 前端异常上报【完成】
2. 用户PV/UV统计【完成】
3. 页面加载时间统计【完成】
4. 用户点击行为统计【完成】
5. 接口请求日志统计【完成】
6. 接口请求耗时统计【完成】
7. 静态资源加载异常统计【完成】
8. 实现JS页面截图【完成】
9. 自定义日志上传【完成】

   将要增加的上报功能：
   
   1）接口增加参数和返回结果的统计（敏感信息加密）
   
   2）增加应用版本号字段，排查因发布造成的bug
   
   3）增加页面加载性能相关信息上报
   
   4）即将增加录屏功能测试

## 分析功能列表
1. js报错实时监控【完成】[前往](https://www.webfunny.cn/webfunny/javascriptError)
2. js报错的统计分析【完成】
3. js报错的详情分析和代码定位【完成】
4. 静态资源加载异常实时监控【完成】[前往](https://www.webfunny.cn/webfunny/resourceError)
5. 静态资源加载异常的统计分析【完成】
6. 接口请求报错实时监控【完成】[前往](https://www.webfunny.cn/webfunny/httpError)
7. 接口请求报错的统计分析【完成】
8. 用户pv/uv实时统计【完成】
9. 记录回放功能（详细记录用户使用的足迹）【完成】[前往](https://www.webfunny.cn/webfunny/behaviors)

   将要增加的分析功能：
   
   1）增加7日内留存数据分析
   
   2）增加版本号分析，浏览器分布，等信息分析
   
   3）分析页面加载性能数据
   
具体内容：[请移步线上监控系统](https://www.webfunny.cn/)


## 探针部署方式：

1. 前往 [新建应用](https://www.webfunny.cn/webfunny/createProject)  

2. 命令行：$ npm install webfunny-monitor --save-dev

3. var wm = require("webfunny-monitor");
   wm.initMonitor("应用ID", "userId", "1.0.0");
  
如果有问题，欢迎提问。

### 贡献者支持
一颗star, 一份[关注](https://zhuanlan.zhihu.com/webfunny), 都将是我前进的动力  :)

### 讲解须知
监控系统的探针代码

[细节讲解](https://zhuanlan.zhihu.com/webfunny)

## 系统简介
### 概览
![概览](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E6%A6%82%E8%A7%88.jpg)
### 错误预览
![报错统计看板](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E6%8A%A5%E9%94%99%E7%BB%9F%E8%AE%A1.jpg)
### 实时变化
![实时变化](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E5%AE%9E%E6%97%B6%E5%8F%98%E5%8C%96.jpg)
### 前端错误统计
![前端错误统计](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E9%94%99%E8%AF%AF%E7%BB%9F%E8%AE%A1.png)
### 错误详情分析
![错误详情分析](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E9%94%99%E8%AF%AF%E8%AF%A6%E6%83%85.png)
### 用户行为检索
![用户行为检索](https://github.com/a597873885/webfunny_monitor/blob/master/img/%E8%A1%8C%E4%B8%BA%E6%A3%80%E7%B4%A2.png)

