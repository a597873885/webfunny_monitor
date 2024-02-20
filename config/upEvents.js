const os = require('os')
const Utils = require("../utils/utils")
const path = require("path");
const jsonfile = require('jsonfile');
const fetch = require('node-fetch');
const WebfunnyConfig = require("../webfunny.config")
const { domainConfig } = WebfunnyConfig
const basePath = path.resolve(__dirname, "..");
const file = basePath + '/package.json';
let packageConf;
if (packageConf == undefined || packageConf == null) {
    try {
      packageConf = jsonfile.readFileSync(file);
    } catch (error) {
      throw new Error('解析配置文件package.json失败')
    }
}
if (packageConf == undefined || packageConf == null) {
    throw new Error('配置不存在');
}
const osInfo = os.type()
const macId = Utils.getMac()
const version = packageConf.version

const projectId = "event1029"
const upEventUrl = "https://monitor.webfunny.cn/tracker/upEvents"
// const upEventUrl = "http://localhost:9011/wfEvent/upEvent"
module.exports = {
  bootstrap: () => {
    // 执行初始化
    fetch(upEventUrl,
    {
        method: "POST", 
        body: JSON.stringify([{
          projectId,
          pointId: "209",
          xiTongXinXi: "cluster-" + osInfo, // 系统信息 | 类型：文本 | 长度：100 | 描述：操作系统信息
          macdiZhi: macId, // Mac地址 | 类型：文本 | 长度：30 | 描述：服务器的mac地址
          banBenHao: version, // 版本号 | 类型：文本 | 长度：20 | 描述：从package.json文件中获取的版不能号
        }]),
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
    })
  },
  prd: () => {
    // 执行启动
    fetch(upEventUrl,
    {
        method: "POST", 
        body: JSON.stringify([{
          projectId,
          pointId: "210",
          xiTongXinXi: "cluster-" + osInfo, // 系统信息 | 类型：文本 | 长度：100 | 描述：操作系统信息
          macdiZhi: macId, // Mac地址 | 类型：文本 | 长度：30 | 描述：服务器的mac地址
          banBenHao: version, // 版本号 | 类型：文本 | 长度：20 | 描述：从package.json文件中获取的版不能号
          xiTongYuMing: domainConfig.host.be, // 系统域名 | 类型：文本 | 长度：100 | 描述：启动时配置的域名
        }]),
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
    })
  }
}