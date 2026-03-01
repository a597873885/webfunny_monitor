/**
 * 日志中间件
 */
const WebfunnyConfig = require("../webfunny.config")
const { otherConfig, domainConfig } = WebfunnyConfig
const statusCode = require('../utils/status-code')
const loggerUpload = require("./loggerUpload")
const log = require("../config/log")
const fetch = require('node-fetch')
const Utils = require("../utils/utils")

// 批量上报缓存
let pendingPoints = []
const BATCH_SIZE = 50 // 批量大小
const BATCH_TIMEOUT = 10000 // 10秒超时上报

// 批量上报函数
async function batchUploadPoints() {
    if (pendingPoints.length === 0) return
    
    const pointsToUpload = [...pendingPoints]
    pendingPoints = [] // 清空待上报数组
    
    try {
        fetch(`http://127.0.0.1:${domainConfig.port.be}/wfEvent/upEvents`, {
            method: "POST", 
            body: JSON.stringify(pointsToUpload),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        }).catch(error => {
            console.error("handleEventData 批量上报错误:", error)
        })
        
    } catch (error) {
        console.error("批量上报错误:", error)
        // 如果上报失败，可以考虑重新加入队列或记录错误日志
    }
}

// // 日期格式化函数
// function formatDate(date, format) {
//   if (!date) return ""
//   const d = new Date(date)
//   if (isNaN(d.getTime())) return ""
  
//   const year = d.getFullYear()
//   const month = String(d.getMonth() + 1).padStart(2, '0')
//   const day = String(d.getDate()).padStart(2, '0')
//   const hours = String(d.getHours()).padStart(2, '0')
//   const minutes = String(d.getMinutes()).padStart(2, '0')
//   const seconds = String(d.getSeconds()).padStart(2, '0')
  
//   return format
//     .replace('yyyy', year)
//     .replace('MM', month)
//     .replace('dd', day)
//     .replace('hh', hours)
//     .replace('mm', minutes)
//     .replace('ss', seconds)
// }

// 生成去重key
function generateDedupeKey(point) {
  try {
    const formattedTime = new Date(point.weHappenTime).Format("yyyy-MM-dd hh:mm:ss")
    return `${point.projectId || ''}_${point.pointId || ''}_${point.weUserId || ''}_${point.wePath || ''}_${point.glOriginPointId || ''}_${formattedTime}`
  } catch(e) {
    console.error("generateDedupeKey error", e)
  }
  return Utils.guid()
}

// 添加数据点到待上报队列
function addPointToBatch(point) {
    // 生成去重key
    const dedupeKey = generateDedupeKey(point)
    
    // 检查是否已存在相同的点
    const exists = pendingPoints.some(existingPoint => {
        return generateDedupeKey(existingPoint) === dedupeKey
    })

    // 如果不存在，则添加到队列
    if (!exists) {
        pendingPoints.push(point)
    } else {
      console.log("【重复判断结果】", exists, dedupeKey)
    }
    
    // 达到批量大小时立即上报
    if (pendingPoints.length >= BATCH_SIZE) {
        batchUploadPoints()
    }
}

// 定时上报机制
let batchTimer = setInterval(() => {
    batchUploadPoints()
}, BATCH_TIMEOUT)

// 进程退出时上报剩余数据
process.on('exit', () => {
    if (pendingPoints.length > 0) {
        console.log('进程退出，上报剩余数据')
        // 注意：这里使用同步方式，因为异步可能无法完成
    }
})

process.on('SIGINT', async () => {
    console.log('收到退出信号，上报剩余数据')
    clearInterval(batchTimer)
    await batchUploadPoints()
    process.exit(0)
})

/**
 * 根据浏览器信息判断平台类型
 * @param {string} weBrowserInfo - 浏览器信息
 * @returns {string} 平台类型
 */
function getPlatformFromBrowserInfo(originBrowserInfo) {
  const weBrowserInfo = Utils.b64DecodeUnicode(originBrowserInfo)
    if (!weBrowserInfo) {
        return "浏览器端" // 默认值
    }
    const userAgent = weBrowserInfo.toLowerCase();
    // 判断是否为移动端
    const isMobile = /(android|iphone|ipod|ipad|windows phone|mobile|blackberry|opera mini|opera mobi|iemobile)/i.test(userAgent);
    if (isMobile) {
        return "飞书移动端"
    } else if (/lark/i.test(userAgent)) {
      return "飞书桌面端"
    } else {
        return "浏览器端"
    }
}

