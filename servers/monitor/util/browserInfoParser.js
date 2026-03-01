/**
 * browserInfo 解析工具
 * 用于从 User Agent 中解析设备品牌、设备名称、操作系统、浏览器名称等信息
 */

/**
 * 爬虫匹配规则列表
 */
const SPIDER_PATTERNS = [
  { pattern: /baiduspider(-render)?\/?([\d.]+)?/i, name: "百度爬虫" },
  { pattern: /bytespider\/?([\d.]+)?/i, name: "字节跳动爬虫" },
  { pattern: /googlebot\/?([\d.]+)?/i, name: "谷歌爬虫" },
  { pattern: /bingbot\/?([\d.]+)?/i, name: "必应爬虫" },
  { pattern: /applebot\/?([\d.]+)?/i, name: "苹果爬虫" },
  { pattern: /slurp\/?([\d.]+)?/i, name: "雅虎爬虫" },
  { pattern: /sosowebspider\/?([\d.]+)?/i, name: "搜搜爬虫" },
  { pattern: /sogou\s+web\s+spider\/?([\d.]+)?/i, name: "搜狗爬虫" },
  { pattern: /360spider\/?([\d.]+)?/i, name: "360爬虫" },
  { pattern: /yisouspider\/?([\d.]+)?/i, name: "神马搜索爬虫" },
  { pattern: /yandexbot\/?([\d.]+)?/i, name: "Yandex爬虫" },
  { pattern: /ahrefsbot\/?([\d.]+)?/i, name: "Ahrefs爬虫" },
  { pattern: /bitsightbot\/?([\d.]+)?/i, name: "BitSight爬虫" },
  { pattern: /claudebot\/?([\d.]+)?/i, name: "Claude爬虫" },
  { pattern: /facebookexternalhit\/?([\d.]+)?/i, name: "Facebook爬虫" },
  { pattern: /twitterbot\/?([\d.]+)?/i, name: "Twitter爬虫" },
  { pattern: /linkedinbot\/?([\d.]+)?/i, name: "LinkedIn爬虫" },
  { pattern: /(spider|crawler|bot)\/?[\d.]*?/i, name: "爬虫" }
]

/**
 * 检测是否为爬虫
 * @param {string} userAgent - User Agent 字符串
 * @returns {object|null} 匹配的爬虫信息，包含 name 和 version
 */
function detectSpider(userAgent) {
  if (!userAgent) return null
  
  const agent = userAgent.toLowerCase()
  
  for (let spiderPattern of SPIDER_PATTERNS) {
    const spiderMatch = agent.match(spiderPattern.pattern)
    if (spiderMatch) {
      let version = spiderMatch[2] || spiderMatch[1] || ""
      if (!version && spiderMatch[0]) {
        const versionMatch = spiderMatch[0].match(/([\d.]+)/)
        version = versionMatch ? versionMatch[1] : ""
      }
      return { name: spiderPattern.name, version }
    }
  }
  
  return null
}

/**
 * 根据浏览器信息判断设备品牌
 * @param {string} browserInfo - 浏览器信息（User Agent）
 * @returns {string} 设备品牌或系统名称
 */
