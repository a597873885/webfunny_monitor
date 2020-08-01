var fs = require('fs');
const utils = require('./util/utils')
const log = require("./config/log");
const fetch = require('node-fetch')
const { localServerDomain } = require('./bin/domain')
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

fetch("http://" + localServerDomain + "/server/webMonitorIdList")
.then( res => res.text())
.then( body => {
  let response = JSON.parse(body)
  const projectList = response.data
  handleCommandLine(projectList)
}).catch(() => {
  // 如果http协议访问不通，则尝试使用https协议
  fetch("https://" + localServerDomain + "/server/webMonitorIdList")
  .then( res => res.text())
  .then( body => {
    let response = JSON.parse(body)
    const projectList = response.data
    handleCommandLine(projectList)
  }).catch(() => {
    log.printError("创建数据库表过程中，项目列表接口访问不通，无法生成对应的数据库表！")
    console.log("创建数据库表过程中，项目列表接口访问不通，无法生成对应的数据库表！")
  })
});
