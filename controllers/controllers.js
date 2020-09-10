const db = require('../config/db');
                                        const Sequelize = db.sequelize;
                                        const domain = require("../bin/domain");
                                        const Utils = require('../util/utils');
                                        const utils = require('../util/utils');
                                        const searcher = require('node-ip2region').create();
                                        const log = require("../config/log");
                                        const statusCode = require('../util/status-code');
                                        const { handleResultWhenJavascriptError, handleResultWhenHttpRequest, handleResultWhenResourceError } = require('../interceptor');
                                        const { UPLOAD_TYPE } = require('../config/consts');
                                        const { PROJECT_INFO } = require("../config/consts")
                                        const fetch = require('node-fetch');
                                        const jwt = require('jsonwebtoken')
                                        const secret = require('../config/secret')
                                        const { USER_INFO } = require('../config/consts')
                                        const fs = require('fs');
                                        const IP = require('ip')
                                        const citys = require("../config/city");
                                        const provinces = require("../config/province");
                                        const callFile = require('child_process');
                                        const nodemailer = require('nodemailer');
                                        const formidable = require("formidable");
                                        const AccountConfig = require('../config/AccountConfig');
                                        const monitorKeys = require("../config/monitorKeys");
                                        const stopWebMonitorIdList = require("../bin/stopWebMonitorIdList");
                                        const RabbitMq = require('../lib/RabbitMQ')
                                        const { spawn, exec, execFile } = require('child_process');
                                        const { accountInfo } = AccountConfig
                                        const sendMq = accountInfo.messageQueue === true ? new RabbitMq() : null
                                        
const {CustomerPvLeaveModel,CustomerStayTimeModel,ScreenShotInfoModel,BehaviorInfoModel,DeviceInfoCountByHourModel,DeviceInfoCountByDayModel,ExtendBehaviorInfoModel,CommonModel,FunnelModel,IgnoreErrorModel,InfoCountByDayModel,InfoCountByHourModel,LocationPointTypeModel,LocationPointModel,ProjectModel,LocationPointGroupModel,UserModel,VideosInfoModel,HttpLogInfoModel,HttpErrorInfoModel,LoadPageInfoModel,ResourceLoadInfoModel,JavascriptErrorInfoModel,CustomerPVModel,} = require('../modules/models.js');
class HttpErrorInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.happenTime) {
      let ret = await HttpErrorInfoModel.createHttpErrorInfo(data);
      let res = await HttpErrorInfoModel.getHttpErrorInfoDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getHttpErrorInfoList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await HttpErrorInfoModel.getHttpErrorInfoList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await HttpErrorInfoModel.getHttpErrorInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await HttpErrorInfoModel.deleteHttpErrorInfo(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await HttpErrorInfoModel.updateHttpErrorInfo(id, req);
      let data = await HttpErrorInfoModel.getHttpErrorInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }


  /**
   * 根据时间获取一天内http请求错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getHttpErrorInfoListByHour(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.HTTP_ERROR
    let result1 = []
    await HttpErrorInfoModel.getHttpErrorInfoListByHour(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await HttpErrorInfoModel.getHttpErrorInfoListSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }


  /**
   * 获取每天接口请求错误数量列表
   * @returns {Promise.<void>}
   */
  static async getHttpErrorCountByDay(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.HTTP_ERROR
    await HttpErrorInfoModel.getHttpErrorCountByDay(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', Utils.handleDateResult(data))
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }

  /**
   * 获取每天接口请求错误列表
   * @returns {Promise.<void>}
   */
  static async getHttpErrorListByDay(ctx) {

    const param = JSON.parse(ctx.request.body)
    let httpErrorSortList = null
    await HttpErrorInfoModel.getHttpErrorInfoListByDay(param).then(data => {
      httpErrorSortList = data
    })
    for (let i = 0; i < httpErrorSortList.length; i ++) {
      if (httpErrorSortList[i].count === 0) continue
      // 查询最近发生时间
      await HttpErrorInfoModel.getHttpErrorLatestTime(httpErrorSortList[i].simpleHttpUrl, param).then(data => {
        if (!data[0]) return
        httpErrorSortList[i].createdAt = data[0].createdAt
        httpErrorSortList[i].happenTime = data[0].happenTime
      })
      // 查询不同状态的次数
      await HttpErrorInfoModel.getStatusCountBySimpleHttpUrl(httpErrorSortList[i].simpleHttpUrl, param).then(data => {
        if (!data) return
        httpErrorSortList[i].statusArray = data
      })
      // 查询影响用户数量
      await HttpErrorInfoModel.getCustomerCountForHttpUrl(httpErrorSortList[i].simpleHttpUrl, param).then(data => {
        if (!data[0]) return
        httpErrorSortList[i].customerCount = data[0].count
      })
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', httpErrorSortList)
  }

  static async getHttpErrorListByUrl(ctx) {
    const param = JSON.parse(ctx.request.body)
    let httpErrorList = []
    // 查询影响用户数量
    await HttpErrorInfoModel.getHttpErrorListByUrl(param).then(data => {
      httpErrorList = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', httpErrorList)
  }
}

class CustomerStayTimeController {
  static async getStayTimeForEveryDay(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    let data = null
    try {
      data = await CustomerStayTimeModel.getStayTimeForEveryDay(params);
    } catch(e) {
      log.printError("停留时间查询失败：", e)
      data = [ 
        { date: 'day1', count: '0' },
        { date: 'day2', count: '0' },
        { date: 'day3', count: '0' },
        { date: 'day4', count: '0' },
        { date: 'day5', count: '0' },
        { date: 'day6', count: '0' },
        { date: 'day7', count: '0' }
      ]
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }
}

class ScreenShotInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.happenTime) {
      let ret = await ScreenShotInfoModel.createScreenShotInfo(data);
      let res = await ScreenShotInfoModel.getScreenShotInfoDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getScreenShotInfoList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await ScreenShotInfoModel.getScreenShotInfoList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getScreenShotInfoListByPage(ctx) {
    let req = ctx.request

    if (req) {
      const data = await ScreenShotInfoModel.getScreenShotInfoListByPage();
      data.forEach((item) => {
        item.screenInfo = item.screenInfo.toString()
      })
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }

  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await ScreenShotInfoModel.getScreenShotInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await ScreenShotInfoModel.deleteScreenShotInfo(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await ScreenShotInfoModel.updateScreenShotInfo(id, req);
      let data = await ScreenShotInfoModel.getScreenShotInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
}

class CustomerPvLeaveController {
  static async getStayTimeForEveryDay(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    let data = null
    try {
      data = await CustomerPvLeaveModel.getStayTimeForEveryDay(params);
    } catch(e) {
      log.printError("停留时间查询失败：", e)
      data = [ 
        { date: 'day1', count: '0' },
        { date: 'day2', count: '0' },
        { date: 'day3', count: '0' },
        { date: 'day4', count: '0' },
        { date: 'day5', count: '0' },
        { date: 'day6', count: '0' },
        { date: 'day7', count: '0' }
      ]
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  /**
   * 获取24小时内每小时新用户量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getCusLeavePercentByHour(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await CustomerPvLeaveModel.getCusLeavePercentByTime(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await CustomerPvLeaveModel.getCusLeavePercentSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    // let total = 0
    // await CustomerPVModel.getNewCustomerCountByToday(param).then(data => {
    //   total = data[0].count;
    // })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }
}

class BehaviorInfoController {
}


class AlarmController {
    static async getCheckTime(ctx) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', checkTime)
    }
    static async changeCheckTime(ctx) {
        let req = ctx.request.body
        const param = JSON.parse(req)
        const { waitCheckTime } = param
        const newString = `/**
        * 检查频率配置
        */
        module.exports = {
           checkTime: ${waitCheckTime}      // 单位：分钟
        }`
        await fs.writeFile("./interceptor/config/checkTime.js", newString, (err) => {
            if (err) {
                throw err;
            }
            console.log("警报检查频率修改成功，当前检查频率为：次/" + waitCheckTime + "分钟");
            console.log("即将重启服务以生效...");
            Common.restartServer()
        });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async getJsErrorConfig(ctx) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', {jsErrorCount: jsError.errorCount, jsErrorPercent: jsError.errorPercent})
    }
    static async changeCheckTime(ctx) {
        let req = ctx.request.body
        const param = JSON.parse(req)
        const { waitCheckTime } = param
        const newString = `/**
        * JS异常报警配置
        */
        module.exports = {
            errorCount: 100,
            errorPercent: 10  // 这里是百分比
        }`
        await fs.writeFile("./interceptor/config/checkTime.js", newString, (err) => {
            if (err) {
                throw err;
            }
            console.log("警报检查频率修改成功，当前检查频率为：次/" + waitCheckTime + "分钟");
            console.log("即将重启服务以生效...");
            Common.restartServer()
        });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
}


class ExtendBehaviorInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.userId) {
      let ret = await ExtendBehaviorInfoModel.createExtendBehaviorInfo(data);
      let res = await ExtendBehaviorInfoModel.getExtendBehaviorInfoDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getExtendBehaviorInfoList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await ExtendBehaviorInfoModel.getExtendBehaviorInfoList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await ExtendBehaviorInfoModel.getExtendBehaviorInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await ExtendBehaviorInfoModel.deleteExtendBehaviorInfo(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await ExtendBehaviorInfoModel.updateExtendBehaviorInfo(id, req);
      let data = await ExtendBehaviorInfoModel.getExtendBehaviorInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
}

class FunnelController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { funnelName, funnelIds } = param
    const data = {funnelName, funnelIds}
    /* 判断参数是否合法 */
    if (param.funnelName) {
      let ret = await FunnelModel.createFunnel(data);
      let res = await FunnelModel.getFunnelDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res || {})
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getFunnelList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await FunnelModel.getFunnelList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await FunnelModel.getFunnelDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let params = JSON.parse(ctx.request.body)
    let id = params.id;
  
    if (id && !isNaN(id)) {
      await FunnelModel.deleteFunnel(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await FunnelModel.updateFunnel(id, req);
      let data = await FunnelModel.getFunnelDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
}

class InfoCountByHourController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.happenTime) {
      let ret = await InfoCountByHourModel.createInfoCountByHour(data);
      let res = await InfoCountByHourModel.getInfoCountByHourDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getInfoCountByHourList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await InfoCountByHourModel.getInfoCountByHourList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await InfoCountByHourModel.getInfoCountByHourDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await InfoCountByHourModel.deleteInfoCountByHour(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await InfoCountByHourModel.updateInfoCountByHour(id, req);
      let data = await InfoCountByHourModel.getInfoCountByHourDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
}

class IgnoreErrorController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param)
    /* 判断参数是否合法 */
    if (data.ignoreErrorMessage && data.webMonitorId) {
      let ret = await IgnoreErrorModel.createIgnoreError(data);
      let res = await IgnoreErrorModel.getIgnoreErrorDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getIgnoreErrorList(ctx) {
    let req = ctx.request.body

    if (req) {
      const data = await IgnoreErrorModel.getIgnoreErrorList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }

  /**
   * 根据应用ID获取已经忽略的错误列表列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async ignoreErrorByApplication(ctx) {
    const param = utils.parseQs(ctx.request.url)
    if (param) {
      const data = await IgnoreErrorModel.ignoreErrorByApplication(param);

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }

  }

  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await IgnoreErrorModel.getIgnoreErrorDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await IgnoreErrorModel.deleteIgnoreError(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await IgnoreErrorModel.updateIgnoreError(id, req);
      let data = await IgnoreErrorModel.getIgnoreErrorDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
}

class FailController {
  static async getSysInfo(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {invalid: true})
  }
  static async createPurchaseCode(ctx) {
    const req = ctx.request.body
    const param = JSON.parse(req)
    const { inputPurchaseCode } = param
    const newString = `module.exports = {
      purchaseCode: '${inputPurchaseCode}',
    }`
    await fs.writeFile("./bin/purchaseCode.js", newString, (err) => {
      if (err) {
        throw err;
      }
      console.log("配置创建完成, 5秒后重启...");
      FailController.restartServer()
    });
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 0)
  }

  /**
   * 重启服务
   */
  static async restartServer() {

    switch (process.platform) {
      // windows系统下
      case "win32":
          spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['run', 'prd_restart'], { stdio: 'inherit' });
          break;
      case "darwin":  // 默认mac系统
      default:
          try {
              execFile('./restart.sh', [], null, function (err, stdout, stderr) {
                  console.log("服务已重启")
              });
          } catch(e) {
            console.log("服务重启失败，请手动重启")
          }
          break;
    }

  }
}

class LoadPageInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.happenTime) {
      let ret = await LoadPageInfoModel.createLoadPageInfo(data);
      let res = await LoadPageInfoModel.getLoadPageInfoDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getLoadPageInfoList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await LoadPageInfoModel.getLoadPageInfoList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await LoadPageInfoModel.getLoadPageInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await LoadPageInfoModel.deleteLoadPageInfo(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await LoadPageInfoModel.updateLoadPageInfo(id, req);
      let data = await LoadPageInfoModel.getLoadPageInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }

  /**
   * 根据时间获取每天的日活量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getPageLoadTimeByDate(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    if (req) {
      const data = await LoadPageInfoModel.getPageLoadTimeByDate(params);
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }

  /**
   * 根据页面加载时间分类
   * @returns {Promise<*>}
   */
  static async getPageCountForLoadTimeGroupByDay(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_A
    const result_a = await LoadPageInfoModel.getPageCountForLoadTimeGroupByDay(param)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_B
    const result_b = await LoadPageInfoModel.getPageCountForLoadTimeGroupByDay(param)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_C
    const result_c = await LoadPageInfoModel.getPageCountForLoadTimeGroupByDay(param)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_D
    const result_d = await LoadPageInfoModel.getPageCountForLoadTimeGroupByDay(param)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_E
    const result_e = await LoadPageInfoModel.getPageCountForLoadTimeGroupByDay(param)
    const result = {
      a: Utils.handleDateResult(result_a),
      b: Utils.handleDateResult(result_b),
      c: Utils.handleDateResult(result_c),
      d: Utils.handleDateResult(result_d),
      e: Utils.handleDateResult(result_e),
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
  }

  /**
   * 根据时间获取分类列表
   * @returns {Promise<*>}
   */
  static async getPageUrlListForLoadTime(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const pageUrlList = await LoadPageInfoModel.getPageUrlListForLoadTime(param)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', pageUrlList)
  }

  /**
   * 获取页面影响人数
   * @returns {Promise<*>}
   */
  static async getPageUrlUserCount(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const userResult = await LoadPageInfoModel.getPageUrlUserCountForLoadTime(param)
    const userCount = userResult.length ? userResult[0].count : 0
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', userCount)
  }

  /**
   * 获取每小时页面加载性能
   * @returns {Promise<*>}
   */
  static async getDifferentKindAvgLoadTimeListByHour(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const loadPageResult = await LoadPageInfoModel.getDifferentKindAvgLoadTimeListByHour(param)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', loadPageResult)
  }
  /**
   * 获取每个页面的各项加载指标
   * @returns {Promise<*>}
   */
  static async getDifferentKindAvgLoadTimeByHourForPageUrl(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const loadPageResult = await LoadPageInfoModel.getDifferentKindAvgLoadTimeByHourForPageUrl(param)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', loadPageResult)
  }
  /**
   * 每小时的数量分布
   * @returns {Promise<*>}
   */
  static async getPageUrlCountListByHour(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    
    await LoadPageInfoModel.getPageUrlCountListByHour(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }
  /**
   * 每分钟的数量分布
   * @returns {Promise<*>}
   */
  static async getPageUrlCountForHourByMinutes(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await LoadPageInfoModel.getPageUrlCountForHourByMinutes(param).then(data => {
      result1 = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result1)
  }
  
}

class LocationPointGroupController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { locationPointGroupName, locationPointGroupDes } = param
    const orderIndex = 0
    const {userId} = ctx.user
    const data = {userId, groupName: locationPointGroupName, groupDes: locationPointGroupDes, orderIndex}
    /* 判断参数是否合法 */
    if (locationPointGroupName) {
      let result = await LocationPointGroupModel.checkGroupName(data.groupName)
      const count = parseInt(result[0].count)
      if (count <= 0) {
        await LocationPointGroupModel.createLocationPointGroup(data);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
      } else {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('分组名重复，创建分组失败', count)
      }
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await LocationPointGroupModel.getLocationPointGroupDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let params = JSON.parse(ctx.request.body)
    let id = params.id;
  
    if (id && !isNaN(id)) {
      await LocationPointGroupModel.deleteLocationPointGroup(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await LocationPointGroupModel.updateLocationPointGroup(id, req);
      let data = await LocationPointGroupModel.getLocationPointGroupDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }

  /**
   * 获取分组列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getGroupNameList(ctx) {
    let req = ctx.request.body
    const {userId, userType} = ctx.user
    if (req) {
      // const data = await LocationPointGroupModel.findAndCountAll();
      let data
      if (userType == USER_INFO.USER_TYPE_ADMIN) {
        data = await LocationPointGroupModel.findAll();
      } else {
        data = await LocationPointGroupModel.findAllByUserId(userId);
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }

  /**
   * 获取分组列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getLocationPointGroupList(ctx) {
    let req = ctx.request.body
    const {userId, userType} = ctx.user
    const result = []
    if (req) {
      let data
      if (userType == USER_INFO.USER_TYPE_ADMIN) {
        data = await LocationPointGroupModel.findAll();
      } else {
        data = await LocationPointGroupModel.findAllByUserId(userId);
      }
      for (var i = 0; i < data.length; i ++) {
        const obj = {}
        const { id } = data[i]
        const locationPointType = await LocationPointTypeModel.getLocationPointTypeByGroupId(id);
        obj.group = data[i]
        obj.locationPointType = locationPointType
        result.push(obj)
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }
}

class LocationPointTypeController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { locationPointName, locationPointDes, chooseGroupId } = param
    const locationPointKey = new Date().getTime()
    const data = {locationPointName, locationPointDes, locationPointKey, groupId: chooseGroupId}
    /* 判断参数是否合法 */
    if (param.locationPointName) {
      let ret = await LocationPointTypeModel.createLocationPointType(data);
      let res = await LocationPointTypeModel.getLocationPointTypeDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res || {})
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getLocationPointTypeList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await LocationPointTypeModel.getLocationPointTypeList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await LocationPointTypeModel.getLocationPointTypeDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let params = JSON.parse(ctx.request.body)
    let id = params.id;
  
    if (id && !isNaN(id)) {
      await LocationPointTypeModel.deleteLocationPointType(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await LocationPointTypeModel.updateLocationPointType(id, req);
      let data = await LocationPointTypeModel.getLocationPointTypeDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
}

class ResourceLoadInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.happenTime) {
      let ret = await ResourceLoadInfoModel.createResourceLoadInfo(data);
      let res = await ResourceLoadInfoModel.getResourceLoadInfoDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getResourceLoadInfoList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await ResourceLoadInfoModel.getResourceLoadInfoList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await ResourceLoadInfoModel.getResourceLoadInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await ResourceLoadInfoModel.deleteResourceLoadInfo(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await ResourceLoadInfoModel.updateResourceLoadInfo(id, req);
      let data = await ResourceLoadInfoModel.getResourceLoadInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }

  /**
   * 获取当天静态资源加载错误列表
   * @returns {Promise.<void>}
   */
  static async getResourceLoadInfoListByDay(ctx) {

    const param = JSON.parse(ctx.request.body)
    let resourceErrorSortList = null
    await ResourceLoadInfoModel.getResourceLoadInfoListByDay(param).then(data => {
      resourceErrorSortList = data
    })
    console.log(param)
    console.log(resourceErrorSortList)
    for (let i = 0; i < resourceErrorSortList.length; i ++) {
      // 查询最近发生时间
      await ResourceLoadInfoModel.getResourceErrorLatestTime(resourceErrorSortList[i].sourceUrl, param).then(data => {
        resourceErrorSortList[i].createdAt = data[0].createdAt
        resourceErrorSortList[i].happenTime = data[0].happenTime
      })
      // 查询影响页面
      await ResourceLoadInfoModel.getPageCountByResourceError(resourceErrorSortList[i].sourceUrl, param).then(data => {
        resourceErrorSortList[i].pageCount = data[0].pageCount
      })
      // 查询影响用户
      await ResourceLoadInfoModel.getCustomerCountByResourceError(resourceErrorSortList[i].sourceUrl, param).then(data => {
        resourceErrorSortList[i].customerCount = data[0].customerCount
      })
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', resourceErrorSortList)
  }

  /**
   * 获取每天静态资源加载错误数量列表
   * @returns {Promise.<void>}
   */
  static async getResourceErrorCountByDay(ctx) {
    const param = utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.RESOURCE_ERROR
    await ResourceLoadInfoModel.getResourceErrorCountByDay(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', utils.handleDateResult(data))
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }

  /**
   * 根据时间获取一天内静态资源加载错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getResourceErrorCountByHour(ctx) {
    const param = utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.RESOURCE_ERROR
    let result1 = []
    await ResourceLoadInfoModel.getResourceLoadErrorInfoListByHour(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await ResourceLoadInfoModel.getResourceLoadErrorInfoListSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }

}

class LocationPointController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createLocationPoint(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('s', "")

    const happenDate = new Date().Format("yyyy-MM-dd hh:mm:ss")
    const param = JSON.parse(ctx.request.body)
    const { locationPointId, userId } = param
    const locationPointType = UPLOAD_TYPE.LOCATION_POINT_TYPE + locationPointId
    const data = {locationPointType, userId, happenDate}
    await LocationPointModel.createLocationPoint(data);
  }

  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createLocationPointForGet(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('s', "")
    const happenDate = new Date().Format("yyyy-MM-dd hh:mm:ss")
    const param = Utils.parseQs(ctx.request.url)
    const { locationPointId, userId } = param
    const locationPointType = UPLOAD_TYPE.LOCATION_POINT_TYPE + locationPointId
    const data = {locationPointType, userId, happenDate}
    await LocationPointModel.createLocationPoint(data);
  }

  static async locationPointCountForMonth(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { locationPointId } = params
    const day = Utils.addDays(0 - 29)
    const locationPointType = UPLOAD_TYPE.LOCATION_POINT_TYPE + locationPointId
    const locationPointUvType = UPLOAD_TYPE.LOCATION_UV_TYPE + locationPointId
    let data = await LocationPointModel.locationPointCountForMonth(locationPointType, day);
    let uvData = await LocationPointModel.locationPointCountUvForMonth(locationPointUvType, day);
    data = Utils.handleDateResult(data)
    uvData = Utils.handleDateResult(uvData)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {data, uvData});
  }

  static async getLocationPointForDay(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { funnelIds, timeSize } = params
    const funnelIdsArray = funnelIds.split(",")
    const day = Utils.addDays(0 - timeSize)
    const startId = funnelIdsArray[0]
    const endId = funnelIdsArray[funnelIdsArray.length - 1]
    const startLocationPointType = UPLOAD_TYPE.LOCATION_UV_TYPE + startId
    const endLocationPointType = UPLOAD_TYPE.LOCATION_UV_TYPE + endId
    let startData = await LocationPointModel.getLocationPointForDay(startLocationPointType, day);
    let endData = await LocationPointModel.getLocationPointForDay(endLocationPointType, day);
    startData = Utils.handleDateResult(startData)
    endData = Utils.handleDateResult(endData)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {startData, endData});
  }

  static async getFunnelLeftCountForDay(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { funnelIds } = params
    const funnelIdsArray = funnelIds.split(",")
    const day = Utils.addDays(0)
    const dataList = []
    for (let i = 0; i < funnelIdsArray.length; i ++) {
      const locationPointType = UPLOAD_TYPE.LOCATION_POINT_TYPE + funnelIdsArray[i]
      let data = await LocationPointModel.getFunnelLeftCountForDay(locationPointType, day);
      dataList.push(data[0])
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', dataList);
  }
}

class VideosInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.happenTime) {
      let ret = await VideosInfoModel.createVideos(data);
      let res = await VideosInfoModel.getVideosDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getVideosList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await VideosInfoModel.getVideosList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await VideosInfoModel.getVideosDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await VideosInfoModel.deleteVideos(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await VideosInfoModel.updateVideos(id, req);
      let data = await VideosInfoModel.getVideosDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }

  /**
   * 
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getVideosEvent(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    await VideosInfoModel.getVideosEvent(param).then(data => {
      const result = []
      data.forEach((item) => {
        item.event = (item.event || "").toString()
        result.push(item)
      })
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
    })
    
  }
}

class HttpLogInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.happenTime) {
      let ret = await HttpLogInfoModel.createHttpLogInfo(data);
      let res = await HttpLogInfoModel.getHttpLogInfoDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getHttpLogInfoList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await HttpLogInfoModel.getHttpLogInfoList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await HttpLogInfoModel.getHttpLogInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await HttpLogInfoModel.deleteHttpLogInfo(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await HttpLogInfoModel.updateHttpLogInfo(id, req);
      let data = await HttpLogInfoModel.getHttpLogInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }

  /**
   * 根据时间获取一天内http请求错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getHttpErrorInfoListByHour(ctx) {
    const param = utils.parseQs(ctx.request.url)
    let result1 = []
    await HttpLogInfoModel.getHttpErrorInfoListByHour(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await HttpLogInfoModel.getHttpErrorInfoListSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }


  /**
   * 获取每天接口请求错误数量列表
   * @returns {Promise.<void>}
   */
  static async getHttpErrorCountByDay(ctx) {
    const param = utils.parseQs(ctx.request.url)
    await HttpLogInfoModel.getHttpErrorCountByDay(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }

  /**
   * 获取每天接口请求错误列表
   * @returns {Promise.<void>}
   */
  static async getHttpErrorListByDay(ctx) {

    const param = JSON.parse(ctx.request.body)
    let resourceErrorSortList = null
    await HttpLogInfoModel.getResourceLoadInfoListByDay(param).then(data => {
      resourceErrorSortList = data
    })
    for (let i = 0; i < resourceErrorSortList.length; i ++) {
      // 查询最近发生时间
      await HttpLogInfoModel.getResourceErrorLatestTime(resourceErrorSortList[i].sourceUrl, param).then(data => {
        resourceErrorSortList[i].createdAt = data[0].createdAt
        resourceErrorSortList[i].happenTime = data[0].happenTime
      })
      // 查询不同状态的次数
      await HttpLogInfoModel.getPageCountByResourceError(resourceErrorSortList[i].sourceUrl, param).then(data => {
        resourceErrorSortList[i].pageCount = data[0].pageCount
      })
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', resourceErrorSortList)
  }

  // 实时获取http请求数量
  static async getHttpCountByMinute(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await HttpLogInfoModel.getHttpCountByMinute(param).then(data => {
      result1 = data
    })
    // let result2 = []
    // await CustomerPVModel.getUvCountByMinute(param).then(data => {
    //   result2 = data
    // })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {http: result1})
  }

  /**
   * 根据时间分类
   * @returns {Promise<*>}
   */
  static async getHttpCountForLoadTimeGroupByDay(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    param.uploadType = UPLOAD_TYPE.HTTP_COUNT_A
    const result_a = await HttpLogInfoModel.getHttpCountForLoadTimeGroupByDay(param)
    param.uploadType = UPLOAD_TYPE.HTTP_COUNT_B
    const result_b = await HttpLogInfoModel.getHttpCountForLoadTimeGroupByDay(param)
    param.uploadType = UPLOAD_TYPE.HTTP_COUNT_C
    const result_c = await HttpLogInfoModel.getHttpCountForLoadTimeGroupByDay(param)
    param.uploadType = UPLOAD_TYPE.HTTP_COUNT_D
    const result_d = await HttpLogInfoModel.getHttpCountForLoadTimeGroupByDay(param)
    param.uploadType = UPLOAD_TYPE.HTTP_COUNT_E
    const result_e = await HttpLogInfoModel.getHttpCountForLoadTimeGroupByDay(param)
    const result = {
      a: utils.handleDateResult(result_a),
      b: utils.handleDateResult(result_b),
      c: utils.handleDateResult(result_c),
      d: utils.handleDateResult(result_d),
      e: utils.handleDateResult(result_e),
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
  }
  /**
   * 根据时间获取分类列表
   * @returns {Promise<*>}
   */
  static async getHttpUrlListForLoadTime(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const httpUrlList = await HttpLogInfoModel.getHttpUrlListForLoadTime(param)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', httpUrlList)
  }
  /**
   * 获取接口影响人数
   * @returns {Promise<*>}
   */
  static async getHttpUrlUserCount(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const userResult = await HttpLogInfoModel.getHttpUrlUserCountForLoadTime(param)
    const userCount = userResult.length ? userResult[0].count : 0
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', userCount)
  }

  /**
   * 获取接口发生页面
   * @returns {Promise<*>}
   */
  static async getPagesByHttpUrl(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const pagesResult = await HttpLogInfoModel.getPagesByHttpUrlForLoadTime(param)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', pagesResult)
  }

  /**
   * 每小时的数量分布
   * @returns {Promise<*>}
   */
  static async getHttpUrlCountListByHour(ctx) {
    const param = utils.parseQs(ctx.request.url)
    
    await HttpLogInfoModel.getHttpUrlCountListByHour(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }
  /**
   * 每分钟的数量分布
   * @returns {Promise<*>}
   */
  static async getHttpUrlCountForHourByMinutes(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await HttpLogInfoModel.getHttpUrlCountForHourByMinutes(param).then(data => {
      result1 = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result1)
  }
}

class JavascriptErrorInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (data.happenTime) {
      let ret = await JavascriptErrorInfoModel.createJavascriptErrorInfo(data);
      let res = await JavascriptErrorInfoModel.getJavascriptErrorInfoDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorInfoList(ctx) {
    let req = ctx.request.body

    if (req) {
      const data = await JavascriptErrorInfoModel.getJavascriptErrorInfoList();

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }

  /**
   * 获取每分钟JS错误的数量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorCountByMinute(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await JavascriptErrorInfoModel.getJavascriptErrorCountByMinute(param).then(data => {
      result1 = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', {jsError: result1})
  }

  /**
   * 根据时间获取JS错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorInfoListByDay(ctx) {
    const param = utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.ON_ERROR
    await JavascriptErrorInfoModel.getJavascriptErrorInfoListByDay(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', utils.handleDateResult(data))
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }
  /**
   * 根据时间获取自定义JS错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getConsoleErrorInfoListByDay(ctx) {
    const param = utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.CONSOLE_ERROR
    await JavascriptErrorInfoModel.getConsoleErrorInfoListByDay(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', utils.handleDateResult(data))
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }

  /**
   * 根据时间获取一天内JS错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorInfoListByHour(ctx) {
    const param = utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.ON_ERROR
    let result1 = []
    await JavascriptErrorInfoModel.getErrorCountByHour(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await JavascriptErrorInfoModel.getErrorCountSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }

  /**
   * 根据时间获取一天内某个JS错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorCountListByHour(ctx) {
    const param = utils.parseQs(ctx.request.url)
    await JavascriptErrorInfoModel.getJavascriptErrorCountListByHour(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }
  /**
   * 根据时间获取一天内某个JS错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJsErrorCountByHour(ctx) {
    const param = utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.ON_ERROR
    let result1 = []
    await JavascriptErrorInfoModel.getErrorCountByHour(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await JavascriptErrorInfoModel.getErrorCountSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }
  /**
   * 根据时间获取一天内自定义JS错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptConsoleErrorInfoListByHour(ctx) {
    const param = utils.parseQs(ctx.request.url)
    param.infoType = UPLOAD_TYPE.CONSOLE_ERROR
    let result1 = []
    await JavascriptErrorInfoModel.getErrorCountByHour(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await JavascriptErrorInfoModel.getErrorCountSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }

  /**
   * 根据JS错误的数量进行排序
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorSort(ctx) {
    const param = JSON.parse(ctx.request.body)
    let errorSortList = []
    await JavascriptErrorInfoModel.getJavascriptErrorSort(param).then(data => {
      errorSortList = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', errorSortList)
  }
/**
   * 根据JS错误获取相关信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorSortInfo(ctx) {
    const param = JSON.parse(ctx.request.body)
    const {errorMessage} = param
    const obj = {}
    await JavascriptErrorInfoModel.getJavascriptErrorLatestTime(errorMessage, param).then(data => {
      obj.createdAt = data[0].createdAt
      obj.happenTime = data[0].happenTime
    })
    await JavascriptErrorInfoModel.getJavascriptErrorAffectCount(errorMessage, param).then(data => {
      obj.customerCount = data[0].count
    })
    await JavascriptErrorInfoModel.getPerJavascriptErrorCountByOs(errorMessage, param).then(data => {
      obj.osInfo = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', obj)
  }
  /**
   * 根据JS错误的数量进行排序
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getConsoleErrorSort(ctx) {
    const param = JSON.parse(ctx.request.body)
    let errorSortList = []
    await JavascriptErrorInfoModel.getConsoleErrorSort(param).then(data => {
      errorSortList = data
    })
    // for (let i = 0; i < errorSortList.length; i ++) {
    //   await JavascriptErrorInfoModel.getJavascriptErrorLatestTime(errorSortList[i].errorMessage, param).then(data => {
    //     errorSortList[i].createdAt = data[0].createdAt
    //     errorSortList[i].happenTime = data[0].happenTime
    //   })
    //   await JavascriptErrorInfoModel.getPerJavascriptConsoleErrorCount(errorSortList[i].errorMessage, param).then(data => {
    //     errorSortList[i].osInfo = data
    //   })
    // }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', errorSortList)
  }

  /**
   * 查询最近六小时内JS错误的数量信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorCountByHour(ctx) {
    const param = utils.parseQs(ctx.request.url)
    await JavascriptErrorInfoModel.getJavascriptErrorCountByHour(param).then(data => {
      if (data) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', utils.handleDateResult(data))
      } else {
        ctx.response.status = 412;
        ctx.body = statusCode.ERROR_412('查询信息列表失败！');
      }
    })
  }

  /**
   * 查询对应平台js错误的数量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorCountByOs(ctx) {
    const param = utils.parseQs(ctx.request.url)
    const result = {};
    const {day} = param;
    param.day = utils.addDays(0 - day) + " 00:00:00"
    await JavascriptErrorInfoModel.getJavascriptErrorPcCount(param).then(data => {
      result.pcError = data.length ? data[0] : 0;
    })
    await JavascriptErrorInfoModel.getJavascriptErrorIosCount(param).then(data => {
      result.iosError = data.length ? data[0] : 0;
    })
    await JavascriptErrorInfoModel.getJavascriptErrorAndroidCount(param).then(data => {
      result.androidError = data.length ? data[0] : 0;
    })

    await CustomerPVModel.getCustomerPvPcCount(param).then(data => {
      result.pcPv = data.length ? data[0] : 0;
    })
    await CustomerPVModel.getCustomerPvIosCount(param).then(data => {
      result.iosPv = data.length ? data[0] : 0;
    })
    await CustomerPVModel.getCustomerPvAndroidCount(param).then(data => {
      result.androidPv = data.length ? data[0] : 0;
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result);
    })
  }
  /**
   * 查询分类js错误的数量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorCountByType(ctx) {
    const param = utils.parseQs(ctx.request.url)
    const {day} = param;
    param.day = utils.addDays(0 - day) + " 00:00:00"
    await JavascriptErrorInfoModel.getJavascriptErrorCountByType(param).then(data => {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息成功！', data);
    })

  }
  /**
   * 根据errorMsg查询Js错误列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorListByMsg(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param)
    await JavascriptErrorInfoModel.getJavascriptErrorListByMsg(decodeURIComponent(data.errorMsg), data).then(data => {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data);
    })
  }

  static async getJavascriptErrorAboutInfo(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param)
    const result = {}
    await JavascriptErrorInfoModel.getJavascriptErrorAffectCount(decodeURIComponent(data.errorMsg), data).then(data => {
      result.customerCount = data[0].count
    })
    await JavascriptErrorInfoModel.getJavascriptErrorOccurCountByCustomerKey(decodeURIComponent(data.errorMsg), data).then(data => {
      result.occurCount = data[0].count
    })
    await JavascriptErrorInfoModel.getAllJavascriptErrorCountByOs(decodeURIComponent(data.errorMsg), data).then(data => {
      result.osInfo = {}
      data.forEach((item) => {
        result.osInfo[item.os] = item.count
      })
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result);
    })
  }

  /**
   * 根据页面查询Js错误列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorListByPage(ctx) {
    const param = utils.parseQs(ctx.request.url)
    await JavascriptErrorInfoModel.getJavascriptErrorListByPage(param).then(data => {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data);
    })
  }

  /**
   * 根据errorMsg查询Js错误列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorStackCode(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param)
    await JavascriptErrorInfoModel.getJavascriptErrorStackCode(data.stackList).then(data => {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data);
    })
  }
  /**
   * 根据errorMsg查询Js错误列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorStackCodeForSource(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { locationX, locationY } = param
    const data = await JavascriptErrorInfoModel.getJavascriptErrorStackCodeForSource(locationX, locationY)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息成功！', data);
  }
  /**
   * 根据errorMsg查询Js错误列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorStackCodeForUrl(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { locationX, locationY, sourceCodeUrl } = param
    const data = await JavascriptErrorInfoModel.getJavascriptErrorStackCodeForUrl(locationX, locationY, sourceCodeUrl)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data);
  }
  
  /**
   * 根据errorMsg查询Js错误列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async uploadMapFile(ctx) {
    // const param = ctx.request.body
    const req = ctx.req
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;

    form.uploadDir = "lib";

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(files.files.path + " 上传失败")
      }
      await fs.renameSync(files.files.path, "lib/temp.min.js.map", function (err) {
        if (err) {
          console.log(files.files.path + " 重命名失败")
        }
      })
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 0);
  }
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await JavascriptErrorInfoModel.getJavascriptErrorInfoDetail(id);
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await JavascriptErrorInfoModel.deleteJavascriptErrorInfo(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await JavascriptErrorInfoModel.updateJavascriptErrorInfo(id, req);
      let data = await JavascriptErrorInfoModel.getJavascriptErrorInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
}

let webfunnyVersionForProject = "1.8.2"
class ProjectController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await ProjectModel.createProject(req);
            let data = await ProjectModel.getProjectDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    /**
     * 获取信息列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectList(ctx) {

        const referer = ctx.req && ctx.req.headers && ctx.req.headers.referer
        // 调用此方法，说明用户访问了页面 开始
        await fetch("http://www.webfunny.cn/config/customerReviewWeb",
        {
            method: "POST", 
            body: JSON.stringify({cdkey: accountInfo.purchaseCode, referer}),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
        // 调用此方法，说明用户访问了页面 结束
        
        const param = Utils.parseQs(ctx.request.url)
        
        const {userId, userType} = ctx.user
        param.userId = userId

        let projectList = []
        if (userType == "admin") {
            projectList = await ProjectModel.getAllProjectList()
        } else {
            projectList = await ProjectModel.getProjectList(param)
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', projectList)
    }
    /**
     * 获取webMonitorId列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getWebMonitorIdList(ctx) {
        const data = await ProjectModel.getWebMonitorIdList()
        let webMonitorIdList = []
        data.forEach((obj) => {
            webMonitorIdList.push(obj.webMonitorId)
        })
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', webMonitorIdList)
    }

    /**
     * 获取项目详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectDetail(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        const {webMonitorId} = param
        const project = await ProjectModel.getProjectDetailForWebMonitorId(webMonitorId);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', project)
    }

    /**
     * 更新启动列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async updateStartList(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        const {webMonitorId, startList} = param
        let res = await ProjectModel.updateProjectForWebMonitorId(webMonitorId, {startList});
        global.monitorInfo[webMonitorId + "startList"] = startList
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', res)
    }
    /**
     * 获取信息列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getAllProjectList(ctx) {
        let req = ctx.request.body
        const param = Utils.parseQs(ctx.request.url)
        if (req) {
            const data = await ProjectModel.getAllProjectList(param);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('查询信息列表失败！');
        }

    }
    /**
     * 获取详细信息列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectDetailList(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        const data = await ProjectModel.getProjectDetailList(param);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    }

    /**
     * 获取首页每个项目的实时信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectInfoInRealTime(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        const {webMonitorId} = param
        const todayUvData = await CustomerPVModel.getUVCountForDay(webMonitorId, 0, UPLOAD_TYPE.UV_COUNT_HOUR);
        const todayNewData = await CustomerPVModel.getNewCountForDay(webMonitorId, 0, UPLOAD_TYPE.NEW_COUNT_HOUR);
        const uv = todayUvData[0].count
        const newCus = todayNewData[0].count
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {uv, newCus})
    }
    
    /**
     * 查询单条信息数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(ctx) {
        let id = ctx.params.id;

        if (id) {
            let data = await ProjectModel.getProjectDetail(id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('查询成功！', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('信息ID必须传');
        }
    }


    /**
     * 删除信息数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        let id = ctx.params.id;

        if (id && !isNaN(id)) {
            await ProjectModel.deleteProject(id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('删除信息成功！')
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('信息ID必须传！');
        }
    }
    /**
     * 删除信息数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async deleteProject(ctx) {
        const params = Utils.parseQs(ctx.request.url)
        let id = params.id;
        if (id && !isNaN(id)) {
            await ProjectModel.deleteProject(id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('删除信息成功！')
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('信息ID必须传！');
        }
    }

    /**
     * 更新导航条数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async update(ctx) {
        let req = ctx.request.body;
        let id = ctx.params.id;

        if (req) {
            await ProjectModel.updateProject(id, req);
            let data = await ProjectModel.getProjectDetail(id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('更新信息失败！')
        }
    }

    /**
     * 创建新项目
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async createNewProject(ctx) {
        const data = JSON.parse(ctx.request.body)
        const {userId} = ctx.user
        const webMonitorId = data.webMonitorId

        const { localServerDomain, mainDomain } = domain

        const assetsDomain = domain.localAssetsDomain

        const monitorJsPath = "//" + assetsDomain + "/webfunny/w.js"
        // 检查数据库里有几个项目

        if (data) {
            let result = await ProjectModel.checkProjectName(data.projectName)
            const count = parseInt(result[0].count)
            if (count <= 0) {
                let monitorCode = ""
                data.projectType = "customer"
                // data.remotePath = monitorJsPath + "?id=" + webMonitorId

                // 纯源码方式
                const webfunnyCode = fs.readFileSync(`./lib/webfunny.min.js`, 'utf-8')
                monitorCode = encodeURIComponent(webfunnyCode.toString()
                                        .replace(/jeffery_webmonitor/g, webMonitorId)
                                        .replace(/webfunnyVersionFlag/g, webfunnyVersionForProject)
                                        .replace(/&&&www.webfunny.cn&&&/g, localServerDomain)
                                        .replace(/&&&webfunny.cn&&&/g, mainDomain));
                data.monitorCode = monitorCode
                
                // 引入文件方式
                const insertCode = fs.readFileSync(`./lib/insertCode.js`, 'utf-8')
                data.fetchCode = encodeURIComponent(insertCode.toString().replace(/jeffery_webmonitor/g, webMonitorId)
                                        .replace(/monitorJsPath/g, monitorJsPath));
                data.userId = userId
                await ProjectModel.createProject(data);

                // 把项目列表写入bin/webMonitorIdList.js文件中
                await Common.setWebMonitorIdList()
                // 1分钟以后生成表创建程序
                setTimeout(() => {
                    log.printInfo("开始执行。。。")
                    // 创建项目后，将启动创建表程序
                    switch (process.platform) {
                        // windows系统下
                        case "win32":
                            spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['run', 'table_config'], { stdio: 'inherit' });
                            break;
                        case "darwin":  // 默认mac系统
                        default:
                            try {
                                log.printInfo("即将执行。。。")
                                execFile('./createTable.sh', [], null, function (err, stdout, stderr) {
                                    log.printError(JSON.stringify(err))
                                    log.printError(stdout)
                                    log.printError(stderr)
                                });
                            } catch(e) {
                                log.printError(e)
                                log.printError(errorStr)
                            }
                            break;
                    }
                }, 12 * 1000)
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('项目创建成功', data)
            } else {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('项目名重复，创建项目失败', count)
            }
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    /**
     * 更新探针代码
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async updateMonitorCode(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        const { webMonitorId } = param
        const { localServerDomain, mainDomain } = domain
        const webfunnyCode = fs.readFileSync(`./lib/webfunny.min.js`, 'utf-8')
        param.monitorCode = encodeURIComponent(webfunnyCode.toString()
                                        .replace(/jeffery_webmonitor/g, webMonitorId)
                                        .replace(/webfunnyVersionFlag/g, webfunnyVersionForProject)
                                        .replace(/&&&www.webfunny.cn&&&/g, localServerDomain)
                                        .replace(/&&&webfunny.cn&&&/g, mainDomain));
        
        let res = await ProjectModel.updateMonitorCodeByWebMonitorId(param);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('成功更新探针代码！', res)
    }


    static async checkProjectCount(ctx) {
        let req = ctx.request.body
        const param = Utils.parseQs(ctx.request.url)
        if (req) {
            const data = await ProjectModel.checkProjectCount(param);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('查询信息列表失败！');
        }

    }
    static async changeLogServerStatusByWebMonitorId(ctx) {
        const param = JSON.parse(ctx.request.body)
        const {webMonitorId, status} = param
        let finalWebMonitorIdList = []
        let stopWebMonitorIdListStr = ""
        const stopWebMonitorIdList = global.monitorInfo.stopWebMonitorIdList
        if (status === false && stopWebMonitorIdList.indexOf(webMonitorId) === -1) {
            stopWebMonitorIdList.push(webMonitorId)
            stopWebMonitorIdList.forEach((webMonitorId, index) => {
                if (index == stopWebMonitorIdList.length - 1) {
                    stopWebMonitorIdListStr += "'" + webMonitorId + "'"
                } else {
                    stopWebMonitorIdListStr += "'" + webMonitorId + "',"
                }
            })
        } else if (status === true && stopWebMonitorIdList.indexOf(webMonitorId) !== -1) {
            let stopList = []
            stopWebMonitorIdList.forEach((id) => {
                if (id !== webMonitorId) {
                    stopList.push(id)
                }
            })
            global.monitorInfo.stopWebMonitorIdList = stopList
            stopList.forEach((id, index) => {
                if (index == stopList.length - 1) {
                    stopWebMonitorIdListStr += "'" + id + "'"
                } else {
                    stopWebMonitorIdListStr += "'" + id + "',"
                }
            })
        }
        const newString = `module.exports = [${stopWebMonitorIdListStr}]`
        await fs.writeFile("./bin/stopWebMonitorIdList.js", newString, (err) => {
            if (err) {
                throw err;
            }
            log.printInfo(webMonitorId + " 日志上报状态：" + status)
        });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async getStopWebMonitorIdList(ctx) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', global.monitorInfo.stopWebMonitorIdList)
    }
}


class UserController {
  /**
   * webfunny
   */
  static sendEmail(email, title, content) {

    if (accountInfo.useCusEmailSys === true) {
      Utils.sendEmail(email, title, content, accountInfo.emailUser, accountInfo.emailPassword)
    } else {
      fetch("http://www.webfunny.cn/config/sendEmail",
      {
          method: "POST", 
          body: JSON.stringify({email, title, content}),
          headers: {
              "Content-Type": "application/json;charset=utf-8"
          }
      })
    }
  }

  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { funnelName, funnelIds } = param
    const data = {funnelName, funnelIds}
    /* 判断参数是否合法 */
    if (param.funnelName) {
      let ret = await UserModel.createUser(data);
      let res = await UserModel.getUserDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res || {})
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await UserModel.getUserList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await UserModel.getUserDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let params = JSON.parse(ctx.request.body)
    let id = params.id;
  
    if (id && !isNaN(id)) {
      await UserModel.deleteUser(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await UserModel.updateUser(id, req);
      let data = await UserModel.getUserDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }

  /**
   * 登录并创建token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { emailName, password } = param
    const data = {emailName, password}
    const userData = await UserModel.getUserForPwd(data)
    if (userData) {
      const { userId, userType } = userData
      const accessToken = jwt.sign({userId, userType, emailName, password}, secret.sign, {expiresIn: 33 * 24 * 60 * 60})
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', accessToken)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户名或密码不正确！', 1)
    }
    
  }

  static async forgetPwd(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { email } = param
    // 判断是否为管理员
    let adminData = await UserModel.isAdminAccount(email, USER_INFO.USER_TYPE_ADMIN)
    if (adminData) {
      UserController.sendEmail(email, "密码找回", "管理员你好， 你的登录密码是：" + adminData.password)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('管理员你好，密码已发送至您的邮箱，请注意查收！', 0)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('非管理员账号，请联系管理员获取登录密码！', 1)
    }
  }
  

  /**
   * 发送注册验证码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async sendRegisterEmail(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { email } = param

    const code = Math.floor(Math.random() * 9000) + 1000
    global.monitorInfo.registerEmailCode[email] = code
    const title = "注册验证码：" + code
    const content = "<p>用户你好!</p>" + 
    "<p>Webfunny注册的验证码为：" + code + "</p>" +
    "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
    UserController.sendEmail(email, title, content)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
  }

  /**
   * 给管理员发送检查邮件
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerCheck(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { name, email, emailCode, password } = param

    // 判断验证码是否正确
    if (emailCode != global.monitorInfo.registerEmailCode[email]) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确！', 1)
      return
    }
    
    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('邮箱已存在！', 1)
      return
    }

    // 记录注册邮箱
    await Utils.postJson("http://www.webfunny.cn/config/recordEmail", {email, purchaseCode: accountInfo.purchaseCode})

    let adminData = await UserModel.getAdminByType("admin")

    if (!adminData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('请先初始化管理员账号', 1)
    } else {
      const adminEmail = adminData.emailName
      const { localServerDomain } = domain
      // 此处需要支持http协议
      const confirmUrl = `http://${localServerDomain}/server/register?name=${name}&email=${email}&password=${password}`
      const title = "管理员确认申请"
      const content = "<p>管理员你好!</p>" + 
      "<p>有用户申请注册你的监控系统，请点击注册链接，以完成注册：<a href='" + confirmUrl + "'>" + confirmUrl + "</a></p>" +
      "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
      UserController.sendEmail(adminEmail, title, content)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }
  }

  /**
   * 注册用户
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async register(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const { name, email, password } = param
    const userId = Utils.getUuid()
    const data = {nickname: name, emailName: email, password, userId, userType: "customer"}

    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('邮箱已存在！', 1)
      return
    }
    /* 判断参数是否合法 */
    if (data.nickname) {
      let ret = await UserModel.createUser(data);
      if (ret && ret.id) {
        // 通知用户注册的账号密码
        const title = "申请通过"
        const content = "<p>用户你好!</p>" + 
        "<p>你注册的监控系统账号已经申请通过。</p>" +
        "<p>账号：" + email + " 、 密码：" + password + "</p>" +
        "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
        UserController.sendEmail(email, title, content)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
      }
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  /**
   * 注册管理员账号
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerForAdmin(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { name, email, password, userType } = param
    const userId = Utils.getUuid()
    const data = {nickname: name, emailName: email, password, userType, userId}

    // 记录注册邮箱
    await Utils.postJson("http://www.webfunny.cn/config/recordEmail", {email, purchaseCode: accountInfo.purchaseCode})

    /* 判断参数是否合法 */
    if (data.nickname) {
      const adminData = await UserModel.checkAdminAccount();
      const adminUserCount = adminData[0].count * 1
      if (adminUserCount > 0) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('管理员账号已存在，请勿重复创建', 1)
        return
      }
      await UserModel.createUser(data);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
}

class CustomerPVController {
  // /**
  //  * 创建信息
  //  * @param ctx
  //  * @returns {Promise.<void>}
  //  */
  // static async create(ctx) {
  //   const param = ctx.request.body
  //   const data = JSON.parse(param.data)
  //   /* 判断参数是否合法 */
  //   if (req.happenTime) {
  //     let ret = await CustomerPVModel.createCustomerPV(data);
  //     let res = await CustomerPVModel.getCustomerPVDetail(ret.id);
  
  //     ctx.response.status = 200;
  //     ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
  //   } else {
  //     ctx.response.status = 412;
  //     ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
  //   }
  // }
  
  // /**
  //  * 获取信息列表
  //  * @param ctx
  //  * @returns {Promise.<void>}
  //  */
  // static async getCustomerPVList(ctx) {
  //   let req = ctx.request.body
  
  //   if (req) {
  //     const data = await CustomerPVModel.getCustomerPVList();
  
  //     ctx.response.status = 200;
  //     ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  //   } else {
  
  //     ctx.response.status = 412;
  //     ctx.body = statusCode.ERROR_412('查询信息列表失败！');
  //   }
  
  // }
  
  // /**
  //  * 查询单条信息数据
  //  * @param ctx
  //  * @returns {Promise.<void>}
  //  */
  // static async detail(ctx) {
  //   let id = ctx.params.id;
  
  //   if (id) {
  //     let data = await CustomerPVModel.getCustomerPVDetail(id);
  
  //     ctx.response.status = 200;
  //     ctx.body = statusCode.SUCCESS_200('查询成功！', data)
  //   } else {
  
  //     ctx.response.status = 412;
  //     ctx.body = statusCode.ERROR_412('信息ID必须传');
  //   }
  // }
  
  
  // /**
  //  * 删除信息数据
  //  * @param ctx
  //  * @returns {Promise.<void>}
  //  */
  // static async delete(ctx) {
  //   let id = ctx.params.id;
  
  //   if (id && !isNaN(id)) {
  //     await CustomerPVModel.deleteCustomerPV(id);
  
  //     ctx.response.status = 200;
  //     ctx.body = statusCode.SUCCESS_200('删除信息成功！')
  //   } else {
  
  //     ctx.response.status = 412;
  //     ctx.body = statusCode.ERROR_412('信息ID必须传！');
  //   }
  // }
  
  // /**
  //  * 更新导航条数据
  //  * @param ctx
  //  * @returns {Promise.<void>}
  //  */
  // static async update(ctx) {
  //   let req = ctx.request.body;
  //   let id = ctx.params.id;
  
  //   if (req) {
  //     await CustomerPVModel.updateCustomerPV(id, req);
  //     let data = await CustomerPVModel.getCustomerPVDetail(id);
  
  //     ctx.response.status = 200;
  //     ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
  //   } else {
  
  //     ctx.response.status = 412;
  //     ctx.body = statusCode.ERROR_412('更新信息失败！')
  //   }
  // }
  /**
   * 每隔10分钟获取每天的流量数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getTodayFlowDataByTenMin(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { timeSize, webMonitorId } = params
    const day = utils.addDays(0 - timeSize)
    const todayPvData = await CustomerPVModel.getPVFlowDataForDay(webMonitorId, day);
    const todayUvData = await CustomerPVModel.getUVFlowDataForDay(webMonitorId, day);
    const todayNewData = await CustomerPVModel.getNewFlowDataForDay(webMonitorId, day);
    const todayIpData = await CustomerPVModel.getIpFlowDataForDay(webMonitorId, day);
    const todayCusLeavePercentData = await CustomerPvLeaveModel.getCusLeavePercentDataForDay(webMonitorId, day);
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {todayPvData, todayUvData, todayNewData, todayIpData, todayCusLeavePercentData});
  }
  /**
   * 获取一个月内，每天的uv数量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async uvCountForMonth(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { webMonitorId } = params
    const day = utils.addDays(0 - 29)
    let uvData = await CustomerPVModel.uvCountForMonth(webMonitorId, UPLOAD_TYPE.UV_COUNT_DAY, day);
    let newUvData = await CustomerPVModel.uvCountForMonth(webMonitorId, UPLOAD_TYPE.NEW_COUNT_DAY, day);
    uvData = utils.handleDateResult(uvData)
    newUvData = utils.handleDateResult(newUvData)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {uvData, newUvData});
  }
  /**
   * 刷新今天的流量数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getTodayFlowData(ctx) {
    // let req = ctx.request.body
    // const params = JSON.parse(req)
    // const { webMonitorId } = params
    // const todayPvData = await CustomerPVModel.getPVCountForDay(webMonitorId, 0, UPLOAD_TYPE.PV_COUNT_DAY);
    // const todayUvData = await CustomerPVModel.getUVCountForDay(webMonitorId, 0, UPLOAD_TYPE.UV_COUNT_DAY);
    // const todayNewData = await CustomerPVModel.getNewCountForDay(webMonitorId, 0, UPLOAD_TYPE.NEW_COUNT_DAY);
    // const todayIpData = await CustomerPVModel.getIpCountForDay(webMonitorId, 0, UPLOAD_TYPE.IP_COUNT_DAY);
    // const today = {
    //   pv: todayPvData[0].count,
    //   uv: todayUvData[0].count,
    //   newCus: todayNewData[0].count,
    //   ip: todayIpData[0].count,
    //   per: (todayPvData[0].count / todayUvData[0].count).toFixed(2)
    // }
    // ctx.response.status = 200;
    // ctx.body = statusCode.SUCCESS_200('更新信息成功！', today);
    
    await Common.calculateCountByDayForTenMinutes(0)

    let req = ctx.request.body
    const params = JSON.parse(req)
    const { webMonitorId } = params
    const day = utils.addDays(0)
    const todayPvData = await CustomerPVModel.getPVFlowDataForDay(webMonitorId, day);
    const todayUvData = await CustomerPVModel.getUVFlowDataForDay(webMonitorId, day);
    const todayNewData = await CustomerPVModel.getNewFlowDataForDay(webMonitorId, day);
    const todayIpData = await CustomerPVModel.getIpFlowDataForDay(webMonitorId, day);

    const today = {
      pv: todayPvData[0].dayCount,
      uv: todayUvData[0].dayCount,
      newCus: todayNewData[0].dayCount,
      ip: todayIpData[0].dayCount,
      per: (todayPvData[0].dayCount / todayUvData[0].dayCount).toFixed(2)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('更新信息成功！', today);
  }
  /**
   * 获取7天平均pv数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getAvgPvInSevenDay(ctx) {
    // let req = ctx.request.body
    // const params = JSON.parse(req)
    // const { webMonitorId } = params
    // const todayPvData = await CustomerPVModel.getPVCountForDay(webMonitorId, 0);
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('更新信息成功！', {});
  }
  /**
   * 获取某一天的数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUvCountForDay(ctx) {
    let params = ctx.request.body
    const { webMonitorId, dayIndex } = params
    const uvData = await CustomerPVModel.getUVCountForDay(webMonitorId, dayIndex * 1, UPLOAD_TYPE.UV_COUNT_HOUR);
    const uvCount = uvData[0].count * 1
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('获取信息成功！', uvCount);
  }
  /**
   * 根据时间获取每天的日活量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getCustomerCountByTime(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    if (req) {
      const data = await CustomerPVModel.getCustomerCountByTime(params);
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', utils.handleDateResult(data, params.timeScope))
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }
  /**
   * 获取24小时内每小时user数量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserCountByHour(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await CustomerPVModel.getUserCountByHour(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await CustomerPVModel.getUserCountSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }
  /**
   * 获取24小时内每小时UV量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUvCountByHour(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await CustomerPVModel.getUvCountByHour(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await CustomerPVModel.getUvCountSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }
  /**
   * 获取24小时内每小时PV量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getPvCountByHour(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await CustomerPVModel.getPvCountByTime(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await CustomerPVModel.getPvCountSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }
  /**
   * 获取24小时内每小时新用户量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getNewCustomerCountByHour(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await CustomerPVModel.getNewCustomerCountByTime(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await CustomerPVModel.getNewCustomerCountSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    // let total = 0
    // await CustomerPVModel.getNewCustomerCountByToday(param).then(data => {
    //   total = data[0].count;
    // })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }
  /**
   * 获取24小时内每小时平均安装量
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getInstallCountByHour(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await CustomerPVModel.getInstallCountByTime(param).then(data => {
      result1 = data;
    })
    let result2 = []
    await CustomerPVModel.getInstallCountSevenDayAgoByHour(param).then(data => {
      result2 = data;
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {today: result1, seven: result2})
  }

  static async getPvUvCountBySecond(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    let result1 = []
    await CustomerPVModel.getPvCountBySecond(param).then(data => {
      result1 = data
    })
    let result2 = []
    await CustomerPVModel.getUvCountBySecond(param).then(data => {
      result2 = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {pv: result1, uv: result2})
  }
  static async getPvCountByMinute(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    // let result1 = []
    // await CustomerPVModel.getPvCountByMinute(param).then(data => {
    //   result1 = data
    // })
    let result2 = []
    await CustomerPVModel.getUvCountByMinute(param).then(data => {
      result2 = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {uv: result2})
  }

  static async getProvinceCountBySeconds(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const pvList = await CustomerPVModel.getPvsInfoByTenSeconds(param)
    const newCusData = await CustomerPVModel.getNewCusInfoBySeconds(param)
    const provinceData = await CustomerPVModel.getProvinceCountBySeconds(param)
    const newCusCount = (newCusData && newCusData[0]) ? newCusData[0].count : 0
    // for (let i = 0; i < provinceData.length; i ++) {
    //   let key = provinceData[i].name
    //   provinceData[i].name = provinces[key] ? provinces[key] : "其他"
    // }
      // for (let i = 0; i < pvList.length; i ++) {
      //   let key = pvList[i].province
      //   pvList[i].province = provinces[key] ? provinces[key] : "未知地区"
      // }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {pvList, provinceData, newCusCount})
  }

  static async getAliveCusInRealTime(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const uvList = []
    let webMonitorIdList = []
    const data = await ProjectModel.getWebMonitorIdList();
    data.forEach((pro) => {
      webMonitorIdList.push(pro.webMonitorId)
    })
    for(let i = 0; i < webMonitorIdList.length; i ++) {
      param.webMonitorId = webMonitorIdList[i]
      let data = await CustomerPVModel.getAliveCusInRealTime(param)
      let uvCount = data[0].count
      let obj = {
        webMonitorId: webMonitorIdList[i],
        count: uvCount
      }
      uvList.push(obj)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', uvList)
  }
  

  static async getVersionCountOrderByCount(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getVersionCountOrderByCount(params);
    data.forEach((item, index) => {
      if (item.showName) {
        data[index].showName = utils.b64DecodeUnicode(item.showName)
      }
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  static async getCityCountOrderByCount(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getCityCountOrderByCount(params);
    for (let i = 0; i < data.length; i ++) {
      let cityKey = data[i].showName.replace("'", "")
      data[i].showName = citys[cityKey] || cityKey
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  static async getDeviceCountOrderByCount(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getDeviceCountOrderByCount(params);
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  static async getOsCountOrderByCount(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getOsCountOrderByCount(params);
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  static async getPvListByPage(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getPvListByPage(params);
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  static async getPvListTotalCountByTime(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getPvListTotalCountByTime(params);
    const count = data[0].count
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', count)
  }
  
  static async getSevenDaysLeftCount(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const sevenDayLeftKey = "sevenDayLeftArray" + params.webMonitorId + new Date().Format("yyyyMMdd")
    let data = null
    if (global.monitorInfo[sevenDayLeftKey]) {
      data = global.monitorInfo[sevenDayLeftKey]
    } else {
      const day = parseInt(params.day, 10)
      // const dateArray = []
      const result = []
      for (let i = day - 1; i > 0; i --) {
        const currentDay = utils.addDays(0 - i)
        try {
          const tempData = await CustomerPVModel.getSevenDaysLeftCount(params, currentDay);
          let obj = {date: currentDay, count: tempData[0].count}
          result.push(obj)
        } catch(e) {
          let obj = {date: currentDay, count: "0"}
          result.push(obj)
          log.printError(currentDay + "留存数据查询失败：", e)
        }
        
      }
      
      // const tempData = await CustomerPVModel.getSevenDaysLeftCount(params);
      // tempData.forEach((item, index) => {
      //   let obj = {date: dateArray[index], count: item.count}
      //   result.push(obj)
      // })
      data = result
      global.monitorInfo[sevenDayLeftKey] = result
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }
  
  static async getYesterdayLeftPercent(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    let data = null
    try {
      data = await CustomerPVModel.getYesterdayLeftPercent(params);
    } catch(e) {
      log.printError("次日留存率计算：", e)
      data = [ 
        { date: 'day1', count: '0' },
        { date: 'day2', count: '0' },
        { date: 'day3', count: '0' },
        { date: 'day4', count: '0' },
        { date: 'day5', count: '0' },
        { date: 'day6', count: '0' },
        { date: 'day7', count: '0' }
      ]
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }
  /**
   * 根据平台类型，获取设备分类
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getOsAnalysis(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    if (req) {
      const data = await CustomerPVModel.getCustomerCountByTime(params);
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', utils.handleDateResult(data, params.timeScope))
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }

  /**
   * 根据平台类型，获取设备分类
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getOsAnalysis(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    if (req) {
      const data = await CustomerPVModel.getCustomerCountByTime(params);
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', utils.handleDateResult(data, params.timeScope))
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }
}


class TimerCalculateController {

  /**
   * 修复数据
   */
  static async fixData(ctx) {
    let timer = null
    let hour = parseInt(new Date().Format("hh"), 10)
    let firstHour = hour
    if (hour == 0) return
    timer = setInterval(() => {
      console.log("正在修复 " + (firstHour - hour) + " 点的数据")
      if (hour == 0 && timer) {
        TimerCalculateController.calculateCountByDay(0)
        clearInterval(timer)
      } else {
        TimerCalculateController.calculateCountByHour(hour)
      }
      hour --
    }, 10000)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('修复请求已成功，修复时间大概需要5分钟。', 0)
  }

  /**
   * 定时计算每天的pv量，uv量，js错误量，http错误量，resource错误量
   */
  static async calculateCountByDay(dayIndex) {
    TimerCalculateController.calculateCountByDayForDays(dayIndex)
  }
  static async calculateCountByDayForDays(index) {

    // 设置pv限额
    const tempCount1 = 25
    const tempCount2 = 8
    

    const useDay = Utils.addDays(index)

    const infoCountByDayInfo = {
      uploadType: "",
      webMonitorId: "",
      dayName: "",
      dayCount: ""
    }
    const deviceInfoCountByDayInfo = {
      uploadType: "",
      webMonitorId: "",
      dayName: "",
      dayCount: "",
      showName: ""
    }

    /**
     * 根据项目分类计算
     */
    const tempCount3 = 550
    const projectList = await ProjectModel.getAllProjectList();
    for (let p = 0; p < projectList.length; p ++) {
      const webMonitorId = projectList[p].webMonitorId
      infoCountByDayInfo.webMonitorId = webMonitorId
      infoCountByDayInfo.dayName = useDay
      deviceInfoCountByDayInfo.webMonitorId = webMonitorId
      deviceInfoCountByDayInfo.dayName = useDay
      //========================PVUV数据相关==========================//
      const customerTypeArray = [
        {uploadTypeForDay: UPLOAD_TYPE.UV_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.UV_COUNT_HOUR},
        {uploadTypeForDay: UPLOAD_TYPE.PV_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.PV_COUNT_HOUR},
        {uploadTypeForDay: UPLOAD_TYPE.NEW_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.NEW_COUNT_HOUR},
        {uploadTypeForDay: UPLOAD_TYPE.IP_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.IP_COUNT_HOUR}
      ]
      for (let i = 0; i < customerTypeArray.length; i ++) {
        const tempObj = customerTypeArray[i]
        const cusData = await CustomerPVModel.getCusInfoCountForDay(webMonitorId, useDay, tempObj.uploadTypeForHour);
        infoCountByDayInfo.uploadType = tempObj.uploadTypeForDay
        infoCountByDayInfo.dayCount = cusData[0].count
        // 判断是否超出限额了
        // if (infoCountByDayInfo.dayCount > tempCount1 * tempCount2 * tempCount3 && infoCountByDayInfo.uploadType == UPLOAD_TYPE.PV_COUNT_DAY) {
        //   // 设置超出限额
        //   global.monitorInfo.overLimit = true
        // }

        const result_uv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, tempObj.uploadTypeForDay)
        if (result_uv.length <= 0) {
          await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
        } else {
          const id = result_uv[0].id
          await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
        }
      }
      //========================UV数据相关==========================//

      //========================用户跳出率计算相关==========================//
      const cusLeavePercentData = await CustomerPvLeaveModel.getCusLeavePercentForDay(webMonitorId, useDay, UPLOAD_TYPE.CUS_LEAVE_FOR_HOUR);
      infoCountByDayInfo.uploadType = UPLOAD_TYPE.CUS_LEAVE_FOR_DAY
      infoCountByDayInfo.dayCount = cusLeavePercentData
      const cusLeavePercentArr = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.CUS_LEAVE_FOR_DAY)
      if (cusLeavePercentArr.length <= 0) {
        await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      } else {
        const id = cusLeavePercentArr[0].id
        await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      }
      //========================用户跳出率计算相关==========================//

      //========================用户停留时长相关==========================//
      const stayTimeData = await CustomerStayTimeModel.getStayTimeForDay(webMonitorId, useDay, UPLOAD_TYPE.STAY_TIME_FOR_HOUR);
      infoCountByDayInfo.uploadType = UPLOAD_TYPE.STAY_TIME_FOR_DAY
      infoCountByDayInfo.dayCount = stayTimeData
      const result_uv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.STAY_TIME_FOR_DAY)
      if (result_uv.length <= 0) {
        await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      } else {
        const id = result_uv[0].id
        await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      }
      //========================用户停留时长相关==========================//

      //========================js错误相关==========================//
      // 计算js每天的报错量 on_error
      await JavascriptErrorInfoModel.calculateJsErrorCountByDay(webMonitorId, useDay).then( async(data) => {
        infoCountByDayInfo.uploadType = UPLOAD_TYPE.ON_ERROR
        infoCountByDayInfo.dayCount = data[0].count
        const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.ON_ERROR)
        if (result.length <= 0) {
          await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
        } else {
          const id = result[0].id
          await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
        }
      })
      // 计算js每小时的报错量 console_error
      await JavascriptErrorInfoModel.calculateConsoleErrorCountByDay(webMonitorId, useDay).then( async(data) => {
        infoCountByDayInfo.uploadType = UPLOAD_TYPE.CONSOLE_ERROR
        infoCountByDayInfo.dayCount = data[0].count
        const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.CONSOLE_ERROR)
        if (result.length <= 0) {
          await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
        } else {
          const id = result[0].id
          await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
        }
      })
      //========================js错误相关==========================//

      //========================接口错误相关==========================//
      // 计算接口每天的报错量
      await HttpErrorInfoModel.calculateHttpErrorCountByDay(webMonitorId, useDay).then( async(data) => {
        infoCountByDayInfo.uploadType = UPLOAD_TYPE.HTTP_ERROR
        infoCountByDayInfo.dayCount = data[0].count
        const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.HTTP_ERROR)
        if (result.length <= 0) {
          await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
        } else {
          const id = result[0].id
          await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
        }
      })
      //========================接口错误相关==========================//

      //========================静态资源错误相关==========================//
      // 计算静态资源每天的报错量 
      await ResourceLoadInfoModel.calculateResourceErrorCountByDay(webMonitorId, useDay).then( async(data) => {
        infoCountByDayInfo.uploadType = UPLOAD_TYPE.RESOURCE_ERROR
        infoCountByDayInfo.dayCount = data[0].count
        const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.RESOURCE_ERROR)
        if (result.length <= 0) {
          await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
        } else {
          const id = result[0].id
          await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
        }
      })
      //========================静态资源错误相关==========================//

      //========================接口耗时相关==========================//

      const httpTimeScopeArray = [
        {start: 0, end: 1, uploadTypeForDay: UPLOAD_TYPE.HTTP_COUNT_A, uploadTypeForHour: UPLOAD_TYPE.HTTP_HOUR_COUNT_A},
        {start: 1, end: 5, uploadTypeForDay: UPLOAD_TYPE.HTTP_COUNT_B, uploadTypeForHour: UPLOAD_TYPE.HTTP_HOUR_COUNT_B},
        {start: 5, end: 10, uploadTypeForDay: UPLOAD_TYPE.HTTP_COUNT_C, uploadTypeForHour: UPLOAD_TYPE.HTTP_HOUR_COUNT_C},
        {start: 10, end: 30, uploadTypeForDay: UPLOAD_TYPE.HTTP_COUNT_D, uploadTypeForHour: UPLOAD_TYPE.HTTP_HOUR_COUNT_D},
        {start: 30, end: 1000, uploadTypeForDay: UPLOAD_TYPE.HTTP_COUNT_E, uploadTypeForHour: UPLOAD_TYPE.HTTP_HOUR_COUNT_E}
      ]
      for(let i = 0; i < httpTimeScopeArray.length; i ++) {
        let timeObj = httpTimeScopeArray[i]
        await HttpLogInfoModel.calculateHttpLogCountForSecByDay(webMonitorId, useDay, timeObj.uploadTypeForHour).then( async(data) => {
          infoCountByDayInfo.uploadType = timeObj.uploadTypeForDay
          infoCountByDayInfo.dayCount = data[0].count
          const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, timeObj.uploadTypeForDay)
          if (result.length <= 0) {
            await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
          } else {
            const id = result[0].id
            await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
          }
        })
      }
      // // 计算每天接口耗时小于1秒的数据
      // await HttpLogInfoModel.calculateHttpLogCountForSecByDay(webMonitorId, useDay, 0, 1).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.HTTP_COUNT_A
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.HTTP_COUNT_A)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // // 计算每天接口耗时大于1秒小于等于5秒的数据
      // await HttpLogInfoModel.calculateHttpLogCountForSecByDay(webMonitorId, useDay, 1, 5).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.HTTP_COUNT_B
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.HTTP_COUNT_B)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // // 计算每天接口耗时大于5秒小于等于10秒的数据
      // await HttpLogInfoModel.calculateHttpLogCountForSecByDay(webMonitorId, useDay, 5, 10).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.HTTP_COUNT_C
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.HTTP_COUNT_C)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // // 计算每天接口耗时大于10秒小于等于30秒的数据
      // await HttpLogInfoModel.calculateHttpLogCountForSecByDay(webMonitorId, useDay, 10, 30).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.HTTP_COUNT_D
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.HTTP_COUNT_D)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // // 计算每天接口耗时大于30秒小于1000秒的数据
      // await HttpLogInfoModel.calculateHttpLogCountForSecByDay(webMonitorId, useDay, 30, 1000).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.HTTP_COUNT_E
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.HTTP_COUNT_E)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      //========================接口耗时相关==========================//

      //========================页面加载耗时相关==========================//

      const pageTimeScopeArray = [
        {start: 0, end: 1, uploadTypeForDay: UPLOAD_TYPE.PAGE_COUNT_A, uploadTypeForHour: UPLOAD_TYPE.PAGE_HOUR_COUNT_A},
        {start: 1, end: 5, uploadTypeForDay: UPLOAD_TYPE.PAGE_COUNT_B, uploadTypeForHour: UPLOAD_TYPE.PAGE_HOUR_COUNT_B},
        {start: 5, end: 10, uploadTypeForDay: UPLOAD_TYPE.PAGE_COUNT_C, uploadTypeForHour: UPLOAD_TYPE.PAGE_HOUR_COUNT_C},
        {start: 10, end: 30, uploadTypeForDay: UPLOAD_TYPE.PAGE_COUNT_D, uploadTypeForHour: UPLOAD_TYPE.PAGE_HOUR_COUNT_D},
        {start: 30, end: 1000, uploadTypeForDay: UPLOAD_TYPE.PAGE_COUNT_E, uploadTypeForHour: UPLOAD_TYPE.PAGE_HOUR_COUNT_E}
      ]

      for (let i = 0; i < pageTimeScopeArray.length; i ++) {
        let timeObj = pageTimeScopeArray[i]
        await LoadPageInfoModel.calculatePageCountForSecByDay(webMonitorId, useDay, timeObj.uploadTypeForHour).then( async(data) => {
          infoCountByDayInfo.uploadType = timeObj.uploadTypeForDay
          infoCountByDayInfo.dayCount = data[0].count
          const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, timeObj.uploadTypeForDay)
          if (result.length <= 0) {
            await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
          } else {
            const id = result[0].id
            await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
          }
        })
      }

      // // 计算每天页面加载耗时小于1秒的数据
      // await LoadPageInfoModel.calculatePageCountForSecByDay(webMonitorId, useDay, 0, 1).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.PAGE_COUNT_A
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.PAGE_COUNT_A)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // // 计算每天页面加载耗时大于1秒小于等于5秒的数据
      // await LoadPageInfoModel.calculatePageCountForSecByDay(webMonitorId, useDay, 1, 5).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.PAGE_COUNT_B
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.PAGE_COUNT_B)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // // 计算每天页面加载耗时大于5秒小于等于10秒的数据
      // await LoadPageInfoModel.calculatePageCountForSecByDay(webMonitorId, useDay, 5, 10).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.PAGE_COUNT_C
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.PAGE_COUNT_C)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // // 计算每天页面加载耗时大于10秒小于等于30秒的数据
      // await LoadPageInfoModel.calculatePageCountForSecByDay(webMonitorId, useDay, 10, 30).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.PAGE_COUNT_D
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.PAGE_COUNT_D)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // // 计算每天页面加载耗时大于30秒数据
      // await LoadPageInfoModel.calculatePageCountForSecByDay(webMonitorId, useDay, 30, 1000).then( async(data) => {
      //   infoCountByDayInfo.uploadType = UPLOAD_TYPE.PAGE_COUNT_E
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.PAGE_COUNT_E)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      //========================页面加载耗时相关==========================//


      //========================留存数据相关==========================//
      // 1. 计算每天的次日留存率
      let tempData = null
      try {
        tempData = await CustomerPVModel.getYesterdayLeftCount(webMonitorId, index);
        const firstCount = tempData[0] ? parseInt(tempData[0].count, 10) : 0
        const secondCount = tempData[1] ? parseInt(tempData[1].count, 10) : 0
        const percent = firstCount ? Utils.toFixed(secondCount / firstCount * 100, 2) : 0
        infoCountByDayInfo.uploadType = UPLOAD_TYPE.UV_YESTERDAY_PER
        infoCountByDayInfo.dayCount = percent
        const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.UV_YESTERDAY_PER)
        if (result.length <= 0) {
          await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
        } else {
          const id = result[0].id
          await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
        }
      } catch(e) {

        log.printError("第一天运行，昨日数据尚未生成，次日留存率计算出错，可以忽略此错误！", e)
      }
      //========================留存数据相关==========================//
      //========================设备信息计算相关==========================//

      const deviceTimeScopeArray = [
        {useDay, uploadTypeForDay: UPLOAD_TYPE.DEVICE_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.DEVICE_COUNT_HOUR},
        {useDay, uploadTypeForDay: UPLOAD_TYPE.CITY_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.CITY_COUNT_HOUR},
        {useDay, uploadTypeForDay: UPLOAD_TYPE.SYSTEM_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.SYSTEM_COUNT_HOUR},
        {useDay, uploadTypeForDay: UPLOAD_TYPE.VERSION_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.VERSION_COUNT_HOUR}
      ]

      for (let m = 0; m < deviceTimeScopeArray.length; m ++) {
        let tempObj = deviceTimeScopeArray[m]

        await DeviceInfoCountByDayModel.getDeviceCountByDay(webMonitorId, useDay, tempObj.uploadTypeForHour).then( async(deviceInfoData) => {
          for (let i = 0; i < deviceInfoData.length; i ++) {
            let infoData = deviceInfoData[i]
            deviceInfoCountByDayInfo.uploadType = tempObj.uploadTypeForDay
            deviceInfoCountByDayInfo.dayCount = infoData.count
            deviceInfoCountByDayInfo.showName = infoData.showName
            const result = await DeviceInfoCountByDayModel.getDeviceInfoCountByDayDetailByDayName(useDay, webMonitorId, tempObj.uploadTypeForDay, deviceInfoCountByDayInfo.showName)
            if (result.length <= 0) {
              await DeviceInfoCountByDayModel.createDeviceInfoCountByDay(deviceInfoCountByDayInfo)
            } else {
              const id = result[0].id
              await DeviceInfoCountByDayModel.updateDeviceInfoCountByDay(id, deviceInfoCountByDayInfo)
            }
          }
        })
      }
      //========================设备信息计算相关==========================//
    }

    /**
     * 根据埋点分类计算
     */
    const locationPointTypeResult = await LocationPointTypeModel.getLocationPointTypeList();
    const locationPointTypeList = locationPointTypeResult.rows
    const typeList = [UPLOAD_TYPE.LOCATION_POINT_TYPE, UPLOAD_TYPE.LOCATION_UV_TYPE]
    for (let i = 0; i < locationPointTypeList.length; i ++) {
      const id = locationPointTypeList[i].id
      for (let m=0; m <typeList.length; m ++) {
        const locationPointType = typeList[m] + id   // 上报类型加上字符串前缀: l-d-
        await LocationPointModel.calculateLocationPointCountByDay(locationPointType, useDay).then( async(data) => {
          infoCountByDayInfo.uploadType = locationPointType
          infoCountByDayInfo.dayCount = data[0].count
          infoCountByDayInfo.webMonitorId = ""
          const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, "", locationPointType)
          if (result.length <= 0) {
            await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
          } else {
            const id = result[0].id
            await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
          }
        })
      }
    }
  }

  /**
   * 定时计算每小时的pv量，uv量，js错误量，http错误量， resource错误量
   */
  static async calculateCountByHour(index) {
    TimerCalculateController.calculateCountByHourForDetailHour(index)
  }
  static async calculateCountByHourForDetailHour(hourIndex) {
    const lastHourTime = new Date().getTime() - hourIndex * 3600 * 1000
    const lastHour = new Date(lastHourTime).Format("yyyy-MM-dd hh") + ":00:00"
    const hour = new Date(lastHourTime + 3600 * 1000).Format("yyyy-MM-dd hh") + ":00:00"

    const sevenDayHour = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000 - hourIndex * 3600 * 1000).Format("MM-dd hh")
    const useHour = lastHour.substring(5, 13)
    const infoCountByHourInfo = {
      uploadType: "",
      webMonitorId: "",
      hourName: "",
      hourCount: ""
    }
    const deviceInfoCountByHourInfo = {
      uploadType: "",
      webMonitorId: "",
      hourName: "",
      hourCount: "",
      showName: ""
    }
    const projectList = await ProjectModel.getAllProjectList();
    for (let p = 0; p < projectList.length; p ++) {
      const webMonitorId = projectList[p].webMonitorId
      infoCountByHourInfo.webMonitorId = webMonitorId
      infoCountByHourInfo.hourName = useHour
      deviceInfoCountByHourInfo.webMonitorId = webMonitorId
      deviceInfoCountByHourInfo.hourName = useHour
      //========================PVUV相关==========================//
      // 计算每小时UV活跃量
      await CustomerPVModel.calculateUvCountByHour(webMonitorId, lastHour, hour).then( async(uvData) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.UV
        infoCountByHourInfo.hourCount = uvData[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.UV)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })
      // 计算每小时UV唯一数量，相加可得总量
      await CustomerPVModel.calculateTotalUvCountByHour(webMonitorId, lastHour, hour).then( async(uvData) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.UV_COUNT_HOUR
        infoCountByHourInfo.hourCount = uvData[0].count * 1
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.UV_COUNT_HOUR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })
      // 计算PV量
      await CustomerPVModel.calculatePvCountByHour(webMonitorId, lastHour, hour).then( async(pvData) => {
        
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.PV_COUNT_HOUR
        infoCountByHourInfo.hourCount = pvData[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.PV_COUNT_HOUR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })
      // 计算新用户活跃量
      await CustomerPVModel.calculateNewCustomerCountByHour(webMonitorId, lastHour, hour).then( async(newCustomerData) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.NEW_CUSTOMER
        infoCountByHourInfo.hourCount = newCustomerData[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.NEW_CUSTOMER)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })

      // 计算新用户唯一数量，相加可得新用户总和
      await CustomerPVModel.calculateTotalNewCustomerCountByHour(webMonitorId, lastHour, hour).then( async(newCustomerData) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.NEW_COUNT_HOUR
        infoCountByHourInfo.hourCount = newCustomerData[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.NEW_COUNT_HOUR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })

      // 计算IP唯一数量，相加可得IP总和
      await CustomerPVModel.calculateTotalIPCountByHour(webMonitorId, lastHour, hour).then( async(newCustomerData) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.IP_COUNT_HOUR
        infoCountByHourInfo.hourCount = newCustomerData[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.IP_COUNT_HOUR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })

      // 计算每小时用户平均停留时间
      await CustomerStayTimeModel.calculateStayTimeByHour(webMonitorId, lastHour, hour).then( async(stayTimeData) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.STAY_TIME_FOR_HOUR
        infoCountByHourInfo.hourCount = stayTimeData
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.STAY_TIME_FOR_HOUR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })

      // 计算每小时用户的跳出率
      await CustomerPvLeaveModel.calculateCusLeavePercentByHour(webMonitorId, lastHour, hour).then( async(leavePercent) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.CUS_LEAVE_FOR_HOUR
        infoCountByHourInfo.hourCount = leavePercent
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.CUS_LEAVE_FOR_HOUR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })

      // 计算用户安装频次，清理缓存后也算重新安装
      /**
       await CustomerPVModel.calculateInstallCountByHour(webMonitorId, lastHour, hour).then( async(count) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.INSTALL_COUNT
        infoCountByHourInfo.hourCount = count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.INSTALL_COUNT)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })
       */
      
      //========================PVUV相关==========================//

      //========================js错误相关==========================//
      // 计算js每小时的报错量 on_error
      await JavascriptErrorInfoModel.calculateJsErrorCountByHour(webMonitorId, lastHour, hour).then( async(data) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.ON_ERROR
        infoCountByHourInfo.hourCount = data[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.ON_ERROR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })
      // 计算js每小时的报错量 console_error
      await JavascriptErrorInfoModel.calculateConsoleErrorCountByHour(webMonitorId, lastHour, hour).then( async(data) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.CONSOLE_ERROR
        infoCountByHourInfo.hourCount = data[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.CONSOLE_ERROR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })
      //========================js错误相关==========================//

      //========================静态资源错误相关==========================//
      // 计算静态资源每小时的报错量
      await ResourceLoadInfoModel.calculateResourceErrorCountByHour(webMonitorId, lastHour, hour).then( async(data) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.RESOURCE_ERROR
        infoCountByHourInfo.hourCount = data[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.RESOURCE_ERROR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })
      //========================静态资源错误相关==========================//

      //========================接口请求错误相关==========================//
      // 接口请求每小时的报错量
      await HttpErrorInfoModel.calculateHttpErrorCountByHour(webMonitorId, lastHour, hour).then( async(data) => {
        infoCountByHourInfo.uploadType = UPLOAD_TYPE.HTTP_ERROR
        infoCountByHourInfo.hourCount = data[0].count
        const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.HTTP_ERROR)
        if (result.length <= 0) {
          await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
        } else {
          const id = result[0].id
          await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
        }
      })
      //========================接口请求错误相关==========================//

      //========================接口耗时相关==========================//
      // 计算每小时接口耗时数据
      const httpTimeScopeArray = [
        {start: 0, end: 1, uploadType: UPLOAD_TYPE.HTTP_HOUR_COUNT_A},
        {start: 1, end: 5, uploadType: UPLOAD_TYPE.HTTP_HOUR_COUNT_B},
        {start: 5, end: 10, uploadType: UPLOAD_TYPE.HTTP_HOUR_COUNT_C},
        {start: 10, end: 30, uploadType: UPLOAD_TYPE.HTTP_HOUR_COUNT_D},
        {start: 30, end: 1000, uploadType: UPLOAD_TYPE.HTTP_HOUR_COUNT_E}
      ]
      for (let i = 0; i < httpTimeScopeArray.length; i ++) {
        let timeObj = httpTimeScopeArray[i]
        await HttpLogInfoModel.calculateHttpLogCountForSecByHour(webMonitorId, lastHour, hour, timeObj.start, timeObj.end).then( async(data) => {
          infoCountByHourInfo.uploadType = timeObj.uploadType
          infoCountByHourInfo.hourCount = data[0].count
          const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, timeObj.uploadType)
          if (result.length <= 0) {
            await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
          } else {
            const id = result[0].id
            await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
          }
        })
      }
      //========================接口耗时相关==========================//
      //========================页面加载耗时相关==========================//
      // 计算每小时页面加载耗时数据
      const pageTimeScopeArray = [
        {start: 0, end: 1, uploadType: UPLOAD_TYPE.PAGE_HOUR_COUNT_A},
        {start: 1, end: 5, uploadType: UPLOAD_TYPE.PAGE_HOUR_COUNT_B},
        {start: 5, end: 10, uploadType: UPLOAD_TYPE.PAGE_HOUR_COUNT_C},
        {start: 10, end: 30, uploadType: UPLOAD_TYPE.PAGE_HOUR_COUNT_D},
        {start: 30, end: 1000, uploadType: UPLOAD_TYPE.PAGE_HOUR_COUNT_E}
      ]
      for (let i = 0; i < pageTimeScopeArray.length; i ++) {
        let timeObj = pageTimeScopeArray[i]
        await LoadPageInfoModel.calculatePageCountForSecByHour(webMonitorId, lastHour, hour, timeObj.start, timeObj.end).then( async(data) => {
          infoCountByHourInfo.uploadType = timeObj.uploadType
          infoCountByHourInfo.hourCount = data[0].count
          const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, timeObj.uploadType)
          if (result.length <= 0) {
            await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
          } else {
            const id = result[0].id
            await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
          }
        })
      }
      //========================页面加载耗时相关==========================//

      //========================设备信息计算相关==========================//
      const deviceTimeScopeArray = [
        {key: "deviceName", uploadType: UPLOAD_TYPE.DEVICE_COUNT_HOUR},
        {key: "city", uploadType: UPLOAD_TYPE.CITY_COUNT_HOUR},
        {key: "os", uploadType: UPLOAD_TYPE.SYSTEM_COUNT_HOUR},
        {key: "projectVersion", uploadType: UPLOAD_TYPE.VERSION_COUNT_HOUR}
      ]
      for (let m = 0; m < deviceTimeScopeArray.length; m ++) {
        let tempObj = deviceTimeScopeArray[m]
        await CustomerPVModel.getDeviceCountByHour(webMonitorId, lastHour, hour, tempObj.key).then( async(deviceData) => {
          for (let i = 0; i < deviceData.length; i ++) {
            let deviceInfo = deviceData[i]
            deviceInfoCountByHourInfo.uploadType = tempObj.uploadType
            deviceInfoCountByHourInfo.hourCount = deviceInfo.count
            deviceInfoCountByHourInfo.showName = deviceInfo.showName
            const result = await DeviceInfoCountByHourModel.getDeviceInfoCountByIdByHourName(useHour, webMonitorId, tempObj.uploadType, deviceInfoCountByHourInfo.showName)
            if (result.length <= 0) {
              await DeviceInfoCountByHourModel.createDeviceInfoCountByHour(deviceInfoCountByHourInfo)
            } else {
              const id = result[0].id
              await DeviceInfoCountByHourModel.updateDeviceInfoCountByHour(id, deviceInfoCountByHourInfo)
            }
          }
        })
      }
    }
    /**
     * 根据埋点分类计算每小时的数据
     */
    const locationPointTypeResult = await LocationPointTypeModel.getLocationPointTypeList();
    const locationPointTypeList = locationPointTypeResult.rows
    for (let i = 0; i < locationPointTypeList.length; i ++) {
      const id = locationPointTypeList[i].id

      let locationPointType = UPLOAD_TYPE.LOCATION_POINT_TYPE + id   // 上报类型加上字符串前缀: l-d-
      await LocationPointModel.getLocationPointCountByHour(lastHour, hour, locationPointType).then( async(data) => {
        infoCountByHourInfo.uploadType = locationPointType
        infoCountByHourInfo.hourCount = data[0].count
        infoCountByHourInfo.webMonitorId = ""
        await InfoCountByHourModel.getLocationPointCountByIdByHourName(useHour, locationPointType).then( async(result) => {
          if (result.length <= 0) {
            await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
          } else {
            const id = result[0].id
            await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
          }
        })
      })

      let locationPointUvType = UPLOAD_TYPE.LOCATION_UV_TYPE + id   // 上报类型加上字符串前缀: l-d-
      await LocationPointModel.getLocationPointCountForUvByHour(lastHour, hour, locationPointType).then( async(data) => {
        infoCountByHourInfo.uploadType = locationPointUvType
        infoCountByHourInfo.hourCount = data[0].count
        infoCountByHourInfo.webMonitorId = ""
        await InfoCountByHourModel.getLocationPointCountByIdByHourName(useHour, locationPointUvType).then( async(result) => {
          if (result.length <= 0) {
            await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
          } else {
            const id = result[0].id
            await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
          }
        })
      })

      //////////计算每天某个埋点产生的数量 开始/////////////////////
      // await LocationPointModel.calculateLocationPointCountByDay(locationPointType, useDay).then( async(data) => {
      //   infoCountByDayInfo.uploadType = locationPointType
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailForLocationPointByDayName(useDay, locationPointType)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      // //////////计算每天某个埋点产生的数量 结束/////////////////////
      // //////////计算每天某个埋点产生的UV数量 开始/////////////////////
      // const locationPointUvType = UPLOAD_TYPE.LOCATION_UV_TYPE + id
      // await LocationPointModel.calculateLocationPointUvCountByDay(locationPointType, useDay).then( async(data) => {
      //   infoCountByDayInfo.uploadType = locationPointUvType
      //   infoCountByDayInfo.dayCount = data[0].count
      //   const result = await InfoCountByDayModel.getInfoCountByDayDetailForLocationPointByDayName(useDay, locationPointUvType)
      //   if (result.length <= 0) {
      //     await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      //   } else {
      //     const id = result[0].id
      //     await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      //   }
      // })
      //////////计算每天某个埋点产生UV的数量 结束/////////////////////
    }
  }
}