function getPhoneBrandFromBrowserInfo(browserInfo) {
  if (!browserInfo) {
    return "未知"
  }
  
  const userAgent = browserInfo.toLowerCase()

  // 先判断是否是桌面端系统
  const isDesktop = /(windows nt|macintosh|mac os x|linux.*x86|linux.*x64)/i.test(userAgent) && 
                   !/android|mobile/i.test(userAgent)
  
  if (isDesktop) {
    // 桌面端系统 - 尝试识别品牌或返回系统名称
    
    // Apple Mac系列
    if (/macintosh|mac os x/i.test(userAgent)) {
      return "Apple"
    }
    
    // Windows系统 - 尝试识别品牌（通常UA中无法识别，返回系统名称）
    if (/windows nt/i.test(userAgent)) {
      // 尝试识别一些可能的品牌标识
      if (/lenovo/i.test(userAgent)) {
        return "联想"
      }
      if (/dell/i.test(userAgent)) {
        return "戴尔"
      }
      if (/hp|hewlett/i.test(userAgent)) {
        return "惠普"
      }
      if (/asus/i.test(userAgent)) {
        return "华硕"
      }
      if (/acer/i.test(userAgent)) {
        return "宏碁"
      }
      if (/surface/i.test(userAgent)) {
        return "微软"
      }
      if (/thinkpad/i.test(userAgent)) {
        return "联想"
      }
      if (/huawei|matebook/i.test(userAgent)) {
        return "华为"
      }
      if (/xiaomi/i.test(userAgent)) {
        return "小米"
      }
      if (/honor/i.test(userAgent)) {
        return "荣耀"
      }
      // 无法识别具体品牌，返回系统名称
      return "Windows"
    }
    
    // Chrome OS - 需要单独检测，因为 Chrome OS 的 UA 不包含 "linux"
    if (/cros/i.test(userAgent)) {
      // Chrome OS 设备的 UA 中通常不包含品牌信息，但尝试识别一些可能的品牌
      // 注意：大多数 Chromebook 的 UA 中不包含品牌，所以通常返回 "Chrome OS"
      const uaUpper = browserInfo.toUpperCase()
      if (/ACER|CHROMEBOOK.*ACER/i.test(uaUpper)) {
        return "宏碁"
      }
      if (/ASUS|CHROMEBOOK.*ASUS/i.test(uaUpper)) {
        return "华硕"
      }
      if (/DELL|CHROMEBOOK.*DELL/i.test(uaUpper)) {
        return "戴尔"
      }
      if (/HP|HEWLETT|CHROMEBOOK.*HP/i.test(uaUpper)) {
        return "惠普"
      }
      if (/LENOVO|CHROMEBOOK.*LENOVO/i.test(uaUpper)) {
        return "联想"
      }
      if (/SAMSUNG|CHROMEBOOK.*SAMSUNG/i.test(uaUpper)) {
        return "三星"
      }
      if (/TOSHIBA|CHROMEBOOK.*TOSHIBA/i.test(uaUpper)) {
        return "东芝"
      }
      // 大多数情况下，Chrome OS 设备的 UA 中不包含品牌信息
      // 返回 "Chrome OS" 作为统一的品牌标识
      return "Chrome OS"
    }
    
    // Linux系统
    if (/linux/i.test(userAgent) && !/android/i.test(userAgent)) {
      // 统信 UOS（国产操作系统）
      if (/uos/i.test(userAgent)) {
        return "统信"
      }
      // Ubuntu
      if (/ubuntu/i.test(userAgent)) {
        return "Ubuntu"
      }
      // Fedora
      if (/fedora/i.test(userAgent)) {
        return "Fedora"
      }
      // 通用Linux
      return "Linux"
    }
    
    return "PC"
  }
  
  // iPhone系列
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "Apple"
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
  
  // 一加系列
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
    return "Android"
  }
  
  // 如果都没有匹配到
  return "其他"
}

/**
 * 根据浏览器信息获取设备名称
 * @param {string} browserInfo - 浏览器信息（User Agent）
 * @param {string} originDeviceName - 原始设备名称
 * @returns {string} 设备名称
 */
function getDeviceNameFromBrowserInfo(browserInfo, originDeviceName) {
  if (!browserInfo) {
    return originDeviceName || "未知"
  }

  const ua = browserInfo
  const agent = ua.toLowerCase()

  // 爬虫检测
  const spider = detectSpider(agent)
  if (spider) {
    return spider.name
  }

  // 如果原始设备名称有效，直接返回
  if (originDeviceName && originDeviceName !== "undefined" && originDeviceName !== "PC" && originDeviceName.trim() !== "") {
    return originDeviceName
  }

  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/)
  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  const iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
  const mobileInfo = ua.match(/Android\s[\S\s]+Build\//)

  // iOS设备
  if (iphone) {
    return "iPhone"
  }
  if (ipad) {
    return "iPad"
  }

  // Android设备
  if (android) {
    let deviceName = ""
    
    // 方法1：处理现代格式
    const modernAndroidMatch = ua.match(/\(Linux;\s*Android\s+[\d.]+;\s*([^)]+)\)/i)
    if (modernAndroidMatch && modernAndroidMatch[1]) {
      deviceName = modernAndroidMatch[1].trim()
      deviceName = deviceName.replace(/;\s*wv$/, '').trim()
    }
    
    // 方法2：尝试Build格式
    if (!deviceName && mobileInfo) {
      const info = mobileInfo[0]
      const dNameArr = info.split(';')
      for (let i = 0; i < dNameArr.length; i++) {
        if (dNameArr[i].indexOf('Build') !== -1) {
          deviceName = dNameArr[i].replace(/Build\//g, '')
          break
        }
      }
      if (deviceName === '' && dNameArr.length > 1) {
        deviceName = dNameArr[1]
      }
    }
    
    // 方法3：其他Android格式
    if (!deviceName) {
      const otherAndroidMatch = ua.match(/Android[\s\/][\d.]+[;\s]+([^;)]+)/i)
      if (otherAndroidMatch && otherAndroidMatch[1]) {
        deviceName = otherAndroidMatch[1].trim()
      }
    }
    
    // 清理设备名称
    if (deviceName) {
      deviceName = deviceName.replace(/(^\s*)|(\s*$)/g, '')
      deviceName = deviceName.replace(/Build\//g, '')
      deviceName = deviceName.replace(/;\s*wv$/, '')
    }
    
    return deviceName || "Android"
  }

  // 桌面端
  if (/(windows nt|macintosh|mac os x|linux)/i.test(agent) && !/android|mobile/i.test(agent)) {
    return "PC"
  }

  return originDeviceName || "未知"
}