function getBrowserInfo(originBrowserInfo) {
  const tempBrowserInfo = Utils.b64DecodeUnicode(originBrowserInfo)
  try {
    var agent = tempBrowserInfo.toLowerCase(); // 转换为小写便于匹配
    var regStr_ie = /msie [\d.]+;/gi;
    var regStr_edg = /edg\/[\d.]+/gi;
    var regStr_ff = /firefox\/[\d.]+/gi;
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;
    var regStr_360 = /360se\/[\d.]+/gi;

    var browserName = 'chrome';
    var browserVersion = '';
    var browserInfo = "";

    // 爬虫检测 - 优先检测爬虫
    var spiderPatterns = [
      { pattern: /baiduspider(-render)?\/?([\d.]+)?/i, name: "baiduspider" },
      { pattern: /googlebot\/?([\d.]+)?/i, name: "googlebot" },
      { pattern: /bingbot\/?([\d.]+)?/i, name: "bingbot" },
      { pattern: /slurp\/?([\d.]+)?/i, name: "yahoobot" },
      { pattern: /sosowebspider\/?([\d.]+)?/i, name: "sosospider" },
      { pattern: /sogou\s+web\s+spider\/?([\d.]+)?/i, name: "sogoubot" },
      { pattern: /yandexbot\/?([\d.]+)?/i, name: "yandexbot" },
      { pattern: /facebookexternalhit\/?([\d.]+)?/i, name: "facebook" },
      { pattern: /twitterbot\/?([\d.]+)?/i, name: "twitter" },
      { pattern: /linkedinbot\/?([\d.]+)?/i, name: "linkedin" },
      { pattern: /(spider|crawler|bot)\/?[\d.]*?/i, name: "spider" } // 通用爬虫匹配
    ];

    // 检查是否匹配爬虫模式
    for (let spiderPattern of spiderPatterns) {
      var spiderMatch = agent.match(spiderPattern.pattern);
      if (spiderMatch) {
        browserName = spiderPattern.name;
        // 提取版本号（如果存在）
        browserVersion = spiderMatch[2] || spiderMatch[1] || "";
        // 如果没有版本号，尝试从整个匹配中提取
        if (!browserVersion && spiderMatch[0]) {
          var versionMatch = spiderMatch[0].match(/([\d.]+)/);
          browserVersion = versionMatch ? versionMatch[1] : "";
        }
        return {
          browserName: browserName,
          browserVersion: browserVersion
        };
      }
    }

    // 原有的浏览器检测逻辑（agent需要重新赋值为原值进行匹配）
    agent = browserInfo;
    
    // 移动端浏览器检测 - 优先检测移动端特有浏览器
    // 微信浏览器
    if(agent.indexOf("micromessenger") > 0) {
      var wechatMatch = agent.match(/micromessenger\/([\d.]+)/i);
      browserName = "wechat";
      browserVersion = wechatMatch && wechatMatch[1] ? wechatMatch[1] : "";
    }
    // QQ浏览器
    else if(agent.indexOf("mqqbrowser") > 0) {
      var qqMatch = agent.match(/mqqbrowser\/([\d.]+)/i);
      browserName = "qq";
      browserVersion = qqMatch && qqMatch[1] ? qqMatch[1] : "";
    }
    // UC浏览器
    else if(agent.indexOf("ucbrowser") > 0 || agent.indexOf("ubrowser") > 0) {
      var ucMatch = agent.match(/u?c?browser\/([\d.]+)/i);
      browserName = "uc";
      browserVersion = ucMatch && ucMatch[1] ? ucMatch[1] : "";
    }
    // 百度浏览器
    else if(agent.indexOf("baidubrowser") > 0) {
      var baiduMatch = agent.match(/baidubrowser\/([\d.]+)/i);
      browserName = "baidu";
      browserVersion = baiduMatch && baiduMatch[1] ? baiduMatch[1] : "";
    }
    // 搜狗浏览器
    else if(agent.indexOf("sogou") > 0 && agent.indexOf("mobile") > 0) {
      var sogouMatch = agent.match(/sogou.*mobile.*\/([\d.]+)/i);
      browserName = "sogou";
      browserVersion = sogouMatch && sogouMatch[1] ? sogouMatch[1] : "";
    }
    // 支付宝内置浏览器
    else if(agent.indexOf("alipayclient") > 0 || agent.indexOf("alipay") > 0) {
      var alipayMatch = agent.match(/alipay(?:client)?\/([\d.]+)/i);
      browserName = "alipay";
      browserVersion = alipayMatch && alipayMatch[1] ? alipayMatch[1] : "";
    }
    // 钉钉内置浏览器
    else if(agent.indexOf("dingtalk") > 0) {
      var dingMatch = agent.match(/dingtalk\/([\d.]+)/i);
      browserName = "dingtalk";
      browserVersion = dingMatch && dingMatch[1] ? dingMatch[1] : "";
    }
    // 企业微信
    else if(agent.indexOf("wxwork") > 0) {
      var wxworkMatch = agent.match(/wxwork\/([\d.]+)/i);
      browserName = "wxwork";
      browserVersion = wxworkMatch && wxworkMatch[1] ? wxworkMatch[1] : "";
    }
    // 小程序WebView
    else if(agent.indexOf("miniprogram") > 0) {
      browserName = "miniprogram";
      browserVersion = "";
    }
    // iPhone Safari (移动端Safari)
    else if(agent.indexOf("iphone") > 0 && agent.indexOf("safari") > 0 && agent.indexOf("crios") < 0 && agent.indexOf("fxios") < 0) {
      var safariMatch = agent.match(/version\/([\d.]+)/i);
      browserName = "safari";
      browserVersion = safariMatch && safariMatch[1] ? safariMatch[1] : "";
    }
    // Chrome for iOS
    else if(agent.indexOf("crios") > 0) {
      var criosMatch = agent.match(/crios\/([\d.]+)/i);
      browserName = "chrome";
      browserVersion = criosMatch && criosMatch[1] ? criosMatch[1] : "";
    }
    // Firefox for iOS
    else if(agent.indexOf("fxios") > 0) {
      var fxiosMatch = agent.match(/fxios\/([\d.]+)/i);
      browserName = "firefox";
      browserVersion = fxiosMatch && fxiosMatch[1] ? fxiosMatch[1] : "";
    }
    // 桌面端浏览器检测
    //IE
    else if(agent.indexOf("msie") > 0) {
      browserInfo = agent.match(regStr_ie)[0];
      browserName = "ie";
      browserVersion = browserInfo.split(' ')[1].replace(';', '');
    }
    // Edge
    else if(agent.indexOf("edg") > 0) {
      browserInfo = agent.match(regStr_edg)[0];
      browserName = "edge";
      browserVersion = browserInfo.split('/')[1];
    }
    //Firefox
    else if(agent.indexOf("firefox") > 0) {
      browserInfo = agent.match(regStr_ff)[0];
      browserName = "firefox";
      browserVersion = browserInfo.split('/')[1];
    }
    //Safari (桌面端)
    else if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
      browserInfo = agent.match(regStr_saf)[0];
      browserName = "safari";
      browserVersion = browserInfo.split('/')[1];
    }
    //Chrome (桌面端)
    else if(agent.indexOf("chrome") > 0) {
      browserInfo = agent.match(regStr_chrome)[0];
      browserName = "chrome";
      browserVersion = browserInfo.split('/')[1];
      // 检测360浏览器
      if (agent.indexOf("360se") > 0 && agent.match(regStr_360)) {
        browserName = "360";
        var browser360Info = agent.match(regStr_360)[0];
        browserVersion = browser360Info.split('/')[1] || browserVersion;
      }
    }
    return {
      browserName: browserName,
      browserVersion: browserVersion
    };
  } catch (error) {
    console.log("getBrowserInfo error", error)
  }
  return {
    browserName: "",
    browserVersion: ""
  };
}