let webfunnyVersion = "1.8.2"
class Common {

  /**
   * 激活码解密
   */
  static decryptPurchaseCode(purchaseCode) {
    if (purchaseCode.length == 20 && purchaseCode[19] == "Z") {
      let isValid = false
      const count1 = purchaseCode.charAt(4).charCodeAt()
      const count2 = purchaseCode.charAt(9).charCodeAt()
      let productType = count2 - count1
      // 开始解密
      const secret = {P: "1", Z: "2", D: "3", W: "4", U: "5", B: "6", S: "7", M: "8", G: "9", K: "0"}
      const locationArr = [19, 12, 7, 17, 10, 8, 15, 1]
      const yearStr = secret[purchaseCode[locationArr[0]]] + secret[purchaseCode[locationArr[1]]] + secret[purchaseCode[locationArr[2]]]+ secret[purchaseCode[locationArr[3]]]
      const monthStr = secret[purchaseCode[locationArr[4]]] + secret[purchaseCode[locationArr[5]]]
      const dayStr = secret[purchaseCode[locationArr[6]]] + secret[purchaseCode[locationArr[7]]]
      const dateStr = yearStr + "-" + monthStr + "-" + dayStr
      const todayStr = new Date().Format("yyyy-MM-dd")
      const reg = /\d{4}-\d{2}-\d{2}/
      
      if (count1 >= 48 && count1 <= 57) {
        // count1 如果是数字，则属于旧版本激活码，直接失效
        isValid = false
      } else if (reg.test(dateStr) && dateStr > todayStr) {
        // 验证码有效
        isValid = true
      } else {
        // 验证码无效效
        isValid = false
      }
      global.monitorInfo.purchaseCodeEndDate = dateStr
      global.monitorInfo.purchaseCodeValid = isValid
      global.monitorInfo.purchaseCodeType = productType
      return { isValid, productType}
    } else {
      let isValid = false
      let dateStr = ""
      let todayStr = new Date().Format("yyyy-MM-dd")
      const reg = /\d{4}-\d{2}-\d{2}/
      // 位数只能是20，25位，直接失效
      if (!(purchaseCode.length == 20 || purchaseCode.length == 25)) {
        return {isValid: false, productType: 0}
      }
      // 必须是20或25位纯大写字母
      const regCaps = /^[A-Z]{20,25}$/
      if (!regCaps.test(purchaseCode)) {
        return {isValid: false, productType: 0}
      }

      let productType = 0
      const count1 = purchaseCode.charAt(4).charCodeAt()
      const count2 = purchaseCode.charAt(9).charCodeAt()
      const tempCount1 = count2 - count1
      if (purchaseCode.length == 20) {
        productType = tempCount1
      } else if (purchaseCode.length == 25) {
        const count3 = purchaseCode.charAt(20).charCodeAt()
        const count4 = purchaseCode.charAt(22).charCodeAt()
        const tempCount2 = (count4 - count3) * 10
        productType = tempCount1 + tempCount2
      }

      productType = parseInt(productType, 10)

      const secrets = [
        {P: "1", X: "2", D: "3", W: "4", U: "5", B: "6", S: "7", M: "8", G: "9", K: "0"},
        {Z: "1", A: "2", D: "3", V: "4", M: "5", C: "6", N: "7", K: "8", J: "9", L: "0"},
        {Y: "1", Q: "2", I: "3", T: "4", V: "5", R: "6", H: "7", C: "8", P: "9", U: "0"},
        {S: "1", W: "2", Z: "3", F: "4", Q: "5", J: "6", T: "7", B: "8", V: "9", I: "0"},
        {E: "1", B: "2", Q: "3", V: "4", X: "5", Y: "6", T: "7", G: "8", S: "9", M: "0"},
      ]
      for (let i = 0; i < secrets.length; i ++) {
        // 开始解密
        const secret = secrets[i]
        const locationArr = [19, 12, 7, 17, 10, 8, 15, 1]
        const year0 = secret[purchaseCode[locationArr[0]]]
        const year1 = secret[purchaseCode[locationArr[1]]]
        const year2 = secret[purchaseCode[locationArr[2]]]
        const year3 = secret[purchaseCode[locationArr[3]]]
        // 年份的字母必须是我们挑中的字母
        if (!(year0 && year1 && year2 && year3)) {
          continue
        }
        // 年份的前2位必须是20
        if (!(year0 == "2" && year1 == "0")) {
          continue
        }

        const yearStr = year0 + year1 + year2 + year3

        const month0 = secret[purchaseCode[locationArr[4]]]
        const month1 = secret[purchaseCode[locationArr[5]]]
        // 月份的字母必须是我们挑中的字母
        if (!(month0 && month1)) {
          continue
        }
        const monthStr = month0 + month1
        // 月份不能大于12
        if (monthStr > "12") {
          continue
        }


        const day0 = secret[purchaseCode[locationArr[6]]]
        const day1 = secret[purchaseCode[locationArr[7]]]
        // 天数也必须是我们选中的字母
        if (!(day0 && day1)) {
          continue
        }
        const dayStr = day0 + day1
        // 天数不能大于31
        if (monthStr > "31") {
          continue
        }

        // MTNOKPQATTMRMSTAUMVA

        const emptyArray = [0, 2, 3, 5, 6, 11, 13, 14, 16, 18, 21, 23, 24]

        if (purchaseCode.length == 20) {
          for (let m = 0; m < emptyArray.length - 4; m ++) {
            let temp1 = purchaseCode.charAt(emptyArray[m]).charCodeAt()
            let temp2 = purchaseCode.charAt(emptyArray[m + 1]).charCodeAt()
            // 空位之间相隔必须是1
            if (temp2 - temp1 != 1) {
              return {isValid: false, productType: 0}
            }
          }
        } else if (purchaseCode.length == 25) {
          for (let m = 0; m < emptyArray.length - 1; m ++) {
            let temp1 = purchaseCode.charAt(emptyArray[m]).charCodeAt()
            let temp2 = purchaseCode.charAt(emptyArray[m + 1]).charCodeAt()
            // 空位之间相隔必须是1
            if (temp2 - temp1 != 1) {
              return {isValid: false, productType: 0}
            }
          }
        }
        
        dateStr = yearStr + "-" + monthStr + "-" + dayStr
        break
      }
      
      if (reg.test(dateStr) && dateStr > todayStr) {
        isValid = true
      }
      global.monitorInfo.purchaseCodeEndDate = dateStr
      global.monitorInfo.purchaseCodeValid = isValid
      global.monitorInfo.purchaseCodeType = productType
      return { isValid, productType}
    }
  }
  static async consoleLogo() {
    console.log(" __          __  ______   ____    ______   _    _   _   _   _   _  __     __       _____   _   _ ")
    console.log(" \\ \\        / / |  ____| |  _ \\  |  ____| | |  | | | \\ | | | \\ | | \\ \\   / /      / ____| | \\ | |")
    console.log("  \\ \\  /\\  / /  | |__    | |_) | | |__    | |  | | |  \\| | |  \\| |  \\ \\_/ /      | |      |  \\| |")
    console.log("   \\ \\/  \\/ /   |  __|   |  _ <  |  __|   | |  | | | . ` | | . ` |   \\   /       | |      | . ` |")
    console.log("    \\  /\\  /    | |____  | |_) | | |      | |__| | | |\\  | | |\\  |    | |     _  | |____  | |\\  |")
    console.log("     \\/  \\/     |______| |____/  |_|       \\____/  |_| \\_| |_| \\_|    |_|    (_)  \\_____| |_| \\_|")
    console.log(" ")
    console.log(" ")
    console.log("服务启动中，请等待...")
    console.log("")
  }
  static async consoleInfo(startType) {
    if (startType) {
        console.log("启动 " + startType + " 模式...");
    }
    console.log("服务启动成功...")
    console.log("")
    console.log("==============================================================")
    console.log("= ")
    console.log("=【 作者：一步一个脚印一个坑 】")
    console.log("=【 邮箱: 597873885@qq.com 】")
    console.log("=【 微信: webfunny_2020 】")
    console.log("= ")
    console.log("= 初始化管理员：http://localhost:8010/webfunny/register.html?type=1 ")
    console.log("= 首页地址：http://localhost:8010/webfunny/home.html ")
    console.log("= 部署问题：http://www.webfunny.cn/website/faq.html")
    console.log("= ")
    console.log("\x1B[33m%s\x1b[0m", "= 启动服务：npm run prd")
    console.log("\x1B[33m%s\x1b[0m", "= 重启服务：npm run restart")
    console.log("\x1B[33m%s\x1b[0m", "= 停止并kill掉原来进程：pm2 stop webfunny | pm2 delete webfunny")
    console.log("= ")
    console.log("==============================================================")
    console.log("")
  }
  /*
   * 激活码检查
   * @static
   */
  static async checkPurchase(callback, failCallback) {
    const isValidMsg = "激活码无效，或已经过期，请进入网站创建激活码：http://www.webfunny.cn/purchase.html"
    // 先检查默认配置有没有激活码，如果没有激活码，则自动为其填充一个免费版激活码
    if (accountInfo.purchaseCode === "AAAABBBBCCCCDDDD") {
      // 统计初始ABCD激活码
      Utils.post("http://www.webfunny.cn/server/upBp", {userId: accountInfo.purchaseCode, locationPointId: 6}).then(() => {}).catch((e) => {})

      // 如果是ABCD激活码，则自动给他生成一个试用版激活码
      await Utils.get("http://www.webfunny.cn/config/initPurchaseCode", {webfunnyVersion}).then(async(result) => {
        const inputPurchaseCode = result.data
        const newString = `module.exports = {
          purchaseCode: '${inputPurchaseCode}',
        }`
        await fs.writeFile("./bin/purchaseCode.js", newString, (err) => {
          if (err) {
            throw err;
          }
          Common.restartServer()
        });
      }).catch((e) => {
        callback()
      })
      return
    }
    // 对黑名单做校验：不在库里的激活码，和真的黑名单，统一都叫黑名单
    let isBlacklist = false
    await Utils.postJson("http://www.webfunny.cn/config/isBlacklist", {cdkey: accountInfo.purchaseCode, webfunnyVersion}).then((result) => {
      isBlacklist = result.data
    }).catch((e) => {
      isBlacklist = false
    })

    if (isBlacklist === true) {
      setTimeout(function() {
        console.log("\x1b[91m%s\x1b[0m", isValidMsg)
        log.printError(isValidMsg)
      }, 2000)
      // 黑名单埋点
      Utils.post("http://www.webfunny.cn/server/upBp", {userId: accountInfo.purchaseCode, locationPointId: 7}).then(() => {}).catch((e) => {})
      failCallback()
      return
    }

    // 激活码有效性判断
    const { productType, isValid } = Common.decryptPurchaseCode(accountInfo.purchaseCode)
    if (isValid == true) {
      // 启动试用版激活码，埋点
      if (productType == 0) {
        Utils.post("http://www.webfunny.cn/server/upBp", {userId: accountInfo.purchaseCode, locationPointId: 4}).then(() => {}).catch((e) => {})
      }
      // 如果激活码有效，发送部署统计数据
      const ipAddress = IP.address()
      const happenTime = new Date().getTime()
      Utils.postJson("http://www.webfunny.cn/config/memberActiveDeploy", {cdkey: accountInfo.purchaseCode, ip: ipAddress, webfunnyVersion, happenTime}).then(() => {}).catch((e) => {})
      // 设置激活码全局状态为true
      global.monitorInfo.purchaseCodeValid = true
      global.monitorInfo.productType = productType
      callback()
    } else {
      setTimeout(() => {
        console.log("\x1b[91m%s\x1b[0m", isValidMsg)
        log.printError(isValidMsg)
      }, 3000)
      failCallback()
      // 激活码无效的埋点
      Utils.post("http://www.webfunny.cn/server/upBp", {userId: accountInfo.purchaseCode, locationPointId: 5}).then(() => {}).catch((e) => {})
    }
  }
  /**
   * 接受并分类处理上传的日志
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upLog(ctx) {
    const monitorInfo = global.monitorInfo
    if (monitorInfo.purchaseCodeValid !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("激活码失效了，请按照页面引导，创建激活码。", false)
      return
    }
    if (monitorInfo.logServerStatus !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("服务已暂停", false)
      return
    }
    // if (monitorInfo.overLimit === true && monitorInfo.productType < 10) {
    //   ctx.response.status = 200;
    //   ctx.body = statusCode.SUCCESS_200("PV量超出限额，请升级激活码", false)
    //   return
    // }
    var req = ctx.req
    const clientIpString = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let browserInfo = ctx.req.headers['user-agent']
    let infoType = ""
    let errorLogInfo = ctx.request.body
    if (typeof errorLogInfo === "string" && errorLogInfo.indexOf("STAY_TIME") != -1) {
      // 如果errorLogInfo是字符串，说明有可能是关闭页面时navigator.sendBeacon发来的日志
      var logInfo = JSON.parse(errorLogInfo)
      for( let key in logInfo) {
        if (monitorKeys[key]) {
          logInfo[monitorKeys[key]] = logInfo[key]
          delete logInfo[key]
        }
      }
      Common.handleLogInfo(logInfo)
    } else {
      try {
        // const paramStr = ctx.request.body.data.replace(/": Script error\./g, "script error")
        // const param = JSON.parse(paramStr)
        // const { logInfo } = param
        // if (!logInfo) {
        //   console.log(param, typeof param)
        // }
        const logArray = Utils.logParseJson(ctx.request.body.data)
        // 处理返回值开始
        const tempLogInfo = JSON.parse(logArray[0]);
        const userId = Utils.md5Encrypt(tempLogInfo.c) // 这里是缩短版的key值
        const webMonitorId = tempLogInfo.a
        const userIdArray = global.monitorInfo.userIdArray
        let status = ""
        if (userIdArray.indexOf(userId) != -1) {
          status = "c"
        } else {
          status = "d"
        }
        // 监控功能启动列表
        let startList = global.monitorInfo[webMonitorId + "startList"]
        if (!(startList && startList.length > 0)) {
          // 如果全局变量里边没有启动列表，就使用默认列表
          startList = "012345"
        }
        let waitCounts = global.monitorInfo.waitCounts
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200("", {d: status, s: startList, w: waitCounts})
        // 处理返回值结束
        for(var i = 0; i < logArray.length; i ++) {
          if (!logArray[i]) continue;
          const logInfo = JSON.parse(logArray[i]);
          for( let key in logInfo) {
            if (monitorKeys[key]) {
              logInfo[monitorKeys[key]] = logInfo[key]
              delete logInfo[key]
            }
          }
          logInfo.monitorIp = logInfo.monitorIp ? logInfo.monitorIp : clientIpString
          logInfo.userId = Utils.md5Encrypt(logInfo.userId || "")
          logInfo.completeUrl = Utils.b64DecodeUnicode(logInfo.completeUrl);
          // 对url进行加密处理
          // Common.encryptUrl(logInfo)
          infoType = logInfo.uploadType
  
          // 这个位置决定是否放入到消息队列中
          const { accountInfo } = AccountConfig
          const { messageQueue } = accountInfo
          if (messageQueue === true) {
            // 订阅版
            // 启动消息对列
            const logInfoMsg2 = JSON.stringify(logInfo)
            sendMq.sendQueueMsg("upload_log_b", logInfoMsg2, (res) => {
            },(error) => {
              log.printError("消息队列推送报错: " + logInfo.uploadType, error )
            })
          } else {
            Common.handleLogInfo(logInfo, browserInfo)
          }
        }
      } catch(e) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200("", "")
        const logMsg = typeof errorLogInfo == "object" ? JSON.stringify(errorLogInfo) : errorLogInfo
        log.printError("上报接口报错 -- " + infoType)
        log.printError(logMsg)
        log.printError("堆栈 -- ", e)
      }
    }
  }
  static async setWebMonitorIdList() {
    const data = await ProjectModel.getWebMonitorIdList()
    let webMonitorIdList = []
    let webMonitorIdListStr = ""
    data.forEach((obj, index) => {
        webMonitorIdList.push(obj.webMonitorId)
        if (index == data.length - 1) {
          webMonitorIdListStr += "'" + obj.webMonitorId + "'"
        } else {
          webMonitorIdListStr += "'" + obj.webMonitorId + "',"
        }
    })
    global.monitorInfo.webMonitorIdList = webMonitorIdList

    const newString = `module.exports = [${webMonitorIdListStr}]`
    await fs.writeFile("./bin/webMonitorIdList.js", newString, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  // 查询停止上报的服务列表
  static async setStopWebMonitorIdList() {
    global.monitorInfo.stopWebMonitorIdList = stopWebMonitorIdList
  }
  /**
   * 接收消息队列里的信息
   * @static
   * @memberof Common
   */
  static async startReceiveMsg() {
    try {
      const receiveMq = new RabbitMq()
      receiveMq.receiveQueueMsg("upload_log_b", async (logInfoStr, channelAck) => {
        try {
          const logInfo = JSON.parse(logInfoStr)
          Common.handleLogInfo(logInfo)
          // 只有存储成功了才会ack消息
          channelAck()
        } catch (e) {
          channelAck()
          log.printError(e)
        }
      }, () => {
        log.printError("获取消息失败")
      })
    } catch (e) {
      log.printError("消息队列接收端启动失败")
    }
  }

