var webfunnyGlobal=window;!function(n){var o={};function r(e){var t;return(o[e]||(t=o[e]={i:e,l:!1,exports:{}},n[e].call(t.exports,t,t.exports,r),t.l=!0,t)).exports}r.m=n,r.c=o,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=8)}([function(e,t){e.exports=function(e){return e&&e.__esModule?e:{default:e}},e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WEBFUNNY_COOKIE=t.WEBFUNNY_EVENT_REQUEST_QUEUE=t.RULE_ERROR_MSG=t.RULE_TYPE=t.COMMON_FIELD=t.PROJECT_ID=void 0;t.PROJECT_ID="$$$projectId$$$",t.COMMON_FIELD={HEART_RATE:15e3},t.RULE_TYPE={REQUIRED:"required",LENGTH:"length",TYPE:"type",RANGE:"range"},t.RULE_ERROR_MSG={REQUIRED:"$field$,输入值不可为空",LENGTH:"$field$,输入超长，最大长度为$rule$",TYPE:"$field$,输入的类型不正确，应为$rule$类型",RANGE:"$field$,输入不在范围内，应在$range1$~$range2$之内",LACK:"埋点字段缺失"},t.WEBFUNNY_EVENT_REQUEST_QUEUE="WEBFUNNY_EVENT_REQUEST_QUEUE";t.WEBFUNNY_COOKIE="WEBFUNNY_COOKIE"},function(e,t,n){"use strict";var o=n(0),r=(Object.defineProperty(t,"__esModule",{value:!0}),t.isString=a,t.isNumber=u,t.isDate=c,t.isBoolean=f,t.isArray=l,t.isObject=d,t.combineObject=p,t.isJSONString=function(e){if("string"==typeof e)try{var t=JSON.parse(e);return!("object"!==(0,r.default)(t)||!t)}catch(e){return!1}},t.isEmptyObject=h,t.isEmpty=g,t.isNotEmpty=function(e){return!g(e)},t.equalsObjKeys=function(e,t){var n,o={success:!1,field:""};for(n in t){if(!Object.prototype.hasOwnProperty.call(e,n))return o.success=!1,o.field=n,o;o.success=!0}return o},t.setCookie=function(e,t,n){document.cookie=e+"="+t+"; expires="+n},t.getCookie=function(e){for(var t=e+"=",n=document.cookie.split(";"),o=0,r=n.length;o<r;o++){var i=n[o].trim();if(0===i.indexOf(t))return i.substring(t.length,i.length)}},t.removeEventListener=function(e,t,n){e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent?e.detachEvent("on"+t,n.bind(e)):e["on"+t]=null},t.createNewEvent=function(e){var t;"function"==typeof Event?t=new Event(e):(t={})[this.type]=e;return t},t.isDefined=y,t.b64Code=w,t.getElementsWithAttribute=function(e,t){t=t||document;if(y(t.querySelectorAll))return t.querySelectorAll("["+e+"]");for(var n=[],o=t.getElementsByTagName("*"),r=0,i=o.length;r<i;r++){var s=o[r];null!==s.getAttribute(e)&&n.push(s)}return n},t.setWfCookie=b,t.getWfCookie=m,t.getUuid=v,t.getKeyByWebMonitorId=E,t.getWebMonitorId=O,t.getCustomerKey=_,t.getLastHeartBeatTime=N,t.getWeUserInfo=R,t.getPath=function(){var e="";{var t;window?e=window?window.location.href.split("?")[0]:"":getCurrentPages&&0<(t=getCurrentPages()).length&&(e=getCurrentPages()[t.length-1].route)}return e},t.getNewStatus=function(){var e=m("monitorCustomerKey");{var t,n;e?(t="",(e=e?e.match(/\d{14}/g):[])&&0<e.length&&(e=e[0].match(/\d{2}/g),e=e[0]+e[1]+"-"+e[2]+"-"+e[3],n=(new Date).Format("yyyy-MM-dd"),t=e===n?1:2)):t=1}return t},t.getDeviceInfo=function(){{if(window){var e={},t=navigator.userAgent,n=t.match(/(Android);?[\s\/]+([\d.]+)?/),o=t.match(/(iPad).*OS\s([\d_]+)/),r=!o&&t.match(/(iPhone\sOS)\s([\d_]+)/),i=t.match(/Android\s[\S\s]+Build\//),s=window.screen.width,a=window.screen.height;if(e.ios=e.android=e.iphone=e.ipad=e.androidChrome=!1,e.isWeixin=/MicroMessenger/i.test(t),e.os="web",e.deviceName="PC",e.deviceSize=s+"×"+a,e.platform=navigator.platform,n&&(e.os="android",e.osVersion=n[2],e.android=!0,e.androidChrome=0<=t.toLowerCase().indexOf("chrome")),(o||r)&&(e.os="ios",e.ios=!0),r&&(e.osVersion=r[2].replace(/_/g,"."),e.iphone=!0),o&&(e.osVersion=o[2].replace(/_/g,"."),e.ipad=!0),e.ios&&e.osVersion&&0<=t.indexOf("Version/")&&"10"===e.osVersion.split(".")[0]&&(e.osVersion=t.toLowerCase().split("version/")[1].split(" ")[0]),e.iphone){var n="".concat(s," x ").concat(a);320===s&&480===a?n="4":320===s&&568===a?n="5/SE":375===s&&667===a?n="6/7/8":414===s&&736===a?n="6/7/8 Plus":375===s&&812===a?n="X/S/Max":414===s&&896===a?n="11/Pro-Max":375===s&&812===a?n="11-Pro/mini":390===s&&844===a?n="12/13/Pro":428===s&&926===a&&(n="12/13/Pro-Max"),e.deviceName="iphone "+n}else if(e.ipad)e.deviceName="ipad";else if(i){for(var u=i[0].split(";"),c="",f=0;f<u.length;f++)-1!=u[f].indexOf("Build")&&(c=u[f].replace(/Build\//g,""));""==c&&(c=u[1]),e.deviceName=c.replace(/(^\s*)|(\s*$)/g,"")}return-1==t.indexOf("Mobile")&&(r=navigator.userAgent.toLowerCase(),e.browserName="其他",o="",0<r.indexOf("msie")?(o=r.match(/msie [\d.]+;/gi)[0],e.browserName="ie",e.browserVersion=o.split("/")[1]):0<r.indexOf("edg")?(o=r.match(/edg\/[\d.]+/gi)[0],e.browserName="edge",e.browserVersion=o.split("/")[1]):0<r.indexOf("firefox")?(o=r.match(/firefox\/[\d.]+/gi)[0],e.browserName="firefox",e.browserVersion=o.split("/")[1]):0<r.indexOf("safari")&&r.indexOf("chrome")<0?(o=r.match(/safari\/[\d.]+/gi)[0],e.browserName="safari",e.browserVersion=o.split("/")[1]):0<r.indexOf("chrome")&&(o=r.match(/chrome\/[\d.]+/gi)[0],e.browserName="chrome",e.browserVersion=o.split("/")[1],0<r.indexOf("360se"))&&(e.browserName="360")),{deviceName:e.deviceName,system:"".concat(e.os," ").concat(e.osVersion||""),os:e.os,platform:e.platform,browserName:e.browserName}}return n=a=s="",webfunnyGlobal&&(i=webfunnyGlobal.getSystemInfoSync()||{},s=i.model,a=i.system,n=i.platform),t="",1<(o=a.split(" ")).length&&(t=o[0]),{deviceName:s,system:a,os:t,platform:n}}},t.setFirstActionTime=T,t.getFirstActionTime=x,t.addEventListener=function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent?e.attachEvent("on"+t,n):e["on"+t]=n},t.default=void 0,o(n(3))),i=o(n(12)),s=(n(13),n(1));function a(e){return"[object String]"===Object.prototype.toString.apply(e)}function u(e){return"[object Number]"===Object.prototype.toString.apply(e)}function c(e){return"[object Date]"===Object.prototype.toString.apply(e)}function f(e){return"[object Boolean]"===Object.prototype.toString.apply(e)}function l(e){return"[object Array]"===Object.prototype.toString.apply(e)}function d(e){return"[object Object]"===Object.prototype.toString.apply(e)}function p(e,t){return(0,i.default)(e,t)}function h(e){return d(e)&&"{}"===JSON.stringify(e)}function g(e){return!e||"null"===String(e).toLowerCase()||"undefined"===String(e).toLowerCase()||l(e)&&!e.length||h(e)}function y(e){return"undefined"!==(0,r.default)(e)}function w(e){var t=encodeURIComponent(e);try{if(window)return btoa(encodeURIComponent(t).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}));for(var n=new Uint8Array(t.length),o=0;o<t.length;o++)n[o]=t.charCodeAt(o);return webfunnyGlobal?webfunnyGlobal.arrayBufferToBase64(n):""}catch(e){return t}}function b(e,t,n){var o,r,i;window?(o={data:t,expires:n},(r=localStorage).WEBFUNNY_COOKIE?((i=JSON.parse(r.WEBFUNNY_COOKIE))[e]=o,r.WEBFUNNY_COOKIE=JSON.stringify(i)):((i={})[e]=o,r.WEBFUNNY_COOKIE=JSON.stringify(i))):webfunnyGlobal&&(o={data:t,expires:n},(r=webfunnyGlobal.getStorageSync(s.WEBFUNNY_COOKIE))?(r[e]=o,webfunnyGlobal.setStorageSync(s.WEBFUNNY_COOKIE,r)):((i={})[e]=o,webfunnyGlobal.setStorageSync(s.WEBFUNNY_COOKIE,i)))}function m(e){var t;if(window)return n=null,(o=localStorage).WEBFUNNY_COOKIE&&(t=(n=JSON.parse(o.WEBFUNNY_COOKIE))[e])?parseInt(t.expires,10)<(new Date).getTime()?(delete n[e],o.WEBFUNNY_COOKIE=JSON.stringify(n),""):t.data:"";if(webfunnyGlobal){var n,o=webfunnyGlobal.getStorageSync(s.WEBFUNNY_COOKIE);if(o)return(n=o[e])?parseInt(n.expires,10)<(new Date).getTime()?(delete o[e],webfunnyGlobal.setStorageSync(s.WEBFUNNY_COOKIE,o),""):n.data:""}return""}function v(){var e=(new Date).Format("yyyyMMddhhmmssS");return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})+"-"+e}function E(e){var t="",n="old",o=v(),r=m("monitorCustomerKeys"),i=(new Date).getTime()+31104e7;return r?(r=JSON.parse(r))[e]?t=r[e]:(r[e]=o,b("monitorCustomerKeys",JSON.stringify(r),i),t=o,n="new"):((r={})[e]=o,b("monitorCustomerKeys",JSON.stringify(r),i),t=o,n="new"),{customerKey:t,status:n}}function O(){return s.PROJECT_ID}function _(){return E(O()).customerKey}function N(e){var t=(new Date).getTime(),n=m("lastHearBeatTime");return n&&1!==e||(b("lastHearBeatTime",t,t+s.COMMON_FIELD.HEART_RATE+5e3),n=t),n}function R(e){var t="";if(window){var n=localStorage;if(!e)return"";t=(n.wmUserInfo?JSON.parse(n.wmUserInfo):{})[e]}else{if(!e)return"";webfunnyGlobal&&(t=((n=webfunnyGlobal.getStorageSync("wmUserInfo"))?JSON.parse(n):{})[e])}return t||""}function T(e){for(var t=m("weFunnelConfig").funnelList,n=void 0===t?[]:t,o=0;o<n.length;o++){var r=n[o],i=r.s,i=void 0===i?"":i,s=r.c,s=void 0===s?"":s,r=r.t,r=void 0===r?1:r,r=(new Date).getTime()+24*r*3600*1e3;-1!==i.indexOf(+e)&&(i=(new Date).Format("yyyyMMdd"),b("".concat(s,"-FirstStepDay"),"".concat(s,"-").concat(i),r))}}function x(e){for(var t=m("weFunnelConfig").funnelList,n=void 0===t?[]:t,o="",r=0;r<n.length;r++){var i=n[r],s=i.s,s=void 0===s?"":s,i=i.c,i=void 0===i?"":i;-1!==s.indexOf(+e)&&(o+=m("".concat(i,"-FirstStepDay"))+",")}return o}t.default={isString:a,isNumber:u,isArray:l,isObject:d,isDate:c,isBoolean:f,getUuid:v,getWfCookie:m,setWfCookie:b,b64Code:w,combineObject:p,getCustomerKey:_,getLastHeartBeatTime:N,getWeUserInfo:R,setFirstActionTime:T,getFirstActionTime:x}},function(t,e){function n(e){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=n=function(e){return typeof e}:t.exports=n=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t.exports.default=t.exports,t.exports.__esModule=!0,n(e)}t.exports=n,t.exports.default=t.exports,t.exports.__esModule=!0},function(e,t,n){"use strict";var o=n(0),s=n(3),r=(Object.defineProperty(t,"__esModule",{value:!0}),t.getCurTrackUrl=f,t.getEventDomain=function(){var e=i.default.eventDomain;{var t;return!window||(t=(t=window.location.protocol).replace(/file/g,"http"),-1<e.indexOf("http"))?e:t+e}},t.sendXmlHttpRequest=d,t.weAjax=function(e,t,n,o,r){if(window)try{var i,s=window.XMLHttpRequest?new XMLHttpRequest:new window.ActiveXObject("Microsoft.XMLHTTP"),a=(s.open(e,t,!0),s.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),s.onreadystatechange=function(){if(4==s.readyState){var t={};try{t=s.responseText?JSON.parse(s.responseText):{}}catch(e){t={}}"function"==typeof o&&o(t)}},s.onerror=function(){"function"==typeof r&&r()},"");for(i in n)a+="".concat(i,"=").concat(n[i]);s.send(a)}catch(e){}},t.xhrDelegate=function(e){{var t;window&&(t=window.localStorage.getItem(u.WEBFUNNY_EVENT_REQUEST_QUEUE)||"[]",20<=(t=JSON.parse(t)).length?d(t):(t.push(e),window.localStorage.setItem(u.WEBFUNNY_EVENT_REQUEST_QUEUE,JSON.stringify(t))))}},t.getRequest=function(e){var t,n="";for(t in e){var o=e[t];o=((0,a.isString)(o)||(0,a.isNumber)(o)||(0,a.isBoolean)(o)||(o=JSON.stringify(o)),encodeURIComponent(o)),n+="&".concat(t,"=").concat(o)}return n.substr(1)},t.sendRequest=function(e){var t=i.default.requestMethod;window&&e?"POST"===t?d(e,function(){},function(e){console.log(e)}):l(e):e&&(t=i.default.trackUrl,webfunnyGlobal)&&webfunnyGlobal.request({url:t,data:e,method:"POST",header:{"content-type":"application/json; charset=UTF-8"},success:function(){}})},t.storeLogs=function(e){window&&(0,r.default)(window.WEBFUNNY_EVENT_LOG_ARRAY)?window.WEBFUNNY_EVENT_LOG_ARRAY.push(e):webfunnyGlobal&&webfunnyGlobal.WEBFUNNY_EVENT_LOG_ARRAY&&webfunnyGlobal.WEBFUNNY_EVENT_LOG_ARRAY.push(e)},o(n(3))),i=o(n(5)),a=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!==s(e)&&"function"!=typeof e)return{default:e};t=c(t);if(t&&t.has(e))return t.get(e);var n,o={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in e){var i;"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&((i=r?Object.getOwnPropertyDescriptor(e,n):null)&&(i.get||i.set)?Object.defineProperty(o,n,i):o[n]=e[n])}o.default=e,t&&t.set(e,o);return o}(n(2)),u=n(1);function c(e){var t,n;return"function"!=typeof WeakMap?null:(t=new WeakMap,n=new WeakMap,(c=function(e){return e?n:t})(e))}function f(){var e,t=i.default.trackUrl;return!window||(e=(e=window.location.protocol).replace(/file/g,"http"),-1<t.indexOf("http"))?t:e+t}function l(e){var t=f(),t=t+(t.indexOf("?")<0?"?":"&")+e;new Image(1,1).src=t}function d(t,e,n){var o=f();try{var r=window.XMLHttpRequest?new XMLHttpRequest:new window.ActiveXObject("Microsoft.XMLHTTP");r.open("POST",o,!0),r.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),r.onreadystatechange=function(){if(4==r.readyState){var t={};try{t=r.responseText?JSON.parse(r.responseText):{}}catch(e){t={}}"function"==typeof e&&e(t)}},r.onerror=function(){"function"==typeof n&&n()},r.send("data="+JSON.stringify(t))}catch(e){l(t)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o="$$$webfunny-event-domain$$$",r="",r=window&&0===o.length?window.location.origin:o,o={trackUrl:"".concat(r,"/tracker/upEvents"),eventDomain:r,requestMethod:"POST"};t.default=o},function(e,t,n){"use strict";window&&null==Element.prototype.getAttributeNames&&(Element.prototype.getAttributeNames=function(){for(var e=this.attributes,t=e.length,n=new Array(t),o=0;o<t;o++)n[o]=e[o].name;return n})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCustomerInfo=void 0;var c=n(2);t.getCustomerInfo=function(){var e=(0,c.getCustomerKey)(),t=(0,c.getWeUserInfo)("userId"),n=(0,c.getDeviceInfo)(),o=n.deviceName,o=void 0===o?"":o,r=n.system,r=void 0===r?"":r,i=n.os,i=void 0===i?"":i,s=n.platform,s=void 0===s?"":s,n=n.browserName,n=void 0===n?"":n,a=(0,c.getPath)(),u=(0,c.getWeUserInfo)("platform");return{weCustomerKey:e,weUserId:t,wePath:a,weDeviceName:o,wePlatform:u||s,weSystem:r,weOs:i,weBrowserName:n,weNewStatus:(0,c.getNewStatus)()}}},function(e,t,n){e.exports=n(9)},function(e,t,u){"use strict";!function(e){var t=u(0),n=u(11),o=u(4),r=u(14),i=t(u(2)),s=u(19),t=u(7),a=window||e;try{a.WEBFUNNY_EVENT_LOG_ARRAY=[],(a.WE_INIT_FLG=!1,s.getInitCf)(function(e){a.WE_INIT_FLG=!0;var e=e||{},t=e.interval,t=void 0===t?5:t,e=e.funnel,e=void 0===e?[]:e;e.length&&i.default.setWfCookie("weFunnelConfig",{funnelList:e},(new Date).getTime()+864e5),(0,s.startUploadEvent)(t)}),i.default&&(a.webfunnyEventUtils=i.default,a.webfunnyEventGetCustomerInfo=t.getCustomerInfo,a.webfunnyEventUtils.getCustomerKey(),a.webfunnyEventUtils.getLastHeartBeatTime(1)),n.validateParams&&o.storeLogs&&(a.webfunnyEventValidateParams=n.validateParams,a.webfunnyEventSendRequest=o.sendRequest,a.webfunnyEventStoreLogs=o.storeLogs,a._webfunnyEvent="$$$webfunny-event-code$$$"),(0,r.exposureObserver)()}catch(e){console.warn(e)}}.call(this,u(10))},function(e,t){var n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";var s=n(3),u=(Object.defineProperty(t,"__esModule",{value:!0}),t.validateParams=function(e,t){var n=!1,o=(0,c.equalsObjKeys)(e,t),r=o.success,o=o.field;if(n=r)for(var i in t){var s=e[i],a=t[i];if(!(n=f(s,i,a)))return n}else{r="".concat(u.RULE_ERROR_MSG.LACK," - ").concat(o);console.warn(r)}return n},t.validateHandle=f,n(1)),c=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!==s(e)&&"function"!=typeof e)return{default:e};t=a(t);if(t&&t.has(e))return t.get(e);var n,o={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in e){var i;"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&((i=r?Object.getOwnPropertyDescriptor(e,n):null)&&(i.get||i.set)?Object.defineProperty(o,n,i):o[n]=e[n])}o.default=e,t&&t.set(e,o);return o}(n(2));function a(e){var t,n;return"function"!=typeof WeakMap?null:(t=new WeakMap,n=new WeakMap,(a=function(e){return e?n:t})(e))}function f(e,t,n){var o,r=!1;for(o in n){var i=n[o];if(o===u.RULE_TYPE.REQUIRED&&i){var s,r=void 0!==e;if(!r)return s=u.RULE_ERROR_MSG.REQUIRED.replace(/\$field\$/g,t).replace(/\$rule\$/g,""),console.warn(s),r}else if(o===u.RULE_TYPE.LENGTH&&i){if(!(r=e.toString().length<=i))return s=u.RULE_ERROR_MSG.LENGTH.replace(/\$field\$/g,t).replace(/\$rule\$/g,i),console.warn(s),r}else if(o===u.RULE_TYPE.TYPE&&i){var a=c.default["is"+i];if(!(r=a(e)))return a=u.RULE_ERROR_MSG.TYPE.replace(/\$field\$/g,t).replace(/\$rule\$/g,i),console.warn(a),r}else if(o===u.RULE_TYPE.RANGE&&i){a=e>=i[0]&&e<i[1];if(!a)return i=u.RULE_ERROR_MSG.RANGE.replace(/\$field\$/g,t).replace(/\$range1\$/g,i[0]).replace(/\$range2\$/g,i[1]),console.warn(i),a}}return r}},function(e,t){function n(){return e.exports=n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n,o=arguments[t];for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n])}return e},e.exports.default=e.exports,e.exports.__esModule=!0,n.apply(this,arguments)}e.exports=n,e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t,n){"use strict";Date.prototype.Format||(Date.prototype.Format=function(e){var t,n=e,o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(t in/(y+)/.test(n)&&(n=n.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),o)new RegExp("("+t+")").test(n)&&(n=n.replace(RegExp.$1,1===RegExp.$1.length?o[t]:("00"+o[t]).substr((""+o[t]).length)));return n})},function(e,t,n){"use strict";var o=n(0),s=n(3),r=(Object.defineProperty(t,"__esModule",{value:!0}),t.bindGlobalClickEvent=v,t.startBeforeUnloadEvent=E,t.startHeartBeat=O,t.exposureObserver=void 0,n(15),n(6),function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!==s(e)&&"function"!=typeof e)return{default:e};t=c(t);if(t&&t.has(e))return t.get(e);var n,o={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in e){var i;"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&((i=r?Object.getOwnPropertyDescriptor(e,n):null)&&(i.get||i.set)?Object.defineProperty(o,n,i):o[n]=e[n])}o.default=e,t&&t.set(e,o);return o}(n(2))),i=n(16),a=o(n(17)),u=n(1);function c(e){var t,n;return"function"!=typeof WeakMap?null:(t=new WeakMap,n=new WeakMap,(c=function(e){return e?n:t})(e))}var f=null,l={},d=[],p="_webfunny-eo",h="_webfunny-ce",g=function(){var e=document.getElementsByTagName("*");Array.prototype.forEach.call(e,function(e,t){var n;(0,i.isValidNode)(e,p)&&(d.push(e),n=e.getAttribute(p))&&((0,i.setDataSetForKey)(e,t),Object.defineProperty(l,"data-exposure-key".concat(t),{value:JSON.parse(n),configureable:!0,writable:!0,enumerable:!0}))}),d=(0,i.uniqueArr)(d)},y=function(){g(),d.forEach(function(e){(0,i.hasDataSet)(e)||((0,i.setDataSet)(e),m(e))})};function w(e){var t;Object.prototype.hasOwnProperty.call(e,"pointId")?(t=e.pointId,Object.prototype.hasOwnProperty.call(window._webfunnyEvent,t)?(delete e.pointId,window._webfunnyEvent[t].trackEvent(e)):console.warn("请检查pointId上送的值是否正确")):console.warn("pointId为必须上送字段，请检查是否正确上送")}function b(){MutationObserver&&new MutationObserver(function(e){for(var t=0,n=e.length;t<n;t++)e[t].addedNodes[0]&&(0,i.isValidNode)(e[t].addedNodes[0],p)&&y(),e[t].target.querySelector("[".concat(p,"]"))&&!(0,i.hasDataSet)(e[t].target.querySelector("[".concat(p,"]")))&&y(),e[t].attributeName===p&&e[t].target.attributes[p]&&y()}).observe(document.documentElement,{childList:!0,attributes:!0,subtree:!0})}var m=function(n){var e,t=0;(0,i.isValidNode)(n,"_webfunny-eo-ratio")&&(e=n.getAttribute("_webfunny-eo-ratio"),t=Object.is(e,"0")?0:parseFloat(e));new IntersectionObserver(function(e,t){e.forEach(function(e){0<e.intersectionRatio&&((e=Object.keys(n.dataset).find(function(e){if(-1<e.indexOf("exposureKey"))return e}))?(e="data-exposure-key"+e.slice(11),w(l[e])):console.warn("曝光需要上送对应数据"),t.disconnect())})},{root:null,rootMargin:"0px",threshold:t}).observe(n)};function v(){setTimeout(function(){for(var e=(0,r.getElementsWithAttribute)(h),t=0,n=e.length;t<n;t++){var o=e[t];(0,r.addEventListener)(o,"click",function(e){e=e.target.getAttribute(h);e?w(JSON.parse(e)):console.warn("曝光需要上送对应数据")})}},500)}function E(){window&&window.addEventListener("beforeunload",function(){var e=(0,r.getLastHeartBeatTime)(),t=(new Date).getTime();a.default.sendBeaconForCommonPoint({stayTime:t-e})})}function O(){f=f||setInterval(function(){var e,t;window&&document&&!0===document.hidden||(t=(0,r.getLastHeartBeatTime)(),(t=(e=(new Date).getTime())-t)<0)||500+t>=u.COMMON_FIELD.HEART_RATE&&(t={stayTime:t/1e3},webfunnyGlobal)&&webfunnyGlobal.webfunnyEvent&&(webfunnyGlobal.webfunnyEvent("$$$HeartBeatPointId$$$").trackEvent(t),t=e+u.COMMON_FIELD.HEART_RATE+5e3,r.default.setWfCookie("lastHearBeatTime",e,t))},u.COMMON_FIELD.HEART_RATE)}t.exposureObserver=function(){O(),E(),window&&(y(),b(),v())}},function(e,t){!function(){"use strict";var p,n,h,g;function i(e){try{return e.defaultView&&e.defaultView.frameElement||null}catch(e){return null}}function c(e){this.time=e.time,this.target=e.target,this.rootBounds=o(e.rootBounds),this.boundingClientRect=o(e.boundingClientRect),this.intersectionRect=o(e.intersectionRect||f()),this.isIntersecting=!!e.intersectionRect;var e=this.boundingClientRect,e=e.width*e.height,t=this.intersectionRect,t=t.width*t.height;this.intersectionRatio=e?Number((t/e).toFixed(4)):this.isIntersecting?1:0}function e(e,t){var n,o,r,t=t||{};if("function"!=typeof e)throw new Error("callback must be a function");if(t.root&&1!=t.root.nodeType&&9!=t.root.nodeType)throw new Error("root must be a Document or Element");this._checkForIntersections=(n=this._checkForIntersections.bind(this),o=this.THROTTLE_TIMEOUT,r=null,function(){r=r||setTimeout(function(){n(),r=null},o)}),this._callback=e,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(t.rootMargin),this.thresholds=this._initThresholds(t.threshold),this.root=t.root||null,this.rootMargin=this._rootMarginValues.map(function(e){return e.value+e.unit}).join(" "),this._monitoringDocuments=[],this._monitoringUnsubscribes=[]}function s(e,t,n,o){"function"==typeof e.addEventListener?e.addEventListener(t,n,o||!1):"function"==typeof e.attachEvent&&e.attachEvent("on"+t,n)}function a(e,t,n,o){"function"==typeof e.removeEventListener?e.removeEventListener(t,n,o||!1):"function"==typeof e.detatchEvent&&e.detatchEvent("on"+t,n)}function y(e){var t;try{t=e.getBoundingClientRect()}catch(e){}return t?t.width&&t.height?t:{top:t.top,right:t.right,bottom:t.bottom,left:t.left,width:t.right-t.left,height:t.bottom-t.top}:f()}function f(){return{top:0,bottom:0,left:0,right:0,width:0,height:0}}function o(e){return!e||"x"in e?e:{top:e.top,y:e.top,bottom:e.bottom,left:e.left,x:e.left,right:e.right,width:e.width,height:e.height}}function w(e,t){var n=t.top-e.top,e=t.left-e.left;return{top:n,left:e,height:t.height,width:t.width,bottom:n+t.height,right:e+t.width}}function r(e,t){for(var n=t;n;){if(n==e)return!0;n=b(n)}return!1}function b(e){var t=e.parentNode;return 9==e.nodeType&&e!=p?i(e):(t=t&&t.assignedSlot?t.assignedSlot.parentNode:t)&&11==t.nodeType&&t.host?t.host:t}function u(e){return e&&9===e.nodeType}"object"==typeof window&&("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype?"isIntersecting"in window.IntersectionObserverEntry.prototype||Object.defineProperty(window.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return 0<this.intersectionRatio}}):(p=function(){for(var e=window.document,t=i(e);t;)t=i(e=t.ownerDocument);return e}(),n=[],g=h=null,e.prototype.THROTTLE_TIMEOUT=100,e.prototype.POLL_INTERVAL=null,e.prototype.USE_MUTATION_OBSERVER=!0,e._setupCrossOriginUpdater=function(){return h=h||function(e,t){g=e&&t?w(e,t):f(),n.forEach(function(e){e._checkForIntersections()})}},e._resetCrossOriginUpdater=function(){g=h=null},e.prototype.observe=function(t){var e=this._observationTargets.some(function(e){return e.element==t});if(!e){if(!t||1!=t.nodeType)throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:t,entry:null}),this._monitorIntersections(t.ownerDocument),this._checkForIntersections()}},e.prototype.unobserve=function(t){this._observationTargets=this._observationTargets.filter(function(e){return e.element!=t}),this._unmonitorIntersections(t.ownerDocument),0==this._observationTargets.length&&this._unregisterInstance()},e.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorAllIntersections(),this._unregisterInstance()},e.prototype.takeRecords=function(){var e=this._queuedEntries.slice();return this._queuedEntries=[],e},e.prototype._initThresholds=function(e){e=e||[0];return(e=Array.isArray(e)?e:[e]).sort().filter(function(e,t,n){if("number"!=typeof e||isNaN(e)||e<0||1<e)throw new Error("threshold must be a number between 0 and 1 inclusively");return e!==n[t-1]})},e.prototype._parseRootMargin=function(e){e=(e||"0px").split(/\s+/).map(function(e){e=/^(-?\d*\.?\d+)(px|%)$/.exec(e);if(e)return{value:parseFloat(e[1]),unit:e[2]};throw new Error("rootMargin must be specified in pixels or percent")});return e[1]=e[1]||e[0],e[2]=e[2]||e[0],e[3]=e[3]||e[1],e},e.prototype._monitorIntersections=function(t){var n,o,r,e=t.defaultView;e&&-1==this._monitoringDocuments.indexOf(t)&&(n=this._checkForIntersections,r=o=null,this.POLL_INTERVAL?o=e.setInterval(n,this.POLL_INTERVAL):(s(e,"resize",n,!0),s(t,"scroll",n,!0),this.USE_MUTATION_OBSERVER&&"MutationObserver"in e&&(r=new e.MutationObserver(n)).observe(t,{attributes:!0,childList:!0,characterData:!0,subtree:!0})),this._monitoringDocuments.push(t),this._monitoringUnsubscribes.push(function(){var e=t.defaultView;e&&(o&&e.clearInterval(o),a(e,"resize",n,!0)),a(t,"scroll",n,!0),r&&r.disconnect()}),e=this.root&&(this.root.ownerDocument||this.root)||p,t!=e)&&(e=i(t))&&this._monitorIntersections(e.ownerDocument)},e.prototype._unmonitorIntersections=function(o){var r,e,t=this._monitoringDocuments.indexOf(o);-1==t||(r=this.root&&(this.root.ownerDocument||this.root)||p,this._observationTargets.some(function(e){if((t=e.element.ownerDocument)==o)return!0;for(;t&&t!=r;){var t,n=i(t);if((t=n&&n.ownerDocument)==o)return!0}return!1}))||(e=this._monitoringUnsubscribes[t],this._monitoringDocuments.splice(t,1),this._monitoringUnsubscribes.splice(t,1),e(),o!=r&&(t=i(o))&&this._unmonitorIntersections(t.ownerDocument))},e.prototype._unmonitorAllIntersections=function(){var e=this._monitoringUnsubscribes.slice(0);this._monitoringDocuments.length=0;for(var t=this._monitoringUnsubscribes.length=0;t<e.length;t++)e[t]()},e.prototype._checkForIntersections=function(){var a,u;(this.root||!h||g)&&(a=this._rootIsInDom(),u=a?this._getRootRect():f(),this._observationTargets.forEach(function(e){var t=e.element,n=y(t),o=this._rootContainsTarget(t),r=e.entry,i=a&&o&&this._computeTargetAndRootIntersection(t,n,u),s=null,e=(this._rootContainsTarget(t)?h&&!this.root||(s=u):s=f(),e.entry=new c({time:window.performance&&performance.now&&performance.now(),target:t,boundingClientRect:n,rootBounds:s,intersectionRect:i}));r?a&&o?this._hasCrossedThreshold(r,e)&&this._queuedEntries.push(e):r&&r.isIntersecting&&this._queuedEntries.push(e):this._queuedEntries.push(e)},this),this._queuedEntries.length)&&this._callback(this.takeRecords(),this)},e.prototype._computeTargetAndRootIntersection=function(e,t,n){if("none"!=window.getComputedStyle(e).display){for(var o,r,i=t,s=b(e),a=!1;!a&&s;){var u,c,f,l=null,d=1==s.nodeType?window.getComputedStyle(s):{};if("none"==d.display)return null;if(s==this.root||9==s.nodeType?(a=!0,s==this.root||s==p?h&&!this.root?!g||0==g.width&&0==g.height?i=l=s=null:l=g:l=n:(u=(f=b(s))&&y(f),c=f&&this._computeTargetAndRootIntersection(f,u,n),u&&c?(s=f,l=w(u,c)):i=s=null)):s!=(f=s.ownerDocument).body&&s!=f.documentElement&&"visible"!=d.overflow&&(l=y(s)),l&&(u=l,c=i,r=o=l=d=void 0,d=Math.max(u.top,c.top),l=Math.min(u.bottom,c.bottom),o=Math.max(u.left,c.left),u=Math.min(u.right,c.right),r=l-d,i=0<=(c=u-o)&&0<=r?{top:d,bottom:l,left:o,right:u,width:c,height:r}:null),!i)break;s=s&&b(s)}return i}},e.prototype._getRootRect=function(){var e,t;return t=this.root&&!u(this.root)?y(this.root):(t=(e=u(this.root)?this.root:p).documentElement,e=e.body,{top:0,left:0,right:t.clientWidth||e.clientWidth,width:t.clientWidth||e.clientWidth,bottom:t.clientHeight||e.clientHeight,height:t.clientHeight||e.clientHeight}),this._expandRectByRootMargin(t)},e.prototype._expandRectByRootMargin=function(n){var e=this._rootMarginValues.map(function(e,t){return"px"==e.unit?e.value:e.value*(t%2?n.width:n.height)/100}),e={top:n.top-e[0],right:n.right+e[1],bottom:n.bottom+e[2],left:n.left-e[3]};return e.width=e.right-e.left,e.height=e.bottom-e.top,e},e.prototype._hasCrossedThreshold=function(e,t){var n=e&&e.isIntersecting?e.intersectionRatio||0:-1,o=t.isIntersecting?t.intersectionRatio||0:-1;if(n!==o)for(var r=0;r<this.thresholds.length;r++){var i=this.thresholds[r];if(i==n||i==o||i<n!=i<o)return!0}},e.prototype._rootIsInDom=function(){return!this.root||r(p,this.root)},e.prototype._rootContainsTarget=function(e){var t=this.root&&(this.root.ownerDocument||this.root)||p;return r(t,e)&&(!this.root||t==e.ownerDocument)},e.prototype._registerInstance=function(){n.indexOf(this)<0&&n.push(this)},e.prototype._unregisterInstance=function(){var e=n.indexOf(this);-1!=e&&n.splice(e,1)},window.IntersectionObserver=e,window.IntersectionObserverEntry=c))}()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.uniqueArr=t.setDataSetForKey=t.hasDataSet=t.setDataSet=t.isValidNode=void 0,n(6);t.isValidNode=function(e,t){if("function"==typeof e.getAttributeNames&&-1<e.getAttributeNames().indexOf(t))return!0},t.setDataSet=function(e){Object.prototype.hasOwnProperty.call(e.dataset,"webfunnyExposureEle")||(e.dataset.webfunnyExposureEle="")},t.hasDataSet=function(e){return!!Object.prototype.hasOwnProperty.call(e.dataset,"webfunnyExposureEle")},t.setDataSetForKey=function(e,t){Object.prototype.hasOwnProperty.call(e.dataset,"exposureKey".concat(t))||(e.dataset["exposureKey".concat(t)]="")};t.uniqueArr=function(e){return e.reduce(function(e,t){return-1===e.indexOf(t)&&e.push(t),e},[])}},function(e,t,n){"use strict";var o=n(0),r=(Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,o(n(18))),i=o(n(5)),s=n(7),a=n(1);function u(t,e){var n,o=Object.keys(t);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(t),e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),o.push.apply(o,n)),o}function c(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?u(Object(n),!0).forEach(function(e){(0,r.default)(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}t.default={sendByBeacon:function(e){"function"==typeof navigator.sendBeacon&&navigator.sendBeacon(i.default.trackUrl,JSON.stringify(e))},sendBeaconForCommonPoint:function(e){e=[c(c({projectId:a.PROJECT_ID},(0,s.getCustomerInfo)()),e)];"function"==typeof navigator.sendBeacon&&navigator.sendBeacon(i.default.trackUrl,JSON.stringify(e))}}},function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e},e.exports.default=e.exports,e.exports.__esModule=!0},function(e,t,n){"use strict";var o=n(0),r=(Object.defineProperty(t,"__esModule",{value:!0}),t.startUploadEvent=t.getInitCf=void 0,n(1)),i=(o(n(2)),n(4));t.getInitCf=function(t){window?(0,i.weAjax)("post",(0,i.getEventDomain)()+"/tracker/initCf",{projectId:r.PROJECT_ID},function(e){t(e.data)},function(){}):webfunnyGlobal&&webfunnyGlobal.request({url:(0,i.getEventDomain)()+"/tracker/initCf",data:{projectId:r.PROJECT_ID},dataType:"json",method:"POST",success:function(e){e=e.data.data||e.data;t(e)}})};t.startUploadEvent=function(){setInterval(function(){var e=webfunnyGlobal.WEBFUNNY_EVENT_LOG_ARRAY;e.length&&((0,i.sendRequest)(e),webfunnyGlobal.WEBFUNNY_EVENT_LOG_ARRAY=[])},1e3*(0<arguments.length&&void 0!==arguments[0]?arguments[0]:5))}}]);