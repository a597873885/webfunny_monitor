require("./extension")
const myAtob = require("atob")
const crypto = require('crypto')
const nodemailer = require('nodemailer');
// const localDb = require('../config/local_db')
const Utils = {
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
  sendEmailFromCustomer: (sourceEmail, password, subject, html, toEmail) => {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (!reg.test(sourceEmail) || !reg.test(toEmail)) return
    let transporter = nodemailer.createTransport({
      host: "smtp.163.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: sourceEmail, // generated ethereal user
        pass: password // generated ethereal password
      }
    });
    // send mail with defined transport object
    transporter.sendMail({
      from: '"邮箱报警服务" <' + sourceEmail + '>', // sender address
      to: toEmail, // list of receivers
      subject: subject, // Subject line
      text: html, // plain text body
      html: html // html body
    });
  },
  // sendEmail: (email, subject, html) => {
  //   const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  //   if (!reg.test(email)) return
  //   let transporter = nodemailer.createTransport({
  //     host: "smtp.163.com",
  //     port: 465,
  //     secure: true, // true for 465, false for other ports
  //     auth: {
  //       user: localDb.emailConfig.user, // generated ethereal user
  //       pass: localDb.emailConfig.pass // generated ethereal password
  //     }
  //   });
  //   // send mail with defined transport object
  //   transporter.sendMail({
  //     from: '"邮箱验证码" <jiang1125712@163.com>', // sender address
  //     to: email, // list of receivers
  //     subject: subject, // Subject line
  //     text: html, // plain text body
  //     html: html // html body
  //   });
  // },
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
  }
}

module.exports = Utils