  static async handleLogInfo(logInfo, browserInfo) {
    const {webMonitorId} = logInfo
    // 判断webMonitorId是不是在暂停列表里
    if (global.monitorInfo.stopWebMonitorIdList.indexOf(webMonitorId) != -1) return

    // 如果webMonitorId不在库里，则丢弃当前日志
    // if (global.monitorInfo.webMonitorIdList.indexOf(webMonitorId) == -1) {
    //   log.printError("应用标识 " + webMonitorId + " 不在库内")
    //   return
    // }
    // console.log(webMonitorId, global.monitorInfo.webMonitorIdList, global.monitorInfo.webMonitorIdList.indexOf(webMonitorId))
    // if (wmVersion && webfunnyVersion != wmVersion) {
    //   log.printError("版本号异常 -> 探针版本：" + wmVersion + "; 系统版本：" + webfunnyVersion)
    // }

    // 进来一个日志，全局变量加1
    global.monitorInfo.logCountInMinute ++

    const ipReg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
    let ipArr = []
    // 有些日志是没有ip的
    try {
      ipArr = logInfo.monitorIp.match(ipReg)
      logInfo.monitorIp = ipArr && ipArr.length > 0 ? ipArr[0] : logInfo.monitorIp
    } catch(e) {

    }
    if (logInfo.customerKey && logInfo.customerKey.length > 50) {
      logInfo.customerKey = logInfo.customerKey.substring(0, 49)
    }
    if (logInfo.pageKey && logInfo.pageKey.length > 36) {
      logInfo.pageKey = logInfo.pageKey.substring(0, 35)
    }
    logInfo.happenDate = logInfo.happenTime ? new Date(parseInt(logInfo.happenTime, 10)).Format("yyyy-MM-dd hh:mm:ss") : new Date().Format("yyyy-MM-dd hh:mm:ss")
    switch (logInfo.uploadType) {
      case "ELE_BEHAVIOR":
        await BehaviorInfoModel.createBehaviorInfo(logInfo);
        break;
      case "JS_ERROR":
        handleResultWhenJavascriptError(logInfo)
        await JavascriptErrorInfoModel.createJavascriptErrorInfo(logInfo, Sequelize);
        break;
      case "HTTP_LOG":
        if (logInfo.responseText) {
          console.log(logInfo.responseText)
          logInfo.responseText = logInfo.responseText.length > 500 ? "内容太长" : logInfo.responseText
        }
        handleResultWhenHttpRequest(logInfo)
        const status = parseInt(logInfo.status || 0)
        
        // 处理simpleHttpUrl
        try {
          let httpUrl = decodeURIComponent(Utils.b64DecodeUnicode(logInfo.httpUrl));
          // httpUrl = httpUrl ? httpUrl.replace(/([0-9a-zA-Z]{4}-){2,4}[0-9a-zA-Z]{1,4}/g, "****-") : httpUrl
          const simpleHttpUrl = httpUrl.split("?")[0];
          logInfo.simpleHttpUrl = simpleHttpUrl;
          logInfo.httpUrl = Utils.b64DecodeUnicode(encodeURIComponent(httpUrl));
        } catch(e) {
          log.error(ctx, e, new Date())
        }

        if (status > 299) {
          await HttpErrorInfoModel.createHttpErrorInfo(logInfo, Sequelize);
        } else {
          await HttpLogInfoModel.createHttpLogInfo(logInfo, Sequelize);
        }
        break;
      case "SCREEN_SHOT":
        await ScreenShotInfoModel.createScreenShotInfo(logInfo, Sequelize);
        break;
      case "CUSTOMER_PV":
        // 根据IP地址获取位置
        const monitorIp = logInfo.monitorIp
        // var geo = geoip.lookup(monitorIp);
        try {
          const res = await searcher.btreeSearchSync(monitorIp)
          if (res) {
            const { region } = res
            const locationArray = region.split("|")
            logInfo.country = locationArray[0] || "中国"
            logInfo.province = locationArray[2] || "未知"
            logInfo.city = locationArray[3] || "未知"
            // logInfo.operators = locationArray[4] || "未知"
          }
        } catch(e) {
          log.printError("IP定位失败：", e)
        }
        
        if (browserInfo) {
          logInfo.browserInfo = browserInfo
        }
        // 根据customerKey来判断是否为新用户
        const customerKeyArr = logInfo.customerKey ? logInfo.customerKey.split("-") : []
        if (customerKeyArr && customerKeyArr.length > 0) {
          // .match(/\d{2}/g)
          const timeArray = customerKeyArr[customerKeyArr.length - 1].match(/\d{2}/g)
          const dateStr = timeArray[0] + timeArray[1] + "-" + timeArray[2] + "-" + timeArray[3]
          logInfo.customerKeyCreatedDate = dateStr;
        }
        await CustomerPVModel.createCustomerPV(logInfo, Sequelize);
        break;
      case "CUS_LEAVE":
        await CustomerPvLeaveModel.createCustomerPvLeave(logInfo);
        break;
      case "STAY_TIME":
        await CustomerStayTimeModel.createCustomerStayTime(logInfo);
        break;
      case "VIDEOS_EVENT":
          await VideosInfoModel.createVideos(logInfo, Sequelize);
          break;
      case "LOAD_PAGE":
        await LoadPageInfoModel.createLoadPageInfo(logInfo, Sequelize);
        break;
      case "RESOURCE_LOAD":
        if (logInfo.sourceUrl) {
          handleResultWhenResourceError(logInfo)
          await ResourceLoadInfoModel.createResourceLoadInfo(logInfo, Sequelize);
        }
        break;
      case "CUSTOMIZE_BEHAVIOR":
      default:
        await ExtendBehaviorInfoModel.createExtendBehaviorInfo(logInfo, Sequelize);
        break;
    }
    // 判断是否有连接线上用户, 如果连线的用户，就将信息存入到全局变量中
    if (logInfo.uploadType !== "VIDEOS_EVENT") {
      const userIdArray = global.monitorInfo.userIdArray
      const debugInfoArray = global.monitorInfo.debugInfoArray
      if (userIdArray.indexOf(logInfo.userId) != -1) {
        console.log(logInfo.uploadType + "（" + logInfo.userId + "）日志进入队列...")
        debugInfoArray.push(logInfo)
      }
    }
  }

