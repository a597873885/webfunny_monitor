const db = require('../config/db');
                        const Sequelize = db.sequelize;
                        const Utils = require('../util/utils');
                        const utils = require('../util/utils');
                        const geoip = require('geoip-lite');
                        const log = require("../config/log");
                        const CommonSql = require("../util/commonSql")
                        const { UPLOAD_TYPE } = require('../config/consts')
                        const AccountConfig = require('../config/AccountConfig')
                        const { accountInfo } = AccountConfig
                        const sourceMap = require('source-map')
                        const fs = require('fs');
                        const fetch = require('node-fetch');


class CustomerPvLeaveModel {
  /**
   * 创建CustomerPV信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createCustomerPvLeave(data) {
    // console.log(data)
    // return
    let keys = ""
    let values = ""
    const keyArray = [`leaveType`, `uploadType`, `happenDate`, `webMonitorId`, `customerKey`,`simpleUrl`,`id`,`createdAt`,`updatedAt`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "CustomerPvLeave" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }


  /**
   * 计算某一小时用户跳出率
   */
  static async calculateCusLeavePercentByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPvLeave", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPvLeave", 1, webMonitorId)
    }
    let sql1 = "select count(*) as count from " + tableName + " where  happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and leaveType=2"
    let countDataFor2 = await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
    let sql2 = "select count(*) as count from " + tableName + " where  happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and leaveType=1"
    let totalData = await Sequelize.query(sql2, { type: Sequelize.QueryTypes.SELECT})
    const countFor2 = countDataFor2 ? parseInt(countDataFor2[0].count, 10) : 0
    const total = parseInt(totalData[0].count, 10)
    
    const res = total ? (total - countFor2) / total : 0
    return Utils.toFixed(res * 100, 2)
  }

  /**
   * 获取24小时内每小时新用户量
   */
  static async getCusLeavePercentByTime(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = nowTime
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + UPLOAD_TYPE.CUS_LEAVE_FOR_HOUR + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时新用户量
   * @returns {Promise<*>}
   */
  static async getCusLeavePercentSevenDayAgoByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = startTime + (timeSize + 1) * 24 * 3600 * 1000
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + UPLOAD_TYPE.CUS_LEAVE_FOR_HOUR + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getCusLeavePercentForDay(webMonitorId, useDay, uploadTypeForDay) {
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql1 = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    let sumData = await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
    let sql2 = "SELECT count(*) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and hourCount>0 and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    let countData = await Sequelize.query(sql2, { type: Sequelize.QueryTypes.SELECT})
    const sum = sumData ? parseFloat(sumData[0].count) : 0
    const hourCount = parseFloat(countData[0].count)
    const res = (sum && hourCount) ? Utils.toFixed(sum / hourCount, 2) : 0
    return res
  }

  /**
   * 根据参数获取当天的跳出率数据
   */
  static async getCusLeavePercentDataForDay(webMonitorId, day) {
    let sql = "select dayName, dayCount from InfoCountByDay where webMonitorId='" + webMonitorId + "' and dayName>='" + day + "' and uploadType='" + UPLOAD_TYPE.CUS_LEAVE_FOR_DAY + "' order by dayName desc"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}



class CustomerStayTimeModel {
  /**
   * 创建CustomerPV信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createCustomerStayTime(data) {
    // console.log(data)
    // return
    let keys = ""
    let values = ""
    const keyArray = [`stayTime`, `uploadType`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`id`,`createdAt`,`updatedAt`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "CustomerStayTime" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }


  /**
   * 计算某一小时用户平均停留时间
   */
  static async calculateStayTimeByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerStayTime", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerStayTime", 1, webMonitorId)
    }
    const {min, max} = accountInfo.stayTimeScope
    let sql1 = "select SUM(stayTime) as count from " + tableName + " where  happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and stayTime>=" + min + " and stayTime<=" + max
    let sumData = await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
    let sql2 = "select count(distinct customerKey) as count from " + tableName + " where  happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and stayTime>=" + min + " and stayTime<=" + max
    let countData = await Sequelize.query(sql2, { type: Sequelize.QueryTypes.SELECT})
    const sum = sumData ? parseInt(sumData[0].count, 10) : 0
    const userCount = parseInt(countData[0].count, 10)
    const res = (sum && userCount) ? Utils.toFixed(sum / 1000 / userCount, 2) : 0
    return res
  }


  static async getStayTimeForDay(webMonitorId, useDay, uploadTypeForDay) {
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql1 = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    let sumData = await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
    let sql2 = "SELECT count(*) as count from InfoCountByHour where  hourName>='" + startHour + "' and hourName<='" + endHour + "' and hourCount>0 and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    let countData = await Sequelize.query(sql2, { type: Sequelize.QueryTypes.SELECT})
    const sum = sumData ? parseFloat(sumData[0].count) : 0
    const hourCount = parseFloat(countData[0].count)
    const res = (sum && hourCount) ? Utils.toFixed(sum / hourCount, 2) : 0
    return res
  }

  static async getStayTimeForEveryDay(param) {
    const { webMonitorId, day } = param
    const dateStr = Utils.addDays(0 - day)
    const sql = "SELECT dayName, dayCount from InfoCountByDay WHERE createdAt>='" + dateStr + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + UPLOAD_TYPE.STAY_TIME_FOR_DAY + "' order by dayName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}



class ScreenShotInfoModel {
  /**
   * 创建ScreenShotInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createScreenShotInfo(data) {
  }

  /**
   * 获取ScreenShotInfo列表
   * @returns {Promise<*>}
   */
  static async getScreenShotInfoListByPage() {
    let sql = "select * from ScreenShotInfo WHERE webMonitorId='mcl_webmonitor' limit 200, 300"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser(happenTimeSql, userIdSql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("ScreenShotInfo", timeScope, webMonitorId) + " where " + happenTimeSql + "and" + userIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async deleteScreenShotInfoFifteenDaysAgo(days) {
    const timeScope = Utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from ScreenShotInfo where createdAt<'" + timeScope + "'"
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  }
}



class BehaviorInfoModel {
  /**
   * 创建行为信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createBehaviorInfo(data) {
    let keys = ""
    let values = ""
    const keyArray = ["uploadType","happenTime","happenDate","webMonitorId","customerKey","simpleUrl","completeUrl","userId","firstUserParam","secondUserParam","createdAt","updatedAt","id","behaviorType","className","placeholder","inputValue","tagName","innerText"]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "BehaviorInfo" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  /**
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteBehaviorInfoFifteenDaysAgo(days) {
    const timeScope = Utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from " + Utils.setTableName("BehaviorInfo") + " where createdAt<'" + timeScope + "'"
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser(customerKeySql, happenTimeSql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("BehaviorInfo", timeScope, webMonitorId) + " where " + happenTimeSql + " and " + customerKeySql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

}

class CommonModel {
  /**
   * 检查mysql错误连接数是否达到最大值
   */
  static async checkMysqlConnectErrors() {
    let sql = "select ip, SUM_CONNECT_ERRORS as count from performance_schema.host_cache"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 检查mysql连接数
   */
  static async checkMysqlConnects() {
    let sql = "SELECT * from information_schema.GLOBAL_STATUS WHERE VARIABLE_NAME='MAX_USED_CONNECTIONS'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除对应的数据库
   */
  static async deleteTableByName(tableName) {
    let sql = "drop table " + tableName
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

}

const DeviceInfoCountByDay = Sequelize.import('../schema/deviceInfoCountByDay');
DeviceInfoCountByDay.sync({force: false});


class DeviceInfoCountByDayModel {
  /**
   * 创建DeviceInfoCountByDay信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createDeviceInfoCountByDay(data) {
    return await DeviceInfoCountByDay.create({
      ...data
    })
  }

  /**
   * 更新DeviceInfoCountByDay数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateDeviceInfoCountByDay(id, data) {
    await DeviceInfoCountByDay.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取DeviceInfoCountByDay列表
   * @returns {Promise<*>}
   */
  static async getDeviceInfoCountByDayList() {
    return await DeviceInfoCountByDay.findAndCountAll()
  }

  /**
   * 获取DeviceInfoCountByDay详情数据
   * @param id  DeviceInfoCountByDay的ID
   * @returns {Promise<Model>}
   */
  static async getDeviceInfoCountByDayDetail(id) {
    return await DeviceInfoCountByDay.findOne({
      where: {
        id,
      },
    })
  }
  static async getDeviceCountByDay(webMonitorId, useDay, uploadType) {
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql = "SELECT showName, SUM(hourCount) as count from DeviceInfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadType + "' group by showName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  
  /**
   * 获取DeviceInfoCountByDay详情数据
   * @param id  DeviceInfoCountByDay的ID
   * @returns {Promise<Model>}
   */
  static async getDeviceInfoCountByDayDetailByDayName(dayName, webMonitorId, uploadType, showName) {
    let sql = "select id from DeviceInfoCountByDay WHERE dayName='" + dayName + "' AND webMonitorId = '" + webMonitorId + "' and uploadType='" + uploadType + "' and showName='" + showName + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取DeviceInfoCountByDay详情数据 (埋点)
   * @param id  DeviceInfoCountByDay的ID
   * @returns {Promise<Model>}
   */
  static async getDeviceInfoCountByDayDetailForLocationPointByDayName(dayName, uploadType) {
    let sql = "select id from DeviceInfoCountByDay WHERE dayName='" + dayName + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除DeviceInfoCountByDay
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteDeviceInfoCountByDay(id) {
    await DeviceInfoCountByDay.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

const DeviceInfoCountByHour = Sequelize.import('../schema/deviceInfoCountByHour');
DeviceInfoCountByHour.sync({force: false});


class DeviceInfoCountByHourModel {
  /**
   * 创建DeviceInfoCountByHour信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createDeviceInfoCountByHour(data) {
    return await DeviceInfoCountByHour.create({
      ...data
    })
  }

  /**
   * 更新DeviceInfoCountByHour数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateDeviceInfoCountByHour(id, data) {
    await DeviceInfoCountByHour.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取DeviceInfoCountByHour列表
   * @returns {Promise<*>}
   */
  static async getDeviceInfoCountByHourList() {
    return await DeviceInfoCountByHour.findAndCountAll()
  }

  /**
   * 获取DeviceInfoCountByHour详情数据
   * @param id  DeviceInfoCountByHour的ID
   * @returns {Promise<Model>}
   */
  static async getDeviceInfoCountByHourDetail(id) {
    return await DeviceInfoCountByHour.findOne({
      where: {
        id,
      },
    })
  }
  /**
   * 获取DeviceInfoCountByHour详情数据
   * @param id  DeviceInfoCountByHour的ID
   * @returns {Promise<Model>}
   */
  static async getDeviceInfoCountByIdByHourName(hourName, webMonitorId, uploadType, deviceName) {
    let sql = "select id from DeviceInfoCountByHour WHERE hourName='" + hourName + "' AND webMonitorId = '" + webMonitorId + "' and uploadType='" + uploadType + "' and showName='" + deviceName + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取DeviceInfoCountByHour详情数据
   * @param id  DeviceInfoCountByHour的ID
   * @returns {Promise<Model>}
   */
  static async getDeviceInfoCountByHourDetailByHourName(hourName, webMonitorId, uploadType) {
    let sql = "select * from DeviceInfoCountByHour WHERE hourName='" + hourName + "' AND webMonitorId = '" + webMonitorId + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除DeviceInfoCountByHour
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteDeviceInfoCountByHour(id) {
    await DeviceInfoCountByHour.destroy({
      where: {
        id,
      }
    })
    return true
  }

}



class ExtendBehaviorInfoModel {
  
  /**
   * 获取当前用户所有的请求记录
   * @returns {Promise<*>}
   */
  static async getExtendBehaviorInfoByUserId(happenTimeSql, userIdSql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("ExtendBehaviorInfo", timeScope, webMonitorId) + " where " + happenTimeSql + "and" + userIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const Funnel = Sequelize.import('../schema/funnel');
Funnel.sync({force: false});


class FunnelModel {
  /**
   * 创建Funnel信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createFunnel(data) {
    return await Funnel.create({
      ...data
    })
  }

  /**
   * 更新Funnel数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateFunnel(id, data) {
    await Funnel.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取Funnel列表
   * @returns {Promise<*>}
   */
  static async getFunnelList() {
    return await Funnel.findAndCountAll()
  }

  /**
   * 获取Funnel详情数据
   * @param id  Funnel的ID
   * @returns {Promise<Model>}
   */
  static async getFunnelDetail(id) {
    return await Funnel.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除Funnel
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteFunnel(id) {
    await Funnel.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

const IgnoreError = Sequelize.import('../schema/ignoreError');
IgnoreError.sync({force: false});


class IgnoreErrorModel {
  /**
   * 创建IgnoreError信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createIgnoreError(data) {
    return await IgnoreError.create({
      ...data
    })
  }

  /**
   * 更新IgnoreError数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateIgnoreError(id, data) {
    await IgnoreError.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取IgnoreError列表
   * @returns {Promise<*>}
   */
  static async getIgnoreErrorList() {
    return await IgnoreError.findAndCountAll()
  }

  static async ignoreErrorByApplication(param) {
    return await Sequelize.query("select * from IgnoreError WHERE webMonitorId='" + param.webMonitorId + "'", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取IgnoreError详情数据
   * @param id  IgnoreError的ID
   * @returns {Promise<Model>}
   */
  static async getIgnoreErrorDetail(id) {
    return await IgnoreError.findOne({
      where: {
        id,
      },
    })
  }
  /**
   * 根据errorMsg 判断该错误是否已经被忽略
   * @returns {Promise<*>}
   */
  static async getIgnoreErrorByMsg(param) {
    return await Sequelize.query("select count(*) as count from IgnoreError WHERE webMonitorId='" + param.webMonitorId + "' and ignoreErrorMessage='" + param.errorMessage + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除IgnoreError
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteIgnoreError(id) {
    await IgnoreError.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

const InfoCountByDay = Sequelize.import('../schema/infoCountByDay');
InfoCountByDay.sync({force: false});


class InfoCountByDayModel {
  /**
   * 创建InfoCountByDay信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createInfoCountByDay(data) {
    return await InfoCountByDay.create({
      ...data
    })
  }

  /**
   * 更新InfoCountByDay数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateInfoCountByDay(id, data) {
    await InfoCountByDay.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取InfoCountByDay列表
   * @returns {Promise<*>}
   */
  static async getInfoCountByDayList() {
    return await InfoCountByDay.findAndCountAll()
  }

  /**
   * 获取InfoCountByDay详情数据
   * @param id  InfoCountByDay的ID
   * @returns {Promise<Model>}
   */
  static async getInfoCountByDayDetail(id) {
    return await InfoCountByDay.findOne({
      where: {
        id,
      },
    })
  }
  /**
   * 获取InfoCountByDay详情数据
   * @param id  InfoCountByDay的ID
   * @returns {Promise<Model>}
   */
  static async getInfoCountByDayDetailByDayName(dayName, webMonitorId, uploadType) {
    let sql = "select id from InfoCountByDay WHERE dayName='" + dayName + "' AND webMonitorId = '" + webMonitorId + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取InfoCountByDay详情数据 (埋点)
   * @param id  InfoCountByDay的ID
   * @returns {Promise<Model>}
   */
  static async getInfoCountByDayDetailForLocationPointByDayName(dayName, uploadType) {
    let sql = "select id from InfoCountByDay WHERE dayName='" + dayName + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除InfoCountByDay
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteInfoCountByDay(id) {
    await InfoCountByDay.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

const InfoCountByHour = Sequelize.import('../schema/infoCountByHour');
InfoCountByHour.sync({force: false});


class InfoCountByHourModel {
  /**
   * 创建InfoCountByHour信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createInfoCountByHour(data) {
    return await InfoCountByHour.create({
      ...data
    })
  }

  /**
   * 更新InfoCountByHour数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateInfoCountByHour(id, data) {
    await InfoCountByHour.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取InfoCountByHour列表
   * @returns {Promise<*>}
   */
  static async getInfoCountByHourList() {
    return await InfoCountByHour.findAndCountAll()
  }

  /**
   * 获取InfoCountByHour详情数据
   * @param id  InfoCountByHour的ID
   * @returns {Promise<Model>}
   */
  static async getInfoCountByHourDetail(id) {
    return await InfoCountByHour.findOne({
      where: {
        id,
      },
    })
  }
  /**
   * 获取InfoCountByHour详情数据
   * @param id  InfoCountByHour的ID
   * @returns {Promise<Model>}
   */
  static async getInfoCountByIdByHourName(hourName, webMonitorId, uploadType) {
    let sql = "select id from InfoCountByHour WHERE hourName='" + hourName + "' AND webMonitorId = '" + webMonitorId + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取InfoCountByHour详情数据
   * @param id  InfoCountByHour的ID
   * @returns {Promise<Model>}
   */
  static async getLocationPointCountByIdByHourName(hourName, uploadType) {
    let sql = "select id from InfoCountByHour WHERE hourName='" + hourName + "' AND uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取InfoCountByHour详情数据
   * @param id  InfoCountByHour的ID
   * @returns {Promise<Model>}
   */
  static async getInfoCountByHourDetailByHourName(hourName, webMonitorId, uploadType) {
    let sql = "select * from InfoCountByHour WHERE hourName='" + hourName + "' AND webMonitorId = '" + webMonitorId + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除InfoCountByHour
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteInfoCountByHour(id) {
    await InfoCountByHour.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

const LocationPointGroup = Sequelize.import('../schema/locationPointGroup');
LocationPointGroup.sync({force: false});


class LocationPointGroupModel {
  /**
   * 创建LocationPointGroup信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createLocationPointGroup(data) {
    return await LocationPointGroup.create({
      ...data
    })
  }

  /**
   * 更新LocationPointGroup数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateLocationPointGroup(id, data) {
    await LocationPointGroup.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取LocationPointGroup列表
   * @returns {Promise<*>}
   */
  static async findAndCountAll() {
    return await LocationPointGroup.findAndCountAll()
  }

  static async findAll() {
    let sql = "select * from LocationPointGroup"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async findAllByUserId(userId) {
    let sql = "select * from LocationPointGroup where userId='" + userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取LocationPointGroup详情数据
   * @param id  LocationPointGroup的ID
   * @returns {Promise<Model>}
   */
  static async getLocationPointGroupDetail(id) {
    return await LocationPointGroup.findOne({
      where: {
        id,
      },
    })
  }
  /**
   * 获取LocationPointGroup详情数据
   * @param id  LocationPointGroup的ID
   * @returns {Promise<Model>}
   */
  static async getLocationPointGroupDetailByDayName(dayName, webMonitorId, uploadType) {
    let sql = "select id from LocationPointGroup WHERE dayName='" + dayName + "' AND webMonitorId = '" + webMonitorId + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除LocationPointGroup
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteLocationPointGroup(id) {
    await LocationPointGroup.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async checkGroupName(groupName) {
    let sql = "select count(*) as count from LocationPointGroup where groupName='" + groupName + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

}

const LocationPointType = Sequelize.import('../schema/locationPointType');
LocationPointType.sync({force: false});


class LocationPointTypeModel {
  /**
   * 创建LocationPointType信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createLocationPointType(data) {
    return await LocationPointType.create({
      ...data
    })
  }

  /**
   * 更新LocationPointType数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateLocationPointType(id, data) {
    await LocationPointType.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取LocationPointType列表
   * @returns {Promise<*>}
   */
  static async getLocationPointTypeList() {
    return await LocationPointType.findAndCountAll()
  }

  /**
   * 获取LocationPointType详情数据
   * @param id  LocationPointType的ID
   * @returns {Promise<Model>}
   */
  static async getLocationPointTypeDetail(id) {
    return await LocationPointType.findOne({
      where: {
        id,
      },
    })
  }
  /**
   * 获取LocationPointType详情数据
   * @param id  LocationPointType的ID
   * @returns {Promise<Model>}
   */
  static async getLocationPointTypeDetailByDayName(dayName, webMonitorId, uploadType) {
    let sql = "select id from LocationPointType WHERE dayName='" + dayName + "' AND webMonitorId = '" + webMonitorId + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除LocationPointType
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteLocationPointType(id) {
    await LocationPointType.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async getLocationPointTypeByGroupId(groupId) {
    let sql = "select * from LocationPointType where groupId='" + groupId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}



class LocationPointModel {
  /**
   * 创建LocationPoint信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createLocationPoint(data) {
    // return await LocationPoint.create({
    //   ...data
    // })
    // "INSERT INTO `LocationPoints20200713` (`id`,`locationPointType`,`userId`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?)"
    let keys = ""
    let values = ""
    const keyArray = [`id`,`locationPointType`,`userId`, `happenDate`, `createdAt`,`updatedAt`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (key === "happenDate") {
          val = new Date().Format("yyyy-MM-dd hh:mm:ss")
        }
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    // const proHead = data.webMonitorId
    const dateEnd = new Date().Format("yyyyMMdd")
    const table = "LocationPoints" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  static async getLocationPointCountByHour(lastHour, hour, locationPointType) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("LocationPoints", 0) // Utils.setTableName("CustomerPV")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("LocationPoints", 1)
    }
    let sql = "select count(*) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and locationPointType='" + locationPointType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getLocationPointCountForUvByHour(lastHour, hour, locationPointType) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("LocationPoints", 0) // Utils.setTableName("CustomerPV")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("LocationPoints", 1)
    }
    let sql = "select count(distinct userId) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and locationPointType='" + locationPointType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async calculateLocationPointCountByDay(uploadTypeForDay, useDay) {
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and uploadType='" + uploadTypeForDay + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async locationPointCountForMonth(locationPointType, day) {
    let sql = "select dayName as day, dayCount as count from InfoCountByDay where dayName>='" + day + "' and uploadType='" + locationPointType + "' order by dayName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async locationPointCountUvForMonth(locationPointType, day) {
    let sql = "select dayName as day, dayCount as count from InfoCountByDay where dayName>='" + day + "' and uploadType='" + locationPointType + "' order by dayName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }


  static async getLocationPointForDay(locationPointType, day) {
    let sql = "select dayName as day, dayCount as count from InfoCountByDay where dayName>='" + day + "' and uploadType='" + locationPointType + "' order by dayName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getLocationPointUvForDay(locationPointType, day) {
    let sql = "select dayName as day, dayCount as count from InfoCountByDay where dayName>='" + day + "' and uploadType='" + locationPointType + "' order by dayName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getFunnelLeftCountForDay(locationPointType, day) {
    let sql = "select dayName as day, dayCount as count from InfoCountByDay where dayName='" + day + "' and uploadType='" + locationPointType + "' order by dayName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const Project = Sequelize.import('../schema/project');
Project.sync({force: false});


class ProjectModel {
  /**
   * 创建Project信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createProject(data) {
    return await Project.create({
      ...data
    })
  }

  /**
   * 更新Project数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateProject(id, data) {
    await Project.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 根据webmonitorId更新Project数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateProjectForWebMonitorId(webMonitorId, data) {
    await Project.update({
      ...data
    }, {
      where: {
        webMonitorId
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 根据webmonitorId更新Project探针代码
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateMonitorCodeByWebMonitorId(data) {
    const { webMonitorId } = data
    await Project.update({
      ...data
    }, {
      where: {
        webMonitorId
      },
      fields: Object.keys(data)
    })
    return true
  }

  // /**
  //  * 根据webmonitorId更新monitorCode
  //  * @param id  用户ID
  //  * @param status  事项的状态
  //  * @returns {Promise.<boolean>}
  //  */
  // static async updateProjectForWebMonitorId(webMonitorId) {
  //   await Project.update({
  //     ...data
  //   }, {
  //     where: {
  //       webMonitorId
  //     },
  //     fields: Object.keys(data)
  //   })
  //   return true
  // }

  /**
   * 获取Project列表
   * @returns {Promise<*>}
   */
  static async getProjectList(param) {
    let sql = "select id, webMonitorId, projectName, projectType from Project where userId='" + param.userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取Project列表
   * @returns {Promise<*>}
   */
  static async getWebMonitorIdList() {
    let sql = "select webMonitorId from Project"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取Project列表
   * @returns {Promise<*>}
   */
  static async getAllProjectList() {
    const whereSql = "" //param ? " where email='" + param.userEmail + "'" : ""
    let sql = "select id, webMonitorId, projectName, projectType, createdAt from Project" + whereSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取Project个数
   * @returns {Promise<*>}
   */
  static async getProjectCount() {
    let sql = "select count(id) as count from Project"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取Project详细信息列表
   * @returns {Promise<*>}
   */
  static async getProjectDetailList(param) {
    const { userId } = param
    let sql = "select * from Project where userId='" + userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  
  /**
   * 检查用户名和项目名
   * @returns {Promise<*>}
   */
  static async getProjectByUserAndPName(userId, webMonitorId) {
    let sql = "select id from Project where userId='" + userId + "' and webMonitorId='" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  
  /**
   * 获取Project详情数据
   * @param id  Project的ID
   * @returns {Promise<Model>}
   */
  static async getProjectDetail(id) {
    return await Project.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 获取Project详情数据
   * @param id  Project的ID
   * @returns {Promise<Model>}
   */
  static async getProjectDetailForWebMonitorId(webMonitorId) {
    return await Project.findOne({
      where: {
        webMonitorId,
      },
    })
  }
  
  /**
   * 删除Project
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteProject(id) {
    await Project.destroy({
      where: {
        id,
      }
    })
    return true
  }
  /**
   * 根据webmonitorId 获取项目名
   */
  static async getProjectByWebMonitorId(webMonitorId) {
    let sql = "select * from Project where webMonitorId='" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据webmonitorId 获取项目启动列表
   */
  static async getStartListByWebMonitorId(webMonitorId) {
    let sql = "select startList from Project where webMonitorId='" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   *
   */
  static async checkProjectName(projectName) {
    let sql = "select count(*) as count from Project where projectName='" + projectName + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }


  static async checkProjectCount(param) {
    let sql = ""
    for (let i = 0; i < 7; i ++) {
      if (i < 6) {
        sql +=
        "select count(webMonitorId) as count from " + CommonSql.setTableName("CustomerPV", i) + " where webMonitorId='" + param.webMonitorId + "' GROUP BY webMonitorId"
        + " UNION "
      } else {
        sql += "select count(webMonitorId) as count from " + CommonSql.setTableName("CustomerPV", i) + " where webMonitorId='" + param.webMonitorId + "' GROUP BY webMonitorId"
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const User = Sequelize.import('../schema/user');
User.sync({force: false});


class UserModel {
  /**
   * 创建User信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createUser(data) {
    return await User.create({
      ...data
    })
  }

  /**
   * 更新User数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateUser(id, data) {
    await User.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取User列表
   * @returns {Promise<*>}
   */
  static async getUserList() {
    return await User.findAndCountAll()
  }

  /**
   * 获取User详情数据
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getUserDetail(id) {
    return await User.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 根据用户名密码
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getUserForPwd(data) {
    return await User.findOne({
      where: {
        ...data
      },
    })
  }

  /**
   * 根据类型获取管理员邮箱
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getAdminByType(userType) {
    return await User.findOne({
      where: {
        userType
      },
    })
  }
  /**
   * 检查账号是否已经存在
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async checkUserAccount(email) {
    return await User.findOne({
      where: {
        emailName: email
      },
    })
  }
  /**
   * 判断是否是管理员账号
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async isAdminAccount(email, userType) {
    return await User.findOne({
      where: {
        emailName: email,
        userType
      },
    })
  }
  /**
   * 删除User
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteUser(id) {
    await User.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async checkAdminAccount() {
    let sql = "select count(id) as count from User where userType='admin'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

}

// const VideosInfo = Sequelize.import('../schema/videosInfo');
// VideosInfo.sync({force: false});


class VideosInfoModel {
  /**
   * 创建Videos信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createVideos(data) {
    // return await VideosInfo.create({
    //   ...data
    // })
  }

  /**
   * 获取当前用户所有的日志加载失败记录
   * @returns {Promise<*>}
   */
  static async getVideosEvent(param) {
    let tableName = Utils.setTableName("VideosInfo")
    let sql = "select * from " + tableName + " where userId='" + Utils.md5Encrypt(param.userId) + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}



class HttpErrorInfoModel {
  /**
   * 创建HttpErrorInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createHttpErrorInfo(data) {
    // return await HttpErrorInfo.create({
    //   ...data
    // })
    // "INSERT INTO `HttpErrorInfo20200713` (`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`httpUrl`,`simpleHttpUrl`,`status`,`statusText`,`statusResult`,`loadTime`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,DEFAULT,?,?,?,?,?,?"
    let keys = ""
    let values = ""
    const keyArray = [`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`httpUrl`,`simpleHttpUrl`,`status`,`statusText`,`statusResult`,`loadTime`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "HttpErrorInfo" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }
  /**
   * 获取当前用户所有的请求记录
   * @returns {Promise<*>}
   */
  static async getHttpErrorsByUser(customerKeySql, happenTimeSql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("HttpErrorInfo", timeScope, webMonitorId) + " where " + customerKeySql + " and " + happenTimeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getHttpErrorInfoListByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = nowTime
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getHttpErrorInfoListSevenDayAgoByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = startTime + (timeSize + 1) * 24 * 3600 * 1000
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getHttpErrorCountByDay(param) {
    let sql = "SELECT dayName as day, dayCount as count from InfoCountByDay where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的日志加载失败记录
   * @returns {Promise<*>}
   */
  static async getHttpErrorInfoListByDay(param) {
    const { timeType } = param
    // const queryStr = CommonSql.createTimeScopeSql(timeType)
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType, param.webMonitorId)
    const sql = "select simpleHttpUrl, COUNT(simpleHttpUrl) as count from " + tableName + " GROUP BY simpleHttpUrl order by count desc limit 20"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }


  /**
   * 最近发生时间
   * @param httpUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getHttpErrorLatestTime(simpleHttpUrl, param) {
    const { timeType } = param
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType, param.webMonitorId)
    // const queryStr = CommonSql.createTimeScopeSql(timeType)
    return await Sequelize.query("select createdAt, happenTime from " + tableName + " where simpleHttpUrl= '" + simpleHttpUrl + "' ORDER BY happenTime desc limit 1", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 分类接口状态
   * @param httpUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getStatusCountBySimpleHttpUrl(simpleHttpUrl, param) {
    const { timeType } = param
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType, param.webMonitorId)
    // const queryStr = CommonSql.createTimeScopeSql(timeType)
    const sql = "select `status`, count(`status`) as count from " + tableName + " where simpleHttpUrl= '" + simpleHttpUrl + "' GROUP BY `status`"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * @param simpleHttpUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getCustomerCountForHttpUrl(simpleHttpUrl, param) {
    const { timeType } = param
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType, param.webMonitorId)
    // const queryStr = CommonSql.createTimeScopeSql(timeType)
    const sql = "select count(distinct customerKey) as count from " + tableName + " where simpleHttpUrl= '" + simpleHttpUrl + "' GROUP BY `status`"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * @param simpleHttpUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getHttpErrorListByMsg(simpleHttpUrl, param) {
    const { timeType } = param
    const queryStr = CommonSql.createTimeScopeSql(timeType)
    const sql = "select count(distinct customerKey) as count from HttpErrorInfo where webMonitorId='" + param.webMonitorId + "' " + queryStr + " and  simpleHttpUrl= '" + simpleHttpUrl + "' GROUP BY `status`"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * @param simpleHttpUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getHttpErrorListByUrl(param) {
    const { simpleHttpUrl, timeType } = param
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType, param.webMonitorId)
    const sql = "select * from " + tableName + " where simpleHttpUrl='" + simpleHttpUrl + "' limit 200"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  //=====================结算结果代码======================//
   /**
   * 计算某一小时接口错误量
   */
  static async calculateHttpErrorCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("HttpErrorInfo", 0, webMonitorId)  // Utils.setTableName("HttpErrorInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("HttpErrorInfo", 1, webMonitorId) 
    }
    let sql = "select count(*) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一天接口错误量
   */
  static async calculateHttpErrorCountByDay(webMonitorId, useDay) {
    let tableName = webMonitorId + "HttpErrorInfo" + useDay.replace(/-/g, "")
    let sql = "select count(*) as count from " + tableName
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一天接口错误量影响的用户量
   */
  static async getHttpErrorUserCountToday(webMonitorId, day) {
    const tableName = CommonSql.setTableName("HttpErrorInfo", day, webMonitorId)
    let sql = "select count(distinct customerKey) as count from " + tableName
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  
}




class HttpLogInfoModel {
  /**
   * 创建HttpLogInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createHttpLogInfo(data) {
    // return await HttpLogInfo.create({
    //   ...data
    // })
    // "INSERT INTO `HttpLogInfo20200713` (`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`httpUrl`,`simpleHttpUrl`,`status`,`statusText`,`statusResult`,`loadTime`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,DEFAULT,?,?,?,?,?,?);"
    let keys = ""
    let values = ""
    const keyArray = [`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`httpUrl`,`simpleHttpUrl`,`status`,`statusText`,`statusResult`,`loadTime`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "HttpLogInfo" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }
  /**
   * 获取当前用户所有的请求记录
   * @returns {Promise<*>}
   */
  static async getHttpLogsByUser(customerKeySql, happenTimeSql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("HttpLogInfo", timeScope, webMonitorId) + " where " + customerKeySql + " and " + happenTimeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteHttpLogInfoFifteenDaysAgo(days) {
    const timeScope = Utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from HttpLogInfo where createdAt<'" + timeScope + "'"
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  }

  /**
   * 每分钟的http量
   */
  static async getHttpCountByMinute(param) {
    let sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i') AS minutes, COUNT(id) AS count FROM HttpLogInfo " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 30 MINUTE, '%Y-%m-%d %T') <= createdAt GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一天接口请求小于某一时间的数量
   */
  static async calculateHttpLogCountForSecByDay(webMonitorId, useDay, uploadType) {
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一小时内接口请求小于某一时间的数量
   */
  static async calculateHttpLogCountForSecByHour(webMonitorId, lastHour, hour, min, max) {
    const start = min * 1000
    const end = max * 1000
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("HttpLogInfo", 0, webMonitorId)  // Utils.setTableName("HttpErrorInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("HttpLogInfo", 1, webMonitorId) 
    }
    let sql = "select count(*) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and loadTime<" + end + " and loadTime>=" + start
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据时间分类
   * @returns {Promise<*>}
   */
  static async getHttpCountForLoadTimeGroupByDay(param) {
    let sql = "SELECT dayName as day, dayCount as count from InfoCountByDay where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.uploadType + "' ORDER BY day"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据时间分类获取接口列表
   * @returns {Promise<*>}
   */
  static async getHttpUrlListForLoadTime(param) {
    const { searchType, day, webMonitorId, timeHour } = param
    const hour = timeHour.split(":")[0]
    const minute = timeHour.split(":")[1]
    const timeStartStr = Utils.addDays(0 - day) + " " + hour + ":" + minute + ":00"
    const timeEndStr = Utils.addDays(0 - day) + " " + hour + ":59:59"
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " loadTime>=30000 and loadTime<1000000 "
        break
      case "d":
          timeSql = " loadTime>=10000 and loadTime<30000 "
        break
      case "c":
          timeSql = " loadTime>=5000 and loadTime<10000 "
        break
      case "b":
        timeSql = " loadTime>=1000 and loadTime<5000 "
      break
      case "a":
        timeSql = " loadTime>=0 and loadTime<1000 "
      break
    }
    timeSql = " happenDate>='" + timeStartStr + "' and happenDate<= '" + timeEndStr + "' and " + timeSql
    const tableName = CommonSql.setTableName("HttpLogInfo", day, webMonitorId)
    let sql = "SELECT CAST(simpleHttpUrl AS char) as simpleHttpUrl, count(simpleHttpUrl) as count, avg(loadTime) as loadTime from " + tableName + " where " + timeSql + " GROUP BY simpleHttpUrl order by count desc limit 20"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取影响人数
   * @returns {Promise<*>}
   */
  static async getHttpUrlUserCountForLoadTime(param) {
    const { searchType, day, webMonitorId, simpleHttpUrl, timeHour } = param
    const hour = timeHour.split(":")[0]
    const minute = timeHour.split(":")[1]
    const timeStartStr = Utils.addDays(0 - day) + " " + hour + ":" + minute + ":00"
    const timeEndStr = Utils.addDays(0 - day) + " " + hour + ":59:59"
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " loadTime>=30000 and loadTime<1000000 "
        break
      case "d":
          timeSql = " loadTime>=10000 and loadTime<30000 "
        break
      case "c":
          timeSql = " loadTime>=5000 and loadTime<10000 "
        break
      case "b":
        timeSql = " loadTime>=1000 and loadTime<5000 "
      break
      case "a":
        timeSql = " loadTime>=0 and loadTime<1000 "
      break
    }
    timeSql = " and happenDate>='" + timeStartStr + "' and happenDate<= '" + timeEndStr + "' and " + timeSql
    const tableName = CommonSql.setTableName("HttpLogInfo", day, webMonitorId)
    let sql = "SELECT count(distinct customerKey) as count from " + tableName + " where simpleHttpUrl='" + simpleHttpUrl + "' " + timeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取发生页面
   * @returns {Promise<*>}
   */
  static async getPagesByHttpUrlForLoadTime(param) {
    const { searchType, day, webMonitorId, simpleHttpUrl, timeHour } = param
    const hour = timeHour.split(":")[0]
    const minute = timeHour.split(":")[1]
    const timeStartStr = Utils.addDays(0 - day) + " " + hour + ":" + minute + ":00"
    const timeEndStr = Utils.addDays(0 - day) + " " + hour + ":59:59"
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " loadTime>=30000 and loadTime<1000000 "
        break
      case "d":
          timeSql = " loadTime>=10000 and loadTime<30000 "
        break
      case "c":
          timeSql = " loadTime>=5000 and loadTime<10000 "
        break
      case "b":
        timeSql = " loadTime>=1000 and loadTime<5000 "
      break
      case "a":
        timeSql = " loadTime>=0 and loadTime<1000 "
      break
    }
    timeSql = " and happenDate>='" + timeStartStr + "' and happenDate<= '" + timeEndStr + "' and " + timeSql
    const tableName = CommonSql.setTableName("HttpLogInfo", day, webMonitorId)
    let sql = "SELECT simpleUrl, count(simpleUrl) as count from " + tableName + " where simpleHttpUrl='" + simpleHttpUrl + "' " + timeSql + " group by simpleUrl"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 
   */
  static async getHttpUrlCountListByHour(param) {
    const { searchType, day = 0, webMonitorId, simpleHttpUrl } = param
    let typeSql = ""
    const useDay = Utils.addDays(0 - day)
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    switch(searchType) {
      case "e":
        typeSql = " and uploadType='" + UPLOAD_TYPE.HTTP_HOUR_COUNT_E + "' "
        break
      case "d":
        typeSql = " and uploadType='" + UPLOAD_TYPE.HTTP_HOUR_COUNT_D + "' "
        break
      case "c":
        typeSql = " and uploadType='" + UPLOAD_TYPE.HTTP_HOUR_COUNT_C + "' "
        break
      case "b":
        typeSql = " and uploadType='" + UPLOAD_TYPE.HTTP_HOUR_COUNT_B + "' "
        break
      case "a":
        typeSql = " and uploadType='" + UPLOAD_TYPE.HTTP_HOUR_COUNT_A + "' "
        break
    }
    // const dateSql = !day ? " NOW() " : " DATE_SUB(NOW(),INTERVAL " + day + " DAY) "
    // const tableName = CommonSql.setTableName("HttpLogInfo", day, webMonitorId)
    // const sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(id) AS count " +
    //             "FROM " + tableName + " " +
    //             "WHERE simpleHttpUrl='" + simpleHttpUrl + "' " + timeSql + " and DATE_FORMAT(" + dateSql + " - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt " +
    //             "GROUP BY HOUR"
    const sql = "SELECT hourName as hour, hourCount as count from InfoCountByHour WHERE webMonitorId='" + webMonitorId + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' " + typeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

   /**
   * 根据url，获取每分钟JS错误的数量
   * @returns {Promise<*>}
   */
  static async getHttpUrlCountForHourByMinutes(param) {
    const { searchType, day = 0, webMonitorId, timeHour } = param
    const dayStr = Utils.addDays(0 - day)
    const start = dayStr + " " + new Date(parseInt(timeHour, 10)).Format("hh:00:00")
    const end = dayStr + " " + new Date(parseInt(timeHour, 10)).Format("hh:59:59")
    const tableName = CommonSql.setTableName("HttpLogInfo", day, webMonitorId)
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " and loadTime>=30000 and loadTime<1000000 "
        break
      case "d":
          timeSql = " and loadTime>=10000 and loadTime<30000 "
        break
      case "c":
          timeSql = " and loadTime>=5000 and loadTime<10000 "
        break
      case "b":
        timeSql = " and loadTime>=1000 and loadTime<5000 "
      break
      case "a":
        timeSql = " and loadTime>=0 and loadTime<1000 "
      break
    }
    const sql = "SELECT DATE_FORMAT(happenDate,'%Y-%m-%d %H:%i') AS minutes, COUNT(id) AS count " +
                "FROM " + tableName + " " +
                "WHERE happenDate>='" + start + "' and happenDate<='" + end + "' " + timeSql + " and DATE_FORMAT('" + end + "' - INTERVAL 60 MINUTE, '%Y-%m-%d %T') <= happenDate " +
                "GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}



class LoadPageInfoModel {
  /**
   * 创建LoadPageInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createLoadPageInfo(data) {
    // return await LoadPageInfo.create({
    //   ...data
    // })
    // "INSERT INTO `LoadPageInfo20200713` (`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`loadPage`,`domReady`,`redirect`,`lookupDomain`,`ttfb`,`request`,`loadEvent`,`appcache`,`unloadEvent`,`connect`,`loadType`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,DEFAULT,?,?,?,?,?,?,?,?,?,?,?);"
    let keys = ""
    let values = ""
    const keyArray = [`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`loadPage`,`domReady`,`redirect`,`lookupDomain`,`ttfb`,`request`,`loadEvent`,`appcache`,`unloadEvent`,`connect`,`loadType`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "LoadPageInfo" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }
 /**
   * 根据customerKey获取用户访问每个页面的平均请求时间，判断网络状态
   */
  static async getPageLoadTimeByCustomerKey(customerKeySql, happenTimeSql, param) {
    const { timeScope, webMonitorId} = param
    let sql = "SELECT CAST(simpleUrl AS char) as simpleUrl, COUNT(simpleUrl) as urlCount, AVG(loadPage) as loadPage, AVG(domReady) as domReady, AVG(request) as resource, AVG(lookupDomain) as DNS from " + CommonSql.setTableName("LoadPageInfo", timeScope, webMonitorId) + " where loadPage>0 and loadPage<30000 and " + happenTimeSql + "and" + customerKeySql + " GROUP BY simpleUrl ORDER BY urlCount desc"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据customerKey获取用户访问每个页面的平均请求时间，判断网络状态
   */
  static async getLoadPageInfoByCustomerKey(customerKeySql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "SELECT * from " + CommonSql.setTableName("LoadPageInfo", timeScope, webMonitorId) + " where " + customerKeySql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据时间获取当日页面加载的平均时间
   */
  static async getPageLoadTimeByDate(param) {
    const endTimeScope = utils.addDays(0 - param.timeScope)
    const sql = "SELECT CAST(simpleUrl AS char) as simpleUrl, COUNT(simpleUrl) as urlCount, AVG(loadPage) as loadPage, AVG(domReady) as domReady, AVG(request) as resource, AVG(lookupDomain) as DNS from LoadPageInfo where createdAt>'" + endTimeScope + "' and loadPage>1 and loadPage<15000 and webMonitorId='" + param.webMonitorId + "' GROUP BY simpleUrl having urlCount>50 ORDER BY loadPage desc limit 15"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据页面加载时间，计算出不同加载时段，页面的数量
   */
  static async calculatePageCountForSecByDay(webMonitorId, useDay, uploadType) {
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 每小时内，根据页面加载时间，计算出不同加载时段，页面的数量
   */
  static async calculatePageCountForSecByHour(webMonitorId, lastHour, hour, min, max) {
    const start = min * 1000
    const end = max * 1000
    const dateStr = utils.addDays(-1)
    let tableName = CommonSql.setTableName("LoadPageInfo", 0, webMonitorId)  // Utils.setTableName("HttpErrorInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("LoadPageInfo", 1, webMonitorId) 
    }
    let sql = "SELECT count(*) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and loadPage<" + end + " and loadPage>=" + start
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

   /**
   * 根据时间分类
   * @returns {Promise<*>}
   */
  static async getPageCountForLoadTimeGroupByDay(param) {
    let sql = "SELECT dayName as day, dayCount as count from InfoCountByDay where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.uploadType + "' ORDER BY day"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据时间分类获取接口列表
   * @returns {Promise<*>}
   */
  static async getPageUrlListForLoadTime(param) {
    const { searchType, day, webMonitorId, timeHour } = param
    const hour = timeHour.split(":")[0]
    const minute = timeHour.split(":")[1]
    const timeStartStr = utils.addDays(0 - day) + " " + hour + ":" + minute + ":00"
    const timeEndStr = utils.addDays(0 - day) + " " + hour + ":59:59"
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " loadPage>=30000 and loadPage<1000000 "
        break
      case "d":
          timeSql = " loadPage>=10000 and loadPage<30000 "
        break
      case "c":
          timeSql = " loadPage>=5000 and loadPage<10000 "
        break
      case "b":
        timeSql = " loadPage>=1000 and loadPage<5000 "
      break
      case "a":
        timeSql = " loadPage>0 and loadPage<1000 "
      break
    }
    timeSql = " happenDate>='" + timeStartStr + "' and happenDate<= '" + timeEndStr + "' and " + timeSql
    const tableName = CommonSql.setTableName("LoadPageInfo", day, webMonitorId)
    let sql = "SELECT simpleUrl, count(simpleUrl) as count, avg(loadPage) as loadTime from " + tableName + " where " + timeSql + " GROUP BY simpleUrl ORDER BY count desc limit 20"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取影响人数
   * @returns {Promise<*>}
   */
  static async getPageUrlUserCountForLoadTime(param) {
    const { searchType, day, webMonitorId, simpleUrl, timeHour } = param
    const hour = timeHour.split(":")[0]
    const minute = timeHour.split(":")[1]
    const timeStartStr = utils.addDays(0 - day) + " " + hour + ":" + minute + ":00"
    const timeEndStr = utils.addDays(0 - day) + " " + hour + ":59:59"
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " loadPage>=30000 and loadPage<1000000 "
        break
      case "d":
          timeSql = " loadPage>=10000 and loadPage<30000 "
        break
      case "c":
          timeSql = " loadPage>=5000 and loadPage<10000 "
        break
      case "b":
        timeSql = " loadPage>=1000 and loadPage<5000 "
      break
      case "a":
        timeSql = " loadPage>0 and loadPage<1000 "
      break
    }
    timeSql = " and happenDate>='" + timeStartStr + "' and happenDate<= '" + timeEndStr + "' and " + timeSql
    const tableName = CommonSql.setTableName("LoadPageInfo", day, webMonitorId)
    let sql = "SELECT count(distinct customerKey) as count from " + tableName + " where simpleUrl='" + simpleUrl + "' " + timeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取影响人数
   * @returns {Promise<*>}
   */
  static async getDifferentKindAvgLoadTimeListByHour(param) {
    const { searchType, day = 0, webMonitorId, simpleUrl } = param
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " and loadPage>=30000 and loadPage<1000000 "
        break
      case "d":
          timeSql = " and loadPage>=10000 and loadPage<30000 "
        break
      case "c":
          timeSql = " and loadPage>=5000 and loadPage<10000 "
        break
      case "b":
        timeSql = " and loadPage>=1000 and loadPage<5000 "
        break
      case "a":
        timeSql = " and loadPage>0 and loadPage<1000 "
        break
    }
    const dateSql = !day ? " NOW() " : " DATE_SUB(NOW(),INTERVAL " + day + " DAY) "
    const tableName = CommonSql.setTableName("LoadPageInfo", day, webMonitorId)
    const sql = "SELECT DATE_FORMAT(happenDate,'%H:00') AS hour, AVG(connect) as connect, AVG(lookupDomain) as DNS, AVG(request) as request, AVG(ttfb) as response, AVG(domReady) as domReady, AVG(loadPage) as loadPage " +
                "FROM " + tableName + " " +
                "WHERE simpleUrl='" + simpleUrl + "' " + timeSql + " and DATE_FORMAT(" + dateSql + " - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= happenDate " +
                "GROUP BY HOUR"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * @returns {Promise<*>}
   */
  static async getDifferentKindAvgLoadTimeByHourForPageUrl(param) {
    const { searchType, day = 0, webMonitorId, simpleUrl, timeHour } = param
    const hour = timeHour.split(":")[0]
    const minute = timeHour.split(":")[1]
    const timeStartStr = utils.addDays(0 - day) + " " + hour + ":" + minute + ":00"
    const timeEndStr = utils.addDays(0 - day) + " " + hour + ":59:59"
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " loadPage>=30000 and loadPage<1000000 "
        break
      case "d":
          timeSql = " loadPage>=10000 and loadPage<30000 "
        break
      case "c":
          timeSql = " loadPage>=5000 and loadPage<10000 "
        break
      case "b":
        timeSql = " loadPage>=1000 and loadPage<5000 "
        break
      case "a":
        timeSql = " loadPage>0 and loadPage<1000 "
        break
    }
    timeSql = " and happenDate>='" + timeStartStr + "' and happenDate<= '" + timeEndStr + "' and " + timeSql
    const tableName = CommonSql.setTableName("LoadPageInfo", day, webMonitorId)
    const sql = "SELECT AVG(connect) as TCP连接, AVG(lookupDomain) as DNS解析, AVG(request) as 发起请求, AVG(ttfb) as 请求响应, AVG(domReady) as DOM解析, AVG(loadPage) as 页面加载 " +
                "FROM " + tableName + " " +
                "WHERE simpleUrl='" + simpleUrl + "' " + timeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 
   */
  static async getPageUrlCountListByHour(param) {
    const { searchType, day = 0, webMonitorId } = param
    let typeSql = ""
    const useDay = utils.addDays(0 - day)
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    switch(searchType) {
      case "e":
        typeSql = " and uploadType='" + UPLOAD_TYPE.PAGE_HOUR_COUNT_E + "' "
        break
      case "d":
        typeSql = " and uploadType='" + UPLOAD_TYPE.PAGE_HOUR_COUNT_D + "' "
        break
      case "c":
        typeSql = " and uploadType='" + UPLOAD_TYPE.PAGE_HOUR_COUNT_C + "' "
        break
      case "b":
        typeSql = " and uploadType='" + UPLOAD_TYPE.PAGE_HOUR_COUNT_B + "' "
        break
      case "a":
        typeSql = " and uploadType='" + UPLOAD_TYPE.PAGE_HOUR_COUNT_A + "' "
        break
    }
    const sql = "SELECT hourName as hour, hourCount as count from InfoCountByHour WHERE webMonitorId='" + webMonitorId + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' " + typeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

   /**
   * 根据url，获取每分钟URL的数量
   * @returns {Promise<*>}
   */
  static async getPageUrlCountForHourByMinutes(param) {
    const { searchType, day = 0, webMonitorId, timeHour } = param
    const start = new Date(parseInt(timeHour, 10)).Format("yyyy-MM-dd hh:00:00")
    const end = new Date(parseInt(timeHour, 10) + 60 * 60 * 1000).Format("yyyy-MM-dd hh:00:00")
    const tableName = CommonSql.setTableName("LoadPageInfo", day, webMonitorId)
    let timeSql = ""
    switch(searchType) {
      case "e":
          timeSql = " and loadPage>=30000 and loadPage<1000000 "
        break
      case "d":
          timeSql = " and loadPage>=10000 and loadPage<30000 "
        break
      case "c":
          timeSql = " and loadPage>=5000 and loadPage<10000 "
        break
      case "b":
        timeSql = " and loadPage>=1000 and loadPage<5000 "
      break
      case "a":
        timeSql = " and loadPage>=0 and loadPage<1000 "
      break
    }
    const sql = "SELECT DATE_FORMAT(happenDate,'%Y-%m-%d %H:%i') AS minutes, COUNT(*) AS count " +
                "FROM " + tableName + " " +
                "WHERE happenDate>'" + start + "' and happenDate<'" + end + "' " + timeSql + " and DATE_FORMAT('" + end + "' - INTERVAL 60 MINUTE, '%Y-%m-%d %T') <= happenDate " +
                "GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}



class ResourceLoadInfoModel {
  /**
   * 创建ResourceLoadInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createResourceLoadInfo(data) {
    // console.log(data)
    // return await ResourceLoadInfo.create({
    //   ...data
    // })
    // INSERT INTO `ResourceLoadInfo20200720` (`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`sourceUrl`,`elementType`,`status`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,DEFAULT,?,?,?);
    // return
    let keys = ""
    let values = ""
    const keyArray = [`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`sourceUrl`,`elementType`,`status`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "ResourceLoadInfo" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  /**
   * 获取当前用户所有的日志加载失败记录
   * @returns {Promise<*>}
   */
  static async getResourceLoadInfoByUserId(customerKeySql, happenTimeSql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("ResourceLoadInfo", timeScope, webMonitorId) + " where " + happenTimeSql + "and" + customerKeySql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的日志加载失败记录
   * @returns {Promise<*>}
   */
  static async getResourceLoadInfoListByDay(param) {
    const { simpleUrl, timeType } = param
    const queryStr = simpleUrl ? " where simpleUrl='" + simpleUrl + "' " : " "
    const tableName = CommonSql.setTableName("ResourceLoadInfo", timeType, param.webMonitorId)
    const sql = "select sourceUrl, COUNT(sourceUrl) as count from " + tableName + "  " + queryStr + " GROUP BY sourceUrl order by count desc limit 20"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 最近发生时间
   * @param sourceUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getResourceErrorLatestTime(sourceUrl, param) {
    const { simpleUrl, timeType } = param
    const queryStr = simpleUrl ? " simpleUrl='" + simpleUrl + "' and " : " "
    const tableName = CommonSql.setTableName("ResourceLoadInfo", timeType, param.webMonitorId)
    const sql = "select createdAt, happenTime from " + tableName + " where " + queryStr + " sourceUrl= '" + sourceUrl + "' ORDER BY happenTime desc limit 1"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 影响多少页面
   * @param sourceUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getPageCountByResourceError(sourceUrl, param) {
    const { simpleUrl, timeType } = param
    const queryStr = simpleUrl ? " simpleUrl='" + simpleUrl + "' and " : " "
    const tableName = CommonSql.setTableName("ResourceLoadInfo", timeType, param.webMonitorId)
    return await Sequelize.query("SELECT count(DISTINCT simpleUrl) as pageCount from " + tableName + " where " + queryStr + " sourceUrl='" + sourceUrl + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 影响了多少用户
   * @param sourceUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getCustomerCountByResourceError(sourceUrl, param) {
    const { simpleUrl, timeType } = param
    const queryStr = simpleUrl ? " simpleUrl='" + simpleUrl + "' and " : " "
    const tableName = CommonSql.setTableName("ResourceLoadInfo", timeType, param.webMonitorId)
    return await Sequelize.query("SELECT count(DISTINCT (customerKey)) as customerCount from " + tableName + " where " + queryStr + " sourceUrl='" + sourceUrl + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的日志加载失败记录列表
   * @returns {Promise<*>}
   */
  static async getResourceErrorCountByDay(param) {
    let sql = "SELECT dayName as day, dayCount as count from InfoCountByDay where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取某小时内，错误总数
   * @returns {Promise<*>}
   */
  static async getResourceErrorInfoListByHour(startTime, endTime, param) {
    return await Sequelize.query("SELECT COUNT(*) as count from ResourceLoadInfo where  webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getResourceLoadErrorInfoListByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = nowTime
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getResourceLoadErrorInfoListSevenDayAgoByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = startTime + (timeSize + 1) * 24 * 3600 * 1000
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  //=====================结算结果代码======================//
   /**
   * 计算某一小时静态资源加载错误量
   */
  static async calculateResourceErrorCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("ResourceLoadInfo", 0, webMonitorId) // Utils.setTableName("ResourceLoadInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("ResourceLoadInfo", 1, webMonitorId)
    }
    let sql = "select count(*) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天静态资源加载错误量
   */
  static async calculateResourceErrorCountByDay(webMonitorId, useDay) {
    let tableName = webMonitorId + "ResourceLoadInfo" + useDay.replace(/-/g, "")
    let sql = "select count(*) as count from " + tableName
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一天静态资源加载错误量影响用户数量
   */
  static async getResourceErrorUserCountToday(webMonitorId, day) {
    const tableName = CommonSql.setTableName("ResourceLoadInfo", day, webMonitorId)
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE  webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}




function fixPath(filepath) {
  return filepath.replace(/\.[\.\/]+/g, "");
}

class JavascriptErrorInfoModel {
  /**
   * 创建JavascriptErrorInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createJavascriptErrorInfo(data) {
    // return await JavascriptErrorInfo.create({
    //   ...data
    // })
    // "INSERT INTO `JavascriptErrorInfo20200713` (`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`pageKey`,`deviceName`,`os`,`browserName`,`browserVersion`,`monitorIp`,`country`,`province`,`city`,`infoType`,`errorMessage`,`errorStack`,`browserInfo`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,DEFAULT,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    let keys = ""
    let values = ""
    const keyArray = [`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`pageKey`,`deviceName`,`os`,`browserName`,`browserVersion`,`monitorIp`,`country`,`province`,`city`,`infoType`,`errorMessage`,`errorStack`,`browserInfo`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "JavascriptErrorInfo" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  /**
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteJavascriptErrorInfosFifteenDaysAgo(days) {
    const timeScope = utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from JavascriptErrorInfo where createdAt<'" + timeScope + "'";
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  }

  /**
   * 获取JavascriptErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorInfoListByDay(param) {
    let sql = "SELECT dayName as day, dayCount as count from InfoCountByDay where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取ConsoleErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getConsoleErrorInfoListByDay(param) {
    let sql = "SELECT dayName as day, dayCount as count from InfoCountByDay where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据错误信息，获取每分钟JS错误的数量
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorCountByMinute(param) {
    let { timeHour } = param
    const start = new Date(parseInt(timeHour, 10)).Format("yyyy-MM-dd hh:00:00")
    const end = new Date(parseInt(timeHour, 10) + 60 * 60 * 1000).Format("yyyy-MM-dd hh:00:00")
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", 0, param.webMonitorId)
    let sql = "SELECT DATE_FORMAT(happenDate,'%Y-%m-%d %H:%i') AS minutes, COUNT(id) AS count FROM " + tableName + " " +
      "WHERE happenDate>'" + start + "' and happenDate<'" + end + "' and infoType='" + param.infoType + "' and errorMessage like '" + param.errorMessage + "%' and DATE_FORMAT('" + end + "' - INTERVAL 60 MINUTE, '%Y-%m-%d %T') <= happenDate GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorCountListByHour(param) {
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", 0, param.webMonitorId) // Utils.setTableName("JavascriptErrorInfo")
    const sql = "SELECT DATE_FORMAT(happenDate,'%m-%d %H') AS hour, COUNT(id) AS count " +
                "FROM " + tableName + " " +
                "WHERE infoType='" + param.infoType + "' and errorMessage like '" + param.errorMessage + "%' and DATE_FORMAT(NOW() - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= happenDate " +
                "GROUP BY HOUR"
    // return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfo where  webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorInfoListSevenDayAgoByHour(param) {
    const tempNowHour = new Date().getHours();
    let nowHour = tempNowHour
    let sevenDayAgo = ""
    if (tempNowHour === 23) {
      sevenDayAgo = utils.addDays(-6) + " 00:00:00";
    } else {
      nowHour = nowHour + 1
      sevenDayAgo = utils.addDays(-7) + " " + nowHour + ":00:00";
    }
    const sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(id) AS count " +
      "FROM JavascriptErrorInfo " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and infoType='" + param.infoType + "' and createdAt<'" + sevenDayAgo + "' and DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 7 DAY) - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt " +
      "GROUP BY HOUR"
    // return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfo where  webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取某天内错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorCountByDay(startTime, endTime, param) {
    return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfo where webMonitorId='" + param.webMonitorId + "' and createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取JavascriptErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorSort(param) {
    const { simpleUrl, timeType, webMonitorId } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const sql = "select errorMessage, count(errorMessage) as count from " + tableName + " where infoType='on_error' " + queryStr + " GROUP BY errorMessage order by count desc limit 20"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取自定义错误列表
   * @returns {Promise<*>}
   */
  static async getConsoleErrorSort(param) {
    const { simpleUrl, timeType, webMonitorId } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    // const queryStr = queryStr1 + CommonSql.createTimeScopeSql(timeType)
    const sql = "select errorMessage, count(errorMessage) as count from " + tableName + " where infoType='console_error' " + queryStr + " GROUP BY errorMessage order by count desc limit 10"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMessage查询这一类错误的数量
   * @returns {Promise<*>}
   */
  static async getPerJavascriptConsoleErrorCount(tempErrorMsg, param) {
    const { simpleUrl, timeType, webMonitorId } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    const queryStr1 = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const queryStr = queryStr1 + CommonSql.createTimeScopeSql(timeType)
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("SELECT count(id) as count from " + tableName + " where infoType='console_error' " + queryStr + " and errorMessage = '" + errorMsg + "' order by count desc", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMessage查询这一类错误不同平台的数量
   * @returns {Promise<*>}
   */
  static async getPerJavascriptErrorCountByOs(tempErrorMsg, param) {
    const { simpleUrl, timeType, infoType, webMonitorId } = param
    const infoTypeStr = infoType ? " infoType='" + infoType + "'" : " "
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    let sql = "SELECT tab.os as os, count(tab.os) as count from (select SUBSTRING(os,1,3) as os from " + tableName + " where " + infoTypeStr + " " + queryStr + " and errorMessage like '%" + errorMsg + "%') as tab GROUP BY os order by count desc"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据errorMessage查询这一类错误不同平台的数量
   * @returns {Promise<*>}
   */
  static async getAllJavascriptErrorCountByOs(tempErrorMsg, param) {
    const { simpleUrl, timeType, webMonitorId } = param
    const queryStr1 = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const queryStr = queryStr1
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    return await Sequelize.query("SELECT tab.os as os, count(tab.os) as count from (select SUBSTRING(os,1,3) as os from " + tableName + " where infoType='on_error'" + queryStr + " and errorMessage like '%" + errorMsg + "%') as tab GROUP BY os order by count desc", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 查询分类js错误的数量
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorCountByType( param ) {
    const { timeType, webMonitorId } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    const sql = "select infoType, count(infoType) as count from " + tableName + " " + " GROUP BY infoType"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMessage查询这一类错误最近发生的时间
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorLatestTime(tempErrorMsg, param) {
    const { simpleUrl, timeType, infoType, webMonitorId } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    const queryStr = simpleUrl ? " simpleUrl='" + simpleUrl + "' and " : " "
    const infoTypeStr = infoType ? " and infoType='" + infoType + "'" : " "
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    let sql = "select createdAt, happenTime from " + tableName + " where " + queryStr +  " errorMessage like '" + errorMsg + "%' " + infoTypeStr + " ORDER BY happenDate desc limit 1"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
 
  /**
   * 根据errorMsg 查询js错误列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorListByMsg(tempErrorMsg, param) {
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    const { timeType, webMonitorId } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    let sql = "select * from " + tableName + " where errorMessage like '" + errorMsg + "%' order by happenTime desc limit 100"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMsg查询Js错误影响的用户数量
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorAffectCount(tempErrorMsg, param) {
    const { timeType, infoType, webMonitorId } = param
    const infoTypeStr = infoType ? " infoType='" + infoType + "' and " : " "
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    let sql = "select count(DISTINCT customerKey) as count from " + tableName + " where " + infoTypeStr + " errorMessage like '" + errorMsg + "%'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据errorMsg、customerKey 查询Js错误发生的次数
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorOccurCountByCustomerKey(tempErrorMsg, data) {
    const { webMonitorId, customerKey, timeType } = data
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType, webMonitorId)
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("select count(*) as count from " + tableName + " where errorMessage like '%" + errorMsg + "%' and customerKey='" + customerKey + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据errorMsg 查询js错误列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorListByPage(param) {
    const { timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const queryStr = " where webMonitorId='" + param.webMonitorId + "' and infoType='on_error' "
    return await Sequelize.query("select simpleUrl, COUNT(simpleUrl) as count from " + tableName + " " + queryStr + " GROUP BY simpleUrl ORDER BY count desc limit 20", { type: Sequelize.QueryTypes.SELECT})
  }

  
  /**
   * 获取报错代码位置附近的代码
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorStackCode(param) {
    const handleStack = async (body, result, jsPathStr, jsPath, locationX, locationY) => {
      let arr = body.split("\n")
      let codeStr = arr[locationX - 1]
      const start = parseInt(locationY) < 100 ? 0 : parseInt(locationY) - 100
      const end = parseInt(locationY) + 100
      const codeStart = encodeURIComponent(codeStr.substring(start, locationY - 1))
      const codeEnd = encodeURIComponent(codeStr.substring(locationY - 1, end))
      let code = ""
      if (codeStart.length === 0 && codeEnd.length === 0) {
        code = " 抱歉，未能获取到静态资源，无法定位代码位置 ：）"
      } else {
        code = codeStart + "【错误位置】" + codeEnd
      }
      let sourceCode = []
      // await JavascriptErrorInfoModel.getJavascriptErrorStackCodeForUrl(jsPath, locationX, locationY, sourceCode)
      result.push({jsPathStr, jsPath, locationX, locationY, code, sourceCode})
    }
    let tempJsPath = ""
    let tempJsMapPath = ""
    let tempCodeArray = []
    const result = []
    // TODO: 本来这里是要用param.length 取出所有的js代码，但是正常情况下，只用到第一个，所以默认只取出第一个
    const codeArrayObject = {}
    for (var i = 0; i < param.length; i ++) {
      const { jsPathStr, jsPath, locationX, locationY } = param[i]
      if (!codeArrayObject[jsPath]) {
        await fetch(jsPath)
        .then(res => res.text())
        .then( async (body) => {
          codeArrayObject[jsPath] = body;
          handleStack(body, result, jsPathStr, jsPath, locationX, locationY)
        }).catch((e) => {
          result.push({jsPathStr, jsPath, locationX, locationY, code: " 抱歉，未能获取到静态资源，无法定位代码位置 ：）", sourceCode: []})
        });
      } else {
        handleStack(codeArrayObject[jsPath], result, jsPathStr, jsPath, locationX, locationY)
      }
    }
    return result
  }

  static async getJavascriptErrorStackCodeForSource(line, column) {
    var sourceCode = []
    var rawSourceMap = await fs.readFileSync('./lib/temp.min.js.map').toString();
    // 通过sourceMap库转换为sourceMapConsumer对象
    var consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
    // 传入要查找的行列数，查找到压缩前的源文件及行列数
    var sm = consumer.originalPositionFor({
        line: parseInt(line),  // 压缩后的行数
        column: parseInt(column) // 压缩后的列数
      });
    // 如果没有sourceContent, 则返回第一次解码的行，列
    if (rawSourceMap.indexOf("sourcesContent") == -1) {
      const { line, column } = sm
      sourceCode = line + "," + column
    } else {
      // 压缩前的所有源文件列表
      var sources = consumer.sources;
      // 根据查到的source，到源文件列表中查找索引位置
      var smIndex = sources.indexOf(sm.source);
      // 到源码列表中查到源代码
      var smContent = consumer.sourcesContent[smIndex];

      // 将源代码串按"行结束标记"拆分为数组形式
      const rawLines = smContent.split(/\r?\n/g);
      // 输出源码行，因为数组索引从0开始，故行数需要-1
      sourceCode.push(rawLines[sm.line - 5])
      sourceCode.push(rawLines[sm.line - 4])
      sourceCode.push(rawLines[sm.line - 3])
      sourceCode.push(rawLines[sm.line - 2])
      sourceCode.push(rawLines[sm.line - 1])
      sourceCode.push(rawLines[sm.line - 0] || "")
      sourceCode.push(rawLines[sm.line + 1] || "")
      sourceCode.push(rawLines[sm.line + 2] || "")
      sourceCode.push(rawLines[sm.line + 3] || "")
    }
    return sourceCode
  }
  static async getJavascriptErrorStackCodeForUrl(line, column, sourceCodeUrl) {
    // // 读取map文件，实际就是一个json文件
    // var rawSourceMap = fs.readFileSync("/Users/jeffery/WebstormProjects/cash_loan_fe/dist/omega/home.52c296c6.chunk.js.map").toString();
    // // 通过sourceMap库转换为sourceMapConsumer对象
    // console.log("1===========================")
    // var consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
    // // 传入要查找的行列数，查找到压缩前的源文件及行列数
    // var sm = consumer.originalPositionFor({
    //     line: 1,  // 压缩后的行数
    //     column: 43649  // 压缩后的列数
    //   });
    // // 压缩前的所有源文件列表
    // var sources = consumer.sources;
    // // 根据查到的source，到源文件列表中查找索引位置
    // var smIndex = sources.indexOf(sm.source);
    // // 到源码列表中查到源代码
    // var smContent = consumer.sourcesContent[smIndex];
    // // 将源代码串按"行结束标记"拆分为数组形式
    // const rawLines = smContent.split(/\r?\n/g);
    // // 输出源码行，因为数组索引从0开始，故行数需要-1
    
    // console.log("1=====================")
    // console.log(rawLines[sm.line - 2]);
    // console.log(rawLines[sm.line - 1]);
    // console.log(rawLines[sm.line]);
    // console.log("2=====================")
    //以上是可以正确解读的////////////////////////////////////////////////////////////////////
    var sourceCode = []
    const sourcePath = sourceCodeUrl
    await fetch(sourcePath)
        .then(res => res.text())
        .then( async (body) => {
          var rawSourceMap = body
          // 通过sourceMap库转换为sourceMapConsumer对象
          var consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
          // 传入要查找的行列数，查找到压缩前的源文件及行列数
          var sm = consumer.originalPositionFor({
              line: parseInt(line),  // 压缩后的行数
              column: parseInt(column) // 压缩后的列数
            });
          console.log(sm)
          // 压缩前的所有源文件列表
          var sources = consumer.sources;
          // 根据查到的source，到源文件列表中查找索引位置
          var smIndex = sources.indexOf(sm.source);
          // 到源码列表中查到源代码
          var smContent = consumer.sourcesContent[smIndex];
          // 将源代码串按"行结束标记"拆分为数组形式
          const rawLines = smContent.split(/\r?\n/g);
          // 输出源码行，因为数组索引从0开始，故行数需要-1
          sourceCode.push(rawLines[sm.line - 5])
          sourceCode.push(rawLines[sm.line - 4])
          sourceCode.push(rawLines[sm.line - 3])
          sourceCode.push(rawLines[sm.line - 2])
          sourceCode.push(rawLines[sm.line - 1])
          sourceCode.push(rawLines[sm.line - 0] || "")
          sourceCode.push(rawLines[sm.line + 1] || "")
          sourceCode.push(rawLines[sm.line + 2] || "")
          sourceCode.push(rawLines[sm.line + 3] || "")
        }).catch((e) => {
          console.log(e)
        });
    return sourceCode
  }

  /**
   * 获取PC错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorPcCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM JavascriptErrorInfo WHERE webMonitorId='" + param.webMonitorId + "' and createdAt > '" + param.day + "' and os LIKE 'web%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取IOS错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorIosCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM JavascriptErrorInfo WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'ios%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取Android错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorAndroidCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM JavascriptErrorInfo WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'android%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser(customerKeySql, happenTimeSql, param) {
    // var phoneReg = /^1\d{10}$/
    // var sql = ""
    // if (phoneReg.test(param.searchValue)) {
    //   sql = "select * from JavascriptErrorInfo where webMonitorId='" + param.webMonitorId + "' and firstUserParam='" + param.searchValue + "'"
    // } else {
    //   sql = "select * from JavascriptErrorInfo where webMonitorId='" + param.webMonitorId + "' and userId='" + param.searchValue + "'"
    // }
    // return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("JavascriptErrorInfo", timeScope, webMonitorId) + " where " + customerKeySql + " and " + happenTimeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内每小时错误量
   */
  static async getErrorCountByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = nowTime
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时的UV量
   * @returns {Promise<*>}
   */
  static async getErrorCountSevenDayAgoByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = startTime + (timeSize + 1) * 24 * 3600 * 1000
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + param.infoType + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  //=====================结算结果代码======================//
   /**
   * 计算某一小时on_error的量
   */
  static async calculateJsErrorCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("JavascriptErrorInfo", 0, webMonitorId) // Utils.setTableName("JavascriptErrorInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("JavascriptErrorInfo", 1, webMonitorId)
    }
    let sql = "select count(*) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' AND infoType='on_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一小时console_error的量
   */
  static async calculateConsoleErrorCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("JavascriptErrorInfo", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("JavascriptErrorInfo", 1, webMonitorId)
    }
    let sql = "select count(*) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' AND infoType='console_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天on_error的量
   */
  static async calculateJsErrorCountByDay(webMonitorId, useDay) {
    let tableName = webMonitorId + "JavascriptErrorInfo" + useDay.replace(/-/g, "")
    let sql = "select count(*) as count from " + tableName + " WHERE infoType='on_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天console_error的量
   */
  static async calculateConsoleErrorCountByDay(webMonitorId, useDay) {
    let tableName = webMonitorId + "JavascriptErrorInfo" + useDay.replace(/-/g, "")
    let sql = "select count(*) as count from " + tableName + " WHERE infoType='console_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天on_error影响的用户数量
   */
  static async getJsErrorUserCountToday(webMonitorId, day) {
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", day, webMonitorId)
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE infoType='on_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天console_error的量
   */
  static async getConsoleErrorUserCountToday(webMonitorId, day) {
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", day, webMonitorId)
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE infoType='console_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}



class CustomerPVModel {
  /**
   * 创建CustomerPV信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createCustomerPV(data) {
    let keys = ""
    let values = ""
    const keyArray = [`uploadType`,`happenTime`,`happenDate`,`webMonitorId`,`customerKey`,`simpleUrl`,`completeUrl`,`userId`,`firstUserParam`,`secondUserParam`,`createdAt`,`updatedAt`,`id`,`projectVersion`,`pageKey`,`deviceName`,`os`,`browserName`,`browserVersion`,`browserInfo`,`monitorIp`,`country`,`province`,`city`,`loadType`,`loadTime`,`newStatus`,`referrer`,`customerKeyCreatedDate`]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "', "
        } else {
          values += "DEFAULT, "
        }
      }
    })
    const proHead = data.webMonitorId
    const dateEnd = new Date(data.happenTime).Format("yyyyMMdd")
    const table = proHead + "CustomerPV" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  // /**
  //  * 更新CustomerPV数据
  //  * @param id  用户ID
  //  * @param status  事项的状态
  //  * @returns {Promise.<boolean>}
  //  */
  // static async updateCustomerPV(id, data) {
  //   await CustomerPV.update({
  //     ...data
  //   }, {
  //     where: {
  //       id
  //     },
  //     fields: Object.keys(data)
  //   })
  //   return true
  // }

  // /**
  //  * 获取CustomerPV列表
  //  * @returns {Promise<*>}
  //  */
  // static async getCustomerPVList() {
  //   return await CustomerPV.findAndCountAll()
  // }

  // /**
  //  * 获取CustomerPV详情数据
  //  * @param id  CustomerPV的ID
  //  * @returns {Promise<Model>}
  //  */
  // static async getCustomerPVDetail(id) {
  //   return await CustomerPV.findOne({
  //     where: {
  //       id,
  //     },
  //   })
  // }

  // /**
  //  * 删除CustomerPV
  //  * @param id listID
  //  * @returns {Promise.<boolean>}
  //  */
  // static async deleteCustomerPV(id) {
  //   await CustomerPV.destroy({
  //     where: {
  //       id,
  //     }
  //   })
  //   return true
  // }
  // /**
  //  * 删除
  //  * @param id listID
  //  * @returns {Promise.<boolean>}
  //  */
  // static async deleteCustomerPVsFifteenDaysAgo(days) {
  //   const timeScope = Utils.addDays(0 - days) + " 00:00:00"
  //   var querySql = "delete from " + Utils.setTableName("CustomerPV") + " where createdAt<'" + timeScope + "'";
  //   return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  // }

  /**
   * 根据参数获取当天的pv数量
   */
  static async getPVFlowDataForDay(webMonitorId, day) {
    let sql = "select dayName, dayCount from InfoCountByDay where webMonitorId='" + webMonitorId + "' and dayName>='" + day + "' and uploadType='" + UPLOAD_TYPE.PV_COUNT_DAY + "' order by dayName desc"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据参数获取当天的uv数量
   */
  static async getUVFlowDataForDay(webMonitorId, day) {
    let sql = "select dayName, dayCount from InfoCountByDay where webMonitorId='" + webMonitorId + "' and dayName>='" + day + "' and uploadType='" + UPLOAD_TYPE.UV_COUNT_DAY + "' order by dayName desc"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async uvCountForMonth(webMonitorId, type, day) {
    let sql = "select dayName as day, dayCount as count from InfoCountByDay where webMonitorId='" + webMonitorId + "' and dayName>='" + day + "' and uploadType='" + type + "' order by dayName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据参数获取当天的新客户数量
   */
  static async getNewFlowDataForDay(webMonitorId, day) {
    let sql = "select dayName, dayCount from InfoCountByDay where webMonitorId='" + webMonitorId + "' and dayName>='" + day + "' and uploadType='" + UPLOAD_TYPE.NEW_COUNT_DAY + "' order by dayName desc"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据参数获取当天的IP数量
   */
  static async getIpFlowDataForDay(webMonitorId, day) {
    let sql = "select dayName, dayCount from InfoCountByDay where webMonitorId='" + webMonitorId + "' and dayName>='" + day + "' and uploadType='" + UPLOAD_TYPE.IP_COUNT_DAY + "' order by dayName desc"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

   /**
   * 根据参数获取当天的pv数量
   */
  static async getCusInfoCountForDay(webMonitorId, useDay, uploadTypeForDay) {
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
   /**
   * 根据参数获取当天的pv数量
   */
  static async getPVCountForDay(webMonitorId, day, uploadTypeForHour) {
    // let sql1 = "SELECT dayCount as count from InfoCountByDay where dayName='" + dayName + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    let useDay = Utils.addDays(day)
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql1 = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForHour + "'"
    
    let dayResult = await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
    let count1 = (dayResult[0] && dayResult[0].count) ? parseInt(dayResult[0].count, 10) : 0
    let count2 = 0
    // 如果day=0 说明是计算今天实时数据的
    if (day == 0) {
      const startHour = new Date().Format("yyyy-MM-dd hh:00:00")
      let sql2 = "select count(*) as count from " + CommonSql.setTableName("CustomerPV", day, webMonitorId) + " where happenDate>='" + startHour + "'"
      let hourResult = await Sequelize.query(sql2, { type: Sequelize.QueryTypes.SELECT})
      count2 = (hourResult[0] && hourResult[0].count) ? parseInt(hourResult[0].count, 10) : 0
    }
    return [{count: count1 + count2}]
  }
  /**
   * 根据参数获取当天的uv数量
   */
  static async getUVCountForDay(webMonitorId, day, uploadTypeForHour) {
    // const startHour = new Date().Format("yyyy-MM-dd hh:00:00")
    // let dayName = Utils.addDays(day)
    // let sql1 = "SELECT dayCount as count from InfoCountByDay where dayName='" + dayName + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    
    let useDay = Utils.addDays(day)
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql1 = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForHour + "'"
    
    
    let dayResult = await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
    let count1 = (dayResult[0] && dayResult[0].count) ? parseInt(dayResult[0].count, 10) : 0
    let count2 = 0
    // 如果day=0 说明是计算今天实时数据的
    if (day == 0) {
      const startHour = new Date().Format("yyyy-MM-dd hh:00:00")
      let sql2 = "select count(distinct customerKey) as count from " + CommonSql.setTableName("CustomerPV", day, webMonitorId) + " where happenDate>='" + startHour + "' and ( newStatus='o_uv' or newStatus='n_uv' ) "
      let hourResult = await Sequelize.query(sql2, { type: Sequelize.QueryTypes.SELECT})
      count2 = (hourResult[0] && hourResult[0].count) ? parseInt(hourResult[0].count, 10) : 0
    }
    return [{count: count1 + count2}]
  }
  /**
   * 根据参数获取当天的新访客数量
   */
  static async getNewCountForDay(webMonitorId, day, uploadTypeForHour) {
    // const startHour = new Date().Format("yyyy-MM-dd hh:00:00")
    // let dayName = Utils.addDays(day)
    // let sql1 = "SELECT dayCount as count from InfoCountByDay where dayName='" + dayName + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    
    let useDay = Utils.addDays(day)
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql1 = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForHour + "'"
    
    
    let dayResult = await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
    let count1 = (dayResult[0] && dayResult[0].count) ? parseInt(dayResult[0].count, 10) : 0
    let count2 = 0
    // 如果day=0 说明是计算今天实时数据的
    if (day == 0) {
      const startHour = new Date().Format("yyyy-MM-dd hh:00:00")
      let sql2 = "select count(distinct customerKey) as count from " + CommonSql.setTableName("CustomerPV", day, webMonitorId) + " where happenDate>='" + startHour + "' and newStatus='n_uv' "
      let hourResult = await Sequelize.query(sql2, { type: Sequelize.QueryTypes.SELECT})
      count2 = (hourResult[0] && hourResult[0].count) ? parseInt(hourResult[0].count, 10) : 0
    }
    return [{count: count1 + count2}]
  }
  /**
   * 根据参数获取当天的IP数量
   */
  static async getIpCountForDay(webMonitorId, day, uploadTypeForHour) {
    // let sql = "select count(distinct monitorIp) as count from " + CommonSql.setTableName("CustomerPV", day, webMonitorId)
    // return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})

    // const startHour = new Date().Format("yyyy-MM-dd hh:00:00")
    // let dayName = Utils.addDays(day)
    // let sql1 = "SELECT dayCount as count from InfoCountByDay where dayName='" + dayName + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "'"
    
    let useDay = Utils.addDays(day)
    const startHour = useDay.substring(5) + " 00"
    const endHour = useDay.substring(5) + " 23"
    let sql1 = "SELECT SUM(hourCount) as count from InfoCountByHour where hourName>='" + startHour + "' and hourName<='" + endHour + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForHour + "'"
    
    
    let dayResult = await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
    let count1 = (dayResult[0] && dayResult[0].count) ? parseInt(dayResult[0].count, 10) : 0
    let count2 = 0
    // 如果day=0 说明是计算今天实时数据的
    if (day == 0) {
      const startHour = new Date().Format("yyyy-MM-dd hh:00:00")
      let sql2 = "select count(distinct monitorIp) as count from " + CommonSql.setTableName("CustomerPV", day, webMonitorId) + " where happenDate>='" + startHour + "' and ( newStatus='o_uv' or newStatus='n_uv' ) "
      let hourResult = await Sequelize.query(sql2, { type: Sequelize.QueryTypes.SELECT})
      count2 = (hourResult[0] && hourResult[0].count) ? parseInt(hourResult[0].count, 10) : 0
    }
    return [{count: count1 + count2}]
  }
  

  /**
   * 获取PC错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvPcCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM " + CommonSql.setTableName("CustomerPV", 0, param.webMonitorId) + " WHERE happenDate > '" + param.day + "' and os LIKE 'web%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取IOS错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvIosCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM " + CommonSql.setTableName("CustomerPV", 0, param.webMonitorId) + " WHERE happenDate > '" + param.day + "' and os LIKE 'ios%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取Android错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvAndroidCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM " + CommonSql.setTableName("CustomerPV", 0, param.webMonitorId) + " WHERE happenDate > '" + param.day + "' and os LIKE 'android%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser(customerKeySql, happenTimeSql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("CustomerPV", timeScope, webMonitorId) + " where " + happenTimeSql + " and " + customerKeySql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据userId获取到所有的customerKey
   * @returns {Promise<*>}
   */
  static async getCustomerKeyByUserId(param) {
    const { timeScope, webMonitorId, userId } = param
    let tableName = CommonSql.setTableName("CustomerPV", timeScope, webMonitorId)
    let sql = "select DISTINCT(customerKey) from " + tableName + " where userId='" + userId + "'"
    console.log(sql)
    let res = await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
    return res

    // const resArray = []
    // for (let i = 0; i < 15; i ++) {
    //   let tableName = CommonSql.setTableName("CustomerPV", i, param.webMonitorId)
    //   let sql = "select DISTINCT(customerKey) from " + tableName + " where userId='" + param.userId + "'"
    //   try {
    //     let res = await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
    //     let resObj = {customerKey: res[0].customerKey}
    //     resArray.push(resObj)
    //   } catch(e) {
    //     log.printError(tableName + " 这个表可能不存在", e)
    //     console.warn("\x1B[33m%s\x1b[0m", "运行时间不足15天，" + tableName + " 这个表可能不存在，并不影响查询结果！")
    //   }
    // }
    // return resArray
  }

  /**
   * 根据customerKey 获取用户详情
   */
  static async getCustomerPVDetailByCustomerKey(customerKeySql, happenTimeSql, param) {
    const { timeScope, webMonitorId } = param
    let sql = "select * from " + CommonSql.setTableName("CustomerPV", timeScope, webMonitorId) + " where " + happenTimeSql + "and" + customerKeySql + " limit 1"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据customerKey获取用户访问每个页面的次数
   */
  static async getPVsByCustomerKey(customerKeySql, happenTimeSql, param) {
    const {timeScope, webMonitorId} = param
    let sql = "select CAST(simpleUrl AS char) as simpleUrl, count(simpleUrl) from " + CommonSql.setTableName("CustomerPV", timeScope, webMonitorId) + " where " + happenTimeSql + "and" + customerKeySql + " GROUP BY simpleUrl "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 每5分钟的各个省份的Uv量
   */
  static async getProvinceCountBySeconds(param) {
    // let sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%s') AS seconds, COUNT(pageKey) AS count FROM CustomerPV " +
    //   "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 30 SECOND, '%Y-%m-%d %T') <= createdAt GROUP BY seconds"
    const nowTime = new Date().getTime()
    const searchTime = new Date(nowTime - 300 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    const tableName = CommonSql.setTableName("CustomerPV", 0, param.webMonitorId)
    let sql = "SELECT province as name, count(distinct customerKey) as value from " + tableName + " where happenDate>'" + searchTime + "' GROUP BY province"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 每5分钟Uv量
   */
  static async getAliveCusInRealTime(param) {
    const nowTime = new Date().getTime()
    const searchTime = new Date(nowTime - 300 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    let sql = "SELECT count(distinct customerKey) as count from " + CommonSql.setTableName("CustomerPV", 0, param.webMonitorId) + " where happenDate>'" + searchTime + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取5分钟内，每秒的用户量 
   */

  static async getAliveUvCountForSecond(param) {
    let sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%s') AS seconds, COUNT(pageKey) AS count FROM " + Utils.setTableName("CustomerPV") + " " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 3600 SECOND, '%Y-%m-%d %T') <= createdAt GROUP BY seconds"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 查询10s内的PV数据
   */
  static async getPvsInfoByTenSeconds(param) {
    const nowTime = new Date().getTime()
    const searchTime = new Date(nowTime - 10 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    const tableName = CommonSql.setTableName("CustomerPV", 0, param.webMonitorId)
    let sql = "SELECT * from " + tableName + " where happenDate>'" + searchTime + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 查询10s内的新客户的数量
   */
  static async getNewCusInfoBySeconds(param) {
    const nowTime = new Date().getTime()
    const searchTime = new Date(nowTime - 300 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    const tableName = CommonSql.setTableName("CustomerPV", 0, param.webMonitorId)
    let sql = "SELECT count(distinct customerKey) as count from " + tableName + " where happenDate>'" + searchTime + "' and  (newStatus='n' or newStatus='n_uv' ) "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  
  /**
   * 每秒钟的pv量
   */
  static async getPvCountBySecond(param) {
    let sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%s') AS seconds, COUNT(pageKey) AS count FROM " + Utils.setTableName("CustomerPV") + " " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 30 SECOND, '%Y-%m-%d %T') <= createdAt GROUP BY seconds"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 每秒钟的uv量
   */
  static async getUvCountBySecond(param) {
    let sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%s') AS seconds, COUNT(DISTINCT customerKey) AS count FROM " + Utils.setTableName("CustomerPV") + " " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 30 SECOND, '%Y-%m-%d %T') <= createdAt GROUP BY seconds"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 每分钟的pv量
   */
  static async getPvCountByMinute(param) {
    const tableName = CommonSql.setTableName("CustomerPV", 0, param.webMonitorId)
    let sql = "SELECT DATE_FORMAT(happenDate,'%Y-%m-%d %H:%i') AS minutes, COUNT(pageKey) AS count FROM " + tableName + " " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 30 MINUTE, '%Y-%m-%d %T') <= happenDate GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 每分钟的uv量
   */
  static async getUvCountByMinute(param) {
    const tableName = CommonSql.setTableName("CustomerPV", 0, param.webMonitorId)
    let sql = "SELECT DATE_FORMAT(happenDate,'%Y-%m-%d %H:%i') AS minutes, COUNT(DISTINCT customerKey) AS count FROM " + tableName + " " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 30 MINUTE, '%Y-%m-%d %T') <= happenDate GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内每小时user量
   */
  static async getUserCountByHour(param) {
    let sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(DISTINCT userId) AS count " +
      "FROM " + Utils.setTableName("CustomerPV") + " WHERE " +
      "webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt GROUP BY HOUR"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时的user量
   * @returns {Promise<*>}
   */
  static async getUserCountSevenDayAgoByHour(param) {
    const tempNowHour = new Date().getHours();
    let nowHour = tempNowHour
    let sevenDayAgo = ""
    if (tempNowHour === 23) {
      sevenDayAgo = Utils.addDays(-6) + " 00:00:00";
    } else {
      nowHour = nowHour + 1
      sevenDayAgo = Utils.addDays(-7) + " " + nowHour + ":00:00";
    }
    const sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(DISTINCT userId) AS count " +
      "FROM " + Utils.setTableName("CustomerPV") + " " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and createdAt<'" + sevenDayAgo + "' and DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 7 DAY) - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt " +
      "GROUP BY HOUR"
    // return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfos where  webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内每小时UV量
   */
  static async getUvCountByHour(param) {
    // let sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(DISTINCT customerKey) AS count " +
    //   "FROM CustomerPV WHERE " +
    //   "webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt GROUP BY HOUR"
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = nowTime
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='uv' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时的UV量
   * @returns {Promise<*>}
   */
  static async getUvCountSevenDayAgoByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = startTime + (timeSize + 1) * 24 * 3600 * 1000
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='uv' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内每小时PV量
   */
  static async getCustomerCountByTime(param) {
    let sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(pageKey) AS count " +
      "FROM " + Utils.setTableName("CustomerPV") + " WHERE " +
      "webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt GROUP BY HOUR"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取24小时内每小时PV量
   */
  static async getPvCountByTime(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = nowTime
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + UPLOAD_TYPE.PV_COUNT_HOUR + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"

    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时的PV量
   * @returns {Promise<*>}
   */
  static async getPvCountSevenDayAgoByHour(param) {
    // const tempNowHour = new Date().getHours();
    // let nowHour = tempNowHour
    // let sevenDayAgo = ""
    // if (tempNowHour === 23) {
    //   sevenDayAgo = Utils.addDays(-6) + " 00:00:00";
    // } else {
    //   nowHour = nowHour + 1
    //   sevenDayAgo = Utils.addDays(-7) + " " + nowHour + ":00:00";
    // }
    // const sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(pageKey) AS count " +
    //   "FROM CustomerPV " +
    //   "WHERE webMonitorId='" + param.webMonitorId + "' and createdAt<'" + sevenDayAgo + "' and DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 7 DAY) - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt " +
    //   "GROUP BY HOUR"
    // return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfos where  webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = startTime + (timeSize + 1) * 24 * 3600 * 1000
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + UPLOAD_TYPE.PV_COUNT_HOUR + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取今天新客户数量
   */
  static async getNewCustomerCountByToday(param) {
    const tableName = CommonSql.setTableName("CustomerPV", 0, param.webMonitorId)
    let sql = "SELECT  count(distinct customerKey) as count from " + tableName + " where newStatus='n' or newStatus='n_uv'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取24小时内每小时新用户量
   */
  static async getNewCustomerCountByTime(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = nowTime
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + UPLOAD_TYPE.NEW_CUSTOMER + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时新用户量
   * @returns {Promise<*>}
   */
  static async getNewCustomerCountSevenDayAgoByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = startTime + (timeSize + 1) * 24 * 3600 * 1000
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + UPLOAD_TYPE.NEW_CUSTOMER + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内每小时用户安装量
   */
  static async getInstallCountByTime(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = nowTime
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + UPLOAD_TYPE.INSTALL_COUNT + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取7天前，24小时内，每小时新用户量
   * @returns {Promise<*>}
   */
  static async getInstallCountSevenDayAgoByHour(param) {
    const timeSize = param.timeSize * 1
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000 - timeSize * 24 * 3600 * 1000
    const endTime = startTime + (timeSize + 1) * 24 * 3600 * 1000
    const startHour = new Date(startTime).Format("MM-dd hh")
    const endHour = new Date(endTime).Format("MM-dd hh")
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='" + UPLOAD_TYPE.INSTALL_COUNT + "' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取城市top10数量列表
   */
  static async getVersionCountOrderByCount(param) {
    // const timeScope = new Date(new Date().getTime() - 6 * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    // const sql = "SELECT projectVersion, count(distinct customerKey) as count from " + Utils.setTableName("CustomerPV") + " WHERE webMonitorId='" + param.webMonitorId + "' GROUP BY projectVersion order by count desc limit 10"
    // return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
    const {webMonitorId} = param
    const uploadTypeForDay = UPLOAD_TYPE.VERSION_COUNT_DAY
    const day = 0
    let dayName = Utils.addDays(day)
    let sql1 = "SELECT showName, dayCount as count from DeviceInfoCountByDay where dayName='" + dayName + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "' order by count desc limit 10"
    return await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取城市top10数量列表
   */
  static async getCityCountOrderByCount(param) {
    const {webMonitorId} = param
    const uploadTypeForDay = UPLOAD_TYPE.CITY_COUNT_DAY
    const day = 0
    let dayName = Utils.addDays(day)
    let sql1 = "SELECT showName, dayCount as count from DeviceInfoCountByDay where dayName='" + dayName + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "' order by count desc limit 10"
    return await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取设备top10数量列表
   */
  static async getDeviceCountOrderByCount(param) {
    const {webMonitorId} = param
    const uploadTypeForDay = UPLOAD_TYPE.DEVICE_COUNT_DAY
    const day = 0
    let dayName = Utils.addDays(day)
    let sql1 = "SELECT showName, dayCount as count from DeviceInfoCountByDay where dayName='" + dayName + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "' order by count desc limit 10"
    return await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取每小时内设备数量
   */
  static async getDeviceCountByHour(webMonitorId, lastHour, hour, key) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1, webMonitorId)
    }
    const sql = "SELECT " + key + " as showName, count(DISTINCT customerKey) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and ( newStatus='o_uv' or newStatus='n_uv' ) GROUP BY " +  key
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取每小时内城市人数
   */
  static async getCityCountByHour(webMonitorId, lastHour, hour) {
    const tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    const sql = "SELECT city, count(DISTINCT customerKey) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and ( newStatus='o_uv' or new Status='n_uv' ) GROUP BY city"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取每小时内系统人数
   */
  static async getSystemCountByHour(webMonitorId, lastHour, hour) {
    const tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    const sql = "SELECT os, count(DISTINCT customerKey) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and ( newStatus='o_uv' or new Status='n_uv' ) GROUP BY os"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取每小时内应用版本人数
   */
  static async getProjectVersionCountByHour(webMonitorId, lastHour, hour) {
    const tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    const sql = "SELECT projectVersion, count(DISTINCT customerKey) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and ( newStatus='o_uv' or new Status='n_uv' ) GROUP BY projectVersion"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取操作系统top10数量列表
   */
  static async getOsCountOrderByCount(param) {
    // const sql = "SELECT os, count( distinct customerKey) as count from " + Utils.setTableName("CustomerPV") + " WHERE webMonitorId='" + param.webMonitorId + "' GROUP BY os order by count desc limit 10"
    // return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
    const {webMonitorId} = param
    const uploadTypeForDay = UPLOAD_TYPE.SYSTEM_COUNT_DAY
    const day = 0
    let dayName = Utils.addDays(day)
    let sql1 = "SELECT showName, dayCount as count from DeviceInfoCountByDay where dayName='" + dayName + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + uploadTypeForDay + "' order by count desc limit 10"
    return await Sequelize.query(sql1, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getPvListTotalCountByTime(param) {
    let {timeScope, searchHour, webMonitorId, ipAddress} = param
    const searchDate = Utils.addDays(0 - timeScope)
    const happenDateScope = searchDate + " " + searchHour + ":00:00"
    const happenDateScopeEnd = searchDate + " " + searchHour + ":59:59"
    const happenDateSql = searchHour === -1 ? " 1=1 " : " happenDate>='" + happenDateScope + "' and happenDate<='" + happenDateScopeEnd + "' "
    const ipAddressStr = ipAddress ? " and monitorIp='" + ipAddress + "' " : ""
    const tableName = CommonSql.setTableName("CustomerPV", timeScope, webMonitorId)
    const sql = `select count(*) as count from ${tableName} where ${happenDateSql} ${ipAddressStr} `
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getPvListByPage(param) {
    let {timeScope, searchHour, webMonitorId, page, ipAddress} = param
    const searchDate = Utils.addDays(0 - timeScope)
    const happenDateScope = searchDate + " " + searchHour + ":00:00"
    const happenDateScopeEnd = searchDate + " " + searchHour + ":59:59"
    const happenDateSql = searchHour === -1 ? " 1=1 " : " happenDate>='" + happenDateScope + "' and happenDate<='" + happenDateScopeEnd + "' "
    const ipAddressStr = ipAddress ? " and monitorIp='" + ipAddress + "' " : ""
    const tableName = CommonSql.setTableName("CustomerPV", timeScope, webMonitorId)
    const sql = `select * from ${tableName} where ${happenDateSql} ${ipAddressStr} limit ${(page - 1) * 100},${(page) * 100}`

    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getSevenDaysLeftCount(param, currentDay) {
    const day = parseInt(param.day, 10)
    const sevenDay = Utils.addDays(1 - day)
    // let sql = ""
    // for (let i = day - 1; i > 0; i --) {
    //   const currentDay = Utils.addDays(0 - i)
    //   const currentDayStr = currentDay.replace(/-/g, "")
    //   const tableName = param.webMonitorId + "CustomerPV" + currentDayStr
    //   if (i > 1) {
    //     sql +=
    //     "select count(DISTINCT customerKey) as count from " + tableName + " WHERE customerKeyCreatedDate='" + sevenDay + "' "
    //     + " UNION "
    //   } else {
    //     sql += "select count(DISTINCT customerKey) as count from " + tableName + " WHERE customerKeyCreatedDate='" + sevenDay + "' "
    //   }
    // }
    const currentDayStr = currentDay.replace(/-/g, "")
    const tableName = param.webMonitorId + "CustomerPV" + currentDayStr
    const sql = "select count(DISTINCT customerKey) as count from " + tableName + " WHERE customerKeyCreatedDate='" + sevenDay + "' "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getYesterdayLeftPercent(param) {
    const { webMonitorId, day } = param
    const dateStr = Utils.addDays(0 - day)
    const sql = "SELECT dayName, dayCount from InfoCountByDay WHERE createdAt>='" + dateStr + "' and webMonitorId='" + webMonitorId + "' and uploadType='" + UPLOAD_TYPE.UV_YESTERDAY_PER + "' order by dayName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  // 次日留存数据量
  static async getYesterdayLeftCount(webMonitorId, index) {
    // 计算次日留存率，需要再往前推一天，因为今天数据还没有完全生成
    const day = index - 1
    const targetDay = Utils.addDays(day)

    const currentDay1 = Utils.addDays(day)
    const currentDayStr1 = currentDay1.replace(/-/g, "")
    const tableName1 = webMonitorId + "CustomerPV" + currentDayStr1

    const currentDay2 = Utils.addDays(day + 1)
    const currentDayStr2 = currentDay2.replace(/-/g, "")
    const tableName2 = webMonitorId + "CustomerPV" + currentDayStr2

    let sql = "select count(DISTINCT customerKey) as count from " + tableName1 + " WHERE customerKeyCreatedDate='" + targetDay + "' "
              + " UNION " +
              "select count(DISTINCT customerKey) as count from " + tableName2 + " WHERE customerKeyCreatedDate='" + targetDay + "' "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取平台分布数据
   */
  static async getOsAnalysis(param) {
    const endTimeScope = Utils.addDays(0 - param.timeScope)
    let sql = "SELECT os, count(os) from " + Utils.setTableName("CustomerPV") + " where createdAt>'" + endTimeScope + "' AND webMonitorId = '" + param.webMonitorId + "' GROUP BY os"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据时间获取某一天的用户数量
   */
  static async getCustomerCountByDayTime(webMonitorId, startTimeScope, endTimeScope) {
    let sql = "select count(DISTINCT(customerKey)) as count from " + Utils.setTableName("CustomerPV") + " WHERE createdAt>'" + startTimeScope + "' AND createdAt>'" + endTimeScope + "'  AND webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一小时的Pv量
   */
  static async calculatePvCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1, webMonitorId)
    }
    let sql = "select count(*) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一小时的新用户活跃量
   */
  static async calculateNewCustomerCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1, webMonitorId)
    }
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and (newStatus='n' or newStatus='n_uv' ) "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一小时的ip数量
   */
  static async calculateTotalIPCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1, webMonitorId)
    }
    let sql = "select count(distinct monitorIp) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and (newStatus='o_uv' or newStatus='n_uv' ) "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一小时的新用户唯一数量
   */
  static async calculateTotalNewCustomerCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1, webMonitorId)
    }
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and newStatus='n_uv'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算应用的平均安装频次（userId一般出入的比较少，所以肯定是大于1的，也可以用来判断userId传入的比例）
   */
  static async calculateInstallCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId)
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1, webMonitorId)
    }
    let sql_cus = "select count(distinct customerKey) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "'"
    const customerKeyInfo = await Sequelize.query(sql_cus, { type: Sequelize.QueryTypes.SELECT})
    let sql_user = "select count(distinct userId) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "'"
    const userIdInfo= await Sequelize.query(sql_user, { type: Sequelize.QueryTypes.SELECT})
    const customerKeyCount = customerKeyInfo.length > 0 ? customerKeyInfo[0].count : 0
    const userIdCount = userIdInfo.length > 0 ? userIdInfo[0].count : 0
    let result = 0
    if (userIdCount == 0) {
      result = 0
    } else {
      result = (customerKeyCount / userIdCount).toFixed(2)
    }
    return result
  }

  /**
   * 计算某一小时的Uv活跃量
   */
  static async calculateUvCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId) // Utils.setTableName("CustomerPV")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1, webMonitorId)
    }
    let sql = "select count(DISTINCT customerKey ) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一小时的Uv唯一数量
   */
  static async calculateTotalUvCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = CommonSql.setTableName("CustomerPV", 0, webMonitorId) // Utils.setTableName("CustomerPV")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1, webMonitorId)
    }
    let sql = "select count(DISTINCT(customerKey)) as count from " + tableName + " WHERE happenDate>='" + lastHour + "' AND happenDate<'" + hour + "' and ( newStatus='o_uv' or newStatus='n_uv' ) "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据customerKey获取用户一个月内，每天的pv数量
   */
  static async calculatePvCountByCustomerKeyForMonth(customerKeySql) {
    const resArray = []
    for (let i = 0; i < 15; i ++) {
      let day = Utils.addDays(0 - i)
      let tableName = CommonSql.setTableName("CustomerPV", i)
      let sql = "select count(id) as count from " + tableName + " where " + customerKeySql
      try {
        let res = await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
        let resObj = {day, count: parseInt(res[0].count, 10)}
        resArray.push(resObj)
      } catch(e) {
        console.warn("\x1B[33m%s\x1b[0m", "运行时间不足15天，" + tableName + " 这个表可能不存在，并不影响查询结果！")
      }
    }
    return resArray
  }
}
module.exports = {CustomerPvLeaveModel,CustomerStayTimeModel,ScreenShotInfoModel,BehaviorInfoModel,CommonModel,DeviceInfoCountByDayModel,DeviceInfoCountByHourModel,ExtendBehaviorInfoModel,FunnelModel,IgnoreErrorModel,InfoCountByDayModel,InfoCountByHourModel,LocationPointGroupModel,LocationPointTypeModel,LocationPointModel,ProjectModel,UserModel,VideosInfoModel,HttpErrorInfoModel,HttpLogInfoModel,LoadPageInfoModel,ResourceLoadInfoModel,JavascriptErrorInfoModel,CustomerPVModel}