require("./extension")
const crypto = require("crypto")
const myAtob = require("atob")
const fetch = require('node-fetch')
const uuid = require('node-uuid')
const getmac = require('getmac')
const nodemailer = require('nodemailer')
const {slugify } = require('transliteration');
const timeout = 300000
const Utils = {
  isArray(object) {
    return Object.prototype.toString.call(object) === "[object Array]"
  },
  isObject(obj) {
    return (Object.prototype.toString.call(obj) == '[object Object]');
  },
  guid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  getMac: function() {
    let macAddress = ""
    try {
      macAddress = getmac.default()
    } catch(e) {
      macAddress = "unknown"
    }
    return macAddress
  },
  postPoint(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    const method = "POST"
    const body = JSON.stringify(params)
    const fetchParams = Object.assign({}, { method, body}, this.getHeadersJson())
    return Utils.handleFetchData(url, fetchParams, httpCustomerOperation)
  },
  handleDateResult: function(result, scope = 30) {
    function addDate(date, days) {
      var d=new Date(date);
      d.setDate(d.getDate()+days);
      var month = d.getMonth()+1;
      var m= month >= 10 ? month : '0' + month;
      var day = d.getDate();
      var dayValue = day >= 10 ? day : '0' + day;
      // return d.getFullYear() + '-' + m + '-' + dayValue;
      return d.getFullYear() + '-' + m + '-' + dayValue;
    }
    var newResult = [];
    for (var i = 0; i < scope; i ++) {
      var tempDate = addDate(new Date(), -i);
      var tempObj = {day: tempDate.substring(5, 10), count: 0, loadTime: 0};
      for (var j = 0; j < result.length; j ++) {
        if (tempDate === result[j].day) {
          tempObj.count = result[j].count;
          tempObj.loadTime = result[j].loadTime ? result[j].loadTime : 0;
          continue;
        }
      }
      newResult.push(tempObj);
    }
    return newResult.reverse();
  },
  addDays: function(dayIn) {
    var CurrentDate
    var date = new Date();
    var myDate = new Date(date.getTime() + dayIn * 24 * 60 * 60 * 1000);
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    CurrentDate = year + "-";
    if (month >= 10) {
      CurrentDate = CurrentDate + month + "-";
    } else {
      CurrentDate = CurrentDate + "0" + month + "-";
    }
    if (day >= 10) {
      CurrentDate = CurrentDate + day;
    } else {
      CurrentDate = CurrentDate + "0" + day;
    }
    return CurrentDate;
  },
  qs(object, cache) {
    const arr = []
    function inner(innerObj, prefix) {
      for (const prop in innerObj) {
        if (!innerObj.hasOwnProperty(prop)) return
        const textValue = innerObj[prop]
        if (!Utils.isArray(textValue)) {
          if (Utils.isObject(textValue)) inner(textValue, prefix ? prefix + "." + prop : prop)
          else arr.push(encodeURIComponent((prefix ? prefix + "." : "") + prop) + "=" + encodeURIComponent(textValue || ""))
        } else {
          textValue.forEach((val) => {
            arr.push(encodeURIComponent((prefix ? prefix + "." : "") + prop + "[]") + "=" + encodeURIComponent(val || ""))
          })
        }
      }
    }
    inner(object, "")
    if (cache && !object._) {
      arr.push("_=" + encodeURIComponent(BUILD_NO))
    }
    return arr.length ? "?" + arr.join("&") : ""
  },
  parseQs: function (s) {
    const index = s.indexOf("?")
    const result = {}
    if (index === -1) return result
    const arr = s.substr(index + 1).split("&")
    arr.forEach(function(item) {
      const equals = item.split("=")
      let key = decodeURIComponent(equals[0])
      const val = decodeURIComponent(equals[1] || "")
      let i = 0
      const splitting = key.split(".")
      const len = splitting.length
      key = splitting[len - 1]
      let temp = result
      if (len > 1) {
        for (; i < len - 1; i++) {
          if (!temp[splitting[i]] || !this.isObject(temp[splitting[i]])) temp[splitting[i]] = {}
          temp = temp[splitting[i]]
        }
      }
      if (key.substr(-2) !== "[]") {
        temp[key] = val
      } else {
        key = key.substr(0, key.length - 2)
        if (!temp[key]) temp[key] = [val]
        else temp[key].push(val)
      }
    })
    return result
  },
  parseCookies: function (s) {
    const tempStr = s.replace(/ /g, "")
    const sArr = tempStr.split(";")
    const tempObj = {}
    for (let i = 0; i < sArr.length; i ++) {
      const key = sArr[i].split("=")[0]
      const value = sArr[i].split("=")[1]
      tempObj[key] = value
    }
    return tempObj
  },
  b64EncodeUnicode: function(tempStr) {
    const str = encodeURIComponent(tempStr)
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode("0x" + p1)
    }))
  },
  b64DecodeUnicode: function(str) {
    try {
      return decodeURIComponent(decodeURIComponent(myAtob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
    } catch (e) {
      return str
    }
  },
  md5Encrypt: function(encryptString) {
    // try {
    //   let hash = crypto.createHash('md5');
    //   return hash.update(encryptString).digest('base64');
    // } catch(e) {
    //   return ""
    // }
    return encryptString
  },
  md5: function(encryptString) {
    try {
      let hash = crypto.createHash('md5');
      return hash.update(encryptString).digest('base64');
    } catch(e) {
      console.log(e)
      return encryptString
    }
  },
  md5Hex: function(encryptString) {
    try {
      let hash = crypto.createHash('md5');
      return hash.update(encryptString).digest('hex');
    } catch(e) {
      console.log(e)
      return encryptString
    }
  },
  setTableName(name, day) {
    return name + new Date(new Date().getTime() + (86400000 * (day))).Format("yyyyMMdd")
  },
  setTableNameList(name) {
    const timeStamp = new Date().getTime()
    return name + timeStamp
  },
  quickSortForObject(arr, key, begin, end) {
    if(begin > end) return

    let tempValue = arr[begin][key]
    let tmp = arr[begin]
    let i = begin
    let j = end
    while(i != j){
        while(arr[j][key] >= tempValue && j > i) {
          j--
        }
        while(arr[i][key] <= tempValue && j > i) {
          i++
        }
        if(j > i){
            let t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
    }
    arr[begin] = arr[i];
    arr[i] = tmp;
    Utils.quickSortForObject(arr, key, begin, i-1);
    Utils.quickSortForObject(arr, key, i+1, end);
  },
  toFixed(tempNum, s) {
    let num = tempNum
    const times = Math.pow(10, s)
    if (num < 0) {
      num = Math.abs(num)//先把负数转为正数，然后四舍五入之后再转为负数
      const des = parseInt(num * times + 0.5, 10) / times
      return -des
    }
    const des = parseInt(num * times + 0.5, 10) / times
    let finalDes = des
    const tempDes = des + ""
    if (tempDes.indexOf(".") !== -1) {
      const start = tempDes.split(".")[0]
      let end = tempDes.split(".")[1]
      if (end.length > s) {
        end = end.substring(0, 2)
      }
      finalDes = start + "." + end
    }
    return parseFloat(finalDes)
  },
  get(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    const method = "GET"
    const fetchUrl = url + Utils.qs(params)
    const fetchParams = Object.assign({}, { method }, this.getHeaders())
    return Utils.handleFetchData(fetchUrl, fetchParams, httpCustomerOperation)
  },
  post(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    const method = "POST"
    const body = JSON.stringify(params)
    const fetchParams = Object.assign({}, { method, body }, this.getHeaders())
    return Utils.handleFetchData(url, fetchParams, httpCustomerOperation)
  },
  getJson(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    const method = "GET"
    const fetchUrl = url + Utils.qs(params)
    const fetchParams = Object.assign({}, { method }, this.getHeadersJson())
    return Utils.handleFetchData(fetchUrl, fetchParams, httpCustomerOperation)
  },
  postJson(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    if (!url) return null
    const method = "POST"
    const body = JSON.stringify(params)
    const fetchParams = Object.assign({}, { method, body }, this.getHeadersJson())
    return Utils.handleFetchData(url, fetchParams, httpCustomerOperation)
  },
  handleFetchData(fetchUrl, fetchParams, httpCustomerOperation) {
    // 如果是照片的base64数据，ios系统会卡死
    // TODO: debugPanel不使用react
    const logParams = { ...fetchParams }
    if (logParams.body && logParams.body.length > 1024) {
      logParams.body = logParams.body.substr(0, 1024) + "..."
    }
    httpCustomerOperation.isFetched = false
    httpCustomerOperation.isAbort = false
    // 处理自定义的请求头
    if (httpCustomerOperation.hasOwnProperty("customHead")) {
      const { customHead } = httpCustomerOperation
      fetchParams.headers = Object.assign({}, fetchParams.headers, customHead)
    }
    const fetchPromise = new Promise((resolve, reject) => {
      fetch(fetchUrl, fetchParams).then(
        response => {
          if (httpCustomerOperation.isAbort) {
            // 请求超时后，放弃迟到的响应
            return
          }
          httpCustomerOperation.isFetched = true
          response.json().then(jsonBody => {
            if (response.ok) {
              if (jsonBody.status) {
                // 业务逻辑报错
                reject(Utils.handleResult(jsonBody, httpCustomerOperation))
              } else {
                resolve(Utils.handleResult(jsonBody, httpCustomerOperation))
              }
            } else {
              reject(Utils.handleResult({ fetchStatus: "error", netStatus: response.status }, httpCustomerOperation))
            }
          }).catch(e => {
            const errMsg = e.name + " " + e.message
            reject(Utils.handleResult({ fetchStatus: "error", error: errMsg, netStatus: response.status }, httpCustomerOperation))
          })
        }
      ).catch(e => {
        const errMsg = e.name + " " + e.message
        if (httpCustomerOperation.isAbort) {
          // 请求超时后，放弃迟到的响应
          return
        }
        httpCustomerOperation.isFetched = true
        reject(Utils.handleResult({ fetchStatus: "error", error: errMsg }, httpCustomerOperation))
      })
    })
    return Promise.race([fetchPromise, Utils.fetchTimeout(httpCustomerOperation)])
  },
  handleResult(result, httpCustomerOperation) {
    return result
  },
  fetchTimeout(httpCustomerOperation) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!httpCustomerOperation.isFetched) {
          // 还未收到响应，则开始超时逻辑，并标记fetch需要放弃
          httpCustomerOperation.isAbort = true
          reject({ fetchStatus: "timeout" })
        }
      }, httpCustomerOperation.timeout || timeout)
    })
  },
  getHeaders() {
    // 需要通过app来获取
    const fetchCommonParams = {
      // "mode": "cors",
      // "credentials": "same-origin"
    }
    const headers = {
      // "Accept": "*/*",
      // "Content-Type": "application/json;charset=utf-8",
    }
    return Object.assign({}, fetchCommonParams, { headers })
  },
  getHeadersJson() {
    const headers = {
      "Content-Type": "application/json;charset=utf-8"
    }
    return Object.assign({}, { headers })
  },
  /**
   * 日志转JOSN
   *
   */
  logParseJson(data) {
    if (!data) return []
    const paramStr = data.replace(/": Script error\./g, "script error").replace(/undefined\{/g, "{")
    const param = JSON.parse(paramStr)
    const { logInfo } = param
    if (!logInfo) {
      return []
    }
    return logInfo.split("$$$")
  },

  /**
   * 处理timeSql
   */
  handleTimeSqlByTimeSize(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - (timeSize + 1) * 24 * 3600 * 1000
    const endTime = nowTime - timeSize * 24 * 3600 * 1000
    let startHour = new Date(startTime).Format("MM-dd hh")
    let endHour = new Date(endTime).Format("MM-dd hh")
    if (timeSize > 0) {
      const startTimeDate = new Date(endTime).Format("yyyy-MM-dd") + " 00:00:00"
      const endTimeDate = new Date(endTime).Format("yyyy-MM-dd") + " 23:59:59"
      startHour = new Date(startTimeDate).Format("MM-dd hh")
      endHour = new Date(endTimeDate).Format("MM-dd hh")
    }
    let timeSql = " and hourName>='" + startHour + "' and hourName<'" + endHour + "' "
    return timeSql
  },
  /**
   * 处理timeSql
   */
  handleTimeSqlByTimeSizeSeven(param) {
    const oneDayTime = 24 * 3600 * 1000
    let { timeSize = 0, scope = 0 } = param
    timeSize = parseInt(timeSize, 10)
    scope = parseInt(scope, 10)
    scope = timeSize > 0 ? scope : scope - 1
    const nowTime = new Date().getTime() - scope * oneDayTime
    const startTime = nowTime - (timeSize + 2) * oneDayTime
    const endTime = nowTime - (timeSize + 1) * oneDayTime
    let startHour = new Date(startTime).Format("MM-dd hh")
    let endHour = new Date(endTime).Format("MM-dd hh")
    let timeSql = " and hourName>='" + startHour + "' and hourName<'" + endHour + "' "
    if (timeSize > 0) {
      const startTimeDate = new Date(endTime + oneDayTime).Format("yyyy-MM-dd") + " 00:00:00"
      const endTimeDate = new Date(endTime + oneDayTime).Format("yyyy-MM-dd") + " 23:59:59"
      startHour = new Date(startTimeDate).Format("MM-dd hh")
      endHour = new Date(endTimeDate).Format("MM-dd hh")
      timeSql = " and hourName>='" + startHour + "' and hourName<='" + endHour + "' "
    }
    return timeSql
  },

  /**
   * 时间按照分钟每隔切分，返回时间list
   * 开始时间：startDate
   * 结束时间：endDate
   * 分钟：amount
   */
  splitTime(startDate, endDate, amount) {
    var startTime = new Date(startDate),
	   endTime = new Date(endDate),
    gap = (endTime - startTime) / amount;
    var temp = [];
    for (var i = 0; i < amount; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + gap);
      temp[i] = new Date(startTime.getTime());
      temp[i] = temp[i].Format('hh:mm') //分割小时
      // console.log(temp[i].format('hh:mm'))
    }
    return temp;
  },

  /**
   * 时间按照每天每隔切分，返回时间list
   * 开始时间：startDate
   * 结束时间：endDate
   * 分钟：amount
   */
  splitDate(startDate, endDate) {
    var startTime = new Date(startDate),
     endTime = new Date(endDate);
    var difftime = (endTime - startTime)/1000; //计算时间差,并把毫秒转换成秒
    var days = parseInt(difftime/86400); // 天  24*60*60*1000
    var temp = [];
    for (var i = 0; i < days; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() + 24 * 60 * 60 * 1000);
      temp[i] = new Date(startTime.getTime());
      temp[i] = temp[i].Format("MM-dd")  //分割天
      // console.log(temp[i].format('hh:mm'))
    }
    return temp;
  },

  /**
   * 中文转符号
   * 大于等于转 >=
   */
  convertOper(str) {
    let newStr;
    switch(str) {
      case "大于":
        newStr = ">"
      break
      case "大于等于":
        newStr = ">="
      break
      case "小于":
        newStr = "<"
      break
      case "小于等于":
        newStr = "<="
      break
      case "等于":
        newStr = "="
      break
      case "不等于":
        newStr = "!="
      break
      default:
        break
    }
    return newStr;
  },

  /**
   * 字段类型转换
   * String , Number
   */
  convertFieldType(str) {
    let newStr;
    switch(str) {
      case "VARCHAR":
        newStr = "String"
        break
      case "INT":
        newStr = "Number"
        break
      default:
        break
    }
    return newStr;
  },

   /**
   * 字段类型转换
   * String , Number
   */
  convertFieldTypeToChinese(str) {
    let newStr;
    switch(str) {
      case "VARCHAR":
      case "varchar":
        newStr = "文本"
        break
      case "INT":
      case "int":
        newStr = "整数型"
        break
      default:
        break
    }
    return newStr;
  },

   /**
   * 且或转换
   * String , Number
   */
  convertAndOr(str) {
    let newStr;
    switch(str) {
      case "a":
        newStr = "and"
        break
      case "o":
        newStr = "or"
        break
      default:
        newStr = "and"
        break
    }
    return newStr;
  },
  checkFieldNameValid(fieldName){
    let goOnFlag = true;
   //通用字段：id,weFirstStepDay,weHapppenHour,weHapppenMinute,weCustomerKey,weUserId,weSysVersion,weCity,weCountry,weSimpleUrl,weBrowser,weOs,weDeviceSize,createdAt
   //通用字段：id,weCustomerKey,weUserId,weSimpleUrl,createdAt
   //weFirstStepDay_1,weFirstStepDay_2,weFirstStepDay_3,weFirstStepDay_4,
   //weFirstStepDay_5,weFirstStepDay_6,weFirstStepDay_7,weFirstStepDay_8,
   //weFirstStepDay_9,weFirstStepDay_10
    const fieldParams = ["id","wefirststepday_1","wefirststepday_2","wefirststepday_3","wefirststepday_4",
    "wefirstStepday_5","weFirstStepday_6","weFirstStepday_7","weFirstStepday_8","weFirstStepday_9","wefirststepday_10",
    "wecustomerkey","weuserid","createdat"]
    const fieldNameConvert = JSON.stringify(fieldName).toLowerCase()
    fieldParams.forEach((item) => {
        if (fieldNameConvert.indexOf(item) !== -1) {
            goOnFlag = false
        } else if (fieldNameConvert.indexOf(item) !== -1) {
            goOnFlag = false
        }
    })
    return goOnFlag;
  },

  /**
   * 自己配置邮箱，bin/useCusEmailSys.js 参数改为true
   */
  // sendEmail: (email, subject, html, user, pass) => {
  //   const company = "webfunny.cn"
  //   let transporter = nodemailer.createTransport({
  //     host: "smtp.163.com",
  //     port: 465,
  //     secure: true, // true for 465, false for other ports
  //     auth: { user,pass }
  //   });
  //   // send mail with defined transport object
  //   transporter.sendMail({
  //     from: "'" + company + "' <" + user + ">", // sender address
  //     to: email, // list of receivers
  //     subject: subject, // Subject line
  //     text: html, // plain text body
  //     html: html // html body
  //   });
  // },
  getUuid() {
    return uuid.v1()
  },
  fetchTest() {
    // fetch原本方法的写法
    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json;charset=utf-8",
        "access-token": "token"
      }
    }).then(res => {
      res.json()
    }).then(data => {
      console.log(data)
    }).catch(error => {
      console.log(error.msg)
    })
  },
  pinYinToHump(pinyin){
    let fieldName = '';
    //TODO 如果是含有数字1、2这种，转成英文数字one、two...
    //1、"用户id"转成拼音yong_hu_id;
    let fieldNamePinyin = slugify(pinyin);
    if (fieldNamePinyin === 'show' || fieldNamePinyin === 'SHOW' ){
      fieldName = 'newShow';
      return fieldName; 
    }
    //2、按-分割
    let fieldNameArr = fieldNamePinyin.split("-");
    if(fieldNameArr.length > 1){
        fieldName = fieldName + fieldNameArr[0];
        for(let i=1;i<fieldNameArr.length;i++){
            //3、找到第一个字母转大写，然后拼接上
            let firstNameInfo = fieldNameArr[i].substr(0,1).toUpperCase();
            let secondNameInfo = fieldNameArr[i].substr(1,fieldNameArr[i].length);
            fieldName = fieldName + firstNameInfo + secondNameInfo;
        }
    }else {
        fieldName = fieldNamePinyin;
    }
    return fieldName;
  }
}

module.exports = Utils