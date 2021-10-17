const db = require('../config/db');
                                        const Sequelize = db.sequelize;
                                        const colors = require('colors');
                                        const domain = require("../bin/domain");
                                        const jsError = require('../interceptor/config/jsError')
                                        const consoleError = require('../interceptor/config/consoleError')
                                        const httpError = require('../interceptor/config/httpError')
                                        const resourceError = require('../interceptor/config/resourceError')
                                        const Utils = require('../util/utils');
                                        const utils = require('../util/utils');
                                        const CusUtils = require('../util_cus')
                                        const AlarmUtil = require('../alarm/index')
                                        const AlarmNames = require('../alarm/alarmName')
                                        const LZString = require('lz-string');
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
                                        const nodemailer = require('nodemailer');
                                        const formidable = require("formidable");
                                        const AccountConfig = require('../config/AccountConfig');
                                        const monitorKeys = require("../config/monitorKeys");
                                        const RabbitMq = require('../lib/RabbitMQ')
                                        const process = require('child_process')
                                        const { spawn, exec, execFile } = require('child_process');
                                        const { accountInfo } = AccountConfig
                                        const sendMq = accountInfo.messageQueue === true ? new RabbitMq() : null
                                        
const {CustomerPvLeaveModel,CustomerStayTimeModel,UserTokenModel,BehaviorInfoModel,ScreenShotInfoModel,CommonModel,AlarmRuleModel,ConfigModel,DeviceInfoCountByDayModel,ExtendBehaviorInfoModel,DeviceInfoCountByHourModel,FunnelModel,InfoCountByHourModel,IgnoreErrorModel,InfoCountByDayModel,LoadTimeInfoByHourModel,LocationPointTypeModel,MessageModel,LocationPointModel,LocationPointGroupModel,TeamModel,UserModel,VideosInfoModel,HttpErrorInfoModel,ProjectModel,ResourceLoadInfoModel,HttpLogInfoModel,LoadPageInfoModel,JavascriptErrorInfoModel,CustomerPVModel,} = require('../modules/models.js');
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

class UserTokenController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await UserTokenModel.createUserToken(req);
            let data = await UserTokenModel.getUserTokenDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async getAllTokens() {
        const userTokens = await UserTokenModel.getAllTokens()
        return userTokens
    }
    
}

