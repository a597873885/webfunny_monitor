const utils = require("./utils")
module.exports = {
  createTimeScopeSql: function (day) {
    const startTime = utils.addDays(0 - day) + " 00:00:00"
    const endTime = utils.addDays(0 - day + 1) + " 00:00:00"
    const startSql = " and createdAt >= '" + startTime + "' "
    const endSql = " and createdAt < '" + endTime + "' "
    return startSql + endSql
  },
  happenTimeScopeSql: function (day) {
    const startTime = new Date(utils.addDays(0 - day) + " 00:00:00")
    const endTime = new Date(utils.addDays(0 - day + 1) + " 00:00:00")
    const startSql = " and happenTime >= '" + startTime + "' "
    const endSql = " and happenTime < '" + endTime + "' "
    return startSql + endSql
  },
  setTableName: function (startName, day, webMonitorId = "") {
    const endName = utils.addDays(0 - day).replace(/-/g, "")
    return webMonitorId + startName + endName
  },
  handleMultiSql: function(keyArray, logInfoList) {
    let keys = ""
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
      } else {
        keys += "`" + key + "`, "
      }
    })
    // 组合值
    let valueSql = ""
    logInfoList.forEach((data, index) => {
      // 如果日志类型是CUSTOMER_PV，处理referrer
      if (data.uploadType === "CUSTOMER_PV") {
        const tempReferrerStr = data.referrer
        if (tempReferrerStr) {
          const domainReg = /https?:\/\/(\w+[.])+\w+\//
          const referrerArr = tempReferrerStr.match(domainReg)
          if (referrerArr && referrerArr.length) {
            const tempReferrer = referrerArr[0].replace(/http:\/\//g, "").replace(/https:\/\//g, "").replace(/\//g, "")
            data.referrer = tempReferrer
          }
        }
        data.province = data.province.length > 50 ? "" : data.province
      }
      if (data.uploadType === "ELE_BEHAVIOR") {
        // inputValue, innerText, placeholder 进行长度验证
        if (data.inputValue && data.inputValue.length > 500) {
          data.inputValue = data.inputValue.substring(0, 490) + "..."
        }
        if (data.innerText && data.innerText.length > 500) {
          data.innerText = data.innerText.substring(0, 490) + "..."
        }
        if (data.placeholder && data.placeholder.length > 200) {
          data.placeholder = data.placeholder.substring(0, 190) + "..."
        }
      }
      if (data.uploadType === "JS_ERROR") {
        data.province = ""
        data.city = ""
      }

      let values = ""
      keyArray.forEach((key, index) => {
        if (index == keyArray.length - 1) {
          let val = data[key]
          if (val != undefined) {
            values += "'" + val + "'"
          } else {
            values += "DEFAULT"
          }
        } else {
          let val = data[key]
          if (val != undefined) {
            values += "'" + val + "', "
          } else {
            values += "DEFAULT, "
          }
        }
      })

      if (index === logInfoList.length - 1) {
        valueSql += " (" + values + ")"
      } else {
        valueSql += " (" + values + "), "
      }

    })
    return {keys, valueSql}
  }
}