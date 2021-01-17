require("./extension")
const crypto = require("crypto")
const myAtob = require("atob")
const fetch = require('node-fetch')
const uuid = require('node-uuid')
const nodemailer = require('nodemailer')
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
  b64EncodeUnicode: function(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode("0x" + p1)
    }))
  },
  b64DecodeUnicode: function(str) {
    try {
      return decodeURIComponent(myAtob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
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
  setTableName(name) {
    return name + new Date().Format("yyyyMMdd")
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
    const paramStr = data.replace(/": Script error\./g, "script error")
    const param = JSON.parse(paramStr)
    const { logInfo } = param
    if (!logInfo) {
      console.log(param, typeof param)
    }
    return logInfo.split("$$$")
  },

  /**
   * 自己配置邮箱，bin/useCusEmailSys.js 参数改为true
   */
  sendEmail: (email, subject, html, user, pass) => {
    const company = "webfunny.cn"
    let transporter = nodemailer.createTransport({
      host: "smtp.163.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: { user,pass }
    });
    // send mail with defined transport object
    transporter.sendMail({
      from: "'" + company + "' <" + user + ">", // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: html, // plain text body
      html: html // html body
    });
  },
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
  }
}

module.exports = Utils
