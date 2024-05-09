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
  handleQueryCriteriaSql: function(tableName, calcField, queryCriteria) {
    let querySql = ""
    if (queryCriteria.length > 0) {
      // 获取 “且”-and 还是 “或”-or
      let andOr = calcField.andOr;
      //兼容老版本
      if (!calcField.andOr || calcField.andOr === undefined) {
          andOr = 'and'
      } else {
          andOr = utils.convertAndOr(andOr);
      }
      var criteriaSql = ''
      for (let j = 0; j < queryCriteria.length; j++) {
          let fieldName = queryCriteria[j].fieldName;
          let rule = utils.convertOper(queryCriteria[j].rule)
          let value = queryCriteria[j].value
          if (rule === 'is null') {
              criteriaSql = " " + criteriaSql + "("+ `${tableName}.${fieldName}` + " " + rule + " or " + `${tableName}.${fieldName}` + "='') " + andOr + " ";
          }  else if (rule === 'is not null') {
              criteriaSql = " " + criteriaSql + "("+ `${tableName}.${fieldName}` + " " + rule + " and " + `${tableName}.${fieldName}` + "!='') " + andOr + " ";
          }  else if (rule === 'in') {
              let valueArray = value.split(",");
              let valueListStr = '';
              for (let k = 0; k < valueArray.length; k++) {
                  valueListStr +=  `${tableName}.${fieldName}` + " like '%" + valueArray[k]  + "%' "  + " or ";
              }
              valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('or'));
              criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
          } else if (rule === 'not in') {
              let valueArray = value.split(",");
              let valueListStr = '';
              for (let k = 0; k < valueArray.length; k++) {
                  valueListStr +=  `${tableName}.${fieldName}` + " not like '%" + valueArray[k]  + "%' "  + " and ";
              }
              valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('and'));
              criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
          }else {
              criteriaSql = " " + criteriaSql + `${tableName}.${fieldName}` + " " + rule + " '" + value + "'" + " " + andOr + " ";
          }
      }
      criteriaSql = criteriaSql.substring(0, criteriaSql.lastIndexOf(andOr));
      querySql = " " + querySql + " and (" + criteriaSql + ")";
    } else {
      querySql = " " + querySql + " "
    }
    return querySql
  }
}