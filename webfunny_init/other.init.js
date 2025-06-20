var fs = require('fs');
var path = require('path');
const rootPath = path.resolve(__dirname, "..")

/**
 * 初始化临时文件目录
 */
fs.mkdir( rootPath + "/servers/event/lib/dataTempUploads", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${rootPath}/servers/event/lib/dataTempUploads 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${rootPath}/servers/event/lib/dataTempUploads`)
  }
});
