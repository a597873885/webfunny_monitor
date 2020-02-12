
    【部署生产环境提示：】 如果你部署在云服务器(生产环境)上了，你需要注意：
    1. 在根目录下执行：chmod 755 restart.sh ，给 restart.sh 脚本文件执行权限 (linux、macOs环境下)
    2. 在根目录下执行：npm run prd ,即可启动生产环境服务 
    
    3. 常用命令如下：
       执行命令： pm2 log 可查看启动日志
       执行命令： pm2 list 可查已经启动的列表
       执行命令： pm2 stop webfunny 停止当前服务
       执行命令： pm2 delete webfunny 删除当前服务
  
----------------------
  

[【环境要求】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E7%8E%AF%E5%A2%83%E8%A6%81%E6%B1%82)
[【部署步骤】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E9%83%A8%E7%BD%B2%E6%AD%A5%E9%AA%A4)
[【常见部署问题】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
[【API方法调用】](https://github.com/a597873885/webfunny_monitor/blob/master/Document_advanced.md#api%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8)
[【云服务器配置教程】](https://www.cnblogs.com/warm-stranger/p/8837784.html)
  
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
    0. 检查配置信息
    在浏览器控制台执行：webfunny.wm_check()
    
    1. 配置用户信息
    /**
     * 使用者传入的自定义信息
     * @param userId 用户唯一标识,不一定是userId
     * @param projectVersion 你自己应用的版本号
     */
    window.webfunny && webfunny.wmInitUser("userId", "projectVersion")
    
    2. 自定上传日志
    /**
     * 使用者自行上传的行为日志
     * @param userId 用户唯一标识
     * @param behaviorType 行为类型
     * @param behaviorResult 行为结果（成功、失败等）
     * @param uploadType 日志类型（分类）
     * @param description 行为描述
     */
    window.webfunny && webfunny.wm_upload_extend_log(userId, behaviorType, behaviorResult, uploadType, description)
    
    
    
