var fs = require('fs');
const utils = require('./util/utils')
var argv = process.argv
var commandLine = ""
var start = 0
var end = argv[2]
for (var i = start; i < end; i ++) {
    var dataStr = utils.addDays(i).replace(/-/g, "")
    if (i == end - 1) {
        commandLine += "node " + "table_create.js " + dataStr + " "
    } else {
        commandLine += "node " + "table_create.js " + dataStr + " && "
    }
}
fs.readFile('./package.json', function(err, data){
  let newString = data.toString().replace(/table_create_command/g, commandLine)
  fs.writeFile('./package.json', newString, (err) => {
    if (err) throw err;
    console.log("命令配置完成, 请执行命令: npm run table_create");
  });
})