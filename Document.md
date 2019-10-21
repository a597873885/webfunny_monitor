## 搭建教程


搭建教程已经简化了很多，自己试试吧 😊

1. 完成后台服务系统的搭建（包含数据可视化） [去完成](https://github.com/a597873885/webfunny-servers)


完成上边上边两步之后，就可以监控你的应用了。

如果要搭建云服务，可以参考系列文章： [搭建前端监控系统（一）阿里云服务器搭建篇](https://www.cnblogs.com/warm-stranger/p/8837784.html)


#### 关注说明

如果大家对项目感兴趣并关注，请移步到[webfunny-monitor](https://github.com/a597873885/webfunny-monitor)， 因为本项目可能会随着技术升级而迁移或者废弃掉，[webfunny-monitor](https://github.com/a597873885/webfunny-monitor)是主要开源项目，地址不会变化。 :)


### 监控后台部署教程

友情声明：部署后的版本难免会出现一些问题，希望大家及时提出来，我会尽快修复。

node版本号： 10.6.0  (node安装教程自行搜索, 建议先安装[nvm](https://www.jianshu.com/p/d0e0935b150a), 这样切换node版本会方便很多)

mysql版本号. 5.6.45  (mysql 安装教程自行搜索 [Linux安装教程](https://www.cnblogs.com/warm-stranger/p/10333348.html))

  1. 下载或者克隆代码到本地
  
  2. 安装程序的依赖包，执行命令$: npm install
  
     在根目录下执行命令$: node config.js 
     
     等待配置完成，然后执行命令$: npm run start
  
  3. 访问链接地址： [http://localhost:8010/home.html](http://localhost:8010/home.html) 即可看到官网数据。
  
  那么如何展示自己的数据呢？
  
  【小提示】：项目错误日志都在更目下 logs/ 目录里，方便小伙伴们排查错误
  
  4. 在项目根目录下，进入 config/db.js ，配置mysql数据库的连接配置 （mysql必须先安装好）
  
  5. 在项目根目录下，config.js文件中，进行如下配置：
  
          /**
           * 请求接口域名 webfunny-servers 的服务的部署域名
           * 本地请使用 "//localhost:8011"
           */
          const default_api_server_url = "//localhost:8011"

         /**
          * 静态资源域名 webfunny-admin 的部署域名
          * 本地请使用 "//localhost:8010"
          */
          const default_assets_url = "//localhost:8010"

  6. 配置完成后，再一次执行命令$: node config.js  等待完成后，在根目录下执行命令$: npm run start, 本地服务完成启动。
  
  7. 生成你的探针代码 [http://localhost:8010/createProject.html](http://localhost:8010/createProject.html)
  
  访问链接地址： [http://localhost:8010/home.html](http://localhost:8010/home.html) 即可看到你自己mysql里边的数据了（如果你的探针已经在上传数据了）。
  
  
  ps1: 有些数据会在一小时内生成，不要着急，有些是实时的。

  ps2: 如需启动生产服务，需安装PM2, 然后运行命令$: npm run prd, 即可启动生产服务。
  
  ps3: 数据库表都是程序自动创建的，但是（数据库）需要你手动创建
  
  =============================我是分割线=================================
  
  以上都是本地部署，如果你想要真正部署的生产环境，因为本服务是进行分表的，所以就需要你在每天凌晨0点的时候重启服务，这样才能够生成当天数据库表。
  
  我使用的工具是Jenkins，做定时任务重启服务。 [jenkins安装教程](https://jingyan.baidu.com/article/36d6ed1f6928b51bcf4883ee.html)
