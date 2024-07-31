var fs = require('fs');
var utils = require("./utils/utils")
const path = require('path')
const copydir = require("copy-dir")
var monitorVersion = require("./servers/monitor/version")
var eventVersion = require("./servers/event/version")
// 原路径往上跳2层
// const originPath = pathApp.resolve(__dirname, '../../')
// const monitorPath = originPath + "/be/webfunny_monitor_server"
let compressSuccessCount = 0

var jsHamanUrl = "https://www.jshaman.com:4430/submit_js_code"
var jsHamanParams = {
    js_code: "",
    vip_code: "s2023-0809-21c3",
    config: {
        "compact": true,
        "controlFlowFlattening": true,
        "stringArray" :true,
        "stringArrayEncoding": true,
        "disableConsoleOutput": false,
        "debugProtection": true,
        // "domainLock": ["www.jshaman.com","www.domain.com"],
        "reservedNames": []
    }
} 

/**
 * 压缩加密代码
 * @param originPath 源文件路径
 * @param targetPath 目标文件路径
 * @param delay 延时执行（ms）
 */
const compressCode = (originPath, targetPath, delay, success) => {
    setTimeout(() => {
        console.log(`即将压缩：${originPath}`)
        fs.readFile(originPath, function(err, data){
            if (err) throw err
            let code = data.toString()
            // 对代码进行加密
            jsHamanParams.js_code = code
            utils.postJson(jsHamanUrl, jsHamanParams).then((res) => {
                fs.writeFile(targetPath, res.content, function(err) {
                    if (err) { throw err; }
                    console.log(`${originPath}压缩完成，压缩后长度为：`, res.content.length)
                    compressSuccessCount ++
                    if (typeof success === "function") {
                        success()
                    }
                });
            }).catch((e) => {
                console.log(e)
                console.log(`${originPath}压缩失败，将在30s后重试一次`)
                setTimeout(() => {
                    utils.postJson(jsHamanUrl, jsHamanParams).then((res) => {
                        fs.writeFile(targetPath, res.content, function(err) {
                            if (err) { throw err; }
                            console.log(`${originPath}压缩完成，压缩后长度为：`, res.content.length)
                            compressSuccessCount ++
                            if (typeof success === "function") {
                                success()
                            }
                        });
                    }).catch((e) => {
                        console.log(e)
                    })
                }, 30000)
            })
        })
    }, delay)
}
/**
 * 创建文件夹
 * @param{ String } 目录
 */
const createDir = function(path, callback) {
    fs.mkdir(path, function(err){
        if ( err ) { 
            console.log(`= 文件夹 ${path} 已经存在`)
        } else {
            console.log(`= 创建文件夹 ${path}`)
        }
        if (typeof callback === "function") {
            callback()
        }
    });
}
/**
 * 删除文件夹下所有文件
 * @param{ String } 目录
 */
const delDir = function(path) {
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
                console.log(`${curPath}已删除`)
            }
        });
        fs.rmdirSync(path);
    }
}

/**
 * 复制文件到目标项目
 * @param{ String } 目录
 */
const startCopy = (originPath, targetPath, ignoreFiles) => {
    // const viewsTarget = `${originPath}/${targetPath}/views/resource/webfunny`
    copydir(originPath, targetPath, {
        utimes: true,  // keep add time and modify time
        mode: true,    // keep file mode
        cover: true,    // cover file when exists, default is true
        filter: function(stat, filepath, filename) {
            let isPass = true
            if (stat === 'file') {
                for (let i = 0; i < ignoreFiles.length; i ++) {
                    if (ignoreFiles.indexOf(filename) !== -1) {
                        isPass = false
                        console.log(`${filename}已被过滤！`)
                        break
                    }
                }
            }
            return isPass  // remind to return a true value when file check passed.
          }
    }, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("完成复制 -> " + targetPath)
        }
    })
  }

/**
 * 复制文件夹到目标目录
 * @param{ String } 目录
 */
