
/**
  * 请先配置您的域名!!!
  * 请求接口域名 webfunny-servers 的服务的部署域名
  * 本地请使用 "//localhost:8011"
  */

// Demo数据
// 如果是本地部署： const default_api_server_url = "//localhost:8011"  
const default_api_server_url = "//www.webfunny.cn"  // 本地可以使用："//localhost:8011"

/**
 * 静态资源域名 webfunny-admin 的部署域名
 * 本地请使用 "//localhost:8010"
 */
// 本地部署
const default_assets_url = "//localhost:8010"

/** 重要！ 重要！ 重要！ 这里一定要配置的*/
const customerConfig = {
  default_api_server_url,
  default_assets_url
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

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, callback ){
  fs.exists( dst, function( exists ){
      // 已存在
      if( exists ){
          callback( src, dst );
      }
      // 不存在
      else{
          fs.mkdir( dst, function(){
              callback( src, dst );
          });
      }
  });
};

var fs = require('fs');
stat = fs.stat;
fs.mkdir( "./views/webfunny", function(err){
  if ( err ) { 
    console.log("文件夹 /views/webfunny 已经存在")
  } else {
    console.log("创建文件夹 /views/webfunny")
  }
});
copy("./views/resource/", "./views/webfunny")
console.log("===========================")
console.log("= 正在执行编译，请等待... =")
console.log("===========================")
setTimeout(function() {
  let path = './views/webfunny/js';
  let files = fs.readdirSync(path);
  for(let i = 0; i < files.length; i++){
    if ( !(files[i].indexOf(".js") >= 0 || files[i].indexOf(".html") >= 0) ) {
      continue
    }
    fs.readFile(`${path}/${files[i]}`,function(err, data){
        if (data.indexOf("default_api_server_url") >= 0 || data.indexOf("default_assets_url") >= 0 ) {
          let newString = data.toString().replace(/default_api_server_url/g, customerConfig.default_api_server_url).replace(/default_assets_url/g, customerConfig.default_assets_url)
          fs.writeFile(`${path}/${files[i]}`, newString, (err) => {
            if (err) throw err;
            console.log(files[i] + "  接口域名配置成功！");
          });
        }
    })
  }

}, 3000)