function getDeviceInfo(originDeviceName, originBrowserInfo) {
  if (originDeviceName !== "PC") {
    return originDeviceName
  }
  // 如果originDeviceName是PC，则根据浏览器信息再做一次判断
  var device = {};
  var ua = Utils.b64DecodeUnicode(originBrowserInfo);
  var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
  var mobileInfo = ua.match(/Android\s[\S\s]+Build\//);
  var screenWidth = 0;
  var screenHeight = 0;
  device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
  device.isWeixin = /MicroMessenger/i.test(ua);
  device.os = 'web';
  // Android
  if (android) {
      device.os = 'android';
      device.osVersion = android[2];
      device.android = true;
      device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
  }
  if (ipad || iphone) {
      device.os = 'ios';
      device.ios = true;
  }
  // iOS
  if (iphone) {
      device.osVersion = iphone[2].replace(/_/g, '.');
      device.iphone = true;
  }
  if (ipad) {
      device.osVersion = ipad[2].replace(/_/g, '.');
      device.ipad = true;
  }
  // iOS 8+ changed UA
  if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
      if (device.osVersion.split('.')[0] === '10') {
          device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
      }
  }

  // 如果是ios, deviceName 就设置为iphone，根据分辨率区别型号

  // iphone12 pro: 390 x 844

  if (device.iphone) {
      var tempDeviceName = `${screenWidth} x ${screenHeight}`;
      if (screenWidth === 320 && screenHeight === 480) {
          tempDeviceName = '4';
      } else if (screenWidth === 320 && screenHeight === 568) {
          tempDeviceName = '5/SE';
      } else if (screenWidth === 375 && screenHeight === 667) {
          tempDeviceName = '6/7/8';
      } else if (screenWidth === 414 && screenHeight === 736) {
          tempDeviceName = '6/7/8 Plus';
      } else if (screenWidth === 375 && screenHeight === 812) {
          tempDeviceName = 'X/S/Max';
      } else if (screenWidth === 414 && screenHeight === 896) {
          tempDeviceName = '11/Pro-Max';
      } else if (screenWidth === 375 && screenHeight === 812) {
          tempDeviceName = '11-Pro/mini';
      } else if (screenWidth === 390 && screenHeight === 844) {
          tempDeviceName = '12/13/Pro';
      } else if (screenWidth === 428 && screenHeight === 926) {
          tempDeviceName = '12/13/Pro-Max';
      } else if (screenWidth === 390 && screenHeight === 844) {
          tempDeviceName = '14/15/Pro';
      } else if (screenWidth === 430 && screenHeight === 932) {
          tempDeviceName = '14/15/Pro-Max';
      } else {
          tempDeviceName = '';
      }
      device.deviceName = 'iphone ' + tempDeviceName;
  } else if (device.ipad) {
      device.deviceName = 'ipad';
  } else if (device.android) {
      // Android设备名称解析逻辑优化
      var deviceName = '';
      
      // 方法1：处理现代格式 - Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36...
      // 匹配括号内的Android信息，格式: (Linux; Android版本; 设备名称)
      var modernAndroidMatch = ua.match(/\(Linux;\s*Android\s+[\d.]+;\s*([^)]+)\)/i);
      if (modernAndroidMatch && modernAndroidMatch[1]) {
          deviceName = modernAndroidMatch[1].trim();
          // 清理可能的额外信息，如 "wv" 等
          deviceName = deviceName.replace(/;\s*wv$/, '').trim();
      }
      
      // 方法2：如果没有找到，尝试原来的Build格式
      if (!deviceName && mobileInfo) {
          var info = mobileInfo[0];
          var dNameArr = info.split(';');
          for (var i = 0; i < dNameArr.length; i++) {
              if (dNameArr[i].indexOf('Build') != -1) {
                  deviceName = dNameArr[i].replace(/Build\//g, '');
                  break;
              }
          }
          if (deviceName == '' && dNameArr.length > 1) {
              deviceName = dNameArr[1];
          }
      }
      
      // 方法3：如果还是没有找到，尝试其他Android格式
      if (!deviceName) {
          // 尝试匹配其他格式，如 Android 版本号后面的设备信息
          var otherAndroidMatch = ua.match(/Android[\s\/][\d.]+[;\s]+([^;)]+)/i);
          if (otherAndroidMatch && otherAndroidMatch[1]) {
              deviceName = otherAndroidMatch[1].trim();
          }
      }
      
      // 清理设备名称
      if (deviceName) {
          deviceName = deviceName.replace(/(^\s*)|(\s*$)/g, ''); // 去除首尾空格
          deviceName = deviceName.replace(/Build\//g, ''); // 移除可能剩余的Build/
          deviceName = deviceName.replace(/;\s*wv$/, ''); // 移除webview标识
      }
      
      device.deviceName = deviceName || 'Android';
  }

  return device.deviceName;
}

