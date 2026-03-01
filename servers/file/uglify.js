var fs = require('fs');
//定义了一些文件夹的路径
var ROOT_PATH = require('path').resolve(__dirname);
var version = require("./version")
var utils = require("./util/utils")
var jsHamanUrl = "http://www.jshaman.com:800/submit_js_code"
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
function handleControllers(success) {
    let path = ROOT_PATH + '/controllers';
    let files = fs.readdirSync(path);
    let deleteReg = /\/\/delete\/\/[\d\D]*\/\/delete\/\//g
    let exportsReg = /\/\/exports\/\/[\d\D]*\/\/exports\/\//g
    let result = ""
    let exportNames = []
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

    fs.writeFile(`./version.js`, `module.exports = "${webfunnyVersion}"`, function(err) {
        if (err) {
            throw err;
        }
    });
    for(let i = 0; i < files.length; i++){
        fs.readFile(path + "/" + files[i], function(err, data){
            let code = data.toString()
            let exportsResult = code.match(exportsReg)[0]
            if (exportsResult) {
                exportNames.push(exportsResult.replace(/ /g, "").split("=")[1].split("\n")[0])
            }
            result = code.replace(deleteReg, "").replace(exportsReg, "")
            
            if (result.indexOf("webfunny-version-flag") != -1) {
                result = result.replace(/webfunny-version-flag/g, webfunnyVersion)
            }
            fs.writeFile(ROOT_PATH + '/dist/controllers.js', result, { 'flag': 'a' }, function(err) {
                if (err) {
                    throw err;
                }
                if (i === files.length - 1) {
                    setTimeout(function() {
                        success(exportNames)
                    }, 3000)
                }
            });
        })
    }
}

