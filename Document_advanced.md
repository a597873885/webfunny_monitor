
## 进阶版

如果你觉得这种方式有些复杂，可以去看 [【部署教程基础版】](https://github.com/a597873885/webfunny_monitor/blob/master/Document.md)

[【环境要求】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E7%8E%AF%E5%A2%83%E8%A6%81%E6%B1%82)
[【部署步骤】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E9%83%A8%E7%BD%B2%E6%AD%A5%E9%AA%A4)
[【常见部署问题】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
[【API方法调用】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#api%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8)

#### 环境要求：

操作系统： Linux(Ubantu 16.0 64位)、MacOs操作系统。 windows系统目前还没有尝试。

node版本号： 10.6.0  (node安装教程自行搜索, 建议先安装[nvm](https://www.jianshu.com/p/d0e0935b150a), 这样切换node版本会方便很多)

mysql版本号：5.6.45  (mysql 安装教程自行搜索 [Linux安装教程](https://www.cnblogs.com/warm-stranger/p/10333348.html))


#### 部署步骤

  1. 下载或者克隆代码到本地，并在根目录执行：npm run install_packages 安装依赖包
  
          【小提示】：由于内容比较多，克隆的时间比较长，请耐心一点等待。 
                  也有可能出现克隆失败的情况，重新尝试即可，我也表示很无奈。
  
  2. 在项目根目录下，config.js文件中，进行如下配置：
  
          /**
           * 请求接口域名 webfunny-servers 的服务的部署域名
           * 本地请使用 "//localhost:8011"，生产环境就把localhost换成服务器的ip
           */
          const default_api_server_url = "//localhost:8011"

         /**
          * 静态资源域名 webfunny-admin 的部署域名
          * 本地请使用 "//localhost:8010"，生产环境就把localhost换成服务器的ip
          */
          const default_assets_url = "//localhost:8010"
          
  3. 在项目根目录下，进入 config/db_local.js ，配置mysql数据库的连接配置
  
     [Mysql安装教程](https://www.cnblogs.com/warm-stranger/p/10333348.html) 
     [Mysql忘记密码](https://www.linuxidc.com/Linux/2018-05/152586.htm)
  
  
  4. 执行本地部署命令$: npm run local_start  
       
    【部署生产环境提示：】 如果你部署在云服务器(生产环境)上了，你需要注意：
    1. 在项目更目录执行：chmod 755 restart.sh ，给 restart.sh 脚本文件执行权限 (linux、macOs环境下)
    2. 在根目录下执行：npm run prd ,即可启动生产环境服务 
    
    3. 常用命令如下：
       执行命令： pm2 log 可查看启动日志
       执行命令： pm2 list 可查已经启动的列表
       执行命令： pm2 stop webfunny 停止当前服务
       执行命令： pm2 delete webfunny 删除当前服务
  
  5. 访问链接地址： [http://localhost:8010/home.html](http://localhost:8010/home.html) 本地版的监控系统就可以访问了。
  
  6. 生成你的探针代码: 进入首页，点击搜索框🔍，创建新项目（当然你需要简单注册一下），探针生成后，将其插入到你的前端页面中，OK, 所有的部署都已经完成了。
  
     访问链接地址： [http://localhost:8010/home.html](http://localhost:8010/home.html) 即可看到你自己mysql里边的数据了（如果你的探针已经在上传数据了）。
  
  7. 恭喜你，你已经成功部署了自己的监控系统。
  
  #### 更新代码方式
  
       提示：如果不会使用git命令，就把代码删除，重新部署吧。
  
       1. 先保存本地变更，然后在根目录下执行$: git pull origin master 命令，拉取最新代码
       
       2. 在根目录下执行$: node config.js 命令，重新配置
       
       3. 在根目录下执行$: npm run local_start 命令启动服务
       
       即可完成更新。
       
  #### 常见问题
  
    0）正常情况下，更新后需要重新执行 node config 命令才能够正常运行，如果还是不行，请检查一下 config/db.js、config.js的内容是否被覆盖。

    1）报错日志一般都会在根目录下的logs里生成，帮助大家排查错误。

    2）有些数据会在一小时内生成，不要着急，有些是实时的。

    3）如需启动生产服务，需安装PM2, 然后运行命令$: npm run prd, 即可启动生产服务。

    4）数据库表都是程序自动创建的，但是（数据库）需要你手动创建。
    
    5）项目成功运行后，有些接口报404属于正常现象，因为很多数据还未生成，一般运行7天以后，都会恢复正常。

  #### API方法调用
    
    1. 配置用户信息
    /**
     * 使用者传入的自定义信息
     * @param userId 用户唯一标识,不一定是userId
     * @param projectVersion 你自己应用的版本号
     */
    window.webfunny && webfunny.wmInitUser("userId", "projectVersion")
    
    2. 截屏指令（前提：部署截屏版探针）
    /**
     * 使用者传入的自定义截屏指令, 由探针代码截图
     * @param description  对截屏的描述信息
     */
    window.webfunny && webfunny.wm_screen_shot(description)
    
    3. 自定义上传图片
    /**
     * 使用者可以将其他图片上传到用户的使用流程中（比如使用app的截图功能等）
     * @param compressedDataURL 图片的base64编码字符串，
     * @param description 图片描述
     * @param imgType 图片类型（png/jpg/jpeg）
     */
    window.webfunny && webfunny.wm_upload_picture(compressedDataURL, description, imgType)
    
    4. 上传自定义日志
    /**
     * 使用者自行上传的行为日志
     * @param userId 用户唯一标识
     * @param behaviorType 行为类型
     * @param behaviorResult 行为结果（成功、失败等）
     * @param uploadType 日志类型（分类）
     * @param description 行为描述
     */
    window.webfunny && webfunny.wm_upload_extend_log(userId, behaviorType, behaviorResult, uploadType, description)
    
