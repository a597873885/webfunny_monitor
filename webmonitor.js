// var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);
var Base64String={compressToUTF16:function(input){var output=[],i,c,current,status=0;input=this.compress(input);for(i=0;i<input.length;i++){c=input.charCodeAt(i);switch(status++){case 0:output.push(String.fromCharCode((c>>1)+32));current=(c&1)<<14;break;case 1:output.push(String.fromCharCode((current+(c>>2))+32));current=(c&3)<<13;break;case 2:output.push(String.fromCharCode((current+(c>>3))+32));current=(c&7)<<12;break;case 3:output.push(String.fromCharCode((current+(c>>4))+32));current=(c&15)<<11;break;case 4:output.push(String.fromCharCode((current+(c>>5))+32));current=(c&31)<<10;break;case 5:output.push(String.fromCharCode((current+(c>>6))+32));current=(c&63)<<9;break;case 6:output.push(String.fromCharCode((current+(c>>7))+32));current=(c&127)<<8;break;case 7:output.push(String.fromCharCode((current+(c>>8))+32));current=(c&255)<<7;break;case 8:output.push(String.fromCharCode((current+(c>>9))+32));current=(c&511)<<6;break;case 9:output.push(String.fromCharCode((current+(c>>10))+32));current=(c&1023)<<5;break;case 10:output.push(String.fromCharCode((current+(c>>11))+32));current=(c&2047)<<4;break;case 11:output.push(String.fromCharCode((current+(c>>12))+32));current=(c&4095)<<3;break;case 12:output.push(String.fromCharCode((current+(c>>13))+32));current=(c&8191)<<2;break;case 13:output.push(String.fromCharCode((current+(c>>14))+32));current=(c&16383)<<1;break;case 14:output.push(String.fromCharCode((current+(c>>15))+32,(c&32767)+32));status=0;break}}output.push(String.fromCharCode(current+32));return output.join("")},decompressFromUTF16:function(input){var output=[],current,c,status=0,i=0;while(i<input.length){c=input.charCodeAt(i)-32;switch(status++){case 0:current=c<<1;break;case 1:output.push(String.fromCharCode(current|(c>>14)));current=(c&16383)<<2;break;case 2:output.push(String.fromCharCode(current|(c>>13)));current=(c&8191)<<3;break;case 3:output.push(String.fromCharCode(current|(c>>12)));current=(c&4095)<<4;break;case 4:output.push(String.fromCharCode(current|(c>>11)));current=(c&2047)<<5;break;case 5:output.push(String.fromCharCode(current|(c>>10)));current=(c&1023)<<6;break;case 6:output.push(String.fromCharCode(current|(c>>9)));current=(c&511)<<7;break;case 7:output.push(String.fromCharCode(current|(c>>8)));current=(c&255)<<8;break;case 8:output.push(String.fromCharCode(current|(c>>7)));current=(c&127)<<9;break;case 9:output.push(String.fromCharCode(current|(c>>6)));current=(c&63)<<10;break;case 10:output.push(String.fromCharCode(current|(c>>5)));current=(c&31)<<11;break;case 11:output.push(String.fromCharCode(current|(c>>4)));current=(c&15)<<12;break;case 12:output.push(String.fromCharCode(current|(c>>3)));current=(c&7)<<13;break;case 13:output.push(String.fromCharCode(current|(c>>2)));current=(c&3)<<14;break;case 14:output.push(String.fromCharCode(current|(c>>1)));current=(c&1)<<15;break;case 15:output.push(String.fromCharCode(current|c));status=0;break}i++}return this.decompress(output.join(""))},_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decompress:function(input){var output=[];var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=1;var odd=input.charCodeAt(0)>>8;while(i<input.length*2&&(i<input.length*2-1||odd==0)){if(i%2==0){chr1=input.charCodeAt(i/2)>>8;chr2=input.charCodeAt(i/2)&255;if(i/2+1<input.length){chr3=input.charCodeAt(i/2+1)>>8}else{chr3=NaN}}else{chr1=input.charCodeAt((i-1)/2)&255;if((i+1)/2<input.length){chr2=input.charCodeAt((i+1)/2)>>8;chr3=input.charCodeAt((i+1)/2)&255}else{chr2=chr3=NaN}}i+=3;enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)||(i==input.length*2+1&&odd)){enc3=enc4=64}else{if(isNaN(chr3)||(i==input.length*2&&odd)){enc4=64}}output.push(this._keyStr.charAt(enc1));output.push(this._keyStr.charAt(enc2));output.push(this._keyStr.charAt(enc3));output.push(this._keyStr.charAt(enc4))}return output.join("")},compress:function(input){var output=[],ol=1,output_,chr1,chr2,chr3,enc1,enc2,enc3,enc4,i=0,flush=false;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(i<input.length){enc1=this._keyStr.indexOf(input.charAt(i++));enc2=this._keyStr.indexOf(input.charAt(i++));enc3=this._keyStr.indexOf(input.charAt(i++));enc4=this._keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;if(ol%2==0){output_=chr1<<8;flush=true;if(enc3!=64){output.push(String.fromCharCode(output_|chr2));flush=false}if(enc4!=64){output_=chr3<<8;flush=true}}else{output.push(String.fromCharCode(output_|chr1));flush=false;if(enc3!=64){output_=chr2<<8;flush=true}if(enc4!=64){output.push(String.fromCharCode(output_|chr3));flush=false}}ol+=3}if(flush){output.push(String.fromCharCode(output_));output=output.join("");output=String.fromCharCode(output.charCodeAt(0)|256)+output.substring(1)}else{output=output.join("")}return output}};
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

    // onerror 错误监控启动状态
    ,jsMonitorStarted = false

    // 上传日志的开关，如果为false，则不再上传
    , uploadRemoteServer = true

    // 判断html2canvas是否加载完成
    , html2CanvasLoaded = false

    // 保存已经发生错误的errorMsg, 同一个错误，只保存一次截图
    , screenShotErrorMsgs = []

    // 屏幕截图字符串
    , tempScreenShot = "";

  /** 常量 **/
  var
    // 所属项目ID, 用于替换成相应项目的UUID，生成监控代码的时候搜索替换
    WEB_MONITOR_ID = 'jeffery_webmonitor'

    // 判断是http或是https的项目
    , WEB_HTTP_TYPE = window.location.href.indexOf('https') === -1 ? 'http://' : 'https://'

    // 获取当前页面的URL
    , WEB_LOCATION = window.location.href

    // 本地IP, 用于区分本地开发环境
    , WEB_LOCAL_IP = 'localhost'

    // 监控平台地址
    , WEB_MONITOR_IP = 'www.webfunny.cn'

    // 上传数据的uri, 区分了本地和生产环境
    , HTTP_UPLOAD_URI =  WEB_LOCATION.indexOf(WEB_LOCAL_IP) == -1 ? WEB_HTTP_TYPE + WEB_MONITOR_IP : WEB_HTTP_TYPE + WEB_LOCAL_IP + ':8010'

    // 上传数据时忽略的uri, 需要过滤掉监控平台上传接口
    , WEB_MONITOR_IGNORE_URL = HTTP_UPLOAD_URI + '/api/v1/uploadLog'

    // 上传数据的接口
    , HTTP_UPLOAD_LOG_INFO = HTTP_UPLOAD_URI + '/api/v1/uploadLog'

    // 获取当前项目的参数信息的接口
    , HTTP_PROJECT_INFO = HTTP_UPLOAD_URI + '/server/project/getProject'

    // 上传埋点数据接口
    , HTTP_UPLOAD_RECORD_DATA = HTTP_UPLOAD_URI + ''

    // 用户访问日志类型
    , CUSTOMER_PV = 'CUSTOMER_PV'

    // 接口日志类型
    , HTTP_LOG = 'HTTP_LOG'

    // 接口错误日志类型
    , HTTP_ERROR = 'HTTP_ERROR'

    // js报错日志类型
    , JS_ERROR = 'JS_ERROR'

    // 用户的行为类型
    , ELE_BEHAVIOR = 'ELE_BEHAVIOR'

    // 浏览器信息
    , BROWSER_INFO = window.navigator.userAgent

    // 工具类示例化
    , utils = new MonitorUtils()

    // 设备信息
    , DEVICE_INFO = utils.getDevice()

    // 监控代码空构造函数
    , WebMonitor = {}

    // 获取用户自定义信息
    , USER_INFO = localStorage.wmInitUser ? JSON.parse(localStorage.wmInitUser) : {};




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
        case CUSTOMER_PV:
          localStorage[CUSTOMER_PV] = tempString + JSON.stringify(logInfo) + '$$$';
          break;
        default: break;
      }
      console.log(logInfo)
      console.log(localStorage[JS_ERROR])
    };
  }
  // 设置日志对象类的通用属性
  function setCommonProperty() {
    this.happenTime = new Date().getTime(); // 日志发生时间
    this.webMonitorId = WEB_MONITOR_ID;     // 用于区分应用的唯一标识（一个项目对应一个）
    this.simpleUrl =  window.location.href.split('?')[0].replace('#', ''); // 页面的url
    this.customerKey = utils.getCustomerKey(); // 用于区分用户，所对应唯一的标识，清理本地数据后失效，
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
    // 用户自定义信息， 由开发者主动传入， 便于对线上进行准确定位
    this.userId = USER_INFO.userId;
    this.firstUserParam = USER_INFO.firstUserParam;
    this.secondUserParam = USER_INFO.secondUserParam;
  }
  // 用户访问行为日志(PV)
  function CustomerPV(uploadType, loadType, loadTime) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.loadType = loadType;  // 用以区分首次加载
    this.loadTime = loadTime; // 加载时间
  }
  CustomerPV.prototype = new MonitorBaseInfo();
  // 用户行为日志，继承于日志基类MonitorBaseInfo
  function BehaviorInfo(uploadType, behaviorType, className, placeholder, inputValue, tagName, innerText) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.behaviorType = behaviorType;
    this.className = className;
    this.placeholder = placeholder;
    this.inputValue = inputValue;
    this.tagName = tagName;
    this.innerText = innerText;
  }
  BehaviorInfo.prototype = new MonitorBaseInfo();

  // JS错误日志，继承于日志基类MonitorBaseInfo
  function JavaScriptErrorInfo(uploadType, errorMsg, errorStack) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.errorMessage = encodeURIComponent(errorMsg);
    this.errorStack = errorStack;
    this.browserInfo = BROWSER_INFO;
  }
  JavaScriptErrorInfo.prototype = new MonitorBaseInfo();

  // JS错误截图，，继承于日志基类MonitorBaseInfo
  function ScreenShotInfo(uploadType, errorMsg, screenInfo) {
    setCommonProperty.apply(this);
    this.uploadType = uploadType;
    this.errorMessage = encodeURIComponent(errorMsg);
    this.screenInfo = screenInfo;
  }
  JavaScriptErrorInfo.prototype = new MonitorBaseInfo();
  /**
   * 监控初始化配置, 以及启动的方法
   */
  function init() {

    // TODO 获取项目信息， 用于获取过滤域名，判断是否开启测试模式
    // utils.ajax("POST", HTTP_PROJECT_INFO, {webMonitorId: WEB_MONITOR_ID}, function (res) {
    //   if (res.status === 0) {
    //     var project = res.data.project;
    //     // 总开关，判断是否开启记录功能 1记录/0不记录
    //     if (!project || !project.recording || project.recording != 1) {
    //       uploadRemoteServer = false;
    //       return;
    //     }
    //     // 通过项目配置的过滤域名，决定是否开启监控
    //     var FILTER_TYPE = project.filterType;
    //     var FILTER_DOMAIN = project.filterDomain;
    //     if (FILTER_TYPE === "include" && WEB_LOCATION.indexOf(FILTER_DOMAIN) != -1) {
    //       uploadRemoteServer = true;
    //     } else if (FILTER_TYPE === "exclude" && WEB_LOCATION.indexOf(FILTER_DOMAIN) == -1) {
    //       uploadRemoteServer = true;
    //     }
    //     // 如果开关为关闭状态，则不启动记录监控
    //     if (uploadRemoteServer === false) return;
    //     // 启动PV记录监控
    //     recordPV();
    //     // 启动行为记录监控
    //     recordBehavior(project);
    //     // 启动接口日志记录监控
    //
    //     // 启动JS错误记录监控
    //
    //   } else {
    //     console.error("未获取到项目信息");
    //   }
    // });
    // 启动测试
    recordPV();
    recordBehavior({record: 1});
    recordJavaScriptError();
    utils.loadJs("//html2canvas.hertzen.com/dist/html2canvas.min.js",function () {
      html2CanvasLoaded = true;
    });

    /**
     * 添加一个定时器，进行数据的上传
     * 3秒钟进行一次URL是否变化的检测
     * 10秒钟进行一次数据的检查并上传
     */
    var defaultLocation = window.location.href.split('?')[0].replace('#', '');
    var timeCount = 0;
    setInterval(function () {
      // 如果是单页应用， 只更改url
      var webLocation = window.location.href.split('?')[0].replace('#', '');
      // 如果url变化了， 就把更新的url记录为 defaultLocation, 重新设置pageKey
      if (defaultLocation != webLocation) {
        recordPV();
        defaultLocation = webLocation;
      }
      // 循环5后次进行一次上传
      if (timeCount >= 5) {
        var logInfo = (localStorage[ELE_BEHAVIOR] || "") +
          (localStorage[JS_ERROR] || "") +
          (localStorage[CUSTOMER_PV] || "");
        if (logInfo) {
          utils.ajax("POST", HTTP_UPLOAD_LOG_INFO, {logInfo: logInfo}, function (res) {
            // 上传完成后，清空本地记录
            if (res.code === 200) {
              localStorage[ELE_BEHAVIOR] = "";
              localStorage[JS_ERROR] = "";
              localStorage[CUSTOMER_PV] = "";
            }
          }, function () {
            localStorage[ELE_BEHAVIOR] = "";
            localStorage[JS_ERROR] = "";
            localStorage[CUSTOMER_PV] = "";
          })
        }
        timeCount = 0;
      }
      timeCount ++;
    }, 2000);
  }

  /**
   * 用户访问记录监控
   * @param project 项目详情
   */
  function recordPV() {
    utils.setPageKey();
    const customerPv = new CustomerPV(CUSTOMER_PV, "none", 0);
    customerPv.handleLogInfo(CUSTOMER_PV, customerPv);
  }
  /**
   * 页面JS错误监控
   */
  function recordJavaScriptError() {
    // 重写console.error, 可以捕获更全面的报错信息
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
      // console.log("--------------------")
      // console.log(errorMsg, url, lineNumber, columnNumber, errorObj)
      !jsMonitorStarted && siftAndMakeUpMessage(errorMsg, url, lineNumber, columnNumber, errorObj);
      return oldError.apply(console, arguments);
    };
    // 重写 onerror 进行jsError的监听
    window.onerror = function(errorMsg, url, lineNumber, columnNumber, errorObj)
    {
      // console.log("===================")
      // console.log(errorMsg, url, lineNumber, columnNumber, errorObj)
      jsMonitorStarted = true;
      var errorStack = errorObj ? errorObj.stack : null;
      siftAndMakeUpMessage(errorMsg, url, lineNumber, columnNumber, errorStack);
    };

    function siftAndMakeUpMessage(origin_errorMsg, origin_url, origin_lineNumber, origin_columnNumber, origin_errorObj) {
      var errorMsg = origin_errorMsg ? origin_errorMsg : '';
      var errorObj = origin_errorObj ? origin_errorObj : '';
      var errorType = "";
      if (errorMsg) {
        var errorStackStr = JSON.stringify(errorObj)
        errorType = errorStackStr.split(": ")[0].replace('"', "");
      }
      var javaScriptErrorInfo = new JavaScriptErrorInfo(JS_ERROR, errorType + ": " + errorMsg, errorObj);
      if (html2CanvasLoaded) {
        setTimeout(function () {
          utils.screenShot(document.body, function (dataUrl) {
            document.getElementById("testImg").src = "data:image/png;base64," + Base64String.decompress(dataUrl)
            javaScriptErrorInfo.screenShot = dataUrl;
            javaScriptErrorInfo.handleLogInfo(JS_ERROR, javaScriptErrorInfo);
          });
        }, 200)
      } else {
        javaScriptErrorInfo.handleLogInfo(JS_ERROR, javaScriptErrorInfo);
      }
    };
  };
  /**
   * 用户行为记录监控
   * @param project 项目详情
   */
  function recordBehavior(project) {
    // 行为记录开关
    if (project && project.record && project.record == 1) {
      // 记录用户点击元素的行为数据
      document.onclick = function (e) {
        var className = e.target.className ? e.target.className.replace(/\s/g, '') : "";
        var placeholder = encodeURIComponent(e.target.placeholder || "");
        var inputValue = encodeURIComponent(e.target.value || "");
        var tagName = e.target.tagName;
        var innerText = encodeURIComponent(e.target.innerText.replace(/\s*/g, ""));
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
      if (!localStorage.monitorCustomerKey) localStorage.monitorCustomerKey = customerKey;
      return localStorage.monitorCustomerKey;
    };
    /**
     * 获取页面的唯一标识
     */
    this.getPageKey = function () {
      var pageKey = this.getUuid();
      if (!localStorage.monitorPageKey) localStorage.monitorPageKey = pageKey;
      return localStorage.monitorPageKey;
    };
    /**
     * 设置页面的唯一标识
     */
    this.setPageKey = function () {
      localStorage.monitorPageKey = this.getUuid();
    };
    /**
     * 封装简易的ajax请求
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
    /**
     * js处理截图
     */
    this.screenShot = function (cntElem, callback) {
      var shareContent = cntElem;//需要截图的包裹的（原生的）DOM 对象
      var width = shareContent.offsetWidth; //获取dom 宽度
      var height = shareContent.offsetHeight; //获取dom 高度
      var canvas = document.createElement("canvas"); //创建一个canvas节点
      var scale = 0.6; //定义任意放大倍数 支持小数
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
      html2canvas(cntElem, opts).then(function(canvas) {
        var dataURL = canvas.toDataURL();
        var tempCompress = dataURL.replace("data:image/png;base64,", "");
        var compressedDataURL = Base64String.compress(tempCompress);
        callback(compressedDataURL);
      });
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
          device.deviceName = "iphone X";
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
  }


  // if (!window.WebMonitor) {
  //   window.WebMonitor = WebMonitor;
  // } else {
  //   console.error("webMonitor 这个变量名已经被占用，初始化失败!");
  // }
  init();

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

