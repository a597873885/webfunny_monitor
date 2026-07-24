const utils = require("./utils")
module.exports = {
  /**
   * 生成分群 Bitmap 过滤 SQL 片段
   * @param {string} projectId - 项目ID
   * @param {string} segmentId - 分群ID
   * @param {string} weUserIdRef - weUserId 的 SQL 引用（如 'u.weUserId' 或 't0.weUserId'）
   * @param {string} operator - 'include'（属于分群）或 'exclude'（不属于分群）
   * @returns {string} SQL 片段
   */
  getSegmentFilterSql: function(projectId, segmentId, weUserIdRef, operator = 'include') {
    const tableName = `${projectId}_segment_results`;
    const subquery = `SELECT arrayJoin(bitmapToArray(userBitmap)) FROM ${tableName} WHERE segmentId = '${segmentId}'`;
    if (operator === 'include') {
      return `cityHash64(${weUserIdRef}) IN (${subquery})`;
    } else {
      return `cityHash64(${weUserIdRef}) NOT IN (${subquery})`;
    }
  },
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
  handleQueryCriteriaSql: function(tableName, calcField, queryCriteria, options = {}) {
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
      
      // 获取选项
      const { needJoinUserTable = false, userTableName = '', projectId = null } = options;
      
      var criteriaSql = ''
      for (let j = 0; j < queryCriteria.length; j++) {
          let fieldName = queryCriteria[j].fieldName;
          let rule = utils.convertOper(queryCriteria[j].rule)
          let value = queryCriteria[j].value
          let weType = queryCriteria[j].weType; // 获取 weType 字段
          
          // 跳过空的 fieldName（避免生成无效的 SQL）
          if (!fieldName || fieldName.trim() === '') {
              continue;
          }
          
          // 根据 weType 决定使用哪个表名作为前缀
          let tablePrefix = tableName; // 默认使用日志表
          if (needJoinUserTable && (weType === 3 || weType === 4 || weType === 5 || weType === '3' || weType === '4' || weType === '5')) {
            // 用户属性（预置或自定义）和分群字段使用用户表别名 u
            tablePrefix = 'u';
          }
          
          // 处理 calcField 的 weType（针对 isRepeat=9/10 的分群操作，使用 Bitmap 分群结果表）
          let calcFieldWeType = calcField.weType;
          if (calcField.isRepeat === '9' || calcField.isRepeat === '10') {
            // 属于分群/不属于分群，使用 Bitmap
            if (projectId) {
              const filterOp = calcField.isRepeat === '9' ? 'include' : 'exclude';
              const segmentId = calcField.fieldName;
              const tableRef = needJoinUserTable ? 'u' : tableName;
              criteriaSql = " " + criteriaSql + this.getSegmentFilterSql(projectId, segmentId, `${tableRef}.weUserId`, filterOp) + " " + andOr + " ";
            }
          }
          
          if (rule === 'is null') {
              criteriaSql = " " + criteriaSql + "("+ `${tablePrefix}.${fieldName}` + " " + rule + " or " + `${tablePrefix}.${fieldName}` + "='') " + andOr + " ";
          }  else if (rule === 'is not null') {
              criteriaSql = " " + criteriaSql + "("+ `${tablePrefix}.${fieldName}` + " " + rule + " and " + `${tablePrefix}.${fieldName}` + "!='') " + andOr + " ";
          }  else if (rule === 'in') {
              let valueArray = value.split(",");
              let valueListStr = '';
              for (let k = 0; k < valueArray.length; k++) {
                  valueListStr +=  `${tablePrefix}.${fieldName}` + " like '%" + valueArray[k]  + "%' "  + " or ";
              }
              valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('or'));
              criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
          } else if (rule === 'not in') {
              let valueArray = value.split(",");
              let valueListStr = '';
              for (let k = 0; k < valueArray.length; k++) {
                  valueListStr +=  `${tablePrefix}.${fieldName}` + " not like '%" + valueArray[k]  + "%' "  + " and ";
              }
              valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('and'));
              criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
          } else if (rule === '区间') {//[{"fieldName":"weNewStatus","rule":"区间","value":"1,2"}]
            let valueArray = value.split(",");
            let valueListStr = `${tablePrefix}.${fieldName}` + " >=" + valueArray[0] + " and " + `${tablePrefix}.${fieldName}` + " <=" + valueArray[1];
            criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
          } else if (rule === '属于分群' || rule === '属于') {
            // 使用 Bitmap 分群结果表，不再依赖用户表 segmentIds 字段
            const segmentId = value || fieldName;
            if (projectId && tablePrefix) {
              const segmentFilterSql = this.getSegmentFilterSql(projectId, segmentId, `${tablePrefix}.weUserId`, 'include');
              criteriaSql = " " + criteriaSql + segmentFilterSql + " " + andOr + " ";
            }
          } else if (rule === '不属于分群' || rule === '不属于') {
            // 使用 Bitmap 分群结果表，不再依赖用户表 segmentIds 字段
            const segmentId = value || fieldName;
            if (projectId && tablePrefix) {
              const segmentFilterSql = this.getSegmentFilterSql(projectId, segmentId, `${tablePrefix}.weUserId`, 'exclude');
              criteriaSql = " " + criteriaSql + segmentFilterSql + " " + andOr + " ";
            }
          } else {
              criteriaSql = " " + criteriaSql + `${tablePrefix}.${fieldName}` + " " + rule + " '" + value + "'" + " " + andOr + " ";
          }
      }
      // 只有当 criteriaSql 不为空时，才截取 andOr 并包裹括号
      if (criteriaSql && criteriaSql.trim()) {
          criteriaSql = criteriaSql.substring(0, criteriaSql.lastIndexOf(andOr));
          querySql = " " + querySql + " and (" + criteriaSql + ")";
      } else {
          // 所有条件都被跳过（例如 fieldName 都为空），不生成任何 SQL
          querySql = " " + querySql + " ";
      }
    } else {
      querySql = " " + querySql + " "
    }
    return querySql
  },
  /**
   * 处理嵌套的全局筛选条件（支持 combineType 和 queryCriteria 嵌套）
   * @param {string} tableName - 表名
   * @param {Object} globalFilter - 全局筛选条件 { combineType: 'a'|'o', queryCriteria: [...] }
   * @param {Object} options - 选项 { needJoinUserTable: boolean, userTableName: string }
   * @returns {string} SQL 条件片段
   */
  handleGlobalFilterSql: function(tableName, globalFilter, options = {}) {
    if (!globalFilter || !globalFilter.queryCriteria || globalFilter.queryCriteria.length === 0) {
      return " "
    }
  
    const { combineType = 'a', queryCriteria = [] } = globalFilter;
    const andOr = combineType === 'o' ? 'or' : 'and';
    const { needJoinUserTable = false, userTableName = '', projectId = null } = options;
      
    let criteriaSql = '';
      
    for (let i = 0; i < queryCriteria.length; i++) {
      const item = queryCriteria[i];
        
      // 如果包含嵌套的 queryCriteria，递归处理
      if (item.combineType && item.queryCriteria) {
        const nestedSql = this.handleGlobalFilterSql(tableName, item, options);
        if (nestedSql.trim()) {
          // 去掉嵌套SQL开头的 " and "
          const trimmedSql = nestedSql.trim().replace(/^and\s+/, '');
          criteriaSql += " (" + trimmedSql + ") " + andOr + " ";
        }
      } 
      // 单层条件
      else if (item.fieldName && item.rule) {
        let fieldName = item.fieldName;
        let rule = utils.convertOper(item.rule);
        let value = item.value || '';
        let weType = item.weType;
        
        // 根据 weType 决定使用哪个表名作为前缀
        let tablePrefix = tableName;
        if (needJoinUserTable && (weType === 3 || weType === 4 || weType === 5 || weType === '3' || weType === '4' || weType === '5')) {
          // 用户属性（预置或自定义）和分群字段使用用户表别名 u
          tablePrefix = 'u';
        }
          
        // 处理"属于分群"和"不属于分群"（使用 Bitmap 分群结果表）
        if (rule === '属于分群' || rule === '属于') {
          // 分群ID优先取 value，如果 value 为空则取 fieldName
          const segmentId = value || fieldName;
          if (projectId) {
            // 分群过滤基于用户表的 weUserId（通过 cityHash64 匹配 Bitmap）
            const tableRef = needJoinUserTable && userTableName ? 'u' : tableName;
            criteriaSql += " " + this.getSegmentFilterSql(projectId, segmentId, `${tableRef}.weUserId`, 'include') + " " + andOr + " ";
          }
        } else if (rule === '不属于分群' || rule === '不属于') {
          const segmentId = value || fieldName;
          if (projectId) {
            const tableRef = needJoinUserTable && userTableName ? 'u' : tableName;
            criteriaSql += " " + this.getSegmentFilterSql(projectId, segmentId, `${tableRef}.weUserId`, 'exclude') + " " + andOr + " ";
          }
        } else if (rule === 'is null') {
          criteriaSql += " (" + `${tablePrefix}.${fieldName}` + " is null or " + `${tablePrefix}.${fieldName}` + "='') " + andOr + " ";
        } else if (rule === 'is not null') {
          criteriaSql += " (" + `${tablePrefix}.${fieldName}` + " is not null and " + `${tablePrefix}.${fieldName}` + "!='') " + andOr + " ";
        } else if (rule === 'in') {
          let valueArray = value.split(",");
          let valueListStr = '';
          for (let k = 0; k < valueArray.length; k++) {
            valueListStr += `${tablePrefix}.${fieldName}` + " like '%" + valueArray[k] + "%' " + " or ";
          }
          valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('or'));
          criteriaSql += " (" + valueListStr + ")" + " " + andOr + " ";
        } else if (rule === 'not in') {
          let valueArray = value.split(",");
          let valueListStr = '';
          for (let k = 0; k < valueArray.length; k++) {
            valueListStr += `${tablePrefix}.${fieldName}` + " not like '%" + valueArray[k] + "%' " + " and ";
          }
          valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('and'));
          criteriaSql += " (" + valueListStr + ")" + " " + andOr + " ";
        } else if (rule === '区间') {
          let valueArray = value.split(",");
          let valueListStr = `${tablePrefix}.${fieldName}` + " >=" + valueArray[0] + " and " + `${tablePrefix}.${fieldName}` + " <=" + valueArray[1];
          criteriaSql += " (" + valueListStr + ")" + " " + andOr + " ";
        } else {
          criteriaSql += " " + `${tablePrefix}.${fieldName}` + " " + rule + " '" + value + "'" + " " + andOr + " ";
        }
      }
    }
      
    // 移除最后一个 andOr
    if (criteriaSql.endsWith(andOr + " ")) {
      criteriaSql = criteriaSql.substring(0, criteriaSql.length - andOr.length - 1);
    }
      
    return criteriaSql ? " and (" + criteriaSql + ")" : " ";
  },
  /**
   * 检查全局筛选条件是否包含分群相关条件
   * @param {Object} globalFilter - 全局筛选条件
   * @returns {boolean} 是否包含分群条件
   */
  hasSegmentFilter: function(globalFilter) {
    if (!globalFilter || !globalFilter.queryCriteria) {
      return false;
    }
      
    const { queryCriteria = [] } = globalFilter;
      
    for (let i = 0; i < queryCriteria.length; i++) {
      const item = queryCriteria[i];
        
      // 递归检查嵌套条件
      if (item.combineType && item.queryCriteria) {
        if (this.hasSegmentFilter(item)) {
          return true;
        }
      }
      // 检查单层条件
      else if (item.rule) {
        const rule = utils.convertOper(item.rule);
        if (rule === '属于分群' || rule === '不属于分群' || rule === '属于' || rule === '不属于') {
          return true;
        }
      }
    }
      
    return false;
  }
}