/**
 * 根据浏览器信息获取操作系统和版本号
 * @param {string} browserInfo - 浏览器信息(User Agent)
 * @param {string} originOs - 原始操作系统
 * @param {string} originOsVersion - 原始操作系统版本
 * @returns {object} { os: 操作系统名称, osVersion: 版本号 }
 */
function getOsFromBrowserInfo(browserInfo, originOs, originOsVersion) {
  if (!browserInfo) {
    return { os: originOs || "未知", osVersion: originOsVersion || "" }
  }

  const ua = browserInfo
  const agent = ua.toLowerCase()

  // 爬虫检测
  const spider = detectSpider(agent)
  if (spider) {
    return { os: spider.name, osVersion: spider.version }
  }

  // 如果原始os有效且不是web,直接返回
  if (originOs && originOs !== "web" && originOs.trim() !== "" && originOsVersion && originOsVersion.trim() !== "") {
    return { os: originOs, osVersion: originOsVersion || "" }
  }

  // iOS
  const iosMatch = ua.match(/(iPhone|iPad|iPod).*?(?:iPhone\s+)?OS\s+([\d_]+)/i)
  if (iosMatch) {
    const version = iosMatch[2].replace(/_/g, '.')
    return { os: "iOS", osVersion: version }
  }

  // Android
  const androidMatch = ua.match(/Android\s([\d.]+)/i)
  if (androidMatch) {
    return { os: "Android", osVersion: androidMatch[1] }
  }

  // Windows
  const windowsMatch = ua.match(/Windows NT ([\d.]+)/i)
  if (windowsMatch) {
    const versionMap = {
      '10.0': '10/11',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.1': 'XP',
      '5.0': '2000'
    }
    const version = versionMap[windowsMatch[1]] || windowsMatch[1]
    return { os: "Windows", osVersion: version }
  }

  // macOS
  const macMatch = ua.match(/Mac OS X ([\d_]+)/i)
  if (macMatch) {
    const version = macMatch[1].replace(/_/g, '.')
    return { os: "macOS", osVersion: version }
  }

  // Chrome OS
  const chromeOSMatch = ua.match(/CrOS\s+(?:x86_64|armv7l|aarch64)\s+([\d.]+)/i)
  if (chromeOSMatch) {
    return { os: "Chrome OS", osVersion: chromeOSMatch[1] }
  }

  // 统信 UOS（国产操作系统）
  const uosMatch = ua.match(/UOS\s+(?:Professional|Desktop|Server|Enterprise)?/i)
  if (uosMatch) {
    // 尝试提取版本信息，UOS UA 中可能包含版本号
    const uosVersionMatch = ua.match(/UOS\s+(?:Professional|Desktop|Server|Enterprise)\s*([\d.]+)?/i)
    const version = uosVersionMatch && uosVersionMatch[1] ? uosVersionMatch[1] : ""
    // 如果没有版本号，尝试提取类型（Professional/Desktop/Server/Enterprise）
    if (!version && uosMatch[0]) {
      const typeMatch = uosMatch[0].match(/(Professional|Desktop|Server|Enterprise)/i)
      return { os: "统信 UOS", osVersion: typeMatch ? typeMatch[1] : "" }
    }
    return { os: "统信 UOS", osVersion: version }
  }

  // Linux
  if (/linux/i.test(agent) && !/android/i.test(agent)) {
    return { os: "Linux", osVersion: "" }
  }

  return { os: originOs || "未知", osVersion: originOsVersion || "" }
}

/**
 * 根据浏览器信息获取浏览器名称和版本
 * @param {string} browserInfo - 浏览器信息（User Agent）
 * @param {string} originBrowserName - 原始浏览器名称
 * @param {string} originBrowserVersion - 原始浏览器版本
 * @returns {object} { browserName, browserVersion }
 */