/**
 * 根据浏览器信息判断手机品牌
 * @param {string} originBrowserInfo - 浏览器信息（User Agent）
 * @returns {string} 手机品牌
 */
function getPhoneBrandFromBrowserInfo(originBrowserInfo) {
  const weBrowserInfo = Utils.b64DecodeUnicode(originBrowserInfo)
  if (!weBrowserInfo) {
    return "PC"
  }
  
  const userAgent = weBrowserInfo.toLowerCase()

  // 先判断是否是桌面端系统，如果是桌面端则直接返回"其他"
  const isDesktop = /(windows nt|macintosh|mac os x|linux.*x86|linux.*x64)/i.test(userAgent) && 
                   !/android|mobile/i.test(userAgent)
  
  if (isDesktop) {
    return "PC"
  }
  
  // iPhone系列
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "iPhone"
  }
  
  // 华为系列（包括Honor荣耀）
  if (/huawei|honor|harmonyos|hms/i.test(userAgent)) {
    return "华为"
  }
  
  
  
  // OPPO系列（包括内部型号）
  if (/oppo|oneplus|realme|pkg\d+|pkd\d+/i.test(userAgent)) {
    return "OPPO"
  }
  
  // 三星系列
  if (/samsung|sm-|galaxy/i.test(userAgent)) {
    return "三星"
  }
  
  // 魅族系列
  if (/meizu|flyme/i.test(userAgent)) {
    return "魅族"
  }
  
  // 一加系列（已包含在OPPO中，但可以单独识别）
  if (/oneplus|pj[a-z]\d{3}/i.test(userAgent)) {
    return "一加"
  }
  
  // 中兴系列
  if (/zte|blade/i.test(userAgent)) {
    return "中兴"
  }
  
  // 联想系列
  if (/lenovo|moto/i.test(userAgent)) {
    return "联想"
  }
  
  // TCL系列
  if (/tcl/i.test(userAgent)) {
    return "TCL"
  }
  
  // 努比亚系列
  if (/\bnx|nubia/i.test(userAgent)) {
    return "努比亚"
  }
  
  // 酷派系列
  if (/coolpad/i.test(userAgent)) {
    return "酷派"
  }
  
  // 锤子科技（坚果手机）
  if (/smartisan|nut/i.test(userAgent)) {
    return "锤子"
  }
  
  // 360手机
  if (/360/i.test(userAgent) && /mobile/i.test(userAgent)) {
    return "360手机"
  }
  
  // 乐视手机
  if (/letv|leeco/i.test(userAgent)) {
    return "乐视"
  }
  
  // 金立手机
  if (/gionee/i.test(userAgent)) {
    return "金立"
  }
  
  // VIVO系列
  if (/vivo|iqoo|v\d{4}[a-z]*/i.test(userAgent)) {
    return "VIVO"
  }

  // 小米系列（包括Redmi红米）
  if (/\bmi\b|redmi|miui|xiaomi|2\d{4}[a-z0-9]+/i.test(userAgent)) {
    return "小米"
  }
  
  // 如果是Android但没有匹配到具体品牌
  if (/android/i.test(userAgent)) {
    return "其他"
  }
  
  // 如果都没有匹配到
  return "其他"
}


