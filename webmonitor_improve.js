(function (window) {
  /** 全局变量 **/
  if (!localStorage) {
    window.localStorage = new Object();
  }
  var
    // 用fetch方式请求接口时，暂存接口url
    fetchHttpUrl = null

    // 自动上传日志记录的定时器
    , webMonitorUploadTimer = null

    // 暂存本地用于保存日志信息的数组
    , uploadMessageArray = null

    // 上传日志的开关，如果为false，则不再上传
    , uploadRemoteServer = true;

  /** 常量 **/
  var
    // 所属项目ID, 用于替换成相应项目的UUID，生成监控代码的时候搜索替换
    WEB_MONITOR_ID = 'jeffery_webmonitor'

    // 判断是http或是https的项目
    , WEB_HTTP_TYPE = window.location.href.indexOf('https') === -1 ? 'http://' : 'https://'

    // 获取当前页面的URL,不包含任何参数
    , WEB_LOCATION = window.location.href.split('?')[0].replace('#', '')

    // 本地IP, 用于区分本地开发环境
    , WEB_LOCAL_IP = 'localhost'

    // 监控平台地址
    , WEB_MONITOR_IP = 'www.webfunny.cn'

    // 上传数据的uri, 区分了本地和生产环境
    , HTTP_UPLOAD_URI =  WEB_LOCATION.indexOf(WEB_LOCAL_IP) != -1 ? WEB_HTTP_TYPE + WEB_LOCAL_IP + ':8001' : WEB_HTTP_TYPE + WEB_MONITOR_IP

    // 上传数据时忽略的uri, 需要过滤掉监控平台上传接口
    , WEB_MONITOR_IGNORE_URL = HTTP_UPLOAD_URI + '/server/common/uploadLogInfo'

    // 上传数据的接口
    , HTTP_UPLOAD_LOG_INFO = HTTP_UPLOAD_URI + '/server/common/uploadLogInfo'

    // 获取当前项目的参数信息的接口
    , HTTP_PROJECT_INFO = HTTP_UPLOAD_URI + '/server/project/getProject'

    // 上传埋点数据接口
    , HTTP_UPLOAD_RECORD_DATA = HTTP_UPLOAD_URI + ''

    // 接口日志类型
    , HTTP_LOG = 'HTTP_LOG'

    // 接口错误日志类型
    , HTTP_ERROR = 'HTTP_ERROR'

    // js报错日志类型
    , JS_ERROR = 'JS_ERROR'

    // 用户的行为类型
    , ELE_BEHAVIOR = 'ELE_BEHAVIOR'

    // 工具类示例化
    , utils = new MonitorUtils()

    // 监控代码空构造函数
    , WebMonitor = new Function()

    // 获取用户自定义信息
    , userInfo = localStorage.wmInitUser ? JSON.parse(localStorage.wmInitUser) : {};


    // 日志基类, 用于其他日志的继承
    function MonitorBaseInfo() {
      this.createTime = new Date().toString();
      this.happenTime = new Date().getTime();
      this.webMonitorId = WEB_MONITOR_ID;
      this.customerKey = utils.getCustomerKey();
      this.userId = userInfo.userId;
      this.firstUserParam = userInfo.firstUserParam;
      this.secondUserParam = userInfo.secondUserParam;

      this.handleLogInfo = function (type, logInfo) {
        var tempString = localStorage[type] ? localStorage[type] : "";
        switch (type) {
          case ELE_BEHAVIOR:
            localStorage[ELE_BEHAVIOR] = tempString + JSON.stringify(logInfo) + '$$$';
            break;
          default: break;
        }
      };
    }
    
    // 用户行为日志，继承于日志基类MonitorBaseInfo
    function BehaviorInfo(uploadType, behaviorType, className, placeholder, inputValue, tagName, innerText) {
      this.uploadType = uploadType;
      this.behaviorType = behaviorType;
      this.className = className;
      this.placeholder = placeholder;
      this.inputValue = inputValue;
      this.tagName = tagName;
      this.innerText = innerText;
      this.simpleUrl = window.location.href.split('?')[0].replace('#', '');
    }
    BehaviorInfo.prototype = new MonitorBaseInfo();

  /**
   * 监控初始化配置, 以及启动的方法
   */
  WebMonitor.prototype.init = function () {
    // 获取项目信息， 用于获取过滤域名，判断是否开启测试模式
    utils.ajax("POST", HTTP_PROJECT_INFO, {webMonitorId: WEB_MONITOR_ID}, function (res) {
      if (res.status === 0) {
        var project = res.data.project;
        // 总开关，判断是否开启记录功能 1记录/0不记录
        if (!project || !project.recording || project.recording != 1) {
          uploadRemoteServer = false;
          return;
        }
        // 通过项目配置的过滤域名，决定是否开启监控
        var FILTER_TYPE = project.filterType;
        var FILTER_DOMAIN = project.filterDomain;
        if (FILTER_TYPE === "include" && WEB_LOCATION.indexOf(FILTER_DOMAIN) != -1) {
          uploadRemoteServer = true;
        } else if (FILTER_TYPE === "exclude" && WEB_LOCATION.indexOf(FILTER_DOMAIN) == -1) {
          uploadRemoteServer = true;
        }
        // 如果开关为关闭状态，则不启动记录监控
        if (uploadRemoteServer === false) return;

        // 启动行为记录监控
        webMonitor.recordBehavior(project);
        // 启动接口日志记录监控

        // 启动JS错误记录监控

      } else {
        console.error("未获取到项目信息");
      }
    });
  };

  /**
   * 行为记录监控
   * @param project 项目详情
   */
  WebMonitor.prototype.recordBehavior = function (project) {
    // 行为记录开关
    if (project && project.recordBehavior && project.recordBehavior == 1) {
      // 记录用户点击元素的行为数据
      document.onclick = function (e) {
        var className = e.target.className ? e.target.className.replace(/\s/g, '') : "";
        var placeholder = encodeURIComponent(e.target.placeholder || "");
        var inputValue = encodeURIComponent(e.target.value || "");
        var tagName = e.target.tagName;
        var innerText = encodeURIComponent(e.target.innerText);
        // 如果点击的内容过长，就截取上传
        if (innerText.length > 200) innerText = innerText.substring(0, 100) + "... ..." + innerText.substring(innerText.length - 99, innerText.length - 1);
        innerText = innerText.replace(/\s/g, '');

        var behaviorInfo = new BehaviorInfo(ELE_BEHAVIOR, "click", className, placeholder, inputValue, tagName, innerText);
        behaviorInfo.handleLogInfo(ELE_BEHAVIOR, behaviorInfo);
      }
    }
  };


  /**
   * 监控代码需要的工具类
   * @constructor
   */
  function MonitorUtils() {
    this.getUuid = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    };
    /**
     * 获取用户的唯一标识
     */
    this.getCustomerKey = function () {
      var customerKey = this.getUuid();
      if (!localStorage.customerKey) localStorage.customerKey = customerKey;
      return localStorage.customerKey;
    };
    /**
     *
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
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          var res = JSON.parse(xmlHttp.responseText);
          typeof successCallback == 'function' && successCallback(res);
        } else {
          typeof failCallback == 'function' && failCallback();
        }
      };
      xmlHttp.send("data=" + JSON.stringify(param));
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

      // 如果是ios, deviceName 就设置为iphone， 无法获取具体型号

      if (device.iphone) {
        device.deviceName = "iphone"
      } else if (device.ipad) {
        device.deviceName = "ipad"
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
  }


  // if (!window.WebMonitor) {
  //   window.WebMonitor = WebMonitor;
  // } else {
  //   console.error("webMonitor 这个变量名已经被占用，初始化失败!");
  // }
  var webMonitor = new WebMonitor().init();

  window.webfunny = {
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
        simpleUrl: encodeURIComponent(url),
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
    wm_init_user: function (userId, firstUserParam, secondUserParam) {
      if (!userId) console.warn('userId 初始化值为0(不推荐) 或者 未初始化');
      if (!firstUserParam) console.warn('firstParam 初始化值为0(不推荐) 或者 未初始化');
      if (!secondUserParam) console.warn('secondParam 初始化值为0(不推荐) 或者 未初始化');
      localStorage.wmUserInfo = JSON.stringify({
        userId: userId,
        firstParam: firstUserParam,
        secondParam: secondUserParam
      });
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

