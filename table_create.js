var fs = require('fs');
require('./util/extension')
const db = require('./config/db')
const log = require("./config/log");
const Sequelize = db.sequelize;
var stat = fs.stat;
var proName = process.argv[2]
var dateString = process.argv[3]
/**
 * 创建表
 */
function createTable() {
    const BehaviorInfo = Sequelize.import('./schema_temp/behaviorInfo');
    BehaviorInfo.sync({force: false});
    
    const CustomerPV = Sequelize.import('./schema_temp/customerPV');
    CustomerPV.sync({force: false});

    const CustomerPvLeave = Sequelize.import('./schema_temp/CustomerPvLeave');
    CustomerPvLeave.sync({force: false});

    const CustomerStayTime = Sequelize.import('./schema_temp/CustomerStayTime');
    CustomerStayTime.sync({force: false});
    
    const ExtendBehaviorInfo = Sequelize.import('./schema_temp/extendBehaviorInfo');
    ExtendBehaviorInfo.sync({force: false});
    
    const HttpErrorInfo = Sequelize.import('./schema_temp/HttpErrorInfo');
    HttpErrorInfo.sync({force: false});
    
    const HttpLogInfo = Sequelize.import('./schema_temp/HttpLogInfo');
    HttpLogInfo.sync({force: false});
    
    const JavascriptErrorInfo = Sequelize.import('./schema_temp/javascriptErrorInfo');
    JavascriptErrorInfo.sync({force: false});

    const LocationPoints = Sequelize.import('./schema_temp/locationPoints');
    LocationPoints.sync({force: false});
    
    const LoadPageInfo = Sequelize.import('./schema_temp/loadPageInfo');
    LoadPageInfo.sync({force: false});
    
    const ResourceLoadInfo = Sequelize.import('./schema_temp/resourceLoadInfo');
    ResourceLoadInfo.sync({force: false});
    
    const ScreenShotInfo = Sequelize.import('./schema_temp/ScreenShotInfo');
    ScreenShotInfo.sync({force: false});
    
    const VideosInfo = Sequelize.import('./schema_temp/videosInfo');
    VideosInfo.sync({force: false});
    setTimeout(function() {
        console.log("此进程将会重复多次，请不要中断，等待程序自动停止...")
    }, 2000)
}
/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */

var copy = function( src, dst ){
    // 读取目录中的所有文件/目录
    fs.readdir( src, function( err, paths ){
        if( err ){ throw err; }
        paths.forEach(function( path ){
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;      
            stat( _src, function( err, st ){
                if( err ){ throw err; }
                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst ); 
                    // 通过管道来传输流
                    readable.pipe( writable );
                }
                // 如果是目录则递归调用自身
                else if( st.isDirectory() ){
                    exists( _src, _dst, copy );
                }
            });
        });
    });
};

/**
 * 替换日期方法
 */
function replaceDate(proName, dateString) {
    let path = './schema_temp';
    let files = fs.readdirSync(path);
    let fileCount = files.length
    let replaceCount = 0
    for(let i = 0; i < files.length; i++){
      fs.readFile(`${path}/${files[i]}`,function(err, data){
          if (err) throw err;
          let newString = data.toString()

          if (newString.indexOf("id-head") != -1 || newString.indexOf("date-tail") != -1) {
            replaceCount ++
          }
          if (newString.indexOf("id-head") != -1) {
            newString = newString.replace(/id-head/g, proName)
          }
          if (newString.indexOf("date-tail") != -1) {
            newString = newString.replace(/date-tail/g, dateString)
          }
          fs.writeFile(`${path}/${files[i]}`, newString, (err) => {
            if (err) throw err;
            log.printInfo(files[i] + "  关键信息替换！" + i);
          });
      })
    }
    let timeout = setInterval(function() {
        // 因为有个baseInfo.js不用替换，所以需要减一
        if (replaceCount == fileCount - 1) {
            createTable()
            clearInterval(timeout)
        }
    }, 500)
}

/**
 * 启动程序
 */
function startProgram(proName) {
    console.log("===============================================")
    console.log("= 即将启动创建程序，时间比较长，请耐心等待... =")
    console.log("===============================================")
    fs.mkdir( "./schema_temp", function(err) {
        if ( err ) {
            console.log("文件夹 /schema_temp 已经存在, 删除原来的内容...")
            let path = './schema_temp';
            let files = fs.readdirSync(path);
            files.forEach(function(fileName, index) {
                fs.unlink(path + "/" + fileName,() => {
                    console.log("成功删除 " + fileName)
                    // 如果最后一个删除成功
                    if (index == files.length - 1) {
                        copy("./schema_base/", "./schema_temp/")
                    }
                });
            })
        } else {
            console.log("新建文件夹 /schema_temp")
            copy("./schema_base/", "./schema_temp/")
        }
    });
    // 将package.json恢复成原样
    fs.readFile('./package.json', function(err, data){
        let newString = data.toString().replace(/node .* \d{8}/g, "table_create_command")
        fs.writeFile('./package.json', newString, (err) => {
            if (err) throw err;
            console.log("命令配置已经恢复");
        });
    })
    setTimeout(function() {
        replaceDate(proName, dateString)
    }, 3000)
}

startProgram(proName)