class AlarmRuleController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async createNewAlarmRule(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { id, ruleName, loopTime, quietStartTime, quietEndTime } = req
        const ruleList = JSON.stringify(req.ruleList)
        const paramData = { ruleName, loopTime, quietStartTime, quietEndTime, ruleList }
        if (ruleName) {
            if (id) {
                paramData.id = id
                await AlarmRuleModel.updateAlarmRule(id, paramData)
            } else {
                await AlarmRuleModel.createAlarmRule(paramData);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async getAllAlarmRule(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        let data = await AlarmRuleModel.getAllAlarmRule(params);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    }

    /**
     * 查询单条信息数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(id) {
        return await AlarmRuleModel.getAlarmRuleDetail(id)
    }

    static async deleteAlarmRule(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param

        // 删除前，先检查AlarmRule是否被其他项目使用
        const projects = await ProjectModel.getProjectByAlarmRuleId(id)
        if (projects.length <= 0) {
            await AlarmRuleModel.deleteAlarmRule(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', 0)
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('当前警报规则还有项目在使用，无法执行删除操作！', 1)
        }
    }
}

class BehaviorInfoController {
}

class ConfigController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await ConfigModel.createConfig(req);
            let data = await ConfigModel.getConfigDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
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
    const { inputPurchaseCode, inputSecretCode } = param

    const newString = `module.exports = {
      purchaseCode: '${inputPurchaseCode}',
      secretCode: '${inputSecretCode}',
    }`
    await fs.writeFile("./bin/purchaseCode.js", newString, (err) => {
      if (err) {
        throw err;
      }
    });

    await ConfigModel.updateConfig("purchaseCode", {configValue: inputPurchaseCode})
    await ConfigModel.updateConfig("secretCode", {configValue: inputSecretCode})

    FailController.restartServer()
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

class MessageController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async createNewMessage(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { id, ruleName, loopTime, quietStartTime, quietEndTime } = req
        const ruleList = JSON.stringify(req.ruleList)
        const paramData = { ruleName, loopTime, quietStartTime, quietEndTime, ruleList }
        if (ruleName) {
            if (id) {
                paramData.id = id
                await MessageModel.updateMessage(id, paramData)
            } else {
                await MessageModel.createMessage(paramData);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async getAllMessage(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        let data = await MessageModel.getAllMessage(params);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    }

    static async getMessageByType(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { userId } = ctx.user
        params.userId = userId
        // 获取分页消息
        let data = await MessageModel.getMessageByType(params);
        // 获取有多少条未读消息
        let readCountInfo = await MessageModel.getUnReadMessageCountByType(params);
        let unReadCount = 0
        let total = 0
        if (readCountInfo) {
            readCountInfo.forEach((readInfo) => {
                if (readInfo.isRead === 0) {
                    unReadCount = parseInt(readInfo.count, 10)
                }
                total += parseInt(readInfo.count, 10)
            })
        }
        const result = {
            messages: data,
            unReadCount,
            total,
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
    }

    static async readMessage(ctx) {
        let req = JSON.parse(ctx.request.body)
        const { messageId } = req
        const message = MessageModel.getMessageDetail(messageId)
        message.isRead = 1
        await MessageModel.updateMessage(messageId, message);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', 0)
    }

    static async readAll(ctx) {
        let req = JSON.parse(ctx.request.body)
        const { messageType } = req
        const { userId } = ctx.user
        MessageModel.readAll(userId, messageType)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', 0)
    }

    /**
     * 查询单条信息数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(id) {
        return await MessageModel.getMessageDetail(id)
    }

    static async deleteMessage(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param

        // 删除前，先检查Message是否被其他项目使用
        const projects = await ProjectModel.getProjectByMessageId(id)
        if (projects.length <= 0) {
            await MessageModel.deleteMessage(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', 0)
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('当前警报规则还有项目在使用，无法执行删除操作！', 1)
        }
    }
    // 最新的更新日志写入到日志表中
    static async saveLastVersionInfo() {
        await Utils.get("http://www.webfunny.cn/config/lastVersionInfo", {}).then(async(result) => {
            const updateInfo = result.data
            const { updateDate, version, updateContent, upgradeGuide, updateDatabase } = updateInfo
            const currentDate = new Date().Format("yyyy-MM-dd")
            // 如果日期相同，说明是今天的，可以入库
            if (updateDate === currentDate) {
                const userList = await UserModel.getAllUserInfoForSimple()
                userList.map(async(userInfo) => {
                    const { userId } = userInfo
                    await MessageModel.createMessage({
                        userId,
                        title: `版本号：${version}`,
                        content: JSON.stringify([updateContent, upgradeGuide, updateDatabase]),
                        type: "update",
                        isRead: 0,
                        link: "https://www.webfunny.cn/update.html"
                    })
                })
            }
        }).catch((error) => {
            console.error(error)
        })
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

class TeamController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await TeamModel.createTeam(req);
            let data = await TeamModel.getTeamDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }

    static async createNewTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { teamName } = param
        const { userId } = ctx.user
        const team = {teamName, leaderId: userId, members: userId, webMonitorIds: ""}
        await TeamModel.createTeam(team);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }

    static async deleteTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param

        // 删除前，先检查team下是否还有团队
        const teamDetail = await TeamModel.getTeamDetail(id)
        const webMonitorIds = teamDetail.webMonitorIds
        const projects = await ProjectModel.getProjectByWebMonitorIds(webMonitorIds)
        if (projects.length <= 0) {
            await TeamModel.deleteTeam(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', "")
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', "当前team下还有项目，无法执行删除操作！")
        }
        
    }

    static async moveProToTeam(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { showMoveMonitorId, chooseTeamId } = param
        const team = await TeamModel.getTeamDetail(chooseTeamId)
        const tempProjects = team.webMonitorIds + "," + showMoveMonitorId
        await TeamModel.updateTeam(chooseTeamId, {webMonitorIds: tempProjects})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    static async getTeamList(ctx) {
        const { userId, userType } = ctx.user
        const res = await TeamModel.getTeamList(userId, userType)
        for (let i = 0; i < res.length; i ++) {
            const team = res[i]
            const { leaderId, members, webMonitorIds } = team
            const users = await UserModel.getUserListByMembers(members)
            team.members = users
            users.forEach((user) => {
                if (user.userId == leaderId) {
                    team.leader = user
                    return false
                }
            })
            const projects = await ProjectModel.getProjectListByWebMonitorIds(webMonitorIds)
            team.projects = projects
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async addTeamMember(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id, members } = param
        await TeamModel.updateTeam(id, {members})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    static async updateTeamProjects(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id, webMonitorIds } = param
        await TeamModel.updateTeam(id, {webMonitorIds})
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    static async getAllTeamList(ctx) {
        const res = await TeamModel.getAllTeamList()
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
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
    const param = Utils.parseQs(ctx.request.url)
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
    const param = Utils.parseQs(ctx.request.url)
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
    const param = Utils.parseQs(ctx.request.url)
    
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

  /**
   * 查询平均值
   * @returns {Promise<*>}
   */
  static async getHttpLoadTimeForAll(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const {webMonitorId, timeSize} = param
    let result = {
      httpErrorCount: 0,
      httpLogCount: 0
    }
    const dayStr = Utils.addDays(0 - timeSize)
    await HttpErrorInfoModel.calculateHttpErrorCountByDay(webMonitorId, dayStr).then(data => {
      result.httpErrorCount = parseInt(data[0].count || 0, 10)
    })
    await HttpLogInfoModel.getHttpLogCountByDay({webMonitorId, timeSize, uploadType: UPLOAD_TYPE.HTTP_HOUR_TOTAL_COUNT}).then(data => {
      result.httpLogCount = parseInt(data[0].count || 0, 10)
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result)
  }
  /**
   * 接口耗时占比
   * @returns {Promise<*>}
   */
  static async getHttpLoadTimePercent(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    param.uploadTypes = `('${UPLOAD_TYPE.HTTP_COUNT_A}','${UPLOAD_TYPE.HTTP_COUNT_B}','${UPLOAD_TYPE.HTTP_COUNT_C}','${UPLOAD_TYPE.HTTP_COUNT_D}','${UPLOAD_TYPE.HTTP_COUNT_E}')`
    let result = {}
    await HttpLogInfoModel.getHttpLoadTimePercent(param).then(data => {
      result = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result)
  }
  /**
   * 接口加载top10
   * @returns {Promise<*>}
   */
  static async getHttpLoadTimeListByUrl(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const {webMonitorId, timeSize} = param
    let result = []
    const startHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 00"
    const endHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 23"
    await LoadTimeInfoByHourModel.getLoadTimeListByUrl(webMonitorId, startHour, endHour, UPLOAD_TYPE.HTTP_HOUR_COUNT_LOADTIME).then(data => {
      data.forEach((item) => {
        let obj = {
          simpleHttpUrl: item.showName,
          count: item.count,
          loadTime: item.loadTime
        }
        result.push(obj)
      })
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result)
  }

  /*************大屏相关接口开始 ***************/
  /**
   * 根据平台类型，获取设备分类
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getHttpInfoInRealTimeByMinute(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { webMonitorId } = params
    const timestamp = new Date().getTime()
    const startTimeScope = new Date(timestamp - 60000).Format("yyyy-MM-dd hh:mm") + ":00"
    const endTimeScope = new Date(timestamp).Format("yyyy-MM-dd hh:mm") + ":00"
    if (req) {
      // httpCount
      const httpCountInfo = await HttpLogInfoModel.getHttpCountInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      // httpErrorCount
      const httpErrorCountInfo = await HttpErrorInfoModel.getHttpErrorCountInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      // 请求成功率
      const httpCount = httpCountInfo[0].httpCount !== null ? httpCountInfo[0].httpCount : 0;
      const httpErrorCount = httpErrorCountInfo[0].httpCount !== null ? httpErrorCountInfo[0].httpCount : 0;
      let httpSuccessPer = 100
      const httpTotalCount = parseInt(httpCount, 10) + parseInt(httpErrorCount, 10)
      if (httpTotalCount > 0) {
        if (httpCount === 0) {
          httpSuccessPer = 0
        } else {
          httpSuccessPer = Utils.toFixed((httpCount * 100) / httpTotalCount, 2)
        }
      }
      // 接口耗时
      const httpLoadTimeInfo = await HttpLogInfoModel.getHttpLoadTimeInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      httpLoadTimeInfo[0].loadTime = Utils.toFixed(parseInt(httpLoadTimeInfo[0].loadTime, 10) / 1000, 1);
      const result = {httpCount, httpErrorCount, httpSuccessPer, ...httpLoadTimeInfo[0]}
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
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
   * 根据页面加载时间分类
   * @returns {Promise<*>}
   */
  static async getPageCountForLoadTimeByDay(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_A
    const result_a = await LoadPageInfoModel.getPageCountForLoadTimeByDay(param)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_B
    const result_b = await LoadPageInfoModel.getPageCountForLoadTimeByDay(param)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_C
    const result_c = await LoadPageInfoModel.getPageCountForLoadTimeByDay(param)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_D
    const result_d = await LoadPageInfoModel.getPageCountForLoadTimeByDay(param)
    param.uploadType = UPLOAD_TYPE.PAGE_COUNT_E
    const result_e = await LoadPageInfoModel.getPageCountForLoadTimeByDay(param)
    const result = {
      a: result_a.length ? result_a[0] : {},
      b: result_b.length ? result_b[0] : {},
      c: result_c.length ? result_c[0] : {},
      d: result_d.length ? result_d[0] : {},
      e: result_e.length ? result_e[0] : {},
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

  /**
   * 查询平均值
   * @returns {Promise<*>}
   */
  static async getPageLoadTimeForAll(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const {webMonitorId, timeSize} = param
    let result = {}
    const startHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 00"
    const endHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 23"
    await InfoCountByHourModel.getPageLoadTimeForAll(webMonitorId, startHour, endHour).then(data => {
      data.forEach((item) => {
        if (item.uploadType == "dns_hour_time" ||
            item.uploadType == "tcp_hour_time" ||
            item.uploadType == "ttfb_hour_time" ||
            item.uploadType == "resource_hour_time" ||
            item.uploadType == "dom_analysis_hour_time" ||
            item.uploadType == "loadpage_hour_time" ||
            item.uploadType == "http_hour_time") {
              result[item.uploadType] = item.count
        }
      })
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result)
  }

  /**
   * 查询每小时的平均值
   * @returns {Promise<*>}
   */
  static async getAvgLoadTimeForAllByHour(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const {webMonitorId, timeSize} = param
    let result = {}
    const startHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 00"
    const endHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 23"
    const uploadTypes = ["dns_hour_time", "tcp_hour_time", "ttfb_hour_time", "resource_hour_time", "dom_analysis_hour_time", "loadpage_hour_time"]
    for (let i = 0; i < uploadTypes.length; i ++) {
      await InfoCountByHourModel.getAvgLoadTimeForAllByHour(webMonitorId, uploadTypes[i], startHour, endHour).then(data => {
        result[uploadTypes[i]] = data
      })
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result)
  }


  /**
   * 查询每小时的平均值
   * @returns {Promise<*>}
   */
  static async getPageLoadTimeByType(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const {webMonitorId, timeSize, type} = param
    let result = {}
    const startHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 00"
    const endHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 23"
    await InfoCountByHourModel.getPageLoadTimeForAllByHour(webMonitorId, startHour, endHour).then(data => {
      data.forEach((item) => {
        if (item.uploadType == "dns_hour_time" ||
            item.uploadType == "tcp_hour_time" ||
            item.uploadType == "ttfb_hour_time" ||
            item.uploadType == "resource_hour_time" ||
            item.uploadType == "dom_analysis_hour_time" ||
            item.uploadType == "loadpage_hour_time" ||
            item.uploadType == "http_hour_time") {
              result[item.uploadType] = item.count
        }
      })
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result)
  }
  

  /**
   * 每分钟的数量分布
   * @returns {Promise<*>}
   */
  static async getPageLoadTimePercent(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    param.uploadTypes = `('${UPLOAD_TYPE.PAGE_COUNT_A}','${UPLOAD_TYPE.PAGE_COUNT_B}','${UPLOAD_TYPE.PAGE_COUNT_C}','${UPLOAD_TYPE.PAGE_COUNT_D}','${UPLOAD_TYPE.PAGE_COUNT_E}')`
    let result = {}
    await LoadPageInfoModel.getPageLoadTimePercent(param).then(data => {
      result = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result)
  }

  /**
   * 页面加载top10
   * @returns {Promise<*>}
   */
  static async getPageLoadTimeListByUrl(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    // await LoadPageInfoModel.getPageLoadTimeListByUrl(param).then(data => {
    //   result = data
    // })
    const {webMonitorId, timeSize} = param
    let result = []
    const startHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 00"
    const endHour = Utils.addDays(0 - timeSize).substring(5, 10) + " 23"
    await LoadTimeInfoByHourModel.getLoadTimeListByUrl(webMonitorId, startHour, endHour, UPLOAD_TYPE.PAGE_HOUR_COUNT_LOADTIME).then(data => {
      data.forEach((item) => {
        let obj = {
          simpleUrl: item.showName,
          count: item.count,
          loadPage: item.loadTime
        }
        result.push(obj)
      })
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success！', result)
  }
  
}

class CommonUtil {
    /**
   * 激活码解密
   */
  static decryptPurchaseCode(purchaseCode, originSecretCode) {
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
      // 位数只能是20，25, 30位，否则直接失效
      global.monitorInfo.purchaseCodeValid = isValid
      if (!(purchaseCode.length == 20 || purchaseCode.length == 25 || purchaseCode.length == 30)) {
        return {isValid: false, productType: 0}
      }

      // 如果是VIP版，需要授权码和解码匹配
      if (purchaseCode.length == 30) {
        // 开始生成解码
        let tempPurchaseCode = purchaseCode.split('').reverse().join('')
        let lastFiveChar = tempPurchaseCode.substring(tempPurchaseCode.length - 5, tempPurchaseCode.length)
        let preChar = tempPurchaseCode.substring(0, tempPurchaseCode.length - 5)
        let preChar1 = preChar.substring(0, 5)
        let preChar2 = preChar.substring(5, preChar.length)
        const finalChars = preChar1 + lastFiveChar + preChar2
        const secretCode = Utils.md5Hex(finalChars)
        if (originSecretCode != secretCode) {
          return {isValid: false, productType: 0}
        }
      }

      // 必须是20或25位纯大写字母
      const regCaps = /^[A-Z]{20,30}$/
      if (!regCaps.test(purchaseCode)) {
        return {isValid: false, productType: 0}
      }

      let productType = 0
      const count1 = purchaseCode.charAt(4).charCodeAt()
      const count2 = purchaseCode.charAt(9).charCodeAt()
      const tempCount1 = count2 - count1
      if (purchaseCode.length == 20) {
        productType = tempCount1
      } else if (purchaseCode.length == 25 || purchaseCode.length == 30) {
        const count3 = purchaseCode.charAt(20).charCodeAt()
        const count4 = purchaseCode.charAt(22).charCodeAt()
        const tempCount2 = (count4 - count3) * 10
        productType = tempCount1 + tempCount2
      }

      productType = parseInt(productType, 10)
      // 类型如果大于等于30，则无效
      if (productType >= 30) {
        return {isValid: false, productType: 0}
      }

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
        if (!(year0 == "2" && (year1 == "0" || year1 == "1"))) {
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
        } else if (purchaseCode.length == 25 || purchaseCode.length == 30) {
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
    console.log(" __          __  ______   ____    ______   _    _   _   _   _   _  __     __       _____   _   _ ".cyan)
    console.log(" \\ \\        / / |  ____| |  _ \\  |  ____| | |  | | | \\ | | | \\ | | \\ \\   / /      / ____| | \\ | |".cyan)
    console.log("  \\ \\  /\\  / /  | |__    | |_) | | |__    | |  | | |  \\| | |  \\| |  \\ \\_/ /      | |      |  \\| |".cyan)
    console.log("   \\ \\/  \\/ /   |  __|   |  _ <  |  __|   | |  | | | . ` | | . ` |   \\   /       | |      | . ` |".cyan)
    console.log("    \\  /\\  /    | |____  | |_) | | |      | |__| | | |\\  | | |\\  |    | |     _  | |____  | |\\  |".cyan)
    console.log("     \\/  \\/     |______| |____/  |_|       \\____/  |_| \\_| |_| \\_|    |_|    (_)  \\_____| |_| \\_|".cyan)
    console.log(" ")
    console.log(" ")
    console.log("服务启动中，请等待...".yellow)
    console.log("")
  }

  static async consoleInfo(startType) {
    if (startType) {
        console.log("启动 " + startType + " 模式...");
    }
    const timeStr = new Date().Format("yyyy-MM-dd hh:mm:ss")
    console.log("服务启动成功...".yellow)
    console.log("")
    console.log(timeStr.gray + " ".gray)
    console.log(timeStr.gray + " 作者：一步一个脚印一个坑".white)
    console.log(timeStr.gray + " 微信：webfunny_2020".white)
    console.log(" ")
    console.log(timeStr.gray + " 访问首页地址：", ("http://" + accountInfo.localAssetsDomain + "/webfunny/home.html ").blue.underline)
    console.log(" ")
    console.log(timeStr.gray + " 初始化管理员：", ("http://" + accountInfo.localAssetsDomain + "/webfunny/register.html?type=1 ").blue.underline)
    console.log(" ")
    console.log(timeStr.gray + " 部署问题集合：", "http://www.webfunny.cn/website/faq.html".blue.underline)
    console.log(" ")
    console.log(timeStr.gray + " 启动服务：", "npm run prd".cyan)
    console.log(timeStr.gray + " 重启服务：", "npm run restart".cyan)
    console.log(timeStr.gray + " 停止、删除进程：", "pm2 stop webfunny | pm2 delete webfunny".cyan)
    console.log(timeStr.gray + " 服务已在后台运行，命令行（终端）可关闭。".cyan)
    console.log(" ")
    console.log(timeStr.gray, "研发不易，需要鼓励。去给我们的项目点个 Star 吧".green, "https://github.com/a597873885/webfunny_monitor".cyan.underline)
    console.log(" ")

    const adminData = await UserModel.checkAdminAccount();
    const adminUserCount = adminData[0].count * 1
    // 在此查询数据库数据，如果查询成功，则说明启动成功了，可以打开浏览器
    ConfigModel.getConfigByConfigName("purchaseCode").then((res) => {
      if (res.length) {
        const url = adminUserCount > 0 ? `http://${accountInfo.localAssetsDomain}/webfunny/home.html` : `http://${accountInfo.localAssetsDomain}/webfunny/register.html?type=1`
        switch (process.platform) {
            //mac系统使用 一下命令打开url在浏览器
            case "darwin":
                exec(`open ${url}`);
            //win系统使用 一下命令打开url在浏览器
            case "win32":
                exec(`start ${url}`);
                // 默认mac系统
            default:
                exec(`open ${url}`);
        }
      }
    })
  }

  /*
   * 激活码检查
   * @static
   */
  static async checkPurchase(callback, failCallback) {
    const isValidMsg0 = "您好，您的激活码失效了，可能原因：1. 激活码过期了；2.您使用的是内网环境，无法初始化激活码；".red
    const isValidMsg1 = "如果您想继续试用，可以加我的微信（webfunny_2020），申请试用版激活码哦...".red
    const isValidMsg = "您也可以赞助我们升级为正式版哦，我们将努力做得更好，为大家服务，感谢您的支持：".green + "http://www.webfunny.cn/purchase.html".cyan.underline
    // 先检查默认配置有没有激活码，如果没有激活码，则自动为其填充一个免费版激活码

    const purchaseCodeRes = await ConfigModel.getConfigByConfigName("purchaseCode")
    const secretCodeRes = await ConfigModel.getConfigByConfigName("secretCode")

    // 如果数据库里没有解码，则去生成一个
    if (secretCodeRes.length === 0) {
      await ConfigModel.createConfig({configName: "secretCode", configValue: ''})
      CommonUtil.restartServer()
      return
    }
    // 如果数据库和配置文件里的激活码都不存在，则去生成一个
    if (purchaseCodeRes.length === 0 && !accountInfo.purchaseCode) {
      // 统计初始ABCD激活码
      Utils.post("http://monitor.webfunny.cn/server/upBp", {userId: "ABCD", locationPointId: 6}).then(() => {}).catch((e) => {})

      // 如果数据库激活码是空的，则自动给他生成一个试用版激活码
      await Utils.get("http://www.webfunny.cn/config/initPurchaseCode", {webfunnyVersion}).then(async(result) => {
        const inputPurchaseCode = result.data
        const newString = `module.exports = {
          purchaseCode: '${inputPurchaseCode}',
          secretCode: ''
        }`
        await fs.writeFile("./bin/purchaseCode.js", newString, (err) => {
          if (err) {
            throw err;
          }
          CommonUtil.restartServer()
          return
        });

        await ConfigModel.createConfig({configName: "purchaseCode", configValue: inputPurchaseCode})
        CommonUtil.restartServer()
        return
      }).catch((e) => {
        console.log("webfunny启动失败了，原因可能有两种：".red)
        console.log("1. 网络异常，执行重启命令试一下$: npm run restart".red)
        console.log("2. 贵公司的环境无法访问外部网络，无法获取激活码，请联系我们解决，微信号：webfunny_2020 ".red)
        return
      })
      return
    }
    let purchaseCode = accountInfo.purchaseCode ? accountInfo.purchaseCode : (purchaseCodeRes[0] ? purchaseCodeRes[0].configValue : "")
    let secretCode = accountInfo.secretCode ? accountInfo.secretCode : (secretCodeRes[0] ? secretCodeRes[0].configValue : "")
    // 如果配置文件里的激活码有效，则优先使用配置文件里的激活码
    const configPurchaseCodeRes = CommonUtil.decryptPurchaseCode(accountInfo.purchaseCode, accountInfo.secretCode)
    if (configPurchaseCodeRes.isValid) {
      purchaseCode = accountInfo.purchaseCode
      secretCode = accountInfo.secretCode
    }

    // 对黑名单做校验：不在库里的激活码，和真的黑名单，统一都叫黑名单
    let isBlacklist = false
    await Utils.postJson("http://www.webfunny.cn/config/isBlacklist", {cdkey: purchaseCode, secretCdKey: secretCode, webfunnyVersion}).then((result) => {
      isBlacklist = result.data
    }).catch((e) => {
      isBlacklist = false
    })

    if (isBlacklist === true) {
      setTimeout(function() {
        console.log(" ")
        console.log(isValidMsg0)
        console.log(isValidMsg1)
        console.log(" ")
        console.log(isValidMsg)
        log.printError(isValidMsg)
      }, 8000)
      // 黑名单埋点
      Utils.post("http://monitor.webfunny.cn/server/upBp", {userId: purchaseCode, locationPointId: 7}).then(() => {}).catch((e) => {})
      failCallback()
      return
    }
    // await getConfigByConfigName("purchaseCode")
    // 激活码有效性判断
    const { productType, isValid } = CommonUtil.decryptPurchaseCode(purchaseCode, secretCode)
    if (isValid == true) {
      // 启动试用版激活码，埋点
      if (productType == 0) {
        Utils.post("http://monitor.webfunny.cn/server/upBp", {userId: purchaseCode, locationPointId: 4}).then(() => {}).catch((e) => {})
      }
      // 如果激活码有效，发送部署统计数据
      const ipAddress = IP.address()
      const happenTime = new Date().getTime()
      Utils.postJson("http://www.webfunny.cn/config/memberActiveDeploy", {cdkey: purchaseCode, ip: ipAddress, webfunnyVersion, happenTime}).then(() => {}).catch((e) => {})
      // 设置激活码全局状态为true
      global.monitorInfo.purchaseCodeValid = true
      global.monitorInfo.productType = productType
      callback()
    } else {
      setTimeout(() => {
        console.log(" ")
        console.log(isValidMsg0)
        console.log(isValidMsg1)
        console.log(" ")
        console.log(isValidMsg)
        log.printError(isValidMsg)
      }, 8000)
      failCallback()
      // 激活码无效的埋点
      Utils.post("http://monitor.webfunny.cn/server/upBp", {userId: purchaseCode, locationPointId: 5}).then(() => {}).catch((e) => {})
    }
  }

  /**
   * 重启服务
   */
  static async restartServer() {
    console.log("即将执行重启命令... 如果未重启，请手动执行：npm run restart")
    process.exec("npm run restart &", function(error, stdout, stderr) {
      if (error) {
        log.printError("重启命令失败error：", error)
        log.printError("重启命令失败stdout：", stdout)
        log.printError("重启命令失败stderr：", stderr)
      }
    });
  }
}


class AlarmController {
    static async getCheckTime(ctx) {
        // ctx.response.status = 200;
        // ctx.body = statusCode.SUCCESS_200('success', waitCheckTime)
    }
    static async changeCheckTime(ctx) {
        let req = ctx.request.body
        const param = JSON.parse(req)
        const { waitCheckTime } = param
        const newString = `/**
        * 检查频率配置
        */
        module.exports = {
            waitCheckTime: ${waitCheckTime}      // 单位：分钟
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
    static async changeJsErrorConfig(ctx) {
        let req = ctx.request.body
        const param = JSON.parse(req)
        const { jsErrorCount, jsErrorPercent } = param
        const newString = `/**
        * JS异常报警配置
        */
        module.exports = {
            errorCount: ${jsErrorCount},
            errorPercent: ${jsErrorPercent}  // 这里是百分比
        }`
        await fs.writeFile("./interceptor/config/jsError.js", newString, (err) => {
            if (err) {
                throw err;
            }
            console.log("js错误配置成功，重启服务以生效...");
        });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async getConsoleErrorConfig(ctx) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', {consoleErrorCount: consoleError.errorCount, consoleErrorPercent: consoleError.errorPercent})
    }
    static async changeConsoleErrorConfig(ctx) {
        let req = ctx.request.body
        const param = JSON.parse(req)
        const { consoleErrorCount, consoleErrorPercent } = param
        const newString = `/**
        * consoleError异常报警配置
        */
        module.exports = {
            errorCount: ${consoleErrorCount},
            errorPercent: ${consoleErrorPercent}  // 这里是百分比
        }`
        await fs.writeFile("./interceptor/config/consoleError.js", newString, (err) => {
            if (err) {
                throw err;
            }
            console.log("consoleError错误配置成功，重启服务以生效...");
        });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async getHttpErrorConfig(ctx) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', {httpErrorCount: httpError.errorCount, httpErrorPercent: httpError.errorPercent})
    }
    static async changeHttpErrorConfig(ctx) {
        let req = ctx.request.body
        const param = JSON.parse(req)
        const { httpErrorCount, httpErrorPercent } = param
        const newString = `/**
        * consoleError异常报警配置
        */
        module.exports = {
            errorCount: ${httpErrorCount},
            errorPercent: ${httpErrorPercent}  // 这里是百分比
        }`
        await fs.writeFile("./interceptor/config/httpError.js", newString, (err) => {
            if (err) {
                throw err;
            }
            console.log("httpError错误配置成功，重启服务以生效...");
        });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    static async getResourceErrorConfig(ctx) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', {resourceErrorCount: resourceError.errorCount, resourceErrorPercent: resourceError.errorPercent})
    }
    static async changeResourceErrorConfig(ctx) {
        let req = ctx.request.body
        const param = JSON.parse(req)
        const { resourceErrorCount, resourceErrorPercent } = param
        const newString = `/**
        * consoleError异常报警配置
        */
        module.exports = {
            errorCount: ${resourceErrorCount},
            errorPercent: ${resourceErrorPercent}  // 这里是百分比
        }`
        await fs.writeFile("./interceptor/config/resourceError.js", newString, (err) => {
            if (err) {
                throw err;
            }
            console.log("resourceError错误配置成功，重启服务以生效...");
        });
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }

    static async handleAlarmResult(project, rule, value) {
        const { webMonitorId, projectType, projectName } = project
        const { type, compareType} = rule
        const compareStr = compareType === "up" ? ">=" : "<"
        const limitValue = parseInt(rule.limitValue, 10)
        const happenCount = parseInt(rule.happenCount, 10)
        if (!global.monitorInfo.alarmInfoList[webMonitorId]) {
            global.monitorInfo.alarmInfoList[webMonitorId] = {}
        }
        if (!global.monitorInfo.alarmInfoList[webMonitorId][type]) {
            global.monitorInfo.alarmInfoList[webMonitorId][type] = 0
        }
        const lastValue = global.monitorInfo.alarmInfoList[webMonitorId][type]
        if (compareType === "up" && value >= limitValue) {
            global.monitorInfo.alarmInfoList[webMonitorId][type] = lastValue + 1
        } else if (compareType === "down" && value < limitValue) {
            global.monitorInfo.alarmInfoList[webMonitorId][type] = lastValue + 1
        }
        // 到达发生次数，需要发出通知
        if (global.monitorInfo.alarmInfoList[webMonitorId][type] >= happenCount) {
            const userIds = JSON.parse(project.alarmMembers)
            const users = userIds.length ? await UserModel.getUsersByUserIds(userIds) : []
            if (!(users && users.length)) return
            // 发出告警通知
            AlarmUtil.alarmCallback(project, rule, users)
            // 警报信息进入消息表
            users.forEach((user) => {
                const alarmTitle = AlarmNames[type] + "警报！"
                const alarmContent = "您的" + projectType + "项目【" + projectName + "】发出警报：" +
                    type + "数量 " + compareStr + " " + limitValue + " 已经发生" + happenCount + "次了，请及时处理。"
                let link = `http://${accountInfo.localAssetsDomain}/webfunny/home.html`
                switch(type) {
                    case 'PV':
                    case 'UV':
                        link = `http://${accountInfo.localAssetsDomain}/webfunny/bigScreen.html?projectName=${project.projectName}&showType=realTimePv`
                        break
                    case 'JsError':
                    case 'ConsoleError':
                        link = `http://${accountInfo.localAssetsDomain}/webfunny/javascriptError.html`
                        break
                    case 'http':
                    case 'httpError':
                        link = `http://${accountInfo.localAssetsDomain}/webfunny/httpError.html`
                        break
                    case 'httpError':
                        link = `http://${accountInfo.localAssetsDomain}/webfunny/resourceError.html`
                        break
                    default:
                        break
                }
                let alarmContentArray = JSON.stringify([alarmContent])
                // 通知人员发送一条系统消息
                MessageModel.createMessage({
                    userId: user.userId,
                    title: alarmTitle,
                    content: alarmContentArray,
                    type: "alarm",
                    isRead: 0,
                    link
                })
            })
            // 发出通知后，计数清零
            global.monitorInfo.alarmInfoList[webMonitorId][type] = 0
        }
    }

    static async handleAlarmInfo(timeSize, project, ruleList) {
        const timestamp = new Date().getTime()
        const startTimeScope = new Date(timestamp - 60000 * timeSize).Format("yyyy-MM-dd hh:mm") + ":00"
        const endTimeScope = new Date(timestamp).Format("yyyy-MM-dd hh:mm") + ":00"
        for (let ruleIndex = 0; ruleIndex < ruleList.length; ruleIndex ++) {
            const rule = ruleList[ruleIndex]
            const { status, type } = rule
            if (status === true) {
                switch(type) {
                    case 'PV':
                        const pvObj = await CustomerPVModel.getPvUvInRealTimeByEveryMinute(project.webMonitorId, startTimeScope, endTimeScope);
                        let pvCount = 0
                        if (pvObj.length) {
                            pvCount = parseInt(pvObj[0].pvCount, 10)
                        }
                        AlarmController.handleAlarmResult(project, rule, pvCount)
                        break
                    case 'UV':
                        const uvObj = await CustomerPVModel.getPvUvInRealTimeByEveryMinute(project.webMonitorId, startTimeScope, endTimeScope);
                        let uvCount = 0
                        if (uvObj.length) {
                            uvCount = parseInt(uvObj[0].uvCount, 10)
                        }
                        AlarmController.handleAlarmResult(project, rule, uvCount)
                        break
                    case 'JsError':
                        const onErrorInfo = await JavascriptErrorInfoModel.getJsOnErrorCountInRealTimeByEveryMinute(project.webMonitorId, startTimeScope, endTimeScope);
                        let errorCount = 0
                        if (onErrorInfo.length) {
                            errorCount = parseInt(onErrorInfo[0].on_error, 10)
                        }
                        AlarmController.handleAlarmResult(project, rule, errorCount)
                        break
                    case 'ConsoleError':
                        const consoleErrorInfo = await JavascriptErrorInfoModel.getJsConsoleErrorCountInRealTimeByEveryMinute(project.webMonitorId, startTimeScope, endTimeScope);
                        let consoleErrorCount = 0
                        if (consoleErrorInfo.length) {
                            consoleErrorCount = parseInt(consoleErrorInfo[0].console_error, 10)
                        }
                        AlarmController.handleAlarmResult(project, rule, consoleErrorCount)
                        break
                    case 'http':
                        const httpCountInfo = await HttpLogInfoModel.getHttpCountInRealTimeByEveryMinute(project.webMonitorId, startTimeScope, endTimeScope);
                        let httpCount = 0
                        if (httpCountInfo.length) {
                            httpCount = parseInt(httpCountInfo[0].httpCount, 10)
                        }
                        AlarmController.handleAlarmResult(project, rule, httpCount)
                        break
                    case 'httpError':
                        const httpErrorCountInfo = await HttpErrorInfoModel.getHttpErrorCountInRealTimeByEveryMinute(project.webMonitorId, startTimeScope, endTimeScope);
                        let httpErrorCount = 0
                        if (httpErrorCountInfo.length) {
                            httpErrorCount = parseInt(httpErrorCountInfo[0].httpCount, 10)
                        }
                        AlarmController.handleAlarmResult(project, rule, httpErrorCount)
                        break
                    case 'resourceError':
                        const resourceErrorCountInfo = await ResourceLoadInfoModel.getResourceErrorCountInRealTimeByEveryMinute(project.webMonitorId, startTimeScope, endTimeScope);
                        let resourceErrorCount = 0
                        if (resourceErrorCountInfo.length) {
                            resourceErrorCount = parseInt(resourceErrorCountInfo[0].resourceErrorCount, 10)
                        }
                        AlarmController.handleAlarmResult(project, rule, resourceErrorCount)
                        break
                    default:
                        break
                }
            }
        }
    }

    /**
     * 检查警报
     */
    static async checkAlarm(hourTimeStr, minuteTimeStr) {
        const hourTimeShort = hourTimeStr.substring(0, 5)
        const secondTimeStr = minuteTimeStr.substring(3)
        if (secondTimeStr !== "00") return
        let minuteTimeInt = parseInt(minuteTimeStr.substring(0, 2), 10)
        const projectList = await ProjectController.getAllProjectListWithAlarm()
        for (let i = 0; i < projectList.length; i ++) {
            const project = projectList[i]
            const { alarmRuleId, alarmMembers, webMonitorId } = project
            // 如果警报Id,和警报人都存在
            if (alarmRuleId && alarmMembers) {
                // 获取警报规则
                const result = await AlarmRuleController.detail(alarmRuleId)
                const { ruleName, loopTime, quietStartTime, quietEndTime, ruleList } = result
                // 判断是否处于静默时间
                if (hourTimeShort >= quietStartTime && hourTimeShort < quietEndTime) return
                if (minuteTimeStr === "00:00") {
                    minuteTimeInt = 60
                }
                switch(loopTime) {
                    case 1:
                        if (secondTimeStr === "00") {
                            // 执行警报信息的检查计算
                            AlarmController.handleAlarmInfo(loopTime, project, JSON.parse(ruleList))
                        }
                        break
                    case 5:
                        if (minuteTimeInt % 5 === 0) {
                            // 执行警报信息的检查计算
                            AlarmController.handleAlarmInfo(loopTime, project, JSON.parse(ruleList))
                        }
                        break
                    case 10:
                        if (minuteTimeInt % 10 === 0) {
                            // 执行警报信息的检查计算
                            AlarmController.handleAlarmInfo(loopTime, project, JSON.parse(ruleList))
                        }
                        break
                    case 30:
                        if (minuteTimeInt % 30 === 0) {
                            // 执行警报信息的检查计算
                            AlarmController.handleAlarmInfo(loopTime, project, JSON.parse(ruleList))
                        }
                        break
                    default:
                        break
                }
            }
        }
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
    const { timeSize } = param
    param.timeSize = timeSize ? timeSize : "0"
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
    const { timeSize } = param
    param.timeSize = timeSize ? timeSize : "0"
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

  /*************大屏相关接口开始 ***************/
  /**
   * 根据平台类型，获取设备分类
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getErrorInfoInRealTimeByMinute(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { webMonitorId } = params
    const timestamp = new Date().getTime()
    const startTimeScope = new Date(timestamp - 60000).Format("yyyy-MM-dd hh:mm") + ":00"
    const endTimeScope = new Date(timestamp).Format("yyyy-MM-dd hh:mm") + ":00"
    if (req) {
      // jsError
      const jsErrorInfo = {}
      const errorInfo = await JavascriptErrorInfoModel.getJsErrorCountInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      jsErrorInfo[UPLOAD_TYPE.CONSOLE_ERROR] = 0
      jsErrorInfo[UPLOAD_TYPE.ON_ERROR] = 0
      errorInfo.forEach((item) => {
        jsErrorInfo[item.infoType] = item.count
      })
      
      // resourceError
      const resourceErrorCountInfo = await ResourceLoadInfoModel.getResourceErrorCountInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      //js错误率计算=js错误量uv数/uv总数
      //jsUV报错数
      const jsUVCount = JavascriptErrorInfoModel.getJsErrorUVCountInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      //UV报错总数
      const uvCount = JavascriptErrorInfoModel.getJsUVCountInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      let jsErrorRate = 0
      if (uvCount > 0) {
        jsErrorRate = Utils.toFixed((jsUVCount * 100) / uvCount, 2)
      }
      const result = {...jsErrorInfo, jsErrorRate, ...resourceErrorCountInfo[0]}
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }
}


class UserController {
  /**
   * webfunny
   */
  static sendEmail(email, title, content) {

    if (accountInfo.useCusEmailSys === true) {
      CusUtils.sendEmail(email, title, content, accountInfo.emailUser, accountInfo.emailPassword)
    } else {
      fetch("http://www.webfunny.cn/config/sendEmail",
      {
          method: "POST", 
          body: JSON.stringify({email, title, content}),
          headers: {
              "Content-Type": "application/json;charset=utf-8"
          }
      }).catch((e) => {
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
   * 管理员获取用户列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserListByAdmin(ctx) {
    let req = ctx.request.body
    const { userType } = ctx.user
    if (userType !== "admin") {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('非管理员，无权调用此接口！');
      return
    }
    if (req) {
      const data = await UserModel.getUserListByAdmin();
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }

  /**
   * 获取所有用户列表，只返回userId, name
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getAllUserInfoForSimple(ctx) {
    const data = await UserModel.getAllUserInfoForSimple();
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
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
  
  static async setValidateCode() {
    const charArr = "0123456789ABCDEFGHGKLMNOPQRSTUVWXYZabcdefghigkmnopqrstuvwxyz"
    let code = ""
    for (let i = 0; i < 4; i ++) {
      const tempIndex = Math.floor(Math.random() * (charArr.length - 1) + 1)
      code += charArr.charAt(tempIndex)
    }
    global.monitorInfo.loginValidateCode = code
    return code
  }

  static async refreshValidateCode(ctx) {
    const code = UserController.setValidateCode()
    if (global.monitorInfo.loginValidateCodeTimer) {
      clearInterval(global.monitorInfo.loginValidateCodeTimer)
    } else {
      global.monitorInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
      }, 5 * 60 * 1000)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', code)
  }

  static async getValidateCode(ctx) {
    const code = global.monitorInfo.loginValidateCode
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', code)
  }
  /**
   * 登录并创建token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { emailName, password, code } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const loginValidateCode = global.monitorInfo.loginValidateCode.toLowerCase()
    const loginCode = code.toLowerCase()
    if (loginValidateCode != loginCode) {
      UserController.setValidateCode()
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确，请重新输入！', 1)
      return
    }

    // registerStatus = 1 代表激活状态
    const data = {emailName, password: Utils.md5(decodePwd)}
    const userData = await UserModel.getUserForPwd(data)
    if (userData) {
      const { userId, userType, registerStatus } = userData
      if (registerStatus === 0) {
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('此账号尚未激活，请联系管理员激活！', 1)
        return
      }
      const accessToken = jwt.sign({userId, userType, emailName}, secret.sign, {expiresIn: 33 * 24 * 60 * 60 * 1000})
      global.monitorInfo.webfunnyTokenList.push(accessToken)
      UserController.setValidateCode()

      // 生成好的token存入数据库，如果已存在userId，则更新
      const userTokenInfo = await UserTokenModel.getUserTokenDetail(userId)
      if (userTokenInfo) {
        await UserTokenModel.updateUserToken(userId, {...userTokenInfo, accessToken})
      } else {
        await UserTokenModel.createUserToken({
          userId, accessToken
        })
      }

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('登录成功', accessToken)
    } else {
      UserController.setValidateCode()
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户名密码不正确！', 1)
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
    const charArr = "0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz"
    let code = ""
    for (let i = 0; i < 4; i ++) {
      const tempIndex = Math.floor(Math.random() * (charArr.length - 1) + 1)
      code += charArr.charAt(tempIndex)
    }
    if (global.monitorInfo.registerEmailCode[email]) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码发送太频繁', 1)
      return
    }
    global.monitorInfo.registerEmailCode[email] = code
    // 邮箱验证失败次数清零
    global.monitorInfo.registerEmailCodeCheckError[email] = 0
    // 1分钟后失效
    setTimeout(() => {
      delete global.monitorInfo.registerEmailCode[email]
    }, 2 * 60 * 1000)
    const title = "注册验证码：" + code
    const content = "<p>用户你好!</p>" + 
    "<p>Webfunny注册的验证码为：" + code + "</p>" +
    "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
    UserController.sendEmail(email, title, content)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('验证码已发送', 0)
  }

  /**
   * 给管理员发送检查邮件
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async registerCheck(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { name, email, emailCode, password } = param
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
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
    Utils.postJson("http://www.webfunny.cn/config/recordEmail", {email, purchaseCode: accountInfo.purchaseCode}).catch((e) => {})

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
    const { name, email, phone, password, emailCode } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const userId = Utils.getUuid()
    const data = {nickname: name, emailName: email, phone, password: Utils.md5(decodePwd), userId, userType: "customer", registerStatus: 0}
    
    const registerEmailCodeCheckError = global.monitorInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      if (!registerEmailCodeCheckError[email]) {
        registerEmailCodeCheckError[email] = 1
      } else {
        registerEmailCodeCheckError[email] ++
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }
    
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
        const title = "申请成功"
        const content = "<p>用户你好!</p>" + 
        "<p>你的账号已经申请成功，请联系管理员激活后，方可登录。</p>" +
        "<p>账号：" + email + " 、 密码：" + decodePwd + "</p>" +
        "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
        UserController.sendEmail(email, title, content)

        // 获取管理员账号
        const adminUser = await UserModel.getUserForAdmin()
        const contentArray = JSON.stringify([`您好，用户【${email}】正在申请注册webfunny账号，请及时处理！`])
        // 给管理员发送一条系统消息
        MessageModel.createMessage({
          userId: adminUser[0].userId,
          title: "用户注册通知",
          content: contentArray,
          type: "sys",
          isRead: 0,
          link: `http://${accountInfo.localAssetsDomain}/webfunny/userList.html`
        })
        // 给管理员发送一封邮件
        const adminTitle = "用户注册通知"
        const adminContent = `
        <p>尊敬的管理员：</p>
        <p>您好，用户【${email}】正在申请注册webfunny账号，请及时处理！</p>
        <p>点击链接处理：http://${accountInfo.localAssetsDomain}/webfunny/userList.html</p>
        <p>如有疑问，请联系作者，微信号：webfunny_2020</p>
        `
        UserController.sendEmail(adminUser[0].emailName, adminTitle, adminContent)

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
      }
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  /**
   * 重置密码
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async resetPwd(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const { email, password, emailCode } = param
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const data = {emailName: email, password: Utils.md5(decodePwd), emailCode}

    const registerEmailCodeCheckError = global.monitorInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.monitorInfo.registerEmailCode[email]
    const emailCodeStr = emailCode.toLowerCase()
    // 判断验证码是否正确或是否失效
    if (!registerEmailCode || emailCodeStr != registerEmailCode.toLowerCase()) {
      if (!registerEmailCodeCheckError[email]) {
        registerEmailCodeCheckError[email] = 1
      } else {
        registerEmailCodeCheckError[email] ++
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码不正确或已失效！', 1)
      return
    }

    // 判断用户名或者账号是否已经存在
    let emailData = await UserModel.checkUserAccount(email)
    if (!emailData) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('此邮箱不存在！', 1)
      return
    }
    let ret = await UserModel.resetPwd(email, data);
    if (ret) {
      // 通知用户注册的账号密码
      const title = "密码重置成功！"
      const content = "<p>用户你好!</p>" + 
      "<p>你的webfunny密码已重置。</p>" +
      "<p>账号：" + email + " 、 密码：" + decodePwd + "</p>" +
      "<p>如有疑问，请联系作者，微信号：webfunny_2020</p>"
      UserController.sendEmail(email, title, content)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    } else {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('重置密码失败！', 1)
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
    const decodePwd = Utils.b64DecodeUnicode(password).split("").reverse().join("")
    const userId = Utils.getUuid()
    const data = {nickname: name, emailName: email, password: Utils.md5(decodePwd), userType, userId, registerStatus: 1}

    // 记录注册邮箱
    Utils.postJson("http://www.webfunny.cn/config/recordEmail", {email, purchaseCode: accountInfo.purchaseCode}).catch((e) => {})

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
  /**
   * 激活注册用户
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async activeRegisterMember(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId, emailName } = param
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.activeRegisterMember(userId);

      MessageModel.createMessage({
        userId: userId,
        title: "欢迎登录！",
        content: JSON.stringify([
          "尊敬的用户您好，欢迎登录webfunny前端监控系统。",
          "webfunny致力于解决前端的各种问题，纯私有化部署，支持千万级PV的日活量。",
          "支持项目：H5前端、PC前端、微信小程序、uni-app。",
          "使用方法和常见问题请移步官网：www.webfunny.cn"
        ]),
        type: "sys",
        isRead: 0,
        link: `http://www.webfunny.cn`
      })
      // 给用户发送一封邮件
      const activeTitle = "用户激活通知"
      const activeContent = `
      <p>尊敬的用户：</p>
      <p>您好，您的账号已经被管理员激活了，快去登录吧！</p>
      <p>如有疑问，请联系作者，微信号：webfunny_2020</p>
      `
      UserController.sendEmail(emailName, activeTitle, activeContent)
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户已激活', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('激活失败')
    }
  }
  /**
   * 删除
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async deleteRegisterMember(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { userId } = param
    /* 判断参数是否合法 */
    if (userId) {
      await UserModel.deleteUserByUserId(userId);
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('用户信息删除成功', 0)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('缺失userId！')
    }
  }
}

class CommonUpLog {
  static async checkStatus(ctx) {
    const monitorInfo = global.monitorInfo
    if (monitorInfo.purchaseCodeValid !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("激活码失效了，请联系我们，微信号：webfunny_2020。", false)
      return false
    }
    if (monitorInfo.logServerStatus !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("服务已暂停", false)
      return false
    }
  }
  /**
   * 接受并分类处理上传的日志（H5）
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upLog(ctx) {
    const monitorInfo = global.monitorInfo
    if (monitorInfo.purchaseCodeValid !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("激活码失效了，请联系我们，微信号：webfunny_2020。", false)
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
    // 获取header里边的消息有风险，可能无法获取到user-agent, 因为可能经过转发，header里没有user-agent了
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
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("", "")
      CommonUpLog.handleLogInfo(logInfo)
    } else {
      try {
        // const paramStr = ctx.request.body.data.replace(/": Script error\./g, "script error")
        // const param = JSON.parse(paramStr)
        // const { logInfo } = param
        // if (!logInfo) {
        //   console.log(param, typeof param)
        // }
        const logArray = Utils.logParseJson(ctx.request.body.data)
        // 说明日志异常了，返回默认值。
        if (logArray.length === 0) {
          ctx.response.status = 200;
          ctx.body = statusCode.SUCCESS_200("", {d: "d"})
          return
        }
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
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200("", {d: status, c: global.monitorInfo.projectConfigs[webMonitorId]})

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
          logInfo.firstUserParam = Utils.b64DecodeUnicode(logInfo.firstUserParam || "")
          logInfo.completeUrl = Utils.b64DecodeUnicode(logInfo.completeUrl);
          // 对url进行加密处理
          infoType = logInfo.uploadType
  
          // 这个位置决定是否放入到消息队列中
          const { accountInfo } = AccountConfig
          const { messageQueue } = accountInfo

          // 判断webMonitorId是不是在开启列表里
          const { webMonitorId } = logInfo
          if (global.monitorInfo.cacheWebMonitorIdList.indexOf(webMonitorId) === -1) {
            const randCount = Math.floor(Math.random() * 10)
            if (randCount === 5) {
              log.printError(`${webMonitorId} 项目不存在，或者处于关闭状态，日志被过滤`)
            }
            return
          }
          if (messageQueue === true) {
            // 订阅版
            // 启动消息队列
            if (infoType === "CUSTOMER_PV") {
              logInfo.browserInfo = browserInfo
            }
            const logInfoMsg2 = JSON.stringify(logInfo)
            sendMq.sendQueueMsg("upload_log_b", logInfoMsg2, (res) => {

            },(error) => {
              log.printError("消息队列推送报错: " + logInfo.uploadType, error )
            })
          } else {
            CommonUpLog.handleLogInfo(logInfo, browserInfo)
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
  static async upMyLog(ctx) {
    const req = ctx.req
    const monitorInfo = global.monitorInfo
    if (monitorInfo.purchaseCodeValid !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("激活码失效了，请联系我们，微信号：webfunny_2020。", false)
      return
    }
    if (monitorInfo.logServerStatus !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("服务已暂停", false)
      return
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200("", "")

    const clientIpString = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const logInfoArray = ctx.request.body.logs
    // console.log("======================")
    // console.log(logInfoArray)

    if (!logInfoArray && logInfoArray.length <= 0) {
        return
    }
    for( let i = 0; i < logInfoArray.length; i ++) {

        let logInfo = logInfoArray[i]
        const { uploadType, happenTime, completeUrl, monitorIp } = logInfo
        
        logInfo.happenTime = typeof happenTime === "number" ? happenTime : parseInt(happenTime, 10)
        const timeOffset = new Date().getTimezoneOffset() + 480
        logInfo.happenDate = new Date(logInfo.happenTime + timeOffset * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss")
        logInfo.happenHour = logInfo.happenDate.substring(0, 13)
        // logInfo.happenDate = new Date(logInfo.happenTime).Format("yyyy-MM-dd hh:mm:ss")
        logInfo.simpleUrl = completeUrl
        logInfo.monitorIp = monitorIp ? monitorIp : clientIpString

        // 判断webMonitorId是不是在开启列表里
        const { webMonitorId } = logInfo
        if (global.monitorInfo.cacheWebMonitorIdList.indexOf(webMonitorId) === -1) {
          const randCount = Math.floor(Math.random() * 10)
          if (randCount === 5) {
            log.printError(`${webMonitorId} 项目不存在，或者处于关闭状态，日志被过滤`)
          }
          return
        }

        switch (uploadType) {
            case "CUSTOMER_PV":
                const browserInfo = req.headers['user-agent']
                // 根据IP地址获取位置
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
                await CustomerPVModel.createCustomerPV(logInfo);
                break;
            case "JS_ERROR":
                handleResultWhenJavascriptError(logInfo)
                await JavascriptErrorInfoModel.createJavascriptErrorInfo(logInfo);
                break;
            case "HTTP_LOG":
                handleResultWhenHttpRequest(logInfo)
                const status = parseInt(logInfo.status || 0)
                
                // 处理simpleHttpUrl
                try {
                    let httpUrl = Utils.b64DecodeUnicode(logInfo.httpUrl);
                    // httpUrl = httpUrl ? httpUrl.replace(/([0-9a-zA-Z]{4}-){2,4}[0-9a-zA-Z]{1,4}/g, "****-") : httpUrl
                    const simpleHttpUrl = httpUrl.split("?")[0];
                    logInfo.simpleHttpUrl = simpleHttpUrl;
                } catch(e) {
                    log.error(ctx, e, new Date())
                }
        
                if (status > 299) {
                    await HttpErrorInfoModel.createHttpErrorInfo(logInfo);
                } else {
                    await HttpLogInfoModel.createHttpLogInfo(logInfo);
                }
                break;
            case "CUSTOMIZE_BEHAVIOR":
            default:
                await ExtendBehaviorInfoModel.createExtendBehaviorInfo(logInfo);
                break;
        }
    }
  }
  /**
   * 接受并分类处理上传的日志（小程序）
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upMog(ctx) {
    const monitorInfo = global.monitorInfo
    // if (monitorInfo.purchaseCodeValid !== true) {
    //   ctx.response.status = 200;
    //   ctx.body = statusCode.SUCCESS_200("激活码失效了，请按照页面引导，创建激活码。", false)
    //   return
    // }
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
      CommonUpLog.handleLogInfo(logInfo)
    } else {
      try {

        const logArray = ctx.request.body
        // 处理返回值开始
        const tempLogInfo = logArray[0];
        const userId = Utils.md5Encrypt(tempLogInfo.userId)
        const webMonitorId = tempLogInfo.webMonitorId
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
          const logInfo = logArray[i];
          // for( let key in logInfo) {
          //   if (monitorKeys[key]) {
          //     logInfo[monitorKeys[key]] = logInfo[key]
          //     delete logInfo[key]
          //   }
          // }
          logInfo.monitorIp = logInfo.monitorIp ? logInfo.monitorIp : clientIpString
          logInfo.userId = Utils.md5Encrypt(logInfo.userId || "")
          logInfo.completeUrl = Utils.b64DecodeUnicode(logInfo.completeUrl);
          // 对url进行加密处理
          infoType = logInfo.uploadType
  
          // 这个位置决定是否放入到消息队列中
          const { accountInfo } = AccountConfig
          const { messageQueue } = accountInfo
          if (messageQueue === true) {
            // 启动消息对列
            const logInfoMsg2 = JSON.stringify(logInfo)
            sendMq.sendQueueMsg("upload_mog", logInfoMsg2, (res) => {
            },(error) => {
              log.printError("消息队列推送报错: " + logInfo.uploadType, error )
            })
          } else {
            CommonUpLog.handleLogInfo(logInfo, browserInfo)
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
  static async handleLogInfo(logInfo, browserInfo) {
    // const {webMonitorId} = logInfo
    // 判断webMonitorId是不是在开启列表里
    // if (global.monitorInfo.cacheWebMonitorIdList.indexOf(webMonitorId) === -1) return

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
    const timeOffset = new Date().getTimezoneOffset() + 480
    const happenTime = parseInt(logInfo.happenTime, 10) + timeOffset * 60 * 1000
    logInfo.happenDate = new Date(happenTime).Format("yyyy-MM-dd hh:mm:ss")
    logInfo.happenHour = logInfo.happenDate.substring(0, 13)

    switch (logInfo.uploadType) {
      case "ELE_BEHAVIOR":
        // await BehaviorInfoModel.createBehaviorInfo(logInfo);
        CommonUpLog.selectLogInfoIntoQueue(logInfo, "createBehaviorInfo", "createBehaviorInfos")
        break;
      case "JS_ERROR":
        handleResultWhenJavascriptError(logInfo)
        // await JavascriptErrorInfoModel.createJavascriptErrorInfo(logInfo);
        CommonUpLog.selectLogInfoIntoQueue(logInfo, "createJavascriptErrorInfo", "createJavascriptErrorInfos")
        break;
      case "HTTP_LOG":
        // if (logInfo.responseText) {
        //   const resConLen = accountInfo.httpReqRes.responseTextLength || 500
        //   logInfo.responseText = logInfo.responseText.length > resConLen ? "内容太长" : logInfo.responseText
        // }
        handleResultWhenHttpRequest(logInfo)
        const status = parseInt(logInfo.status || 0)
        
        // 处理simpleHttpUrl
        try {
          let httpUrl = Utils.b64DecodeUnicode(logInfo.httpUrl);
          // httpUrl = httpUrl ? httpUrl.replace(/([0-9a-zA-Z]{4}-){2,4}[0-9a-zA-Z]{1,4}/g, "****-") : httpUrl
          const simpleHttpUrl = httpUrl.split("?")[0];
          logInfo.simpleHttpUrl = simpleHttpUrl;
        } catch(e) {
          log.error(ctx, e, new Date())
        }

        if (status > 299) {
          // await HttpErrorInfoModel.createHttpErrorInfo(logInfo);
          logInfo.uploadType = "HTTP_ERROR"
          CommonUpLog.selectLogInfoIntoQueue(logInfo, "createHttpErrorInfo", "createHttpErrorInfos")
        } else {
          // await HttpLogInfoModel.createHttpLogInfo(logInfo);
          CommonUpLog.selectLogInfoIntoQueue(logInfo, "createHttpLogInfo", "createHttpLogInfos")
        }
        break;
      case "SCREEN_SHOT":
        await ScreenShotInfoModel.createScreenShotInfo(logInfo);
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

        CommonUpLog.selectLogInfoIntoQueue(logInfo, "createCustomerPV", "createCustomerPVs")
        break;
      case "CUS_LEAVE":
        // await CustomerPvLeaveModel.createCustomerPvLeave(logInfo);
        CommonUpLog.selectLogInfoIntoQueue(logInfo, "createCustomerPvLeave", "createCustomerPvLeaves")
        break;
      case "STAY_TIME":
        await CustomerStayTimeModel.createCustomerStayTime(logInfo);
        break;
      case "VIDEOS_EVENT":
        await VideosInfoModel.createVideos(logInfo);
        break;
      case "LOAD_PAGE":
        await LoadPageInfoModel.createLoadPageInfo(logInfo);
        break;
      case "RESOURCE_LOAD":
        if (logInfo.sourceUrl) {
          handleResultWhenResourceError(logInfo)
          await ResourceLoadInfoModel.createResourceLoadInfo(logInfo);
        }
        break;
      case "CUSTOMIZE_BEHAVIOR":
      default:
        await ExtendBehaviorInfoModel.createExtendBehaviorInfo(logInfo);
        break;
    }
    // 判断是否有连接线上用户, 如果连线的用户，就将信息存入到全局变量中
    const userId = logInfo.userId
    const userIdArray = global.monitorInfo.userIdArray
    const debugInfoArray = global.monitorInfo.debugInfoArray
    const tempDebugInfoArray = global.monitorInfo.tempDebugInfoArray || {}

    if (userIdArray.indexOf(userId) != -1) {
      if (!debugInfoArray[userId]) debugInfoArray[userId] = []
      if (!tempDebugInfoArray[userId]) tempDebugInfoArray[userId] = []
      tempDebugInfoArray[userId].push(logInfo)
    }
    // console.log(userId, userIdArray, tempDebugInfoArray, debugInfoArray)
    if (tempDebugInfoArray[userId] && tempDebugInfoArray[userId].length >= 10) {
      Utils.quickSortForObject(tempDebugInfoArray[userId], "happenTime", 0, tempDebugInfoArray[userId].length - 1)
      debugInfoArray[userId] = debugInfoArray[userId].concat(tempDebugInfoArray[userId])
      tempDebugInfoArray[userId] = []
    }
  }

  /**
   * 处理日志，判断是否要放入到队列中
   * @param uploadType 日志类型 如：CUSTOMER_PV
   * @param logInfo 日志对象
   * @param insertFunForOne 单个插入的方法名
   * @param insertFunForMulti 批量插入的方法名
   */
  static async selectLogInfoIntoQueue(logInfo, insertFunForOne, insertFunForMulti) {
    const uploadType = logInfo.uploadType
    const logInfoQueue = global.monitorInfo.logInfoQueue
    // 如果不是今天的日志，就直接入库，
    let happenDateStr = logInfo.happenDate.substring(0, 10)
    let currentDateStr = new Date().Format("yyyy-MM-dd")
    if (happenDateStr !== currentDateStr) {
      await CustomerPVModel[insertFunForOne](logInfo);
      return
    }
    // 日志进队列操作
    if (!logInfoQueue[logInfo.webMonitorId]) {
      logInfoQueue[logInfo.webMonitorId] = {}
    }
    if (!logInfoQueue[logInfo.webMonitorId][uploadType]) {
      logInfoQueue[logInfo.webMonitorId][uploadType] = []
    }
    // 如果小于100，就添加到数组中，如果达到100，就立即上报
    let currentInfoArray = logInfoQueue[logInfo.webMonitorId][uploadType]
    if (currentInfoArray.length < 100) {
      currentInfoArray.push(logInfo)
    } else {
      await CustomerPVModel[insertFunForMulti](currentInfoArray);
      currentInfoArray = []
    }
  }

  /**
   * 每隔10s中会调用此方法
   * 开始消费内存中的日志信息
   */
  static async handleLogInfoQueue() {
    const logInfoQueue = global.monitorInfo.logInfoQueue
    for (let webMonitorId in logInfoQueue) {
      let tempLogInfo = logInfoQueue[webMonitorId]
      if (tempLogInfo["CUSTOMER_PV"]) {
        await CustomerPVModel.createCustomerPVs(tempLogInfo["CUSTOMER_PV"]);
        tempLogInfo["CUSTOMER_PV"] = []
      }
      if (tempLogInfo["HTTP_LOG"]) {
        await HttpLogInfoModel.createHttpLogInfos(tempLogInfo["HTTP_LOG"]);
        tempLogInfo["HTTP_LOG"] = []
      }
      if (tempLogInfo["HTTP_ERROR"]) {
        await HttpErrorInfoModel.createHttpErrorInfos(tempLogInfo["HTTP_ERROR"]);
        tempLogInfo["HTTP_ERROR"] = []
      }
      if (tempLogInfo["ELE_BEHAVIOR"]) {
        await BehaviorInfoModel.createBehaviorInfos(tempLogInfo["ELE_BEHAVIOR"]);
        tempLogInfo["ELE_BEHAVIOR"] = []
      }
      if (tempLogInfo["JS_ERROR"]) {
        await JavascriptErrorInfoModel.createJavascriptErrorInfos(tempLogInfo["JS_ERROR"]);
        tempLogInfo["JS_ERROR"] = []
      }
      if (tempLogInfo["CUS_LEAVE"]) {
        await CustomerPvLeaveModel.createCustomerPvLeaves(tempLogInfo["CUS_LEAVE"]);
        tempLogInfo["CUS_LEAVE"] = []
      }
    }
  }

  /**
   * 接受并分类处理上传的日志 (连线用户模式)
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upDLog(ctx) {
    let errorLogInfo = ""
    try {
      const paramStr = ctx.request.body.data
      const param = JSON.parse(paramStr)
      const { localInfo, sessionInfo, cookieInfo, consoleInfo, warnInfo, videosInfo, userId} = param

      const debugClearLocalInfoList = global.monitorInfo.debugClearLocalInfo
      const clearUserIndex = debugClearLocalInfoList.indexOf(userId)
      let clearStatus = 0
      if (clearUserIndex !== -1) {
        clearStatus = 1
        debugClearLocalInfoList.splice(clearUserIndex, 1)
      }
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("", {clear: clearStatus})

      // let userId = null
      let debugInfo = global.monitorInfo.debugInfo
      if (localInfo) {
        const infoStr = Utils.b64DecodeUnicode(localInfo)
        const result = JSON.parse(infoStr)
        // userId = JSON.parse(result.wmUserInfo).userId
        if (!debugInfo[userId]) debugInfo[userId] = {}
        debugInfo[userId].localInfo = result
      } else {
        if (!debugInfo[userId]) debugInfo[userId] = {}
        debugInfo[userId].localInfo = {}
      }
      if (sessionInfo) {
        const infoStr = Utils.b64DecodeUnicode(sessionInfo)
        const result = JSON.parse(infoStr)
        if (!debugInfo[userId]) debugInfo[userId] = {}
        debugInfo[userId].sessionInfo = result
      } else {
        debugInfo[userId].sessionInfo = {}
      }
      if (cookieInfo) {
        const infoStr = Utils.b64DecodeUnicode(cookieInfo)
        const result = Utils.parseCookies(infoStr)
        if (!debugInfo[userId]) debugInfo[userId] = {}
        debugInfo[userId].cookieInfo = result
      } else {
        debugInfo[userId].cookieInfo = {}
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
        const infoStr = Utils.b64DecodeUnicode(resultInfo)
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
        if (logArray.length > 100) {
          logArray.splice(logArray.length - 100, logArray.length)
        }
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
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("fail", 1)
      log.printError("Debug信息上报失败：")
      log.printError(errorLogInfo, e)
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
   * 获取今天的流量数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getTodayFlowDataByTenMin(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { timeSize, webMonitorId, chooseUserTag } = params
    const day = utils.addDays(0 - timeSize)

    const project = await ProjectModel.getProjectDetailForWebMonitorId(webMonitorId);
    if (!project) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('success', {todayPvData: [], todayUvData: [], todayNewData: [], todayIpData: [], todayCusLeavePercentData: []});
      return
    }
    // 再往前推一天
    const lastDay = utils.addDays(0 - timeSize - 1)
    if (timeSize == 0) {
      // 如果是当天，则计算一下实时数据
      await Common.calculateCountByDayForRealTime(0, webMonitorId)
    }

    // 获取当天过去的每小时数据总和
    const todayPvData = await CustomerPVModel.getPVFlowDataForDay(webMonitorId, lastDay, day, chooseUserTag);
    const todayUvData = await CustomerPVModel.getUVFlowDataForDay(webMonitorId, lastDay, day, chooseUserTag);
    const todayNewData = await CustomerPVModel.getNewFlowDataForDay(webMonitorId, lastDay, day, chooseUserTag);
    const todayIpData = await CustomerPVModel.getIpFlowDataForDay(webMonitorId, lastDay, day, chooseUserTag);

    // 获取当前小时内的数据量
    // const todayPvData = await CustomerPVModel.getPVFlowDataForDay(webMonitorId, day, chooseUserTag);
    // const todayUvData = await CustomerPVModel.getUVFlowDataForDay(webMonitorId, day, chooseUserTag);
    // const todayNewData = await CustomerPVModel.getNewFlowDataForDay(webMonitorId, day, chooseUserTag);
    // const todayIpData = await CustomerPVModel.getIpFlowDataForDay(webMonitorId, day, chooseUserTag);

    const todayCusLeavePercentData = await CustomerPvLeaveModel.getCusLeavePercentDataForDay(webMonitorId, lastDay, day);
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
    const { webMonitorId, chooseUserTag } = params
    const day = utils.addDays(0 - 29)
    let uvData = await CustomerPVModel.uvCountForMonth(webMonitorId, UPLOAD_TYPE.UV_COUNT_DAY + chooseUserTag, day);
    let newUvData = await CustomerPVModel.uvCountForMonth(webMonitorId, UPLOAD_TYPE.NEW_COUNT_DAY + chooseUserTag, day);
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
    const { webMonitorId, chooseUserTag } = params
    const day = utils.addDays(0)
    const todayPvData = await CustomerPVModel.getPVFlowDataForDay(webMonitorId, day, chooseUserTag);
    const todayUvData = await CustomerPVModel.getUVFlowDataForDay(webMonitorId, day, chooseUserTag);
    const todayNewData = await CustomerPVModel.getNewFlowDataForDay(webMonitorId, day, chooseUserTag);
    const todayIpData = await CustomerPVModel.getIpFlowDataForDay(webMonitorId, day, chooseUserTag);

    const todayPvCount = todayPvData.length > 0 ? todayPvData[0].dayCount :0
    const todayUvCount = todayUvData.length > 0 ? todayUvData[0].dayCount :0
    const todayNewCount = todayNewData.length > 0 ? todayNewData[0].dayCount :0
    const todayIpCount = todayIpData.length > 0 ? todayIpData[0].dayCount :0


    const today = {
      pv: todayPvCount,
      uv: todayUvCount,
      newCus: todayNewCount,
      ip: todayIpCount,
      per: todayPvCount !== 0 ? (todayPvData[0].dayCount / todayUvData[0].dayCount).toFixed(2) : 0
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
    let result1 = []
    await CustomerPVModel.getPvCountByMinute(param).then(data => {
      result1 = data
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {uv: result1})
  }

  static async getProvinceCountBySeconds(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const pvList = await CustomerPVModel.getPvsInfoByTenSeconds(param)
    const newCusData = await CustomerPVModel.getNewCusInfoBySeconds(param)
    const provinceData = await CustomerPVModel.getProvinceCountBySeconds(param)
    const newCusCount = (newCusData && newCusData[0]) ? newCusData[0].count : 0
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {pvList, provinceData, newCusCount})
  }
  static async getLocationDataForMap(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const provinceData = await CustomerPVModel.getProvinceCountByDay(param)
    const countryData = await CustomerPVModel.getCountryCountByDay(param)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {provinceData, countryData})
  }
  static async getTagsPercent(ctx) {
    let req = ctx.request.body
    const param = JSON.parse(req)
    const tagsPercentData = await CustomerPVModel.getTagsPercent(param)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', tagsPercentData)
  }

  static async getAliveCusInRealTime(ctx) {
    let req = ctx.request.body
    const {webMonitorIdList} = JSON.parse(req)
    const uvList = []
    // let webMonitorIdList = []
    // const data = await ProjectModel.getWebMonitorIdList();
    // data.forEach((pro) => {
    //   webMonitorIdList.push(pro.webMonitorId)
    // })

    for(let i = 0; i < webMonitorIdList.length; i ++) {
      let data = await CustomerPVModel.getAliveCusInRealTime(webMonitorIdList[i])
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
      data[i].showName = data[i].showName === "0" ? "未知" : citys[cityKey] || cityKey
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  static async getCityCountOrderByCountTop20(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getCityCountOrderByCountTop20(params);
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

  static async getDeviceSizeCountOrderByCount(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getDeviceSizeCountOrderByCount(params);
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

  static async getReferrerCountOrderByCount(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const data = await CustomerPVModel.getReferrerCountOrderByCount(params);
    data.forEach((item) => {
      if (item.showName === "") {
        item.showName = "直接访问"
      }
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }

  static async getPvListByPage(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const totalCountData = await CustomerPVModel.getPvListTotalCountByTime(params);
    const totalCount = totalCountData[0].count
    const data = await CustomerPVModel.getPvListByPage(params);
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {list: data, totalCount})
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

  /*************大屏相关接口开始 ***************/
  /**
   * 根据平台类型，获取设备分类
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getPvUvInRealTimeByMinute(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const { webMonitorId } = params
    const timestamp = new Date().getTime()
    const startTimeScope = new Date(timestamp - 60000).Format("yyyy-MM-dd hh:mm") + ":00"
    const endTimeScope = new Date(timestamp).Format("yyyy-MM-dd hh:mm") + ":00"
    if (req) {
      // pvuv
      const pvuv = await CustomerPVModel.getPvUvInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      // 新用户
      const newUv = await CustomerPVModel.getNewUvInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      // 用户点击量
      const clickInfo = await BehaviorInfoModel.getClickCountInRealTimeByMinute(webMonitorId, startTimeScope, endTimeScope);
      const result = {...pvuv[0], ...newUv[0], ...clickInfo[0]}
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }

  /**
   * 获取半小时内数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getInitErrorInfoInRealTimeByTimeSize(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    //timeSize 30/60/...时间间隔
    const { webMonitorId, timeSize} = params
    const timestamp = new Date().getTime()
    const startTimeScope = new Date(timestamp - 6000 * (timeSize + 2)).Format("yyyy-MM-dd hh:mm") + ":00"
    const endTimeScope = new Date(timestamp - 60000).Format("yyyy-MM-dd hh:mm") + ":00"
    //日期时间切分
    const splitTimeSize = utils.splitTime(startTimeScope, endTimeScope, timeSize);
    //组装数据
    const resultMap = new Map()
    if (req) {
      // pvuv
      const pvuv = await CustomerPVModel.getPvUvInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      for(let i = 0;i<splitTimeSize.length;i++) {
        resultMap.set(splitTimeSize[i],
          {
            time:splitTimeSize[i],
            pvCount: '0',
            uvCount: '0',
            newUvCount: '0',
            clickCount: '0',
            httpCount: '0',
            httpErrorCount: '0',
            httpTotalCount: '0',
            loadTime: '0',
            console_error: '0',
            on_error: '0',
            resourceErrorCount: '0',
            httpSuccessPer: 100,
            jsErrorRate: '0'
          });
      }
      // 新用户
      const newUv = await CustomerPVModel.getNewUvInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      
      // 用户点击量
      const clickInfo = await BehaviorInfoModel.getClickCountInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      
      // httpCount
      const httpCountInfo = await HttpLogInfoModel.getHttpCountInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      
      // httpErrorCount
      const httpErrorCountInfo = await HttpErrorInfoModel.getHttpErrorCountInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      
      // 接口耗时
      const httpLoadTimeInfo = await HttpLogInfoModel.getHttpLoadTimeInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
     
      // 自定义错误量
      const consoleErrorInfo = await JavascriptErrorInfoModel.getJsConsoleErrorCountInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      
      // js报错量
      const onErrorInfo = await JavascriptErrorInfoModel.getJsOnErrorCountInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      
      // resourceError
      const resourceErrorCountInfo = await ResourceLoadInfoModel.getResourceErrorCountInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      
      //jsUV报错数
      const jsOnErrorUvCountInfo = JavascriptErrorInfoModel.getJsErrorUVCountInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      for (let i = 0; i < jsOnErrorUvCountInfo.length; i ++) {
        for (let [key,value] of resultMap){
          if (key == jsOnErrorUvCountInfo[i].time){
            value['jsOnErrorUvCount'] = (jsOnErrorUvCountInfo[i].jsOnErrorUvCount);
          }else{
            value['jsOnErrorUvCount'] = '0'
          }
          resultMap.set(key,value);
        }
      }
      //UV报错总数
      const jsUvCountInfo = JavascriptErrorInfoModel.getJsUVCountInRealTimeByEveryMinute(webMonitorId, startTimeScope, endTimeScope);
      for (let i = 0; i < jsUvCountInfo.length; i ++) {
        for (let [key,value] of resultMap){
          if (key == jsUvCountInfo[i].time){
            value['jsUvCount'] = (jsUvCountInfo[i].jsUvCount);
          }else{
            value['jsUvCount'] = '0'
          }
          resultMap.set(key,value);
        }
      }
      //组装数据
      for (let [key,value] of resultMap){
        //pvuv
        for (let i = 0; i < pvuv.length; i ++) {
          if (key === pvuv[i].time){
            value['pvCount'] = (pvuv[i].pvCount+'');
            value['uvCount'] = (pvuv[i].uvCount+'');
          }
        }
        //newUvCount
        for (let i = 0; i < newUv.length; i ++) {
          if (key === newUv[i].time){
             value['newUvCount'] = (newUv[i].newUvCount);
           }
       }
         //clickCount
        for (let i = 0; i < clickInfo.length; i ++) {
          if (key === clickInfo[i].time){
             value['clickCount'] = (clickInfo[i].clickCount);
           }
       }
        //httpCount
        for (let i = 0; i < httpCountInfo.length; i ++) {
          if (key === httpCountInfo[i].time){
             value['httpCount'] = (httpCountInfo[i].httpCount);
           }
       }
        //httpErrorCount
         for (let i = 0; i < httpErrorCountInfo.length; i ++) {
          if (key === httpErrorCountInfo[i].time){
             value['httpErrorCount'] = (httpErrorCountInfo[i].httpErrorCount);
           }
       }
        //loadTime
        for (let i = 0; i < httpLoadTimeInfo.length; i ++) {
          if (key === httpLoadTimeInfo[i].time){
            const loadTime = parseInt(httpLoadTimeInfo[i].loadTime, 10)
            value['loadTime'] = utils.toFixed(loadTime / 1000, 1);
          }
       }
        //console_error
        for (let i = 0; i < consoleErrorInfo.length; i ++) {
          if (key === consoleErrorInfo[i].time){
             value['console_error'] = (consoleErrorInfo[i].console_error);
           }
       }
        //on_error
        for (let i = 0; i < onErrorInfo.length; i ++) {
          if (key === onErrorInfo[i].time){
             value['on_error'] = (onErrorInfo[i].on_error);
           }
       }
        //resourceErrorCount
        for (let i = 0; i < resourceErrorCountInfo.length; i ++) {
          if (key === resourceErrorCountInfo[i].time){
             value['resourceErrorCount'] = (resourceErrorCountInfo[i].resourceErrorCount);
           }
       }
        resultMap.set(key,value);
      }
      //计算请求成功率，js错误率
      for(let [key,value] of resultMap){
        // 请求成功率
        let httpSuccessPer = 100
        const httpTotalCount = parseInt(value.httpCount, 10) + parseInt(value.httpErrorCount, 10)
        if (httpTotalCount > 0) {
          if (value.httpCount === 0) {
            httpSuccessPer = 0
          } else {
            httpSuccessPer = utils.toFixed((value.httpCount * 100) / httpTotalCount , 2)
          }
          // console.log(httpTotalCount, value.httpCount, value.httpErrorCount)
          // console.log(key, httpSuccessPer)
          value['httpSuccessPer'] = httpSuccessPer
        }
        //js错误率计算=js错误量uv数/uv总数
        let jsErrorRate = 0
        if (value.jsUvCount > 0) {
          jsErrorRate = utils.toFixed((value.jsOnErrorUvCount) / value.jsUvCount, 2)
          value['jsErrorRate'] = (jsErrorRate * 100);
        }
        resultMap.set(key,value);
      }
      ctx.response.status = 200;
      let data = []
      for(let key of resultMap.keys()){
        data.push(resultMap.get(key))
      }
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！',  data)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  }
}


let webfunnyVersionForProject = "2.9.0"
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
        // const webfunnySecretCode = ctx.header['webfunny-secret-code'] 
        // if (webfunnySecretCode !== accountInfo.secretCode) {
        //     ctx.response.status = 200;
        //     ctx.body = statusCode.SUCCESS_200('解码不正确，请确认是否配置正确！', [])
        //     return
        // }
        const referer = ctx.req && ctx.req.headers && ctx.req.headers.referer
        // 调用此方法，说明用户访问了页面 开始
        fetch("http://www.webfunny.cn/config/customerReviewWeb",
        {
            method: "POST", 
            body: JSON.stringify({cdkey: accountInfo.purchaseCode, referer}),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        }).catch((e) => {
        })
        // 调用此方法，说明用户访问了页面 结束
        
        const param = Utils.parseQs(ctx.request.url)
        
        const {userId, userType} = ctx.user

        // 查找出这个userId创建的所有团队
        const teamList = await TeamModel.findTeamListByLeaderId(userId)
        let tempWebMonitorIds = ""
        teamList.forEach((team) => {
            tempWebMonitorIds += "," + team.webMonitorIds 
        })
        param.webMonitorIds = tempWebMonitorIds

        let projectList = []
        if (userType == "admin") {
            projectList = await ProjectModel.getAllProjectList()
        } else {
            projectList = await ProjectModel.getProjectList(param)
        }

        // 如果激活码到期或者无效，永远只取第一个项目
        let result = []
        if (global.monitorInfo.purchaseCodeValid && global.monitorInfo.purchaseCodeValid === true) {
            result = projectList
        } else if (projectList.length > 0) {
            result.push(projectList[0])
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', result)
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
        let req = ctx.request.body
        const params = JSON.parse(req)
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
     * 获取警报信息的项目列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getAllProjectListWithAlarm() {
        return ProjectModel.getAllProjectListWithAlarm()
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
        const newCus = todayNewData[0].count
        const uv = todayUvData[0].count < newCus ? newCus : todayUvData[0].count
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', {uv, newCus})
    }

    /**
     * 获取首页每个项目的实时信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectInfoListInRealTime(ctx) {
        let params = JSON.parse(ctx.request.body)
        const { sortType, appType, appStatus, searchName } = params
        const {userId} = ctx.user
        const projectData = await ProjectModel.getProjectDetailListBySearch({userId, appType, appStatus, searchName})
        let webMonitorIdList = []
        projectData.forEach((obj) => {
            webMonitorIdList.push(obj.webMonitorId)
        })
        // 查找出这个userId创建的所有团队
        const teamList = await TeamModel.findTeamListByLeaderId(userId)
        let tempWebMonitorIds = ""
        teamList.forEach((team) => {
            tempWebMonitorIds += "," + team.webMonitorIds 
        })
        const projectUvList = []
        const webMonitorIdArr = tempWebMonitorIds.split(",")

        const projectList = []
        webMonitorIdArr.forEach((item) => {
            const idIndex = webMonitorIdList.indexOf(item)
            if(idIndex !== -1) {
                projectList.push(projectData[idIndex])
            }
            // if (webMonitorIdList.includes(item)) {
            //     finalWebMonitorIds.push(item)
            // }
        })

        if (sortType === "uvDesc") {
            for (let i = 0; i < projectList.length; i ++) {
                let webMonitorId = projectList[i].webMonitorId
                if (webMonitorId) {
                    const todayUvData = await CustomerPVModel.getUVCountForDay(webMonitorId, 0, UPLOAD_TYPE.UV_COUNT_HOUR);
                    projectUvList.push({
                        webMonitorId: webMonitorId,
                        projectName: projectList[i].projectName,
                        projectType: projectList[i].projectType,
                        appStatus: projectList[i].recording,
                        uvCount: todayUvData[0].count
                    })
                }
            }
            projectUvList.sort((a, b) => {
                return a.uvCount < b.uvCount
            })
        }

        if (sortType === "activeDesc") {
            for (let i = 0; i < projectList.length; i ++) {
                let webMonitorId = projectList[i].webMonitorId
                if (webMonitorId) {
                    const todayUvData = await CustomerPVModel.getAliveCusInRealTime(webMonitorIdList[i])
                    let realTimeUvCount = todayUvData[0].count
                    projectUvList.push({
                        webMonitorId: webMonitorId,
                        projectName: projectList[i].projectName,
                        projectType: projectList[i].projectType,
                        appStatus: projectList[i].recording,
                        // uvCount: todayUvData[0].count,
                        realTimeUvCount
                    })
                }
            }
            projectUvList.sort((a, b) => {
                return a.realTimeUvCount < b.realTimeUvCount
            })
        }
        
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', projectUvList)
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
        const { id, webMonitorId } = params
        if (id && !isNaN(id)) {
            await ProjectModel.deleteProject(id);
            // 删除相关的表
            for (let i = -1; i < 30; i++) {
                Common.deleteTableByWebMonitorId(webMonitorId, i)
            }
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
     * 
     * @param {*} ctx 
     */
    static monitorCodeReplace(webfunnyCode, replaceArray) {
        let monitorCode = webfunnyCode
        replaceArray.forEach((item) => {
            let reg = item[0]
            let replaceTarget = item[1]
            monitorCode = monitorCode.replace(reg, replaceTarget)
        })
        return monitorCode
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
        // const { requestTextLength, responseTextLength } = accountInfo.httpReqRes

        const assetsDomain = domain.localAssetsDomain

        const monitorJsPath = "//" + assetsDomain + "/webfunny/w.js"

        const projectList = await ProjectModel.getAllProjectList()

        let h5Count = 0
        let miniCount = 0
        let totalCount = 0
        projectList.forEach((project) => {
            if (project.projectType == "h5") {
                h5Count ++
            } else if (project.projectType == "mp" || project.projectType == "uni") {
                miniCount ++
            }
            totalCount ++
        })
        // 检查激活码有效性
        if (global.monitorInfo.purchaseCodeValid === false && projectList.length > 0) {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('激活码已过期，最多只能创建一个项目，请更新激活码后，再继续创建。', 1)
            return
        }

        // 根据类型判断是否能够创建小程序的探针
        // 赞助版不可以创建小程序探针
        // if (global.monitorInfo.purchaseCodeType >= 2 && global.monitorInfo.purchaseCodeType <= 5 && data.projectType === "mp") {
        //     ctx.response.status = 200;
        //     ctx.body = statusCode.SUCCESS_200('抱歉，您的激活码版本不支持创建小程序应用，请升级激活码版本后，再继续创建。', 1)
        //     return
        // }

        // 检查数据库里有几个项目
        if (data) {
            if (global.monitorInfo.purchaseCodeType <= 3 && totalCount >= 6) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('您好，个人(试用)版用户最多只能够创建6项目，升级为企业版，则可以无限创建项目哦。', 1)
                return
            }

            if (data.projectType == "h5" && global.monitorInfo.purchaseCodeType <= 3 && h5Count >= 3) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('您好，个人(试用)版用户最多只能够创建3个h5项目，升级为企业版，则可以无限创建项目哦。', 1)
                return
            }

            if (data.projectType == "mp" && global.monitorInfo.purchaseCodeType <= 3 && miniCount >= 3) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('您好，个人(试用)版用户最多只能够创建3个小程序项目，升级为企业版，则可以无限创建项目哦。', 1)
                return
            }


            let result = await ProjectModel.checkProjectName(data.projectName)
            const count = parseInt(result[0].count)
            if (count <= 0) {
                let monitorCode = ""
                let monitorFetchCode = ""
                // data.projectType = "customer"
                // data.remotePath = monitorJsPath + "?id=" + webMonitorId

                // 纯源码方式
                let webfunnyCode = "" 
                let webfunnyFetchCode = ""
                if (data.projectType === "h5") {
                    webfunnyCode = fs.readFileSync(`./lib/webfunny.min.js`, 'utf-8')
                    webfunnyFetchCode = fs.readFileSync(`./lib/webfunny.fetch.min.js`, 'utf-8')
                } else if (data.projectType === "mp") {
                    webfunnyCode = fs.readFileSync(`./lib/webfunny.mp.min.js`, 'utf-8')
                } else if (data.projectType === "uni") {
                    webfunnyCode = fs.readFileSync(`./lib/webfunny.uni.min.js`, 'utf-8')
                }

                let replaceArray = [
                    [/jeffery_webmonitor/g, webMonitorId],
                    [/webfunnyVersionFlag/g, webfunnyVersionForProject],
                    [/&&&www.webfunny.cn&&&/g, localServerDomain],
                    [/&&&webfunny.cn&&&/g, mainDomain],
                    [/"webfunny-pageview-switch"/g, "true"],
                    [/"webfunny-jserror-switch"/g, "true"],
                    [/"webfunny-http-switch"/g, "true"],
                    [/"webfunny-resource-switch"/g, "true"],
                    [/"webfunny-behavior-switch"/g, "true"],
                    [/"webfunny-location-switch"/g, "true"],
                ]

                // 非fetch版监控代码
                // monitorCode = encodeURIComponent(webfunnyCode.toString()
                //                         .replace(/jeffery_webmonitor/g, webMonitorId)
                //                         .replace(/webfunnyVersionFlag/g, webfunnyVersionForProject)
                //                         .replace(/&&&www.webfunny.cn&&&/g, localServerDomain)
                //                         .replace(/&&&webfunny.cn&&&/g, mainDomain));
                monitorCode = encodeURIComponent(ProjectController.monitorCodeReplace(webfunnyCode.toString(), replaceArray));
                data.monitorCode = monitorCode

                // fetch版监控代码
                monitorFetchCode = encodeURIComponent(ProjectController.monitorCodeReplace(webfunnyFetchCode.toString(), replaceArray));
                data.monitorFetchCode = monitorFetchCode

                // 引入文件方式
                const insertCode = fs.readFileSync(`./lib/insertCode.js`, 'utf-8')
                data.fetchCode = encodeURIComponent(insertCode.toString().replace(/jeffery_webmonitor/g, webMonitorId)
                                        .replace(/monitorJsPath/g, monitorJsPath));
                data.userId = userId
                data.recording = "1"
                await ProjectModel.createProject(data);

                // 将此项目id写入团队项目列表中
                const chooseTeamId = data.chooseTeamId
                const team = await TeamModel.getTeamDetail(chooseTeamId)
                const { id, webMonitorIds } = team
                const tempWebMonitorIds = webMonitorIds ? webMonitorIds + "," + webMonitorId : webMonitorId
                TeamModel.updateTeam(id, {webMonitorIds: tempWebMonitorIds})

                // 把项目列表写入全局变量中
                // 1分钟以后生成表创建程序
                setTimeout(() => {
                    const dateStr1 = Utils.addDays(0).replace(/-/g, '')
                    const dateStr2 = Utils.addDays(1).replace(/-/g, '')
                    let commandLine = `node table_create.js ${webMonitorId} ${dateStr1} && node table_create.js ${webMonitorId} ${dateStr2}`
                    commandLine += " &"
                    console.log("项目创建成功，开始执行建表命令...")
                    console.log("建表命令为：", commandLine)
                    process.exec(commandLine, function(error, stdout, stderr) {
                        if (error) {
                            log.printError("建表命令失败error：", error)
                            log.printError("建表命令失败stdout：", stdout)
                            log.printError("建表命令失败stderr：", stderr)
                        }
                    });
                }, 100)
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
        const { webMonitorId, projectType } = param
        const { localServerDomain, mainDomain } = domain
        // const { requestTextLength, responseTextLength } = accountInfo.httpReqRes
        const projectDetail = await ProjectModel.getProjectByWebMonitorId(webMonitorId)
        const tempRecordConfig = projectDetail[0].recordConfig
        let recordConfig = null
        if (tempRecordConfig) {
            recordConfig = JSON.parse(tempRecordConfig)
        }
        let defaultReplaceArr = recordConfig ?
        [
            [/"webfunny-pageview-switch"/g, recordConfig.pv.s.toString()],
            [/"webfunny-jserror-switch"/g, recordConfig.je.s.toString()],
            [/"webfunny-http-switch"/g, recordConfig.hl.s.toString()],
            [/"webfunny-resource-switch"/g, recordConfig.rl.s.toString()],
            [/"webfunny-behavior-switch"/g, recordConfig.bl.s.toString()],
            [/"webfunny-location-switch"/g, recordConfig.lc.s.toString()],
        ]
        :
        []

        let webfunnyCode = ""
        if (projectType === "h5") {
            webfunnyCode = fs.readFileSync(`./lib/webfunny.min.js`, 'utf-8')
        } else if (projectType === "mp") {
            webfunnyCode = fs.readFileSync(`./lib/webfunny.mp.min.js`, 'utf-8')
        } else if (projectType === "uni") {
            webfunnyCode = fs.readFileSync(`./lib/webfunny.uni.min.js`, 'utf-8')
        }
        let replaceArray = [
            [/jeffery_webmonitor/g, webMonitorId],
            [/webfunnyVersionFlag/g, webfunnyVersionForProject],
            [/&&&www.webfunny.cn&&&/g, localServerDomain],
            [/&&&webfunny.cn&&&/g, mainDomain],
            ...defaultReplaceArr,
        ]

        param.monitorCode = encodeURIComponent(ProjectController.monitorCodeReplace(webfunnyCode.toString(), replaceArray));
        
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
    
    static async getUserTags(ctx) {
        const param = JSON.parse(ctx.request.body)
        const {webMonitorId} = param
        const data = await ProjectModel.getUserTags(webMonitorId);
        const res = data.length ? data[0] : ""
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    static async saveUserTags(ctx) {
        const data = JSON.parse(ctx.request.body)
        const {webMonitorId, userTag} = data
        let res = await ProjectModel.updateProjectByField({webMonitorId, userTag});
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    static async getProjectConfig(ctx) {
        const param = JSON.parse(ctx.request.body)
        const {webMonitorId} = param
        const data = await ProjectModel.getProjectConfig(webMonitorId);
        const res = data.length ? data[0] : ""
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    static async saveProjectConfig(ctx) {
        const data = JSON.parse(ctx.request.body)
        const {webMonitorId, recordConfig} = data
        const recordConfigObj = JSON.parse(recordConfig)
        const recording = recordConfigObj.s === true ? "1" : "2"
        let res = await ProjectModel.updateProjectByField({webMonitorId, recording, recordConfig});
        // 项目配置更新后，立即更新到全局变量中
        Common.setProjectConfigList()
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    static async openProject(ctx) {
        const data = JSON.parse(ctx.request.body)
        const {webMonitorId} = data
        const projectDetail = await ProjectModel.getProjectDetailForWebMonitorId(webMonitorId)
        if (!projectDetail.recordConfig) return
        const tempRecordConfig = JSON.parse(projectDetail.recordConfig)
        tempRecordConfig.s = true
        const recordConfig = JSON.stringify(tempRecordConfig)
        const recording = "1"
        let res = await ProjectModel.updateProjectByField({webMonitorId, recording, recordConfig});
        // 项目配置更新后，立即更新到全局变量中
        Common.setProjectConfigList()
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
    /**
     * 获取webMonitorId，并放到缓存中
     */
    static async cacheWebMonitorId() {
        const projectList = await ProjectModel.getAllProjectList()
        const webMonitorIds = []
        projectList.map((project) => {
            const { webMonitorId, recordConfig } = project
            if (!recordConfig) {
                webMonitorIds.push(webMonitorId)
            } else {
                const projectConfig = JSON.parse(recordConfig)
                if (projectConfig.s === true) {
                    webMonitorIds.push(webMonitorId)
                }
            }
        })
        global.monitorInfo.cacheWebMonitorIdList = webMonitorIds
    }
    static async saveAlarmInfo(ctx) {
        const data = JSON.parse(ctx.request.body)
        const {webMonitorId, alarmMembers, alarmRuleId} = data
        let res = await ProjectModel.updateProjectByField({webMonitorId, alarmMembers: JSON.stringify(alarmMembers), alarmRuleId});
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
}

let webfunnyVersion = "2.9.0"
class Common {

  static async consoleLogo() {
    CommonUtil.consoleLogo()
  }
  static async consoleInfo(startType) {
    CommonUtil.consoleInfo(startType)
  }
  // 激活码检查
  static async checkPurchase(callback, failCallback) {
    CommonUtil.checkPurchase(callback, failCallback)
  }
  // 接受并分类处理上传的日志（H5）
  static async upLog(ctx) {
    CommonUpLog.upLog(ctx)
  }
  // 接受用户自定义的日志
  static async upMyLog(ctx) {
    CommonUpLog.upMyLog(ctx)
  }
  // 接受并分类处理上传的日志（小程序）
  static async upMog(ctx) {
    CommonUpLog.upMog(ctx)
  }

  static async handleLogInfoQueue() {
    CommonUpLog.handleLogInfoQueue()
  }

  static async setProjectConfigList() {
    const data = await ProjectModel.getAllProjectList()
    let webMonitorIdList = []
    let projectConfigs = {}
    data.forEach((obj) => {
        webMonitorIdList.push(obj.webMonitorId)
        projectConfigs[obj.webMonitorId] = obj.recordConfig
    })
    global.monitorInfo.webMonitorIdList = webMonitorIdList
    global.monitorInfo.projectConfigs = projectConfigs
  }
  // 接收消息队列里的信息
  static async startReceiveMsg() {
    try {
      const receiveMq = new RabbitMq()
      receiveMq.receiveQueueMsg("upload_log_b", async (logInfoStr, channelAck) => {
        try {
          const logInfo = JSON.parse(logInfoStr)
          CommonUpLog.handleLogInfo(logInfo)
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

  // 接收消息队列里的小程序日志信息
  static async startReceiveMsgForMog() {
    try {
      const receiveMq = new RabbitMq()
      receiveMq.receiveQueueMsg("upload_mog", async (logInfoStr, channelAck) => {
        try {
          const logInfo = JSON.parse(logInfoStr)
          CommonUpLog.handleLogInfo(logInfo)
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

  /**
   * 接受并分类处理上传的日志 (连线用户模式)
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upDLog(ctx) {
    CommonUpLog.upDLog(ctx)
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
   * 更新系统
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async upgradeSystem(ctx) {
    let param = JSON.parse(ctx.request.body)
    const { stableSql, dynamicSql } = param
    const stableSqlStr = decodeURIComponent(stableSql)
    const dynamicSqlStr = decodeURIComponent(dynamicSql)
    const webMonitorIdList = await ProjectModel.getWebMonitorIdList()
    /** 第一步，更新固定数据表结构 */
    const stableSqlArr = stableSqlStr.split('\n')
    CommonModel.updateTableFields(stableSqlArr)
    /** 第二步，删除明天的动态数据表 */
    const dynamicTableList = []
    const tempDynamicSqlList = dynamicSqlStr.split('\n')
    tempDynamicSqlList.forEach((tempSql) => {
      dynamicTableList.push(tempSql.split('-')[0])
    })
    const tableList = []
    const tomorrowDate = Utils.addDays(1).replace(/-/g, "")
    webMonitorIdList.forEach((project) => {
      dynamicTableList.forEach((dynamicTable) => {
        tableList.push(project.webMonitorId + dynamicTable + tomorrowDate)
      })
    })
    tableList.forEach(async (tableName) => {
      if (tableName) {
        await CommonModel.deleteTableByName(tableName)
      }
    })
    /** 第三步，执行建表命令，生成明天的动态表 */
    await Common.createTable()
    /** 第四步，设置23:59:50 进行重启操作 */
    const timeChange = new Date(Utils.addDays(1) + " 00:00:00").getTime() - new Date().getTime() - 20000
    setTimeout(() => {
      Common.restartServer()
    }, timeChange)
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
    const { searchDate, searchHour, userId } = param
    const searchCustomerKey = param.customerKey
    // const searchValue = Utils.b64DecodeUnicode(param.userId)
    // param.userId = searchValue
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
    if (param.userId) {
      await CustomerPVModel.getCustomerKeyByUserId(param).then((res) => {
        res.forEach((customerKeyInfo) => {
          if (customerKeyInfo.customerKey && customerKeyInfo.customerKey.length > 10) {
            customerKeyList.push(customerKeyInfo.customerKey)
          }
        })
        let currentDateTime = new Date().getTime()
        startDateTime = currentDateTime
      })
    }
    
    let customerKeySql = ""
    // searchHour = -1 说明需要查询一整天的数据
    let happenTimeSql = searchHour === -1 ? " 1=1 " : " happenDate>='" + param.happenDateScope + "' and happenDate<='" + param.happenDateScopeEnd + "' "
    let userIdSql = " userId='" + userId + "' "
    let base64UserIdSql = " userId='" + userId + "' "
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
      customerKeySql += " customerKey='" + searchCustomerKey + "' "
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
    const { searchDate, searchHour, userId } = param
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
      customerKeySql += " customerKey='" + userId + "' "
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
   * 根据项目ID刷新实时数据
   * @param ctx
   * @returns {Promise.<void>}
   * index  0代表当天， 1代表昨天
   */
  static async calculateCountByDayForRealTime(index, webMonitorId) {
    const useDay = Utils.addDays(0 - index)
    const infoCountByDayInfo = {
      uploadType: "",
      webMonitorId: "",
      dayName: "",
      dayCount: ""
    }
    infoCountByDayInfo.webMonitorId = webMonitorId
    infoCountByDayInfo.dayName = useDay

    await Common.handleCalculateCountByDayForTenMinutes(webMonitorId, infoCountByDayInfo, index)
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

      Common.handleCalculateCountByDayForTenMinutes(webMonitorId, infoCountByDayInfo, index)
    }
  }
  static async handleCalculateCountByDayForTenMinutes(webMonitorId, infoCountByDayInfo, index) {
    //========================UV相关==========================//
    const todayUvData = await CustomerPVModel.getUVCountForDay(webMonitorId, index, UPLOAD_TYPE.UV_COUNT_HOUR);
    infoCountByDayInfo.uploadType = UPLOAD_TYPE.UV_COUNT_DAY
    infoCountByDayInfo.dayCount = todayUvData[0].count
    const result_uv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(infoCountByDayInfo.dayName, webMonitorId, UPLOAD_TYPE.UV_COUNT_DAY)
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
    const result_pv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(infoCountByDayInfo.dayName, webMonitorId, UPLOAD_TYPE.PV_COUNT_DAY)
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
    const result_new = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(infoCountByDayInfo.dayName, webMonitorId, UPLOAD_TYPE.NEW_COUNT_DAY)
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
    const result_ip = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(infoCountByDayInfo.dayName, webMonitorId, UPLOAD_TYPE.IP_COUNT_DAY)
    if (result_ip.length <= 0) {
      await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
    } else {
      const id = result_ip[0].id
      await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
    }
    //========================IP相关==========================//
  }
  /**
   * 获取所有的错误影响人数
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getErrorInfo(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const todayUvData = await CustomerPVModel.getUVCountForDay(params.webMonitorId, params.timeSize, UPLOAD_TYPE.UV_COUNT_HOUR);
    const jsErrorData = await JavascriptErrorInfoModel.getJsErrorUserCountToday(params.webMonitorId, params.timeSize)
    const consoleErrorData = await JavascriptErrorInfoModel.getConsoleErrorUserCountToday(params.webMonitorId, params.timeSize)
    const resourceErrorData = await ResourceLoadInfoModel.getResourceErrorUserCountToday(params.webMonitorId, params.timeSize)
    const httpErrorData = await HttpErrorInfoModel.getHttpErrorUserCountToday(params.webMonitorId, params.timeSize)
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

  static async getWarningList(ctx) {
    let req = ctx.request.body
    const params = JSON.parse(req)
    const resParam = Object.assign({}, params, {page: 0, pageSize: 3})
    const result = await MessageModel.getMessageByType(resParam)
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
        cusSendEmail("", "Mysql错误连接数报警", "Mysql错误连接数：" + count)
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
    let countDay = parseInt(accountInfo.saveDays, 10) + 1
    log.printInfo("【即将开始表删除程序...")
    const dateStr = Utils.addDays(0 - countDay).replace(/-/g, "")

    const tables1 = [
      "BehaviorInfo", "CustomerPV", "ExtendBehaviorInfo", "HttpErrorInfo",
      "HttpLogInfo", "JavascriptErrorInfo", "LoadPageInfo", "ResourceLoadInfo", 
      "ScreenShotInfo", "VideosInfo", "CustomerPvLeave", "CustomerStayTime"
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

  static async deleteTableByWebMonitorId(webMonitorId, countDay) {
    log.printInfo("【根据webMonitorId，即将开始表删除程序...")
    const dateStr = Utils.addDays(0 - countDay).replace(/-/g, "")

    const tables1 = [
      "BehaviorInfo", "CustomerPV", "ExtendBehaviorInfo", "HttpErrorInfo",
      "HttpLogInfo", "JavascriptErrorInfo", "LoadPageInfo", "ResourceLoadInfo", 
      "ScreenShotInfo", "VideosInfo", "CustomerPvLeave", "CustomerStayTime"
    ]
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
    log.printInfo("表删除程序结束】")
  }

  /**
   * 开始清理无效的表
   */
  static async startClearInvalidTable() {
    // 获取所有的项目列表
    const webMonitorIdList = []
    const projectList = await ProjectModel.getWebMonitorIdList()
    projectList.forEach((project) => {
      webMonitorIdList.push(project.webMonitorId)
    })
    // 获取所有的表名
    const invalidTables = []
    const allTableList = await Common.getAllTableList()
    const reg = /webfunny_\d{8}_\d{6}/ // webfunny_20211004_094727
    allTableList.forEach((item) => {
      const tempTableNameArr = item.table_name.match(reg)
      if (tempTableNameArr && tempTableNameArr.length) {
        let tempTableName = tempTableNameArr[0]
        if (webMonitorIdList.indexOf(tempTableName) === -1) {
          invalidTables.push(item.table_name)
        }
      }
    })
    log.printInfo("【根据webMonitorId，即将开始表删除程序...")
    invalidTables.forEach(async (tableName) => {
      await Sequelize.dropSchema(tableName).then(() => {
        log.printInfo("成功删除数据库表: " + tableName)
      })
    })
  }

  /**
   * 删除第二天的表
   */
  static async startClearInvalidTable() {
    // 获取所有的项目列表
    const webMonitorIdList = []
    const projectList = await ProjectModel.getWebMonitorIdList()
    projectList.forEach((project) => {
      webMonitorIdList.push(project.webMonitorId)
    })
    // 获取所有的表名
    const invalidTables = []
    const allTableList = await Common.getAllTableList()
    const reg = /webfunny_\d{8}_\d{6}/ // webfunny_20211004_094727
    allTableList.forEach((item) => {
      const tempTableNameArr = item.table_name.match(reg)
      if (tempTableNameArr && tempTableNameArr.length) {
        let tempTableName = tempTableNameArr[0]
        if (webMonitorIdList.indexOf(tempTableName) === -1) {
          invalidTables.push(item.table_name)
        }
      }
    })
    log.printInfo("【根据webMonitorId，即将开始表删除程序...")
    invalidTables.forEach(async (tableName) => {
      await Sequelize.dropSchema(tableName).then(() => {
        log.printInfo("成功删除数据库表: " + tableName)
      })
    })
  }

  /**
   * 清理pm2日志
   */
  static async pm2Flush() {
    process.exec("pm2 flush &", function(error, stdout, stderr) {
      if (error) {
        log.printError("pm2 flush error：", error)
      }
    });
  }

  /**
   * 创建数据库辩驳
   */
  static async createTable() {


    const webMonitorIdList = await ProjectModel.getWebMonitorIdList()
    let commandLine = ""
    const dateStr1 = Utils.addDays(0).replace(/-/g, '')
    const dateStr2 = Utils.addDays(1).replace(/-/g, '')
    for (let i = 0; i < webMonitorIdList.length; i ++) {
      let webMonitorId = webMonitorIdList[i].webMonitorId
      commandLine += `node table_create.js ${webMonitorId} ${dateStr1} && node table_create.js ${webMonitorId} ${dateStr2}`
      if (i != webMonitorIdList.length - 1) {
        commandLine += " && "
      }
    }

    commandLine += " &"
    process.exec(commandLine, function(error, stdout, stderr) {
        if (error) {
          log.printError("建表命令失败error：", error)
          log.printError("建表命令失败stdout：", stdout)
          log.printError("建表命令失败stderr：", stderr)
        }
    });

    // const webMonitorIdList = await ProjectModel.getWebMonitorIdList()
    // let commandLine = ""
    // const dateStr1 = Utils.addDays(0).replace(/-/g, '')
    // const dateStr2 = Utils.addDays(1).replace(/-/g, '')
    // for (let i = 0; i < webMonitorIdList.length; i ++) {
    //   let webMonitorId = webMonitorIdList[i].webMonitorId
    //   commandLine += `node table_create.js ${webMonitorId} ${dateStr1} && node table_create.js ${webMonitorId} ${dateStr2}`
    //   if (i != webMonitorIdList.length - 1) {
    //     commandLine += " && "
    //   }
    // }
    // process.exec(commandLine, function(error, stdout, stderr) {
    //     log.printError("建表命令失败error：", error)
    //     log.printError("建表命令失败stdout：", stdout)
    //     log.printError("建表命令失败stderr：", stderr)
    // });

    // switch (process.platform) {
    //   // windows系统下
    //   case "win32":
    //       spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['run', 'table_config'], { stdio: 'inherit' });
    //       break;
    //   case "darwin":  // 默认mac系统
    //   default:
    //       try {
    //           execFile('./createTable.sh', [], null, function (err, stdout, stderr) {
    //               log.printError(JSON.stringify(err))
    //               log.printError(stdout)
    //               log.printError(stderr)
    //           });
    //       } catch(e) {
    //           log.printError(e)
    //           log.printError(errorStr)
    //       }
    //       break;
    // }

  }

  /**
   * 连接线上用户
   */
  static async connectUser(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId, connecting} = param
    let { userIdArray, debugInfoTimer, debugInfo } = global.monitorInfo
    let tempStatus = ""
    if (!connecting) {
      if (userIdArray.indexOf(userId) === -1) {
        userIdArray.push(userId)
      }
      console.log("可以连线用户的列表：", userIdArray)
      tempStatus = "connected"
    } else {
      userIdArray = []
      tempStatus = "disconnect"
    }
    
    // 1小时，自动清理debug模式下的内容
    if (debugInfoTimer[userId]) {
      clearInterval(debugInfoTimer[userId])
    } else {
      debugInfoTimer[userId] = setTimeout(() => {
        global.monitorInfo.debugInfo[userId] = {}
        global.monitorInfo.debugInfoArray[userId] = []
        global.monitorInfo.tempDebugInfoArray[userId] = []
      }, 3600 * 1000)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', tempStatus)
  }

  /**
   * 断开连接线上用户
   */
  static async disconnectUser(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId} = param
    let { userIdArray } = global.monitorInfo
    const userIdIndex = userIdArray.indexOf(userId)
    userIdArray.splice(userIdIndex, 1)
    console.log(`用户（ ${userId} ）已断开连接。`.red)
    console.log("可以连线用户的列表：", userIdArray)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 0)
  }
  /**
   * 获取历史的debug信息
   */
  static async getHistoryDebugInfos(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId} = param
    const debugInfoArray = global.monitorInfo.debugInfoArray[userId] || []
    const tempDebugInfoArray = global.monitorInfo.tempDebugInfoArray[userId] || []
    const result = debugInfoArray.concat(tempDebugInfoArray)
    const total = result.length
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', { result, total })
  }

  /**
   * 获取debugInfo信息
   */
  static async getDebugInfos(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId, pageSize} = param
    // 对内容中的信息进行排序
    const debugInfoArray = global.monitorInfo.debugInfoArray[userId] || []
    const tempDebugInfoArray = global.monitorInfo.tempDebugInfoArray[userId] || []
    const totalDebugInfoArray = debugInfoArray.concat(tempDebugInfoArray)
    const total = totalDebugInfoArray.length
    let result = []
    const len = totalDebugInfoArray.length
    if (len <= pageSize) {
      result = totalDebugInfoArray || []
    } else {
      result = totalDebugInfoArray.slice(len - pageSize - 1, len)
    }

    // 获取控制台的内容
    const debugInfo = global.monitorInfo.debugInfo
    let consoleResultInfo = []
    if (debugInfo[userId] && debugInfo[userId].consoleInfo && debugInfo[userId].consoleInfo.log) {
      const len = debugInfo[userId].consoleInfo.log.length
      if (len <= 100) {
        consoleResultInfo = debugInfo[userId].consoleInfo.log
      } else {
        consoleResultInfo = debugInfo[userId].consoleInfo.log.slice(len - 100, len)
      }
    }

    // 获取用户本地缓存信息
    const localDebugInfo = global.monitorInfo.debugInfo[userId]

    // 检查连线状态
    let { userIdArray } = global.monitorInfo
    const userIdIndex = userIdArray.indexOf(userId)
    const connectStatus = userIdIndex != -1 ? "connected" : "disconnected"

    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {connectStatus, result, total, console: consoleResultInfo, localDebugInfo})
  }
  
  /**
   * 分页获取debugInfo信息
   */
  static async getDebugInfosForPage(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId, pageSize, page} = param
    // 对内容中的信息进行排序
    const debugInfoArray = global.monitorInfo.debugInfoArray[userId] || []
    const tempDebugInfoArray = global.monitorInfo.tempDebugInfoArray[userId] || []
    const totalDebugInfoArray = debugInfoArray.concat(tempDebugInfoArray)
    const len = totalDebugInfoArray.length
    let result = []
    let start = pageSize * (page - 1) > 0 ? pageSize * (page - 1) : 0
    let end = pageSize * page
    result = totalDebugInfoArray.slice(start, end)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {result, total: len})
  }
  /**
   * 获取用户本地缓存信息
   */
  static async getDebugInfoForLocalInfo(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId} = param
    const result = global.monitorInfo.debugInfo[userId]
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', result)
  }
  /**
   * 清理用户本地缓存信息
   */
  static async clearLocalInfo(ctx) {
    const param = Utils.parseQs(ctx.request.url)
    const {userId} = param
    global.monitorInfo.debugClearLocalInfo.push(userId)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 0)
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
      // console.log(resultInfo.uploadType + "（" + resultInfo.userId + "） 日志被取出...")
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
      CommonUtil.restartServer()
    });
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 0)
  }
  /**
   * 更改系统监控状态
   */
  static async changeMonitorStatus(ctx) {
    const req = ctx.request.body
    const param = JSON.parse(req)
    const { openMonitor } = param
    const newString = `module.exports = {
      openMonitor: ${openMonitor}  // 企业版可关闭此选项
    }`
    await fs.writeFile("./bin/sysMonitor.js", newString, (err) => {
      if (err) {
        throw err;
      }
      CommonUtil.restartServer()
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
      CommonUtil.restartServer()
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
    ctx.body = statusCode.SUCCESS_200('success', {logServerStatus, waitCounts, saveDays: accountInfo.saveDays, openMonitor: accountInfo.openMonitor})
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
    
    // 获取当前的用户总量
    const healthPercentList = []
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
      jsErrorPercent = Utils.toFixed(jsErrorPercent * 100, 2)
      consoleErrorPercent = Utils.toFixed(consoleErrorPercent * 100, 2)
      resourceErrorPercent = Utils.toFixed(resourceErrorPercent * 100, 2)
      httpErrorPercent = Utils.toFixed(httpErrorPercent * 100, 2)

      healthPercentList.push({webMonitorId, score, jsErrorPercent, consoleErrorPercent, resourceErrorPercent, httpErrorPercent})

      // const lastHourTime = new Date().getTime() - hourIndex * 3600 * 1000
      // const lastHour = new Date(lastHourTime).Format("yyyy-MM-dd hh") + ":00:00"
      // const hour = new Date(lastHourTime + 3600 * 1000).Format("yyyy-MM-dd hh") + ":00:00"
      // const jsErrorResult = await JavascriptErrorInfoModel.calculateJsErrorCountByHour(webMonitorId, lastHour, hour)
      

    }
    customerWarningCallback({
      healthPercentList
    })
  }
  /**
   * 重启服务
   */
  static async restartServer() {
    CommonUtil.restartServer()
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
    const { webfunnyNeedLogin, messageQueue, localServerDomain, localServerPort, localAssetsDomain, localAssetsPort, mainDomain, openMonitor } = accountInfo
    const { purchaseCodeEndDate, purchaseCodeValid, purchaseCodeType } = global.monitorInfo
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 
      {
        webfunnyVersion, webfunnyNeedLogin, messageQueue, purchaseCodeEndDate, purchaseCodeValid, pct: purchaseCodeType,
        localServerDomain, localServerPort, localAssetsDomain, localAssetsPort, mainDomain, adminUserCount, openMonitor
      })
  }
  /**
   * 获取素有的表名
   */
  static async getAllTableList() {
    const res = await CommonModel.getAllTableList(accountInfo.mysqlConfig.write.dataBaseName)
    return res
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

  static async test(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {"Success":true,"IsSensitive":false,"SensitiveFields":[],"SensitiveLevel":"cell"})
  }
}



class TimerCalculateController {

  /**
   * 修复数据
   */
  static async fixData(ctx) {
    let dayTimeStrList = ["06:10", "07:10", "08:10", "09:10", "10:15", "11:10"]
    let minTimeStrList = ["00:59", "01:59", "02:59", "03:59", "04:59", "05:59"]
    let timer = null
    let hour = parseInt(new Date().Format("hh"), 10)
    let firstHour = hour
    if (hour == 0) return
    timer = setInterval(() => {
      console.log("正在修复 " + (firstHour - hour) + " 点的数据")
      if (hour == 0 && timer) {
        dayTimeStrList.forEach((dayTime) => {
          TimerCalculateController.calculateCountByDay(dayTime, 0)
        })
        clearInterval(timer)
      } else {
        minTimeStrList.forEach((minTime) => {
          TimerCalculateController.calculateCountByHour(minTime, 0)
        })
        // TimerCalculateController.calculateCountByDay(minuteTimeStr, 0)
      }
      hour --
    }, 10000)
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('修复请求已成功，修复时间大概需要5分钟。', 0)
  }

  /**
   * 定时计算每天的pv量，uv量，js错误量，http错误量，resource错误量
   */
  static async calculateCountByDay(minuteTimeStr, dayIndex) {
    TimerCalculateController.calculateCountByDayForDays(minuteTimeStr, dayIndex)

    if (minuteTimeStr == "06:10") {
      // 检查激活码是否有效
      CommonUtil.checkPurchase(() => {}, () => {})
    }
  }
  static async calculateCountByDayForDays(minuteTimeStr, index) {

    const useDay = Utils.addDays(index)
    // 根据不同的时段执行不同的逻辑
    switch(minuteTimeStr) {
      // 每小时的第10秒钟
      case "06:10":
          TimerCalculateController.handleProjectWithTag(async(webMonitorId, userTag) => {
            const infoCountByDayInfo = {
              uploadType: "",
              webMonitorId: webMonitorId,
              dayName: useDay,
              dayCount: ""
            }
            //========================PVUV数据相关==========================//
            const customerTypeArray = [
              {uploadTypeForDay: UPLOAD_TYPE.UV_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.UV_COUNT_HOUR},
              {uploadTypeForDay: UPLOAD_TYPE.PV_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.PV_COUNT_HOUR},
              {uploadTypeForDay: UPLOAD_TYPE.NEW_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.NEW_COUNT_HOUR},
              {uploadTypeForDay: UPLOAD_TYPE.IP_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.IP_COUNT_HOUR}
            ]
            for (let i = 0; i < customerTypeArray.length; i ++) {
              const tempObj = customerTypeArray[i]
              const cusData = await CustomerPVModel.getCusInfoCountForDay(webMonitorId, useDay, tempObj.uploadTypeForHour + userTag);
              const uploadType = tempObj.uploadTypeForDay + userTag
              infoCountByDayInfo.uploadType = uploadType
              infoCountByDayInfo.dayCount = cusData[0].count
              const result_uv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, uploadType)
              if (result_uv.length <= 0) {
                await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
              } else {
                const id = result_uv[0].id
                await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
              }
            }
            //========================UV数据相关==========================//
          })
        break
      case "07:10":
        /**
         * 根据埋点分类计算
         */
        const infoCountByDayInfo = {
          uploadType: "",
          webMonitorId: "",
          dayName: useDay,
          dayCount: ""
        }
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
        break
      case "08:10":
        TimerCalculateController.handleProject(async(param) => {
          const {webMonitorId} = param
          const infoCountByDayInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            dayName: useDay,
            dayCount: ""
          }
          //========================用户跳出率计算相关==========================//
          const cusLeavePercentData = await CustomerPvLeaveModel.getCusLeavePercentForDay(webMonitorId, useDay, UPLOAD_TYPE.CUS_LEAVE_FOR_HOUR);
          const leavePercentUploadType = UPLOAD_TYPE.CUS_LEAVE_FOR_DAY
          infoCountByDayInfo.uploadType = leavePercentUploadType
          infoCountByDayInfo.dayCount = cusLeavePercentData
          const cusLeavePercentArr = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, leavePercentUploadType)
          if (cusLeavePercentArr.length <= 0) {
            await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
          } else {
            const id = cusLeavePercentArr[0].id
            await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
          }
          //========================用户跳出率计算相关==========================//

          //========================用户停留时长相关==========================//
          const stayTimeData = await CustomerStayTimeModel.getStayTimeForDay(webMonitorId, useDay, UPLOAD_TYPE.STAY_TIME_FOR_HOUR);
          const stayTimeUploadType = UPLOAD_TYPE.STAY_TIME_FOR_DAY
          infoCountByDayInfo.uploadType = stayTimeUploadType
          infoCountByDayInfo.dayCount = stayTimeData
          const result_uv = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, stayTimeUploadType)
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
            const uploadType = UPLOAD_TYPE.ON_ERROR
            infoCountByDayInfo.uploadType = uploadType
            infoCountByDayInfo.dayCount = data[0].count
            const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, uploadType)
            if (result.length <= 0) {
              await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
            } else {
              const id = result[0].id
              await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
            }
          })
          // 计算js每小时的报错量 console_error
          await JavascriptErrorInfoModel.calculateConsoleErrorCountByDay(webMonitorId, useDay).then( async(data) => {
            const uploadType = UPLOAD_TYPE.CONSOLE_ERROR
            infoCountByDayInfo.uploadType = uploadType
            infoCountByDayInfo.dayCount = data[0].count
            const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, uploadType)
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
            const uploadType = UPLOAD_TYPE.HTTP_ERROR
            infoCountByDayInfo.uploadType = uploadType
            infoCountByDayInfo.dayCount = data[0].count
            const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, uploadType)
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
            const uploadType = UPLOAD_TYPE.RESOURCE_ERROR
            infoCountByDayInfo.uploadType = uploadType
            infoCountByDayInfo.dayCount = data[0].count
            const result = await InfoCountByDayModel.getInfoCountByDayDetailByDayName(useDay, webMonitorId, uploadType)
            if (result.length <= 0) {
              await InfoCountByDayModel.createInfoCountByDay(infoCountByDayInfo)
            } else {
              const id = result[0].id
              await InfoCountByDayModel.updateInfoCountByDay(id, infoCountByDayInfo)
            }
          })
          //========================静态资源错误相关==========================//
        })
        break
        case "09:10":
          TimerCalculateController.handleProject(async(param) => {
            const {webMonitorId} = param
            const infoCountByDayInfo = {
              uploadType: "",
              webMonitorId: webMonitorId,
              dayName: useDay,
              dayCount: ""
            }
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
            //========================页面加载耗时相关==========================//
          })
        break
      case "10:15":
          TimerCalculateController.handleProject(async(param) => {
            const {webMonitorId} = param
            const infoCountByDayInfo = {
              uploadType: "",
              webMonitorId: webMonitorId,
              dayName: useDay,
              dayCount: ""
            }
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
            const deviceInfoCountByDayInfo = {
              uploadType: "",
              webMonitorId: webMonitorId,
              dayName: useDay,
              dayCount: "",
              showName: ""
            }
            const deviceTimeScopeArray = [
              {useDay, uploadTypeForDay: UPLOAD_TYPE.DEVICE_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.DEVICE_COUNT_HOUR},
              {useDay, uploadTypeForDay: UPLOAD_TYPE.CITY_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.CITY_COUNT_HOUR},
              {useDay, uploadTypeForDay: UPLOAD_TYPE.PROVINCE_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.PROVINCE_COUNT_HOUR},
              {useDay, uploadTypeForDay: UPLOAD_TYPE.COUNTRY_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.COUNTRY_COUNT_HOUR},
              {useDay, uploadTypeForDay: UPLOAD_TYPE.SYSTEM_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.SYSTEM_COUNT_HOUR},
              {useDay, uploadTypeForDay: UPLOAD_TYPE.VERSION_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.VERSION_COUNT_HOUR},
              {useDay, uploadTypeForDay: UPLOAD_TYPE.SCREEN_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.SCREEN_COUNT_HOUR},
              {useDay, uploadTypeForDay: UPLOAD_TYPE.REFERRER_COUNT_DAY, uploadTypeForHour: UPLOAD_TYPE.REFERRER_COUNT_HOUR}
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
                    // console.log(deviceInfoCountByDayInfo)
                    await DeviceInfoCountByDayModel.createDeviceInfoCountByDay(deviceInfoCountByDayInfo)
                  } else {
                    const id = result[0].id
                    await DeviceInfoCountByDayModel.updateDeviceInfoCountByDay(id, deviceInfoCountByDayInfo)
                  }
                }
              })
            }
            //========================设备信息计算相关==========================//
          })
        break
      case "11:10":
        TimerCalculateController.handleProject(async(param) => {
          const {webMonitorId} = param
          const infoCountByDayInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            dayName: useDay,
            dayCount: ""
          }
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
        })
        break
      default:
        break
    }
  }

  /**
   * 定时计算每小时的pv量，uv量，js错误量，http错误量， resource错误量
   */
  static async calculateCountByHour(minuteTimeStr, index, customerWarningCallback) {
    try {
      TimerCalculateController.calculateCountByHourForDetailHour(minuteTimeStr, index, customerWarningCallback)
    } catch(e) {
      console.log(e)
    }
  }
  
  static async calculateCountByHourForDetailHour(minuteTimeStr, hourIndex, customerWarningCallback) {
    const lastHourTime = new Date().getTime() - hourIndex * 3600 * 1000
    const lastHour = new Date(lastHourTime).Format("yyyy-MM-dd hh") + ":00:00"
    const hour = new Date(lastHourTime + 3600 * 1000).Format("yyyy-MM-dd hh") + ":00:00"

    const useHour = lastHour.substring(5, 13)
    const warningInfoArray = []
    let warningInfo = {} // 存警告信息的对象
    // 根据不同的时段执行不同的逻辑
    switch(minuteTimeStr) {
      // 每小时的第30秒钟
      case "00:30":
          TimerCalculateController.handleProjectWithTag(async(webMonitorId, userTag) => {
            const infoCountByHourInfo = {
              uploadType: "",
              webMonitorId: webMonitorId,
              hourName: useHour,
              hourCount: ""
            }
            //========================PVUV相关==========================//
            // 计算每小时UV活跃量
            await CustomerPVModel.calculateUvCountByHour(webMonitorId, userTag, lastHour, hour).then( async(uvData) => {
              const uploadType = UPLOAD_TYPE.UV + userTag
              infoCountByHourInfo.uploadType = uploadType
              infoCountByHourInfo.hourCount = uvData[0].count
              // warningInfo.uv = uvData[0].count
              const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
              if (result.length <= 0) {
                await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
              } else {
                const id = result[0].id
                await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
              }
            })
            // 计算每小时UV唯一数量，相加可得总量
            await CustomerPVModel.calculateTotalUvCountByHour(webMonitorId, userTag, lastHour, hour).then( async(uvData) => {
              const uploadType = UPLOAD_TYPE.UV_COUNT_HOUR + userTag
              infoCountByHourInfo.uploadType = uploadType
              infoCountByHourInfo.hourCount = uvData[0].count * 1
              const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
              if (result.length <= 0) {
                await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
              } else {
                const id = result[0].id
                await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
              }
            })
            // 计算PV量
            await CustomerPVModel.calculatePvCountByHour(webMonitorId, userTag, lastHour, hour).then( async(pvData) => {
              const uploadType = UPLOAD_TYPE.PV_COUNT_HOUR + userTag
              infoCountByHourInfo.uploadType = uploadType
              infoCountByHourInfo.hourCount = pvData[0].count
              const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
              if (result.length <= 0) {
                await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
              } else {
                const id = result[0].id
                await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
              }
            })
            // 计算新用户活跃量
            await CustomerPVModel.calculateNewCustomerCountByHour(webMonitorId, userTag, lastHour, hour).then( async(newCustomerData) => {
              const uploadType = UPLOAD_TYPE.NEW_CUSTOMER + userTag
              infoCountByHourInfo.uploadType = uploadType
              infoCountByHourInfo.hourCount = newCustomerData[0].count
              const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
              if (result.length <= 0) {
                await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
              } else {
                const id = result[0].id
                await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
              }
            })

            // 计算新用户唯一数量，相加可得新用户总和
            await CustomerPVModel.calculateTotalNewCustomerCountByHour(webMonitorId, userTag, lastHour, hour).then( async(newCustomerData) => {
              const uploadType = UPLOAD_TYPE.NEW_COUNT_HOUR + userTag
              infoCountByHourInfo.uploadType = uploadType
              infoCountByHourInfo.hourCount = newCustomerData[0].count
              const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
              if (result.length <= 0) {
                await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
              } else {
                const id = result[0].id
                await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
              }
            })

            // 计算IP唯一数量，相加可得IP总和
            await CustomerPVModel.calculateTotalIPCountByHour(webMonitorId, userTag, lastHour, hour).then( async(newCustomerData) => {
              const uploadType = UPLOAD_TYPE.IP_COUNT_HOUR + userTag
              infoCountByHourInfo.uploadType = uploadType
              infoCountByHourInfo.hourCount = newCustomerData[0].count
              const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
              if (result.length <= 0) {
                await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
              } else {
                const id = result[0].id
                await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
              }
            })
            //========================PVUV相关==========================//
          })
        break
      // 每小时的第1分0秒钟
      case "01:00":
        TimerCalculateController.handleProject(async(param) => {
          const {webMonitorId, userTag, p, projectList} = param
          const infoCountByHourInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            hourName: useHour,
            hourCount: ""
          }
          //========================js错误相关==========================//
          // 计算js每小时的报错量 on_error
          await JavascriptErrorInfoModel.calculateJsErrorCountByHour(webMonitorId, userTag, lastHour, hour).then( async(data) => {
            const uploadType = UPLOAD_TYPE.ON_ERROR + userTag
            infoCountByHourInfo.uploadType = uploadType
            infoCountByHourInfo.hourCount = data[0].count
            const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
            if (result.length <= 0) {
              await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
            } else {
              const id = result[0].id
              await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
            }
          })
          // 计算js每小时的报错量 console_error
          await JavascriptErrorInfoModel.calculateConsoleErrorCountByHour(webMonitorId, userTag, lastHour, hour).then( async(data) => {
            const uploadType = UPLOAD_TYPE.CONSOLE_ERROR + userTag
            infoCountByHourInfo.uploadType = uploadType
            infoCountByHourInfo.hourCount = data[0].count
            const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
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
          await ResourceLoadInfoModel.calculateResourceErrorCountByHour(webMonitorId, userTag, lastHour, hour).then( async(data) => {
            const uploadType = UPLOAD_TYPE.RESOURCE_ERROR + userTag
            infoCountByHourInfo.uploadType = uploadType
            infoCountByHourInfo.hourCount = data[0].count
            const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
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
          await HttpErrorInfoModel.calculateHttpErrorCountByHour(webMonitorId, userTag, lastHour, hour).then( async(data) => {
            const uploadType = UPLOAD_TYPE.HTTP_ERROR + userTag
            infoCountByHourInfo.uploadType = uploadType
            infoCountByHourInfo.hourCount = data[0].count
            const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
            if (result.length <= 0) {
              await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
            } else {
              const id = result[0].id
              await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
            }
          })
          //========================接口请求错误相关==========================//

          // 计算每小时用户平均停留时间
          await CustomerStayTimeModel.calculateStayTimeByHour(webMonitorId, lastHour, hour).then( async(stayTimeData) => {
            const uploadType = UPLOAD_TYPE.STAY_TIME_FOR_HOUR
            infoCountByHourInfo.uploadType = uploadType
            infoCountByHourInfo.hourCount = stayTimeData
            const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
            if (result.length <= 0) {
              await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
            } else {
              const id = result[0].id
              await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
            }
          })
          // 计算每小时用户的跳出率
          await CustomerPvLeaveModel.calculateCusLeavePercentByHour(webMonitorId, lastHour, hour).then( async(leavePercent) => {
            const uploadType = UPLOAD_TYPE.CUS_LEAVE_FOR_HOUR
            infoCountByHourInfo.uploadType = uploadType
            infoCountByHourInfo.hourCount = leavePercent
            const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, uploadType)
            if (result.length <= 0) {
              await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
            } else {
              const id = result[0].id
              await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
            }
          })
          //========================错误UV人数相关==========================//
          const jsErrorData = await JavascriptErrorInfoModel.getJsErrorUserCountByHour(webMonitorId, lastHour, hour)
          const consoleErrorData = await JavascriptErrorInfoModel.getConsoleErrorUserCountByHour(webMonitorId, lastHour, hour)
          const resourceErrorData = await ResourceLoadInfoModel.getResourceErrorUserCountByHour(webMonitorId, lastHour, hour)
          const httpErrorData = await HttpErrorInfoModel.getHttpErrorUserCountByHour(webMonitorId, lastHour, hour)
          const warningInfo = {
            webMonitorId: webMonitorId,
            jsErrorCount: jsErrorData[0].count,
            consoleErrorCount: consoleErrorData[0].count,
            resourceErrorCount: resourceErrorData[0].count,
            httpErrorCount: httpErrorData[0].count,
            jsErrorUvCount: jsErrorData[0].uvCount,
            consoleErrorUvCount: consoleErrorData[0].uvCount,
            resourceErrorUvCount: resourceErrorData[0].uvCount,
            httpErrorUvCount: httpErrorData[0].uvCount,
            hour: lastHour,
          }
          // 到此处，error计算完成了，执行报警逻辑
          warningInfoArray.push(warningInfo)
          if (typeof customerWarningCallback === "function" && p === projectList.length - 1) {
            customerWarningCallback(warningInfoArray)
          }
          //========================错误UV人数相关==========================//
        })
        break
      // 每小时的第2分10秒钟
      case "01:30":
        TimerCalculateController.handleProject(async(param) => {
          const { webMonitorId } = param
          const infoCountByHourInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            hourName: useHour,
            hourCount: ""
          }

          const loadTimeInfoByHourInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            hourName: useHour,
            hourCount: "",
            hourLoadTime: "",
          }
          //========================接口耗时相关==========================//

          // 计算每小时接口的平均耗时
          await HttpLogInfoModel.calculateHttpLoadTimeByHour(webMonitorId, lastHour, hour).then( async(data) => {
            infoCountByHourInfo.uploadType = UPLOAD_TYPE.HTTP_HOUR_TIME
            infoCountByHourInfo.hourCount = data[0].loadTime
            const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.HTTP_HOUR_TIME)
            if (result.length <= 0) {
              await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
            } else {
              const id = result[0].id
              await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
            }
          })
          // 计算每小时接口的请求量
          await HttpLogInfoModel.calculateHttpTotalCountByHour(webMonitorId, lastHour, hour).then( async(data) => {
            infoCountByHourInfo.uploadType = UPLOAD_TYPE.HTTP_HOUR_TOTAL_COUNT
            infoCountByHourInfo.hourCount = data[0].count
            const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.HTTP_HOUR_TOTAL_COUNT)
            if (result.length <= 0) {
              await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
            } else {
              const id = result[0].id
              await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
            }
          })
          
          // await CustomerPVModel.getDeviceCountByHour(webMonitorId, lastHour, hour, tempObj.key).then( async(deviceData) => {
          //   for (let i = 0; i < deviceData.length; i ++) {
          //     let deviceInfo = deviceData[i]
          //     deviceInfoCountByHourInfo.uploadType = tempObj.uploadType
          //     deviceInfoCountByHourInfo.hourCount = deviceInfo.count
          //     deviceInfoCountByHourInfo.showName = deviceInfo.showName
          //     const result = await DeviceInfoCountByHourModel.getDeviceInfoCountByIdByHourName(useHour, webMonitorId, tempObj.uploadType, deviceInfoCountByHourInfo.showName)
          //     if (result.length <= 0) {
          //       await DeviceInfoCountByHourModel.createDeviceInfoCountByHour(deviceInfoCountByHourInfo)
          //     } else {
          //       const id = result[0].id
          //       await DeviceInfoCountByHourModel.updateDeviceInfoCountByHour(id, deviceInfoCountByHourInfo)
          //     }
          //   }
          // })
          // 根据httpUrl, 计算每小时接口的请求量
          await HttpLogInfoModel.calculateHttpCountForUrlByHour(webMonitorId, lastHour, hour).then( async(httpCountData) => {
              for (let i = 0; i < httpCountData.length; i ++) {
                let httpCountInfo = httpCountData[i]
                loadTimeInfoByHourInfo.uploadType = UPLOAD_TYPE.HTTP_HOUR_COUNT_LOADTIME
                loadTimeInfoByHourInfo.hourCount = httpCountInfo.count
                loadTimeInfoByHourInfo.hourLoadTime = httpCountInfo.loadTime
                loadTimeInfoByHourInfo.showName = httpCountInfo.showName
                const result = await LoadTimeInfoByHourModel.getLoadTimeInfoByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.HTTP_HOUR_COUNT_LOADTIME, loadTimeInfoByHourInfo.showName)
                if (result.length <= 0) {
                  await LoadTimeInfoByHourModel.createLoadTimeInfoByHour(loadTimeInfoByHourInfo)
                } else {
                  const id = result[0].id
                  await LoadTimeInfoByHourModel.updateLoadTimeInfoByHour(id, loadTimeInfoByHourInfo)
                }
              }
          })

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
        })
        break
      // 每小时的第3分10秒钟
      case "02:00":
        TimerCalculateController.handleProject(async(param) => {
          const { webMonitorId } = param
          const infoCountByHourInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            hourName: useHour,
            hourCount: ""
          }

          const loadTimeInfoByHourInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            hourName: useHour,
            hourCount: "",
            hourLoadTime: 0,
          }
          //========================页面加载耗时相关==========================//

          // 根据httpUrl, 计算每小时接口的请求量
          await LoadPageInfoModel.calculateLoadPageInfoForUrlByHour(webMonitorId, lastHour, hour).then( async(loadPageCountData) => {
            for (let i = 0; i < loadPageCountData.length; i ++) {
              let loadPageInfo = loadPageCountData[i]
              loadTimeInfoByHourInfo.uploadType = UPLOAD_TYPE.PAGE_HOUR_COUNT_LOADTIME
              loadTimeInfoByHourInfo.hourCount = loadPageInfo.count
              loadTimeInfoByHourInfo.hourLoadTime = loadPageInfo.loadTime
              loadTimeInfoByHourInfo.showName = loadPageInfo.showName
              const result = await LoadTimeInfoByHourModel.getLoadTimeInfoByIdByHourName(useHour, webMonitorId, UPLOAD_TYPE.PAGE_HOUR_COUNT_LOADTIME, loadTimeInfoByHourInfo.showName)
              if (result.length <= 0) {
                await LoadTimeInfoByHourModel.createLoadTimeInfoByHour(loadTimeInfoByHourInfo)
              } else {
                const id = result[0].id
                await LoadTimeInfoByHourModel.updateLoadTimeInfoByHour(id, loadTimeInfoByHourInfo)
              }
            }
        })

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
        })
        break
      // 每小时的第4分10秒钟
      case "02:30":
        TimerCalculateController.handleProject(async(param) => {
          const { webMonitorId } = param
          const deviceInfoCountByHourInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            hourName: useHour,
            hourCount: "",
            showName: ""
          }
          //========================设备信息计算相关==========================//
          const deviceTimeScopeArray = [
            {key: "deviceName", uploadType: UPLOAD_TYPE.DEVICE_COUNT_HOUR},
            {key: "city", uploadType: UPLOAD_TYPE.CITY_COUNT_HOUR},
            {key: "province", uploadType: UPLOAD_TYPE.PROVINCE_COUNT_HOUR},
            {key: "country", uploadType: UPLOAD_TYPE.COUNTRY_COUNT_HOUR},
            {key: "os", uploadType: UPLOAD_TYPE.SYSTEM_COUNT_HOUR},
            {key: "projectVersion", uploadType: UPLOAD_TYPE.VERSION_COUNT_HOUR},
            {key: "deviceSize", uploadType: UPLOAD_TYPE.SCREEN_COUNT_HOUR},
            {key: "referrer", uploadType: UPLOAD_TYPE.REFERRER_COUNT_HOUR}
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
        })
        break
      // 每小时的第4分10秒钟
      case "03:00":
        TimerCalculateController.handleProject(async(param) => {
          const { webMonitorId } = param
          const infoCountByHourInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            hourName: useHour,
            hourCount: ""
          }
          const performanceKeys = {
            firstLoadCount: UPLOAD_TYPE.LOADPAGE_HOUR_COUNT,
            loadPage: UPLOAD_TYPE.LOADPAGE_HOUR_TIME,
            dns: UPLOAD_TYPE.DNS_HOUR_TIME,
            tcp: UPLOAD_TYPE.TCP_HOUR_TIME,
            ttfb: UPLOAD_TYPE.TTFB_HOUR_TIME,
            resource: UPLOAD_TYPE.RESOURCE_HOUR_TIME,
            domAnalysis: UPLOAD_TYPE.DOM_ANALYSIS_HOUR_TIME
          }
          //========================页面加载性能计算相关==========================//
          await LoadPageInfoModel.getPagePerformanceByHour(webMonitorId, lastHour, hour).then( async(pagePerformanceData) => {
            for(let key in performanceKeys) {
              infoCountByHourInfo.uploadType = performanceKeys[key]
              infoCountByHourInfo.hourCount = pagePerformanceData[0] ? pagePerformanceData[0][key] : 0
              const result = await InfoCountByHourModel.getInfoCountByIdByHourName(useHour, webMonitorId, performanceKeys[key])
              if (result.length <= 0) {
                await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
              } else {
                const id = result[0].id
                await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
              }
            }
          })
        })
        break
      // 每小时的第5分10秒钟
      case "03:30":
          const infoCountByHourInfo = {
            uploadType: "",
            webMonitorId: "",
            hourName: useHour,
            hourCount: ""
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
              await InfoCountByHourModel.getLocationPointCountByIdByHourName(useHour, locationPointUvType).then( async(result) => {
                if (result.length <= 0) {
                  await InfoCountByHourModel.createInfoCountByHour(infoCountByHourInfo)
                } else {
                  const id = result[0].id
                  await InfoCountByHourModel.updateInfoCountByHour(id, infoCountByHourInfo)
                }
              })
            })
          }
        break
      // 每小时的第4分10秒钟
      case "04:00":
        TimerCalculateController.handleProject(async(param) => {
          const { webMonitorId } = param
          const deviceInfoCountByHourInfo = {
            uploadType: "",
            webMonitorId: webMonitorId,
            hourName: useHour,
            hourCount: "",
            showName: ""
          }
          //========================设备信息计算相关==========================//
          const deviceTimeScopeArray = [
            {key: "deviceName", uploadType: UPLOAD_TYPE.DEVICE_COUNT_HOUR},
            {key: "city", uploadType: UPLOAD_TYPE.CITY_COUNT_HOUR},
            {key: "province", uploadType: UPLOAD_TYPE.PROVINCE_COUNT_HOUR},
            {key: "country", uploadType: UPLOAD_TYPE.COUNTRY_COUNT_HOUR},
            {key: "os", uploadType: UPLOAD_TYPE.SYSTEM_COUNT_HOUR},
            {key: "projectVersion", uploadType: UPLOAD_TYPE.VERSION_COUNT_HOUR},
            {key: "deviceSize", uploadType: UPLOAD_TYPE.SCREEN_COUNT_HOUR},
            {key: "referrer", uploadType: UPLOAD_TYPE.REFERRER_COUNT_HOUR}
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
        })
        break
      default:
        break
    }
  }
  static async handleProject(callback) {
    const projectList = await ProjectModel.getAllProjectList();
    for (let p = 0; p < projectList.length; p ++) {
      const webMonitorId = projectList[p].webMonitorId
      callback({webMonitorId, userTag: "", p, projectList})
    }
  }
  static async handleProjectWithTag(callback) {
    const projectList = await ProjectModel.getAllProjectList();
    for (let p = 0; p < projectList.length; p ++) {
      const webMonitorId = projectList[p].webMonitorId
      const userTags = projectList[p].userTag
      const firstTagArray = [""]
      let userTagArray = userTags ? userTags.split(",") : []
      // 如果userTagArray只有一个空字符串，说明用户没有设置userTag
      if (!(userTagArray.length === 1 && userTagArray[0] === "")) {
        userTagArray = firstTagArray.concat(userTagArray)
      }
      for (let tagIndex = 0; tagIndex < userTagArray.length; tagIndex ++) {
        let userTag = userTagArray[tagIndex]
        // console.log("==============", webMonitorId, userTag)
        callback(webMonitorId, userTag)
      }
    }
  }
}

module.exports = {CustomerStayTimeController,CustomerPvLeaveController,HttpErrorInfoController,ScreenShotInfoController,UserTokenController,AlarmRuleController,BehaviorInfoController,ConfigController,FailController,ExtendBehaviorInfoController,FunnelController,IgnoreErrorController,InfoCountByHourController,LocationPointGroupController,LocationPointTypeController,MessageController,ResourceLoadInfoController,LocationPointController,TeamController,VideosInfoController,HttpLogInfoController,LoadPageInfoController,CommonUtil,AlarmController,JavascriptErrorInfoController,UserController,CommonUpLog,CustomerPVController,ProjectController,Common,TimerCalculateController}