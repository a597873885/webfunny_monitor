const db = require('../config/db');
                        const Sequelize = db.sequelize;
                        const Utils = require('../util/utils');
                        const utils = require('../util/utils');
                        const geoip = require('geoip-lite');
                        const log = require("../config/log");
                        const CommonSql = require("../util/commonSql")
                        const UPLOAD_TYPE = require('../config/consts')
                        const fetch = require('node-fetch');
const BehaviorInfo = Sequelize.import('../schema/behaviorInfo');
BehaviorInfo.sync({force: false});


class BehaviorInfoModel {
  /**
   * 创建行为信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createBehaviorInfo(data) {
    return await BehaviorInfo.create({
      ...data
    })
  }

  /**
   * 更新文章数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateBehaviorInfo(id, data) {
    await BehaviorInfo.update({
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
   * 获取文章列表
   * @returns {Promise<*>}
   */
  static async getBehaviorInfoList() {
    return await BehaviorInfo.findAndCountAll()
  }

  /**
   * 获取文章详情数据
   * @param id  文章ID
   * @returns {Promise<Model>}
   */
  static async getBehaviorInfoDetail(id) {
    return await BehaviorInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteBehaviorInfo(id) {
    await BehaviorInfo.destroy({
      where: {
        id,
      }
    })
    return true
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
  static async getBehaviorsByUser(webMonitorIdSql, customerKeySql, happenTimeSql, param) {
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("BehaviorInfo", timeScope) + " where " + happenTimeSql + " and " + customerKeySql + " and " + webMonitorIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }


  /**
   * 测试接口
   * @returns {Promise<*>}
   */
  static async testBehavior(webMonitorIdSql) {
    let sql = "select CAST(innerText AS char) as innerText, count(innerText) as count from " + Utils.setTableName("BehaviorInfo") + " where webMonitorId='1558538908619' and createdAt>'2019-07-17 00:00:00' GROUP BY innerText ORDER BY count desc LIMIT 20"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const ScreenShotInfo = Sequelize.import('../schema/ScreenShotInfo');
ScreenShotInfo.sync({force: false});


class ScreenShotInfoModel {
  /**
   * 创建ScreenShotInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createScreenShotInfo(data) {
    return await ScreenShotInfo.create({
      ...data
    })
  }

  /**
   * 更新ScreenShotInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateScreenShotInfo(id, data) {
    await ScreenShotInfo.update({
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
   * 获取ScreenShotInfo列表
   * @returns {Promise<*>}
   */
  static async getScreenShotInfoList() {
    return await ScreenShotInfo.findAndCountAll()
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
   * 获取ScreenShotInfo详情数据
   * @param id  ScreenShotInfo的ID
   * @returns {Promise<Model>}
   */
  static async getScreenShotInfoDetail(id) {
    return await ScreenShotInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除ScreenShotInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteScreenShotInfo(id) {
    await ScreenShotInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser(webMonitorIdSql, happenTimeSql, userIdSql, param) {
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("ScreenShotInfo", timeScope) + " where " + happenTimeSql + "and" + userIdSql + " and " + webMonitorIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async deleteScreenShotInfoFifteenDaysAgo(days) {
    const timeScope = Utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from ScreenShotInfo where createdAt<'" + timeScope + "'"
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
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
    console.log(sql)
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

}

const EmailCode = Sequelize.import('../schema/emailCode');
EmailCode.sync({force: false});


class EmailCodeModel {
  /**
   * 创建EmailCode信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createEmailCode(data) {
    return await EmailCode.create({
      ...data
    })
  }

  /**
   * 更新EmailCode数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateEmailCode(id, data) {
    await EmailCode.update({
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
   * 获取EmailCode列表
   * @returns {Promise<*>}
   */
  static async getEmailCodeList() {
    return await EmailCode.findAndCountAll()
  }

  /**
   * 获取EmailCode详情数据
   * @param id  EmailCode的ID
   * @returns {Promise<Model>}
   */
  static async getEmailCodeDetail(id) {
    return await EmailCode.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除EmailCode
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteEmailCode(id) {
    await EmailCode.destroy({
      where: {
        id,
      }
    })
    return true
  }
  /**
   * 保存EmailCode信息
   * @param data
   * @returns {Promise<*>}
   */
  static async saveEmailCode(data) {
    const {email, emailCode, createdAt = new Date().Format("yyyy-MM-dd hh:mm:ss"), updatedAt = new Date().Format("yyyy-MM-dd hh:mm:ss")} = data
    const tableName = utils.setTableName("EmailCode")
    let sql = "INSERT INTO `" + tableName + "` (`email`,`emailCode`,`createdAt`,`updatedAt`, `id`) VALUES ('" + email + "','" + emailCode + "','" + createdAt + "','" + updatedAt + "',DEFAULT)"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.In})
  }
  static async isSendEmailCodeToday(email) {
    let sql = "select * from " + utils.setTableName("EmailCode") + " where email='" + email + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async checkEmailCode(email, code) {
    let sql = "select count(id) as count from " + utils.setTableName("EmailCode") + " where email='" + email + "' and emailCode='" + code + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const DailyActivity = Sequelize.import('../schema/dailyActivity');
DailyActivity.sync({force: false});


class DailyActivityModel {
  /**
   * 创建DailyActivity信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createDailyActivity(data) {
    return await DailyActivity.create({
      ...data
    })
  }

  /**
   * 更新DailyActivity数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateDailyActivity(id, data) {
    await DailyActivity.update({
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
   * 获取DailyActivity列表
   * @returns {Promise<*>}
   */
  static async getDailyActivityList() {
    return await DailyActivity.findAndCountAll()
  }

  /**
   * 获取DailyActivity详情数据
   * @param id  DailyActivity的ID
   * @returns {Promise<Model>}
   */
  static async getDailyActivityDetail(id) {
    return await DailyActivity.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除DailyActivity
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteDailyActivity(id) {
    await DailyActivity.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

const ExtendBehaviorInfo = Sequelize.import('../schema/extendBehaviorInfo');
ExtendBehaviorInfo.sync({force: false});


class ExtendBehaviorInfoModel {
  /**
   * 创建ExtendBehaviorInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createExtendBehaviorInfo(data) {
    return await ExtendBehaviorInfo.create({
      ...data
    })
  }

  /**
   * 更新ExtendBehaviorInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateExtendBehaviorInfo(id, data) {
    await ExtendBehaviorInfo.update({
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
   * 获取ExtendBehaviorInfo列表
   * @returns {Promise<*>}
   */
  static async getExtendBehaviorInfoList() {
    return await ExtendBehaviorInfo.findAndCountAll()
  }

  /**
   * 获取ExtendBehaviorInfo详情数据
   * @param id  ExtendBehaviorInfo的ID
   * @returns {Promise<Model>}
   */
  static async getExtendBehaviorInfoDetail(id) {
    return await ExtendBehaviorInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除ExtendBehaviorInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteExtendBehaviorInfo(id) {
    await ExtendBehaviorInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }


  /**
   * 获取当前用户所有的请求记录
   * @returns {Promise<*>}
   */
  static async getExtendBehaviorInfoByUserId(happenTimeSql, userIdSql, param) {
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("ExtendBehaviorInfo", timeScope) + " where " + happenTimeSql + "and" + userIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
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
   * 获取Project列表
   * @returns {Promise<*>}
   */
  static async getProjectList(param) {
    let sql = param.userEmail ? "select id, webMonitorId, projectName, projectType from Project where email='" + param.userEmail + "'"
                              : "select id, webMonitorId, projectName, projectType from Project where email='597873885@qq.com'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取Project列表
   * @returns {Promise<*>}
   */
  static async getAllProjectList(param) {
    const whereSql = param ? " where email='" + param.userEmail + "'" : ""
    let sql = "select id, webMonitorId, projectName, projectType, createdAt from Project" + whereSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取Project详细信息列表
   * @returns {Promise<*>}
   */
  static async getProjectDetailList(param) {
    const { userEmail } = param
    let sql = "select * from Project where email='" + userEmail + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  
  /**
   * 检查用户名和项目名
   * @returns {Promise<*>}
   */
  static async getProjectByUserAndPName(email, webMonitorId) {
    let sql = "select id from Project where email='" + email + "' and webMonitorId='" + webMonitorId + "'"
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

const LoadPageInfo = Sequelize.import('../schema/loadPageInfo');
LoadPageInfo.sync({force: false});


class LoadPageInfoModel {
  /**
   * 创建LoadPageInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createLoadPageInfo(data) {
    return await LoadPageInfo.create({
      ...data
    })
  }

  /**
   * 更新LoadPageInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateLoadPageInfo(id, data) {
    await LoadPageInfo.update({
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
   * 获取LoadPageInfo列表
   * @returns {Promise<*>}
   */
  static async getLoadPageInfoList() {
    return await LoadPageInfo.findAndCountAll()
  }

  /**
   * 获取LoadPageInfo详情数据
   * @param id  LoadPageInfo的ID
   * @returns {Promise<Model>}
   */
  static async getLoadPageInfoDetail(id) {
    return await LoadPageInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除LoadPageInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteLoadPageInfo(id) {
    await LoadPageInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }
 /**
   * 根据customerKey获取用户访问每个页面的平均请求时间，判断网络状态
   */
  static async getPageLoadTimeByCustomerKey(webMonitorIdSql, customerKeySql, happenTimeSql, param) {
    const { timeScope } = param
    let sql = "SELECT CAST(simpleUrl AS char) as simpleUrl, COUNT(simpleUrl) as urlCount, AVG(loadPage) as loadPage, AVG(domReady) as domReady, AVG(request) as resource, AVG(lookupDomain) as DNS from " + CommonSql.setTableName("LoadPageInfo", timeScope) + " where loadPage>0 and loadPage<30000 and " + happenTimeSql + "and" + customerKeySql + " and " + webMonitorIdSql + " GROUP BY simpleUrl ORDER BY urlCount desc"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据customerKey获取用户访问每个页面的平均请求时间，判断网络状态
   */
  static async getLoadPageInfoByCustomerKey(webMonitorIdSql, customerKeySql, param) {
    const { timeScope } = param
    let sql = "SELECT * from " + CommonSql.setTableName("LoadPageInfo", timeScope) + " where " + customerKeySql + " and " + webMonitorIdSql
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
}

const PurchaseCode = Sequelize.import('../schema/PurchaseCode.js');
PurchaseCode.sync({force: false});


class PurchaseCodeModel {
  /**
   * 创建PurchaseCode信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createPurchaseCode(data) {
    return await PurchaseCode.create({
      ...data
    })
  }

  /**
   * 更新PurchaseCode数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updatePurchaseCode(id, data) {
    await PurchaseCode.update({
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
   * 获取PurchaseCode列表
   * @returns {Promise<*>}
   */
  static async getPurchaseCodeList() {
    return await PurchaseCode.findAndCountAll()
  }

  /**
   * 获取PurchaseCode详情数据
   * @param id  PurchaseCode的ID
   * @returns {Promise<Model>}
   */
  static async getPurchaseCodeDetail(id) {
    return await PurchaseCode.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除PurchaseCode
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deletePurchaseCode(id) {
    await PurchaseCode.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取PurchaseCode详情数据
   * @param id  PurchaseCode的ID
   * @returns {Promise<Model>}
   */
  static async getPurchaseCodeDetailByCode(purchaseCode) {
    return await PurchaseCode.findOne({
      where: {
        purchaseCode,
      },
    })
  }
}

const User = Sequelize.import('../schema/user.js')
User.sync({force: false});


class UserModel {
    /**
     * 创建用户
     * @param user
     * @returns {Promise<boolean>}
     */
    static async create(user) {
        let {username, email, emailPwd, password} = user;

        await User.create({
            username,
            email,
            emailPwd,
            password
        })
        return true
    }

    /**
     * 删除用户
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await User.destroy({
            where: {
                id,
            }
        })
        return true
    }

    /**
     * 查询用户列表
     * @returns {Promise<*>}
     */
    static async findAllUserList() {
        return await User.findAll({
            attributes: ['id', 'username']
        })
    }

    /**
     * 查询用户信息
     * @param username  姓名
     * @returns {Promise.<*>}
     */
    static async findUserByName(username) {
        return await User.findOne({
            where: {
                username
            }
        })
    }

    /**
     * 查询用户信息
     * @param email  邮箱
     * @returns {Promise.<*>}
     */
    static async findUserByEmail(email) {
        return await User.findOne({
            where: {
                email
            }
        })
    }
    /**
     * 查询用户信息
     * @param email  邮箱
     * @returns {Promise.<*>}
     */
    static async findUserByLogin(email, password) {
        return await User.findOne({
            where: {
                email,
                password
            }
        })
    }
}

const HttpLogInfo = Sequelize.import('../schema/HttpLogInfo');
HttpLogInfo.sync({force: false});



class HttpLogInfoModel {
  /**
   * 创建HttpLogInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createHttpLogInfo(data) {
    return await HttpLogInfo.create({
      ...data
    })
  }

  /**
   * 更新HttpLogInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateHttpLogInfo(id, data) {
    await HttpLogInfo.update({
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
   * 获取HttpLogInfo列表
   * @returns {Promise<*>}
   */
  static async getHttpLogInfoList() {
    return await HttpLogInfo.findAndCountAll()
  }

  /**
   * 获取HttpLogInfo详情数据
   * @param id  HttpLogInfo的ID
   * @returns {Promise<Model>}
   */
  static async getHttpLogInfoDetail(id) {
    return await HttpLogInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除HttpLogInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteHttpLogInfo(id) {
    await HttpLogInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取当前用户所有的请求记录
   * @returns {Promise<*>}
   */
  static async getHttpLogsByUser(webMonitorIdSql, customerKeySql, happenTimeSql, param) {
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("HttpLogInfo", timeScope) + " where " + customerKeySql + " and " + happenTimeSql + " and " + webMonitorIdSql
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
   * 计算某一天静态资源加载错误量
   */
  static async calculateHttpLogCountForSecByDay(webMonitorId, useDay, min, max) {
    const start = min * 1000
    const end = max * 1000
    let sql = "select count(id) as count from " + "HttpLogInfo" + useDay.replace(/-/g, "") + " WHERE  webMonitorId = '" + webMonitorId + "' and loadTime<=" + end + " and loadTime>" + start
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
    const { searchType, day, webMonitorId } = param
    let timeSql = ""
    switch(searchType) {
      case "0":
          timeSql = " and loadTime>30000 and loadTime<=1000000 "
        break
      case "1":
          timeSql = " and loadTime>10000 and loadTime<=30000 "
        break
      case "2":
          timeSql = " and loadTime>5000 and loadTime<=10000 "
        break
      case "3":
        timeSql = " and loadTime>1000 and loadTime<=5000 "
      break
      case "4":
        timeSql = " and loadTime>0 and loadTime<=1000 "
      break
    }
    const tableName = CommonSql.setTableName("HttpLogInfo", day)
    let sql = "SELECT CAST(simpleHttpUrl AS char) as simpleHttpUrl, count(simpleHttpUrl) as count, avg(loadTime) as loadTime from " + tableName + " where webMonitorId='" + webMonitorId + "' " + timeSql + " GROUP BY simpleHttpUrl ORDER BY count desc limit 20"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取影响人数
   * @returns {Promise<*>}
   */
  static async getHttpUrlUserCountForLoadTime(param) {
    const { searchType, day, webMonitorId, simpleHttpUrl } = param
    let timeSql = ""
    switch(searchType) {
      case "0":
          timeSql = " and loadTime>30000 and loadTime<=1000000 "
        break
      case "1":
          timeSql = " and loadTime>10000 and loadTime<=30000 "
        break
      case "2":
          timeSql = " and loadTime>5000 and loadTime<=10000 "
        break
      case "3":
        timeSql = " and loadTime>1000 and loadTime<=5000 "
      break
      case "4":
        timeSql = " and loadTime>0 and loadTime<=1000 "
      break
    }
    const tableName = CommonSql.setTableName("HttpLogInfo", day)
    let sql = "SELECT count(distinct customerKey) as count from " + tableName + " where webMonitorId='" + webMonitorId + "' and simpleHttpUrl='" + simpleHttpUrl + "' " + timeSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 
   */
  static async getHttpUrlCountListByHour(param) {
    const { searchType, day = 0, webMonitorId, simpleHttpUrl } = param
    let timeSql = ""
    switch(searchType) {
      case "0":
          timeSql = " and loadTime>30000 and loadTime<=1000000 "
        break
      case "1":
          timeSql = " and loadTime>10000 and loadTime<=30000 "
        break
      case "2":
          timeSql = " and loadTime>5000 and loadTime<=10000 "
        break
      case "3":
        timeSql = " and loadTime>1000 and loadTime<=5000 "
      break
      case "4":
        timeSql = " and loadTime>0 and loadTime<=1000 "
      break
    }
    const dateSql = !day ? " NOW() " : " DATE_SUB(NOW(),INTERVAL " + day + " DAY) "
    const tableName = CommonSql.setTableName("HttpLogInfo", day)
    const sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(id) AS count " +
                "FROM " + tableName + " " +
                "WHERE webMonitorId='" + webMonitorId + "' and simpleHttpUrl='" + simpleHttpUrl + "' " + timeSql + " and DATE_FORMAT(" + dateSql + " - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt " +
                "GROUP BY HOUR"
    // return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfo where  webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

   /**
   * 根据url，获取每分钟JS错误的数量
   * @returns {Promise<*>}
   */
  static async getHttpUrlCountForHourByMinutes(param) {
    const { searchType, day = 0, webMonitorId, simpleHttpUrl, timeHour } = param
    const start = new Date(parseInt(timeHour, 10)).Format("yyyy-MM-dd hh:00:00")
    const end = new Date(parseInt(timeHour, 10) + 60 * 60 * 1000).Format("yyyy-MM-dd hh:00:00")
    const tableName = CommonSql.setTableName("HttpLogInfo", day)
    let timeSql = ""
    switch(searchType) {
      case "0":
          timeSql = " and loadTime>30000 and loadTime<=1000000 "
        break
      case "1":
          timeSql = " and loadTime>10000 and loadTime<=30000 "
        break
      case "2":
          timeSql = " and loadTime>5000 and loadTime<=10000 "
        break
      case "3":
        timeSql = " and loadTime>1000 and loadTime<=5000 "
      break
      case "4":
        timeSql = " and loadTime>0 and loadTime<=1000 "
      break
    }
    const sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i') AS minutes, COUNT(id) AS count " +
                "FROM " + tableName + " " +
                "WHERE createdAt>'" + start + "' and createdAt<'" + end + "' and webMonitorId='" + webMonitorId + "' and simpleHttpUrl='" + simpleHttpUrl + "' " + timeSql + " and DATE_FORMAT('" + end + "' - INTERVAL 60 MINUTE, '%Y-%m-%d %T') <= createdAt " +
                "GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const VideosInfo = Sequelize.import('../schema/videosInfo');
VideosInfo.sync({force: false});


class VideosInfoModel {
  /**
   * 创建Videos信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createVideos(data) {
    return await VideosInfo.create({
      ...data
    })
  }

  /**
   * 更新Videos数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateVideos(id, data) {
    await VideosInfo.update({
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
   * 获取Videos列表
   * @returns {Promise<*>}
   */
  static async getVideosList() {
    return await VideosInfo.findAndCountAll()
  }

  /**
   * 获取Videos详情数据
   * @param id  Videos的ID
   * @returns {Promise<Model>}
   */
  static async getVideosDetail(id) {
    return await VideosInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除Videos
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteVideos(id) {
    await VideosInfo.destroy({
      where: {
        id,
      }
    })
    return true
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

const HttpErrorInfo = Sequelize.import('../schema/HttpErrorInfo');
HttpErrorInfo.sync({force: false});


class HttpErrorInfoModel {
  /**
   * 创建HttpErrorInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createHttpErrorInfo(data) {
    return await HttpErrorInfo.create({
      ...data
    })
  }

  /**
   * 更新HttpErrorInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateHttpErrorInfo(id, data) {
    await HttpErrorInfo.update({
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
   * 获取HttpErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getHttpErrorInfoList() {
    return await HttpErrorInfo.findAndCountAll()
  }

  /**
   * 获取HttpErrorInfo详情数据
   * @param id  HttpErrorInfo的ID
   * @returns {Promise<Model>}
   */
  static async getHttpErrorInfoDetail(id) {
    return await HttpErrorInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除HttpErrorInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteHttpErrorInfo(id) {
    await HttpErrorInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }


  /**
   * 获取当前用户所有的请求记录
   * @returns {Promise<*>}
   */
  static async getHttpErrorsByUser(webMonitorIdSql, customerKeySql, happenTimeSql, param) {
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("HttpErrorInfo", timeScope) + " where " + customerKeySql + " and " + happenTimeSql + " and " + webMonitorIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getHttpErrorInfoListByHour(param) {
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000
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
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000
    const endTime = startTime + 23 * 3600 * 1000
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
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType)
    const sql = "select simpleHttpUrl, COUNT(simpleHttpUrl) as count from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + " GROUP BY simpleHttpUrl order by count desc limit 20"
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
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType)
    // const queryStr = CommonSql.createTimeScopeSql(timeType)
    return await Sequelize.query("select createdAt, happenTime from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + " and  simpleHttpUrl= '" + simpleHttpUrl + "' ORDER BY happenTime desc limit 1", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 分类接口状态
   * @param httpUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getStatusCountBySimpleHttpUrl(simpleHttpUrl, param) {
    const { timeType } = param
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType)
    // const queryStr = CommonSql.createTimeScopeSql(timeType)
    const sql = "select `status`, count(`status`) as count from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + " and  simpleHttpUrl= '" + simpleHttpUrl + "' GROUP BY `status`"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * @param simpleHttpUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getCustomerCountForHttpUrl(simpleHttpUrl, param) {
    const { timeType } = param
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType)
    // const queryStr = CommonSql.createTimeScopeSql(timeType)
    const sql = "select count(distinct customerKey) as count from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + " and  simpleHttpUrl= '" + simpleHttpUrl + "' GROUP BY `status`"
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
    const tableName = CommonSql.setTableName("HttpErrorInfo", timeType)
    const sql = "select * from " + tableName + " where webMonitorId='" + param.webMonitorId + "' and  simpleHttpUrl='" + simpleHttpUrl + "' limit 200"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  //=====================结算结果代码======================//
   /**
   * 计算某一小时接口错误量
   */
  static async calculateHttpErrorCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = Utils.setTableName("HttpErrorInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("HttpErrorInfo", 1)
    }
    let sql = "select count(id) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一天接口错误量
   */
  static async calculateHttpErrorCountByDay(webMonitorId, useDay) {
    let sql = "select count(id) as count from " + "HttpErrorInfo" + useDay.replace(/-/g, "") + " WHERE  webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一天接口错误量影响的用户量
   */
  static async getHttpErrorUserCountToday(webMonitorId, day) {
    const tableName = CommonSql.setTableName("HttpErrorInfo", day)
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE  webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  
}

const ResourceLoadInfo = Sequelize.import('../schema/resourceLoadInfo');
ResourceLoadInfo.sync({force: false});


class ResourceLoadInfoModel {
  /**
   * 创建ResourceLoadInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createResourceLoadInfo(data) {
    return await ResourceLoadInfo.create({
      ...data
    })
  }

  /**
   * 更新ResourceLoadInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateResourceLoadInfo(id, data) {
    await ResourceLoadInfo.update({
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
   * 获取ResourceLoadInfo列表
   * @returns {Promise<*>}
   */
  static async getResourceLoadInfoList() {
    return await ResourceLoadInfo.findAndCountAll()
  }

  /**
   * 获取ResourceLoadInfo详情数据
   * @param id  ResourceLoadInfo的ID
   * @returns {Promise<Model>}
   */
  static async getResourceLoadInfoDetail(id) {
    return await ResourceLoadInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除ResourceLoadInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteResourceLoadInfo(id) {
    await ResourceLoadInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取当前用户所有的日志加载失败记录
   * @returns {Promise<*>}
   */
  static async getResourceLoadInfoByUserId(webMonitorIdSql, customerKeySql, happenTimeSql, param) {
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("ResourceLoadInfo", timeScope) + " where " + happenTimeSql + "and" + customerKeySql + " and " + webMonitorIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的日志加载失败记录
   * @returns {Promise<*>}
   */
  static async getResourceLoadInfoListByDay(param) {
    const { simpleUrl, timeType } = param
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const tableName = CommonSql.setTableName("ResourceLoadInfo", timeType)
    const sql = "select sourceUrl, COUNT(sourceUrl) as count from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + queryStr + " GROUP BY sourceUrl order by count desc limit 20"
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
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const tableName = CommonSql.setTableName("ResourceLoadInfo", timeType)
    return await Sequelize.query("select createdAt, happenTime from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + queryStr + " and  sourceUrl= '" + sourceUrl + "' ORDER BY happenTime desc limit 1", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 影响多少页面
   * @param sourceUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getPageCountByResourceError(sourceUrl, param) {
    const { simpleUrl, timeType } = param
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const tableName = CommonSql.setTableName("ResourceLoadInfo", timeType)
    return await Sequelize.query("SELECT count(DISTINCT simpleUrl) as pageCount from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + queryStr + " and sourceUrl='" + sourceUrl + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 影响了多少用户
   * @param sourceUrl
   * @param param
   * @returns {Promise<*>}
   */
  static async getCustomerCountByResourceError(sourceUrl, param) {
    const { simpleUrl, timeType } = param
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const tableName = CommonSql.setTableName("ResourceLoadInfo", timeType)
    return await Sequelize.query("SELECT count(DISTINCT (customerKey)) as customerCount from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + queryStr + " and sourceUrl='" + sourceUrl + "'", { type: Sequelize.QueryTypes.SELECT})
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
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000
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
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000
    const endTime = startTime + 23 * 3600 * 1000
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
    let tableName = Utils.setTableName("ResourceLoadInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("ResourceLoadInfo", 1)
    }
    let sql = "select count(id) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天静态资源加载错误量
   */
  static async calculateResourceErrorCountByDay(webMonitorId, useDay) {
    let sql = "select count(id) as count from " + "ResourceLoadInfo" + useDay.replace(/-/g, "") + " WHERE  webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一天静态资源加载错误量影响用户数量
   */
  static async getResourceErrorUserCountToday(webMonitorId, day) {
    const tableName = CommonSql.setTableName("ResourceLoadInfo", day)
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE  webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const JavascriptErrorInfo = Sequelize.import('../schema/javascriptErrorInfo');
JavascriptErrorInfo.sync({force: false});



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
    return await JavascriptErrorInfo.create({
      ...data
    })
  }

  /**
   * 更新JavascriptErrorInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateJavascriptErrorInfo(id, data) {
    await JavascriptErrorInfo.update({
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
  static async getJavascriptErrorInfoList() {
    return await JavascriptErrorInfo.findAndCountAll()
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
    const tableName = Utils.setTableName("JavascriptErrorInfo")
    let sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i') AS minutes, COUNT(id) AS count FROM " + tableName + " " +
      "WHERE createdAt>'" + start + "' and createdAt<'" + end + "' and webMonitorId='" + param.webMonitorId + "' and infoType='" + param.infoType + "' and errorMessage like '%" + param.errorMessage + "%' and DATE_FORMAT('" + end + "' - INTERVAL 60 MINUTE, '%Y-%m-%d %T') <= createdAt GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内，每小时的错误量
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorCountListByHour(param) {
    const tableName = Utils.setTableName("JavascriptErrorInfo")
    const sql = "SELECT DATE_FORMAT(createdAt,'%m-%d %H') AS hour, COUNT(id) AS count " +
                "FROM " + tableName + " " +
                "WHERE webMonitorId='" + param.webMonitorId + "' and infoType='" + param.infoType + "' and errorMessage like '%" + param.errorMessage + "%' and DATE_FORMAT(NOW() - INTERVAL 23 HOUR, '%Y-%m-%d %H') <= createdAt " +
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
    const { simpleUrl, timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const sql = "select errorMessage, count(errorMessage) as count from " + tableName + " where webMonitorId='" + param.webMonitorId + "' and infoType='on_error' " + queryStr + " GROUP BY errorMessage order by count desc limit 10"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取自定义错误列表
   * @returns {Promise<*>}
   */
  static async getConsoleErrorSort(param) {
    const { simpleUrl, timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    // const queryStr = queryStr1 + CommonSql.createTimeScopeSql(timeType)
    const sql = "select errorMessage, count(errorMessage) as count from " + tableName + " where webMonitorId='" + param.webMonitorId + "' and infoType='console_error' " + queryStr + " GROUP BY errorMessage order by count desc limit 10"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMessage查询这一类错误的数量
   * @returns {Promise<*>}
   */
  static async getPerJavascriptConsoleErrorCount(tempErrorMsg, param) {
    const { simpleUrl, timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const queryStr1 = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const queryStr = queryStr1 + CommonSql.createTimeScopeSql(timeType)
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("SELECT count(id) as count from " + tableName + " where webMonitorId='" + param.webMonitorId + "' and infoType='console_error' " + queryStr + " and errorMessage = '" + errorMsg + "' order by count desc", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMessage查询这一类错误不同平台的数量
   * @returns {Promise<*>}
   */
  static async getPerJavascriptErrorCountByOs(tempErrorMsg, param) {
    const { simpleUrl, timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("SELECT tab.os as os, count(tab.os) as count from (select SUBSTRING(os,1,3) as os from " + tableName + " where  webMonitorId='" + param.webMonitorId + "'  and infoType='on_error'" + queryStr + " and errorMessage like '%" + errorMsg + "%') as tab GROUP BY os order by count desc", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据errorMessage查询这一类错误不同平台的数量
   * @returns {Promise<*>}
   */
  static async getAllJavascriptErrorCountByOs(tempErrorMsg, param) {
    const { simpleUrl, timeType } = param
    const queryStr1 = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const queryStr = queryStr1
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    return await Sequelize.query("SELECT tab.os as os, count(tab.os) as count from (select SUBSTRING(os,1,3) as os from " + tableName + " where  webMonitorId='" + param.webMonitorId + "'  and infoType='on_error'" + queryStr + " and errorMessage like '%" + errorMsg + "%') as tab GROUP BY os order by count desc", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 查询分类js错误的数量
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorCountByType( param ) {
    const { timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const sql = "select infoType, count(infoType) as count from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + " GROUP BY infoType"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMessage查询这一类错误最近发生的时间
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorLatestTime(tempErrorMsg, param) {
    const { simpleUrl, timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const queryStr = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("select createdAt, happenTime from " + tableName + " where webMonitorId='" + param.webMonitorId + "' " + queryStr +  " and  errorMessage like '%" + errorMsg + "%' ORDER BY createdAt desc limit 1", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取JavascriptErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorCountByHour(param) {
    let hour = new Date().getHours()
    new Date().Format("yyyy-MM-dd") + " " + hour + ":00:00"
    return await Sequelize.query("select DATE_FORMAT(createdAt,'%Y-%m-%d') as day, count(id) as count from JavascriptErrorInfo WHERE webMonitorId='" + param.webMonitorId + "' and  DATE_SUB(CURDATE(),INTERVAL 30 DAY) <= createdAt GROUP BY day", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMsg 查询js错误列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorListByMsg(tempErrorMsg, param) {
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    const { timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    return await Sequelize.query("select * from " + tableName + " where webMonitorId='" + param.webMonitorId + "' and  errorMessage like '%" + errorMsg + "%' order by happenTime desc limit 100", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMsg查询Js错误影响的用户数量
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorAffectCount(tempErrorMsg, param) {
    const { timeType } = param
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("select count(DISTINCT customerKey) as count from " + tableName + " where  webMonitorId='" + param.webMonitorId + "' " + " and errorMessage like '%" + errorMsg + "%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据errorMsg、customerKey 查询Js错误发生的次数
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorOccurCountByCustomerKey(tempErrorMsg, data) {
    const { webMonitorId, customerKey, timeType } = data
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", timeType)
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("select count(*) as count from " + tableName + " where webMonitorId='" + webMonitorId + "' and  errorMessage like '%" + errorMsg + "%' and customerKey='" + customerKey + "'", { type: Sequelize.QueryTypes.SELECT})
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
    let tempJsPath = ""
    let tempJsMapPath = ""
    let tempCodeArray = []
    const result = []
    // TODO: 本来这里是要用param.length 取出所有的js代码，但是正常情况下，只用到第一个，所以默认只取出第一个
    for (var i = 0; i < param.length; i ++) {
      const { jsPathStr, jsPath, locationX, locationY } = param[i]
      await fetch(jsPath)
        .then(res => res.text())
        .then( async (body) => {
          let arr = body.split("\n")
          let codeStr = arr[locationX - 1]
          const start = parseInt(locationY) - 50
          const end = parseInt(locationY) + 50
          const codeStart = encodeURIComponent(codeStr.substring(start, locationY - 1))
          const codeEnd = encodeURIComponent(codeStr.substring(locationY - 1, end))
          let code = ""
          if (codeStart.length === 0 && codeEnd.length === 0) {
            code = " 抱歉，未能获取到静态资源，无法定位代码位置 ：）"
          } else {
            code = codeStart + "【错误位置：】" + codeEnd
          }
          let sourceCode = []
          await JavascriptErrorInfoModel.handleSourceMap(jsPath, locationX, locationY, sourceCode)
          result.push({jsPathStr, jsPath, locationX, locationY, code, sourceCode})
        }).catch((e) => {
          result.push({jsPathStr, jsPath, locationX, locationY, code: " 抱歉，未能获取到静态资源，无法定位代码位置 ：）", sourceCode: []})
        });
    }
    return result
  }
  static async handleSourceMap(url, line, column, sourceCode) {
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

    const sourcePath = url + ".map"
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
          // 压缩前的所有源文件列表
          var sources = consumer.sources;
          // 根据查到的source，到源文件列表中查找索引位置
          var smIndex = sources.indexOf(sm.source);
          // 到源码列表中查到源代码
          var smContent = consumer.sourcesContent[smIndex];
          // 将源代码串按"行结束标记"拆分为数组形式
          const rawLines = smContent.split(/\r?\n/g);
          // 输出源码行，因为数组索引从0开始，故行数需要-1
          sourceCode.push(rawLines[sm.line - 3])
          sourceCode.push(rawLines[sm.line - 2])
          sourceCode.push(rawLines[sm.line - 1])
        }).catch((e) => {
          console.log(e)
        });
  }
  /**
   * 获取JavascriptErrorInfo详情数据
   * @param id  JavascriptErrorInfo的ID
   * @returns {Promise<Model>}
   */
  static async getJavascriptErrorInfoDetail(id) {
    return await JavascriptErrorInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除JavascriptErrorInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteJavascriptErrorInfo(id) {
    await JavascriptErrorInfo.destroy({
      where: {
        id,
      }
    })
    return true
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
  static async getBehaviorsByUser(webMonitorIdSql, customerKeySql, happenTimeSql, param) {
    // var phoneReg = /^1\d{10}$/
    // var sql = ""
    // if (phoneReg.test(param.searchValue)) {
    //   sql = "select * from JavascriptErrorInfo where webMonitorId='" + param.webMonitorId + "' and firstUserParam='" + param.searchValue + "'"
    // } else {
    //   sql = "select * from JavascriptErrorInfo where webMonitorId='" + param.webMonitorId + "' and userId='" + param.searchValue + "'"
    // }
    // return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("JavascriptErrorInfo", timeScope) + " where " + customerKeySql + " and " + happenTimeSql + " and " + webMonitorIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取24小时内每小时错误量
   */
  static async getErrorCountByHour(param) {
    const nowTime = new Date().getTime()
    const startTime = nowTime - 23 * 3600 * 1000
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
    const nowTime = new Date().getTime()
    const startTime = nowTime - 8 * 24 * 3600 * 1000 + 3600 * 1000
    const endTime = startTime + 23 * 3600 * 1000
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
    let tableName = Utils.setTableName("JavascriptErrorInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("JavascriptErrorInfo", 1)
    }
    let sql = "select count(id) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "' AND infoType='on_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一小时console_error的量
   */
  static async calculateConsoleErrorCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = Utils.setTableName("JavascriptErrorInfo")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("JavascriptErrorInfo", 1)
    }
    let sql = "select count(id) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "' AND infoType='console_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天on_error的量
   */
  static async calculateJsErrorCountByDay(webMonitorId, useDay) {
    let sql = "select count(id) as count from " + "JavascriptErrorInfo" + useDay.replace(/-/g, "") + " WHERE webMonitorId = '" + webMonitorId + "' AND infoType='on_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天console_error的量
   */
  static async calculateConsoleErrorCountByDay(webMonitorId, useDay) {
    let sql = "select count(id) as count from " + "JavascriptErrorInfo" + useDay.replace(/-/g, "") + " WHERE webMonitorId = '" + webMonitorId + "' AND infoType='console_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天on_error影响的用户数量
   */
  static async getJsErrorUserCountToday(webMonitorId, day) {
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", day)
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE webMonitorId = '" + webMonitorId + "' AND infoType='on_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 计算某一天console_error的量
   */
  static async getConsoleErrorUserCountToday(webMonitorId, day) {
    const tableName = CommonSql.setTableName("JavascriptErrorInfo", day)
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE webMonitorId = '" + webMonitorId + "' AND infoType='console_error'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

const CustomerPV = Sequelize.import('../schema/customerPV');
CustomerPV.sync({force: false});


class CustomerPVModel {
  /**
   * 创建CustomerPV信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createCustomerPV(data) {
    return await CustomerPV.create({
      ...data
    })
  }

  /**
   * 更新CustomerPV数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateCustomerPV(id, data) {
    await CustomerPV.update({
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
   * 获取CustomerPV列表
   * @returns {Promise<*>}
   */
  static async getCustomerPVList() {
    return await CustomerPV.findAndCountAll()
  }

  /**
   * 获取CustomerPV详情数据
   * @param id  CustomerPV的ID
   * @returns {Promise<Model>}
   */
  static async getCustomerPVDetail(id) {
    return await CustomerPV.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除CustomerPV
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteCustomerPV(id) {
    await CustomerPV.destroy({
      where: {
        id,
      }
    })
    return true
  }
  /**
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteCustomerPVsFifteenDaysAgo(days) {
    const timeScope = Utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from " + Utils.setTableName("CustomerPV") + " where createdAt<'" + timeScope + "'";
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  }

  /**
   * 根据参数获取当天的pv数量
   */
  static async getPVCountForDay(param, day) {
    let sql = "select count(id) as count from " + CommonSql.setTableName("CustomerPV", day) + " where webMonitorId='" + param.webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据参数获取当天的uv数量
   */
  static async getUVCountForDay(param, day) {
    let sql = "select count(distinct customerKey) as count from " + CommonSql.setTableName("CustomerPV", day) + " where webMonitorId='" + param.webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据参数获取当天的IP数量
   */
  static async getIpCountForDay(param, day) {
    let sql = "select count(distinct monitorIp) as count from " + CommonSql.setTableName("CustomerPV", day) + " where webMonitorId='" + param.webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  

  /**
   * 获取PC错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvPcCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM " + Utils.setTableName("CustomerPV") + " WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'web%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取IOS错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvIosCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM " + Utils.setTableName("CustomerPV") + " WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'ios%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取Android错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvAndroidCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM " + Utils.setTableName("CustomerPV") + " WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'android%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser(webMonitorIdSql, customerKeySql, happenTimeSql, param) {
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("CustomerPV", timeScope) + " where " + happenTimeSql + " and " + customerKeySql + " and " + webMonitorIdSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据userId获取到所有的customerKey
   * @returns {Promise<*>}
   */
  static async getCustomerKeyByUserId(param) {

    const resArray = []
    for (let i = 0; i < 15; i ++) {
      let tableName = CommonSql.setTableName("CustomerPV", i)
      let sql = "select DISTINCT(customerKey) from " + tableName + " where userId='" + param.userId + "'"
      try {
        let res = await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
        let resObj = {customerKey: res[0].customerKey}
        resArray.push(resObj)
      } catch(e) {
        console.warn("\x1B[33m%s\x1b[0m", "运行时间不足15天，" + tableName + " 这个表可能不存在，并不影响查询结果！")
      }
    }
    return resArray


    // let sql = ""
    // for (let i = 0; i < 7; i ++) {
    //   if (i < 6) {
    //     sql +=
    //     "select DISTINCT(customerKey) from " + CommonSql.setTableName("CustomerPV", i) + " where userId='" + param.userId + "'"
    //     + " UNION "
    //   } else {
    //     sql += "select DISTINCT(customerKey) from " + CommonSql.setTableName("CustomerPV", i) + " where userId='" + param.userId + "'"
    //   }
    // }
    // return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据customerKey 获取用户详情
   */
  static async getCustomerPVDetailByCustomerKey(webMonitorIdSql, customerKeySql, happenTimeSql, param) {
    const { timeScope } = param
    let sql = "select * from " + CommonSql.setTableName("CustomerPV", timeScope) + " where " + happenTimeSql + "and" + customerKeySql + " and " + webMonitorIdSql + " limit 1"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据customerKey获取用户访问每个页面的次数
   */
  static async getPVsByCustomerKey(webMonitorIdSql, customerKeySql, happenTimeSql) {
    let sql = "select CAST(simpleUrl AS char) as simpleUrl, count(simpleUrl) from " + Utils.setTableName("CustomerPV") + " where " + happenTimeSql + "and" + customerKeySql + " and " + webMonitorIdSql + " GROUP BY simpleUrl "
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
    let sql = "SELECT province as name, count(distinct customerKey) as value from " + Utils.setTableName("CustomerPV") + " where webMonitorId='" + param.webMonitorId + "' and createdAt>'" + searchTime + "' GROUP BY province"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 查询10s内的PV数据
   */
  static async getPvsInfoByTenSeconds(param) {
    const nowTime = new Date().getTime()
    const searchTime = new Date(nowTime - 10 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    let sql = "SELECT customerKey, province, city, newStatus, happenTime, simpleUrl, monitorIp from " + Utils.setTableName("CustomerPV") + " where webMonitorId='" + param.webMonitorId + "' and createdAt>'" + searchTime + "'"
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
    let sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i') AS minutes, COUNT(pageKey) AS count FROM " + Utils.setTableName("CustomerPV") + " " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 30 MINUTE, '%Y-%m-%d %T') <= createdAt GROUP BY minutes"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 每分钟的uv量
   */
  static async getUvCountByMinute(param) {
    let sql = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i') AS minutes, COUNT(DISTINCT customerKey) AS count FROM " + Utils.setTableName("CustomerPV") + " " +
      "WHERE webMonitorId='" + param.webMonitorId + "' and DATE_FORMAT(NOW() - INTERVAL 30 MINUTE, '%Y-%m-%d %T') <= createdAt GROUP BY minutes"
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
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='pv' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
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
    let sql = "SELECT distinct hourName as hour, hourCount as count from InfoCountByHour where webMonitorId='" + param.webMonitorId + "' and uploadType='pv' and hourName>='" + startHour + "' and hourName<='" + endHour + "' order by hourName"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取今天新客户数量
   */
  static async getNewCustomerCountByToday(param) {
    let sql = "SELECT  count(distinct customerKey) as count from " + Utils.setTableName("CustomerPV") + " where webMonitorId='" + param.webMonitorId + "' and newStatus='new' "
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
    const timeScope = new Date(new Date().getTime() - 6 * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    const sql = "SELECT projectVersion, count(distinct customerKey) as count from " + Utils.setTableName("CustomerPV") + " WHERE createdAt>='" + timeScope + "' and  webMonitorId='" + param.webMonitorId + "' GROUP BY projectVersion order by count desc limit 10"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取城市top10数量列表
   */
  static async getCityCountOrderByCount(param) {
    // const timeScope = Utils.addDays(0) + " 00:00:00";
    const timeScope = new Date(new Date().getTime() - 1 * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    const sql = "SELECT city, count(DISTINCT customerKey) as count from " + Utils.setTableName("CustomerPV") + " WHERE createdAt>='" + timeScope + "' and  webMonitorId='" + param.webMonitorId + "' GROUP BY city order by count desc limit 10"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取设备top10数量列表
   */
  static async getDeviceCountOrderByCount(param) {
    const timeScope = new Date(new Date().getTime() - 1 * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    const sql = "SELECT deviceName, count(DISTINCT customerKey) as count from " + Utils.setTableName("CustomerPV") + " WHERE createdAt>='" + timeScope + "' and  webMonitorId='" + param.webMonitorId + "' GROUP BY deviceName order by count desc limit 10"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getPvListByPage(param) {
    let {startTime, endTime, webMonitorId, page, ipAddress} = param
    startTime = new Date(startTime).Format("yyyy-MM-dd hh:mm:ss")
    endTime = new Date(endTime).Format("yyyy-MM-dd hh:mm:ss")
    const ipAddressStr = ipAddress ? " and monitorIp='" + ipAddress + "' " : ""
    // startTime = startTime + 8 * 60 * 60 * 1000
    // endTime = endTime + 8 * 60 * 60 * 1000
    // console.log(new Date(startTime), new Date(endTime))
    // const sql = "SELECT deviceName, count(DISTINCT customerKey) as count from CustomerPV WHERE createdAt>='" + timeScope + "' and webMonitorId='" + param.webMonitorId + "' GROUP BY deviceName order by count desc limit 10"
    const sql = `select customerKey, simpleUrl, deviceName, monitorIp, happenTime from ${Utils.setTableName("CustomerPV")} where webMonitorId='${webMonitorId}' and createdAt>='${startTime}' and createdAt<='${endTime}' ${ipAddressStr}`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getSevenDaysLeftCount(param) {
    const day = parseInt(param.day, 10)
    const sevenDay = Utils.addDays(1 - day)
    let sql = ""
    for (let i = day - 1; i > 0; i --) {
      const currentDay = Utils.addDays(0 - i)
      const currentDayStr = currentDay.replace(/-/g, "")
      const tableName = "CustomerPV" + currentDayStr
      if (i > 1) {
        sql +=
        "select count(DISTINCT customerKey) as count from " + tableName + " WHERE webMonitorId='" + param.webMonitorId + "' and customerKeyCreatedDate='" + sevenDay + "' "
        + " UNION "
      } else {
        sql += "select count(DISTINCT customerKey) as count from " + tableName + " WHERE webMonitorId='" + param.webMonitorId + "' and customerKeyCreatedDate='" + sevenDay + "' "
      }
    }
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
   * 计算某一小时的PvCount量
   */
  static async calculatePvCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = Utils.setTableName("CustomerPV")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1)
    }
    let sql = "select count(id) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算某一小时的新用户量
   */
  static async calculateNewCustomerCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = Utils.setTableName("CustomerPV")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1)
    }
    let sql = "select count(distinct customerKey) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "' and newStatus='new'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 计算应用的平均安装频次
   */
  static async calculateInstallCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = Utils.setTableName("CustomerPV")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1)
    }
    let sql_cus = "select count(distinct customerKey) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "'"
    const customerKeyInfo = await Sequelize.query(sql_cus, { type: Sequelize.QueryTypes.SELECT})
    let sql_user = "select count(distinct userId) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "'"
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
   * 计算某一小时的UvCount量
   */
  static async calculateUvCountByHour(webMonitorId, lastHour, hour) {
    const dateStr = Utils.addDays(-1)
    let tableName = Utils.setTableName("CustomerPV")
    if (lastHour === dateStr + " 23:00:00") {
      tableName = CommonSql.setTableName("CustomerPV", 1)
    }
    let sql = "select count(DISTINCT(customerKey)) as count from " + tableName + " WHERE createdAt>='" + lastHour + "' AND createdAt<'" + hour + "'  AND webMonitorId = '" + webMonitorId + "'"
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
module.exports = {BehaviorInfoModel,ScreenShotInfoModel,CommonModel,EmailCodeModel,DailyActivityModel,ExtendBehaviorInfoModel,IgnoreErrorModel,InfoCountByDayModel,InfoCountByHourModel,ProjectModel,LoadPageInfoModel,PurchaseCodeModel,UserModel,HttpLogInfoModel,VideosInfoModel,HttpErrorInfoModel,ResourceLoadInfoModel,JavascriptErrorInfoModel,CustomerPVModel}