function getBrowserInfoFromUA(browserInfo, originBrowserName, originBrowserVersion) {
  if (!browserInfo) {
    return { browserName: originBrowserName || "未知", browserVersion: originBrowserVersion || "" }
  }

  const agent = browserInfo.toLowerCase()

  // 爬虫检测 - 优先检测爬虫
  const spider = detectSpider(agent)
  if (spider) {
    return { browserName: spider.name, browserVersion: spider.version }
  }

  // 如果原始浏览器名称有效，直接返回
  if (originBrowserName && originBrowserName !== "其他" && originBrowserName !== "undefined" && originBrowserName.trim() !== "") {
    return { browserName: originBrowserName, browserVersion: originBrowserVersion || "" }
  }

  let browserName = "未知"
  let browserVersion = ""

  // 微信浏览器
  if (agent.indexOf("micromessenger") > 0) {
    const wechatMatch = agent.match(/micromessenger\/([\d.]+)/i)
    browserName = "微信"
    browserVersion = wechatMatch && wechatMatch[1] ? wechatMatch[1] : ""
  }
  // QQ浏览器
  else if (agent.indexOf("mqqbrowser") > 0) {
    const qqMatch = agent.match(/mqqbrowser\/([\d.]+)/i)
    browserName = "QQ"
    browserVersion = qqMatch && qqMatch[1] ? qqMatch[1] : ""
  }
  // UC浏览器
  else if (agent.indexOf("ucbrowser") > 0 || agent.indexOf("ubrowser") > 0) {
    const ucMatch = agent.match(/u?c?browser\/([\d.]+)/i)
    browserName = "UC"
    browserVersion = ucMatch && ucMatch[1] ? ucMatch[1] : ""
  }
  // 百度浏览器
  else if (agent.indexOf("baidubrowser") > 0) {
    const baiduMatch = agent.match(/baidubrowser\/([\d.]+)/i)
    browserName = "百度"
    browserVersion = baiduMatch && baiduMatch[1] ? baiduMatch[1] : ""
  }
  // 支付宝内置浏览器
  else if (agent.indexOf("alipayclient") > 0 || agent.indexOf("alipay") > 0) {
    const alipayMatch = agent.match(/alipay(?:client)?\/([\d.]+)/i)
    browserName = "支付宝"
    browserVersion = alipayMatch && alipayMatch[1] ? alipayMatch[1] : ""
  }
  // 钉钉内置浏览器
  else if (agent.indexOf("dingtalk") > 0) {
    const dingMatch = agent.match(/dingtalk\/([\d.]+)/i)
    browserName = "钉钉"
    browserVersion = dingMatch && dingMatch[1] ? dingMatch[1] : ""
  }
  // 企业微信
  else if (agent.indexOf("wxwork") > 0) {
    const wxworkMatch = agent.match(/wxwork\/([\d.]+)/i)
    browserName = "企业微信"
    browserVersion = wxworkMatch && wxworkMatch[1] ? wxworkMatch[1] : ""
  }
  // 小程序WebView
  else if (agent.indexOf("miniprogram") > 0) {
    browserName = "小程序"
    browserVersion = ""
  }
  // iOS 第三方应用（需要在 Safari 检测之前）
  else if (agent.indexOf("twitter") > 0) {
    const twitterMatch = agent.match(/twitter\s+for\s+(?:iphone|ipad)\/([\d.]+)/i)
    browserName = "Twitter"
    browserVersion = twitterMatch && twitterMatch[1] ? twitterMatch[1] : ""
  }
  else if (agent.indexOf("facebook") > 0 && agent.indexOf("fban") > 0) {
    const fbMatch = agent.match(/fban\/([\d.]+)/i) || agent.match(/fbios\/([\d.]+)/i)
    browserName = "Facebook"
    browserVersion = fbMatch && fbMatch[1] ? fbMatch[1] : ""
  }
  else if (agent.indexOf("instagram") > 0) {
    const instagramMatch = agent.match(/instagram\s*([\d.]+)/i)
    browserName = "Instagram"
    browserVersion = instagramMatch && instagramMatch[1] ? instagramMatch[1] : ""
  }
  else if (agent.indexOf("linkedinapp") > 0) {
    const linkedinMatch = agent.match(/linkedinapp\/([\d.]+)/i)
    browserName = "LinkedIn"
    browserVersion = linkedinMatch && linkedinMatch[1] ? linkedinMatch[1] : ""
  }
  else if (agent.indexOf("line") > 0 && agent.indexOf("line/") > 0) {
    const lineMatch = agent.match(/line\/([\d.]+)/i)
    browserName = "Line"
    browserVersion = lineMatch && lineMatch[1] ? lineMatch[1] : ""
  }
  else if (agent.indexOf("weibo") > 0) {
    const weiboMatch = agent.match(/weibo\s*([\d.]+)/i) || agent.match(/weibo__([\d.]+)/i)
    browserName = "微博"
    browserVersion = weiboMatch && weiboMatch[1] ? weiboMatch[1] : ""
  }
  else if (agent.indexOf("youtube") > 0) {
    const youtubeMatch = agent.match(/youtube\/([\d.]+)/i)
    browserName = "YouTube"
    browserVersion = youtubeMatch && youtubeMatch[1] ? youtubeMatch[1] : ""
  }
  else if (agent.indexOf("tiktok") > 0) {
    const tiktokMatch = agent.match(/tiktok\/([\d.]+)/i)
    browserName = "TikTok"
    browserVersion = tiktokMatch && tiktokMatch[1] ? tiktokMatch[1] : ""
  }
  // IE
  else if (agent.indexOf("msie") > 0) {
    const ieMatch = agent.match(/msie ([\d.]+)/i)
    browserName = "ie"
    browserVersion = ieMatch && ieMatch[1] ? ieMatch[1].replace(';', '') : ""
  }
  // Edge
  else if (agent.indexOf("edg") > 0) {
    const edgeMatch = agent.match(/edg\/([\d.]+)/i)
    browserName = "edge"
    browserVersion = edgeMatch && edgeMatch[1] ? edgeMatch[1] : ""
  }
  // Firefox
  else if (agent.indexOf("firefox") > 0) {
    const ffMatch = agent.match(/firefox\/([\d.]+)/i)
    browserName = "firefox"
    browserVersion = ffMatch && ffMatch[1] ? ffMatch[1] : ""
  }
  // Safari (不是Chrome)
  else if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
    const safariMatch = agent.match(/version\/([\d.]+)/i) || agent.match(/safari\/([\d.]+)/i)
    browserName = "safari"
    browserVersion = safariMatch && safariMatch[1] ? safariMatch[1] : ""
  }
  // Chrome
  else if (agent.indexOf("chrome") > 0) {
    const chromeMatch = agent.match(/chrome\/([\d.]+)/i)
    browserName = "chrome"
    browserVersion = chromeMatch && chromeMatch[1] ? chromeMatch[1] : ""
    // 检测360浏览器
    if (agent.indexOf("360se") > 0) {
      const browser360Match = agent.match(/360se\/([\d.]+)/i)
      browserName = "360"
      browserVersion = browser360Match && browser360Match[1] ? browser360Match[1] : browserVersion
    }
  }

  return { browserName, browserVersion }
}