/**
 * 处理通用字段复制
 */
function handleGeneralField(item) {
  const tempWeSystem = item.weDeviceName
  const tempDeviceName = getPhoneBrandFromBrowserInfo(item.weBrowserInfo) || "其他"
  return {
    weAccessAddress: item.weAccessAddress,
    weBrowserName: item.weBrowserName,
    weBrowserInfo: item.weBrowserInfo, // 添加浏览器信息字段
    weCustomerKey: item.weCustomerKey,
    weDeviceName: tempDeviceName, // item.weDeviceName,
    weFirstStepDay: item.weFirstStepDay,
    weHappenTime: item.weHappenTime,
    weNewStatus: item.weNewStatus,
    weOs: item.weOs,
    wePagePath: item.wePagePath,
    wePageTitle: item.wePageTitle,
    wePath: item.wePath,
    wePlatform: item.wePlatform,
    weRelationField: item.weRelationField,
    weRelationPointId: item.weRelationPointId,
    weRemark: item.weRemark,
    weSystem: tempWeSystem,
    weUserId: item.weUserId,
    weNickname: item.weNickname,
    weUserLabel: item.weUserLabel,
    weUserType: item.weUserType,
    weWebsitSource: item.weWebsitSource
  }
}


const handleEventData = function () {
    return async function (ctx, next) {
        const { host, url, query } = ctx

        try {
          // 如果是埋点的上报接口，则对数据进行处理
          if (url.indexOf("/wfEvent/upEvents") !== -1) {
            let req = ctx.request.body.data

            // 本地上报，就无需处理了
            // if (host === '127.0.0.1:9011') {
            //   await next();
            //   return
            // }

            let params;
            if (req) {
                params = Utils.logParseJson(req)
            } else {
                params = Utils.logParseJson(ctx.request.body)
            }
            let pointListForProjectId = global.eventInfo.pointListForProjectId
            let functionListForCache = global.centerInfo.functionListForCache

            if (pointListForProjectId) {
              const pointListForProjectIdObj = JSON.parse(pointListForProjectId)
              // 遍历params，对每个元素的projectId进行处理
              for (let i = 0; i < params.length; i++) {
                let item = params[i]
                let projectId = item.projectId
                let currentPointId = item.pointId
                let currentFunctionCode = item.glFunctionCode
                let projectCode = ""
                if (pointListForProjectIdObj[projectId]) {
                  projectCode = pointListForProjectIdObj[projectId].projectCode
                } else {
                  // console.log("pointListForProjectIdObj[projectId]不存在", projectId)x/
                }
                if (pointListForProjectIdObj[projectId]) {
                  // 获取内存里浏览记录的点位ID
                  let pvPointId = pointListForProjectIdObj[projectId].BrowsingHistoryPointId
                  // 获取内存里点击量的点位ID
                  let clickPointId = pointListForProjectIdObj[projectId].HeatMapClickPointId
                  // 获取内存里功能事件的点位ID
                  let functionEventPointId = pointListForProjectIdObj[projectId].GeneralFunctionEvent
                  // 获取内存里访问总量事件的点位ID
                  let generalAccessTotalPointId = pointListForProjectIdObj[projectId].GeneralAccessTotal

                  if ((functionEventPointId && functionEventPointId + "" === currentPointId + "") || (generalAccessTotalPointId && generalAccessTotalPointId + "" === currentPointId + "")) {
                    // 如果是功能事件和访问总量事件，则跳过下方逻辑
                    // 本地上报，就无需处理了
                    if (host === '127.0.0.1:9011') {
                      continue
                    }
                  }

                  // 组合通用字段
                  let generalFields = handleGeneralField(item)

                  // 来源点位类型
                  let sourcePointType = ""
                  let isContainFunction = false
                  let chooseFunction = {}
                  // 相等则说明是pv点，需要将pv点替换为当前点
                  if (pvPointId && pvPointId + "" === currentPointId + "") {
                    sourcePointType = "BrowsingHistoryPointId"
                    const pagePath = Utils.b64DecodeUnicode(item.wePath)
                    const accessAddress = Utils.b64DecodeUnicode(item.weAccessAddress)
                    // 遍历functionListForCache, 如果pagePath包含functionListForCache某个元素的functionCode，则说明是功能点
                    for (let j = 0; j < functionListForCache.length; j++) {
                      let functionItem = functionListForCache[j]
                      
                      const tempEventProjectId = functionItem.eventProjectId.replace("_pro", "")
                      const tempProjectId = projectId.replace("_pro", "")
                      if (tempEventProjectId !== tempProjectId) {
                        // 如果不是同一个项目，则跳过
                        continue
                      }
                      
                      if (functionItem.appCode === "oa") {
                        const tempHost = "https://oaweb.inovance.com"
                        const accessAddressUrl = accessAddress.replace(tempHost, "")
                        const accessPath = accessAddressUrl.split("?")[0]
                        const accessPathQs = Utils.parseQs(accessAddressUrl)

                        const functionCodePath = functionItem.functionCode.split("?")[0]
                        const functionCodePathQs = Utils.parseQs(functionItem.functionCode)

                        if (accessAddress.toLowerCase().includes(".do") && accessPathQs.method && accessPathQs.fdTemplateId && accessPath === functionCodePath && accessPathQs.method === functionCodePathQs.method && accessPathQs.fdTemplateId === functionCodePathQs.fdTemplateId) {
                          isContainFunction = true
                          chooseFunction = functionItem
                        } else if (accessAddress.includes(functionItem.functionCode)) {
                          isContainFunction = true
                          chooseFunction = functionItem
                        }
                      } else {
                        if (pagePath.endsWith(functionItem.functionCode)) {
                          isContainFunction = true
                          chooseFunction = functionItem
                        }
                      }
                    }
                  }

                   // 如果是点击事件
                   let tempFunctionName = ""
                   if (clickPointId && clickPointId + "" === currentPointId + "") {
                     sourcePointType = "HeatMapClickPointId"
                     tempFunctionName = ""
                   }
                   if (functionEventPointId && functionEventPointId + "" === currentPointId + "") {
                    sourcePointType = "GeneralFunctionEvent"
                    tempFunctionName = item.glFunctionName || ""
                   }

                  // 相等则说明是pv点，需要将pv点替换为当前点
                  if (pvPointId && pvPointId + "" === currentPointId + "" || clickPointId && clickPointId + "" === currentPointId + "") {
                    let newPoint = {
                      projectId: projectId,
                      pointId: pointListForProjectIdObj[projectId].GeneralFunctionEvent,
                      glAppCode: Utils.b64EncodeUnicode(projectCode), // 应用编码 | 类型：文本 | 长度：300 | 描述：应用编码
                      glAppName: Utils.b64EncodeUnicode(pointListForProjectIdObj[projectId].projectName), // 应用名称 | 类型：文本 | 长度：300 | 描述：应用名称
                      glUserCode: Utils.b64EncodeUnicode(item.weUserId), // 用户编码 | 类型：文本 | 长度：300 | 描述：用户编码

                      ...generalFields
                    }
                    // 组合功能事件的逻辑
                    if (isContainFunction === true) {
                      tempFunctionName = Utils.b64EncodeUnicode(chooseFunction.functionName)
                      // 组合一个新的点位:功能事件
                      newPoint = {
                        ...newPoint,
                        glFunctionName: Utils.b64EncodeUnicode(chooseFunction.functionName), // 功能名称 | 类型：文本 | 长度：300 | 描述：功能名称
                        glFunctionCode: Utils.b64EncodeUnicode(chooseFunction.functionCode), // 保存功能编码
                      }
                    } else {
                      newPoint = {
                        ...newPoint,
                        glFunctionName: Utils.b64EncodeUnicode('-'), // 功能名称 | 类型：文本 | 长度：300 | 描述：功能名称
                        glFunctionCode: ""
                      }
                    }

                    // 对newPoint应用浏览器信息解码逻辑
                    if (newPoint.weBrowserInfo) {
                      newPoint.weBrowserInfo = Utils.b64DecodeUnicode(newPoint.weBrowserInfo)
                      newPoint.wePlatform = getPlatformFromBrowserInfo(newPoint.weBrowserInfo)
                    }

                    if (isContainFunction === true || clickPointId && clickPointId + "" === currentPointId + "") {
                      // 添加到批量上报队列，而不是立即上报
                      addPointToBatch(newPoint)
                    }
                  }

                  // 组合访问总量的逻辑
                  if (pvPointId && pvPointId + "" === currentPointId + "" || clickPointId && clickPointId + "" === currentPointId + "" || functionEventPointId && functionEventPointId + "" === currentPointId + "") {
                    let newPointForAccessTotal = {
                      projectId: projectId,
                      pointId: pointListForProjectIdObj[projectId].GeneralAccessTotal,
                      glAccessPath: item.wePath, // 访问路径 | 类型：文本 | 长度：300 | 描述：访问路径
                      glMenuName: Utils.b64EncodeUnicode(chooseFunction.functionName || ""), // 菜单名称
                      glFunctionCode: Utils.b64EncodeUnicode(chooseFunction.functionCode || ""), // 功能编码 | 类型：文本 | 长度：300 | 描述：功能编码
                      glFunctionName: tempFunctionName, // 功能名称 | 类型：文本 | 长度：300 | 描述：功能名称
                      glAppCode: Utils.b64EncodeUnicode(projectCode || ""), // 应用编码 | 类型：文本 | 长度：300 | 描述：应用编码
                      glAppName: Utils.b64EncodeUnicode(pointListForProjectIdObj[projectId].projectName || ""), // 应用名称 | 类型：文本 | 长度：300 | 描述：应用名称
                      glUserCode: item.weUserId || "", // 用户编码 | 类型：文本 | 长度：300 | 描述：用户编码
                      glUserNickname: item.weNickname || "", // 用户名称 | 类型：文本 | 长度：300 | 描述：用户名称
                      glOriginPointId: Utils.b64EncodeUnicode(sourcePointType || ""), // 来源点位ID | 类型：文本 | 长度：300 | 描述：来源点位ID

                      ...generalFields
                    }

                    // 对newPointForAccessTotal应用浏览器信息解码逻辑
                    if (newPointForAccessTotal.weBrowserInfo) {
                      // newPointForAccessTotal.weBrowserInfo = Utils.b64DecodeUnicode(newPointForAccessTotal.weBrowserInfo)
                      // newPointForAccessTotal.wePlatform = getPlatformFromBrowserInfo(newPointForAccessTotal.weBrowserInfo)

                      const tempBrowserInfo = newPointForAccessTotal.weBrowserInfo
                      newPointForAccessTotal.weRemark = newPointForAccessTotal.weBrowserInfo || ""
                      newPointForAccessTotal.weSystem = getDeviceInfo(newPointForAccessTotal.weDeviceName, tempBrowserInfo) // 单独判断手机型号
                      newPointForAccessTotal.weDeviceName = getPhoneBrandFromBrowserInfo(tempBrowserInfo) || "其他"
                      newPointForAccessTotal.weBrowserInfo = Utils.b64DecodeUnicode(tempBrowserInfo)
                      newPointForAccessTotal.wePlatform = getPlatformFromBrowserInfo(tempBrowserInfo)
                      if (newPointForAccessTotal.weBrowserName.indexOf("unknown") !== -1) {
                        // 如果浏览器名称是unknown,则重新判断一次
                        newPointForAccessTotal.weBrowserName = getBrowserInfo(tempBrowserInfo).browserName
                      }

                    }
                    // 添加到批量上报队列，而不是立即上报
                    addPointToBatch(newPointForAccessTotal)
                  }

                  
                }
              }
            }

            // 处理params中weBrowserInfo的解码
            for (let i = 0; i < params.length; i++) {
              let item = params[i]
              if (item.weBrowserInfo) {
                const tempBrowserInfo = item.weBrowserInfo
                item.weRemark = item.weBrowserInfo || ""
                item.weSystem = getDeviceInfo(item.weDeviceName, tempBrowserInfo) // 单独判断手机型号
                item.weDeviceName = getPhoneBrandFromBrowserInfo(tempBrowserInfo) || "其他"
                item.weBrowserInfo = Utils.b64DecodeUnicode(tempBrowserInfo)
                item.wePlatform = getPlatformFromBrowserInfo(tempBrowserInfo)
                if (item.weBrowserName.indexOf("unknown") !== -1) {
                  // 如果浏览器名称是unknown,则重新判断一次
                  item.weBrowserName = getBrowserInfo(tempBrowserInfo).browserName
                }
              } else {
                item.wePlatform = "浏览器端"
                item.weSystem = "其他"
                item.weDeviceName = "其他"
              }
            }
            ctx.request.body.data = params

          }
        } catch (error) {
          console.error("handleEventData error", error)
        }


        try {
          // 如果是埋点的上报接口，则对数据进行处理
          if (url.indexOf("/wfMonitor/upLogs") !== -1) {
            let req = ctx.request.body.data
            let params;
            if (req) {
                params = Utils.logParseJson(req)
            } else {
                params = Utils.logParseJson(ctx.request.body)
            }

            // 处理params中weBrowserInfo的解码
            for (let i = 0; i < params.length; i++) {
              let item = params[i]
              if (item.uploadType === "HTTP_LOG" || item.uploadType === "JS_ERROR") {
                const tempBrowserInfo = Utils.b64DecodeUnicode(Utils.b64DecodeUnicode(item.browserInfo))
                item.platform = Utils.b64EncodeUnicode(getPlatformFromBrowserInfo(tempBrowserInfo) || "浏览器端")
                if (!item.browserName) {
                  const { browserName, browserVersion } = getBrowserInfo(tempBrowserInfo)
                  item.browserName = Utils.b64EncodeUnicode(browserName)
                  item.browserVersion = Utils.b64EncodeUnicode(browserVersion)
                }
              }
              if (!item.platform) {
                item.platform = Utils.b64EncodeUnicode("浏览器端")
              }
            }
            ctx.request.body.data = params
          }
        } catch (error) {
          console.error("handleEventData upLogs error", error)
        }
        await next();
    }
}

// 导出中间件函数和工具函数
module.exports = handleEventData
module.exports.getPhoneBrandFromBrowserInfo = getPhoneBrandFromBrowserInfo
module.exports.getBrowserInfo = getBrowserInfo
module.exports.getPlatformFromBrowserInfo = getPlatformFromBrowserInfo