  /**
   * 接受并分类处理上传的日志
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upDLog(ctx) {
    if (global.monitorInfo.purchaseCodeValid !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("激活码不正确或已失效", false)
      return
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200("", 0)
    // 如果清理机制的定时器已经存在了，就取消掉上一个定时器，然后再创建一个新的
    if (global.debugTimer) {
      clearTimeout(global.debugTimer)
      global.debugTimer = setTimeout(() => {
        delete global.monitorInfo.debugInfo
        global.monitorInfo.debugInfo = {}
      }, 1 * 3600 * 1000)
    } else {
      global.debugTimer = setTimeout(() => {
        delete global.monitorInfo.debugInfo
        global.monitorInfo.debugInfo = {}
      }, 1 * 3600 * 1000)
    }
    let errorLogInfo = ""
    try {
      const paramStr = ctx.request.body.data
      const param = JSON.parse(paramStr)
      const { localInfo, sessionInfo, cookieInfo, consoleInfo, warnInfo, videosInfo } = param
      let userId = null
      let debugInfo = global.monitorInfo.debugInfo
      if (localInfo) {
        const infoStr = Utils.b64DecodeUnicode(localInfo)
        const result = JSON.parse(infoStr)
        userId = JSON.parse(result.wmUserInfo).userId
        if (!debugInfo[userId]) debugInfo[userId] = {}
        debugInfo[userId].localInfo = result
      }
      if (sessionInfo) {
        const infoStr = Utils.b64DecodeUnicode(sessionInfo)
        const result = JSON.parse(infoStr)
        if (!debugInfo[userId]) debugInfo[userId] = {}
        debugInfo[userId].sessionInfo = result
      }
      if (cookieInfo) {
        const infoStr = Utils.b64DecodeUnicode(cookieInfo)
        const result = Utils.parseCookies(infoStr)
        if (!debugInfo[userId]) debugInfo[userId] = {}
        debugInfo[userId].cookieInfo = result
      }
      if (consoleInfo || warnInfo) {
        let type = "log"
        let resultInfo = null
        if (consoleInfo) {
          type = "log"
          resultInfo = consoleInfo
        } else if (warnInfo) {
          type = "warn"
          resultInfo = warnInfo
        }
        if (!resultInfo) return
        const infoStr = LZString.decompressFromEncodedURIComponent(resultInfo)
        const result = JSON.parse(infoStr)
        result.type = type
        const consoleUserId = result.userId
        if (!debugInfo[consoleUserId]) {
          debugInfo[consoleUserId] = {}
        }
        if (!debugInfo[consoleUserId].consoleInfo) {
          debugInfo[consoleUserId].consoleInfo = {log: []}
        }
        const logArray = debugInfo[consoleUserId].consoleInfo.log
        logArray.push(result)

        // if (logArray.length === 0) {
        //   logArray.push(result)
        // } else if (result.happenTime > logArray[logArray.length - 1].happenTime) {
        //   logArray.push(result)
        // } else {
        //   for (var i = 0; i < logArray.length; i ++) {
        //     if (logArray.length === 1) {
        //       if (result.happenTime > logArray[i].happenTime) {
        //         logArray.push(result)
        //       } else if (result.happenTime <= logArray[i].happenTime) {
        //         logArray.unshift(result)
        //       }
        //       break
        //     }
        //     if (logArray.length -1 === i) {
        //       logArray.push(result)
        //       break
        //     }
        //     if (logArray.length > 2 && result.happenTime > logArray[i].happenTime && result.happenTime <= logArray[i + 1].happenTime) {
        //       logArray.splice(i + 1, 0, result)
        //     }
        //   }
        // }
      }

      // 保存录屏信息
      if (videosInfo) {
        const compressObj = LZString.decompressFromEncodedURIComponent(videosInfo)
        const tempVideosInfo = JSON.parse(compressObj)
        const event = tempVideosInfo.event
        const userId = tempVideosInfo.userId
        if (!debugInfo[userId]) {
          debugInfo[userId] = {}
        }
        if (!debugInfo[userId].videosInfo) {
          debugInfo[userId].videosInfo = []
        }
        const videosInfoArray = debugInfo[userId].videosInfo
        videosInfoArray.push(event)

        // if (videosInfoArray.length === 0) {
        //   videosInfoArray.push(event)
        // } else if (event.timestamp > videosInfoArray[videosInfoArray.length - 1].timestamp) {
        //   videosInfoArray.push(event)
        // } else {
        //   for (var i = 0; i < videosInfoArray.length; i ++) {
        //     if (videosInfoArray.length === 1) {
        //       if (event.timestamp > videosInfoArray[i].timestamp) {
        //         videosInfoArray.push(event)
        //       } else if (event.timestamp <= videosInfoArray[i].timestamp) {
        //         videosInfoArray.unshift(event)
        //       }
        //       break
        //     }
        //     if (videosInfoArray.length -1 === i) {
        //       videosInfoArray.push(event)
        //       break
        //     }
        //     if (videosInfoArray.length > 2 && event.timestamp > videosInfoArray[i].timestamp && event.timestamp <= videosInfoArray[i + 1].timestamp) {
        //       videosInfoArray.splice(i + 1, 0, event)
        //     }
        //   }
        // }
      }
    } catch(e) {
      log.printError("Debug信息上报失败：")
      log.printError(errorLogInfo, e)
    }
  }
  /**
   * 处理debug信息
   */
  handleDebugInfo(info, type) {
    switch(type) {
      case "localInfo":
        console.log(info)
        break
      case "sessionInfo":
        break
      case "cookieInfo":
        break
      default:
        break
    }
  }

