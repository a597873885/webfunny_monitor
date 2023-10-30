var fs = require('fs');
var path = require('path');
const rootPath = path.resolve(__dirname, "..")

/**
 * 初始化sso目录
 */
var ssoPathArray = [rootPath + "/sso/feishu.js", rootPath + "/sso/index.js"]
var ssoFileArray = [
  `module.exports = {
    appId: "",
    appSecret: "",
    redirectUri: "http://127.0.0.1:8008/webfunny_center/ssoLoading.html?ssoType=feishu",
    jsSdk: "https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.23.js",
    getTenantTokenConfig: {
      method: "post",
      url: "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    },
    getAppTokenConfig: {
      method: "post",
      url: "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal"
    },
    getUserTokenConfig: {
      method: "post",
      url: "https://open.feishu.cn/open-apis/authen/v1/access_token"
    },
    getJsTicketConfig: {
      method: "get",
      url: "https://open.feishu.cn/open-apis/jssdk/ticket/get"
    },
    getUserInfoConfig: {
      method: "get",
      url: "https://open.feishu.cn/open-apis/authen/v1/user_info"
    },
  }`,
  `const feiShuConfig = require('./feishu')
  module.exports = {
    feiShuConfig
  }`,
]

fs.mkdir( rootPath + "/sso", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${rootPath}/sso 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${rootPath}/sso`)
  }
  ssoPathArray.forEach((path, index) => {
      fs.readFile(path, "", (err) => {
          if (err) {
              console.log("× " + path + " 配置文件不存在，即将创建...")
              fs.writeFile(path, ssoFileArray[index], (err) => {
                  if (err) throw err;
                  console.log("√ " + path + " 配置文件创建完成！");
              });
          } else {
              console.log("√ " + path + " 配置文件已存在！")
          }
      });
  })
});