const copyFiles = function(serverList, targetRootPath) {
    // 把文件全都移入发布项目
    const ignorePaths = [
        ".DS_Store",
        ".vscode",
        ".git",
        "alarm",
        "dist",
        "interceptor",
        "logs",
        "node_modules",
        "sso",
        "util_cus",
    ]
    const ignoreFiles = [
        "publish.js",
        "webfunny.config.js",
        "controllers.js",
        "models.js",
    ]
    let files = fs.readdirSync("./");
    files.forEach((filename) => {
        if (ignorePaths.indexOf(filename) === -1) {
            startCopy(`${filename}`, `${targetRootPath}/${filename}`, ignoreFiles)
        }
    })

    // 加密代码迁移至发布项目
    for (let i = 0; i < serverList.length; i ++) {
        let tempServerName = serverList[i]
        startCopy(`./dist/${tempServerName}/controllers.min.js`, `${targetRootPath}/servers/${tempServerName}/controllers/controllers.js`, [])
        startCopy(`./dist/${tempServerName}/models.min.js`, `${targetRootPath}/servers/${tempServerName}/modules/models.js`, [])
    }
}
const handleVersion = (version, filePath) => {
    // 更改版本号
    const versionArr = version.split(".")
    let v1 = versionArr[0] * 1
    let v2 = versionArr[1] * 1
    let v3 = versionArr[2] * 1
    v3 += 1
    if (v3 >= 100) {
        v3 = 0
        v2 += 1
        if (v2 >= 100) {
            v2 = 0
            v1 += 1
        }
    }
    let webfunnyVersion = v1 + "." + v2 + "." + v3

    fs.writeFile(filePath, `module.exports = "${webfunnyVersion}"`, function(err) {
        if (err) {
            throw err;
        }
    });
}
const run = () => {
    // const serverList = ["center", "event", "monitor"]
    const serverList = ["monitor", "event", "center"]
    // 执行开始
    // 删除dist目录
    delDir("./dist")
    // 创建dist目录
    createDir(`./dist`, () => {
        for (let i = 0; i < serverList.length; i ++) {
            let tempServerName = serverList[i]
            createDir(`./dist/${tempServerName}`)
        }
    })

    // 删除发布项目views目录的文件
    var pathList = ["webfunny", "webfunny_center", "webfunny_event"]
    var targetRootPath = path.resolve(__dirname, '../../') + "/1_publish/webfunny_monitor"

    for (let i = 0; i < pathList.length; i ++) {
        let tempPath = pathList[i]
        delDir(`${targetRootPath}/views/resource/${tempPath}`)
        delDir(`${targetRootPath}/views/resource/${tempPath}`)
        delDir(`${targetRootPath}/views/resource/${tempPath}`)
    }


    const handleSuccess = (finalSuccessCount) => {
        if (finalSuccessCount === 6) {
            console.log(`加密完成，即将开始复制文件...`)
            setTimeout(() => {
                copyFiles(serverList, targetRootPath)
            }, 5000)
        }
    }
    // 执行业务代码压缩加密
    for (let i = 0; i < serverList.length; i ++) {
        let tempServerName = serverList[i]
        setTimeout(() => {
            compressCode(`./servers/${tempServerName}/controllers/controllers.js`, `./dist/${tempServerName}/controllers.min.js`, 15000, () => {
                // 最后一个压缩加密执行完成，5秒后开始执行复制程序
                console.log(`加密成功总数：${compressSuccessCount}`)
                handleSuccess(compressSuccessCount)
            })
            compressCode(`./servers/${tempServerName}/modules/models.js`, `./dist/${tempServerName}/models.min.js`, 30000, () => {
                // 最后一个压缩加密执行完成，5秒后开始执行复制程序
                console.log(`加密成功总数：${compressSuccessCount}`)
                handleSuccess(compressSuccessCount)
            })
        }, i * 20000)
    }
    
    // 更改监控版本号
    handleVersion(monitorVersion, "./servers/monitor/version.js")
    // 更改埋点版本号
    handleVersion(eventVersion, "./servers/event/version.js")
}

run()


