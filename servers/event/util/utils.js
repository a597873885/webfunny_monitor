require("./extension")
const crypto = require("crypto")
const myAtob = require("atob")
const fetch = require('node-fetch')
const uuid = require('node-uuid')
const getmac = require('getmac')
const path = require('path')
const { base64encode, base64decode } = require('nodejs-base64');
const nodemailer = require('nodemailer')
const {slugify } = require('transliteration');
const log = require("../../../config/log");
const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig
const timeout = 300000
const IP2Region = require('ip2region').default;
// 创建 IP2Region 实例（支持 IPv4 和 IPv6）
const ip2regionQuery = new IP2Region();
const Utils = {
  isArray(object) {
    return Object.prototype.toString.call(object) === "[object Array]"
  },
  isObject(obj) {
    return (Object.prototype.toString.call(obj) == '[object Object]');
  },
  guid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  getMac: function () {
    let macAddress = ""
    try {
      macAddress = getmac.default()
    } catch (e) {
      macAddress = "unknown"
    }
    return macAddress
  },
  /**
   * 解析json文件
   */
  getJsonData() {
    const basePath = path.resolve(__dirname, "../")
    const file = basePath + '/package.json'
    let conf = {}
    try {
      conf = jsonfile.readFileSync(file);
    } catch (error) {
        console.log('read json config err:', error);
        throw new Error('解析package.json失败')
    }
    return conf
  },
  postPoint(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    const method = "POST"
    const body = JSON.stringify(params)
    const fetchParams = Object.assign({}, { method, body }, Utils.getHeadersJson())
    return Utils.handleFetchData(url, fetchParams, httpCustomerOperation)
  },
  handleDateResult: function (result, scope = 30) {
    function addDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var month = d.getMonth() + 1;
      var m = month >= 10 ? month : '0' + month;
      var day = d.getDate();
      var dayValue = day >= 10 ? day : '0' + day;
      // return d.getFullYear() + '-' + m + '-' + dayValue;
      return d.getFullYear() + '-' + m + '-' + dayValue;
    }
    var newResult = [];
    for (var i = 0; i < scope; i++) {
      var tempDate = addDate(new Date(), -i);
      var tempObj = { day: tempDate.substring(5, 10), count: 0, loadTime: 0 };
      for (var j = 0; j < result.length; j++) {
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
  addDays: function (dayIn) {
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
    arr.forEach(function (item) {
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
          if (!temp[splitting[i]] || !Utils.isObject(temp[splitting[i]])) temp[splitting[i]] = {}
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
    for (let i = 0; i < sArr.length; i++) {
      const key = sArr[i].split("=")[0]
      const value = sArr[i].split("=")[1]
      tempObj[key] = value
    }
    return tempObj
  },
  b64EncodeUnicode: function (tempStr) {
    const str = encodeURIComponent(tempStr)
    return base64encode(str)
  },
  b64DecodeUnicode: function (str) {
    try {
      return decodeURIComponent(decodeURIComponent(myAtob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
    } catch (e) {
      return str
    }
  },
  md5Encrypt: function (encryptString) {
    // try {
    //   let hash = crypto.createHash('md5');
    //   return hash.update(encryptString).digest('base64');
    // } catch(e) {
    //   return ""
    // }
    return encryptString
  },
  md5: function (encryptString) {
    try {
      let hash = crypto.createHash('md5');
      return hash.update(encryptString).digest('base64');
    } catch (e) {
      console.log(e)
      return encryptString
    }
  },
  md5Hex: function (encryptString) {
    try {
      let hash = crypto.createHash('md5');
      return hash.update(encryptString).digest('hex');
    } catch (e) {
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
    if (begin > end) return

    let tempValue = arr[begin][key]
    let tmp = arr[begin]
    let i = begin
    let j = end
    while (i != j) {
      while (arr[j][key] >= tempValue && j > i) {
        j--
      }
      while (arr[i][key] <= tempValue && j > i) {
        i++
      }
      if (j > i) {
        let t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
      }
    }
    arr[begin] = arr[i];
    arr[i] = tmp;
    Utils.quickSortForObject(arr, key, begin, i - 1);
    Utils.quickSortForObject(arr, key, i + 1, end);
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
        end = end.substring(0, s)
      }
      finalDes = start + "." + end
    }
    return parseFloat(finalDes)
  },
  get(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    const method = "GET"
    const fetchUrl = url + Utils.qs(params)
    const fetchParams = Object.assign({}, { method }, Utils.getHeaders())
    return Utils.handleFetchData(fetchUrl, fetchParams, httpCustomerOperation)
  },
  post(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    const method = "POST"
    const body = JSON.stringify(params)
    const fetchParams = Object.assign({}, { method, body }, Utils.getHeaders())
    return Utils.handleFetchData(url, fetchParams, httpCustomerOperation)
  },
  getJson(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    const method = "GET"
    const fetchUrl = url + Utils.qs(params)
    const fetchParams = Object.assign({}, { method }, Utils.getHeadersJson())
    return Utils.handleFetchData(fetchUrl, fetchParams, httpCustomerOperation)
  },
  postJson(url, params = {}, httpCustomerOperation = { isHandleResult: true }) {
    if (!url) return null
    const method = "POST"
    const body = JSON.stringify(params)
    const fetchParams = Object.assign({}, { method, body }, Utils.getHeadersJson())
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
  logParseJson(dataStr) {
    // 如果数据为空，或者已经是对象，则原路返回
    if (!dataStr || typeof dataStr === "object") return dataStr
    let finalRes = ""
    try {
      finalRes = JSON.parse(dataStr)
    } catch (e) {
      log.printError("上报日志转JSON报错", e)
      finalRes = dataStr
    }
    return finalRes
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
    var difftime = (endTime - startTime) / 1000; //计算时间差,并把毫秒转换成秒
    var days = parseInt(difftime / 86400); // 天  24*60*60*1000
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
   * 时间按照每天每隔切分，返回时间list
   * 开始时间：startDate
   * 结束时间：endDate
   * 分钟：amount
   * 返回：['2024-04-14','2024-04-15']
   */
  splitYMDDate(startDate, endDate) {
    var startTime = new Date(startDate),
      endTime = new Date(endDate).getTime() + 24 * 60 * 60 * 1000
    var difftime = (endTime - startTime) / 1000; //计算时间差,并把毫秒转换成秒
    var days = parseInt(difftime / 86400); // 天  24*60*60*1000
    var temp = [];
    for (var i = 0; i < days; i++) {
      temp[i] = new Date(startTime.getTime());
      temp[i] = temp[i].Format("yyyy-MM-dd")  //分割天
      startTime.setMilliseconds(startTime.getMilliseconds() + 24 * 60 * 60 * 1000);
    }
    return temp;
  },

  /**
   * 按照不同时间单位切分时间，返回时间list
   * @param {String} startDate 开始时间，格式：yyyy-MM-dd
   * @param {String} endDate 结束时间，格式：yyyy-MM-dd
   * @param {String} unit 时间单位：'day'|'week'|'month'|'year'|'hour'
   * @returns {Array} 时间列表
   */
  splitTimeByUnit(startDate, endDate, unit) {
    var startTime = new Date(startDate);
    var endTime = new Date(endDate);
    var temp = [];

    switch (unit) {
      case 'day':
        // 按天切分
        var difftime = (endTime - startTime) / 1000;
        var days = parseInt(difftime / 86400) + 1; // 包含结束日期
        for (var i = 0; i < days; i++) {
          var currentDate = new Date(startTime.getTime() + i * 24 * 60 * 60 * 1000);
          temp.push(currentDate.Format("yyyy-MM-dd"));
        }
        break;

      case 'week':
        // 按周切分，返回每周周一的日期，格式为yyyy-MM-dd
        // 匹配 ClickHouse 的 addDays(toStartOfWeek(happenTime), 1) 逻辑
        // toStartOfWeek 返回本周的周日，addDays(..., 1) 加1天得到下周一
        
        // 1. 计算开始日期所在周的周日（toStartOfWeek）
        var startWeekSunday = new Date(startTime);
        startWeekSunday.setHours(0, 0, 0, 0);
        var startDayOfWeek = startWeekSunday.getDay(); // 0=周日, 1=周一, ..., 6=周六
        // 调整到本周日：如果当前是周日，不变；否则减去对应的天数回到本周日
        if (startDayOfWeek !== 0) {
          startWeekSunday.setDate(startWeekSunday.getDate() - startDayOfWeek);
        }
        
        // 2. 加1天得到下周一（addDays(..., 1)）
        var firstMonday = new Date(startWeekSunday);
        firstMonday.setDate(firstMonday.getDate() + 1);
        
        // 3. 如果这个周一在开始日期之前或等于开始日期，则从下一个周一开始
        if (firstMonday <= startTime) {
          firstMonday.setDate(firstMonday.getDate() + 7);
        }
        
        // 4. 计算结束日期所在周的周日（toStartOfWeek）
        var endWeekSunday = new Date(endTime);
        endWeekSunday.setHours(0, 0, 0, 0);
        var endDayOfWeek = endWeekSunday.getDay();
        // 调整到本周日
        if (endDayOfWeek !== 0) {
          endWeekSunday.setDate(endWeekSunday.getDate() - endDayOfWeek);
        }
        
        // 5. 加1天得到下周一（addDays(..., 1)）
        var lastMonday = new Date(endWeekSunday);
        lastMonday.setDate(lastMonday.getDate() + 1);
        
        // 6. 从 firstMonday 开始，每周加7天，直到包含 lastMonday
        var weekDate = new Date(firstMonday);
        var lastMondayStr = lastMonday.getFullYear() + '-' + 
          String(lastMonday.getMonth() + 1).padStart(2, '0') + '-' + 
          String(lastMonday.getDate()).padStart(2, '0');
        
        while (true) {
          var year = weekDate.getFullYear();
          var month = (weekDate.getMonth() + 1).toString().padStart(2, '0');
          var day = weekDate.getDate().toString().padStart(2, '0');
          var weekDateStr = year + '-' + month + '-' + day;
          
          temp.push(weekDateStr);
          
          // 如果当前已经是 lastMonday 或之后，则退出循环
          if (weekDateStr >= lastMondayStr) {
            break;
          }
          
          weekDate.setDate(weekDate.getDate() + 7);
        }
        break;

      case 'month':
        // 按月切分，返回yyyy-MM格式
        var currentMonth = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
        var endMonth = new Date(endTime.getFullYear(), endTime.getMonth(), 1);
        
        while (currentMonth <= endMonth) {
          var year = currentMonth.getFullYear();
          var month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
          temp.push(year + '-' + month);
          currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        break;

      case 'year':
        // 按年切分，返回yyyy格式
        var currentYear = new Date(startTime.getFullYear(), 0, 1);
        var endYear = new Date(endTime.getFullYear(), 0, 1);
        
        while (currentYear <= endYear) {
          temp.push(currentYear.getFullYear().toString());
          currentYear.setFullYear(currentYear.getFullYear() + 1);
        }
        break;

      case 'hour':
        // 按小时切分，支持跨天，返回yyyy-MM-dd HH:mm:ss格式
        var startHour = new Date(startTime);
        var endHour = new Date(endTime);
        // 调整开始时间到当天的00:00:00
        startHour.setHours(0, 0, 0, 0);
        // 调整结束时间到当天的23:59:59
        endHour.setHours(23, 59, 59, 999);
        
        var currentHour = new Date(startHour);
        // 调整到整点
        currentHour.setMinutes(0, 0, 0);
        
        while (currentHour <= endHour) {
          var year = currentHour.getFullYear();
          var month = (currentHour.getMonth() + 1).toString().padStart(2, '0');
          var day = currentHour.getDate().toString().padStart(2, '0');
          var hour = currentHour.getHours().toString().padStart(2, '0');
          temp.push(year + '-' + month + '-' + day + ' ' + hour + ':00:00');
          
          // 增加1小时
          currentHour.setHours(currentHour.getHours() + 1);
        }
        break;

      default:
        throw new Error('不支持的时间单位，请使用：day, week, month, year, hour');
    }

    return temp;
  },

  /**
   * 时间按照每天每隔切分，返回时间倒序list
   * 开始时间：startDate 2024-04-13
   * 结束时间：endDate 2024-04-15
   * 分钟：amount
   * 返回：['04-15','04-14']
   */
  splitDescDate(startDate, endDate) {
    var endTime = new Date(startDate),
      startTime = new Date(endDate);
    var difftime = (startTime - endTime) / 1000; //计算时间差,并把毫秒转换成秒
    var days = parseInt(difftime / 86400); // 天  24*60*60*1000
    startTime.setMilliseconds(startTime.getMilliseconds() + 24 * 60 * 60 * 1000);
    var temp = [];
    for (var i = 0; i < days; i++) {
      startTime.setMilliseconds(startTime.getMilliseconds() - 24 * 60 * 60 * 1000);
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
    switch (str) {
      // case "有值":
      //   newStr = "is not null"
      // break 
      // case "没值":
      //   newStr = "is null"
      // break
      case "为空":
        newStr = "is null"
        break
      case "不为空":
        newStr = "is not null"
        break
      case "包含":
        newStr = "in"
        break
      case "不包含":
        newStr = "not in"
        break
      case "区间":
        newStr = "区间"
        break
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
      case "归类":
        newStr = "group by"
        break
      default:
        break
    }
    return newStr;
  },

  /**
   * 中文转符号，生成sql
   * 大于等于转 >=
   */
  convertOperationSql(fieldName, rule, valueStr) {
    let str = rule
    let tempValueStr = ""
    if (rule === "包含" || rule === "不包含") {
      let valArray = valueStr.split(",")
      let valInStr = ""
      valArray.forEach((val) => {
        if (rule === "包含") {
          valInStr += ` ${fieldName} like '%${val}%' or `
        } else if (rule === "不包含") {
          valInStr += ` ${fieldName} not like '%${val}%' and`
        }
      })
      if (valInStr.length > 0) {
        valInStr = valInStr.substring(0, valInStr.length - 3)//去掉最后一个or或者and
      }
      tempValueStr = ` (${valInStr}) `
    } else if (rule === "区间") {
      let valArray = valueStr.split(",")
      let valInStr = ` ${fieldName} >= '%${valArray[0]}%' and ` + ` ${fieldName} <= '${valArray[1]}'  `
      tempValueStr = ` (${valInStr}) `
    } else {
      tempValueStr = "'" + valueStr + "' "
    }
    let valueStrSql = valueStr ? tempValueStr : ""

    let newStr;
    let sql = ""
    switch (str) {
      case "为空":
        newStr = " is null "
        sql = ` (${fieldName} ${newStr} or ${fieldName}='') `
        break
      case "不为空":
        newStr = " is not null "
        sql = ` (${fieldName} ${newStr} and ${fieldName}!='') `
        break
      case "包含":
        // newStr = " like "
        // sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        sql = ` ${valueStrSql}`
        break
      case "不包含":
        // newStr = " not like "
        // sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        sql = ` ${valueStrSql}`
        break
      case "区间":
        sql = ` ${valueStrSql}`
        break
      case "大于":
        newStr = ">"
        sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        break
      case "大于等于":
        newStr = ">="
        sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        break
      case "小于":
        newStr = "<"
        sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        break
      case "小于等于":
        newStr = "<="
        sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        break
      case "等于":
        newStr = "="
        sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        break
      case "不等于":
        newStr = "!="
        sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        break
      case "归类":
        newStr = "group by"
        sql = ` ${fieldName} ${newStr} ${valueStrSql}`
        break
      case "模糊匹配":
        newStr = "like"
        sql = ` ${fieldName} ${newStr} %${valueStrSql}%`
        break
      default:
        break
    }
    // console.log(sql)
    return sql
  },

  /**
   * 字段类型转换
   * String , Number
   */
  convertFieldType(str) {
    let newStr;
    switch (str) {
      case "VARCHAR":
      case "varchar":
        newStr = "String"
        break
      case "INT":
      case "int":
      case "BIGINT":
      case "bigint":
      case "FLOAT":
      case "float":
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
    switch (str) {
      case "VARCHAR":
      case "varchar":
        newStr = "文本"
        break
      case "INT":
      case "int":
      case "BIGINT":
      case "bigint":
        newStr = "整数"
        break
      case "FLOAT":
      case "float":
        newStr = "小数"
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
    switch (str) {
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
  checkFieldNameValid(fieldName) {
    // let goOnFlag = true;
    //通用字段：id,weFirstStepDay,weHapppenHour,weHapppenMinute,weCustomerKey,weUserId,weSysVersion,weCity,weCountry,weSimpleUrl,weBrowser,weOs,weDeviceSize,createdAt
    //通用字段：id,weCustomerKey,weUserId,weSimpleUrl,createdAt
    //weFirstStepDay_1,weFirstStepDay_2,weFirstStepDay_3,weFirstStepDay_4,
    //weFirstStepDay_5,weFirstStepDay_6,weFirstStepDay_7,weFirstStepDay_8,
    //weFirstStepDay_9,weFirstStepDay_10
    const fieldParams = ["id", "wefirststepday_1", "wefirststepday_2", "wefirststepday_3", "wefirststepday_4",
      "wefirstStepday_5", "wefirststepday_6", "wefirstStepday_7", "wefirststepday_8", "wefirstStepday_9", "wefirststepday_10",
      "wecustomerkey", "weip", "weos", "wedevicename", "weplatform", "wesystem", "webrowsername", "wenewstatus", 
      "wecountry", "weprovince","wecity", "wehappenhour", "wehappenminute", "createdat"]
    const fieldNameConvert = fieldName.toString().toLowerCase()
    //存在一样的返回false
    let flag = fieldParams.indexOf(fieldNameConvert) === -1;
    return flag;
    // fieldParams.forEach((item) => {
    //     if (fieldNameConvert === item) {
    //         goOnFlag = false
    //     }
    // })
    // return goOnFlag;
  },

  /**
   * 判断是否为系统字段
   */
  checkIsSystemField(fieldName) {
    const fieldParams = ["id", "wefirststepday_1", "wefirststepday_2", "wefirststepday_3", "wefirststepday_4",
      "wefirstStepday_5", "wefirststepday_6", "wefirstStepday_7", "wefirststepday_8", "wefirstStepday_9", "wefirststepday_10",
      "wecustomerkey", "weuserid", "weip", "weos", "wepath", "wedevicename", "weplatform", "wesystem", "webrowsername", "wenewstatus", "wecountry", "weprovince", "wecity", "createdat"]
    const fieldNameConvert = fieldName.toString().toLowerCase()
    return fieldParams.indexOf(fieldNameConvert) !== -1;
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
  isLooseNumber(value) {
    // 先转换为数字，再检查是否为有效数字
    const num = Number(value);
    return !isNaN(num) && !isNaN(parseFloat(value));
  },  
  pinYinToHump(pinyin) {
    let fieldName = '';
    //TODO 如果是含有数字1、2这种，转成英文数字one、two...
    //1、"用户id"转成拼音yong_hu_id;
    //如果是英文，就会全都转成小写了，例如输入userName变成了username
    //如果是英文，就直接返回，不处理
    if ((/^[A-Za-z]+$/.test(pinyin))) {
      return pinyin;
    }
    let fieldNamePinyin = slugify(pinyin);
    if (fieldNamePinyin === 'show' || fieldNamePinyin === 'SHOW') {
      fieldName = 'newShow';
      return fieldName;
    }
    //2、按-分割
    let fieldNameArr = fieldNamePinyin.split("-");
    if (fieldNameArr.length > 1) {
      fieldName = fieldName + fieldNameArr[0];
      for (let i = 1; i < fieldNameArr.length; i++) {
        //3、找到第一个字母转大写，然后拼接上
        let firstNameInfo = fieldNameArr[i].substr(0, 1).toUpperCase();
        let secondNameInfo = fieldNameArr[i].substr(1, fieldNameArr[i].length);
        fieldName = fieldName + firstNameInfo + secondNameInfo;
      }
    } else {
      fieldName = fieldNamePinyin;
    }
    return fieldName;
  },
  // 获取双协议结果
  async requestForTwoProtocol(method = "post", originUrl, param) {
    // 先将url中的协议去掉
    const url = originUrl.replace("https://", "").replace("http://", "")
    const methodName = method === "post" ? "postJson" : ""

    if (accountInfo.protocol) {
      let reqProtocol = `${accountInfo.protocol}://`
      // 如果用户指定了协议
      const protocolRes = await Utils[methodName](`${reqProtocol}${url}`, param).catch((e) => {
        if (typeof e === "object") {
          log.printError(`${reqProtocol}${url} ->` + JSON.stringify(e))
        }
      })
      return protocolRes
    } else {
      // 如果用户没有指定协议
      let protocolRes = null
      protocolRes = await Utils[methodName](`http://${url}`, param).catch((e) => {
        if (typeof e === "object") {
          log.printError(`http://${url} ->` + JSON.stringify(e))
        }
      })

      if (!protocolRes) {
        protocolRes = await Utils[methodName](`https://${url}`, param).catch((e) => {
          if (typeof e === "object") {
            log.printError(`https://${url} ->` + JSON.stringify(e))
          }
        })
      }
      return protocolRes
    }
  },
  equalsObj(oldData, newData) {
    // 类型为基本类型时,如果相同,则返回true
    if (oldData === newData) return true;
    if (Utils.isObject(oldData) && Utils.isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
      // 类型为对象并且元素个数相同

      // 遍历所有对象中所有属性,判断元素是否相同
      for (const key in oldData) {
        if (oldData.hasOwnProperty(key)) {
          if (!Utils.equalsObj(oldData[key], newData[key]))
            // 对象中具有不相同属性 返回false
            return false;
        }
      }
    } else if (Utils.isArray(oldData) && Utils.isArray(oldData) && oldData.length === newData.length) {
      // 类型为数组并且数组长度相同

      for (let i = 0, length = oldData.length; i < length; i++) {
        if (!Utils.equalsObj(oldData[i], newData[i]))
          // 如果数组元素中具有不相同元素,返回false
          return false;
      }
    } else {
      // 其它类型,均返回false
      return false;
    }
    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true;
  },
  //比较list
  getArrDifference: (arr1, arr2) => {
    return arr1.concat(arr2).filter((v, i, arr) => {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    })
  },
  /**
   * 通过webfunny系统发送邮件
   */
  sendWfEmail: (email, title, content) => {
    fetch("http://www.webfunny.cn/config/sendEmail",
      {
        method: "POST",
        body: JSON.stringify({ email, title, content }),
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      }).catch((e) => {
        console.log(e)
      })
  },
  /**
   * 设置内存中存储登录用户对象
   * @param {String} projectId 项目ID
   * @param {Object} user 存储的用户信息 {userId, nickname}
   * @param {Number} maxLen 数组最大长度，默认100
   */
  setFixedLengthQueue(projectId, user, maxLen = 100) {
    if (!global.clientUsers) {
      global.clientUsers = {}
    }
    if (global.clientUsers[projectId]) {
      //判断数组中是否存在，存在就不添加
      const hasOne = global.clientUsers[projectId].some(item => item.userId === user.userId)
      if (!hasOne) {
        //判断是否超出长度，
        if (global.clientUsers[projectId].length >= maxLen) {
          global.clientUsers[projectId].shift(); // 移除队列的第一个元素
        }
        global.clientUsers[projectId].push(user); // 添加新元素到队列的末尾
      }
    } else {
      global.clientUsers[projectId] = [user]
    }
  },
  /**
   * 获取内存中存储登录用户对象
   * @param {String} projectId 项目ID
   */
  getFixedLengthQueue(projectId) {
    if (!global.clientUsers) global.clientUsers = {}
    return global.clientUsers[projectId] ? global.clientUsers[projectId] : []
  },
  //首字母大写
  capitalizeFirstLetter(str) {
    if (!str) return str; // 处理空字符串
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  isTimeDifferenceMoreThan10Minutes(timeStr1, timeStr2) {
    // 解析时间字符串为 Date 对象
    const date1 = new Date(timeStr1);
    const date2 = new Date(timeStr2);

    // 计算时间差（毫秒）
    const diffMilliseconds = Math.abs(date1 - date2);

    // 转换为分钟（1 分钟 = 60,000 毫秒）
    const diffMinutes = diffMilliseconds / (1000 * 60);

    // 判断是否超过 11 分钟
    return diffMinutes > 11;
   },

  isTimeDifferenceMoreThan1Days(timeStr1, timeStr2) {
    // 解析时间字符串为 Date 对象
    const date1 = new Date(timeStr1);
    const date2 = new Date(timeStr2);

    // 计算时间差（毫秒）
    const diffMilliseconds = Math.abs(date1 - date2);

    // 转换为分钟（1 分钟 = 60,000 毫秒）
    const diffMinutes = diffMilliseconds / (1000 * 60);

    // 判断是否超过 1天
    return diffMinutes < 1440;
   },
   /**
 * 填充24小时数据的公共方法
 * @param {Array} projectList 项目列表数组
 * @returns {Array} 处理后的项目列表数组
 */
fillHourlyData(projectList, options = {}) {
  // 检查输入是否为数组
  if (!Array.isArray(projectList)) {
    throw new Error('Input must be an array of projects');
  }
  
  // 获取当前时间，如果提供了currentTime参数则使用它，否则使用系统当前时间
  const currentTime = options.currentTime ? new Date(options.currentTime) : new Date();
  
  // 克隆原始数据以避免修改原始对象
  const result = JSON.parse(JSON.stringify(projectList));
  
  // 生成过去24小时的小时列表（从当前时间往前推24小时）
  const hoursList = [];
  for (let i = 0; i < 24; i++) {
    // 计算当前时间往前推i小时的时间
    const time = new Date(currentTime);
    time.setHours(time.getHours() - i);
    
    // 提取小时部分并格式化为两位数
    const hour = time.getHours().toString().padStart(2, '0');
    hoursList.unshift(hour); // 添加到列表开头，这样最终列表是从最早到最近排序
  }
  
  // 遍历每个项目
  result.forEach(project => {
    // 创建一个映射，用于快速查找已有的小时数据
    const hourMap = {};
    
    // 将现有的小时数据添加到映射中
    if (project.items && Array.isArray(project.items)) {
      project.items.forEach(item => {
        hourMap[item.weHappenHour] = item;
      });
    } else {
      // 如果项目没有items数组，初始化一个
      project.items = [];
    }
    
    // 创建一个新的items数组，按照过去24小时的顺序包含所有小时的数据
    const newItems = [];
    
    // 遍历生成的小时列表
    hoursList.forEach(hourStr => {
      // 如果该小时已有数据，使用现有数据；否则创建新的数据项
      if (hourMap[hourStr]) {
        newItems.push(hourMap[hourStr]);
      } else {
        newItems.push({
          totalCount: "0",
          weHappenHour: hourStr
        });
      }
    });
    
    // 用新的items数组替换原来的数组
    project.items = newItems;
    
    // 添加额外信息，帮助前端理解数据顺序
    // project.timeInfo = {
    //   startHour: hoursList[0],
    //   endHour: hoursList[hoursList.length - 1],
    //   currentTime: currentTime.toISOString(),
    //   hoursSequence: hoursList
    // };
  });

   return result;
  },
  //判断对象数组，是否包含特定值的方法
   isValueInFieldName(value, list) {
      // 检查参数有效性
      if (!Array.isArray(list)) {
        return false;
      }
      
      // 检查list中是否有任何对象的fileName字段等于value
      return list.some(item => 
        item && 
        typeof item === 'object' && 
        item.fieldName === value
      );
    },
    isTimeDifferenceMoreThan1Days(timeStr1, timeStr2) {
      // 解析时间字符串为 Date 对象
      const date1 = new Date(timeStr1);
      const date2 = new Date(timeStr2);
  
      // 计算时间差（毫秒）
      const diffMilliseconds = Math.abs(date1 - date2);
  
      // 转换为分钟（1 分钟 = 60,000 毫秒）
      const diffMinutes = diffMilliseconds / (1000 * 60);
  
      // 判断是否超过 1天
      return diffMinutes < 1440;
     },
     /**
   * 填充24小时数据的公共方法
   * @param {Array} projectList 项目列表数组
   * @returns {Array} 处理后的项目列表数组
   */
  fillHourlyData(projectList, options = {}) {
    // 检查输入是否为数组
    if (!Array.isArray(projectList)) {
      throw new Error('Input must be an array of projects');
    }
    
    // 获取当前时间，如果提供了currentTime参数则使用它，否则使用系统当前时间
    const currentTime = options.currentTime ? new Date(options.currentTime) : new Date();
    
    // 克隆原始数据以避免修改原始对象
    const result = JSON.parse(JSON.stringify(projectList));
    
    // 生成过去24小时的小时列表（从当前时间往前推24小时）
    const hoursList = [];
    for (let i = 0; i < 24; i++) {
      // 计算当前时间往前推i小时的时间
      const time = new Date(currentTime);
      time.setHours(time.getHours() - i);
      
      // 提取小时部分并格式化为两位数
      const hour = time.getHours().toString().padStart(2, '0');
      hoursList.unshift(hour); // 添加到列表开头，这样最终列表是从最早到最近排序
    }
    
    // 遍历每个项目
    result.forEach(project => {
      // 创建一个映射，用于快速查找已有的小时数据
      const hourMap = {};
      
      // 将现有的小时数据添加到映射中
      if (project.items && Array.isArray(project.items)) {
        project.items.forEach(item => {
          hourMap[item.weHappenHour] = item;
        });
      } else {
        // 如果项目没有items数组，初始化一个
        project.items = [];
      }
      
      // 创建一个新的items数组，按照过去24小时的顺序包含所有小时的数据
      const newItems = [];
      
      // 遍历生成的小时列表
      hoursList.forEach(hourStr => {
        // 如果该小时已有数据，使用现有数据；否则创建新的数据项
        if (hourMap[hourStr]) {
          newItems.push(hourMap[hourStr]);
        } else {
          newItems.push({
            totalCount: "0",
            weHappenHour: hourStr
          });
        }
      });
      
      // 用新的items数组替换原来的数组
      project.items = newItems;
      
      // 添加额外信息，帮助前端理解数据顺序
      // project.timeInfo = {
      //   startHour: hoursList[0],
      //   endHour: hoursList[hoursList.length - 1],
      //   currentTime: currentTime.toISOString(),
      //   hoursSequence: hoursList
      // };
    });
  
     return result;
    },
  
    /**
     * 填充每日数据的公共方法
     * @param {Array} projectList 项目列表数组
     * @param {String} startTime 开始时间
     * @param {String} endTime 结束时间
     * @returns {Array} 处理后的项目列表数组
     */
    fillDailyData(projectList, startTime, endTime) {
      // 检查输入是否为数组
      if (!Array.isArray(projectList)) {
        throw new Error('Input must be an array of projects');
      }
      
      // 克隆原始数据以避免修改原始对象
      const result = JSON.parse(JSON.stringify(projectList));
      
      // 生成时间范围内的日期列表
      const startDate = new Date(startTime.split(' ')[0]); // 取日期部分
      const endDate = new Date(endTime.split(' ')[0]);     // 取日期部分
      const datesList = [];
      
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // 格式化为 YYYY-MM-DD 格式
        const dateStr = currentDate.toISOString().split('T')[0];
        datesList.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // 遍历每个项目
      result.forEach(project => {
        // 创建一个映射，用于快速查找已有的日期数据
        const dateMap = {};
        
        // 将现有的日期数据添加到映射中
        if (project.items && Array.isArray(project.items)) {
          project.items.forEach(item => {
            // 处理日期格式，可能是 Date 对象或字符串
            let dateKey = item.weHappenDay;
            if (dateKey instanceof Date) {
              dateKey = dateKey.toISOString().split('T')[0];
            } else if (typeof dateKey === 'string') {
              dateKey = dateKey.split('T')[0]; // 去掉时间部分，只保留日期
            }
            dateMap[dateKey] = item;
          });
        } else {
          // 如果项目没有items数组，初始化一个
          project.items = [];
        }
        
        // 创建一个新的items数组，按照日期范围包含所有日期的数据
        const newItems = [];
        
        // 遍历生成的日期列表
        datesList.forEach(dateStr => {
          // 如果该日期已有数据，使用现有数据；否则创建新的数据项
          if (dateMap[dateStr]) {
            // 确保数据格式正确
            const existingItem = dateMap[dateStr];
            newItems.push({
              totalCount: existingItem.totalCount || "0",
              weHappenDay: dateStr
            });
          } else {
            newItems.push({
              totalCount: "0",
              weHappenDay: dateStr
            });
          }
        });
        
        // 用新的items数组替换原来的数组
        project.items = newItems;
      });
  
      return result;
    },
  
    /**
     * 填充按天数据但保持小时格式的公共方法
     * @param {Array} projectList 项目列表数组
     * @param {String} startTime 开始时间
     * @param {String} endTime 结束时间
     * @returns {Array} 处理后的项目列表数组
     */
    fillDailyDataWithHourFormat(projectList, startTime, endTime) {
      // 检查输入是否为数组
      if (!Array.isArray(projectList)) {
        throw new Error('Input must be an array of projects');
      }
      
      // 克隆原始数据以避免修改原始对象
      const result = JSON.parse(JSON.stringify(projectList));
      
      // 生成时间范围内的日期列表
      const startDate = new Date(startTime.split(' ')[0]); // 取日期部分
      const endDate = new Date(endTime.split(' ')[0]);     // 取日期部分
      const datesList = [];
      
      const currentDate = new Date(startDate);
      let dayOffset = 0;
      while (currentDate <= endDate) {
        // 格式化为 YYYY-MM-DD 格式
        const dateStr = currentDate.toISOString().split('T')[0];
        datesList.push({
          date: dateStr,
          hourRepresentation: dayOffset.toString()
        });
        currentDate.setDate(currentDate.getDate() + 1);
        dayOffset++;
      }
      
      // 遍历每个项目
      result.forEach(project => {
        // 创建一个映射，用于快速查找已有的数据
        const dataMap = {};
        
        // 将现有的数据添加到映射中
        if (project.items && Array.isArray(project.items)) {
          project.items.forEach(item => {
            // 使用 weHappenDay 作为键
            if (item.weHappenDay) {
              let dateKey = item.weHappenDay;
              if (dateKey instanceof Date) {
                dateKey = dateKey.toISOString().split('T')[0];
              } else if (typeof dateKey === 'string') {
                dateKey = dateKey.split('T')[0]; // 去掉时间部分，只保留日期
              }
              dataMap[dateKey] = item;
            }
          });
        } else {
          // 如果项目没有items数组，初始化一个
          project.items = [];
        }
        
        // 创建一个新的items数组，按照日期范围包含所有日期的数据
        const newItems = [];
        
        // 遍历生成的日期列表
        datesList.forEach(dateInfo => {
          // 如果该日期已有数据，使用现有数据；否则创建新的数据项
          if (dataMap[dateInfo.date]) {
            // 确保数据格式正确，同时保持 weHappenHour 字段
            const existingItem = dataMap[dateInfo.date];
            newItems.push({
              totalCount: existingItem.totalCount || "0",
              weHappenHour: dateInfo.hourRepresentation,
              weHappenDay: dateInfo.date
            });
          } else {
            newItems.push({
              totalCount: "0",
              weHappenHour: dateInfo.hourRepresentation,
              weHappenDay: dateInfo.date
            });
          }
        });
        
        // 用新的items数组替换原来的数组
        project.items = newItems;
      });
  
      return result;
    },
  /**
   * 判断是否是本地运行环境
   * @param {Object} accountInfo - 可选的账户配置信息，如果不提供则从 WebfunnyConfig 中获取
   * @returns {boolean} true表示本地运行，false表示服务器运行
   */
  isLocalEnvironment(accountInfo = null) {
    const os = require("os")
    
    // 方法1: 通过 NODE_ENV 环境变量判断（最可靠）
    const nodeEnv = process.env.NODE_ENV || process.env.BUILD_ENV || '';
    if (nodeEnv === 'local' || nodeEnv === 'development' || nodeEnv === 'dev') {
      return true;
    }
    if (nodeEnv === 'production' || nodeEnv === 'pro' || nodeEnv === 'staging' || nodeEnv === 'stag') {
      return false;
    }
    
    // 方法2: 通过域名配置判断（如果域名包含 localhost 或 127.0.0.1，则认为是本地）
    let serverDomain = '';
    let assetsDomain = '';
    
    if (accountInfo) {
      // 如果传入了 accountInfo，使用传入的配置
      serverDomain = accountInfo.localServerDomain || '';
      assetsDomain = accountInfo.localAssetsDomain || '';
    } else {
      // 否则从 WebfunnyConfig 中获取域名配置
      const { domainConfig } = WebfunnyConfig;
      serverDomain = domainConfig.host.be || '';
      assetsDomain = domainConfig.host.fe || '';
    }
    
    if (serverDomain.includes('localhost') || serverDomain.includes('127.0.0.1') ||
        assetsDomain.includes('localhost') || assetsDomain.includes('127.0.0.1')) {
      return true;
    }
    
    // 方法3: 通过主机名判断（作为补充判断，不够准确）
    const hostname = os.hostname().toLowerCase();
    if (hostname.includes('local') || hostname === 'localhost') {
      // 注意：内网IP可能是服务器，所以这个方法不够准确，仅作为补充判断
      return true;
    }
    
    // 默认情况：如果 NODE_ENV 未设置且域名不是 localhost，则认为是服务器环境
    return false;
  },
  /**
   * 根据字段类型和长度映射到 ClickHouse 实际类型
   * @param {String} fieldType - 字段类型：INT、BIGINT、FLOAT
   * @param {Number} fieldLength - 字段长度
   * @returns {String} ClickHouse 类型：Int8、Int16、Int32、Int64、Float32、Float64
   */
  mapToClickHouseType(fieldType, fieldLength) {
    const length = parseInt(fieldLength) || 10;
    
    // 整数类型映射
    if (fieldType === 'INT' || fieldType === 'int') {
      if (length <= 3) {
        // -128 ~ 127
        return 'Int8';
      } else if (length <= 5) {
        // -32768 ~ 32767
        return 'Int16';
      } else if (length <= 10) {
        // -2147483648 ~ 2147483647
        return 'Int32';
      } else {
        // -9223372036854775808 ~ 9223372036854775807
        return 'Int64';
      }
    }
    
    // 大整数类型映射（统一使用 Int64）
    if (fieldType === 'BIGINT' || fieldType === 'bigint') {
      return 'Int64';
    }
    
    // 浮点数类型映射
    if (fieldType === 'FLOAT' || fieldType === 'float') {
      if (length <= 7) {
        // 约7位有效数字
        return 'Float32';
      } else {
        // 约16位有效数字
        return 'Float64';
      }
    }
    
    // 字符串类型
    if (fieldType === 'VARCHAR' || fieldType === 'varchar' || fieldType === 'STRING' || fieldType === 'string') {
      return 'String';
    }
    
    // 默认返回 String
    return 'String';
  },

  /**
   * 验证字段名称是否符合 ClickHouse 规范
   * @param {string} fieldAlias - 用户输入的字段别名（可能包含中文）
   * @returns {Object} - { valid: boolean, fieldName: string, message: string }
   */
  validateFieldName(fieldAlias) {
    // 1. 先将中文转成拼音
    const fieldName = Utils.pinYinToHump(fieldAlias);
    
    // 2. 长度验证（1-64字符）
    if (!fieldName || fieldName.length < 1 || fieldName.length > 64) {
      return { valid: false, fieldName, message: '字段名称长度必须在 1-64 个字符之间' };
    }
    
    // 3. 必须以字母或下划线开头
    if (!/^[a-zA-Z_]/.test(fieldName)) {
      return { valid: false, fieldName, message: '字段名称必须以字母或下划线开头' };
    }
    
    // 4. 只能包含字母、数字、下划线
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName)) {
      return { valid: false, fieldName, message: '字段名称只能包含字母、数字、下划线' };
    }
    
    // 5. 不能是纯数字
    if (/^\d+$/.test(fieldName)) {
      return { valid: false, fieldName, message: '字段名称不能为纯数字' };
    }
    
    // 6. 检查是否为系统保留字段
    if (!Utils.checkFieldNameValid(fieldName)) {
      return { valid: false, fieldName, message: '该字段名称为系统保留字段，请更换' };
    }
    
    return { valid: true, fieldName, message: '' };
  },
   // 检查是否是私有/内网 IP
  isPrivateIp(ip) {
    if (!ip) return true
    // 私有 IP 范围
    const privateRanges = [
      /^10\./,                          // 10.0.0.0 - 10.255.255.255
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0 - 172.31.255.255
      /^192\.168\./,                     // 192.168.0.0 - 192.168.255.255
      /^127\./,                          // 127.0.0.0 - 127.255.255.255 (本地回环)
      /^0\./,                            // 0.0.0.0 - 0.255.255.255
      /^169\.254\./,                     // 169.254.0.0 - 169.254.255.255 (链路本地)
      /^::1$/,                           // IPv6 本地回环
      /^fc00:/i,                         // IPv6 私有地址
      /^fe80:/i,                         // IPv6 链路本地
    ]
    return privateRanges.some(regex => regex.test(ip))
  },
  // 根据ip获取地理位置 (使用 ip2region v2，支持 IPv4 和 IPv6)
  async analysisIp(eventIp) {
    let ipInfo = {
      country: "未知",
      province: "未知",
      city: "未知",
      operators: "未知"
    }
    if (!eventIp) return ipInfo;
    
    // 跳过私有 IP，直接返回内网标记
    if (Utils.isPrivateIp(eventIp)) {
      ipInfo.country = "内网"
      ipInfo.province = "内网"
      ipInfo.city = "内网"
      return ipInfo
    }
    
    try {
      // 使用 ip2region v2 进行查询（支持 IPv4 和 IPv6）
      const res = ip2regionQuery.search(eventIp)
      if (res) {
        // 新版返回格式: { country: '中国', province: '广东省', city: '深圳市', isp: '阿里云' }
        ipInfo.country = res.country || "未知"
        ipInfo.province = res.province || "未知"
        ipInfo.city = res.city || "未知"
        ipInfo.operators = res.isp || "未知"
        
        // 如果解析结果为空字符串，标记为未知
        if (ipInfo.province === "" || ipInfo.province === "0") {
          ipInfo.province = "未知"
        }
        if (ipInfo.city === "" || ipInfo.city === "0") {
          ipInfo.city = "未知"
        }
        if (ipInfo.operators === "" || ipInfo.operators === "0") {
          ipInfo.operators = "未知"
        }
      }
    } catch(e) {
      // log.printError("IP定位失败：", eventIp, e)
      // 降级使用缓存
      if (global.WebfunnyIpStores && global.WebfunnyIpStores[eventIp]) {
        return global.WebfunnyIpStores[eventIp]
      }
    }
    return ipInfo
  },
}

module.exports = Utils