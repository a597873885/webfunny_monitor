var fs = require('fs');
var monitorKeys = require('./monitorKeys.js');
fs.readFile('./webmonitor.js', function(err, data){
    let dataString = data.toString()
    console.log(dataString)
    for (key in monitorKeys) {
        let replaceStr = "this." + key + " ="
        let reg = new RegExp(replaceStr, "g")
        dataString = dataString.replace(reg, "this." + monitorKeys[key] + " =")
        console.log(",", dataString.indexOf("this." + key + " ="), key)
    }
    fs.writeFile('./webmonitor_short.js', dataString, (err) => {
        if (err) throw err;
        console.log("关键缩短操作完成！");
    });
})