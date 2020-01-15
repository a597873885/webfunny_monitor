/**
 * 简介
 *
 *
 */
(function (window) {
  /** globe variable **/
  if (!sessionStorage) {
    window.sessionStorage = new Object();
  }
  var
    // 用fetch方式请求接口时，暂存接口url
    fetchHttpUrl = null

    // 自动上传日志记录的定时器
    , webMonitorUploadTimer = null

    // 暂存本地用于保存日志信息的数组
    , uploadMessageArray = null

    // onerror 错误监控启动状态
    ,jsMonitorStarted = false

    // 上传日志的开关，如果为false，则不再上传
    , uploadRemoteServer = true

    // 保存图片对应的描述，同一个描述只保存一次
    , screenShotDescriptions = []

    // 屏幕截图字符串
    , tempScreenShot = ""
    // 获取当前url
    , defaultLocation = window.location.href.split('?')[0].replace('#', '')

    // 停止录屏的方法
    , stopTheVideo = null

    // 页面加载对象属性
    , timingObj = performance && performance.timing

    // 获取页面加载的具体属性
    , resourcesObj = (function() {
      if (performance && typeof performance.getEntries === 'function') {
        return performance.getEntries();
      }
      return null;
    })();

  /** 常量 **/
  var
    // 所属项目ID, 用于替换成相应项目的UUID，生成监控代码的时候搜索替换
    WEB_MONITOR_ID = sessionStorage.CUSTOMER_WEB_MONITOR_ID || "jeffery_webmonitor"

    // 判断是http或是https的项目
    , WEB_HTTP_TYPE = window.location.href.indexOf('https') === -1 ? 'http://' : 'https://'

    // 获取当前页面的URL
    , WEB_LOCATION = window.location.href

    // 本地IP, 用于区分本地开发环境
    , WEB_LOCAL_IP = 'localhost'

    // 应用的主域名, 用于主域名下共享customerKey
    , MAIN_DOMAIN = ''//'&&&webfunny.cn&&&'

    // 监控平台地址
    , WEB_MONITOR_IP = 'localhost:8011'//'&&&www.webfunny.cn&&&'

    // 上传数据的uri, 区分了本地和生产环境
    , HTTP_UPLOAD_URI =  WEB_HTTP_TYPE + WEB_MONITOR_IP

    // 上传数据的接口API
    , HTTP_UPLOAD_LOG_API = '/server/upLog' // '/api/v1/upLog'

    // 上传数据时忽略的uri, 需要过滤掉监控平台上传接口
    , WEB_MONITOR_IGNORE_URL = HTTP_UPLOAD_URI + HTTP_UPLOAD_LOG_API

    // 上传数据的接口
    , HTTP_UPLOAD_LOG_INFO = HTTP_UPLOAD_URI + HTTP_UPLOAD_LOG_API

    // 获取当前项目的参数信息的接口
    , HTTP_PROJECT_INFO = HTTP_UPLOAD_URI + '/server/projectConfig'

    // 上传埋点数据接口
    , HTTP_UPLOAD_RECORD_DATA = HTTP_UPLOAD_URI + ''

    // 用户访问日志类型
    , CUSTOMER_PV = 'CUSTOMER_PV'

    // 用户加载页面信息类型
    , LOAD_PAGE = 'LOAD_PAGE'

    // 接口日志类型
    , HTTP_LOG = 'HTTP_LOG'

    // 接口错误日志类型
    , HTTP_ERROR = 'HTTP_ERROR'

    // js报错日志类型
    , JS_ERROR = 'JS_ERROR'

    // 截屏类型
    , SCREEN_SHOT = 'SCREEN_SHOT'

    // 用户的行为类型
    , ELE_BEHAVIOR = 'ELE_BEHAVIOR'

    // 静态资源类型
    , RESOURCE_LOAD = 'RESOURCE_LOAD'

    // 用户自定义行为类型
    , CUSTOMIZE_BEHAVIOR = 'CUSTOMIZE_BEHAVIOR'

    // 用户录屏事件类型
    , VIDEOS_EVENT = 'VIDEOS_EVENT'

    // 浏览器信息
    , BROWSER_INFO = window.navigator.userAgent

    // 工具类示例化
    , utils = new MonitorUtils()

    // 设备信息
    , DEVICE_INFO = utils.getDevice()

    // 监控代码空构造函数
    , WebMonitor = {}

    // 
    , PV_MSG = ""
    , JSERROR_MSG = ""
    , HTTP_MSG = ""
    , RESOURCE_MSG = ""
    , BEHAVIOR_MSG = ""
    , PAGELOAD_MSG = ""
    , INITUSER_MSG = ""

    // 获取用户自定义信息
    , USER_INFO = localStorage.wmUserInfo ? JSON.parse(localStorage.wmUserInfo) : {}

    // 录屏JSON字符简化
    , JSON_KEY = {"type":"≠","childNodes":"ā","name":"á","id":"ǎ","tagName":"à","attributes":"ē","style":"é","textContent":"ě","isStyle":"è","isSVG":"ī","content":"í","href":"ǐ","src":"ì","class":"ō","tabindex":"ó","aria-label":"ǒ","viewBox":"ò","focusable":"ū","data-icon":"ú","width":"ǔ","height":"ù","fill":"ǖ","aria-hidden":"ǘ","stroke":"ǚ","stroke-width":"ǜ","paint-order":"ü","stroke-opacity":"ê","stroke-dasharray":"ɑ","stroke-linecap":"?","stroke-linejoin":"ń","stroke-miterlimit":"ň","clip-path":"Γ","alignment-baseline":"Δ","fill-opacity":"Θ","transform":"Ξ","text-anchor":"Π","offset":"Σ","stop-color":"Υ","stop-opacity":"Φ"}
    , JSON_CSS_KEY = {"background":"≠","background-attachment":"ā","background-color":"á","background-image":"ǎ","background-position":"à","background-repeat":"ē","background-clip":"é","background-origin":"ě","background-size":"è","border":"Г","border-bottom":"η","color":"┯","style":"Υ","width":"б","border-color":"ū","border-left":"ǚ","border-right":"ň","border-style":"Δ","border-top":"З","border-width":"Ω","outline":"α","outline-color":"β","outline-style":"γ","outline-width":"δ","left-radius":"Ж","right-radius":"И","border-image":"ω","outset":"μ","repeat":"ξ","repeated":"π","rounded":"ρ","stretched":"σ","slice":"υ","source":"ψ","border-radius":"Б","radius":"Д","box-decoration":"Й","break":"К","box-shadow":"Л","overflow-x":"Ф","overflow-y":"У","overflow-style":"Ц","rotation":"Ч","rotation-point":"Щ","opacity":"Ъ","height":"Ы","max-height":"Э","max-width":"Ю","min-height":"Я","min-width":"а","font":"в","font-family":"г","font-size":"ж","adjust":"з","aspect":"и","font-stretch":"й","font-style":"к","font-variant":"л","font-weight":"ф","content":"ц","before":"ч","after":"ш","counter-increment":"щ","counter-reset":"ъ","quotes":"ы","list-style":"+","image":"－","position":"|","type":"┌","margin":"┍","margin-bottom":"┎","margin-left":"┏","margin-right":"┐","margin-top":"┑","padding":"┒","padding-bottom":"┓","padding-left":"—","padding-right":"┄","padding-top":"┈","bottom":"├","clear":"┝","clip":"┞","cursor":"┟","display":"┠","float":"┡","left":"┢","overflow":"┣","right":"┆","top":"┊","vertical-align":"┬","visibility":"┭","z-index":"┮","direction":"┰","letter-spacing":"┱","line-height":"┲","text-align":"6","text-decoration":"┼","text-indent":"┽","text-shadow":"10","text-transform":"┿","unicode-bidi":"╀","white-space":"╂","word-spacing":"╁","hanging-punctuation":"╃","punctuation-trim":"1","last":"3","text-emphasis":"4","text-justify":"5","justify":"7","text-outline":"8","text-overflow":"9","text-wrap":"11","word-break":"12","word-wrap":"13"}

  // 日志基类, 用于其他日志的继承
  function MonitorBaseInfo() {
    this.handleLogInfo = function (type, logInfo) {
      var tempString = localStorage[type] ? localStorage[type] : "";
      switch (type) {
        case ELE_BEHAVIOR:
          localStorage[ELE_BEHAVIOR] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        case JS_ERROR:
          localStorage[JS_ERROR] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        case HTTP_LOG:
          localStorage[HTTP_LOG] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        case SCREEN_SHOT:
          localStorage[SCREEN_SHOT] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        case CUSTOMER_PV:
          localStorage[CUSTOMER_PV] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        case LOAD_PAGE:
          localStorage[LOAD_PAGE] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        case RESOURCE_LOAD:
          localStorage[RESOURCE_LOAD] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        case CUSTOMIZE_BEHAVIOR:
          localStorage[CUSTOMIZE_BEHAVIOR] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        case VIDEOS_EVENT:
          localStorage[VIDEOS_EVENT] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        default: break;
      }
    };
  }
  /**
   * 日志对象的key都跟monitorKeys的缩短key值一一对应，以达到减少日志长度的目的
   */
  // 设置日志对象类的通用属性
  function setCommonProperty() {
    this.happenTime = new Date().getTime(); // 日志发生时间
    this.webMonitorId = WEB_MONITOR_ID;     // 用于区分应用的唯一标识（一个项目对应一个）
    this.simpleUrl =  window.location.href.split('?')[0].replace('#', ''); // 页面的url
    this.completeUrl =  utils.b64EncodeUnicode(encodeURIComponent(window.location.href)); // 页面的完整url
    this.customerKey = utils.getCustomerKey(); // 用于区分用户，所对应唯一的标识，清理本地数据后失效，
    // 用户自定义信息， 由开发者主动传入， 便于对线上问题进行准确定位
    var wmUserInfo = localStorage.wmUserInfo ? JSON.parse(localStorage.wmUserInfo) : "";
    this.userId = utils.b64EncodeUnicode(wmUserInfo.userId || "");
    this.firstUserParam = utils.b64EncodeUnicode(wmUserInfo.firstUserParam || "");
    this.secondUserParam = utils.b64EncodeUnicode(wmUserInfo.secondUserParam || "");
  }
  // 用户访问行为日志(PV)
  function CustomerPV(uploadType, loadType, loadTime, newStatus) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.projectVersion = utils.b64EncodeUnicode(USER_INFO.projectVersion || ""); // 版本号， 用来区分监控应用的版本，更有利于排查问题
    this.pageKey = utils.getPageKey();  // 用于区分页面，所对应唯一的标识，每个新页面对应一个值
    this.deviceName = DEVICE_INFO.deviceName;
    this.os = DEVICE_INFO.os + (DEVICE_INFO.osVersion ? " " + DEVICE_INFO.osVersion : "");
    this.browserName = DEVICE_INFO.browserName;
    this.browserVersion = DEVICE_INFO.browserVersion;
    // TODO 位置信息, 待处理
    this.monitorIp = "";  // 用户的IP地址
    this.country = "china";  // 用户所在国家
    this.province = "";  // 用户所在省份
    this.city = "";  // 用户所在城市
    this.loadType = loadType;  // 用以区分首次加载
    this.loadTime = loadTime; // 加载时间
    this.newStatus = newStatus; // 是否为新用户
  }
  CustomerPV.prototype = new MonitorBaseInfo();
  // 用户加载页面的信息日志
  function LoadPageInfo(uploadType, loadType, loadPage, domReady, redirect, lookupDomain, ttfb, request, loadEvent, appcache, unloadEvent, connect) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.loadType = loadType;
    this.loadPage = loadPage;
    this.domReady = domReady;
    this.redirect = redirect;
    this.lookupDomain = lookupDomain;
    this.ttfb = ttfb;
    this.request = request;
    this.loadEvent = loadEvent;
    this.appcache = appcache;
    this.unloadEvent = unloadEvent;
    this.connect = connect;
  }
  LoadPageInfo.prototype = new MonitorBaseInfo();
  // 用户行为日志，继承于日志基类MonitorBaseInfo
  function BehaviorInfo(uploadType, behaviorType, className, placeholder, inputValue, tagName, innerText) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.behaviorType = behaviorType;
    this.className = utils.b64EncodeUnicode(className);
    this.placeholder = utils.b64EncodeUnicode(placeholder);
    this.inputValue = utils.b64EncodeUnicode(inputValue);
    this.tagName = tagName;
    this.innerText = utils.b64EncodeUnicode(encodeURIComponent(innerText));
  }
  BehaviorInfo.prototype = new MonitorBaseInfo();

  // JS错误日志，继承于日志基类MonitorBaseInfo
  function JavaScriptErrorInfo(uploadType, infoType, errorMsg, errorStack) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.infoType = infoType;
    this.pageKey = utils.getPageKey();  // 用于区分页面，所对应唯一的标识，每个新页面对应一个值
    this.deviceName = DEVICE_INFO.deviceName;
    this.os = DEVICE_INFO.os + (DEVICE_INFO.osVersion ? " " + DEVICE_INFO.osVersion : "");
    this.browserName = DEVICE_INFO.browserName;
    this.browserVersion = DEVICE_INFO.browserVersion;
    // TODO 位置信息, 待处理
    this.monitorIp = "";  // 用户的IP地址
    this.country = "china";  // 用户所在国家
    this.province = "";  // 用户所在省份
    this.city = "";  // 用户所在城市
    this.errorMessage = utils.b64EncodeUnicode(errorMsg)
    this.errorStack = utils.b64EncodeUnicode(errorStack);
    this.browserInfo = "";
  }
  JavaScriptErrorInfo.prototype = new MonitorBaseInfo();

  // 接口请求日志，继承于日志基类MonitorBaseInfo
  function HttpLogInfo(uploadType, simpleUrl, url, status, statusText, statusResult, responseText, currentTime, loadTime) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;  // 上传类型
    this.simpleUrl = simpleUrl;
    this.httpUrl = utils.b64EncodeUnicode(encodeURIComponent(url)); // 请求地址
    this.status = status; // 接口状态
    this.statusText = statusText; // 状态描述
    this.statusResult = statusResult; // 区分发起和返回状态
    this.requestText = ""; // 请求参数的JSON字符串
    this.responseText = utils.b64EncodeUnicode(responseText); // 返回的结果JSON字符串
    this.happenTime = currentTime;  // 客户端发送时间
    this.loadTime = loadTime; // 接口请求耗时
  }
  HttpLogInfo.prototype = new MonitorBaseInfo();

  // JS错误截图，继承于日志基类MonitorBaseInfo
  function ScreenShotInfo(uploadType, des, screenInfo, imgType) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.description = utils.b64EncodeUnicode(des);
    this.screenInfo = screenInfo;
    this.imgType = imgType || "jpeg";
  }
  ScreenShotInfo.prototype = new MonitorBaseInfo();

  // 页面静态资源加载错误统计，继承于日志基类MonitorBaseInfo
  function ResourceLoadInfo(uploadType, url, elementType, status) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.elementType = elementType;
    this.sourceUrl = utils.b64EncodeUnicode(encodeURIComponent(url));
    this.status = status;  // 资源加载状态： 0/失败、1/成功
  }
  ResourceLoadInfo.prototype = new MonitorBaseInfo();

  // 上传拓展日志信息的入口
  function ExtendBehaviorInfo(userId, behaviorType, behaviorResult, uploadType, description) {
    this.userId = userId;
    this.behaviorType = behaviorType;
    this.behaviorResult = behaviorResult;
    this.uploadType = uploadType;
    this.description = description;
    this.happenTime = new Date().getTime(); // 日志发生时间
  }
  ExtendBehaviorInfo.prototype = new MonitorBaseInfo();

  // 上传拓展日志信息的入口
  function VideosInfo(uploadType, event) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.event = event;
  }
  VideosInfo.prototype = new MonitorBaseInfo();
  /**
   * 监控初始化配置, 以及启动的方法
   */
  function init() {
    try {
      // 启动监控
      recordPV();
      PV_MSG = "启动...";
      recordResourceError();
      RESOURCE_MSG = "启动...";
      recordLoadPage();
      PAGELOAD_MSG = "启动...";
      recordBehavior({record: 1});
      BEHAVIOR_MSG = "启动...";
      recordJavaScriptError();
      JSERROR_MSG = "启动...";
      recordHttpLog();
      HTTP_MSG = "启动...";
      checkTheVideo();

      /**
       * 添加一个定时器，进行数据的上传
       * 200毫秒钟进行一次URL是否变化的检测
       * 8秒钟进行一次数据的检查并上传; PS: 这个时间有可能跟后台服务的并发量有着直接关系，谨慎设置
       */
      var timeCount = 0;
      var waitTimes = 0;
      var typeList = [ELE_BEHAVIOR, JS_ERROR, HTTP_LOG, SCREEN_SHOT, CUSTOMER_PV, LOAD_PAGE, RESOURCE_LOAD, CUSTOMIZE_BEHAVIOR, VIDEOS_EVENT]
      setInterval(function () {
        checkUrlChange();
        // 进行一次上传
        if (timeCount >= 40) {
          // 如果是本地的localhost, 就忽略，不进行上传
          // if (window.location.href.indexOf("localhost") != -1) return;
          var logInfo = "";
          for (var i = 0; i < typeList.length; i ++) {
            logInfo += (localStorage[typeList[i]] || "");
          }
          // 收集到日志的数量如果小于10，则不进行上传，减少后台服务短时间内的并发量。
          // 如果，经过3次判断还没有收集到10个日志，则进行上传
          // 风险：有可能会丢失掉用户最后一段时间的操作信息，如果，最后几步操作信息很重要，可以选择删除这段逻辑
          var logInfoCount = logInfo.split("$$$").length;
          if (logInfoCount < 10 && waitTimes < 1) {
            waitTimes ++;
            timeCount = 0;
            return;
          }
          waitTimes = 0;

          logInfo.length > 0 && utils.ajax("POST", HTTP_UPLOAD_LOG_INFO, {logInfo: logInfo}, function (res) {
            for (var i = 0; i < typeList.length; i ++) {
              localStorage[typeList[i]] = "";
            }
            localStorage.debugConnectStatus = res.data == "c" ? "connected" : "disconnect";
          }, function () { // 如果失败了， 也需要清理掉本地缓存， 否则会积累太多
            for (var i = 0; i < typeList.length; i ++) {
              localStorage[typeList[i]] = "";
            }
          })
          timeCount = 0;
        }
        timeCount ++;
      }, 200);
    } catch (e) {
      console.error("监控代码异常，捕获", e);
    }
  }
  /**
   * 用户访问记录监控
   * @param project 项目详情
   */
  function checkUrlChange() {
    // 如果是单页应用， 只更改url
    var webLocation = window.location.href.split('?')[0].replace('#', '');
    // 如果url变化了， 就把更新的url记录为 defaultLocation, 重新设置pageKey
    if (defaultLocation != webLocation) {
      recordPV();
      defaultLocation = webLocation;
    }
  }

  /**
   * 用户访问记录监控
   * @param project 项目详情
   */
  function recordPV() {
    utils.setPageKey();
    var loadType = "load";
    if (resourcesObj) {
      if (resourcesObj[0] && resourcesObj[0].type === 'navigate') {
        loadType = "load";
      } else {
        loadType = "reload";
      }
    }
    // 判断是否是新用户  开始
    var customerKey = utils.getCookie("monitorCustomerKey");
    if (customerKey) {
      var newStatus = "";
      var customerKeyArr = customerKey ? customerKey.match(/\d{13}/g) : [];
      if (customerKeyArr && customerKeyArr.length > 0) {
        var tempTime = parseInt(customerKeyArr[0], 10);
        var currentTime = new Date().getTime();
        if (currentTime - tempTime > 1000) {
          newStatus = "old";
        } else {
          newStatus = "new";
        }
      }
    }
    // 判断是否是新用户  结束
    var customerPv = new CustomerPV(CUSTOMER_PV, loadType, 0, newStatus);
    customerPv.handleLogInfo(CUSTOMER_PV, customerPv);
  }

  /**
   * 用户加载页面信息监控
   * @param project 项目详情
   */
  function recordLoadPage() {
    utils.addLoadEvent(function () {
      setTimeout(function () {
        if (resourcesObj) {
          var loadType = "load";
          if (resourcesObj[0] && resourcesObj[0].type === 'navigate') {
            loadType = "load";
          } else {
            loadType = "reload";
          }

          var t = timingObj;
          var loadPageInfo = new LoadPageInfo(LOAD_PAGE);
          // 页面加载类型， 区分第一次load还是reload
          loadPageInfo.loadType = loadType;

          //【重要】页面加载完成的时间
          //【原因】这几乎代表了用户等待页面可用的时间
          loadPageInfo.loadPage = t.loadEventEnd - t.navigationStart;

          //【重要】解析 DOM 树结构的时间
          //【原因】反省下你的 DOM 树嵌套是不是太多了！
          loadPageInfo.domReady = t.domComplete - t.responseEnd;

          //【重要】重定向的时间
          //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
          loadPageInfo.redirect = t.redirectEnd - t.redirectStart;

          //【重要】DNS 查询时间
          //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
          // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
          loadPageInfo.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

          //【重要】读取页面第一个字节的时间
          //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
          // TTFB 即 Time To First Byte 的意思
          // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
          loadPageInfo.ttfb = t.responseStart - t.navigationStart;

          //【重要】内容加载完成的时间
          //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
          loadPageInfo.request = t.responseEnd - t.requestStart;

          //【重要】执行 onload 回调函数的时间
          //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
          loadPageInfo.loadEvent = t.loadEventEnd - t.loadEventStart;

          // DNS 缓存时间
          loadPageInfo.appcache = t.domainLookupStart - t.fetchStart;

          // 卸载页面的时间
          loadPageInfo.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

          // TCP 建立连接完成握手的时间
          loadPageInfo.connect = t.connectEnd - t.connectStart;

          loadPageInfo.handleLogInfo(LOAD_PAGE, loadPageInfo);
        }
        // 此方法有漏洞，暂时先注释掉
        // performanceGetEntries();
      }, 1000);
    })
  }

  /**
   * 监控页面静态资源加载报错
   */
  function recordResourceError() {
    // 当浏览器不支持 window.performance.getEntries 的时候，用下边这种方式
    window.addEventListener('error',function(e){
      var typeName = e.target.localName;
      var sourceUrl = "";
      if (typeName === "link") {
        sourceUrl = e.target.href;
      } else if (typeName === "script") {
        sourceUrl = e.target.src;
      }
      var resourceLoadInfo = new ResourceLoadInfo(RESOURCE_LOAD, sourceUrl, typeName, "0");
      resourceLoadInfo.handleLogInfo(RESOURCE_LOAD, resourceLoadInfo);
    }, true);
  }

  /**
   * 启动屏幕录制
   */
  function checkTheVideo() {
      /**
       * 如果localStorage里边没有debug的连接状态，则发送一条请求获取连线状态
       * 如果localStorage里边有debug的连接状态，则无需发送请求获取连线状态，
       * 后续根据upLog的返回值来获取连线状态
       */
      var debugConnectStatus = localStorage.debugConnectStatus
      if (!debugConnectStatus) {
        // 如果没有这个值，发送一条请求，确定连线状态, 并确定是否启动
        var wmUserInfo = localStorage.wmUserInfo ? JSON.parse(localStorage.wmUserInfo) : "";
        utils.ajax("GET", HTTP_PROJECT_INFO + "?userId=" + wmUserInfo.userId, {}, function (res) {
          localStorage.debugConnectStatus = res.data
          if (res.data == "connected") {
            if (stopTheVideo) return
            utils.initDebugTool();
          }
        });
      } else if (debugConnectStatus === "connected") {
        // debug连线状态，允许上传录屏信息
        if (stopTheVideo) return
        utils.initDebugTool();
      } else if (debugConnectStatus === "disconnect") {
        // debug连线状态断开，停止上传录屏信息
        if (stopTheVideo) { 
          stopTheVideo(); 
          stopTheVideo = null;
        }
      }
  }

  /**
   * 利用window.performance.getEntries来对比静态资源是否加载成功
   */
  function performanceGetEntries() {
    /**
     * 判断静态资源是否加载成功, 将没有成功加载的资源文件作为js错误上报
     */
    if (window.performance && typeof window.performance.getEntries === "function") {
      // 获取所有的静态资源文件加载列表
      var entries = window.performance.getEntries();
      var scriptArray = entries.filter(function (entry) {
        return entry.initiatorType === "script";
      });
      var linkArray = entries.filter(function (entry) {
        return entry.initiatorType === "link";
      });

      // 获取页面上所有的script标签, 并筛选出没有成功加载的静态资源
      var scripts = [];
      var scriptObjects = document.getElementsByTagName("script");
      for (var i = 0; i < scriptObjects.length; i ++) {
        if (scriptObjects[i].src) {
          scripts.push(scriptObjects[i].src);
        }
      }
      var errorScripts = scripts.filter(function (script) {
        var flag = true;
        for (var i = 0; i < scriptArray.length; i ++) {
          if (scriptArray[i].name === script) {
            flag = false;
            break;
          }
        }
        return flag;
      });

      // 获取所有的link标签
      var links = [];
      var linkObjects = document.getElementsByTagName("link");
      for (var i = 0; i < linkObjects.length; i ++) {
        if (linkObjects[i].href) {
          links.push(linkObjects[i].href);
        }
      }
      var errorLinks = links.filter(function (link) {
        var flag = true;
        for (var i = 0; i < linkArray.length; i ++) {
          if (linkArray[i].name === link) {
            flag = false;
            break;
          }
        }
        return flag;
      });
      for (var m = 0; m < errorScripts.length; m ++) {
        var resourceLoadInfo = new ResourceLoadInfo(RESOURCE_LOAD, errorScripts[m], "script", "0");
        resourceLoadInfo.handleLogInfo(RESOURCE_LOAD, resourceLoadInfo);
      }
      for (var m = 0; m < errorLinks.length; m ++) {
        var resourceLoadInfo = new ResourceLoadInfo(RESOURCE_LOAD, errorLinks[m], "link", "0");
        resourceLoadInfo.handleLogInfo(RESOURCE_LOAD, resourceLoadInfo);
      }
    }
  }

  function siftAndMakeUpMessage(infoType, origin_errorMsg, origin_url, origin_lineNumber, origin_columnNumber, origin_errorObj) {
    // 记录js错误前，检查一下url记录是否变化
    checkUrlChange();
    var errorMsg = origin_errorMsg ? origin_errorMsg : '';
    var errorObj = origin_errorObj ? origin_errorObj : '';
    var errorType = "";
    if (errorMsg) {
      if (typeof errorObj === 'string') {
        errorType = errorObj.split(": ")[0].replace('"', "");
      } else {
        var errorStackStr = JSON.stringify(errorObj)
        errorType = errorStackStr.split(": ")[0].replace('"', "");
      }
    }
    var javaScriptErrorInfo = new JavaScriptErrorInfo(JS_ERROR, infoType, errorType + ": " + errorMsg, errorObj);
    javaScriptErrorInfo.handleLogInfo(JS_ERROR, javaScriptErrorInfo);
  };
  /**
   * 页面JS错误监控
   */
  function recordJavaScriptError() {
    // 重写console.error, 可以捕获更全面的报错信息
    var oldError = console.error;
    console.error = function (tempErrorMsg) {
      var errorMsg = (arguments[0] && arguments[0].message) || tempErrorMsg;
      var lineNumber = 0;
      var columnNumber = 0;
      var errorObj = arguments[0] && arguments[0].stack;
      if (!errorObj) {
        if (typeof errorMsg == "object") {
          try {
            errorMsg = JSON.stringify(errorMsg)
          } catch(e) {
            errorMsg = "错误无法解析"
          }
        }
        siftAndMakeUpMessage("console_error", errorMsg, WEB_LOCATION, lineNumber, columnNumber, "CustomizeError: " + errorMsg);
      } else {
        // 如果报错中包含错误堆栈，可以认为是JS报错，而非自定义报错
        siftAndMakeUpMessage("on_error", errorMsg, WEB_LOCATION, lineNumber, columnNumber, errorObj);
      }
      return oldError.apply(console, arguments);
    };
    // 重写 onerror 进行jsError的监听
    window.onerror = function(errorMsg, url, lineNumber, columnNumber, errorObj) {
      jsMonitorStarted = true;
      var errorStack = errorObj ? errorObj.stack : null;
      siftAndMakeUpMessage("on_error", errorMsg, url, lineNumber, columnNumber, errorStack);
    };
    window.onunhandledrejection = function(e) {
      var errorMsg = "";
      var errorStack = "";
      if (typeof e.reason === "object") {
        errorMsg = e.reason.message;
        errorStack = e.reason.stack;
      } else {
        errorMsg = e.reason;
        errorStack = "";
      }
      siftAndMakeUpMessage("on_error", errorMsg, WEB_LOCATION, 0, 0, "UncaughtInPromiseError: " + errorStack);
    }
  };
  /**
   * 页面接口请求监控
   */
  function recordHttpLog() {

    // 监听ajax的状态
    function ajaxEventTrigger(event) {
      var ajaxEvent = new CustomEvent(event, { detail: this });
      window.dispatchEvent(ajaxEvent);
    }
    var oldXHR = window.XMLHttpRequest;
    function newXHR() {
      var realXHR = new oldXHR();
      realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
      realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
      realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
      realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
      realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
      realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
      realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
      realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
      // 此处的捕获的异常会连日志接口也一起捕获，如果日志上报接口异常了，就会导致死循环了。
      // realXHR.onerror = function () {
      //   siftAndMakeUpMessage("Uncaught FetchError: Failed to ajax", WEB_LOCATION, 0, 0, {});
      // }
      return realXHR;
    }
    function handleHttpResult(i, tempResponseText) {
      if (!timeRecordArray[i] || timeRecordArray[i].uploadFlag === true) {
        return;
      }
      var responseText = "";
      if (tempResponseText && responseText.length < 500) {
        try {
          responseText = tempResponseText ? JSON.stringify(utils.encryptObj(JSON.parse(tempResponseText))) : "";
        } catch (e) {
          responseText = "";
        }
      } else {
        responseText = "data is too long";
      }
      var simpleUrl = timeRecordArray[i].simpleUrl;
      var currentTime = new Date().getTime();
      var url = timeRecordArray[i].event.detail.responseURL;
      var status = timeRecordArray[i].event.detail.status;
      var statusText = timeRecordArray[i].event.detail.statusText;
      var loadTime = currentTime - timeRecordArray[i].timeStamp;
      if (!url || url.indexOf(HTTP_UPLOAD_LOG_API) != -1) return;
      var httpLogInfoStart = new HttpLogInfo(HTTP_LOG, simpleUrl, url, status, statusText, "发起请求", "", timeRecordArray[i].timeStamp, 0);
      httpLogInfoStart.handleLogInfo(HTTP_LOG, httpLogInfoStart);
      var httpLogInfoEnd = new HttpLogInfo(HTTP_LOG, simpleUrl, url, status, statusText, "请求返回", responseText, currentTime, loadTime);
      httpLogInfoEnd.handleLogInfo(HTTP_LOG, httpLogInfoEnd);
      // 当前请求成功后就，就将该对象的uploadFlag设置为true, 代表已经上传了
      timeRecordArray[i].uploadFlag = true;
    }

    var timeRecordArray = [];
    window.XMLHttpRequest = newXHR;
    window.addEventListener('ajaxLoadStart', function(e) {
      var tempObj = {
        timeStamp: new Date().getTime(),
        event: e,
        simpleUrl: window.location.href.split('?')[0].replace('#', ''),
        uploadFlag: false,
      }
      timeRecordArray.push(tempObj)
    });
    
    window.addEventListener('ajaxLoadEnd', function() {
      for (var i = 0; i < timeRecordArray.length; i ++) {
        // uploadFlag == true 代表这个请求已经被上传过了
        if (timeRecordArray[i].uploadFlag === true) continue;
        if (timeRecordArray[i].event.detail.status > 0) {
          var rType = (timeRecordArray[i].event.detail.responseType + "").toLowerCase()
          if (rType === "blob") {
            (function(index) {
              var reader = new FileReader();
              reader.onload = function() {
                var responseText = reader.result;//内容就在这里
                handleHttpResult(index, responseText);
              }
              try {
                reader.readAsText(timeRecordArray[i].event.detail.response, 'utf-8');
              } catch (e) {
                handleHttpResult(index, timeRecordArray[i].event.detail.response + "");
              }
            })(i);
          } else {
            try {
              var xhr = timeRecordArray[i] && timeRecordArray[i].event && timeRecordArray[i].event.detail;
              if (!xhr) return;
              var resType = xhr.responseType
              var resTxt = "";
              if (resType === '' || resType === 'text') resTxt = xhr.responseText;
              if (resType === 'json') resTxt = JSON.stringify(xhr.response);
              handleHttpResult(i, resTxt);
            } catch(e) {}
          }
        }
      }
    });
  }
  /**
   * 用户行为记录监控
   * @param project 项目详情
   */
  function recordBehavior(project) {
    // 行为记录开关
    if (project && project.record && project.record == 1) {
      // 记录行为前，检查一下url记录是否变化
      checkUrlChange();
      // 记录用户点击元素的行为数据
      utils.addOnclickForDocument(function (e) {
        var className = "";
        var placeholder = "";
        var inputValue = "";
        var tagName = e.target.tagName;
        var innerText = "";
        if (e.target.tagName != "svg" && e.target.tagName != "use") {
          className = e.target.className;
          placeholder = e.target.placeholder || "";
          inputValue = e.target.value || "";
          innerText = e.target.innerText ? e.target.innerText.replace(/\s*/g, "") : "";
          // 如果点击的内容过长，就截取上传
          if (innerText.length > 200) innerText = innerText.substring(0, 100) + "... ..." + innerText.substring(innerText.length - 99, innerText.length - 1);
          innerText = innerText.replace(/\s/g, '');
        }
        var behaviorInfo = new BehaviorInfo(ELE_BEHAVIOR, "click", className, placeholder, inputValue, tagName, innerText);
        behaviorInfo.handleLogInfo(ELE_BEHAVIOR, behaviorInfo);
      })
    }
  };


  /**
   * 监控代码需要的工具类
   * @constructor
   */
  function MonitorUtils() {
    this.getUuid = function() {
      var timeStamp = new Date().getTime()
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      }) + "-" + timeStamp;
    };
    /**
     * 获取用户的唯一标识
     */
    this.getCustomerKey = function () {
      var customerKey = this.getUuid();
      var monitorCustomerKey = utils.getCookie("monitorCustomerKey");
      if (!monitorCustomerKey) {
        var extraTime = 60 * 30 * 24 * 3600 * 1000 // cookie 30天后过期时间
        var exp = new Date()
        exp.setTime(exp.getTime() + extraTime)
        if (MAIN_DOMAIN) {
          document.cookie = "monitorCustomerKey=" + customerKey + ";Path=/;domain=" + MAIN_DOMAIN + ";expires=" + exp.toGMTString()
        } else {
          document.cookie = "monitorCustomerKey=" + customerKey + ";Path=/;expires=" + exp.toGMTString()
        }
        monitorCustomerKey = customerKey
      }
      return monitorCustomerKey;
    };
    /**
     * 获取cookie
     */
    this.getCookie = function(name) {
      var arr
      var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
      if (document.cookie.match(reg)) {
        arr = document.cookie.match(reg)
        return unescape(arr[2])
      }
      return ""
    }
    /**
     * 获取页面的唯一标识
     */
    this.getPageKey = function () {
      var pageKey = this.getUuid();
      var reg = /^[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}-\d{13}$/
      if (!localStorage.monitorPageKey) {
        localStorage.monitorPageKey = pageKey;
      } else if (!reg.test(localStorage.monitorPageKey)) {
        localStorage.monitorPageKey = pageKey;
      }
      return localStorage.monitorPageKey;
    };
    /**
     * 设置页面的唯一标识
     */
    this.setPageKey = function () {
      localStorage.monitorPageKey = this.getUuid();
    };
    /**
     * 重写页面的onload事件
     */
    this.addLoadEvent = function(func){
      var oldOnload = window.onload; //把现在有window.onload事件处理函数的值存入变量oldonload。
      if(typeof window.onload != 'function'){ //如果这个处理函数还没有绑定任何函数，就像平时那样把新函数添加给它
        window.onload = func;
      } else { //如果在这个处理函数上已经绑定了一些函数。就把新函数追加到现有指令的末尾
        window.onload = function(){
          oldOnload();
          func();
        }
      }
    }
    /**
     * 重写document的onclick事件
     */
    this.addOnclickForDocument = function(func) {
      var oldOnclick = document.onclick; //把现在有document.onclick事件处理函数的值存入变量oldOnclick。
      if (typeof document.onclick != 'function') { //如果这个处理函数还没有绑定任何函数，就像平时那样把新函数添加给它
        document.onclick = func;
      } else { //如果在这个处理函数上已经绑定了一些函数。就把新函数追加到现有指令的末尾
        document.onclick = function() {
          oldOnclick();
          func();
        }
      }
    }
    /**
     * 封装简易的ajax请求, 只用于上传日志
     * @param method  请求类型(大写)  GET/POST
     * @param url     请求URL
     * @param param   请求参数
     * @param successCallback  成功回调方法
     * @param failCallback   失败回调方法
     */
    this.ajax = function(method, url, param, successCallback, failCallback) {
      var xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      xmlHttp.open(method, url, true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var response = xmlHttp.responseText ? JSON.parse(xmlHttp.responseText) : {}
          typeof successCallback == 'function' && successCallback(response);
        } else {
          typeof failCallback == 'function' && failCallback();
        }
      };
      console.log(JSON.stringify(param.logInfo))
      xmlHttp.send("data=" + JSON.stringify(param.logInfo));
    }
    /**
     * js处理截图
     */
    this.screenShot = function (cntElem, description) {
      var shareContent = cntElem;//需要截图的包裹的（原生的）DOM 对象
      var width = shareContent.offsetWidth; //获取dom 宽度
      var height = shareContent.offsetHeight; //获取dom 高度
      var canvas = document.createElement("canvas"); //创建一个canvas节点
      var scale = 0.3; //定义任意放大倍数 支持小数
      canvas.style.display = "none";
      canvas.width = width * scale; //定义canvas 宽度 * 缩放
      canvas.height = height * scale; //定义canvas高度 *缩放
      canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
      var opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        logging: false, //日志开关，便于查看html2canvas的内部执行流程
        width: width, //dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
      };
      window.html2canvas && window.html2canvas(cntElem, opts).then(function(canvas) {
        var dataURL = canvas.toDataURL("image/webp");
        var tempCompress = dataURL.replace("data:image/webp;base64,", "");
        var compressedDataURL = utils.b64EncodeUnicode(tempCompress);
        var screenShotInfo = new ScreenShotInfo(SCREEN_SHOT, description, compressedDataURL)
        screenShotInfo.handleLogInfo(SCREEN_SHOT, screenShotInfo);
      });
    }
    /**
     * 初始化调试工具
     */
    this.initDebugTool = function() {
      console.log("= 调试工具即将初始化...");
      // 加载js压缩工具
      utils.loadJs("//cdn.bootcss.com/lz-string/1.4.4/lz-string.js", function() {
        console.log("= 字符串压缩工具加载成功...");
        // 加载录屏机制
        utils.loadJs("//cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js", function() {
          console.log("= 录屏工具加载成功...");
          console.log("= 调试工具初始化完成, 开始录屏...");
          stopTheVideo = rrweb.record({
            emit: function(event) {
              var newEventStr = JSON.stringify(event);
              var videosInfo = new VideosInfo(VIDEOS_EVENT, newEventStr);
              videosInfo.uploadType = VIDEOS_EVENT;
              var logInfo = JSON.stringify(videosInfo);
              if (logInfo.length > 1000) {
                utils.ajax("POST", HTTP_UPLOAD_LOG_INFO, {logInfo: logInfo}, function () {});
              } else {
                videosInfo.handleLogInfo(VIDEOS_EVENT, videosInfo);
              }
            },
          });
        });
      });
    }
    // 深拷贝方法. 注意: 如果对象里边包含function, 则对function的拷贝依然是浅拷贝
    this.encryptObj = function(o) {
      if (o instanceof Array) {
        var n = []
        for (var i = 0; i < o.length; ++i) {
          n[i] = this.encryptObj(o[i])
        }
        return n
      } else if (o instanceof Object) {
        var n = {}
        for (var i in o) {
          n[i] = this.encryptObj(o[i])
        }
        return n
      }
      o = o + ""
      if (o.length > 8) {
        o = o.substring(0, 4) + "****" + o.substring(o.length - 3, o.length)
      }
      return o
    }
    // 压缩JSON字符串, 对key进行压缩
    // window.keyArray = localStorage.keyArray ? JSON.parse(localStorage.keyArray) : []
    // window.keyCountArray = window.keyCountArray ? JSON.parse(localStorage.keyArray) : []
    this.compressJson = function(o) {
      if (o instanceof Array) {
        var n = []
        for (var i = 0; i < o.length; ++i) {
          n[i] = this.compressJson(o[i])
        }
        return n
      } else if (o instanceof Object) {
        var n = {}
        for (var i in o) {
          // if (window.keyArray.indexOf(i) == -1) {
          //   window.keyArray.push(i)
          // }

          // if (window.keyCountArray.length) {
          //   for (var m = 0; m < window.keyCountArray.length; m ++) {
          //     if (window.keyCountArray[m][i]) {
          //       window.keyCountArray[m][i] = window.keyCountArray[m][i] + 1
          //     } else {
          //       window.keyCountArray[m][i] = 1
          //     }
          //   }
          // } else {
          //   var obj = {}
          //   obj[i] = 1
          //   window.keyCountArray.push(obj)
          // }
          if (i == "_cssText") {
            o[i]= o[i].replace(/ {/g, "{").replace(/; /g, ";").replace(/: /g, ":").replace(/, /g, ",").replace(/{ /g, "{")
            for (var key in JSON_CSS_KEY) {
              var cssAttr = JSON_CSS_KEY[key]
              var cssReg = new RegExp(key, "g");
              o[i]= o[i].replace(cssReg, cssAttr)
            }
          }

          if (JSON_KEY[i]) {
            n[JSON_KEY[i]] = this.compressJson(o[i])
            delete n[i]
          } else {
            n[i] = this.compressJson(o[i])
          }
        }
        return n
      }
      return o
    }

    this.Compress = function(strNormalString) {
      var strCompressedString = "";
  
      var ht = new Array();
      for(i = 0; i < 128; i++) {
          ht[i] = i;
      }
  
      var used = 128;
      var intLeftOver = 0;
      var intOutputCode = 0;
      var pcode = 0;
      var ccode = 0;
      var k = 0;
  
      for(var i=0; i<strNormalString.length; i++) {
          ccode = strNormalString.charCodeAt(i);
          k = (pcode << 8) | ccode;
          if(ht[k] != null) {
              pcode = ht[k];
          } else {
              intLeftOver += 12;
              intOutputCode <<= 12;
              intOutputCode |= pcode;
              pcode = ccode;
              if(intLeftOver >= 16) {
                  strCompressedString += String.fromCharCode( intOutputCode >> ( intLeftOver - 16 ) );
                  intOutputCode &= (Math.pow(2, (intLeftOver - 16)) - 1);
                  intLeftOver -= 16;
              }
              if(used < 4096) {
                  used ++;
                  ht[k] = used - 1;
              }
          }
      }
  
      if(pcode != 0) {
          intLeftOver += 12;
          intOutputCode <<= 12;
          intOutputCode |= pcode;
      }
  
      if(intLeftOver >= 16) {
          strCompressedString += String.fromCharCode( intOutputCode >> ( intLeftOver - 16 ) );
          intOutputCode &= (Math.pow(2,(intLeftOver - 16)) - 1);
          intLeftOver -= 16;
      }
  
      if( intLeftOver > 0) {
          intOutputCode <<= (16 - intLeftOver);
          strCompressedString += String.fromCharCode( intOutputCode );
      }
  
      return strCompressedString;
  }

  this.Decompress = function(strCompressedString) {
        var strNormalString = "";
        var ht = new Array();

        for(i = 0; i < 128; i++) {
            ht[i] = String.fromCharCode(i);
        }

        var used = 128;
        var intLeftOver = 0;
        var intOutputCode = 0;
        var ccode = 0;
        var pcode = 0;
        var key = 0;

        for(var i=0; i<strCompressedString.length; i++) {
            intLeftOver += 16;
            intOutputCode <<= 16;
            intOutputCode |= strCompressedString.charCodeAt(i);

            while(1) {
                if(intLeftOver >= 12) {
                    ccode = intOutputCode >> (intLeftOver - 12);
                    if( typeof( key = ht[ccode] ) != "undefined" ) {
                        strNormalString += key;
                        if(used > 128) {
                            ht[ht.length] = ht[pcode] + key.substr(0, 1);
                        }
                        pcode = ccode;
                    } else {
                        key = ht[pcode] + ht[pcode].substr(0, 1);
                        strNormalString += key;
                        ht[ht.length] = ht[pcode] + key.substr(0, 1);
                        pcode = ht.length - 1;
                    }

                    used ++;
                    intLeftOver -= 12;
                    intOutputCode &= (Math.pow(2,intLeftOver) - 1);
                } else {
                    break;
                }
            }
        }
        return strNormalString;
    }

    this.getDevice = function() {
      var device = {};
      var ua = navigator.userAgent;
      var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
      var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
      var mobileInfo = ua.match(/Android\s[\S\s]+Build\//);
      device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
      device.isWeixin = /MicroMessenger/i.test(ua);
      device.os = "web";
      device.deviceName = "PC";
      // Android
      if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
      }
      if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
      }
      // iOS
      if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
      }
      if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
      }
      if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
      }
      // iOS 8+ changed UA
      if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
          device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
      }

      // 如果是ios, deviceName 就设置为iphone，根据分辨率区别型号
      if (device.iphone) {
        device.deviceName = "iphone";
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        if (screenWidth === 320 && screenHeight === 480) {
          device.deviceName = "iphone 4";
        } else if (screenWidth === 320 && screenHeight === 568) {
          device.deviceName = "iphone 5/SE";
        } else if (screenWidth === 375 && screenHeight === 667) {
          device.deviceName = "iphone 6/7/8";
        } else if (screenWidth === 414 && screenHeight === 736) {
          device.deviceName = "iphone 6/7/8 Plus";
        } else if (screenWidth === 375 && screenHeight === 812) {
          device.deviceName = "iphone X/S/Max";
        }
      } else if (device.ipad) {
        device.deviceName = "ipad";
      } else if (mobileInfo) {
        var info = mobileInfo[0];
        var deviceName = info.split(';')[1].replace(/Build\//g, "");
        device.deviceName = deviceName.replace(/(^\s*)|(\s*$)/g, "");
      }
      // 浏览器模式, 获取浏览器信息
      // TODO 需要补充更多的浏览器类型进来
      if (ua.indexOf("Mobile") == -1) {
        var agent = navigator.userAgent.toLowerCase() ;
        var regStr_ie = /msie [\d.]+;/gi ;
        var regStr_ff = /firefox\/[\d.]+/gi
        var regStr_chrome = /chrome\/[\d.]+/gi ;
        var regStr_saf = /safari\/[\d.]+/gi ;

        device.browserName = '未知';
        //IE
        if(agent.indexOf("msie") > 0) {
          var browserInfo = agent.match(regStr_ie)[0];
          device.browserName = browserInfo.split('/')[0];
          device.browserVersion = browserInfo.split('/')[1];
        }
        //firefox
        if(agent.indexOf("firefox") > 0) {
          var browserInfo = agent.match(regStr_ff)[0];
          device.browserName = browserInfo.split('/')[0];
          device.browserVersion = browserInfo.split('/')[1];
        }
        //Safari
        if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
          var browserInfo = agent.match(regStr_saf)[0];
          device.browserName = browserInfo.split('/')[0];
          device.browserVersion = browserInfo.split('/')[1];
        }
        //Chrome
        if(agent.indexOf("chrome") > 0) {
          var browserInfo = agent.match(regStr_chrome)[0];
          device.browserName = browserInfo.split('/')[0];
          device.browserVersion = browserInfo.split('/')[1];
        }
      }
      // Webview
      device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

      // Export object
      return device;
    }
    this.loadJs = function(url, callback) {
      var script = document.createElement('script');
      script.async = 1;
      script.src = url;
      script.onload = callback;
      var dom = document.getElementsByTagName('script')[0];
      dom.parentNode.insertBefore(script, dom);
      return dom;
    }
    this.b64EncodeUnicode = function(str) {
      try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
          return String.fromCharCode("0x" + p1);
        }));
      } catch (e) {
        return str;
      }
    }
    // 字符串转换成二进制流
    this.char2buf = function(str) {
      var out = new ArrayBuffer(str.length*2);
      var u16a= new Uint16Array(out);
      var strs = str.split("");
      for(var i =0 ; i<strs.length;i++){
          u16a[i]=strs[i].charCodeAt();
      }
      return out;
  }
  }

  init();

  window.webfunny = {

    /**
     * 检查配置信息
     */
    wm_check: function() {
      var errorStatus = "未启动！"
      console.log("================================配置检查===============================");
      console.log("=【探针标识】：" + WEB_MONITOR_ID);
      console.log("=【上报接口】：" + HTTP_UPLOAD_LOG_INFO);
      console.log("......................................................................");
      console.log("= PVUV监控状态：" + (PV_MSG || errorStatus));
      console.log("= 静态资源监控状态：" + (PAGELOAD_MSG || errorStatus));
      console.log("= JS错误监控状态：" + (JSERROR_MSG || errorStatus));
      console.log("= 接口请求监控状态：" + (HTTP_MSG || errorStatus));
      console.log("= 静态资源监控状态：" + (RESOURCE_MSG || errorStatus));
      console.log("= 用户行为监控状态：" + (BEHAVIOR_MSG || errorStatus));
      console.log("= 用户信息初始化状态：" + (INITUSER_MSG || "未初始化！部分功能将无法使用，请查看文档(API方法调用)，执行webfunny.wmInitUser方法进行初始化！"));
      console.log("======================================================================");
      return "结束";
    },
    /**
     * 埋点上传数据
     * @param url 当前页面的url
     * @param type 埋点类型
     * @param index 埋点顺序
     * @param description 其他信息描述
     */
    wm_upload: function (url, type, index, description) {
      var createTime = new Date().toString();
      var logParams = {
        createTime: encodeURIComponent(createTime),
        happenTime: new Date().getTime(),
        uploadType: 'WM_UPLOAD',
        simpleUrl: encodeURIComponent(encodeURIComponent(url)),
        webMonitorId: WEB_MONITOR_ID,
        recordType: type,
        recordIndex: index,
        description: description
      };
      var http_api = HTTP_UPLOAD_RECORD_DATA;
      var recordDataXmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
      recordDataXmlHttp.open('POST', http_api, true);
      recordDataXmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      recordDataXmlHttp.send('data=' + JSON.stringify([logParams]));
    },
    /**
     * 使用者传入的自定义信息
     *
     * @param userId
     * @param userName
     * @param userTpye
     */
    wm_init_user: function (userId, userTag, secondUserParam) {
      if (!userId) console.warn('userId 初始化值为0(不推荐) 或者 未初始化');
      if (!secondUserParam) console.warn('secondParam 初始化值为0(不推荐) 或者 未初始化');
      // 如果用户传入了userTag值，重新定义WEB_MONITOR_ID
      if (userTag) {
        WEB_MONITOR_ID = userTag + "_webmonitor";
      }
      localStorage.wmUserInfo = JSON.stringify({
        userId: userId,
        userTag: userTag,
        secondUserParam: secondUserParam
      });
      return 1;
    },
    /**
     * 使用者传入的自定义信息
     *
     * @param userId 用户唯一标识
     * @param projectVersion 应用版本号
     */
    wmInitUser: function (userId, projectVersion) {
      if (!userId) console.warn('userId(用户唯一标识) 初始化值为0(不推荐) 或者 未传值, 探针可能无法生效');
      if (!projectVersion) console.warn('projectVersion(应用版本号) 初始化值为0(不推荐) 或者 未传值, 探针可能无法生效');

      localStorage.wmUserInfo = JSON.stringify({
        userId: userId,
        projectVersion: projectVersion
      });
      INITUSER_MSG = "用户信息初始化：userId=" + userId + "，版本号：" + projectVersion
      return 1;
    },
    /**
     * 使用者传入的自定义截屏指令, 由探针代码截图
     * @param description  截屏描述
     */
    wm_screen_shot: function (description) {
      utils.screenShot(document.body, description)
    },
    /**
     * 使用者传入图片进行上传
     * @param compressedDataURL 图片的base64编码字符串，description 图片描述
     */
    wm_upload_picture: function (compressedDataURL, description, imgType) {
      var screenShotInfo = new ScreenShotInfo(SCREEN_SHOT, description, compressedDataURL, imgType || "jpeg");
      screenShotInfo.handleLogInfo(SCREEN_SHOT, screenShotInfo);
    },
    /**
     * 使用者自行上传的行为日志
     * @param userId 用户唯一标识
     * @param behaviorType 行为类型
     * @param behaviorResult 行为结果（成功、失败等）
     * @param uploadType 日志类型（分类）
     * @param description 行为描述
     */
    wm_upload_extend_log: function (userId, behaviorType, behaviorResult, uploadType, description) {
      var extendBehaviorInfo = new ExtendBehaviorInfo(userId, behaviorType, behaviorResult, uploadType, description)
      extendBehaviorInfo.handleLogInfo(CUSTOMIZE_BEHAVIOR, extendBehaviorInfo);
    }
  };

  // polyFile 如果不支持 window.CustomEvent
  (function () {
    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  })();


})(window);
