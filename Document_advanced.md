
## 进阶版

如果你觉得这种方式有些复杂，可以去看 [【部署教程基础版】](https://github.com/a597873885/webfunny_monitor/blob/master/Document.md)

[【环境要求】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E7%8E%AF%E5%A2%83%E8%A6%81%E6%B1%82)
[【部署步骤】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E9%83%A8%E7%BD%B2%E6%AD%A5%E9%AA%A4)
[【常见部署问题】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
[【API方法调用】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#api%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8)
[【关于数据库表创建的问题】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A1%A8%E7%9A%84%E5%88%9B%E5%BB%BA)

#### 环境要求：

node版本号： 10.6.0  (node安装教程自行搜索, 建议先安装[nvm](https://www.jianshu.com/p/d0e0935b150a), 这样切换node版本会方便很多)

mysql版本号：5.6.45  (mysql 安装教程自行搜索 [Linux安装教程](https://www.cnblogs.com/warm-stranger/p/10333348.html))


#### 部署步骤

  1. 下载或者克隆代码到本地，并在根目录执行：npm install 安装依赖包
  
          【小提示】：由于内容比较多，克隆的时间比较长，请耐心一点等待。 
                  也有可能出现克隆失败的情况，重新尝试即可，我也表示很无赖。
  
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
  
  
  4. 创建数据库表，执行命令$: npm run table_config 
    
    【小提示】这个步骤需要耗费一些时间2-3分钟，请耐心等待。 
  
  5. 执行本地运行命令(稍微耗时)$: npm run local_start  (如果你部署在云服务器上了，执行：npm run prd)
  
  6. 访问链接地址： [http://localhost:8010/home.html](http://localhost:8010/home.html) 本地版的监控系统就部署好了。
  
  7. 生成你的探针代码: 进入首页，点击搜索框🔍，创建新项目（当然你需要简单注册一下），探针生成后，将其插入到你的前端页面中，OK, 所有的部署都已经完成了。
  
     访问链接地址： [http://localhost:8010/home.html](http://localhost:8010/home.html) 即可看到你自己mysql里边的数据了（如果你的探针已经在上传数据了）。
  
  8. 恭喜你，你已经成功部署了自己的监控系统，还有一点需要你注意：
  
     本项目的数据库是做分表了，至于如何生成最新的数据表，请参考[【数据库表创建方法】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A1%A8%E7%9A%84%E5%88%9B%E5%BB%BA)
  
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
    
 ### 数据库表的创建
    
   因为本项目的数据是做分表存储的，所以需要定时生成每天的数据库表，以下三种方法都是用来自动生成数据库表的。
   
   按照你们的习惯来时选择，推荐使用方法二。
   
   PS: 以下方法都要求你们的数据库都安装配置好了为前提的。
 
【方法一, 适合前端小白】

    1. 在根目录下，package.json文件中，有一行命令如：
       "table_config": "node table_config.js 2 && npm run table_create"
    
    2. 命令中的数字 2 代表天数。如果你想直接生成未来一个月的数据库表，只需要把这行命令改为：
       "table_config": "node table_config.js 30 && npm run table_create"   就可以了。
       
    3. 然后执行命令$: npm run table_config 后，会从当日起，生成往后30天的数据表，
       创建可能需要比较长的时间，请耐心等待哦。每隔30或20或者10天，手动执行一下此命令即可。
     
【方法二, 适合对shell脚本有了解的攻城狮】

    小提示：因为我的开发环境是macOs、linux环境，所以这个方法我只能保证在这两种环境下运行正常，
           其他操作系统可以搜索一下如何配置，原理都一样。
           
    1. 在根目录下有一个脚本文件 create_table.sh，正常情况下，它是没有执行权限的，
       所以需要在根目录下执行命令：chmod 755 create_table.sh
    
    2. 执行运行命令：npm run start ，10s之后，数据库的创建程序就会启动，
       创建日志就在logs/info 目录下。可以使用 'tail -f 文件名'命令实时查看
    
    3. 如果最终都无法成功创建表，就只能选择方法一或者方法三了
    
【方法三, 适合对自动化部署有了解的攻城狮】

    如果你对Jenkins有所了解，或是对其他自动化部署方式有了解，其中应该都包含’定时构建‘这种功能
    
    可以使用[Jenkins](https://jingyan.baidu.com/article/36d6ed1f6928b51bcf4883ee.html)
    在每天凌晨12：00的时候来做自动化重启服务，以此来生成每天的数据库表。
    
    不会配置可以私聊我。
 
