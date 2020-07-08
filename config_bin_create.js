var fs = require('fs');

var pathArray = ["./bin/messageQueue.js"]
var fileArray = [
    `module.exports = {
        messageQueue: false  // 是否开启消息队列，默认不开启
    }`
]

pathArray.forEach((path, index) => {
    fs.readFile(path, "", (err) => {
        if (err) {
            console.log( path + " 配置文件不存在，即将创建...")
            fs.writeFile(path, fileArray[index], (err) => {
                if (err) throw err;
                console.log("= " + path + " 配置文件创建完成！");
            });
        } else {
            console.log(path + " 配置文件已存在！")
        }
    });
})
