## 监控后台部署教程

友情声明：部署后的版本难免会出现一些问题，希望大家及时提出来，我会尽快修复。

[【环境要求】](https://github.com/a597873885/webfunny_monitor/blob/master/Document.md#%E7%8E%AF%E5%A2%83%E8%A6%81%E6%B1%82)
[【部署步骤】](https://github.com/a597873885/webfunny_monitor/blob/master/Document.md#%E9%83%A8%E7%BD%B2%E6%AD%A5%E9%AA%A4)
[【常见部署问题】](https://github.com/a597873885/webfunny_monitor/blob/master/Document.md#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
[【API方法调用】](https://github.com/a597873885/webfunny_monitor/blob/master/Document.md#api%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8)
[【关于数据库表创建的问题】](https://github.com/a597873885/webfunny_monitor/blob/master/Document.md#%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A1%A8%E7%9A%84%E5%88%9B%E5%BB%BA)


#### 环境要求：

node版本号： 10.6.0  (node安装教程自行搜索, 建议先安装[nvm](https://www.jianshu.com/p/d0e0935b150a), 这样切换node版本会方便很多)

mysql版本号：5.6.45  (mysql 安装教程自行搜索 [Linux安装教程](https://www.cnblogs.com/warm-stranger/p/10333348.html))

#### 部署步骤

  1. 下载或者克隆代码到本地
  
  2. 执行测试命令(稍微耗时)$: npm run test_start
  
  3. 访问链接地址： [http://localhost:8010/home.html](http://localhost:8010/home.html) 即可看到官网数据。
  
  #### 那么如何展示自己的数据呢？
  
    【小提示】：项目错误日志都在更目下 logs/ 目录里，方便小伙伴们排查错误
  
  4. 在项目根目录下，进入 config/db.js ，配置mysql数据库的连接配置 （mysql必须先安装好,并手动[创建一个数据库](https://www.cnblogs.com/neuedu/p/5876874.html)）
  
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

  6. 配置完成后，再一次执行命令$: node config.js  来完成自定义配置
  
     服务所有的配置都配置好了，还差最后一步。
  
  7. 创建数据库表，执行命令$: npm run table_config
    
    【小提示】这个步骤需要耗费一些时间2-3分钟，请耐心等待。 
            数据库表生成后，在根目录下执行命令$:  npm run start, 本地服务完成启动。
  
  8. 生成你的探针代码: 进入首页，点击 "新建" 按钮进入创建页面，探针生成后，将其插入到你的前端页面中，OK, 所有的部署都已经完成了。
  
  访问链接地址： [http://localhost:8010/home.html](http://localhost:8010/home.html) 即可看到你自己mysql里边的数据了（如果你的探针已经在上传数据了）。
  
  
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
 
【方法一, 适合后端小白】

    1. 在根目录下，package.json文件中，有一行命令如：
       "table_config": "node table_config.js 2 && npm run table_create"
    
    2. 命令中的数字 2 代表天数。如果你想直接生成未来一个月的数据库表，只需要把这行命令改为：
       "table_config": "node table_config.js 30 && npm run table_create"   就可以了。
       
    3. 然后执行命令$: npm run table_config 后，会从当日起，生成往后30天的数据表，每隔30天，执行一下此命令即可。
     
【方法二, 适合对shell脚本有了解的攻城狮】

    小提示：因为我的开发环境是macOs、linux环境，所以这个方法我只能保证在这两种环境下运行正常，其他操作系统可以搜索一下如何配置，原理都一样。
    
    1. 在根目录下有一个脚本文件 create_table.sh，正常情况下，它是没有执行权限的，所以需要在根目录下执行命令：chmod 755 create_table.sh
    
    2. 执行运行命令：npm run start ，10s之后，数据库的创建程序就会启动，创建日志就在logs/info 目录下。可以使用 'tail -f 文件名'命令实时查看
    
    3. 如果最终都无法成功创建表，就只能选择方法一或者方法三了
    
【方法三, 适合对自动化部署有了解的攻城狮】

    如果你对Jenkins有所了解，或是对其他自动化部署方式有了解，其中应该都包含’定时构建‘这种功能
    
    可以使用[Jenkins](https://jingyan.baidu.com/article/36d6ed1f6928b51bcf4883ee.html)在每天凌晨12：00的时候来做自动化重启服务，以此来     生成每天的数据库表。
    
    不会配置可以私聊我。
 
