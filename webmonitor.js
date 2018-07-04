var WEB_MONITOR_ID = 'jeffery_webmonitor';    // 所属项目ID
var WEB_HTTP_TYPE = window.location.href.indexOf('https') === -1 ? 'http://' : 'https://';
var WEB_LOCATION = window.location.href.split('?')[0].replace('#', '');
var fetchHttpUrl = null;
var webMonitorUploadTimer = null;
var uploadMessageArray = null;
// var timingObj = performance && performance.timing;
// var resourcesObj = (function() {
//   if (performance && typeof performance.getEntries === 'function') {
//     return performance.getEntries();
//   }
//   return null;
// })();
if (!localStorage) {
  window.localStorage = new Object();
}

/////////////////////////////工具方法/////////////////////////////////
function MonitorUtils() {
    this.guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}
//--------------------------工具方法结束-----------------------------//
/**
 * 静态变量
 */
function ConstInfomation() {
  var utils = new MonitorUtils();
  if (!localStorage.customerKey) localStorage.customerKey = utils.guid();
  var wmObject = document.getElementById('webmonitor')
  if (wmObject) {
    WEB_MONITOR_ID = wmObject.getAttribute('monitor');
  }
  var WEB_LOCAL_IP = 'localhost',
      WEB_MONITOR_IP = 'www.webfunny.cn',  // 监控平台地址
      HTTP_UPLOAD_URI =  WEB_LOCATION.indexOf(WEB_LOCAL_IP) != -1 ? WEB_HTTP_TYPE + WEB_LOCAL_IP + ':8001' : WEB_HTTP_TYPE + WEB_MONITOR_IP; // 上传数据的uri
  return {
    CUSTOMER_KEY: localStorage.customerKey,   // 用户对应的key值
    WEB_MONITOR_ID: WEB_MONITOR_ID,           // 应用ID
    BROWSER_INFO: window.navigator.userAgent,  // 获取浏览器信息
    WEB_MONITOR_IGNORE_URL: HTTP_UPLOAD_URI + '/server/common/uploadLogInfo', // 监控平台忽略地址
    HTTP_UPLOAD_URI: HTTP_UPLOAD_URI, // 上传数据的uri
    HTTP_UPLOAD_RECORD_DATA: '',   //上传埋点数据
    HTTP_UPLOAD_LOG_INFO: '/server/common/uploadLogInfo' //上传数据的接口
  }
}
function InitMonitor() {
  try {
    var ConstInfo = new ConstInfomation();
    var AnalyseLocationInfo = new AnalyseLocation();
    var MonitorDeviceInfo = new MonitorDevice();
    var HTTP_UPLOAD_LOG_INFO = '/server/common/uploadLogInfo',   // 上传数据的接口
        // CHOSE_ELEMENT_API = '/server/choseElement/addChoseElement',   // 上传数据的接口
        HTTP_PROJECT_INFO = '/server/project/getProject',   // 获取当前项目的参数信息
        HTTP_LOG = 'HTTP_LOG',  // 日志类型
        HTTP_ERROR = 'HTTP_ERROR',  // 日志类型
        JS_ERROR = 'JS_ERROR',    // 日志类型
        FILTER_DOMAIN = "",  // 过滤域名
        FILTER_TYPE = "";    // 过滤类型
    var jsMonitorStarted = false;    // 判断window.onerror是否已经重写了
    var uploadRemoteServer = false;  // 用于判断是否上传远程服务器, 上传开关

    // 获取项目信息， 用于获取过滤域名，判断是否开启测试模式
    monitor_ajax("POST", ConstInfo.HTTP_UPLOAD_URI + HTTP_PROJECT_INFO, {webMonitorId: WEB_MONITOR_ID}, function (res) {
      if (res.status === 0) {
        var project = res.data.project;
        // 总开关，判断是否开启记录功能 1记录/0不记录
        if (!project || !project.recording || project.recording != 1) {
          uploadRemoteServer = false;
          return;
        }
        // 行为记录开关
        if (project && project.recordBehavior && project.recordBehavior == 1) {
          // 记录用户点击元素的行为数据
          document.onclick = function (e) {
            var simpleUrl = WEB_LOCATION;
            var className = e.target.className ? e.target.className.replace(/\s/g, '') : "";
            var placeholder = encodeURIComponent(e.target.placeholder || "");
            var inputValue = encodeURIComponent(e.target.value || "");
            var tagName = e.target.tagName;
            var innerText = encodeURIComponent(e.target.innerText);
            // if (!placeholder && !innerText) return;
            // 如果点击的内容过长，就截取上传
            if (innerText.length > 200) innerText = innerText.substring(0, 200) + "...";
            innerText = innerText.replace(/\s/g, '')
            var params = {
              happenTime: new Date().getTime(),
              uploadType: "ELE_BEHAVIOR",
              behaviorType: "click",
              webMonitorId: ConstInfo.WEB_MONITOR_ID,
              customerKey: ConstInfo.CUSTOMER_KEY,
              simpleUrl: simpleUrl,
              className: className,
              placeholder: placeholder,
              inputValue: inputValue,
              tagName: tagName,
              innerText: innerText
            };
            uploadMessage("ELE_BEHAVIOR", params);
          }
        }
        FILTER_TYPE = project.filterType;
        FILTER_DOMAIN = project.filterDomain;
        if (FILTER_TYPE === "include" && WEB_LOCATION.indexOf(FILTER_DOMAIN) != -1) {
          uploadRemoteServer = true;
        } else if (FILTER_TYPE === "exclude" && WEB_LOCATION.indexOf(FILTER_DOMAIN) == -1) {
          uploadRemoteServer = true;
        }
      } else {
        console.log("未获取到项目信息");
      }
    });
    /**
     * 防止页面记录信息数不足10个， 开启定时器， 每15秒自动上传一次
     */
    var setNewUploadTimer = function() {
      webMonitorUploadTimer = setTimeout(function () {
        uploadOperation();
        clearTimeout(webMonitorUploadTimer);
        webMonitorUploadTimer = null;
      }, 5 * 1000);
    };
    /**
     * 为避免后台高并发量，当数组存够10个就上传一次
     */
    var uploadMessage = function(type, params) {
      // 每一次请求被存下来后清除上一次的请求url
      fetchHttpUrl = '';
      if (localStorage.webMonitorUploadMessageArray) {
        localStorage.webMonitorUploadMessageArray = localStorage.webMonitorUploadMessageArray + JSON.stringify(params) + '$$$';
      } else {
        localStorage.webMonitorUploadMessageArray = JSON.stringify(params) + '$$$';
      }
      uploadMessageArray = localStorage.webMonitorUploadMessageArray.split('$$$');
      uploadMessageArray = uploadMessageArray.slice(0, uploadMessageArray.length - 1);
      // 当数组集满30个，就上传一次数据
      if (uploadMessageArray.length < 30) {
        if(!webMonitorUploadTimer) {
          setNewUploadTimer();
        }
        return;
      } else {
        // 触发上传后，清空上一次计时器，开启新的计时器
        if (webMonitorUploadTimer) {
          clearTimeout(webMonitorUploadTimer);
          webMonitorUploadTimer = null;
        }
      }
      uploadOperation();
    };
    var uploadOperation = function() {
      if (!uploadMessageArray.length || !uploadRemoteServer) return;
      // 如果数组存够30个，或者等待5秒后，立刻清空数组
      localStorage.webMonitorUploadMessageArray = '';
      for(var i = 0; i < uploadMessageArray.length; i ++) {
        // 应对未知的情况，会多出一个undefined
        var wmInitUser = localStorage.wmInitUser ? JSON.parse(localStorage.wmInitUser) : {};
        var tempObject = JSON.parse(uploadMessageArray[i].replace(/undefined\{/g, "{"));
        // 在上传的时候添加用户自定义信息，能够避免记录的时候还没有获取到自定义信息
        tempObject.customerKey = ConstInfo.CUSTOMER_KEY;
        tempObject.userId = wmInitUser.userId || '';
        tempObject.userName = wmInitUser.userName || '';
        tempObject.userType = wmInitUser.userType || '';
        uploadMessageArray[i] = tempObject;
      }
      var http_api = ConstInfo.HTTP_UPLOAD_URI + HTTP_UPLOAD_LOG_INFO;
      monitor_ajax("POST", http_api, uploadMessageArray, function () {
        uploadMessageArray = new Array();
      });
    };

    var siftAndMakeUpMessage = function(origin_errorMsg, origin_url, origin_lineNumber, origin_columnNumber, origin_errorObj) {
      var errorMsg = origin_errorMsg ? origin_errorMsg : '';
      var url = origin_url ? origin_url : WEB_LOCATION;
      var errorObj = origin_errorObj ? origin_errorObj : '';
      // 获取精简的url， 最后一个词
      var simpleUrl = url && url.split('?')[0];
      var createTime = new Date().toString();
      var logParams = {
        happenTime: new Date().getTime(),
        createTime: encodeURIComponent(createTime),
        uploadType: encodeURIComponent(JS_ERROR),
        projectName: encodeURIComponent(''),
        simpleUrl: encodeURIComponent(simpleUrl),
        location: encodeURIComponent(WEB_LOCATION),
        errorMessage: encodeURIComponent(errorMsg),
        errorStack: errorObj,
        browserInfo: ConstInfo.BROWSER_INFO,
        platformType: MonitorDeviceInfo.os || "web",
        webMonitorId: ConstInfo.WEB_MONITOR_ID
      };
      uploadMessage(JS_ERROR, logParams);
    };
    ////////////////////////////访问记录监控开始////////////////////////////////
    // 启动记录PV&UV
    recordPV(AnalyseLocationInfo, uploadMessage);

    /////////////////////////js错误监控开始//////////////////////////////////
    // 重写console.error, 可以捕获页面加载时候的报错
    var oldError = console.error;
    console.error = function () {
      // arguments的长度为2时，才是error上报的时机
      // if (arguments.length < 2) return;
      var errorMsg = arguments[0] && arguments[0].message;
      var url = WEB_LOCATION;
      var lineNumber = 0;
      var columnNumber = 0;
      var errorObj = arguments[0] && arguments[0].stack;
      if (!errorObj) errorObj = arguments[0];
      // 如果onerror重写成功，就无需在这里进行上报了
      !jsMonitorStarted && siftAndMakeUpMessage(errorMsg, url, lineNumber, columnNumber, errorObj);
      return oldError.apply(console, arguments);
    };

    window.onerror = function(errorMsg, url, lineNumber, columnNumber, errorObj)
    {
      var errorStack = errorObj ? errorObj.stack : null
      jsMonitorStarted = true;
      siftAndMakeUpMessage(errorMsg, url, lineNumber, columnNumber, errorStack);
    };
    //-----------------------js错误监控结束-------------------------------//
    ////////////////////////http请求监控开始////////////////////////////////


    // 监听ajax的状态
    function ajaxEventTrigger(event) {
      var ajaxEvent = new CustomEvent(event, {
        detail: this
      });
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
      return realXHR;
    }

    var timeRecordArray = [];
    window.XMLHttpRequest = newXHR;
    window.addEventListener('ajaxReadyStateChange', function(e) {
      var tempHttpUrl = e.detail.responseURL;
      if (!tempHttpUrl) {
        var tempObj = {
          timeStamp: new Date().getTime(),
          event: e
        }
        timeRecordArray.push(tempObj)
      }
    });

    window.addEventListener('ajaxLoadEnd', function(e) {
      for (var i = 0; i < timeRecordArray.length; i ++) {
        if (timeRecordArray[i].event.detail.status == 200) {
          var tempHttpUrl = timeRecordArray[i].event.detail.responseURL;
          var loadTime = '' + ((new Date().getTime() - timeRecordArray[i].timeStamp)/1000);
          var createTime = new Date().toString();
          var uploadType = HTTP_LOG;
          var url = WEB_LOCATION;
          var simpleUrl = url && url.split('?')[0];
          var logParams = {
            uploadType: encodeURIComponent(uploadType),
            happenTime: new Date().getTime(),
            createTime: encodeURIComponent(createTime),
            loadTime: encodeURIComponent(loadTime),
            httpUrl: encodeURIComponent(tempHttpUrl),
            location: encodeURIComponent(url),
            simpleUrl: simpleUrl,
            webMonitorId: ConstInfo.WEB_MONITOR_ID,
            customerKey: ConstInfo.CUSTOMER_KEY
          };
          if (!tempHttpUrl || tempHttpUrl.indexOf(ConstInfo.WEB_MONITOR_IGNORE_URL) != -1) continue;
          uploadMessage(HTTP_LOG, logParams);
          // 当前请求成功后就在数组中移除掉
          timeRecordArray.splice(i, 1);
        }
      }

    });

    window.addEventListener('ajaxError', function(e) {
      var uploadType = HTTP_ERROR;
      var httpStatus = null;
      var url = WEB_LOCATION;
      if (e._args) {
        if (e._args[2] === 'abort') {
          httpStatus = 'abort';
        } else {
          if (e._args[2] === 'timeout') {
            httpStatus = 'timeout';
          } else {
            httpStatus = e._args[0].status;
          }
        }
        fetchHttpUrl = e._args[1].url;
        if (!fetchHttpUrl) fetchHttpUrl = e.detail.responseURL;
        if (fetchHttpUrl.indexOf(ConstInfo.WEB_MONITOR_IGNORE_URL) != -1) return;
      } else {
        httpStatus = 'offline';
      }
      var createTime = new Date().toString();
      var logParams = {
        uploadType: encodeURIComponent(uploadType),
        happenTime: new Date().getTime(),
        createTime: encodeURIComponent(createTime),
        httpStatus: encodeURIComponent(httpStatus),
        httpUrl: encodeURIComponent(fetchHttpUrl),
        location: encodeURIComponent(url),
        webMonitorId: ConstInfo.WEB_MONITOR_ID
      };
      uploadMessage(HTTP_ERROR, logParams);
    });
    //---------------------------请求监控结束----------------------------//


  } catch (e) {
    console.error(e, '上报信息无法解析')
  }
}

/**
 *
 * @param method  请求类型(大写)  GET/POST
 * @param url     请求URL
 * @param param   请求参数
 * @param successCallback  成功回调方法
 * @param failCallback   失败回调方法
 */
function monitor_ajax(method, url, param, successCallback, failCallback) {
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
/**
 * 获取用户访问量相关信息
 * !!! 如果访问了新的页面，就立刻上传， 因为在有些低端机上会在打开app第三方功能的时候自动销毁浏览器，导致信息记录不完整
 */
function recordPV(AnalyseLocationInfo) {
  var SCAN_TIME = 'SCAN_TIME'; // 日志类型
  var LOOP_TIME = 1000;   // 循环记录页面行为的时间间隔
  var utils = new MonitorUtils();
  var ConstInfo = new ConstInfomation();
  var Device = new MonitorDevice();
  var defaultLocation = window.location.href.split('?')[0].replace('#', '');
  var pageKey = utils.guid();
  var happenTime = new Date().getTime();
  var createTime = new Date().toString();
  var country = "中国";
  var province = "";
  var city = "";
  var monitorIp = "";
  var logParams = {
    uploadType: SCAN_TIME,
    happenTime: happenTime,
    createTime: encodeURIComponent(createTime),
    customerKey: ConstInfo.CUSTOMER_KEY,
    pageKey: pageKey,
    webMonitorId: ConstInfo.WEB_MONITOR_ID,
    simpleUrl: defaultLocation,
    location: defaultLocation,
    country: country,
    province: province,
    city: city,
    monitorIp: monitorIp,
    platform: Device.os || 'web',
    platformVersion: Device.osVersion || '',
    deviceName: Device.deviceName || '',
    browserName: Device.browserName || '',
    browserVersion: Device.browserVersion || '',
    loadType: 'none',
    loadTime: 0
  };
  var wmInitUser = localStorage.wmInitUser ? JSON.parse(localStorage.wmInitUser) : {};
  var http_api = ConstInfo.HTTP_UPLOAD_URI + ConstInfo.HTTP_UPLOAD_LOG_INFO;
  logParams.customerKey = ConstInfo.CUSTOMER_KEY;
  logParams.userId = wmInitUser.userId || '';
  logParams.userName = wmInitUser.userName || '';
  logParams.userType = wmInitUser.userType || '';
  // 如果获取到IP地址，则立即上传， 如果没有则两秒后再次获取，如果还没有,也直接上传了
  if (localStorage.monitorAddress) {
    var monitorAddressArray = localStorage.monitorAddress.split('$$$');
    logParams.province = monitorAddressArray[0] || '';
    logParams.monitorIp = monitorAddressArray[1] || '';
    monitor_ajax("POST", http_api, [logParams], function () {});
  } else {
    setTimeout(function() {
      if (localStorage.monitorAddress) {
        var monitorAddressArray = localStorage.monitorAddress.split('$$$');
        logParams.province = monitorAddressArray[0] || '';
        logParams.monitorIp = monitorAddressArray[1] || '';
      }
      monitor_ajax("POST", http_api, [logParams], function () {});
    }, 2000)
  }

  setInterval(function () {
    // 如果是单页应用， 只更改url
    var webLocation = window.location.href.split('?')[0].replace('#', '');
    // 如果url变化了， 就把更新的url记录为 defaultLocation
    if (defaultLocation != webLocation) {
      createTime = new Date().toString();
      happenTime = new Date().getTime();
      pageKey = utils.guid();
      logParams.pageKey = pageKey;
      logParams.createTime = createTime;
      logParams.happenTime = happenTime;
      logParams.simpleUrl = webLocation;
      logParams.location = webLocation;
      monitor_ajax("POST", http_api, [logParams], function () {});
      defaultLocation = webLocation;
    }
  }, LOOP_TIME);

  // addLoadEvent(function () {
  //   if (!resourcesObj) {
  //     logParams.loadType = "none";
  //     logParams.loadTime = 0;
  //   } else {
  //     var loadType = "load";
  //     if (resourcesObj[0].type === 'navigate') {
  //       loadType = "load";
  //     } else {
  //       loadType = "reload";
  //     }
  //     logParams.loadType = loadType;
  //     logParams.loadTime = (timingObj.loadEventStart - timingObj.navigationStart)/1000;
  //   }
  //   uploadMessage(SCAN_TIME, logParams);
  // })
}
/**
 * 分析用户的地址
 * @returns {{country: string, province: string, city: string, monitorIp: string, ipAddress: string}}
 * @constructor
 */
function AnalyseLocation() {
  var GET_ADDRESS_URL = 'pv.sohu.com/cityjson?ie=utf-8';
  var province = "";
  var monitorIp = "";
  // 分析ip地址
  analyseIp();
  function analyseIp() {
    if (!localStorage.monitorAddress) {
      loadJs(WEB_HTTP_TYPE + GET_ADDRESS_URL, function () {
        getPosition()
      })
    } else {
      var monitorAddressArray = localStorage.monitorAddress.split('$$$');
      province = monitorAddressArray[0] || '';
      monitorIp = monitorAddressArray[1] || '';
    }
  }

  function getPosition() {
    province = returnCitySN.cname || '';
    monitorIp = returnCitySN.cip || '';
    if (!province && !monitorIp) return;
    window.localStorage.monitorAddress = province + "$$$" + monitorIp;
  }

  return {
    country: '中国',
    province: province,
    city: '',
    monitorIp: monitorIp,
    ipAddress: ''
  }
}
function loadJs(url, callback) {
  var script = document.createElement('script');
  script.async = 1;
  script.src = url;
  script.onload = callback;
  var dom = document.getElementsByTagName('script')[0];
  dom.parentNode.insertBefore(script, dom);
  return dom;
}
/**
 * 获取设备信息
 */
function MonitorDevice() {
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

function addLoadEvent(func){
  var oldonload = window.onload; //把现在有window.onload事件处理函数的值存入变量oldonload。
  if(typeof window.onload != 'function'){ //如果这个处理函数还没有绑定任何函数，就像平时那样把新函数添加给它
    window.onload = func;
  }else{ //如果在这个处理函数上已经绑定了一些函数。就把新函数追加到现有指令的末尾
    window.onload = function(){
      oldonload();
      func();
    }
  }

}

window.webfunny = {
  /**
   * 埋点上传数据
   * @param url 当前页面的url
   * @param type 埋点类型
   * @param index 埋点顺序
   * @param description 其他信息描述
   */
  wm_upload: function (url, type, index, description) {
    var ConstInfo = new ConstInfomation();
    var createTime = new Date().toString();
    var logParams = {
      createTime: encodeURIComponent(createTime),
      happenTime: new Date().getTime(),
      uploadType: 'WM_UPLOAD',
      simpleUrl: encodeURIComponent(url),
      webMonitorId: ConstInfo.WEB_MONITOR_ID,
      recordType: type,
      recordIndex: index,
      description: description
    };
    var http_api = ConstInfo.HTTP_UPLOAD_URI + ConstInfo.HTTP_UPLOAD_RECORD_DATA;
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
  wm_init_user: function (userId, userName, userTpye) {
    if (!userId) {console.warn('userId 初始化值为0(不推荐) 或者 未初始化')}
    if (!userName) {console.warn('userName 初始化值为0(不推荐) 或者 未初始化')}
    if (!userTpye) {console.warn('userTpye 初始化值为0(不推荐) 或者 未初始化')}
    localStorage.wmInitUser = JSON.stringify({
      userId: userId,
      userName: userName,
      userType: userTpye
    })
  }
};

// polyfile 如果不支持 window.CustomEvent
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

new InitMonitor();