  static encryptUrl(logInfo) {
    const reg = /https?:\/\/\S+[\.\:]([a-zA-Z0-9]+\/){1}/g
    if (logInfo.completeUrl) {
      try {
        const pathName = decodeURIComponent(logInfo.completeUrl).replace(reg, "")
        const urlArray = decodeURIComponent(logInfo.completeUrl).match(reg)[0].split(".")
        const len = urlArray.length
        const tempUrl = urlArray[0] + "**" + urlArray[len - 1] + pathName
        logInfo.completeUrl = encodeURIComponent(tempUrl)
      } catch(e) {
        logInfo.completeUrl = logInfo.completeUrl
      }
    }
    if (logInfo.simpleUrl) {
      try {
        const pathName = decodeURIComponent(logInfo.simpleUrl).replace(reg, "")
        const urlArray = decodeURIComponent(logInfo.simpleUrl).match(reg)[0].split(".")
        const len = urlArray.length
        const tempUrl = urlArray[0] + "**" + urlArray[len - 1] + pathName
        logInfo.simpleUrl = encodeURIComponent(tempUrl)
      } catch(e) {
        logInfo.simpleUrl = logInfo.simpleUrl
      }
    } 
    if (logInfo.httpUrl) {
      try {
        const pathName = decodeURIComponent(Utils.b64DecodeUnicode(logInfo.httpUrl)).replace(reg, "")
        const urlArray = decodeURIComponent(Utils.b64DecodeUnicode(logInfo.httpUrl)).match(reg)[0].split(".")
        const len = urlArray.length
        const tempUrl = urlArray[0] + "**" + urlArray[len - 1] + pathName
        logInfo.httpUrl = Utils.b64DecodeUnicode(encodeURIComponent(tempUrl))
      } catch(e) {
        logInfo.httpUrl = logInfo.httpUrl
      }
    }
    if (logInfo.simpleHttpUrl) {
      try {
        const pathName = decodeURIComponent(logInfo.simpleHttpUrl).replace(reg, "")
        const urlArray = decodeURIComponent(logInfo.simpleHttpUrl).match(reg)[0].split(".")
        const len = urlArray.length
        const tempUrl = urlArray[0] + "**" + urlArray[len - 1] + pathName
        logInfo.simpleHttpUrl = encodeURIComponent(tempUrl)
      } catch(e) {
        logInfo.simpleHttpUrl = logInfo.simpleHttpUrl
      }
    }
    if (logInfo.sourceUrl) {
      try {
        const pathName = decodeURIComponent(Utils.b64DecodeUnicode(logInfo.sourceUrl)).replace(reg, "")
        const urlArray = decodeURIComponent(Utils.b64DecodeUnicode(logInfo.sourceUrl)).match(reg)[0].split(".")
        const len = urlArray.length
        const tempUrl = urlArray[0] + "**" + urlArray[len - 1] + pathName
        logInfo.sourceUrl = Utils.b64DecodeUnicode(encodeURIComponent(tempUrl))
      } catch(e) {
        logInfo.sourceUrl = logInfo.sourceUrl
      }
    }
  }
  /**
   * 接受并分类处理上传的拓展日志
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async uploadExtendLog(ctx) {
    let param = {}
    if (typeof ctx.request.body !== 'object') {
      param = JSON.parse(ctx.request.body)
    } else {
      param = ctx.request.body
    }
    ExtendBehaviorInfoModel.createExtendBehaviorInfo(param)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功')
  }

  /**
   * 更新数据库表名
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async updateTableName() {
    BehaviorInfoModel.updateTableName()
    CustomerPVModel.updateTableName()
    ExtendBehaviorInfoModel.updateTableName()
    HttpErrorInfoModel.updateTableName()
    HttpLogInfoModel.updateTableName()
    JavascriptErrorInfoModel.updateTableName()
    LoadPageInfoModel.updateTableName()
    ResourceLoadInfoModel.updateTableName()
    ScreenShotInfoModel.updateTableName()
    VideosInfoModel.updateTableName()
  }

  /**
   * 根据查询参数，查询出该用户所有的行为记录
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async searchBehaviorsRecord(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { searchDate, searchHour } = param
    const searchValue = Utils.b64DecodeUnicode(param.searchValue)
    param.userId = searchValue
    param.happenDateScope = searchDate + " " + searchHour + ":00:00"
    param.happenDateScopeEnd = searchDate + " " + searchHour + ":59:59"
    let customerKeyList = []
    let result1 = []
    let result2 = []
    let result3 = []
    let result4 = []
    let result5 = []
    let result6 = []
    let result7 = []
    let result8 = []
    let result = []
    let startDateTime = new Date().getTime()
    // 查询当前用户的customerKey列表
    await CustomerPVModel.getCustomerKeyByUserId(param).then((res) => {
      res.forEach((customerKeyInfo) => {
        if (customerKeyInfo.customerKey && customerKeyInfo.customerKey.length > 10) {
          customerKeyList.push(customerKeyInfo.customerKey)
        }
      })
      let currentDateTime = new Date().getTime()
      console.log("customerKey获取时间：", currentDateTime - startDateTime)
      startDateTime = currentDateTime
    })
    let customerKeySql = ""
    // searchHour = -1 说明需要查询一整天的数据
    let happenTimeSql = searchHour === -1 ? " 1=1 " : " happenDate>='" + param.happenDateScope + "' and happenDate<='" + param.happenDateScopeEnd + "' "
    let userIdSql = " userId='" + searchValue + "' "
    let base64UserIdSql = " userId='" + searchValue + "' "
    if (customerKeyList.length) {
      customerKeyList.forEach((customerKey, index) => {
        if (index === customerKeyList.length -1) {
          customerKeySql += " customerKey='" + customerKey + "' "
        } else {
          customerKeySql += " customerKey='" + customerKey + "' or "
        }
      })
      customerKeySql = " (" + customerKeySql + ") "
    } else {
      // 如果userId查不到，则用customerKey来进行查询
      customerKeySql += " customerKey='" + searchValue + "' "
    }
    await BehaviorInfoModel.getBehaviorsByUser(customerKeySql, happenTimeSql, param).then((res) => {
      result1 = res
    })
    await CustomerPVModel.getBehaviorsByUser(customerKeySql, happenTimeSql, param).then((res) => {
      result2 = res
    })
    await JavascriptErrorInfoModel.getBehaviorsByUser(customerKeySql, happenTimeSql, param).then((res) => {
      result3 = res
    })
    await ScreenShotInfoModel.getBehaviorsByUser(happenTimeSql, base64UserIdSql, param).then((res) => {
      result4 = res
    })
    await HttpLogInfoModel.getHttpLogsByUser(customerKeySql, happenTimeSql, param).then((res) => {
      result5 = res
    })
    await ExtendBehaviorInfoModel.getExtendBehaviorInfoByUserId(happenTimeSql, userIdSql, param).then((res) => {
      for (let i = 0; i < res.length; i ++) {
        res[i].happenTime = new Date(res[i].createdAt).getTime()
      }
      result6 = res
    })
    await ResourceLoadInfoModel.getResourceLoadInfoByUserId(customerKeySql, happenTimeSql, param).then((res) => {
      result7 = res
    })
    await HttpErrorInfoModel.getHttpErrorsByUser(customerKeySql, happenTimeSql, param).then((res) => {
      result8 = res
    })
    result = result.concat(result1, result2, result3, result5, result6, result7, result8)
    result4.forEach((item) => {
      item.screenInfo = (item.screenInfo || "").toString()
      result.push(item)
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', {behaviorList: result})
  }

  /**
   * 根据userId，查询出该用户详细信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async searchCustomerInfo(ctx) {
    
    const param = JSON.parse(ctx.request.body)
    const { searchDate, searchHour } = param
    const searchValue = Utils.b64DecodeUnicode(param.searchValue)
    param.userId = searchValue
    param.happenDateScope = searchDate + " " + searchHour + ":00:00"
    param.happenDateScopeEnd = searchDate + " " + searchHour + ":59:59"
    let customerKeyList = []
    let pvCountList = null
    let pvChartList = null
    let loadPageTimeList = null
    let ipPath = ""
    let cusDetail = null
    let startDateTime = new Date().getTime()
    let customerKey = ""
    // 查询当前用户的customerKey列表
    await CustomerPVModel.getCustomerKeyByUserId(param).then((res) => {
      res.forEach((customerKeyInfo) => {
        if (customerKeyInfo.customerKey && customerKeyInfo.customerKey.length > 10) {
          customerKeyList.push(customerKeyInfo.customerKey)
        }
      })
    })
    let customerKeySql = ""
    let happenTimeSql = searchHour === -1 ? " 1=1 " : " happenDate>='" + param.happenDateScope + "' and happenDate<='" + param.happenDateScopeEnd + "' "
    if (customerKeyList.length) {
      customerKeyList.forEach((customerKey, index) => {
        if (index === customerKeyList.length -1) {
          customerKeySql += " customerKey='" + customerKey + "' "
        } else {
          customerKeySql += " customerKey='" + customerKey + "' or "
        }
      })
      customerKeySql = " (" + customerKeySql + ") "
    } else {
      // 如果userId查不到，则用customerKey来进行查询
      customerKeySql += " customerKey='" + searchValue + "' "
    }
    // await CustomerPVModel.calculatePvCountByCustomerKeyForMonth(customerKeySql).then((res) => {
    //   pvChartList = Utils.handleDateResult(res)
    // })
    await CustomerPVModel.getCustomerPVDetailByCustomerKey(customerKeySql, happenTimeSql, param).then((res) => {
      cusDetail = res[0] || {}
    })
    await CustomerPVModel.getPVsByCustomerKey(customerKeySql, happenTimeSql, param).then((res) => {
      pvCountList = res
    })
    await LoadPageInfoModel.getPageLoadTimeByCustomerKey(customerKeySql, happenTimeSql, param).then(async (res) => {
      loadPageTimeList = res
    })
    // 获取浏览器信息
    await LoadPageInfoModel.getLoadPageInfoByCustomerKey(customerKeySql, param).then((res) => {
      res.forEach((item) => {
        if (item.browserInfo) {
          cusDetail["browserInfo"] = item.browserInfo
        }   
      })
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', {pvCountList, loadPageTimeList, cusDetail, pvChartList})
  }

  /**
   * 每十分钟更新一下实时数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async calculateCountByDayForTenMinutes(index) {
    const useDay = Utils.addDays(0 - index)
    const infoCountByDayInfo = {
      uploadType: "",
      webMonitorId: "",
      dayName: "",
      dayCount: ""
    }
    const projectList = await ProjectModel.getAllProjectList();
    for (let i = 0; i < projectList.length; i ++) {
      const webMonitorId = projectList[i].webMonitorId
      infoCountByDayInfo.webMonitorId = webMonitorId
      infoCountByDayInfo.dayName = useDay
      //========================UV相关==========================//
      const todayUvData = await CustomerPVModel.getUVCountForDay(webMonitorId, index, UPLOAD_TYPE.UV_COUNT_HOUR);
      infoCountByDayInfo.uploadType = UPLOAD_TYPE.UV_COUNT_DAY
      infoCountByDayInfo.dayCount = todayUvData[0].count
      const result_uv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.UV_COUNT_DAY)
      if (result_uv.length <= 0) {
        await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      } else {
        const id = result_uv[0].id
        await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      }
      //========================UV相关==========================//
      //========================PV相关==========================//
      const todayPvData = await CustomerPVModel.getPVCountForDay(webMonitorId, index, UPLOAD_TYPE.PV_COUNT_HOUR);
      infoCountByDayInfo.uploadType = UPLOAD_TYPE.PV_COUNT_DAY
      infoCountByDayInfo.dayCount = todayPvData[0].count
      const result_pv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.PV_COUNT_DAY)
      if (result_pv.length <= 0) {
        await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      } else {
        const id = result_pv[0].id
        await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      }
      //========================PV相关==========================//
      
      //========================新访客相关==========================//
      const todayNewData = await CustomerPVModel.getNewCountForDay(webMonitorId, index, UPLOAD_TYPE.NEW_COUNT_HOUR);
      infoCountByDayInfo.uploadType = UPLOAD_TYPE.NEW_COUNT_DAY
      infoCountByDayInfo.dayCount = todayNewData[0].count
      const result_new = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.NEW_COUNT_DAY)
      if (result_new.length <= 0) {
        await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      } else {
        const id = result_new[0].id
        await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      }
      //========================新访客相关==========================//
      //========================IP相关==========================//
      const todayIpData = await CustomerPVModel.getIpCountForDay(webMonitorId, index, UPLOAD_TYPE.IP_COUNT_HOUR);
      infoCountByDayInfo.uploadType = UPLOAD_TYPE.IP_COUNT_DAY
      infoCountByDayInfo.dayCount = todayIpData[0].count
      const result_ip = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, UPLOAD_TYPE.IP_COUNT_DAY)
      if (result_ip.length <= 0) {
        await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
      } else {
        const id = result_ip[0].id
        await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
      }
      //========================IP相关==========================//
    }
  }
  /**
   * 获取所有的错误影响人数
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getErrorInfo(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const todayUvData = await CustomerPVModel.getUVCountForDay(params.webMonitorId, 0, UPLOAD_TYPE.UV_COUNT_HOUR);
    const jsErrorData = await JavascriptErrorInfoModel.getJsErrorUserCountToday(params.webMonitorId, 0)
    const consoleErrorData = await JavascriptErrorInfoModel.getConsoleErrorUserCountToday(params.webMonitorId, 0)
    const resourceErrorData = await ResourceLoadInfoModel.getResourceErrorUserCountToday(params.webMonitorId, 0)
    const httpErrorData = await HttpErrorInfoModel.getHttpErrorUserCountToday(params.webMonitorId, 0)
    const result = {
      todayUvCount: todayUvData[0].count, 
      jsErrorTotalCount: jsErrorData[0].count, 
      jsConsoleErrorTotalCount: consoleErrorData[0].count, 
      resourceErrorTotalCount: resourceErrorData[0].count, 
      httpErrorTotalCount: httpErrorData[0].count
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', result)
  }
  /**
   * 获取警报信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getWarningMsg(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const warningMsgKey = params.webMonitorId + "warningMsg"
    const result = global.monitorInfo[warningMsgKey]
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', result)
  }
  /**
   * 每5分钟检查一下mysql的最大错误连接数，并发送邮件报警
   */
  static async checkMysqlConnectErrors() {
    setInterval(async () => {
      const data = await CommonModel.checkMysqlConnectErrors()
      const count = data[0].count
      if (count >= 50) { // 发送警报邮件
        Utils.sendEmail("597873885@qq.com", "Mysql错误连接数报警", "Mysql错误连接数：" + count)
      }
    }, 600 * 1000)
  }
   /**
   */
  static async checkMysqlStatus(ctx) {
    const errorListData = await CommonModel.checkMysqlConnectErrors()
    const connectionData = await CommonModel.checkMysqlConnects()
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {errorListData, connectionData})
  }
  /**
   * 立邦开关
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async liBangData(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 1)
  }


  /**
   * 启动数据删除
   */
  static async startDelete() {
    let countDay = accountInfo.saveDays
    log.printInfo("【即将开始表删除程序...")
    const dateStr = Utils.addDays(0 - countDay).replace(/-/g, "")

    const tables1 = [
      "BehaviorInfo", "CustomerPV", "ExtendBehaviorInfo", "HttpErrorInfo",
      "HttpLogInfo", "JavascriptErrorInfo", "LoadPageInfo", "ResourceLoadInfo", 
      "ScreenShotInfo", "VideosInfo"
    ]
    const webMonitorIdList = await ProjectModel.getWebMonitorIdList()
    for (let i = 0; i < webMonitorIdList.length; i ++) {
      let webMonitorId = webMonitorIdList[i].webMonitorId
      try {
        tables1.forEach(async (tempTable) => {
          let tableName = webMonitorId + tempTable + dateStr
          log.printInfo("开始删除数据库表 " + tableName + "...")
          await Sequelize.dropSchema(tableName).then(() => {
            log.printInfo("成功删除数据库表 " + tableName)
          })
        })
      } catch (e) {
        log.printError("删除表操作报错", e)
      }
    }

    // 下边是没有按照项目区分的表
    const tables2 = [
      "LocationPoints"
    ]
    try {
      tables2.forEach(async (tempTable) => {
        let tableName = tempTable + dateStr
        log.printInfo("开始删除数据库表 " + tableName + "...")
        await Sequelize.dropSchema(tableName).then(() => {
          log.printInfo("成功删除数据库表 " + tableName)
        })
      })
    } catch (e) {
      log.printError("删除表操作报错", e)
    }
    log.printInfo("表删除程序结束】")
  }

  /**
   * 重启服务
   */
  static async restartServer() {

    switch (process.platform) {
      // windows系统下
      case "win32":
          spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['run', 'prd_restart'], { stdio: 'inherit' });
          break;
      case "darwin":  // 默认mac系统
      default:
          try {
              execFile('./restart.sh', [], null, function (err, stdout, stderr) {
                  log.printError(JSON.stringify(err))
                  log.printError(stdout)
                  log.printError(stderr)
              });
          } catch(e) {
              log.printError(e)
              log.printError(errorStr)
          }
          break;
    }

  }

  /**
   * 创建数据库辩驳
   */
  static async createTable() {

    switch (process.platform) {
      // windows系统下
      case "win32":
          spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['run', 'table_config'], { stdio: 'inherit' });
          break;
      case "darwin":  // 默认mac系统
      default:
          try {
              execFile('./createTable.sh', [], null, function (err, stdout, stderr) {
                  log.printError(JSON.stringify(err))
                  log.printError(stdout)
                  log.printError(stderr)
              });
          } catch(e) {
              log.printError(e)
              log.printError(errorStr)
          }
          break;
    }

  }

  /**
   * 连接线上用户
   */
  static async connectUser(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId, connectStatus} = param
    const resultUserId = Utils.md5Encrypt(userId)
    let tempStatus = ""
    if (connectStatus === "disconnect") {
      global.monitorInfo.userIdArray = [resultUserId]
      tempStatus = "connected"
    } else {
      global.monitorInfo.userIdArray = []
      tempStatus = "disconnect"
    }
    console.log("===========================================")
    console.log("= 连线用户的userId: ", global.monitorInfo.userIdArray)
    console.log("= 开始清理当前userId遗留的日志。。。")
    if (global.monitorInfo.debugInfo[userId]) {
      global.monitorInfo.debugInfo[userId] = {}
    }
    console.log("= 当前userId遗留的日志清理完毕。。。")
    // 1个小时候，自动清理debug模式下的内容
    if (global.monitorInfo.debugInfoTimer) {
      clearInterval(global.monitorInfo.debugInfoTimer)
    } else {
      global.monitorInfo.debugInfoTimer = setTimeout(() => {
        global.monitorInfo.debugInfo = {}
      }, 3600 * 1000)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', tempStatus)
  }

  /**
   * 连接线上用户
   */
  static async getDebugInfoForLocalInfo(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId} = param
    const result = global.monitorInfo.debugInfo[userId]
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', result)
  }

  /**
   * 获取已连接用户的录屏信息
   */
  static async getDebugInfoForVideo(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId} = param
    const result = global.monitorInfo.debugInfo[userId].videosInfo
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', result)
  }
  
  /**
   * 获取连线用户的日志信息
   */
  static async getDebugInfoFromConnectUser(param) {
    // 对内容中的信息进行排序
    const debugInfoArray = global.monitorInfo.debugInfoArray
    if (debugInfoArray.length > 0) {
      Utils.quickSortForObject(debugInfoArray, "happenTime", 0, debugInfoArray.length - 1)
      const resultInfo = debugInfoArray[0]
      debugInfoArray.splice(0, 1)
      console.log(resultInfo.uploadType + "（" + resultInfo.userId + "） 日志被取出...")
      return resultInfo
    }
    return null
  }

  /**
   * 获取连线用户的console日志信息
   */
  static async getConsoleInfoFromConnectUser(param) {
    const {userId} = param
    // 对内容中的信息进行排序
    const debugInfo = global.monitorInfo.debugInfo
    if (debugInfo[userId] && debugInfo[userId].consoleInfo && debugInfo[userId].consoleInfo.log) {
      const resultInfo = debugInfo[userId].consoleInfo.log[0]
      debugInfo[userId].consoleInfo.log.splice(0, 1)
      return resultInfo
    }
    return null
  }

  /**
   * 获取连线用户的录屏信息
   */
  static async getVideosInfoFromConnectUser(param) {
    const {userId} = param
    // 对内容中的信息进行排序
    const debugInfo = global.monitorInfo.debugInfo
    if (debugInfo[userId] && debugInfo[userId].videosInfo) {
      const resultInfo = debugInfo[userId].videosInfo
      debugInfo[userId].videosInfo.splice(0, 1)
      return resultInfo
    }
    return null
  }

   /**
   * 获取git star数量
   * @param ctx
   * @returns {Promise.<void>}
   * {per_page: 100, page: 3}
   * @static
   * @param {*} ctx
   * @memberof Common
   */
  static async gitStars(ctx) {
    let stars = 0
    const gitStarsKey = "gitStars" + new Date().Format("yyyyMMdd")
    if (global.monitorInfo[gitStarsKey]) {
      stars = global.monitorInfo[gitStarsKey]
    } else {
      await fetch("https://api.github.com/repos/a597873885/webfunny_monitor/stargazers?per_page=100&page=9")
      .then( res => res.text())
      .then( body => {
        stars = JSON.parse(body).length + 800
        global.monitorInfo[gitStarsKey] = stars
      });
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', stars)
  }

  /**
   * 推送信息配置
   * @param ctx
   * @returns {Promise.<void>}
   * {per_page: 100, page: 3}
   */
  static async pushInfo(ctx) {
    await Utils.get("http://www.webfunny.cn/config/pushInfo", {}).then((result) => {
      const pushInfo = result.data
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', pushInfo)
    }).catch(() => {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', null)
    })
  }

  /**
   * 推送信息配置
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async updateInfo(ctx) {
    await Utils.get("http://www.webfunny.cn/config/updateInfo", {}).then((result) => {
      const updateInfo = result.data
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', updateInfo)
    }).catch(() => {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', null)
    })
  }

  /**
   * 获取项目版本号
   * @param ctx
   * @returns {Promise.<void>}
   * {per_page: 100, page: 3}
   */
  static async projectVersion(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', PROJECT_INFO.PROJECT_VERSION)
  }
  /**
   * 获取项目配置信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async projectConfig(ctx) {
    try {
      const param = Utils.parseQs(ctx.request.url)
      let { userId, webMonitorId } = param
      // debug模式判断开关
      const userIdArray = global.monitorInfo.userIdArray
      let status = ""
      if (userIdArray.indexOf(userId) != -1) {
        status = "connected"
      } else {
        status = "disconnect"
      }
      // 监控功能启动列表
      let startList = global.monitorInfo[webMonitorId + "startList"]
      if (startList && startList.length > 0) {
        console.log("全局变量中：", startList)
      } else {
        // 去数据库查询
        let res = await ProjectModel.getStartListByWebMonitorId(webMonitorId)
        startList = res && res[0] && res[0].startList || "012345"
        global.monitorInfo[webMonitorId + "startList"] = startList
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', {d: status, s: startList})
    } catch(e) {
      log.printError("projectConfig接口报错", e)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', {d: "disconnect", s: "012345"})
    } 
    
  }

  /**
   * 开启或者暂停日志服务
   */
  static async changeLogServerStatus(ctx) {
    const param = JSON.parse(ctx.request.body)
    const {status} = param
    global.monitorInfo.logServerStatus = status
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 1)
  }
  /**
   * 更改日志服务上报频率
   */
  static async changeWaitCounts(ctx) {
    const param = JSON.parse(ctx.request.body)
    const {waitCounts} = param
    global.monitorInfo.waitCounts = waitCounts
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 1)
  }
   /**
   * 更改日志的存储时间
   */
  static async changeSaveDays(ctx) {
    const req = ctx.request.body
    const param = JSON.parse(req)
    const { saveDays } = param
    const newString = `module.exports = {
      saveDays: ${saveDays},
    }`
    await fs.writeFile("./bin/saveDays.js", newString, (err) => {
      if (err) {
        throw err;
      }
      console.log("存储周期修改成功，当前存储周期为" + saveDays + "天...");
      console.log("即将重启服务以生效...");
      Common.restartServer()
    });
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 0)
  }
  /**
   * 保存mysql连接配置
   */
  static async saveMysqlConfigs(ctx) {
    const req = ctx.request.body
    const param = JSON.parse(req)
    const { mysqlIp, mysqlDatabase, mysqlUsername, mysqlPassword } = param
    const newString = `module.exports = {
      ip: '${mysqlIp}',                 // mysql数据库所在云服务器的ip地址
      dataBaseName: '${mysqlDatabase}',       // 数据库名称（如：webfunny_db）
      userName: '${mysqlUsername}',           // mysql的登录名
      password: '${mysqlPassword}'            // mysql的登录密码
    }`
    await fs.writeFile("./bin/mysqlConfig.js", newString, (err) => {
      if (err) {
        throw err;
      }
      console.log("mysql连接配置完成。");
      console.log("即将重启服务以生效...");
      Common.restartServer()
    });
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 0)
  }
  /**
   * 获取日志服务状态
   */
  static async getLogServerStatus(ctx) {
    const logServerStatus = global.monitorInfo.logServerStatus
    const waitCounts = global.monitorInfo.waitCounts
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {logServerStatus, waitCounts, saveDays: accountInfo.saveDays})
  }

  /**
   * 获取日志并发量列表
   */
  static async getConcurrencyByMinuteInHour(ctx) {
    const logCountInMinuteList = global.monitorInfo.logCountInMinuteList
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {logCountInMinuteList})
  }

  /**
   * 检查所有的分析信息
   */
  static async checkAnalysisData(customerWarningCallback) {
    // 获取当前日志的并发量
    const logCountInMinuteList = global.monitorInfo.logCountInMinuteList
    const concurrencyCount = logCountInMinuteList[logCountInMinuteList.length - 1]
    
    // 获取当前的用户总量
    const healthScoreList = []
    const projectList = await ProjectModel.getAllProjectList()
    for (let i = 0; i < projectList.length; i ++) {
      const webMonitorId = projectList[i].webMonitorId
      const todayUvData = await CustomerPVModel.getUVCountForDay(webMonitorId, 0, UPLOAD_TYPE.UV_COUNT_HOUR)
      const jsErrorData = await JavascriptErrorInfoModel.getJsErrorUserCountToday(webMonitorId, 0)
      const consoleErrorData = await JavascriptErrorInfoModel.getConsoleErrorUserCountToday(webMonitorId, 0)
      const resourceErrorData = await ResourceLoadInfoModel.getResourceErrorUserCountToday(webMonitorId, 0)
      const httpErrorData = await HttpErrorInfoModel.getHttpErrorUserCountToday(webMonitorId, 0)
      
      let todayUvCount = todayUvData[0].count
      const jsErrorTotalCount = jsErrorData[0].count
      const jsConsoleErrorTotalCount = consoleErrorData[0].count
      const resourceErrorTotalCount = resourceErrorData[0].count
      const httpErrorTotalCount = httpErrorData[0].count

      todayUvCount = parseInt(todayUvCount, 10)
      let jsErrorPercent = todayUvCount > 0 ? jsErrorTotalCount / todayUvCount : 0
      let consoleErrorPercent = todayUvCount > 0 ? jsConsoleErrorTotalCount / todayUvCount : 0
      let resourceErrorPercent = todayUvCount > 0 ? resourceErrorTotalCount / todayUvCount : 0
      let httpErrorPercent = todayUvCount > 0 ? httpErrorTotalCount / todayUvCount : 0
      let score = 20 * jsErrorPercent + 20 * consoleErrorPercent + 30 * resourceErrorPercent + 30 * httpErrorPercent
      score = Utils.toFixed((100 - score) / 100, 2) * 100
      jsErrorPercent = Utils.toFixed(jsErrorPercent, 2)
      consoleErrorPercent = Utils.toFixed(consoleErrorPercent, 2)
      resourceErrorPercent = Utils.toFixed(resourceErrorPercent, 2)
      httpErrorPercent = Utils.toFixed(httpErrorPercent, 2)

      healthScoreList.push({score, jsErrorPercent, consoleErrorPercent, resourceErrorPercent, httpErrorPercent})
    }
    customerWarningCallback({
      concurrencyCount,
      healthScoreList
    })
  }

  /**
   * 获取日志服务所有相关信息
   */
  static async getSysInfo(ctx) {
    const { accountInfo } = AccountConfig
    // 检查是否有管理员账号
    const adminData = await UserModel.checkAdminAccount();
    const adminUserCount = adminData[0].count * 1
    // 激活码、消息队列
    // 端口号相关
    const { webfunnyNeedLogin, messageQueue, localServerDomain, localServerPort, localAssetsDomain, localAssetsPort, mysqlConfig } = accountInfo
    const { purchaseCodeEndDate, purchaseCodeValid, purchaseCodeType } = global.monitorInfo
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 
      {
        webfunnyVersion, webfunnyNeedLogin, messageQueue,
        purchaseCodeEndDate, purchaseCodeValid, pct: purchaseCodeType,
        localServerDomain, localServerPort, localAssetsDomain,
        localAssetsPort, adminUserCount, mysqlConfig
      })
  }
  /**
   * 版本信息
   * @param ctx
   * @returns {Promise.<void>}
   * {per_page: 100, page: 3}
   */
  static async monitorVersion(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', PROJECT_INFO.MONITOR_VERSION)
  }

  static async dockerHealth(ctx) {
    ctx.response.status = 200;
    ctx.body = {status: "OK"}
  }

  static async abortApis(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', "抱歉，你暂时没有权限访问此接口")
  }
}

module.exports = {HttpErrorInfoController,CustomerStayTimeController,ScreenShotInfoController,CustomerPvLeaveController,BehaviorInfoController,AlarmController,ExtendBehaviorInfoController,FunnelController,InfoCountByHourController,IgnoreErrorController,FailController,LoadPageInfoController,LocationPointGroupController,LocationPointTypeController,ResourceLoadInfoController,LocationPointController,VideosInfoController,HttpLogInfoController,JavascriptErrorInfoController,ProjectController,UserController,CustomerPVController,TimerCalculateController,Common}