/**
 * 重新解析CUSTOMER_PV日志的browserInfo
 * @param {object} logInfo - 日志对象
 * @param {string} browserInfo - 浏览器UA信息
 * @returns {object} 更新后的logInfo
 */
function parseBrowserInfoForPV(logInfo, browserInfo) {
  if (!browserInfo) {
    return logInfo
  }

  try {
    // 解析手机品牌 deviceBrand
    logInfo.deviceBrand = logInfo.deviceBrand ? logInfo.deviceBrand : getPhoneBrandFromBrowserInfo(browserInfo)

    // 解析设备名称 deviceName
    const originDeviceName = logInfo.deviceName
    if (!originDeviceName || originDeviceName === "undefined" || originDeviceName === "PC" || originDeviceName.trim() === "") {
      logInfo.deviceName = getDeviceNameFromBrowserInfo(browserInfo, originDeviceName)
    }

    // 解析操作系统 os 和 osVersion
    const originOs = logInfo.os
    const originOsVersion = logInfo.osVersion
    if (!originOs || originOs === "web" || originOs.trim() === "" || !originOsVersion || originOsVersion.trim() === "") {
      const { os, osVersion } = getOsFromBrowserInfo(browserInfo, originOs, originOsVersion)
      logInfo.os = os
      logInfo.osVersion = osVersion
    }

    // 解析浏览器名称 browserName 和版本 browserVersion
    const originBrowserName = logInfo.browserName
    const originBrowserVersion = logInfo.browserVersion
    if (!originBrowserName || originBrowserName === "其他" || originBrowserName === "undefined" || originBrowserName.trim() === "") {
      const { browserName, browserVersion } = getBrowserInfoFromUA(browserInfo, originBrowserName, originBrowserVersion)
      logInfo.browserName = browserName
      logInfo.browserVersion = browserVersion
    }
  } catch (e) {
    console.log("parseBrowserInfoForPV error:", e)
  }

  return logInfo
}

module.exports = {
  detectSpider,
  getPhoneBrandFromBrowserInfo,
  getDeviceNameFromBrowserInfo,
  getOsFromBrowserInfo,
  getBrowserInfoFromUA,
  parseBrowserInfoForPV
}