function handleModels(success) {
    let path = ROOT_PATH + '/models';
    let files = fs.readdirSync(path);
    let deleteReg = /\/\/delete\/\/[\d\D]*\/\/delete\/\//g
    let sequelizeReg = /\/\/Sequelize\/\/[\d\D]*\/\/Sequelize\/\//g
    let exportsReg = /\/\/exports\/\/[\d\D]*\/\/exports\/\//g
    let result = ""
    let exportNames = []
    for(let i = 0; i < files.length; i++){
        fs.readFile(path + "/" + files[i], function(err, data){
            let code = data.toString()
            let exportsResult = code.match(exportsReg)[0]
            if (exportsResult) {
                exportNames.push(exportsResult.replace(/ /g, "").split("=")[1].split("\n")[0])
            }
            let sequelizeResult = ""
            let sequelizeName = ""
            if (code.match(sequelizeReg) && code.match(sequelizeReg).length){
                sequelizeResult = code.match(sequelizeReg)[0].replace(/\/\/Sequelize\/\//g, "")
                sequelizeName = sequelizeResult.split(" = ")[0].split(" ")[1]
                // sequelizeResult = sequelizeResult.replace(/\'\.\.\/schema\/[a-zA-Z]*\'/g, sequelizeName + "Schema")
            }
            result = sequelizeResult + code.replace(deleteReg, "").replace(sequelizeReg, "").replace(exportsReg, "")
            fs.writeFile(ROOT_PATH + '/dist/models.js', result, { 'flag': 'a' }, function(err) {
                if (err) {
                    throw err;
                }
                if (i === files.length - 1) {
                    setTimeout(() => {
                        success(exportNames)
                    }, 3000)
                }
            });
        })
    }
}


function handleSchema(success) {
    setTimeout(() => {
        success()
    }, 2000)
}


// 执行开始
// 删除原来的文件
let path = ROOT_PATH + '/dist';
let files = fs.readdirSync(path);
files.forEach(function(fileName) {
    fs.unlink(path + "/" + fileName,() => {
        console.log("成功删除 " + fileName)
    });
})

handleSchema(function() {

    // 通用文件的引入
    let importResult = `const db = require('../config/db');
                        const NodeClickHouse = require('../config/node_clickhouse')
                        const Utils = require('../util/utils');
                        const utils = require('../util/utils');
                        const geoip = require('geoip-lite');
                        const log = require("../config/log");
                        const CommonSql = require("../util/commonSql")
                        const { UPLOAD_TYPE, PERF_KEYS } = require('../config/consts')
                        const schemaList = require("../schema/schemaLogList")
                        const AccountConfig = require('../config/AccountConfig')
                        const { accountInfo } = AccountConfig
                        const sourceMap = require('source-map')
                        const fs = require('fs');
                        const fetch = require('node-fetch');`
    fs.writeFile(ROOT_PATH + '/dist/models.js', importResult, { 'flag': 'a' }, function(err) {
        if (err) { throw err; }
        // 合并models
        handleModels(function(models) {
            let result = "module.exports = {"
            models.forEach((element, index) => {
                // result += element + ","
                if (index === models.length - 1) {
                    result += element
                } else {
                    result += element + ","
                }
            })
            result += "}"
            console.log("models 导出列表：")
            console.log(result)

            setTimeout(function() {
                fs.writeFile(ROOT_PATH + '/dist/models.js', result, { 'flag': 'a' }, function(err) {
                    if (err) { throw err; }
                    
                    // controller.js通用文件的引入
                    let importResult = `const db = require('../config/db');
                                        const Sequelize = db.sequelize;
                                        const colors = require('colors');
                                        const jsError = require('../interceptor/config/jsError')
                                        const consoleError = require('../interceptor/config/consoleError')
                                        const httpError = require('../interceptor/config/httpError')
                                        const resourceError = require('../interceptor/config/resourceError')
                                        const Utils = require('../../../util/utils');
                                        const utils = require('../../../util/utils');
                                        const CusUtils = require('../../../util_cus')
                                        const AlarmUtil = require('../alarm/index')
                                        const AlarmNames = require('../alarm/alarmName')
                                        const LZString = require('lz-string');
                                        const searcher = require('node-ip2region').create();
                                        const log = require("../config/log");
                                        const statusCode = require('../util/status-code');
                                        const { handleResultWhenJavascriptError, handleResultWhenHttpRequest, handleResultWhenResourceError } = require('../../../interceptor');
                                        const fetch = require('node-fetch');
                                        const jwt = require('jsonwebtoken')
                                        const verify = jwt.verify
                                        const secret = require('../config/secret')
                                        const { USER_INFO, UPLOAD_TYPE, PERF_KEYS, FLOW_TYPE, UP_LOG_TYPE, CENTER_API, PROJECT_CONFIG, PROJECT_INFO } = require('../config/consts')
                                        const xlsx = require('node-xlsx');
                                        const fs = require('fs');
                                        const path = require('path')
                                        const IP = require('ip')
                                        const citys = require("../config/city");
                                        const provinces = require("../config/province");
                                        const nodemailer = require('nodemailer');
                                        const formidable = require("formidable");
                                        const AccountConfig = require('../config/AccountConfig');
                                        const monitorKeys = require("../config/monitorKeys");
                                        const RabbitMq = require('../lib/RabbitMQ')
                                        const process = require('child_process')
                                        const getmac = require('getmac')
                                        const { spawn, exec, execFile } = require('child_process');
                                        const { accountInfo } = AccountConfig
                                        const ConstMsg = require('../config/constMsg')
                                        const sendMq = accountInfo.messageQueue.enable === true ? new RabbitMq() : null
                                        `
                    let controllerResult = "const {"
                    models.forEach(element => {
                        controllerResult += element + ","
                    })
                    controllerResult += "} = require('../modules/models.js');"
                    controllerResult = importResult + "\n" + controllerResult
                    fs.writeFile(ROOT_PATH + '/dist/controllers.js', controllerResult, { 'flag': 'a' }, function(err) {
                        if (err) { throw err; }
                        handleControllers(function(controllers) {
                            let result = "module.exports = {"
                            controllers.forEach((element, index) => {
                                // result += element + ","
                                if (index === controllers.length - 1) {
                                    result += element
                                } else {
                                    result += element + ","
                                }
                            })
                            result += "}"
                            console.log("controllers 导出列表：")
                            console.log(result)
                            setTimeout(function() {
                                fs.writeFile(ROOT_PATH + '/dist/controllers.js', result, { 'flag': 'a' }, function(err) {
                                    if (err) { throw err; }

                                    // 压缩models
                                    setTimeout(() => {
                                        fs.readFile(ROOT_PATH + '/dist/models.js', function(err, data){
                                            if (err) throw err
                                            let code = data.toString()
                                            // 对代码进行加密
                                            jsHamanParams.js_code = code
                                            utils.postJson(jsHamanUrl, jsHamanParams).then((res) => {
                                                fs.writeFile(ROOT_PATH + '/dist/models.min.js', res.content, function(err) {
                                                    if (err) { throw err; }
                                                    console.log("models压缩完成，压缩后长度为：", res.content.length)
                                                });
                                            }).catch((e) => {
                                                console.log(e)
                                            })
                                        })
                                    }, 3000)
                                    // 写入完成后, 3秒钟后开始加密
                                    setTimeout(() => {
                                        fs.readFile(ROOT_PATH + '/dist/controllers.js', function(err, data){
                                            if (err) throw err
                                            let code = data.toString()
                                            // 对代码进行加密
                                            jsHamanParams.js_code = code
                                            utils.postJson(jsHamanUrl, jsHamanParams).then((res) => {
                                                fs.writeFile(ROOT_PATH + '/dist/controllers.min.js', res.content, function(err) {
                                                    if (err) { throw err; }
                                                    console.log("controller压缩完成，压缩后长度为：", res.content.length)
                                                });
                                            }).catch((e) => {
                                                console.log(e)
                                            })
                                        })
                                    }, 6000)
                                });
                            }, 2000)
                        })
                    });
    
                });
            }, 2000)
        })
    });
})

