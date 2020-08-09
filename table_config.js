var fs = require('fs');
const utils = require('./util/utils')
const log = require("./config/log");
const webMonitorIdList = require('./bin/webMonitorIdList')
var argv = process.argv
var commandLine = ""
var start = 0
var end = argv[2]


const handleCommandLine = (projectList) => {
  projectList.forEach((proName, index) => {
    for (var i = start; i < end; i ++) {
      var dataStr = utils.addDays(i).replace(/-/g, "")
      if (i == end - 1 && index == projectList.length - 1) {
          commandLine += "node " + "table_create.js " + proName + " " + dataStr
      } else {
          commandLine += "node " + "table_create.js " + proName + " " + dataStr + " && "
      }
    }
  })

  fs.readFile('./package.json', function(err, data){
    let newString = data.toString().replace(/table_create_command/g, commandLine)
    fs.writeFile('./package.json', newString, (err) => {
      if (err) throw err;
      log.printInfo("命令配置完成, 请执行命令: npm run table_create");
    });
  })
}

if (webMonitorIdList.length) {
  handleCommandLine(webMonitorIdList)
} else {
  log.printError("未能查询到你的应用列表，无法创建对应的数据库表，请检查bin/webMonitorIdList.js文件")
}

