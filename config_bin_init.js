var fs = require('fs');

var pathArray = ["./bin/domain.js", "./bin/messageQueue.js", "./bin/mysqlConfig.js", "./bin/purchaseCode.js", "./bin/saveDays.js", "./bin/slave.js", "./bin/stayTimeScope.js", "./bin/stopWebMonitorIdList.js", "./bin/useCusEmailSys.js", "./bin/webfunny.js", "./bin/webMonitorIdList.js"]
var fileArray = [
    `module.exports = {
        localServerDomain: 'localhost:8011', // 日志服务域名  书写形式：localhost:8011
        localAssetsDomain: 'localhost:8010', // 数据可视化服务域名 书写形式：localhost:8010
        localServerPort: '8011',               // 日志服务端口号
        localAssetsPort: '8010',               // 可视化系统端口号
    
        /**
         * 注意：不懂可以不用设置，【千万不要乱设置】
         * 
         * 1. 什么情况设置：如果同一个主域名下有多个项目，并且同一个UserId的用户，会访问这多个项目
         * 2. 设置结果：使用userId查询，可以将一个用户在多个项目上的行为串联起来。
         * 
         * 例如：www.baidu.com  主域名就是：baidu.com
         */
        mainDomain: ''                         // 默认空字符串就行了
    }`,
    `module.exports = {
        messageQueue: false  // 是否开启消息队列，默认不开启
    }`,
    `module.exports = {
      write: {
        ip: '',
        port: '3306',
        dataBaseName: 'webfunny_db',
        userName: '',
        password: ''
      },
      // 高性能版支持此属性
      read: [
        // { host: "", username: "", password: "" }
      ]
    }`,
    `module.exports = {
        purchaseCode: 'AAAABBBBCCCCDDDD',
    }`,
    `module.exports = {
        saveDays: '8',
    }`,
    `var app = require('../app');
    var { accountInfo } = require("../config/AccountConfig")
    
    global.serverType = "slave"
    
    var port = normalizePort(process.env.PORT || accountInfo.localServerPort);
    app.listen(port);
    
    function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        // named pipe
        return val;
      }
    
      if (port >= 0) {
        // port number
        return port;
      }
    
      return false;
    }
    `,
    `/**
      * 用户停留时间，去掉最大值，去掉最小值范围
      * 
      * 去掉最小值： 有些用户进来了就离开，可以不考虑在内
      * 去掉最大值： 有些用户进来了，处于不活跃状态，停留时间会很长，也可以去除
      */
    module.exports = {
        min: 100,     // 最小值
        max: 100000   // 最大值
    }`,
    `// 停止日志上报列表
    module.exports = []`,
    `module.exports = {
      useCusEmailSys: false,               // 是否使用自己的邮件系统, true: 使用配置的邮箱密码；false: 由webfunny系统给你发送邮件
      emailUser: "",                       // 163邮箱用户名
      emailPassword: ""                    // 163邮箱，网易老账号用密码， 新账号用安全码
    }`,
    `#!/usr/bin/env node

    var app = require('../app');
    var debug = require('debug')('demo:server');
    var compression = require('compression')
    var { accountInfo } = require("../config/AccountConfig")
    
    
    var port = normalizePort(process.env.PORT || accountInfo.localServerPort);
    app.listen(port);
    
    function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        // named pipe
        return val;
      }
    
      if (port >= 0) {
        // port number
        return port;
      }
    
      return false;
    }
    
    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }
    
      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    
      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }
    
    function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
    
    // 启动静态文件服务器
    var connect = require("connect");
    var serveStatic = require("serve-static");
    var app = connect();
    app.use(compression())
    app.use(serveStatic("./views"));
    app.listen(accountInfo.localAssetsPort);
    
    `,
    `module.exports = []`
]

fs.mkdir( "./bin", function(err){
  if ( err ) { 
    console.log("= 文件夹 /bin 已经存在")
  } else {
    console.log("= 创建文件夹 /bin")
  }
  pathArray.forEach((path, index) => {
      fs.readFile(path, "", (err) => {
          if (err) {
              console.log("× " + path + " 配置文件不存在，即将创建...")
              fs.writeFile(path, fileArray[index], (err) => {
                  if (err) throw err;
                  console.log("√ " + path + " 配置文件创建完成！");
              });
          } else {
              console.log("√ " + path + " 配置文件已存在！")
          }
      });
  })
});
