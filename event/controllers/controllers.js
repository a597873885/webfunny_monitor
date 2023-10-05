const db = require('../config/db');
                                        const Sequelize = db.sequelize;
                                        const colors = require('colors');
                                        const xlsx = require('node-xlsx');
                                        const Utils = require('../util/utils');
                                        const utils = require('../util/utils');
                                        const CusUtils = require('../util_cus')
                                        const searcher = require('node-ip2region').create();
                                        const log = require("../config/log");
                                        const statusCode = require('../util/status-code');
                                        const { UPLOAD_TYPE } = require('../config/consts');
                                        const fetch = require('node-fetch');
                                        const jwt = require('jsonwebtoken')
                                        const verify = jwt.verify
                                        const secret = require('../config/secret')
                                        const { USER_INFO, DANGER_SQL_PARAMS } = require('../config/consts')
                                        const fs = require('fs');
                                        const path = require('path');
                                        const IP = require('ip')
                                        const getmac = require('getmac')
                                        const send = require('koa-send');
                                        const callFile = require('child_process');
                                        const nodemailer = require('nodemailer');
                                        const formidable = require("formidable");
                                        const AccountConfig = require('../config/AccountConfig');
                                        const RabbitMq = require('../lib/RabbitMQ')
                                        const process = require('child_process')
                                        const { spawn, exec, execFile } = require('child_process');
                                        const { accountInfo } = AccountConfig
                                        const Consts = require("../config/consts")
                                        const { MANAGE_API } = Consts
                                        const { transliteration, slugify } = require('transliteration');
                                        const ConstMsg = require('../config/constMsg')
                                        const sendMq = accountInfo.messageQueue === true ? new RabbitMq() : null
                                        const weFieldList = require("../metadata/weFieldList")
                                        const wePointList = require("../metadata/wePointList")
                                        const weCardList = require("../metadata/weCardList")
                                        const weTemplateList = require("../metadata/weTemplateList")
                                        const AlarmUtil = require('../alarm/index')
                                        const baseTemplateCardList = require("../metadata/demo/baseTemplateCardList")
                                        
const {BuryPointAlarmMessageModel,BuryPointAlarmModel,BuryPointCardModel,BuryPointCardStatisticsModel,BuryPointFailLogModel,BuryPointTaskModel,BuryPointTemplateModel,BuryPointFieldModel,BuryPointWarehouseModel,CommonModel,ConfigModel,MessageModel,TeamModel,SdkReleaseModel,UserModel,BuryPointProjectModel,BuryPointRelationModel,} = require('../modules/models.js');
class CommonUtil {

   /**
   * 激活码解密
   */
  static decryptPurchaseCode(purchaseCode, originSecretCode) {
    const SECRETS_LIST = "JTVCJTdCJTIyUCUyMiUzQSUyMjElMjIlMkMlMjJYJTIyJTNBJTIyMiUyMiUyQyUyMkQlMjIlM0ElMjIzJTIyJTJDJTIyVyUyMiUzQSUyMjQlMjIlMkMlMjJVJTIyJTNBJTIyNSUyMiUyQyUyMkIlMjIlM0ElMjI2JTIyJTJDJTIyUyUyMiUzQSUyMjclMjIlMkMlMjJNJTIyJTNBJTIyOCUyMiUyQyUyMkclMjIlM0ElMjI5JTIyJTJDJTIySyUyMiUzQSUyMjAlMjIlN0QlMkMlN0IlMjJaJTIyJTNBJTIyMSUyMiUyQyUyMkElMjIlM0ElMjIyJTIyJTJDJTIyRCUyMiUzQSUyMjMlMjIlMkMlMjJWJTIyJTNBJTIyNCUyMiUyQyUyMk0lMjIlM0ElMjI1JTIyJTJDJTIyQyUyMiUzQSUyMjYlMjIlMkMlMjJOJTIyJTNBJTIyNyUyMiUyQyUyMkslMjIlM0ElMjI4JTIyJTJDJTIySiUyMiUzQSUyMjklMjIlMkMlMjJMJTIyJTNBJTIyMCUyMiU3RCUyQyU3QiUyMlklMjIlM0ElMjIxJTIyJTJDJTIyUSUyMiUzQSUyMjIlMjIlMkMlMjJJJTIyJTNBJTIyMyUyMiUyQyUyMlQlMjIlM0ElMjI0JTIyJTJDJTIyViUyMiUzQSUyMjUlMjIlMkMlMjJSJTIyJTNBJTIyNiUyMiUyQyUyMkglMjIlM0ElMjI3JTIyJTJDJTIyQyUyMiUzQSUyMjglMjIlMkMlMjJQJTIyJTNBJTIyOSUyMiUyQyUyMlUlMjIlM0ElMjIwJTIyJTdEJTJDJTdCJTIyUyUyMiUzQSUyMjElMjIlMkMlMjJXJTIyJTNBJTIyMiUyMiUyQyUyMlolMjIlM0ElMjIzJTIyJTJDJTIyRiUyMiUzQSUyMjQlMjIlMkMlMjJRJTIyJTNBJTIyNSUyMiUyQyUyMkolMjIlM0ElMjI2JTIyJTJDJTIyVCUyMiUzQSUyMjclMjIlMkMlMjJCJTIyJTNBJTIyOCUyMiUyQyUyMlYlMjIlM0ElMjI5JTIyJTJDJTIySSUyMiUzQSUyMjAlMjIlN0QlMkMlN0IlMjJFJTIyJTNBJTIyMSUyMiUyQyUyMkIlMjIlM0ElMjIyJTIyJTJDJTIyUSUyMiUzQSUyMjMlMjIlMkMlMjJWJTIyJTNBJTIyNCUyMiUyQyUyMlglMjIlM0ElMjI1JTIyJTJDJTIyWSUyMiUzQSUyMjYlMjIlMkMlMjJUJTIyJTNBJTIyNyUyMiUyQyUyMkclMjIlM0ElMjI4JTIyJTJDJTIyUyUyMiUzQSUyMjklMjIlMkMlMjJNJTIyJTNBJTIyMCUyMiU3RCU1RA=="
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
      global.eventInfo.purchaseCodeEndDate = dateStr
      global.eventInfo.purchaseCodeValid = isValid
      global.eventInfo.purchaseCodeType = productType
      return { isValid, productType}
    } else {
      let isValid = false
      let dateStr = ""
      let todayStr = new Date().Format("yyyy-MM-dd")
      const reg = /\d{4}-\d{2}-\d{2}/
      // 位数只能是20，25, 30位，否则直接失效
      global.eventInfo.purchaseCodeValid = isValid
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
      let cardCount = 10
      let performanceType = 1

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

        if (productType === 50 || productType === 51) {
          const count5 = purchaseCode.charAt(29).charCodeAt()
          const count6 = purchaseCode.charAt(26).charCodeAt()
          const count7 = purchaseCode.charAt(25).charCodeAt()
          const count8 = purchaseCode.charAt(28).charCodeAt()
          const tempCount3 = (count5 - count6) + ""
          const tempCount4 = (count7 - count8) + ""
          cardCount = tempCount4 + tempCount3
          // 如果是00，则代表是无限数量
          if (cardCount === "40") {
            cardCount = "9999"
          }else{
            //得到的数字乘以10才是卡片数
            cardCount = parseInt(cardCount, 10) * 10;
          }
          const count9 = purchaseCode.charAt(27).charCodeAt()
          const tempCount5 = (count9 - count3) + ""
          performanceType = tempCount5
        } else if (productType == 0 || productType === 30) {//试用版和分享版
          cardCount = "10"
          performanceType = "1"
        } else if ( productType === 31 || productType === 32) { 
          // 老版本的个人版，30,31,32
          cardCount = "30"
          performanceType = "1"
        } else {
          // 老版本的企业版,VIP
          cardCount = "9999"
          performanceType = "2"
        }

      }

      productType = parseInt(productType, 10)
      cardCount = parseInt(cardCount, 10)
      performanceType = parseInt(performanceType, 10)

      // 类型不在30 - 40之间，则无效，0：试用版，23：黄金VIP,25,26,28：VIP版，50：专业版，51：企业版
      if (!(productType === 0 || productType === 23  || productType === 25  || productType === 26 
        || productType === 28 || (productType >= 30 && productType < 40)
        || productType === 50 || productType === 51)) {
        return {isValid: false, productType: 0}
      }

      const secrets = JSON.parse(Utils.b64DecodeUnicode(SECRETS_LIST))
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
      global.eventInfo.purchaseCodeEndDate = dateStr
      global.eventInfo.purchaseCodeValid = isValid
      global.eventInfo.purchaseCodeType = productType
      global.eventInfo.purchaseCodeCardCount = cardCount

      let cardCountStr = `${Utils.b64DecodeUnicode(ConstMsg.CARD_COUNT)}：${cardCount}`
      let projectTypeStr = `${Utils.b64DecodeUnicode(ConstMsg.PROJECT_TYPE)}：`
      if (productType === 50) {
        projectTypeStr += `${Utils.b64DecodeUnicode(ConstMsg.PRODUCT_TYPE1)}` 
      } else if (productType === 51) {
        projectTypeStr += `${Utils.b64DecodeUnicode(ConstMsg.PRODUCT_TYPE2)}`  
      }
      let endDateStr = `${Utils.b64DecodeUnicode(ConstMsg.END_DATE)}：${dateStr}`
      console.log(projectTypeStr.cyan)
      console.log(cardCountStr.cyan)
      console.log(endDateStr.cyan)
      return { isValid, productType, cardCount, performanceType}
    }
  }
  

  static async consoleLogo() {
    console.log(" ██╗    ██╗ ███████╗ ██████╗  ███████╗ ██╗   ██╗ ███╗   ██╗ ███╗   ██╗ ██╗   ██╗".cyan)
    console.log(" ██║    ██║ ██╔════╝ ██╔══██╗ ██╔════╝ ██║   ██║ ████╗  ██║ ████╗  ██║ ╚██╗ ██╔╝".cyan)
    console.log(" ██║ █╗ ██║ █████╗   ██████╔╝ █████╗   ██║   ██║ ██╔██╗ ██║ ██╔██╗ ██║  ╚████╔╝".cyan)
    console.log(" ██║███╗██║ ██╔══╝   ██╔══██╗ ██╔══╝   ██║   ██║ ██║╚██╗██║ ██║╚██╗██║   ╚██╔╝".cyan)
    console.log(" ╚███╔███╔╝ ███████╗ ██████╔╝ ██║      ╚██████╔╝ ██║ ╚████║ ██║ ╚████║    ██║".cyan)
    console.log("  ╚══╝╚══╝  ╚══════╝ ╚═════╝  ╚═╝       ╚═════╝  ╚═╝  ╚═══╝ ╚═╝  ╚═══╝    ╚═╝".cyan)
    console.log(" ")
    console.log(" ")
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.SERVER_STARTING)}`.yellow)
    console.log("")
  }

  static async consoleInfo(startType) {
    if (startType) {
        console.log("启动 " + startType + " 模式...");
    }
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.SERVER_START_SUCCESS)}`.yellow)
    console.log("")
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.SERVER_AUTHOR)}`.white)
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.SERVER_WECHAT)}`.white)
    console.log(" ")
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG1)}`, ("http://" + accountInfo.centerAssetsDomain + "/webfunny_center/main.html ").blue.underline)
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG2)}`, ("http://" + accountInfo.localAssetsDomain + "/webfunny_event/dataView.html ").blue.underline)
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG3)}`, "http://www.webfunny.cn/website/faq.html".blue.underline)
    console.log(" ")
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG4)}`, "npm run prd".cyan)
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG5)}`, "npm run restart".cyan)
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG6)}`, "pm2 stop webfunny_event | pm2 delete webfunny_event".cyan)
    console.log(" ")
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG7)}`.cyan)
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG8)}`, "pm2 list".cyan)
    console.log(" ")
    console.log(`${Utils.b64DecodeUnicode(ConstMsg.STARTING_MSG9)}`.green, "https://github.com/a597873885/webfunny_monitor".cyan.underline)
    console.log(" ")

    const adminData = await UserModel.checkAdminAccount();
    const adminUserCount = adminData[0].count * 1
    // 在此查询数据库数据，如果查询成功，则说明启动成功了，可以打开浏览器
    ConfigModel.getConfigByConfigName("purchaseCode").then((res) => {
      if (res.length) {
        const url = adminUserCount > 0 ? `http://${accountInfo.localAssetsDomain}/webfunny_event/dataView.html` : `http://${accountInfo.localAssetsDomain}/webfunny_event/register.html?type=1`
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
    const isValidMsg0 = `${Utils.b64DecodeUnicode(ConstMsg.VALID_MSG0)}`.red
    const isValidMsg1 = `${Utils.b64DecodeUnicode(ConstMsg.VALID_MSG1)}`.red
    const isValidMsg = `${Utils.b64DecodeUnicode(ConstMsg.VALID_MSG)}`.green  + "http://www.webfunny.cn/purchase.html".cyan.underline
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
      //Utils.post("http://monitor.webfunny.cn/server/upBp", {userId: "ABCD", locationPointId: 6}).then(() => {}).catch((e) => {})
      Utils.postPoint("http://monitor.webfunny.cn/tracker/upEvent", { data: JSON.stringify({
        pointId: "10",
        projectId: "event1029",
        yong_hu_id: getmac.default() || "not get",
        shouQuanMaId: "ABCD",
        shouQuanMaLeiXing: "0",
        shiFouDaoQi: 1,
        shiFouYouXiao: 2,
        shiFouHeiMingDan: 1
      })}).then((res) => {}).catch((e) => {})

      // 如果数据库激活码是空的，则自动给他生成一个试用版激活码
      await Utils.get("http://www.webfunny.cn/config/initPurchaseCode", {webfunnyVersion}).then(async(result) => {
        const inputPurchaseCode = result.data
        await ConfigModel.createConfig({configName: "purchaseCode", configValue: inputPurchaseCode})
        CommonUtil.restartServer()
        return
      }).catch((e) => {
        console.log("webfunny启动失败了，原因可能有两种：".red)
        console.log("1. 网络异常，执行重启命令试一下$: npm run restart".red)
        console.log("2. 贵公司的环境无法访问外部网络，无法获取激活码，请联系我们解决，微信号：webfunny2、webfunny_2020 ".red)
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
      //Utils.post("http://monitor.webfunny.cn/server/upBp", {userId: purchaseCode, locationPointId: 7}).then(() => {}).catch((e) => {})
      Utils.postPoint("http://monitor.webfunny.cn/tracker/upEvent", { data: JSON.stringify({
        pointId: "10",
        projectId: "event1029",
        yong_hu_id: getmac.default() || "not get",
        shouQuanMaId: Utils.md5(purchaseCode),
        shouQuanMaLeiXing: "0",
        shiFouDaoQi: 1,
        shiFouYouXiao: 2,
        shiFouHeiMingDan: 2
      })}).then((res) => {}).catch((e) => {})
      global.eventInfo.purchaseCodeValid = false
      failCallback()
      return
    }
    // await getConfigByConfigName("purchaseCode")
    // 激活码有效性判断
    const { productType, isValid } = CommonUtil.decryptPurchaseCode(purchaseCode, secretCode)
    if (isValid == true) {
      // 启动试用版激活码，埋点
      Utils.postPoint("http://monitor.webfunny.cn/tracker/upEvent", { data: JSON.stringify({
        pointId: "10",
        projectId: "event1029",
        yong_hu_id: getmac.default() || "not get",
        shouQuanMaId: Utils.md5(purchaseCode),
        shouQuanMaLeiXing: productType + "",
        shiFouDaoQi: 1,
        shiFouYouXiao: 1,
        shiFouHeiMingDan: 1
      })}).then(() => {}).catch(() => {})
      // 如果激活码有效，发送部署统计数据
      const ipAddress = IP.address()
      const happenTime = new Date().getTime()
      Utils.postJson("http://www.webfunny.cn/config/memberActiveDeploy", {cdkey: purchaseCode, ip: ipAddress, webfunnyVersion, happenTime}).then(() => {}).catch((e) => {})
      // 设置激活码全局状态为true
      global.eventInfo.purchaseCodeValid = true
      global.eventInfo.productType = productType
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
      Utils.postPoint("http://monitor.webfunny.cn/tracker/upEvent", { data: JSON.stringify({
        pointId: "10",
        projectId: "event1029",
        yong_hu_id: getmac.default() || "not get",
        shouQuanMaId: Utils.md5(purchaseCode),
        shouQuanMaLeiXing: productType + "",
        shiFouDaoQi: 2,
        shiFouYouXiao: 2,
        shiFouHeiMingDan: 1
      })}).then((res) => {}).catch((e) => {})
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

class BuryPointAlarmController {
    /**
     * @swagger
     * /buryPointAlarm/create:
     *   post:
     *     tags:
     *       - 规则管理
     *     summary: 创建规则
     *     parameters:
     *       - name: name
     *         description: 规则名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: silentTime
     *         description: 静默时间 ['00:00-23:59','01:00-22:59']
     *         in: formData
     *         required: false
     *         type: array
     *       - name: description
     *         description: 规则描述
     *         in: formData
     *         required: true
     *         type: string
     *       - name: urgency
     *         description: 紧急程度 normal 一般，urgent 紧急，critical 严重
     *         in: formData
     *         required: true
     *         type: string
     *       - name: content
     *         description: 警报内容
     *         in: formData
     *         required: true
     *         type: string    
     *       - name: rule
     *         description: 阈值条件 大于等于 greaterThanAndEqual 、小于等于 lessThanAndEqual  
     *         in: formData
     *         required: true
     *         type: string    
     *       - name: count
     *         description: 连续次数
     *         in: formData
     *         required: true
     *         type: integer    
     *       - name: thresholdType
     *         description: 阈值类型 count 次数 percentage 百分比 不传默认为 次数类型
     *         in: formData
     *         required: false 
     *         type: string    
     *       - name: threshold
     *         description: 阈值
     *         in: formData
     *         required: true
     *         type: integer    
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async create(ctx) {
        try {
            let req = JSON.parse(ctx.request.body);
            const { nickname, userId } = ctx.user

            const { content, urgency, projectId, name, threshold, count, rule, thresholdType = 'count' } = req;
            if (content && urgency && projectId && name && count !== undefined && rule && threshold !== undefined) {
                // TODO 部署测试环境前 去除后面的
                // const { nickname, userId } = ctx.user || { nickname: '123', 'userId': '123' }
                req.createBy = nickname
                req.updateBy = nickname
                req.status = 1;
                req.frequency = 1
                req.frequencyUnit = 'hour'
                req.createManId = userId
                req.silentTime = req.silentTime.join(',');
                // rule 是由前端传过来的，这里需要拼接成字符串，便于存储，其中
                // rule 为 阈值条件 大于等于 greaterThanAndEqual 、小于等于 lessThanAndEqual
                // threshold 为 阈值 ; thresholdType 为阈值类型 count 次数 percentage 百分比 不传默认为 次数类型
                // count 为 连续次数   
                if(!thresholdType || thresholdType === '' || thresholdType === null || thresholdType === undefined){
                    req.rule = `${rule},${threshold},${count},count`
                }else{
                    req.rule = `${rule},${threshold},${count},${thresholdType}`
                }
                const checkSame = await BuryPointAlarmModel.getSameName(name, projectId);
                if (checkSame) {
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412('创建失败，同项目下规则名称不可重复')
                    return
                }
                await BuryPointAlarmModel.create(req);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('创建成功', '')
            } else {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('创建失败，请求参数不能为空！')
            }
        } catch (error) {
            console.log(error);
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }

    /**
     * @swagger
     * /buryPointAlarm/detail:
     *   get:
     *     tags:
     *       - 规则管理
     *     summary: 规则详情
     *     parameters:
     *       - name: id
     *         description: 规则id
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async detail(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        let id = param.id;
        try {
            const res = await BuryPointAlarmModel.detail(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', res)
        } catch (error) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }
    /**
    * @swagger
    * /buryPointAlarm/updateStatus:
    *   post:
    *     tags:
    *       - 规则管理
    *     summary: 更新规则状态（启用1 禁用2）
    *     parameters:
    *       - name: id
    *         description: 规则ID
    *         in: formData
    *         required: true
    *         type: string
    *       - name: status
    *         description: 状态  （启用1 禁用2）
    *         in: formData
    *         required: true
    *         type: integer
    *     responses: 
    *       200:
    *         description: '{"code":200,"msg":"success","data":[]}'
    */
    static async updateStatus(ctx) {
        let { id, status } = JSON.parse(ctx.request.body);

        try {
            const res = await BuryPointAlarmModel.updateStatus(id, status)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', res)
        } catch (error) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('更新状态失败')
        }

    }
    /**
     * @swagger
     * /buryPointAlarm/list:
     *   post:
     *     tags:
     *       - 规则管理
     *     summary: 获取规则列表
     *     parameters:
     *       - name: urgency
     *         description: 紧急程度 normal 一般，urgent 紧急，critical 严重
     *         in: formData
     *         required: false
     *         type: string
     *       - name: name
     *         description: 规则名称
     *         in: formData
     *         required: false
     *         type: string
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: false
     *         type: string
     *       - name: isMy
     *         description: 是否是我的规则列表
     *         in: formData
     *         required: true
     *         type: boolean
     *       - name: page
     *         description: 页数(从1开始)
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 每页显示数量
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: dateOrderby
     *         description: 按时间排序(降序desc,升序asc 默认降序)
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async list(ctx) {
        const req = JSON.parse(ctx.request.body)

        if (!req.page) {
            req.page = 1
        }
        if (!req.pageSize) {
            req.pageSize = 10
        }
        if (req.isMy) {
            req.createManId = ctx.user.userId
        } else {
            req.isMy = false;
        }
        if (!req.name) {
            req.name = "";
        }

        if (!req.urgency) {
            req.urgency = "";
        }

        if (!req.projectId) {
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数缺少项目id')
            return;
        }

        try {
            const res = await BuryPointAlarmModel.getList(req)
            const { list, total } = res

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', { list, total })
        } catch (error) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }

    /**
     * @swagger
     * /buryPointAlarm/getListByProjectId:
     *   post:
     *     tags:
     *       - 规则管理
     *     summary: 通过项目id获取规则列表
     *     parameters:
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: false
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getListByProjectId(ctx) {
        const req = JSON.parse(ctx.request.body)
        if (!req.projectId) {
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数缺少项目id')
            return;
        }
        try {
            const res = await BuryPointAlarmModel.getListByProjectId(req.projectId)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', res)
        } catch (error) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }

    /**
     * @swagger
     * /buryPointAlarm/update:
     *   post:
     *     tags:
     *       - 规则管理
     *     summary: 编辑更新规则
     *     parameters:
     *       - name: name
     *         description: 规则名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: id
     *         description: 规则ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: silentTime
     *         description: 静默时间 ['00:00-23:59','01:00-22:59']
     *         in: formData
     *         required: false
     *         type: array
     *       - name: description
     *         description: 规则描述
     *         in: formData
     *         required: true
     *         type: string
     *       - name: urgency
     *         description: 紧急程度 normal 一般，urgent 紧急，critical 严重
     *         in: formData
     *         required: true
     *         type: string
     *       - name: content
     *         description: 警报内容
     *         in: formData
     *         required: true
     *         type: string    
     *       - name: rule
     *         description: 阈值条件 大于等于 greaterThanAndEqual 、小于等于 lessThanAndEqual  
     *         in: formData
     *         required: true
     *         type: string    
     *       - name: count
     *         description: 连续次数
     *         in: formData
     *         required: true
     *         type: integer    
     *       - name: threshold
     *         description: 阈值
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: thresholdType
     *         description: 阈值类型 count 次数 percentage 百分比 不传默认为 次数类型
     *         in: formData
     *         required: false 
     *         type: string        
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async update(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { nickname } = ctx.user;
        const { id, content, urgency, name, threshold, count, rule ,thresholdType} = req;
        try {
            if (id && content && urgency && name && count !== undefined && rule && threshold !== undefined) {
                req.silentTime = req.silentTime.join(',');
                if(!thresholdType || thresholdType === '' || thresholdType === null || thresholdType === undefined){
                    req.rule = `${rule},${threshold},${count},count`
                }else{
                    req.rule = `${rule},${threshold},${count},${thresholdType}`
                }
                req.updateBy = nickname
                let res = await BuryPointAlarmModel.update(req)
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_SUCCESS)}`, res)
            } else {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_PARAM_FAIL)}`)
            }
        } catch (error) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }

    /**
     * @swagger
     * /buryPointAlarm/delete:
     *   post:
     *     tags:
     *       - 规则管理
     *     summary: 删除单个规则
     *     parameters:
     *       - name: id
     *         description: 任务ID
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async delete(ctx) {
        try {
            let { id } = JSON.parse(ctx.request.body);
            const result = await BuryPointAlarmModel.delete(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', result)
        } catch (e) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }


    /**
    * @swagger
    * /buryPointAlarm/batchDeletion:
    *   post:
    *     tags:
    *       - 规则管理
    *     summary: 删除批量规则
    *     parameters:
    *       - name: alarmIds
    *         description: id列表，如："id1,id2,id3,id4,id5"
    *         in: formData
    *         required: true
    *         type: string
    *     responses: 
    *       200:
    *         description: '{"code":200,"msg":"success","data":[]}'
    */
    static async batchDeletion(ctx) {
        let { alarmIds } = JSON.parse(ctx.request.body);
        if (alarmIds) {
            await BuryPointAlarmModel.batchDeletion(alarmIds)
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }

    /**
     * @swagger
     * /buryPointAlarm/copy:
     *   post:
     *     tags:
     *       - 规则管理
     *     summary: 复制规则
     *     parameters:
     *       - name: id
     *         description: 规则id
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: name
     *         description: 规则名称
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async copy(ctx) {
        let req = JSON.parse(ctx.request.body);
        
        try {
            const { nickname, userId } = ctx.user
            const { name, id, projectId } = req
            if (name && id && projectId) {
                let detail = (await BuryPointAlarmModel.detail(id));
                let newRule = {};

                newRule.createBy = nickname
                newRule.updateBy = nickname
                newRule.name = name
                newRule.content = detail.content
                newRule.description = detail.description
                newRule.frequencyUnit = detail.frequencyUnit
                newRule.frequency = detail.frequency
                newRule.urgency = detail.urgency
                newRule.status = 1
                newRule.projectId = projectId
                newRule.createManId = userId
                newRule.silentTime = detail.silentTime.join(',');
                newRule.rule = `${detail.rule},${detail.threshold},${detail.count},${detail.thresholdType}`
                await BuryPointAlarmModel.create(newRule);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', '')
            } else {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('fail！')
            }
        } catch (error) {
            console.log(error)
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('请求异常')
        }
    }

}

class BuryPointAlarmMessageController {
    /**
     * @swagger
     * /buryPointAlarmMessage/create:
     *   post:
     *     tags:
     *       - 警报列表管理
     *     summary: 创建告警信息
     *     parameters:
     *       - name: alarmId
     *         description: 告警id
     *         in: formData
     *         required: true
     *         type: string
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pageId
     *         description: 页面ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: urgency
     *         description: 紧急程度 normal 一般，urgent 紧急，critical 严重
     *         in: formData
     *         required: true
     *         type: string
     *       - name: alarmName
     *         description: 警告名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: message
     *         description: 警报内容
     *         in: formData
     *         required: true
     *         type: string   
     *       - name: notifyUsers
     *         description: 通知人 测试用户a,测试用户b
     *         in: formData
     *         required: true
     *         type: string      
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async create(ctx) {
        try {
            let req = JSON.parse(ctx.request.body);
            const { urgency, projectId, alarmId, alarmName, message, notifyUsers, pageId } = req;
            if (urgency && projectId && alarmName && alarmId && message && notifyUsers && pageId) {
                await BuryPointAlarmMessageModel.create(req);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('创建成功', '')
            } else {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('创建失败，请求参数不合法')
            }
        } catch (error) {
            console.log(error);
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('创建失败,请查看失败原因')
        }
    }

    /**
     * @swagger
     * /buryPointAlarmMessage/detail:
     *   get:
     *     tags:
     *       - 警报列表管理
     *     summary: 告警信息详情
     *     parameters:
     *       - name: id
     *         description: 规则id
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async detail(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        let id = param.id;
        try {
            const res = await BuryPointAlarmMessageModel.detail(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', res)
        } catch (error) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }

    /**
     * @swagger
     * /buryPointAlarmMessage/list:
     *   post:
     *     tags:
     *       - 警报列表管理
     *     summary: 获取警报列表
     *     parameters:
     *       - name: urgency
     *         description: 紧急程度 normal 一般，urgent 紧急，critical 严重
     *         in: formData
     *         required: false
     *         type: string
     *       - name: alarmName
     *         description: 警告名称
     *         in: formData
     *         required: false
     *         type: string
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: false
     *         type: string
     *       - name: page
     *         description: 页数(从1开始)
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 每页显示数量
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: dateOrderby
     *         description: 按时间排序(降序desc,升序asc 默认降序)
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async list(ctx) {
        const req = JSON.parse(ctx.request.body)
        const { userId } = ctx.user
        req.userId = userId
        if (!req.page) {
            req.page = 1
        }
        if (!req.pageSize) {
            req.pageSize = 10
        }
        try {
            const res = await BuryPointAlarmMessageModel.getList(req)
            const { list, total } = res

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', { list, total })
        } catch (error) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }

    /**
     * @swagger
     * /buryPointAlarmMessage/delete:
     *   post:
     *     tags:
     *       - 警报列表管理
     *     summary: 删除单个警报
     *     parameters:
     *       - name: id
     *         description: 警报ID
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async delete(ctx) {
        try {
            let { id } = JSON.parse(ctx.request.body);
            const result = await BuryPointAlarmMessageModel.delete(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', result)
        } catch (e) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }


    static async testSendNotice(ctx) {
        

        // let calcDataCount1 = 30.31
        // let threshold = 40.21
        // console.log((calcDataCount1 >= threshold))
        // console.log((calcDataCount1 <= threshold))
        // console.log(parseFloat(calcDataCount1))
        // console.log(parseFloat(threshold))
        // console.log(parseFloat(calcDataCount1) <= parseFloat(threshold))

        // let { cardId, calcName, calcNameKey, alarmId,pageId,alarmMembers,calcDataCount,noticeWay } = JSON.parse(ctx.request.body);

        // BuryPointAlarmMessageController.alarmNotice(cardId, calcName, calcNameKey, alarmId,pageId,alarmMembers,calcDataCount,noticeWay)

    }

    /**
     * 告警通知发送消息
     * 最后更新卡片的报警状态字段alarmStatus:0-不报警，1-报警
     * @param {卡片ID} cardId 1 (从卡片传过来的)
     * @param {卡片计算数据名称} calcName 1 (从卡片传过来的)
     * @param {卡片计算数据唯一key} calcNameKey 1 (从卡片传过来的)
     * @param {规则ID} alarmRuleId 1 (从卡片传过来的)
     * @param {页面id} pageId 1 (从卡片传过来的)
     * @param {通知人} alarmMembers [{"userId":"123","phone":"13211111111","email":"123@163.com"},{"userId":"123","phone":"13211111111","email":"123@163.com"}] (从卡片传过来的)
     * @param {卡片阈值} calcDataCount 123  (计算卡片传过来的)
     * @param {通知方式} noticeWay (从卡片传过来的)
     *      [
                { type: "email" },
                { type: "robot", robotType: "dingding", webhook: "" }
            ] 
     **/
    static async alarmNotice(cardId, cardName, calcName,calcNameKey, 
        alarmRuleId,pageId,alarmMembers,calcDataCount,noticeWay) {
        //更新卡片报警状态字段alarmStatus:0-不报警
        let cardUpdate = {};
        cardUpdate.id = cardId
        cardUpdate.alarmStatus = 0
        cardUpdate.updateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        await BuryPointCardModel.update(cardId, cardUpdate);
        // 如果警报Id和警报通知人不存在
        if (!alarmRuleId || alarmRuleId === '' || alarmRuleId === undefined) {
            return
        }
        if (!alarmMembers || alarmMembers === '' || alarmMembers === undefined) {
            return
        }
        //获取用户信息
        const users = JSON.parse(alarmMembers)
        if(!(users && users.length)) {
            return
        }

        //通过卡片绑定的规则id获取规则信息，1非禁用的
        const alarmData = await BuryPointAlarmModel.detailById(alarmRuleId,1);
        if(!alarmData){//规则没找到，不处理
            return
        }
        const { id,name,projectId,frequency,frequencyUnit,silentTime,urgency,rule,content } = alarmData
        let silentFlag = 0;//非静默
        if(!silentTime || silentTime === ''){//非静默，告警
            silentFlag = 0;
        }else{
            const silentTimeArr = silentTime.split(",") //静默时间，数据：05:00-12:00,01:00-02:00,09:00-10:00
            // 判断是否处于静默时间
            const tempDate = new Date()
            let hourMinuteStr = tempDate.Format("hh:mm")
            for(let i = 0; i < silentTimeArr.length; i++) {
                let silentTimeData = silentTimeArr[i].split("-");
                let quietStartTime = silentTimeData[0];//静默开始时间
                let quietEndTime = silentTimeData[1];//静默结束时间
                if (hourMinuteStr >= quietStartTime && hourMinuteStr < quietEndTime) {
                    silentFlag = 1//静默
                    return
                }
            }
        }
        //条件组成：大于等于,连续次数,阈值,是否百分比
        //thresholdType：%百分比 不传默认为 次数类型
        const ruleArr = rule.split(",") //数据：greaterThanAndEqual,1,2
        const compareType = ruleArr[0] //大于等于(greaterThanAndEqual)、小于等于(lessThanAndEqual)
        let threshold = ruleArr[1] //:阈值，和卡片里面统计数据作比较 
        const happenCount = parseInt(ruleArr[2],10) //连续发生次数
        const thresholdType  = ruleArr[3]// count非百分比，percentage百分比
        if (!global.eventInfo.alarmInfoList[cardId]) {
            global.eventInfo.alarmInfoList[cardId] = {}
        }
        if (!global.eventInfo.alarmInfoList[cardId][calcNameKey]) {
            global.eventInfo.alarmInfoList[cardId][calcNameKey] = 0
        }
        const lastValue = global.eventInfo.alarmInfoList[cardId][calcNameKey]
        if (compareType === "greaterThanAndEqual" && parseFloat(calcDataCount) >= parseFloat(threshold)) {
            global.eventInfo.alarmInfoList[cardId][calcNameKey] = lastValue + 1
        } else if (compareType === "lessThanAndEqual" && parseFloat(calcDataCount) <= parseFloat(threshold)) {
            global.eventInfo.alarmInfoList[cardId][calcNameKey] = lastValue + 1
        }
        //静默时间内的，不报警
        if(silentFlag === 1){
            return
        }
        // 到达发生次数，需要发出通知：全局变量：卡片id+计算数据唯一key
        if (global.eventInfo.alarmInfoList[cardId][calcNameKey] >= happenCount) {
            // log.printInfo(calcName + ":发出告警，阈值条件：" + JSON.stringify(rule) + ",数值：" + calcDataCount 
        // + ",发送次数：" + global.eventInfo.alarmInfoList[cardId][calcNameKey])
            //告警内容替换，加上概览访问地址:https://monitor.webfunny.cn/webfunny_event/dataView.html?dashboardType=3&pageKey=209&showAddCardBtn=1
            let thresholdStr = "";
            if (compareType === "greaterThanAndEqual") {
                thresholdStr = ">="
            } else if (compareType === "lessThanAndEqual") {
                thresholdStr = "<="
            }
            if(thresholdType && thresholdType === 'percentage'){
                thresholdStr = thresholdStr + threshold + '%';
            }else{
                thresholdStr = thresholdStr + threshold
            }
            let urgencyStr = "";//normal 一般，urgent 紧急，critical 严重
            if(urgency === 'normal'){
                urgencyStr = '一般';
            }else if (urgency === 'critical'){
                urgencyStr = '严重'
            }else{
                urgencyStr = "紧急"
            }
            let contentStr = content.replace(/{alarmName}/g,cardName)
            .replace(/{calcData}/g,calcName)
            .replace(/{urgency}/g,urgencyStr)
            .replace(/{threshold}/g,thresholdStr)
            .replace(/{happenCount}/g,happenCount)
            contentStr = contentStr + "警报卡片：" + `http://${accountInfo.localAssetsDomain}` + "/webfunny_event/dataView.html?dashboardType=3&showAddCardBtn=1&pageKey=" + pageId
            // 发出告警通知
            AlarmUtil.alarmCallback(noticeWay, contentStr, users)

            let alarmMessage = {};
            alarmMessage.urgency = urgency
            alarmMessage.projectId = projectId
            alarmMessage.alarmId = id
            alarmMessage.alarmName = name
            alarmMessage.pageId = pageId
            alarmMessage.message = contentStr
            //通知人userId
            let alarmMemberUserIds = "";
            users.forEach((user) => {
                // alarmMemberNames = alarmMemberNames + user.nickname + ","
                alarmMemberUserIds = alarmMemberUserIds + user.userId + ","
            })
            alarmMessage.notifyUsers = alarmMemberUserIds.substring(0, alarmMemberUserIds.lastIndexOf(','))
            //保存通知人姓名
            await BuryPointAlarmMessageModel.create(alarmMessage);
            //更新卡片报警状态字段alarmStatus:1-报警，0-不报警
            let cardUpdate = {};
            cardUpdate.id = cardId
            cardUpdate.alarmStatus = 1
            cardUpdate.updateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            await BuryPointCardModel.update(cardId, cardUpdate);
            // 发出通知后，计数清零
            global.eventInfo.alarmInfoList[cardId][calcNameKey] = 0
        }else{
            //更新卡片报警状态字段alarmStatus:1-报警，0-不报警
            let cardUpdate = {};
            cardUpdate.id = cardId
            cardUpdate.alarmStatus = 0
            cardUpdate.updateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            await BuryPointCardModel.update(cardId, cardUpdate);
        }
    }
}

class CommonUpLog {
  static async checkStatus(ctx) {
    const eventInfo = global.eventInfo
    if (eventInfo.purchaseCodeValid !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("激活码失效了，请联系我们，微信号：webfunny2、webfunny_2020。", false)
      return false
    }
    if (eventInfo.logServerStatus !== true) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200("服务已暂停", false)
      return false
    }
  }

  
  /**
     * tracker/initCf
     * 漏斗初始化接口
     * @param ctx proojectId
     * @returns {Promise.<void>}
     * [
             {
                 "cardId": "123",
                 "stepList": ["1", "2", "3", "4", "5"]
             },
             {
                 "cardId": "456",
                 "stepList": ["1", "2", "3", "4", "5"]
             }
         ]
     */
      static async initFunnelConfig(ctx) {
          let resList = [];
          const params = ctx.request.body
          const { projectId } = params;
          //找到项目下所有页面，页面下漏斗的数据
          resList = await SdkReleaseController.getCardAndPointList(projectId);
          let ret = {};
          ret.interval = 5;
          ret.funnel = resList
          ctx.response.status = 200;
          ctx.body = statusCode.SUCCESS_200('success', ret);
      }
  
        /**
        * 上报接口
        * @param ctx
        * {"yong_hu_id":"123","ye_mian_biao_shi":"张三","user_id":"123213123","projectId":"event101","pointId":"3",
        * "weCustomerKey":"a2469694-008c-44f9-8c5d-28f0e019a21d-20220618HH213976",
        * "weUserId":"",
        * "weFirstStepDay":"10-20220618,11-20220618,"}
        * @returns 
        *   [
                {
                    "cardId": "123",
                    "stepList": ["1", "2", "3", "4", "5"]
                },
                {
                    "cardId": "456",
                    "stepList": ["1", "2", "3", "4", "5"]
                }
            ]
        */
        static async upEvent(ctx) {
            // 进来一个日志，全局变量加1
            global.eventInfo.logCountInMinute ++
    
            //激活码到期，停止上报
            const eventInfo = global.eventInfo
            if (eventInfo.purchaseCodeValid !== true) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.INVALID_MSG1)}`, false)
                return
            }
            let req = ctx.request.body.data
            let params;
            let clientIpString = ctx.req.headers['x-forwarded-for'] ||
            ctx.req.connection.remoteAddress ||
            ctx.req.socket.remoteAddress ||
            ctx.req.connection.socket.remoteAddress;
            // 有可能会有多个ip，需要进行拆分，如果：10.33.113.46, 60.12.11.49
            const tempIpArr = clientIpString.replace(/\s+/g, "").split(",")
            if (tempIpArr.length > 1) {
                clientIpString = tempIpArr[tempIpArr.length - 1]
            } else {
                clientIpString = tempIpArr[0]
            }
            
            if (req) {
                params = Utils.logParseJson(req)
            } else {
                params = Utils.logParseJson(ctx.request.body)
            }
            params.weIp = clientIpString
            params.weCountry = ""
            params.weProvince = ""
            params.weCity = ""
            // 根据IP地址获取位置
            try {
                const res = await searcher.btreeSearchSync(clientIpString || "255.255.255.255")
                if (res) {
                    const { region } = res
                    const locationArray = region.split("|")
                    params.weCountry = locationArray[0] || "中国"
                    params.weProvince = locationArray[2] || "未知"
                    params.weCity = locationArray[3] || "未知"
                }
            } catch(e) {
                log.printError(`IP定位失败${clientIpString}：`, e)
            }
            //上报
            const { projectId, pointId } = params;
            let errMessage = '';
            //console.log("上报参数：" + JSON.stringify(ctx.request.body));
            try {
                //验证参数必传
                // 这个位置决定是否放入到消息队列中
                const { messageQueue } = accountInfo
                if (messageQueue === true && global.eventInfo.purchaseCodeType !== 50) {
                    //数据放到消息队列中
                    const logInfoMsg = JSON.stringify(params)
                    sendMq.sendQueueMsg("upload_log_event", logInfoMsg, (res) => {
    
                    }, (error) => {
                        log.printError("消息队列推送报错: " , error)
                    })
                } else {
                    //处理上报数据
                    CommonUpLog.handleUpEventData(params);
                } 
            } catch(e) {
                const logMsg = typeof errMessage == "object" ? JSON.stringify(errMessage) : errMessage
                log.printError("上报接口报错")
                log.printError(logMsg)
                log.printError("堆栈 -- ", e)
            }finally{
                //找到项目下所有页面，页面下漏斗的数据
                //调整从缓存取
                let resList = await SdkReleaseController.getCardAndPointList(projectId);
                let ret = {};
                ret.interval = 5;
                ret.funnel = resList
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.UPEVENT_SUCCESS)}`, ret)
            }
        }

        /**
     * 批量上报，接受数组
     * [
     * {"yong_hu_id":"123","ye_mian_biao_shi":"张三","user_id":"123213123","projectId":"event101","pointId":"3",
        *    "weCustomerKey":"a2469694-008c-44f9-8c5d-28f0e019a21d-20220618HH213976",
        *    "weUserId":"",
        *    "weFirstStepDay":"10-20220618,11-20220618,"},
        *  {"yong_hu_id":"123","ye_mian_biao_shi":"张三","user_id":"123213123","projectId":"event101","pointId":"3",
        *   "weCustomerKey":"a2469694-008c-44f9-8c5d-28f0e019a21d-20220618HH213976",
        *   "weUserId":"",
        *   "weFirstStepDay":"10-20220618,11-20220618,"}
        * ]
        * @param {*} ctx 
        */
        static async upEvents(ctx) {
            // 进来一个日志，全局变量加1
            global.eventInfo.logCountInMinute ++
            //激活码到期，停止上报
            const eventInfo = global.eventInfo
            if (eventInfo.purchaseCodeValid !== true) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.INVALID_MSG1)}`, false)
                return
            }
            let req = ctx.request.body.data
            let params;
            let clientIpString = ctx.req.headers['x-forwarded-for'] ||
            ctx.req.connection.remoteAddress ||
            ctx.req.socket.remoteAddress ||
            ctx.req.connection.socket.remoteAddress;
            // 有可能会有多个ip，需要进行拆分，如果：10.33.113.46, 60.12.11.49
            const tempIpArr = clientIpString.replace(/\s+/g, "").split(",")
            if (tempIpArr.length > 1) {
                clientIpString = tempIpArr[tempIpArr.length - 1]
            } else {
                clientIpString = tempIpArr[0]
            }
            
            if (req) {
                params = Utils.logParseJson(req)
            } else {
                params = Utils.logParseJson(ctx.request.body)
            }
            //数组
            let weCountry = ""
            let weProvince = ""
            let weCity = ""
            // 根据IP地址获取位置
            try {
                const res = await searcher.btreeSearchSync(clientIpString || "255.255.255.255")
                if (res) {
                    const { region } = res
                    const locationArray = region.split("|")
                    weCountry = locationArray[0] || "中国"
                    weProvince = locationArray[2] || "未知"
                    weCity = locationArray[3] || "未知"
                }
            } catch(e) {
                log.printError(`IP定位失败${clientIpString}：`, e)
            }
            params.forEach((param) => {
                param.weIp = clientIpString
                param.weCountry = weCountry
                param.weProvince = weProvince
                param.weCity = weCity
            })
            //上报
            let errMessage = '';
            try {
                //验证参数必传
                // 这个位置决定是否放入到消息队列中
                const { messageQueue } = accountInfo
                if (messageQueue === true && global.eventInfo.purchaseCodeType !== 50) {
                    //数据放到消息队列中
                    params.forEach((param) => {
                        const logInfoMsg = JSON.stringify(param)
                        sendMq.sendQueueMsg("upload_log_event", logInfoMsg, (res) => {

                        }, (error) => {
                            log.printError("消息队列推送报错: " , error)
                        })
                    })
                } else {
                    //处理上报数据
                    params.forEach((param) => {
                        CommonUpLog.handleUpEventData(param);
                    })
                } 
            } catch(e) {
                const logMsg = typeof errMessage == "object" ? JSON.stringify(errMessage) : errMessage
                log.printError("上报接口报错")
                log.printError(logMsg)
                log.printError("堆栈 -- ", e)
            }finally{
                //找到项目下所有页面，页面下漏斗的数据
                // let resList = await SdkReleaseController.getCardAndPointList(projectId);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.UPEVENT_SUCCESS)}`, '')
            }
        }

        /**
         * 处理上报数据
         * param:projectId 项目id
         * param:pointId 点位id
         */
        static async handleUpEventData(params) {
            const { projectId, pointId } = params;
            if (!pointId) {
                let failLogPoint = {}
                failLogPoint.projectId = projectId
                failLogPoint.message = "点位id(" + pointId + ")为空"
                failLogPoint.params = JSON.stringify(params);
                BuryPointFailLogModel.create(failLogPoint);
                return
            }
            if (!projectId) {
                let failLogPoint = {}
                failLogPoint.pointId = pointId
                failLogPoint.message = "项目id(" + projectId + ")为空"
                failLogPoint.params = JSON.stringify(params);
                BuryPointFailLogModel.create(failLogPoint);
                return
            }
            for (const key in params) {
                const element = params[key];
                const parseElement = parseInt(element, 10)
    
                if (!Utils.checkFieldNameValid(key)) {
                    continue
                } else if (!isNaN(parseElement) && typeof parseElement === "number") {
                    continue
                }
                try {
                    let tempParamValue = Utils.b64DecodeUnicode(element);
                    // 判断sql注入
                    let flag = true
                    for (let i = 0; i < DANGER_SQL_PARAMS.length; i ++) {
                        let dangerItem = DANGER_SQL_PARAMS[i]
                        if (tempParamValue.indexOf(dangerItem) !== -1) {
                            //flag = false
                            //break
                        }
                    }
                    params[key] = flag === true ? tempParamValue : "拦截"
                } catch(e) {
                    log.printError(e)
                    params[key] = element
                }
            }
            //上报
            //查询点位和字段信息，从缓存中取，没有就取数据库，然后放缓存
            let weType;
            let finalFieldList = [];
            if(global.eventInfo.pointAndFields[pointId]){
              weType = global.eventInfo.pointAndFields[pointId].weType
              finalFieldList = global.eventInfo.pointAndFields[pointId].finalFieldList
            }else{
              const pointInfo = await BuryPointWarehouseModel.detail(pointId);
              if(!pointInfo){
                log.printError("点位id(" + pointId + ")" + "不存在!");

                let failLogPoint = {}
                failLogPoint.projectId = projectId
                failLogPoint.pointId = pointId
                failLogPoint.message = "点位id(" + pointId + ")" + "不存在!"
                failLogPoint.params = JSON.stringify(params);
                BuryPointFailLogModel.create(failLogPoint);

                return;
              }
              weType = pointInfo.weType
              let buryPointFields = await BuryPointFieldModel.getSomeListByProjectIdAndWeType(pointInfo.fields,'','')
              if(weType && (weType ===2||weType === '2')){
                  //获取项目字段
                  finalFieldList = buryPointFields
              }else{
                  // 获取通用字段
                  const weFieldList = await BuryPointFieldModel.getSomeListByProjectIdAndWeType('',projectId,1);
                  finalFieldList = [...buryPointFields, ...weFieldList]
              }
              const pointAndFields = global.eventInfo.pointAndFields
              let pointData = {}
              pointData.finalFieldList = finalFieldList
              pointData.pointId = pointId
              pointData.weType = weType
              pointAndFields[pointId] = pointData
            }
            let keys = "";
            let value = "(";
            let values = [];
            let tableName = Utils.setTableName(projectId + "_" + pointId + "_", 0);
            for (let j = 0; j < finalFieldList.length; j++) {
                const field = finalFieldList[j];
                const { fieldName, fieldAlias,fieldType, fieldLength, weType } = field
                //非通用字段必传
                if (weType === 0 && (params[fieldName] === undefined)) {
                    log.printError(fieldAlias + "(" + fieldName + ")" + "字段必传!")
                    
                    let failLogPoint = {}
                    failLogPoint.projectId = projectId
                    failLogPoint.pointId = pointId
                    failLogPoint.message = fieldAlias + "(" + fieldName + ")" + "字段必传!"
                    failLogPoint.params = JSON.stringify(params);
                    BuryPointFailLogModel.create(failLogPoint);  
                } else if(weType === 0 && ((params[fieldName]+"").length > fieldLength)) {
                    //TODO 长度校验
                    log.printError(fieldAlias + "(" + fieldName + ")" + "超过字段长度" + fieldLength + "!")
                        
                    let failLogPoint = {}
                    failLogPoint.projectId = projectId
                    failLogPoint.pointId = pointId
                    failLogPoint.message = fieldAlias + "(" + fieldName + ")" + "超过字段长度" + fieldLength + "!"
                    failLogPoint.params = JSON.stringify(params);
                    BuryPointFailLogModel.create(failLogPoint);
                }
                
                //兼容自定义上报
                if (params[fieldName] === undefined) {
                    if (fieldType === 'VARCHAR') {
                        keys = keys + fieldName + ",";
                        value = value + "'',";
                    }else {
                        keys = keys + fieldName + ",";
                        value = value + "0,";
                    }
                }else {
                    keys = keys + fieldName + ",";
                    value = value + "'" + params[fieldName] + "',";
                }
            }
            //备用点位（老点位）处理逻辑
            if(weType && (weType ===2||weType === '2')){
                 //通用字段上报
                if (params["weCustomerKey"]) {
                    keys = keys + "weCustomerKey" + ",";
                    value = value + "'" + params["weCustomerKey"] + "',";
                }
                if (params["weUserId"]) {
                    keys = keys + "weUserId" + ",";
                    value = value + "'" + params["weUserId"] + "',";
                }
            }
            //漏斗新加字段解析：
            //"weFirstStepDay":"10-20220618,11-20220618,"
            //10-20220618：10表示cardId，20220618表示第一次访问时间
            if (params["weFirstStepDay"]) {
                //放到map存("10","20220618")
                let weFirstStepDayList = [];
                let weFirstStepDayArr = params["weFirstStepDay"].split(",");
                for (let i = 0; i < weFirstStepDayArr.length - 1; i++) {
                    let weFirstStepDayInfo = {}
                    weFirstStepDayInfo.cardId = parseInt(weFirstStepDayArr[i].split("-")[0], 10);
                    weFirstStepDayInfo.date = weFirstStepDayArr[i].split("-")[1];
                    weFirstStepDayList.push(weFirstStepDayInfo);
                }
                //获取点位关系表
                let cardIndexRes = await BuryPointRelationModel.getListByPointIdAndCardId(pointId, "");
                for (let i = 0; i < weFirstStepDayList.length; i++) {
                    for (let j = 0; j < cardIndexRes.length; j++) {
                        if (cardIndexRes[j].cardId === weFirstStepDayList[i].cardId) {
                            keys = keys + "weFirstStepDay_" + cardIndexRes[j].stepColum + ",";
                            value = value + "'" + weFirstStepDayList[i].date + "',";
                            break;
                        }
                    }
                }
            }
            keys = keys + "createdAt";
            value = value + "'" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "')";
            // console.log("keys:" + keys);
            values.push(value);
            // console.log("values:" + JSON.stringify(values));
            // SdkReleaseModel.saveValues(tableName, keys, values);
            params.tableName = tableName
            params.keys = keys
            params.values = values
            params.happenTime = new Date().Format("yyyy-MM-dd hh:mm:ss")
            //批量上报
            CommonUpLog.selectLogInfoIntoQueue(params, '', "")
        }
  
  
     /**
     * 处理日志，判断是否要放入到队列中
     * @param pointId 日志类型 如：点位ID
     * @param logInfo 日志对象
     * @param insertFunForOne 单个插入的方法名
     * @param insertFunForMulti 批量插入的方法名
     */
     static async selectLogInfoIntoQueue(logInfo, insertFunForOne, insertFunForMulti) {
      const { batchInsert } = accountInfo
      const { limitQueueLength } = batchInsert
      if (!global.eventInfo.lastRecordTime) {
        global.eventInfo.lastRecordTime = new Date().getTime()
      }
      const projectId = logInfo.projectId
      const pointId = logInfo.pointId
      const logInfoQueue = global.eventInfo.logInfoQueue
      // 如果不是今天的日志，就直接丢弃，
      let happenDateStr = logInfo.happenTime.substring(0, 10)
      let currentDateStr = new Date().Format("yyyy-MM-dd")
      if (happenDateStr !== currentDateStr) {
        // await tempModel[insertFunForOne](logInfo);
        return
      }
      // 日志进队列操作
      if (!logInfoQueue[projectId]) {
        logInfoQueue[projectId] = {}
      }
  
      if (!logInfoQueue[projectId][pointId]) {
        logInfoQueue[projectId][pointId] = []
      }
      // 如果队列数量小于上限，并且还没到时间上限，就添加到数组中，否则就立即上报
      if (logInfoQueue[projectId][pointId].length < limitQueueLength) {
        let tableName = logInfo.tableName
        let keys =  logInfo.keys
        let values = logInfo.values
        let logData = {}
        logData.tableName = tableName
        logData.keys = keys
        logData.values = values
        logInfoQueue[projectId][pointId].push(logData)
      } else {
        // let currentInfoArray = logInfoQueue[projectId][pointId]
        let tableName = logInfo.tableName
        let keys =  logInfo.keys
        let values = logInfo.values
        SdkReleaseModel.saveValues(tableName, keys, values);
        global.eventInfo.lastRecordTime = new Date().getTime()
        logInfoQueue[projectId][pointId] = []
      }
    }
  
    /**
     * 每隔10s中会调用此方法
     * 开始消费内存中的日志信息
     */
    static async handleLogInfoQueue() {
      const logInfoQueue = global.eventInfo.logInfoQueue
      for (let projectId in logInfoQueue) {
        let tempLogInfo = logInfoQueue[projectId]
        for (let pointId in tempLogInfo) {
          if (tempLogInfo[pointId]) {
            let logInfoValues = []
            let logInfoTableName = "";
            let logInfoKeys = "";
            for (let logData in tempLogInfo[pointId]) {
              if (logData) {
                const {tableName, keys, values } =  tempLogInfo[pointId][logData]
                logInfoTableName = tableName
                logInfoKeys = keys
                logInfoValues.push(values)
              }
            }
            if(logInfoTableName && logInfoKeys && logInfoValues.length > 0){
              SdkReleaseModel.saveValues(logInfoTableName, logInfoKeys, logInfoValues)
            }
          }
        }
        logInfoQueue[projectId] = []
      }
    }

}

class BuryPointCardStatisticsController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = JSON.parse(ctx.request.body);
        const {nickname} = ctx.user
        req.createBy = nickname
        if (req.pageId && req.cardId && req.cardName && req.count) {
            let ret = await BuryPointCardStatisticsModel.create(req);
            // let data = await BuryPointCardStatisticsModel.detail(ret.id);
            // ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL)}`)
        }
    }

    
    static async delete(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param
        // TODO,删除前，先检查所有点位仓库是否有该字段
        const res = await BuryPointCardStatisticsModel.getListByFieldId(id);
        if(res[0].count > 0){
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.STATISTIC_DELETE_FAIL)}`)
        }else {
            await BuryPointFieldModel.delete(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', "")
        }
    }

    static async getAllList(ctx) {
        const res = await BuryPointCardStatisticsModel.getAllList()
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
}

class BuryPointTaskController {

    /**
     * @swagger
     * /buryPointTask/create:
     *   post:
     *     tags:
     *       - 任务管理
     *     summary: 创建任务
     *     parameters:
     *       - name: taskName
     *         description: 任务名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: taskDes
     *         description: 任务描述
     *         in: formData
     *         required: false
     *         type: string
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: handleManId
     *         description: 处理人userId
     *         in: formData
     *         required: true
     *         type: string
     *       - name: handleManName
     *         description: 处理人名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: taskPoint
     *         description: 点位信息列表([{"pointId":3,"taskPointDes":"22222"},{"pointId":6,"taskPointDes":"22222"}])
     *         in: formData
     *         required: true
     *         type: array
     *       - name: taskStatus
     *         description: 任务状态
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async create(ctx) {
        let { taskName, taskDes = "", projectId, handleManId,handleManName,taskStatus, taskPoint } = JSON.parse(ctx.request.body);
        const {userId,nickname} = ctx.user
        // const userId = "dd1685b0-d530-11ec-9bd6-3d0b63aef8ce"
        // const nickname = "超级管理员"
        const data = {
            taskName, taskDes, projectId, handleManId, handleManName, taskStatus,
            createManId: userId,
            createManName: nickname,
            taskPoint: JSON.stringify(taskPoint),
        }
        if (taskName && projectId && handleManId) {
            // if(taskPoint && taskStatus !== '10'){
            //     let currDate = new Date().Format("yyyyMMddhhmmss");
            //     let releaseName = taskName + currDate
            //     let pointIds = []
            //     for(let i=0;i<taskPoint.length;i++){
            //         pointIds.push(taskPoint[i].pointId)
            //     }
            //     data.sdkId = await SdkReleaseController.createNewSdk(projectId,releaseName,pointIds,nickname)
            // }
            let res = await BuryPointTaskModel.create(data)
            
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, res)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
    }

    /**
     * @swagger
     * /buryPointTask/delete:
     *   post:
     *     tags:
     *       - 任务管理
     *     summary: 单个删除任务
     *     parameters:
     *       - name: taskId
     *         description: 任务ID
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async delete(ctx) {
        let {taskId} = JSON.parse(ctx.request.body);
        await BuryPointTaskModel.delete(taskId)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    /**
     * @swagger
     * /buryPointTask/batchDeletion:
     *   post:
     *     tags:
     *       - 任务管理
     *     summary: 批量删除任务
     *     parameters:
     *       - name: taskIds
     *         description: 任务ID列表，如："id1,id2,id3,id4,id5"
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async batchDeletion(ctx) {
        let { taskIds } = JSON.parse(ctx.request.body);
        if(taskIds){
            await BuryPointTaskModel.batchDeletion(taskIds)
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0)
    }
    
    /**
     * @swagger
     * /buryPointTask/update:
     *   post:
     *     tags:
     *       - 任务管理
     *     summary: 更新任务(存草稿、保存、发布任务)
     *     parameters:
     *       - name: taskId
     *         description: 任务ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: taskName
     *         description: 任务名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: taskDes
     *         description: 任务描述
     *         in: formData
     *         required: false
     *         type: string
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: handleManId
     *         description: 处理人userId
     *         in: formData
     *         required: true
     *         type: string
     *       - name: handleManName
     *         description: 处理人名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: taskPoint
     *         description: 点位信息列表([{"pointId":3,"taskPointDes":"22222"},{"pointId":6,"taskPointDes":"22222"}])
     *         in: formData
     *         required: true
     *         type: array
     *       - name: taskStatus
     *         description: 任务状态
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async update(ctx) {
        let req = JSON.parse(ctx.request.body);
        const {nickname} = ctx.user
        if (req.taskId && req.taskName && req.projectId && 
            req.taskPoint && req.handleManId && req.handleManName) {
            req.taskPoint = JSON.stringify(req.taskPoint)
            // if(req.taskPoint && req.taskStatus !== '10'){
            //     let currDate = new Date().Format("yyyyMMddhhmmss");
            //     let releaseName = req.taskName + currDate
            //     let pointIds = []
            //     for(let i=0;i<req.taskPoint.length;i++){
            //         pointIds.push(req.taskPoint[i].pointId)
            //     }
            //     req.sdkId = await SdkReleaseController.createNewSdk(req.projectId,releaseName,pointIds,nickname)
            // }
            let res = await BuryPointTaskModel.update(req)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_SUCCESS)}`, res)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_PARAM_FAIL)}`)
        }
    }

    /**
     * @swagger
     * /buryPointTask/list:
     *   post:
     *     tags:
     *       - 任务管理
     *     summary: 获取任务列表
     *     parameters:
     *       - name: taskType
     *         description: 任务类型 1：所有任务，2：我的任务，3：草稿箱
     *         in: formData
     *         required: false
     *         type: string
     *       - name: myTaskType
     *         description: 我的任务类型 1：所有和我相关的任务，2：我创建的，3：我处理的
     *         in: formData
     *         required: false
     *         type: string
     *       - name: taskName
     *         description: 任务名称
     *         in: formData
     *         required: false
     *         type: string
     *       - name: taskStatus
     *         description: 任务状态 10：草稿， 20：未完成（发布后）30：已完成（发布后）40：已结束
     *         in: formData
     *         required: false
     *         type: string
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: false
     *         type: string
     *       - name: handleManId
     *         description: 处理人userId
     *         in: formData
     *         required: false
     *         type: string
     *       - name: createManId
     *         description: 创建人userId
     *         in: formData
     *         required: false
     *         type: string
     *       - name: page
     *         description: 页数(从1开始)
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 每页显示数量
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: dateOrderby
     *         description: 按时间排序(降序desc,升序asc 默认降序)
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async list(ctx) {
        const params = JSON.parse(ctx.request.body)
        const res = await BuryPointTaskModel.list(params)
        const { list, total } = res
        for (let i = 0; i < list.length; i++) {
            const task = list[i]
            const { projectId, taskPoint} = task
            let projectInfo = await BuryPointProjectModel.getProjectByProjectId(projectId)
            const { name } = projectInfo[0]
            task.projectName = name;
            let points = [];
            if(taskPoint){
                let taskPointArry = JSON.parse(taskPoint);
                //[{"pointId":3,"taskPointDes":"22222"},{"pointId":6,"taskPointDes":"22222"}]
                for (let j = 0; j < taskPointArry.length; j++) {
                    let pointId = taskPointArry[j].pointId;
                    let buryPointWarehouse = await BuryPointWarehouseModel.detail(pointId)
                    const point = {}
                    point.pointName = buryPointWarehouse.pointName
                    point.pointId = pointId
                    point.taskPointDes = taskPointArry[j].taskPointDes
                    // let buryPointFieldList = await BuryPointFieldModel.getListByFieldIdsAndWeType(buryPointWarehouse.fields,0)
                    // point.fieldList = buryPointFieldList
                    points.push(point)
                }
            }
            task.points = points
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', { list, total })
    }

    /**
     * @swagger
     * /buryPointTask/detail:
     *   post:
     *     tags:
     *       - 任务管理
     *     summary: 任务详情
     *     parameters:
     *       - name: taskId
     *         description: 任务ID
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async detail(ctx) {
        let {taskId} = JSON.parse(ctx.request.body);
        const res = await BuryPointTaskModel.detail(taskId)
        const task = res.length ? res[0] : null
        const { projectId, taskPoint} = task
        let projectInfo = await BuryPointProjectModel.getProjectByProjectId(projectId)
        const { name } = projectInfo[0]
        task.projectName = name;
        let points = [];
        if(taskPoint){
            let taskPointArry = JSON.parse(taskPoint);
            //[{"pointId":3,"taskPointDes":"22222"},{"pointId":6,"taskPointDes":"22222"}]
            for (let j = 0; j < taskPointArry.length; j++) {
                let pointId = taskPointArry[j].pointId;
                let buryPointWarehouse = await BuryPointWarehouseModel.detail(pointId)
                const point = {}
                point.pointName = buryPointWarehouse.pointName
                point.pointId = pointId
                point.taskPointDes = taskPointArry[j].taskPointDes
                let buryPointFieldList = await BuryPointFieldModel.getListByFieldIdsAndWeType(buryPointWarehouse.fields,0)
                point.fieldList = buryPointFieldList
                points.push(point)
            }
        }
        task.points = points
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', task)
    }

    /**
     * @swagger
     * /buryPointTask/updateStatus:
     *   post:
     *     tags:
     *       - 任务管理
     *     summary: 更新任务状态（完成埋点，结束任务）
     *     parameters:
     *       - name: taskId
     *         description: 任务ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: taskStatus
     *         description: 任务状态  30：已完成、40：已结束
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async updateStatus(ctx) {
        let {taskId, taskStatus} = JSON.parse(ctx.request.body);
        const res = await BuryPointTaskModel.updateStatus(taskId, taskStatus)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
     * @swagger
     * /buryPointTask/changeHandleMan:
     *   post:
     *     tags:
     *       - 任务管理
     *     summary: 更改处理人
     *     parameters:
     *       - name: taskId
     *         description: 任务ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: handleManId
     *         description: 处理人的userId
     *         in: formData
     *         required: true
     *         type: string 
     *       - name: handleManName
     *         description: 处理人的名称
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async changeHandleMan(ctx) {
        let {taskId, handleManId, handleManName} = JSON.parse(ctx.request.body);
        const res = await BuryPointTaskModel.changeHandleMan(taskId, handleManId,handleManName)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }
}

class BuryPointCardController {

    /**
     * 判断卡片余额是否充足
     * @returns 
     */
    static async judgeCardCount(cardCount){
        const retCardCount = await BuryPointCardModel.getCountByNoSysType("");
        let totalCount = isNaN(retCardCount[0].count) ? 0 : retCardCount[0].count;
        const purchaseCodeCardCount = global.eventInfo.purchaseCodeCardCount || 10
        if ((parseInt(purchaseCodeCardCount, 10) - parseInt(totalCount, 10)) < parseInt(cardCount, 10)) {
            return 1;
        }
        return 0;
    }
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { nickname } = ctx.user
        req.createBy = nickname
        if(!req.pageId || req.pageId === '' || req.pageId === undefined){
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CARD_CREATE_NO_CHOICE_PAGE)}`)
            return
        }
        if (req.name && req.type && req.pageId && req.calcRule) {
            let pointAndStepNameList = [];
            //判断卡片余额
            let flag = await BuryPointCardController.judgeCardCount(1);
            if(flag === 1){
                ctx.response.status = 414;
                ctx.body = statusCode.ERROR_CARD_BALANCE_414("卡片余额不足")
                return
            }
            const res = await BuryPointCardModel.checkName(req.name, req.pageId);
            let count = res[0].count
            if (count > 0) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_CARD_NAME_EXIST)}`)
                return
            }
            const resMaxSort = await BuryPointCardModel.getCountPageId(req.pageId);
            let maxSort = isNaN(resMaxSort[0].maxSort) ? 0 : resMaxSort[0].maxSort;
            req.sort = parseInt(maxSort,10) + 1;
            let calcRule = req.calcRule;
            let newCalcRule = []
            //多折线图或者堆叠图或者地图是归类的话，只能有一个
            if (req.groupByFlag === 1 && (req.type === 2 || req.type === 4 || req.type === 7)
              && calcRule.length > 1) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CARD_CREATE_GROUP_FAIL)}`)
                return
            }
            //数值图的话话，最多只能有四个
            if (req.type === 6 && calcRule.length > 4) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CARD_CREATE_NUMBER_FAIL)}`)
                return
            }
            let groupByCount = 0;
            for (let i = 0; i < calcRule.length; i++) {
                const { calcName } = calcRule[i];
                let calcData = calcRule[i];
                //calcName为统计表calcField
                //calcNameKey为统计表calcFieldKey
                let calcNameKey = slugify(calcName).replace(/-/g, "") + new Date().Format("yyyyMMddhhmmss");
                calcData.calcNameKey = calcNameKey;
                if (req.type === 5) {
                    //漏斗图，默认计数字段是weCustomerKey或者weUserId，去重
                    // calcData.prePoint.calcField.fieldName = 'weCustomerKey';
                    if(!calcData.prePoint.calcField.fieldName){
                        calcData.prePoint.calcField.fieldName = 'weCustomerKey';
                    }
                    pointAndStepNameList.push(calcData.prePoint.pointId);
                }
                if(calcData.prePoint.calcField.isRepeat === '4' || calcData.prePoint.calcField.isRepeat === '5'){
                    groupByCount = groupByCount + 1;
                }
                newCalcRule.push(calcData);
            }
            if (calcRule.length > 1 && groupByCount >=1) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CARD_CREATE_GROUP_FAIL)}`)
                return
            }
            if (calcRule.length === 1 && groupByCount === 1) {
                req.groupByFlag = 1
            }
            req.calcRule = JSON.stringify(newCalcRule);
            req.updatedAt = new Date().Format("yyyy-MM-dd hh:mm:ss");
            req.alarmMembers = JSON.stringify(req.alarmMembers);
            req.noticeWay = JSON.stringify(req.noticeWay);
            let ret = await BuryPointCardModel.create(req);
            if (ret) {
                if (req.type === 5) {
                    BuryPointCardController.saveFunnelPointRelation(pointAndStepNameList, ret.id);
                }
                //统计配置文件里面存储的天数
                let countDay = parseInt(accountInfo.saveDays, 10)
                if (countDay > 10) {
                    countDay = 10
                }
                for (let day = 0; day < countDay; day++) {
                    if(req.type && req.type === 5){
                        //漏斗图计算
                        TimerStatisticController.calculateFunnelDataByCard(ret, (-1) * day,1);
                    } else {
                        //非漏斗图计算
                        if(req.groupByFlag && req.groupByFlag === 1){
                            TimerStatisticController.calculateNoFunnelGroupByDataByCard(ret, (-1) * day,1);
                        }else {
                            TimerStatisticController.calculateNoFunnelDataByCard(ret, (-1) * day,1);
                        }
                    }
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
    }

    /**
     * 单个卡片移动到其他分组
     * {
         "id":1, //卡片id
         "pageId":1, //"看板ID"
         "projectId":1 //"项目ID"
        }
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async moveCard(ctx) {
        let req = JSON.parse(ctx.request.body);  
        const {id,pageId,projectId}  = req
        const { nickname } = ctx.user
        if (id && pageId && projectId) {
            const resMaxSort = await BuryPointCardModel.getCountPageId(req.pageId);
            let maxSort = isNaN(resMaxSort[0].maxSort) ? 0 : resMaxSort[0].maxSort;
             //分析统计表改变pageId
             let cardUpdate ={}
             cardUpdate.pageId = pageId
             cardUpdate.updateBy = nickname
             cardUpdate.sort = parseInt(maxSort,10) + 1;
            await BuryPointCardModel.update(id, cardUpdate);
            //分析统计表改变pageId
            let statisticUpdate ={}
            statisticUpdate.pageId = pageId
            statisticUpdate.updateBy = nickname
            await BuryPointCardStatisticsModel.updateByCard(id, statisticUpdate);
            //统计分析表
            let tableNameGroubBy = "BuryPointCardStatistics_" + projectId;
            await BuryPointCardStatisticsModel.updateStatisticByCard(tableNameGroubBy,id, pageId);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '');
        } else {               
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
        }
    }

     /**
     * 复制卡片
     * 同一个项目下的
     * 选择分组-->选择看板
     * {
     *   "cardId":2,//要复制的卡片id
     *   "cardName":"卡片名称",
     *   "pageId":1 //看板id
     * }
     */
    /**
     * @swagger
     * /buryPointCard/card/copy:
     *   post:
     *     tags:
     *       - 项目管理
     *     summary: 复制卡片
     *     parameters:
     *       - name: cardId
     *         description: 要复制的卡片id
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: cardName
     *         description: 卡片名称
     *         in: formData
     *         required: true
     *         type: string    
     *       - name: pageId
     *         description: 看板id
     *         in: formData
     *         required: true
     *         type: integer    
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
     static async copyCard(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { nickname } = ctx.user
        req.createBy = nickname
        if (req.cardId && req.cardName && req.pageId) {
            //判断卡片余额
            let flag = await BuryPointCardController.judgeCardCount(1);
            if(flag === 1){
                const purchaseCodeCardCount = global.eventInfo.purchaseCodeCardCount || 10
                ctx.response.status = 414;
                ctx.body = statusCode.ERROR_CARD_BALANCE_414("卡片余额不足")
                return
            }
            const res = await BuryPointCardModel.checkName(req.cardName, req.pageId);
            let count = res[0].count
            if (count > 0) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_CARD_NAME_EXIST)}`)
                return
            }
            let cardInfo = await BuryPointCardModel.detail(req.cardId);
            const resMaxSort = await BuryPointCardModel.getCountPageId(req.pageId);
            let maxSort = isNaN(resMaxSort[0].maxSort) ? 0 : resMaxSort[0].maxSort;
            req.sort = parseInt(maxSort,10) + 1;
            req.type = cardInfo.type;
            req.name = req.cardName;
            req.calcRule = cardInfo.calcRule;
            req.conversionCycle = cardInfo.conversionCycle;
            req.groupByFlag = cardInfo.groupByFlag;
            req.chartTableShow = cardInfo.chartTableShow;
            req.togetherList = cardInfo.togetherList;
            req.refreshFrequency = cardInfo.refreshFrequency;
            req.alarmMembers = cardInfo.alarmMembers;
            req.noticeWay = cardInfo.noticeWay;
            req.updatedAt = new Date().Format("yyyy-MM-dd hh:mm:ss");
            let ret = await BuryPointCardModel.create(req);
            let calcRule = JSON.parse(cardInfo.calcRule)
            if (ret) {
                if (req.type === 5) {
                    let pointAndStepNameList = []
                    for (let i = 0; i < calcRule.length; i++) {
                        pointAndStepNameList.push(calcRule[i].prePoint.pointId);
                    }
                    BuryPointCardController.saveFunnelPointRelation(pointAndStepNameList, ret.id);
                }
                //统计配置文件里面存储的天数
                let countDay = parseInt(accountInfo.saveDays, 10)
                if (countDay > 10) {
                    countDay = 10
                }
                for (let day = 0; day < countDay; day++) {
                    if(req.type && req.type === 5){
                        //漏斗图计算
                        TimerStatisticController.calculateFunnelDataByCard(ret, (-1) * day, 1);
                    } else {
                        //非漏斗图计算
                        if(req.groupByFlag && req.groupByFlag === 1){
                            TimerStatisticController.calculateNoFunnelGroupByDataByCard(ret, (-1) * day, 1);
                        }else {
                            TimerStatisticController.calculateNoFunnelDataByCard(ret, (-1) * day, 1);
                        }
                    }
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
    }

    static async delete(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param
        await BuryPointCardController.deleteById(id);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    /**
     * 批量删除卡片
     * ids:"1,2,3"
     * @param {*} ctx 
     */
    static async deleteBatch(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { ids } = param
        if(ids){
            let cardIdArray = ids.split(",")
            for (let i = 0;i<cardIdArray.length; i++){
                await BuryPointCardController.deleteById(cardIdArray[i]);
            }
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    /**
     * 根据id删除卡片
     * @param {*} id 
     */
    static async deleteById(id){
        let res = await BuryPointCardModel.detail(id);
        if (res) {
            //根据cardId，删除该页面所有点位关联关系
            BuryPointRelationModel.deleteByCardId(id);
            //删除所有统计数据
            BuryPointCardStatisticsModel.deleteByCardId(id,'');
            //TODO 删除BuryPointCardStatistics_项目id

            // 删除卡片
            await BuryPointCardModel.delete(id);

            //根据pageId，获取该页面所有卡片
            const resCards = await BuryPointCardModel.getListByPageIdAndSort(res.pageId, id);
            for (let i = 0; i < resCards.length; i++) {
                resCards[i].sort = i + 1;
                //更新卡片顺序
                BuryPointCardModel.update(resCards[i].id, resCards[i]);
            }
        }
    }

    static async detail(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        let id = param.id;
        let res = await BuryPointCardModel.detail(id)
        let cardDetail = {};
        cardDetail.id = res.id;
        cardDetail.pageId = res.pageId;
        cardDetail.type = res.type;
        cardDetail.name = res.name;
        cardDetail.calcRule = res.calcRule;
        cardDetail.sort = res.sort;
        cardDetail.conversionCycle = res.conversionCycle;//窗口期，默认1天
        cardDetail.groupByFlag = res.groupByFlag;//是否归类图形，1-是，0-否
        cardDetail.chartTableShow = res.chartTableShow;//图表展示：chart-图\table-表格\trend-趋势（漏斗）
        cardDetail.togetherList = res.togetherList;//合计-total、均值-average、同比-yoyRatio、环比-ringRatio
        cardDetail.refreshFrequency = res.refreshFrequency;//调用刷新接口频率，5s，10s，20s等
        cardDetail.alarmStatus = res.alarmStatus;//告警状态
        cardDetail.noticeWay = res.noticeWay;//告警方式
        cardDetail.alarmMembers = res.alarmMembers;//告警通知人
        if(res.type === 5){//漏斗图，返回计数ID
            let calculateId = "weCustomerKey"
            const calcRuleArr = JSON.parse(res.calcRule)
            calculateId = calcRuleArr[0].prePoint.calcField.fieldName
            cardDetail.calculateId = calculateId
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', cardDetail)
    }

    /**
     * 更新
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async update(ctx) {
        let req = JSON.parse(ctx.request.body);
        let id = req.id;
        const {nickname} = ctx.user
        req.updateBy = nickname
        if(!req.pageId || req.pageId === '' || req.pageId === undefined){
            let res = await BuryPointCardModel.detail(id);
            req.pageId = res.pageId
        }
        if (req) {
            //首先要更新的分析规则和数据库的作比较
            let cardDetail = await BuryPointCardModel.detail(id);
            let calcRule = req.calcRule;
            let alarmMembers = req.alarmMembers;
            let noticeWay = req.noticeWay;
            req.alarmMembers = JSON.stringify(alarmMembers);
            req.noticeWay = JSON.stringify(noticeWay);
            //a、给的json数据和存的数据一样，不更新，也不删除关系，什么也不用做，直接return
            //去掉alarmId在比较
            if(Utils.equalsObj(JSON.stringify(calcRule),cardDetail.calcRule)){
                req.calcRule = JSON.stringify(calcRule)
                await BuryPointCardModel.update(id, req);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_SUCCESS)}`, req);
                return
            }else{
            //b、给的json数据和存的数据不一样：
                let pointIdsUpdate = [];
                let pointIdsExiste = [];
                let pointAndStepNameList = [];
                let pointsUpdate = [];
                let pointsExiste = [];
                let pointsUpdateList = [];
                let pointsExisteList = [];
                let deleteCalcNameKeyList = [];
                for (let i = 0; i < calcRule.length; i++) {
                    pointIdsUpdate.push(calcRule[i].prePoint.pointId);
                    if (req.type === 5) {
                        pointAndStepNameList.push(calcRule[i].prePoint.pointId);
                    }
                    if(calcRule[i].calcNameKey){
                        let pointUpdate = {};
                        pointUpdate.calcNameKey = calcRule[i].calcNameKey
                        pointUpdate.calcLength = JSON.stringify(calcRule[i].prePoint).length + (calcRule[i].endPoint?JSON.stringify(calcRule[i].endPoint).length:0)
                        pointsUpdate.push(pointUpdate);
                        pointsUpdateList.push(calcRule[i].calcNameKey)
                    }
                }
                let calcRuleExiste = JSON.parse(cardDetail.calcRule)
                for (let i = 0; i < calcRuleExiste.length; i++) {
                    pointIdsExiste.push(calcRuleExiste[i].prePoint.pointId);
                    let pointExiste = {};
                    pointExiste.calcNameKey = calcRuleExiste[i].calcNameKey
                    pointExiste.calcLength = JSON.stringify(calcRuleExiste[i].prePoint).length + (calcRuleExiste[i].endPoint?JSON.stringify(calcRuleExiste[i].endPoint).length:0)
                    pointsExiste.push(pointExiste);
                    pointsExisteList.push(calcRuleExiste[i].calcNameKey)
                }
                //去掉重复pointId
                let pointIdsUpdateSetArr = [...new Set(pointIdsUpdate)];
                let pointIdsExisteSetArr = [...new Set(pointIdsExiste)];
                if (req.type === 5 && !Utils.equalsObj(pointIdsUpdateSetArr,pointIdsExisteSetArr)) {
                    //1>点位id和顺序是一样的，查询条件不一样，保存json，但是不删除关系，清除数据（所有分析数据）
                    //2>其他都要删除关系，清除数据（所有分析数据）
                    //根据cardId，删除该页面所有点位关联关系，然后重新生成
                    await BuryPointRelationModel.deleteByCardId(id);
                    await BuryPointCardController.saveFunnelPointRelation(pointAndStepNameList, id);
                }
                //要不要删除所有统计数据,如果计算规则数据(prePoint和endPoint)有变化,目前是比较长度，长度一样就不删除
                deleteCalcNameKeyList = Utils.getArrDifference(pointsUpdateList,pointsExisteList);//1、找到不一样的key
                for(let i = 0; i < pointsExiste.length; i++){
                    for(let j = 0; j < pointsUpdate.length; j++){
                        if(pointsUpdate[j].calcNameKey === pointsExiste[i].calcNameKey){
                            if(pointsUpdate[j].calcLength !== pointsExiste[i].calcLength){//2、长度不一样
                                deleteCalcNameKeyList.push(pointsExiste[i].calcNameKey);  
                            }
                        }else{
                            continue
                        }
                    }
                }
                if(deleteCalcNameKeyList.length>0){
                    await BuryPointCardStatisticsModel.deleteByCardId(id,deleteCalcNameKeyList); 
                }
            }
            let newCalcRule = []
            let groupByCount = 0;
            for (let i = 0; i < calcRule.length; i++) {
                const { calcName, calcNameKey } = calcRule[i];
                let calcData = calcRule[i];
                //如果有两个一样的calcNameKey，就重命名一个calcNameKey
                //calcName为统计表calcField
                //calcNameKey为统计表calcFieldKey
                if (!calcNameKey || calcNameKey === '' || calcNameKey === undefined || calcNameKey === 'undefined') {
                    let calcNameKey = slugify(calcName).replace(/-/g, "") + new Date().Format("yyyyMMddhhmmss");
                    calcData.calcNameKey = calcNameKey;
                }
                if(calcData.prePoint.calcField.isRepeat === '4' || calcData.prePoint.calcField.isRepeat === '5'){
                    groupByCount = groupByCount + 1;
                }
                newCalcRule.push(calcData);
            }
            if (calcRule.length > 1 && groupByCount >= 1) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CARD_UPDATE_GROUP_FAIL)}`)
                return
            }
            //数值图的话，最多只能有四个
            if (req.type === 6 && calcRule.length > 4) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CARD_UPDATE_NUMBER_FAIL)}`)
                return
            }
            if (calcRule.length === 1 && groupByCount === 1) {
                req.groupByFlag = 1
            }
            req.calcRule = JSON.stringify(newCalcRule);
            await BuryPointCardModel.update(id, req);
            //统计配置文件里面存储的天数，只会统计分析前十天的日志
            let countDay = parseInt(accountInfo.saveDays, 10)
            if (countDay > 10) {
                countDay = 10
            }
            for (let day = 0; day < countDay; day++) {
                if(req.type && req.type === 5){
                    //漏斗图计算
                    await TimerStatisticController.calculateFunnelDataByCard(req, (-1) * day, 1);
                } else {
                    //非漏斗图计算
                    if(req.groupByFlag && req.groupByFlag === 1){
                        TimerStatisticController.calculateNoFunnelGroupByDataByCard(req, (-1) * day, 1);
                    }else {
                        TimerStatisticController.calculateNoFunnelDataByCard(req, (-1) * day, 1);
                    }
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_SUCCESS)}`, req);
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_FAIL)}`)
        }
    }

    /**
     * 保存漏斗点位关系表
     * TODO: 
     * 1、更新卡片，给的json数据和存的数据一样，不更新，也不删除关系
     * @param {卡片类型} type 
     * @param {*} pointAndStepNameList 
     */
    static async saveFunnelPointRelation(pointAndStepNameList, cardId) {
        let pointSet = new Set(pointAndStepNameList);
        let pointSetArr = [...pointSet];
        for (let i = 0; i < pointSetArr.length; i++) {
            let pointId = pointSetArr[i];
            const pointIdStepColumRes = await BuryPointRelationModel.getListByPointIdAndCardId(pointId, cardId);
            if (pointIdStepColumRes.length === 1) {
                continue;
            } else {
                const pointIdStepColumList = await BuryPointRelationModel.getListByPointIdAndCardId(pointId, "");
                let stepColumList = [];
                let stepColumIndex = 1;
                for (let k = 0; k < pointIdStepColumList.length; k++) {
                    stepColumList.push(pointIdStepColumList[k].stepColum * 1);
                }
                for (let j = 1; j < 11; j++) {
                    if (stepColumList.indexOf(j) === -1) {
                        stepColumIndex = j;
                        break;
                    }
                }
                // if(!stepColumIndex){
                //     ctx.response.status = 412;
                //     ctx.body = statusCode.ERROR_412('【' + pointAndStepNameList[i].calcName + '】关联的点位不能超过十次！')
                //     return
                // }
                let buryPointRelation = {}
                buryPointRelation.pointId = pointId;
                buryPointRelation.stepColum = stepColumIndex;
                buryPointRelation.cardId = cardId;
                await BuryPointRelationModel.create(buryPointRelation);
            }
        }
    }

    /**
    * 刷新卡片，触发统计，达到实时效果
    * TODO 如果是系统项目的卡片，刷新
    * if(req.id === '1' || req.id === 1){
        let todayDate = new Date().Format("MM-dd");
        let refreshCardInfo = getRefreshCard;
        let calcData = refreshCardInfo.statisticList[0].calcData;
        calcData[calcData.length-1].happenDate = todayDate;
        calcData[calcData.length-1].count = Math.floor((Math.random()*1000)+1000);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('卡片刷新成功',refreshCardInfo)
    }
    * @param ctx
    * @returns {Promise.<void>}
    */
    static async refresh(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { nickname } = ctx.user
        req.updateBy = nickname
        if (req.id) {
            let id = req.id;
            //查询条件
            let dateValue = req.dateValue;
            let queryStartDate = req.queryStartDate;
            let queryEndDate = req.queryEndDate;
            let startDate;
            let endDate;
            const oneDayTime = 24 * 3600 * 1000;
            if (!dateValue && !queryStartDate && !queryEndDate){
                dateValue = '30';
            }
            if (dateValue) {
                const timestamp = new Date().getTime()
                let isOpenTodayStatistic = accountInfo.isOpenTodayStatistic;
                if (isOpenTodayStatistic) {
                    startDate = new Date(timestamp - (parseInt(dateValue, 10)) * oneDayTime).Format("yyyy-MM-dd")
                    endDate = new Date(timestamp).Format("yyyy-MM-dd") + " 23:59"
                } else {
                    startDate = new Date(timestamp - (parseInt(dateValue, 10) + 1) * oneDayTime).Format("yyyy-MM-dd")
                    endDate = new Date(timestamp - oneDayTime).Format("yyyy-MM-dd") + " 23:59"
                }
            } else {
                startDate = new Date(new Date(queryStartDate).getTime() - oneDayTime).Format("yyyy-MM-dd")
                endDate = queryEndDate + " 23:59"
            }
            let card = await BuryPointCardModel.detail(id);
            //触发今天(0)的分析统计数据
            if(card.type && card.type === 5){
                //漏斗图计算
                await TimerStatisticController.calculateFunnelDataByCard(card, 0, 2);
            } else {
                //非漏斗图计算
                if(card.groupByFlag && card.groupByFlag === 1){
                    await TimerStatisticController.calculateNoFunnelGroupByDataByCard(card, 0, 2);
                }else {
                    await TimerStatisticController.calculateNoFunnelDataByCard(card, 0, 2);
                }
            }
            let resCard;
            if(card.groupByFlag && card.groupByFlag === 1){
                resCard = await BuryPointCardController.convertGroupByCardStatisticInfo(card, 1,startDate, endDate);
            }else{
                resCard = await BuryPointCardController.convertCardStatisticInfo(card, startDate, endDate);
            }
            resCard.refreshTime = new Date().Format("yyyy-MM-dd hh:mm:ss");//卡片的更新刷新时间
            //更新卡片时间为刷新时间
            let updateCard = {};
            updateCard.id = id;
            updateCard.updateAt = resCard.refreshTime;
            BuryPointCardModel.update(id,updateCard);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.REFRESH_SUCCESS)}`, resCard);
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.REFRESH_FAIL)}`)
        }
    }

    /**
    * 归类卡片top几筛选查询
    * top10-1,
    * top30-2,
    * top50-3,
    * 无限-4
    * @param ctx
    * @returns {Promise.<void>}
    */
    static async groupByQuery(ctx) {
        let req = JSON.parse(ctx.request.body);
        if (req.id) {
            let id = req.id;
            //查询条件
            let dateValue = req.dateValue;
            let queryStartDate = req.queryStartDate;
            let queryEndDate = req.queryEndDate;
            let topValue = req.topValue;//top10-1,top30-2,top50-3,无限-4
            let startDate;
            let endDate;
            const oneDayTime = 24 * 3600 * 1000;
            if (!dateValue && !queryStartDate && !queryEndDate){
                dateValue = '30';
            }
            if (dateValue) {
                const timestamp = new Date().getTime()
                let isOpenTodayStatistic = accountInfo.isOpenTodayStatistic;
                if (isOpenTodayStatistic) {
                    startDate = new Date(timestamp - (parseInt(dateValue, 10)) * oneDayTime).Format("yyyy-MM-dd")
                    endDate = new Date(timestamp).Format("yyyy-MM-dd") + " 23:59"
                } else {
                    startDate = new Date(timestamp - (parseInt(dateValue, 10) + 1) * oneDayTime).Format("yyyy-MM-dd")
                    endDate = new Date(timestamp - oneDayTime).Format("yyyy-MM-dd") + " 23:59"
                }
            } else {
                startDate = new Date(new Date(queryStartDate).getTime() - oneDayTime).Format("yyyy-MM-dd")
                endDate = queryEndDate + " 23:59"
            }
            let card = await BuryPointCardModel.detail(id);
            let resCard = await BuryPointCardController.convertGroupByCardStatisticInfo(card, topValue, startDate, endDate);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', resCard);
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
        }
    }

    /**
     * 导出卡片表格形式
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async export(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        const { id, pageId, cardName, type, dateValue,topValue, queryStartDate, queryEndDate } = param;
        let startDate;
        let endDate;
        const oneDayTime = 24 * 3600 * 1000
        if (!dateValue && !queryStartDate && !queryEndDate){
            dateValue = '30';
        }
        if (dateValue) {
            const timestamp = new Date().getTime()
            let isOpenTodayStatistic = accountInfo.isOpenTodayStatistic;
            if (isOpenTodayStatistic) {
                startDate = new Date(timestamp - (parseInt(dateValue, 10)) * oneDayTime).Format("yyyy-MM-dd")
                endDate = new Date(timestamp).Format("yyyy-MM-dd") + " 23:59"
            } else {
                startDate = new Date(timestamp - (parseInt(dateValue, 10) + 1) * oneDayTime).Format("yyyy-MM-dd")
                endDate = new Date(timestamp - oneDayTime).Format("yyyy-MM-dd") + " 23:59"
            }
        } else {
            startDate = new Date(new Date(queryStartDate).getTime() - oneDayTime).Format("yyyy-MM-dd")
            endDate = queryEndDate + " 23:59"
        }
        let dateList = Utils.splitDate(startDate, endDate);
        // 查询该页面对应所有卡片，
        const card = await BuryPointCardModel.detail(id);
        const cardRes = {}
        cardRes.cardId = id;
        cardRes.type = card.type;//卡片类型：1-柱状图，2-多折线，3-柱线图，4-堆叠图，5-漏斗图
        cardRes.cardName = card.name;
        let statisticData = [];
        const calcRuleArr = JSON.parse(card.calcRule)
        const dateArray = [];//数量列表
        const datePercentageArray = [];//百分比列表
        var title = ['日期'] //这是第一行 俗称列名
        //堆叠图、多折线图、地图才有归类统计
        if ((card.type === 2 || card.type === 4 || card.type === 7) && 
            (card.groupByFlag && card.groupByFlag === 1)) {
            //通过pageId查询项目获取项目id（event101）
            let projectInfo = await BuryPointProjectModel.detail(pageId);
            const { projectId } = projectInfo;
            //分析表名
            let statiscTableName = "BuryPointCardStatistics_" + projectId;
            statisticData = await BuryPointCardController.getGroupByCardStatistic(id, pageId, statiscTableName, topValue,title, dateList, startDate, endDate)
        }else{
            //按照保存的JSON规则，处理数据
            statisticData = await BuryPointCardController.handleExportStatiscData(card.type,calcRuleArr, 
                pageId, id,startDate, endDate, title, dateList);
        }
        //如果是漏斗图，计算每一步查询时间段的统计总数
        if (card.type && card.type === 5) {
            await BuryPointCardController.calcFunnelConversionRate(statisticData)
        }
        cardRes.statisticList = statisticData;
        dateArray.push(title);
        //如果是漏斗图，个数放一个sheet里面，百分比放一个sheet里面
        if(card.type && card.type === 5){
            datePercentageArray.push(title);
        }
        dateList.forEach((date, dateIndex) => {
            var arrInner = [];
            var arrPerInner = [];
            title.forEach((titleStr, titleIndex) => {
                if (titleStr === '日期') {
                    arrInner.push(date);
                    arrPerInner.push(date);
                } else {
                    cardRes.statisticList.forEach((item, itemIndex) => {
                        if (item.calcName === titleStr) {
                            item.calcData.forEach((calcDatatItem, calcDataIndex) => {
                                if (calcDatatItem.happenDate === date) {
                                    arrInner.push(calcDatatItem.count * 1);
                                    if(card.type && card.type === 5){
                                        arrPerInner.push(itemIndex === 0?'100%':calcDatatItem.percentage + "%");
                                    }
                                }
                            });
                        }
                    });
                }
            });
            dateArray.push(arrInner); // data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
            if(card.type && card.type === 5){
                datePercentageArray.push(arrPerInner);
            }
        });
        var arrInner = [];
        arrInner.push("汇总");
        var arrPerInner = [];
        arrPerInner.push("汇总");
        statisticData.forEach((item, totalCountIndex) => {
            arrInner.push(item.calcTotail);
            arrPerInner.push(item.calcTotailRate);
        });
        dateArray.push(arrInner); // 汇总
        datePercentageArray.push(arrPerInner); // 汇总
        let filename = '';
        if (dateValue) {
            filename = card.name + "_" + dateValue + ".xlsx"
        } else {            
            filename = card.name + "_" + queryStartDate + "~" + queryEndDate + ".xlsx"
        }
        if(card.type && card.type === 5){
            const buffer = xlsx.build([{ name: '数量', data: dateArray },
                { name: '占比', data: datePercentageArray }]);
            const fileSize = buffer.length;
            ctx.response.status = 200;
            ctx.set('Content-disposition', 'attachment; filename=' + encodeURIComponent(filename))
            ctx.set('Content-type', 'application/vnd.openxmlformats')
            ctx.set('Content-Length', fileSize)
            ctx.body = buffer
        }else {
            const buffer = xlsx.build([{ name: 'sheet1', data: dateArray }]);
            const fileSize = buffer.length;
            ctx.response.status = 200;
            ctx.set('Content-disposition', 'attachment; filename=' + encodeURIComponent(filename))
            ctx.set('Content-type', 'application/vnd.openxmlformats')
            ctx.set('Content-Length', fileSize)
            ctx.body = buffer
        }
    }

    /**
     * 处理导出数据
     * @param {}} calcRuleArr 
     * @param {*} statisticData 
     * @param {*} totalCountList 
     */
    static async handleExportStatiscData(type,calcRuleArr, 
        pageId, cardId, startDate, endDate, title, dateList){
        let statisticData = [];
        //先把数据1按分类提取出来，然后遍历，寻找和时间匹配，匹配到了更新到时间段中
        for (let j = 0; j < calcRuleArr.length; j++) {
            let calcData = [];
            let statistics = {};
            let calcRuleInfo = calcRuleArr[j];
            //计算符号，可能为空
            let calcType = calcRuleInfo.calcType;
            let calcName = calcRuleInfo.calcName;
            let calcNameKey = calcRuleInfo.calcNameKey;
            let resStatistic;
            if (calcNameKey) {
                resStatistic = await BuryPointCardStatisticsModel.getList(pageId, cardId, '', calcNameKey, startDate, endDate)
            } else {
                //兼容老客户卡片规则里面没有calcNameKey，还是按照以前calcName查询
                resStatistic = await BuryPointCardStatisticsModel.getList(pageId, cardId, calcName, '', startDate, endDate)
            }
            title.push(calcName);
            //总量
            let calcTotail = 0;
            for (let k = 0; k < dateList.length; k++) {
                //统计数据入库统计表
                const cardStatistic = {}
                cardStatistic.name = calcName;
                cardStatistic.count = 0;
                cardStatistic.happenDate = dateList[k];
                for (let s = 0; s < resStatistic.length; s++) {
                    let happenDate = resStatistic[s].happenDate.Format("MM-dd");
                    if (happenDate === dateList[k]) {
                        cardStatistic.count = resStatistic[s].count;
                        if (!(type ===3 && calcType === "/")){
                            calcTotail = parseInt(calcTotail, 10) + parseInt(resStatistic[s].count, 10);
                        }
                        //如果是漏斗，导出百分数
                        if (type ===5){
                            cardStatistic.percentage = resStatistic[s].percentage;
                        }
                        break;
                    }
                }
                calcData.push(cardStatistic);
            }
            statistics.calcTotail = calcTotail;
            statistics.calcName = calcName;
            statistics.calcType = calcType;
            statistics.calcData = calcData;
            statisticData.push(statistics);
        }
        return statisticData;
    }

    /**
     * 表格展示数据
     * @param {*} ctx 
     */
    static async tableDisplay(ctx){
        const tableData = {}; 
        const tableDataList = []; 
        const param = Utils.parseQs(ctx.request.url)
        const { id, pageId, cardName, type, dateValue, topValue, queryStartDate, queryEndDate } = param;
        let startDate;
        let endDate;
        const oneDayTime = 24 * 3600 * 1000
        if (!dateValue && !queryStartDate && !queryEndDate){
            dateValue = '30';
        }
        if (dateValue) {
            const timestamp = new Date().getTime()
            let isOpenTodayStatistic = accountInfo.isOpenTodayStatistic;
            if (isOpenTodayStatistic) {
                startDate = new Date(timestamp - (parseInt(dateValue, 10)) * oneDayTime).Format("yyyy-MM-dd")
                endDate = new Date(timestamp).Format("yyyy-MM-dd") + " 23:59"
            } else {
                startDate = new Date(timestamp - (parseInt(dateValue, 10) + 1) * oneDayTime).Format("yyyy-MM-dd")
                endDate = new Date(timestamp - oneDayTime).Format("yyyy-MM-dd") + " 23:59"
            }
        } else {
            startDate = new Date(new Date(queryStartDate).getTime() - oneDayTime).Format("yyyy-MM-dd")
            endDate = queryEndDate + " 23:59"
        }
        let dateList = Utils.splitDate(startDate, endDate);
        // 查询该页面对应所有卡片，
        const card = await BuryPointCardModel.detail(id);
        const cardRes = {}
        cardRes.cardId = id;
        cardRes.type = card.type;//卡片类型：1-柱状图，2-多折线，3-柱线图，4-堆叠图，5-漏斗图
        cardRes.cardName = card.name;
        //柱线图要判断是否有/
        //存放柱线图标识数据，[{'name':'柱','isCalc':'false'},{'name':'线','isCalc':'true'}]
        let columnLineMap = new Map();
        if (card.type === 3) {
            //解析计算规则
            let calcRuleJson = JSON.parse(card.calcRule);
            for (let i = 0; i < calcRuleJson.length; i++) {
                let calcType = calcRuleJson[i].calcType;
                let calcName = calcRuleJson[i].calcName;
                if(calcType && calcType === '/'){
                    columnLineMap.set(calcName,'1');
                }else{
                    columnLineMap.set(calcName,'0');
                }
            }
        }

        let statisticData = [];
        const calcRuleArr = JSON.parse(card.calcRule)
        var title = ['日期'] //这是第一行 俗称列名
        title.push('总数');
        //堆叠图、多折线图、地图有归类属性
        if ((card.type === 2 || card.type === 4 || card.type === 7) && 
            (card.groupByFlag && card.groupByFlag === 1)) {
            //通过pageId查询项目获取项目id（event101）
            let projectInfo = await BuryPointProjectModel.detail(pageId);
            const { projectId } = projectInfo;
            //分析表名
            let statiscTableName = "BuryPointCardStatistics_" + projectId;
            statisticData = await BuryPointCardController.getGroupByCardStatistic(id, pageId, statiscTableName, topValue,title, dateList, startDate, endDate)
        }else{
            //按照保存的JSON规则，处理数据
            statisticData = await BuryPointCardController.handleExportStatiscData(card.type,calcRuleArr, 
                pageId, id,startDate, endDate, title, dateList);
        }
        //如果是漏斗图，计算每一步查询时间段的统计总数
        if (card.type && card.type === 5) {
            await BuryPointCardController.calcFunnelConversionRate(statisticData)
            // await BuryPointCardController.convertFunnelConversionRate(statisticData)
        }
        cardRes.statisticList = statisticData;
        //汇总
        const tableSummaryDataInfo = {};
        tableSummaryDataInfo.happenDate = '总体'
        const tableDataInfoItem = [];
        statisticData.forEach((item, totalCountIndex) => {
            const itemInfo = {};
            itemInfo.name = item.calcName;
            itemInfo.count = item.calcTotail * 1;
            itemInfo.percentage = item.calcTotailRate;
            tableDataInfoItem.push(itemInfo);
        });
        tableSummaryDataInfo.item = tableDataInfoItem;
        tableDataList.push(tableSummaryDataInfo);
        dateList.forEach((date, dateIndex) => {
            const tableDataInfo = {};
            tableDataInfo.happenDate = date
            const tableDataInfoItem = [];
            for(let i = 0;i<title.length;i++){
                for(let j = 0;j<cardRes.statisticList.length;j++){
                    const item = cardRes.statisticList[j];
                    if (item.calcName === title[i]) {
                        for(let k = 0;k<item.calcData.length;k++){
                            const calcDatatItem = item.calcData[k];
                            if (calcDatatItem.happenDate === date) {
                                const itemInfo = {};
                                itemInfo.name = item.calcName;
                                itemInfo.count = calcDatatItem.count * 1;
                                if(card.type && card.type === 5){
                                    itemInfo.percentage = calcDatatItem.percentage;
                                }
                                tableDataInfoItem.push(itemInfo);
                            }
                        }
                    }
                }
            }
            tableDataInfo.item = tableDataInfoItem
            tableDataList.push(tableDataInfo);
        });
        const tableDataSummaryList = [];
        for (let i = 0; i<tableDataList.length;i++){
            const newItemList = [];
            const tableDataInfo = tableDataList[i]
            const itemHappenDate = {};
            itemHappenDate.happenDate = tableDataInfo.happenDate;
            newItemList.push(itemHappenDate);

            const itemList = tableDataInfo.item;
            const itemTotalItem = {};
            itemTotalItem.name = '总数';
            let itemTotalItemCount = 0;
            
            for(let j = 0; j<itemList.length;j++){
                const item = itemList[j];
                if (!(card.type ===3 && (columnLineMap.get(item.name) === '1'))){
                    itemTotalItemCount = parseInt(itemTotalItemCount, 10) + parseInt(item.count, 10);
                }
            }
            itemTotalItem.count = itemTotalItemCount?itemTotalItemCount:0;
            if(itemList[0]){
                itemTotalItem.percentage = itemList[0].percentage;
            }
            // itemTotalItem.percentage = (!itemList[0] || itemList[0].percentage === undefined)?null:itemList[0].percentage;
            newItemList.push(itemTotalItem);
            for(let j = 0; j<itemList.length;j++){
                const item = itemList[j]
                //第一步没有转化率
                if (j == 0 && card.type === 5){
                    item.percentage = 100;
                }
                //柱线图，如果勾选了计算数据，带有"/"，count就是百分比，不计入总数中
                if(card.type ===3 && columnLineMap.get(item.name) === '1'){
                    item.count = item.count + '%';
                }
                newItemList.push(item);
            }
            tableDataSummaryList.push(newItemList);
        }
        tableData.title = title;
        tableData.tableDataList = tableDataSummaryList;
        if(card.type && card.type === 5){
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', tableData)
        }else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', tableData)
        }
    }

    /**
     * 置顶
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async sort(ctx) {
        let req = JSON.parse(ctx.request.body);
        let id = req.id;
        let pageId = req.pageId;
        const { nickname } = ctx.user
        req.updateBy = nickname
        if (req) {
            let currentCard = await BuryPointCardModel.detail(id);
            const resMaxSort = await BuryPointCardModel.getCountPageId(pageId);
            let maxSort = (isNaN(resMaxSort[0].maxSort) || resMaxSort[0].maxSort === 0) ? 1 : resMaxSort[0].maxSort;
            req.sort = maxSort;
            const resUpdateSortCards = await BuryPointCardModel.getListByPageIdAndSort(pageId, currentCard.id);
            for (let i = 0; i < resUpdateSortCards.length; i++) {
                resUpdateSortCards[i].sort = i + 1;
                await BuryPointCardModel.update(resUpdateSortCards[i].id, resUpdateSortCards[i]);
            }
            await BuryPointCardModel.update(id, req);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('置顶成功！', '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('置顶失败！')
        }
    }

    /**
     * 排序
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async order(ctx) {
        let req = JSON.parse(ctx.request.body);
        let sortList = req.sortList;
        const { nickname } = ctx.user
        if (req) {
            for (let i = 0; i < sortList.length; i++) {
                const cardInfo = {};
                cardInfo.id = sortList[i].cardId
                cardInfo.sort = sortList[i].sort
                cardInfo.updateBy = sortList[i].nickname
                await BuryPointCardModel.update(sortList[i].cardId, cardInfo);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
        }
    }

    /**
     * @swagger
     * /buryPointCard/list:
     *   post:
     *     tags:
     *       - 数据概览
     *     summary: 获取看板里的卡片列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: false
     *         type: string
     *       - name: sysType
     *         description: 系统项目标识
     *         in: formData
     *         required: false
     *         type: integer
     *       - name: cardName
     *         description: 卡片名字
     *         in: formData
     *         required: false
     *         type: string
     *       - name: dateValue
     *         description: 默认查询天数
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageId
     *         description: 看板ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: queryStartDate
     *         description: 查询开始日期
     *         in: formData
     *         required: false
     *         type: string
     *       - name: queryEndDate
     *         description: 查询结束日期
     *         in: formData
     *         required: false
     *         type: string
     *       - name: type
     *         description: 卡片类型
     *         in: formData
     *         required: false
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId="",sysType="", pageId, cardName, type, dateValue, queryStartDate, queryEndDate } = params;
        let startDate;
        let endDate;
        let cards = [];
        if(!pageId || pageId === '' || pageId === undefined || pageId === 'undefined'){
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', cards)
            return;
        }
        const oneDayTime = 24 * 3600 * 1000
        if (!dateValue && !queryStartDate && !queryEndDate){
            params.dateValue = '30';
        }
        if (params.dateValue) {
            const timestamp = new Date().getTime()
            let isOpenTodayStatistic = accountInfo.isOpenTodayStatistic;
            if (isOpenTodayStatistic) {
                startDate = new Date(timestamp - (parseInt(params.dateValue, 10)) * oneDayTime).Format("yyyy-MM-dd")
                endDate = new Date(timestamp).Format("yyyy-MM-dd") + " 23:59"
            } else {
                startDate = new Date(timestamp - (parseInt(params.dateValue, 10) + 1) * oneDayTime).Format("yyyy-MM-dd")
                endDate = new Date(timestamp - oneDayTime).Format("yyyy-MM-dd") + " 23:59"
            }
        } else {
            startDate = new Date(new Date(queryStartDate).getTime() - oneDayTime).Format("yyyy-MM-dd")
            endDate = queryEndDate + " 23:59"
        }
        if(projectId && sysType && (sysType === 1 || sysType === '1')){
            // 查询该页面对应所有卡片，
            const resCards = await BuryPointCardModel.getIdAndNameList(cardName, pageId, type);
            // console.log("卡片信息:" + JSON.stringify(resCards));
            for (let i = 0; i < resCards.length; i++) {
                const card = resCards[i];
                const cardId = card.id;
                //"cardName": "心跳次数",
                const cardName = card.name;
            }
            let newBaseTemplateCardList = []
            for (let i = 0; i < baseTemplateCardList.length; i++) {
                //"cardName": "心跳次数",
                const baseCardName = baseTemplateCardList[i].cardName;
                for (let j = 0; j < resCards.length; j++) {
                    const card = resCards[j];
                    //"cardName": "心跳次数",
                    const cardName = card.name;
                    if(baseCardName === cardName){
                        baseTemplateCardList[i].cardId = card.id
                        break;
                    }
                }
                newBaseTemplateCardList.push(baseTemplateCardList[i])
            }
            //走系统项目查询
            let weKeyRet = await BuryPointTemplateModel.getWeKeyByProjectIdAndType(projectId, 3) 
            if(weKeyRet && weKeyRet.length >0){
                for(let i=0;i<weKeyRet.length;i++){
                    const {weKey} =  weKeyRet[i];
                    if(weKey && weKey === 'we-base-ac874f09-1909-872d-0adc-b2d55fad5b43'){
                        cards = newBaseTemplateCardList;
                        break;
                    }
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', cards)
        }else{
            // 查询该页面对应所有卡片，
            const resCards = await BuryPointCardModel.getList(cardName, pageId, type);
            // console.log("卡片信息:" + JSON.stringify(resCards));
            for (let i = 0; i < resCards.length; i++) {
                const card = resCards[i];
                if(card.groupByFlag && card.groupByFlag === 1){
                    //参数1代表默认top10
                    cards.push(await BuryPointCardController.convertGroupByCardStatisticInfo(card, 1,startDate, endDate));
                }else{
                    cards.push(await BuryPointCardController.convertCardStatisticInfo(card, startDate, endDate));
                }
            }
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', cards)
    }

    /**
     * 根据页面ID和卡片名称查询卡片列表
     * @param {} ctx 
     */
    static async getListByPageIdAndName(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { pageId, cardName } = params
        if(!pageId || pageId === '' || pageId === undefined){
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('页面id必传')
            return
        }
        // 查询该页面对应所有卡片，
        const resCards = await BuryPointCardModel.getListByPageIdAndNameAndType(cardName, pageId, '');
        let cards = [];
        for (let i = 0; i < resCards.length; i++) {
            const card = {};
            card.cardId = resCards[i].id;
            card.sort = resCards[i].sort;
            card.cardName = resCards[i].name;
            card.createdAt = resCards[i].createdAt;
            cards.push(card);
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', cards)
    }

    /**
     * 漏斗图：计算每一步转化率
     * @returns {Promise.<void>}
     */
    static async calcFunnelConversionRate(statisticList) {
        //升序
        statisticList.sort(function (a, b) {
            return a.fieldIndex - b.fieldIndex;
        });
        let totalCount = 0;
        for (let i = 0; i < statisticList.length; i++) {
            totalCount = parseInt(totalCount, 10) + parseInt(statisticList[i].calcTotail, 10);
            if (i !== statisticList.length - 1) {//第一步不计算总转化率
                if (parseInt(statisticList[i].calcTotail, 10) === 0) {
                    statisticList[i + 1].calcTotailRate = 0;
                } else {//计算每一步总转化率
                    let rate = Utils.toFixed((parseInt(statisticList[i + 1].calcTotail, 10) / parseInt(statisticList[i].calcTotail, 10)) * 100, 2);
                    statisticList[i + 1].calcTotailRate = rate?rate:0;
                }
                let calcDataList = statisticList[i].calcData;
                for (let j = 0; j < calcDataList.length; j++) {//计算每一步每天转化率
                    let calcDataInfo = calcDataList[j];
                    if (parseInt(calcDataInfo.count, 10) === 0) {
                        calcDataInfo.percentage = 0;
                        continue;
                    }
                    let calcDataNextStepList = statisticList[i + 1].calcData;
                    for (let k = 0; k < calcDataNextStepList.length; k++) {//和下一步对应哪一天的计算转化率
                        if (calcDataInfo.happenDate === calcDataNextStepList[k].happenDate) {
                            let percent = Utils.toFixed((parseInt(calcDataNextStepList[k].count, 10) / parseInt(calcDataInfo.count, 10)) * 100, 2);
                            calcDataNextStepList[k].percentage = percent?percent:0;
                            break;
                        }
                    }
                }
            }
        }
         //总转化率计算：最后一步除以第一步
        if (totalCount === 0) {
            statisticList[0].calcTotailRate = 0;
        } else {
            let rate = Utils.toFixed((parseInt(statisticList[statisticList.length - 1].calcTotail, 10) / parseInt(statisticList[0].calcTotail, 10)) * 100, 2)
            statisticList[0].calcTotailRate = rate?rate:0;
           
            let calcDataList = statisticList[0].calcData;
            for (let i = 0; i < calcDataList.length; i++) {
                let calcDataInfo = calcDataList[i];
                if (parseInt(calcDataInfo.count, 10) === 0) {
                    calcDataInfo.percentage = 0;
                    continue;
                }
                let calcDataNextStepList = statisticList[statisticList.length - 1].calcData;
                for (let k = 0; k < calcDataNextStepList.length; k++) {
                    if (calcDataInfo.happenDate === calcDataNextStepList[k].happenDate) {
                        let percent = Utils.toFixed((parseInt(calcDataNextStepList[k].count, 10) / parseInt(calcDataInfo.count, 10)) * 100, 2);
                        calcDataInfo.percentage = percent?percent:0;
                        break;
                    }
                }
            }
        }
        // console.log("卡片计算后的数据:" + JSON.stringify(statisticList));
    }
    
    /**
     * 漏斗图：count换成转化率
     * @returns {Promise.<void>}
     */
    static async convertFunnelConversionRate(statisticList) {
        for (let i = 0; i < statisticList.length; i++) {
            let calcDataList = statisticList[i].calcData;
            let newCalcDataList = [];
            for (let j = 0; j < calcDataList.length; j++) {
                let calcDataInfo = calcDataList[j];
                let newCalcData = {};
                if(!calcDataInfo.percentage || calcDataInfo.percentage === '' || calcDataInfo.percentage === undefined){
                    newCalcData.count = 0
                }else {
                    newCalcData.count = calcDataInfo.percentage;
                }
                newCalcData.happenDate = calcDataInfo.happenDate;
                newCalcDataList.push(newCalcData);
            }
            statisticList[i].calcData = newCalcDataList;
        }
        // console.log("卡片计算后的数据:" + JSON.stringify(statisticList));
    }

    /**
     * 转换卡片分析统计数据
     * @returns {Promise.<void>}
     */
    static async convertCardStatisticInfo(card, startDate, endDate) {
        //日期列表
        let dateList = Utils.splitDate(startDate, endDate);
        const { id, pageId, name, sort,type, calcRule, conversionCycle,groupByFlag, 
            chartTableShow,togetherList,refreshFrequency,updatedAt,alarmStatus } = card
        const cardRes = {}
        cardRes.cardId = id;
        cardRes.type = type;
        cardRes.cardName = name;
        cardRes.conversionCycle = conversionCycle;//窗口期，默认1天
        cardRes.groupByFlag = groupByFlag;//是否归类图形，1-是，0-否
        cardRes.chartTableShow = chartTableShow;//图表展示：chart-图\table-表格\trend-趋势（漏斗）
        cardRes.togetherList = togetherList;//合计-total、均值-average、同比-yoyRatio、环比-ringRatio
        cardRes.refreshFrequency = refreshFrequency;//调用刷新接口频率，5s，10s，20s等
        cardRes.refreshTime = new Date().Format("yyyy-MM-dd hh:mm:ss");//卡片的更新刷新时间
        cardRes.alarmStatus = alarmStatus;//告警状态
        cardRes.sort = sort;//排序
        if(updatedAt){
            cardRes.refreshTime = updatedAt;//卡片的更新刷新时间
        }
        let statisticData = [];
        const calcRuleArr = JSON.parse(calcRule)
        //先把数据1按分类提取出来，然后遍历，寻找和时间匹配，匹配到了更新到时间段中
        for (let j = 0; j < calcRuleArr.length; j++) {
            let statistics = {};
            let calcRuleInfo = calcRuleArr[j];
            //计算符号，可能为空
            let calcType = calcRuleInfo.calcType;
            let calcName = calcRuleInfo.calcName;
            let unit = calcRuleInfo.unit;
            let calcNameKey = calcRuleInfo.calcNameKey;
            let prePoint = calcRuleInfo.prePoint;
            let calcFieldPre = prePoint.calcField;
            //fieldIndex：排序索引
            let fieldIndex = calcFieldPre.fieldIndex;
            let resStatistic = [];
            if (calcNameKey) {
                resStatistic = await BuryPointCardStatisticsModel.getList(pageId, id, '', calcNameKey, startDate, endDate)
            } else {
                //兼容老客户卡片规则里面没有calcNameKey，还是按照以前calcName查询
                resStatistic = await BuryPointCardStatisticsModel.getList(pageId, id, calcName, '', startDate, endDate)
            }
            await BuryPointCardController.convertStatisticList(statistics, dateList, resStatistic);
            statistics.fieldIndex = fieldIndex;
            statistics.calcName = calcName;
            statistics.unit = unit;
            statistics.calcType = calcType;
            statisticData.push(statistics);
        }
        //如果是漏斗图，计算每一步查询时间段的统计总数
        if (type && type === 5) {
            await BuryPointCardController.calcFunnelConversionRate(statisticData)
            await BuryPointCardController.convertFunnelConversionRate(statisticData)
        }
        cardRes.statisticList = statisticData
        return cardRes;
    }

    /**
     * 转换归类卡片分析统计数据
     * @returns {Promise.<void>}
     */
    static async convertGroupByCardStatisticInfo(card, topValue,startDate, endDate) {
        //日期列表
        let dateList = Utils.splitDate(startDate, endDate);
        const { id, pageId, name, sort,type, updatedAt, conversionCycle,groupByFlag,chartTableShow,togetherList,refreshFrequency,alarmStatus } = card
        const cardRes = {}
        cardRes.cardId = id;
        cardRes.type = type;
        cardRes.cardName = name;
        cardRes.conversionCycle = conversionCycle;//窗口期，默认1天
        cardRes.groupByFlag = groupByFlag;//是否归类图形，1-是，0-否
        cardRes.chartTableShow = chartTableShow;//图表展示：chart-图\table-表格\trend-趋势（漏斗）
        cardRes.togetherList = togetherList;//合计-total、均值-average、同比-yoyRatio、环比-ringRatio
        cardRes.refreshFrequency = refreshFrequency;//调用刷新接口频率，5s，10s，20s等
        cardRes.refreshTime = new Date().Format("yyyy-MM-dd hh:mm:ss");//卡片的更新刷新时间
        cardRes.alarmStatus = alarmStatus;//告警状态
        cardRes.sort = sort;//排序
        if(updatedAt){
            cardRes.refreshTime = updatedAt;//卡片的更新刷新时间
        }
        let title = [];
        //通过pageId查询项目获取项目id（event101）
        let projectInfo = await BuryPointProjectModel.detail(pageId);
        const { projectId } = projectInfo;
        //分析表名
        let statiscTableName = "BuryPointCardStatistics_" + projectId;
        cardRes.statisticList = await BuryPointCardController.getGroupByCardStatistic(id, pageId, statiscTableName, topValue, title, dateList, startDate, endDate)
        return cardRes;
    }

    /**
     * 转换归类卡片分析统计数据
     * @returns {Promise.<void>}
     */
    static async getGroupByCardStatistic(cardId, pageId, statiscTableName, topValue, title,dateList, startDate, endDate) {
        let statisticData = [];
        //如果是归类图形，要查询自己的分析统计表
        //默认top10
        let groupByTopData = await BuryPointCardStatisticsModel.getGroupByTopList(statiscTableName,pageId,cardId,topValue, startDate, endDate)
        // console.log("top几:" + JSON.stringify(groupByTopData));
        //分类
        //先把数据1按分类提取出来，然后遍历，寻找和时间匹配，匹配到了更新到时间段中
        for (let i = 0; i < groupByTopData.length; i++) {
            let statistics = {};
            let groupByTopInfo = groupByTopData[i];
            const { calcField } = groupByTopInfo;
            title.push(calcField);
            //分类
            let groupByStatiscData = await BuryPointCardStatisticsModel.getGroupByList(statiscTableName, pageId, cardId,calcField, startDate, endDate)
            await BuryPointCardController.convertStatisticList(statistics, dateList, groupByStatiscData);
            statistics.fieldIndex = i;
            statistics.calcName = calcField;
            statisticData.push(statistics);
        }
        return statisticData;
    }

    /**
     * 转换每个卡片返回统计的数据
     * @param {新的} statistics 
     * @param {时间} dateList 
     * @param {查询每个卡片统计数据} resStatistic 
     * @returns 
     */
    static async convertStatisticList(statistics, dateList, resStatistic){
        let calcData = [];
        //总量
        let calcTotail = 0;
        for (let k = 0; k < dateList.length; k++) {
            //统计数据入库统计表
            const cardStatistic = {}
            cardStatistic.count = 0;
            cardStatistic.happenDate = dateList[k];
            for (let s = 0; s < resStatistic.length; s++) {
                let happenDate = resStatistic[s].happenDate.Format("MM-dd");
                if (happenDate === dateList[k]) {
                    calcTotail += parseFloat(resStatistic[s].count);
                    cardStatistic.count = parseFloat(resStatistic[s].count);
                    break;
                }
            }
            calcData.push(cardStatistic);
        }
        statistics.calcTotail = calcTotail?calcTotail:0;
        statistics.calcData = calcData;
        return statistics;
    }
    /**
     * 计算转化周期数据
     * @param {转化周期} conversionCycle 
     * @param {查询数据集合} statisticList 
     */
    static async calcConversionCycleData(conversionCycle, statisticList) {
        let resStatistic = [];
        for (let i = 0; i < statisticList.length; i++) {
            let statistic = statisticList[i];
            let count = 0;
            for (let j = i; j < (i + conversionCycle); j++) {
                if (j >= statisticList.length) {
                    count = parseInt(count, 10) + parseInt(0, 10);
                } else {
                    count = parseInt(count, 10) + parseInt(statisticList[j].count, 10);
                }
            }
            statistic.count = count?count:0;
            resStatistic.push(statistic);
        }
        return resStatistic;
    }

}

class BuryPointTemplateController {
    /**
     * @swagger
     * /buryPointTemplate/create:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 创建模板
     *     parameters:
     *       - name: templateName
     *         description: 模板名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: type
     *         description: 模板类型：1-我的模板，2-公共模板，3-系统模板
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: groupCount
     *         description: 分组个数
     *         in: formData
     *         required: integer
     *         type: string
     *       - name: pageCount
     *         description: 看板个数
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: cardCount
     *         description: 卡片个数
     *         in: formData
     *         required: true
     *         type: integer    
     *       - name: detail
     *         description: 详情JSON
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async create(ctx) {
        let req = JSON.parse(ctx.request.body);
        const {nickname} = ctx.user
        req.createBy = nickname
        if (req.templateName && req.type) {
            //type=1公共模板,=2我的模板
            let ret;
            if (req.type == 1) {
                
            }else if (req.type == 2) {
                //我的模板
                const {userId, userType} = ctx.user
                req.userId = userId;
            }else if (req.type == 3) {
                //系统模板
            }
            await BuryPointTemplateModel.create(req);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建成功', '')
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建成功失败，请求参数不能为空！')
        }
    }

    /**
     * @swagger
     * /buryPointTemplate/copy:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 复制模板
     *     parameters:
     *       - name: id
     *         description: 模板主键id
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: templateName
     *         description: 模板名称
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async copy(ctx) {
        let req = JSON.parse(ctx.request.body);
        const {nickname,userId} = ctx.user
        if (req.templateName && req.id) {
            let templateDetail = await BuryPointTemplateModel.detail(req.id);
            let newTemplate = {};
            //type=1公共模板,=2我的模板
            newTemplate.createBy = nickname
            newTemplate.templateName = req.templateName
            newTemplate.type = 1
            newTemplate.detail = templateDetail.detail
            newTemplate.userId = userId
            newTemplate.groupCount = templateDetail.groupCount
            newTemplate.pageCount = templateDetail.pageCount
            newTemplate.cardCount = templateDetail.cardCount
            newTemplate.templatePoint = templateDetail.templatePoint
            await BuryPointTemplateModel.create(newTemplate);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '')
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
        }
    }

    /**
     * @swagger
     * /buryPointTemplate/updateName:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 更新模板名称
     *     parameters:
     *       - name: id
     *         description: 模板主键id
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: templateName
     *         description: 模板名称
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async updateName(ctx) {
        let req = JSON.parse(ctx.request.body);
        let id = req.id;
        const {nickname} = ctx.user
        req.updateBy = nickname
        if (req) {
            await BuryPointTemplateModel.update(id, req);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('更新信息成功！', '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('更新信息失败！')
        }
    }

     /**
     * @swagger
     * /buryPointTemplate/delete:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 删除单个模板
     *     parameters:
     *       - name: id
     *         description: 模板ID
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async delete(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param
        // 删除前，先检查是否还有
        await BuryPointTemplateModel.delete(id)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }
    
    /**
     * @swagger
     * /buryPointTemplate/deleteBatch:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 批量删除
     *     parameters:
     *       - name: ids
     *         description: 模板IDS（1,2）
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async deleteBatch(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { ids} = param
        // 删除前，先检查是否还有
        if(ids){
            let templateIdArray = ids.split(",")
            for (let i = 0;i<templateIdArray.length; i++){
                await BuryPointTemplateModel.delete(templateIdArray[i]);
            }
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    /**
     * @swagger
     * /buryPointTemplate/createProject:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 创建项目
     *     parameters:
     *       - name: id
     *         description: 模板ID
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: projectName
     *         description: 项目名称
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async createProject(ctx){
        let param = JSON.parse(ctx.request.body);
        const { id,projectName,type } = param
        const {nickname,companyId} = ctx.user
        // let nickname = "小鱼";
        if(id && projectName){
            let templateDetail = await BuryPointTemplateModel.detail(id);
            //TODO 判断卡片数是否足够
            let cardCout = templateDetail.cardCount;
            let flag = await BuryPointCardController.judgeCardCount(cardCout);
            if(flag === 1){
                ctx.response.status = 414;
                ctx.body = statusCode.ERROR_CARD_BALANCE_414("卡片余额不足")
                return
            }
            let newProjectId = '';
            if(templateDetail){
                let newPointIdArray=[];
                let currDate = new Date().Format("yyyyMMddhhmmss");
                let templateName = templateDetail.templateName;
                let projectJson = JSON.parse(templateDetail.detail);
                //1、新建项目
                //我的项目
                let retProject = await BuryPointProjectController.createNewProject(projectName,0,nickname,companyId);
                newProjectId = retProject.projectId
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', newProjectId)
                //2、新建分组
                let groupList = projectJson.groupList
                for(let i=0;i<groupList.length;i++){
                    let groupInfo = {}
                    groupInfo.name =  groupList[i].name;
                    groupInfo.type = 2
                    groupInfo.sort = groupList[i].sort
                    groupInfo.parentId = retProject.id
                    groupInfo.projectId = newProjectId
                    // groupInfo.delStatus = 0
                    groupInfo.createBy = nickname
                    let retGroup = await BuryPointProjectModel.create(groupInfo);
                    //3、新建看板
                    let pageList = groupList[i].pageList
                    for(let j=0;j<pageList.length;j++){
                        let pageInfo = {}
                        pageInfo.name =  pageList[j].name;
                        pageInfo.type = 3
                        pageInfo.sort = pageList[j].sort
                        pageInfo.parentId = retGroup.id
                        pageInfo.projectId = newProjectId
                        // pageInfo.delStatus = 0
                        pageInfo.createBy = nickname
                        let retPage = await BuryPointProjectModel.create(pageInfo);
                        //4、新建卡片
                        let cardList = pageList[j].cardList
                        for(let k=0;k<cardList.length;k++){
                            let oldCard = cardList[k];
                            let newCard = {};
                            newCard.pageId = retPage.id;
                            newCard.name = oldCard.name;
                            newCard.type = oldCard.type;
                            newCard.sort = oldCard.sort;
                            newCard.conversionCycle = oldCard.conversionCycle;
                            newCard.groupByFlag = oldCard.groupByFlag;
                            newCard.chartTableShow = oldCard.chartTableShow;
                            newCard.togetherList = oldCard.togetherList;
                            newCard.refreshFrequency = oldCard.refreshFrequency;
                            let calcRuleJSON = JSON.parse(oldCard.calcRule);       
                            let newCalcRule = []
                            let pointAndStepNameList = []
                            for (let m = 0; m < calcRuleJSON.length;m++) {
                                //重新设置calcNameKey和点位id
                                let calcData = calcRuleJSON[m];
                                let calcName = calcData.calcName;
                                calcData.calcNameKey = slugify(calcName).replace(/-/g, "") + new Date().Format("yyyyMMddhhmmss");
                                let prePoint = calcData.prePoint;
                                let pointId = prePoint.pointId;
                                //5、新建点位，判断逻辑：新建或者取存在的一个点位，名字重复就+"_copy"，不重复直接用改名字
                                let newPointId = await BuryPointWarehouseController.copyPoint(newProjectId, pointId, nickname);
                                newPointIdArray.push(newPointId);
                                calcData.prePoint.pointId = newPointId;
                                let endPoint = calcData.endPoint;
                                if(endPoint){
                                    //6、新建点位，判断逻辑：新建或者取存在的一个点位，名字重复就+"_copy"，不重复直接用改名字
                                    let newEndPointId = await BuryPointWarehouseController.copyPoint(newProjectId, endPoint.pointId, nickname);
                                    newPointIdArray.push(newEndPointId);
                                    calcData.endPoint.pointId = newEndPointId;
                                }       
                                newCalcRule.push(calcData);
                                if (newCard.type === 5) {
                                    pointAndStepNameList.push(newPointId);
                                }
                            }
                            newCard.calcRule = JSON.stringify(newCalcRule);
                            newCard.createBy = nickname
                            //7、创建卡片
                            let retCard = await BuryPointCardModel.create(newCard);
                            //8、漏斗图创建点位和步骤关系
                            if (newCard.type === 5) {
                                BuryPointCardController.saveFunnelPointRelation(pointAndStepNameList, retCard.id);
                            }
                        }
                    }
                }
                //9、新建一个SDK发布
                //点位ids去重
                let newPointIdArraySetArr = [...new Set(newPointIdArray)];
                // console.log("新点位 : " + JSON.stringify(newPointIdArraySetArr));
                let newSdkRelease = {};
                newSdkRelease.projectId = newProjectId;
                newSdkRelease.releaseName = projectName + currDate;
                newSdkRelease.pointIds = newPointIdArraySetArr + "";
                newSdkRelease.releaseScript = "";
                newSdkRelease.status = 1;
                newSdkRelease.version = 'v1.0.0';
                newSdkRelease.createBy = nickname
                let ret = await SdkReleaseModel.create(newSdkRelease);
                if (ret) {
                    let wePointIds = await BuryPointWarehouseModel.getPointIds(newProjectId, 1);
                    if(wePointIds && wePointIds.length > 0){
                        for(let i=0;i<wePointIds.length;i++){
                            newPointIdArraySetArr.push(wePointIds[i].id);
                        }
                    }
                   //10、创建完成，要生成日志表表，选了几个点位仓库，就生成几张表
                    for (let i = 0; i < newPointIdArraySetArr.length; i++) {
                        //默认生成今天的表
                        SdkReleaseController.createTableByDay(newProjectId, newPointIdArraySetArr[i], 0).catch((e) => {
                            log.printError("执行{" + newProjectId + "_" + newPointIdArraySetArr[i] + "}创建表报错：", e)
                        });
                    }
                }
            }
            //11、更新模板projectId，只有我的模板才有projectId
            if(templateDetail.type === 1){
                let updateTemplateDetail = {}
                updateTemplateDetail.id = id
                updateTemplateDetail.projectId = newProjectId
                updateTemplateDetail.updateBy = nickname
                await BuryPointTemplateModel.update(id, updateTemplateDetail);
            }
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
        }
    }

    /**
     * @swagger
     * /buryPointTemplate/getCommonList:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 获取公共模版列表
     *     parameters:
     *       - name: templateName
     *         description: 模板名称
     *         in: formData
     *         required: false
     *         type: string
     *       - name: userId
     *         description: 创建人
     *         in: formData
     *         required: false
     *         type: string  
     *       - name: startDate
     *         description: 开始时间
     *         in: formData
     *         required: false
     *         type: string   
     *       - name: endDate
     *         description: 结束时间
     *         in: formData
     *         required: false
     *         type: string
     *       - name: orderBy
     *         description: 创建时间排序（desc/asc）
     *         in: formData
     *         required: false
     *         type: string
     *       - name: page
     *         description: 当前页
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 页面大小
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getCommonTemplatePageList(ctx) {        
        let param = JSON.parse(ctx.request.body);
        const { templateName,userId,startDate,endDate,orderBy,page, pageSize  } = param
        if(!orderBy){
            orderBy = 'desc'
        }
        let total = await BuryPointTemplateModel.getPageCount(templateName,'',startDate, endDate,2,userId);
        let commonTemplateList = await BuryPointTemplateModel.getPageList(templateName,'',startDate, endDate,2,userId,orderBy,page,pageSize);
        let totalCount = 0
        totalCount = total[0].count
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', { list: commonTemplateList, totalCount })
    }

    /**
     * @swagger
     * /buryPointTemplate/getSysList:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 获取系统模版列表
     *     parameters:
     *       - name: templateName
     *         description: 模板名称
     *         in: formData
     *         required: false
     *         type: string
     *       - name: startDate
     *         description: 开始时间
     *         in: formData
     *         required: false
     *         type: string   
     *       - name: endDate
     *         description: 结束时间
     *         in: formData
     *         required: false
     *         type: string
     *       - name: orderBy
     *         description: 创建时间排序（desc/asc）
     *         in: formData
     *         required: false
     *         type: string
     *       - name: page
     *         description: 当前页
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 页面大小
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getSysTemplatePageList(ctx) {        
        let param = JSON.parse(ctx.request.body);
        const { templateName,userId="",startDate,endDate,orderBy,page, pageSize  } = param
        if(!orderBy){
            orderBy = 'desc'
        }
        let total = await BuryPointTemplateModel.getPageCount(templateName,'',startDate, endDate,3,userId);
        let sysTemplateList = await BuryPointTemplateModel.getPageList(templateName,'',startDate, endDate,3,userId,orderBy,page,pageSize);
        let totalCount = 0
        totalCount = total[0].count
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', { list: sysTemplateList, totalCount })
    }

    /**
     * @swagger
     * /buryPointTemplate/getMyList:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 获取我的模版列表
     *     parameters:
     *       - name: templateName
     *         description: 模板名称
     *         in: formData
     *         required: false
     *         type: string
     *       - name: startDate
     *         description: 开始时间
     *         in: formData
     *         required: false
     *         type: string   
     *       - name: endDate
     *         description: 结束时间
     *         in: formData
     *         required: false
     *         type: string
     *       - name: orderBy
     *         description: 创建时间排序（desc/asc）
     *         in: formData
     *         required: false
     *         type: string
     *       - name: page
     *         description: 当前页
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 页面大小
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getMyTemplatePageList(ctx) {        
        const {userId, userType} = ctx.user
        let param = JSON.parse(ctx.request.body);
        const { templateName,startDate, endDate,orderBy,page, pageSize } = param
        if(!orderBy){
            orderBy = 'desc'
        }
        let total = await BuryPointTemplateModel.getPageCount(templateName,'',startDate, endDate,1,userId);
        let myTemplateList = await BuryPointTemplateModel.getPageList(templateName,'',startDate, endDate,1,userId,orderBy,page,pageSize);
        let newList = []
        for(let i = 0;i<myTemplateList.length;i++){
            if(myTemplateList[i].projectId){
                let retProject = await BuryPointProjectModel.getNameByProjectIdAndType(myTemplateList[i].projectId,1);
                if(retProject && retProject.length>0){
                    myTemplateList[i].projectName = retProject[0].name
                }
            } 
            newList.push(myTemplateList[i]);
        }
        let totalCount = 0
        totalCount = total[0].count
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', { list: newList, totalCount })
    }

    /**
     * @swagger
     * /buryPointTemplate/detail:
     *   post:
     *     tags:
     *       - 模板管理
     *     summary: 详情
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async detail(ctx){
        let {id} = JSON.parse(ctx.request.body);
        if (id) {
            let template = await BuryPointTemplateModel.detail(id);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', template)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail');
        }
    }

}

class TestController {

    static async test1(ctx) { 
        let req = "{\"stayTime\":0,\"boKeBianHao\":\"MjA3\"}"
        let params = Utils.logParseJson(req)
        let fieldLength = 0;
        let fieldName = "stayTime";
        console.log((params[fieldName]+"").length)
        console.log((params[fieldName]+"").length > fieldLength)
        if((params[fieldName]+"").length > fieldLength){
            console.log("长度超过字段长度了")
        }
        
    }

}

class BuryPointTestController {

    /**
     * 获取打点测试列表
     * @param {} ctx 
     */
    static async getPageList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId, pointId, queryStartDate, queryEndDate, page, pageSize } = params;
        let startTime;
        let endTime;
        let tableEndName;
        if (projectId === undefined || projectId === '' || projectId === null){
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.TEST_PROJECT_FAIL)}`)
            return;
        }
        if (pointId === undefined || pointId === '' || pointId === null){
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.TEST_POINT_ID_FAIL)}`)
            return;
        }
        if (queryStartDate && queryEndDate){
            tableEndName = new Date(new Date(queryStartDate).getTime()).Format("yyyyMMdd");
            startTime = new Date(new Date(queryStartDate).getTime()).Format("yyyy-MM-dd hh:mm:ss");
            endTime = new Date(new Date(queryEndDate).getTime()).Format("yyyy-MM-dd hh:mm:ss");
            //统计配置文件里面存储的天数
            let countDay = parseInt(accountInfo.saveDays, 10)
            var startDate = new Date(new Date(new Date(queryStartDate).getTime()).Format("yyyy-MM-dd hh:mm:ss"));
            var currentDate = new Date(new Date(new Date().getTime()).Format("yyyy-MM-dd hh:mm:ss"));
            var difftime = (currentDate - startDate)/1000; //计算时间差,并把毫秒转换成秒
            var days = parseInt(difftime/86400); // 天  24*60*60*1000
            if (days > countDay){
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('只能查询前' + countDay + '天的数据！')
                return;
            }
        } else {
             //当天
            startTime = new Date(new Date().getTime()).Format("yyyy-MM-dd");
            endTime = new Date(new Date().getTime()).Format("yyyy-MM-dd hh:mm:ss");
            tableEndName = new Date(new Date().getTime()).Format("yyyyMMdd");
        }
        let tablePreName = projectId + "_" + pointId + "_";
        let tableName = tablePreName + tableEndName;
        let queryTotalSql = " select count(*) as count from " + tableName + " where 1=1 ";
        //查询点位字段
        let queryFieldsSql = "id,";
        try {
            let buryPointWarehouse = await BuryPointWarehouseModel.detail(pointId);
            const { pointName,fields } = buryPointWarehouse
            let buryPointFieldList = await BuryPointFieldModel.getListByFieldIds(fields)
            for(let i = 0; i < buryPointFieldList.length; i ++){
                queryFieldsSql = queryFieldsSql + buryPointFieldList[i].fieldName + ','
            }
            queryFieldsSql = queryFieldsSql + "DATE_FORMAT(createdAt,'%Y-%m-%d %H:%i:%s') AS createdAt ";
            let querySql = " select " + queryFieldsSql + " from " + tableName + " where 1=1 ";
            let conditionSql = "";
            if (startTime) {
                conditionSql = conditionSql + " and createdAt >='" + startTime + "'";
            } 
            if (endTime) {
                conditionSql = conditionSql + " and createdAt <='" + endTime + "'";
            }
            queryTotalSql = queryTotalSql + conditionSql;
            querySql = querySql + conditionSql;
            // console.log("打点测试，执行查询总数sql：" + queryTotalSql);
            const resCount = await BuryPointCardModel.statisticData(queryTotalSql);
            let totalCount = (resCount)?(isNaN(resCount[0].count) ? 0 : resCount[0].count):0;
            querySql = querySql + " order by createdAt desc limit " + (page - 1) * pageSize + "," + pageSize
            // console.log("打点测试，执行查询分页sql：" + querySql);
            const res = await BuryPointCardModel.statisticData(querySql);
            const result = [];
            for (let i = 0; i < res.length; i++) {
                const record = {};
                record.pointId = pointId;
                record.pointName = pointName;
                record.eventJson = res[i];
                record.createdAt = res[i].createdAt;
                result.push(record);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', { list: result, totalCount })
        } catch(e) {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200("success", {list: [], totalCount: "0"})
        }
        
    }

    /**
     * 根据userId搜素
     * @param {} ctx 
     */
    static async search(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { userId = "", projectId, selectedPointId, filterList, page = 0, pageSize = 10, date, order = "descend", dataType = "list", calcInfo} = params;
        const startTime = date + " 00:00:00"
        const endTime = date + " 23:59:59"
        const tableEndName = new Date(date).Format("yyyyMMdd");
        const tableName = projectId + "_" + selectedPointId + "_" + tableEndName;
        const start = (page - 1) * pageSize

        // 获取筛选条件的数值类型
        for (let i = 0; i < filterList.length; i ++) {
            const { fieldName } = filterList[i]
            await BuryPointFieldModel.getFieldTypeByKey(fieldName).then((res) => {
                if (res && res.length) {
                    filterList[i].type = res[0].fieldType
                }
            })
        }

        let filterSql = ""
        let andOrStr = "and"
        if(filterList && filterList.length>0){
            filterList.forEach((filter) => {
                const { fieldName, rule, value, type = "",andOr="a" } = filter
                let valueStr = value
                if (type.toLowerCase() === "varchar") {
                    valueStr = value
                }
                if(andOr){
                    andOrStr = Utils.convertAndOr(andOr);
                }
                if (fieldName) {
                    filterSql += " " + Utils.convertOperationSql(fieldName, rule, valueStr) + andOrStr
                }
            })
            filterSql = " and (" +filterSql.substring(0, filterSql.lastIndexOf(andOrStr)) + ")";
        }


        let result = {}
        // if (calcInfo && calcInfo.calcField) {
        if (dataType === "calc") {
            let countSql = ""
            let orderBySql = ""
            let fieldNameArr = []
            if (calcInfo.calcField.isRepeat === "4") {
                countSql = ` count(${calcInfo.calcField.fieldName}) as PV `
                orderBySql = " order by PV desc "
                fieldNameArr = [{fieldAlias: "PV", fieldName: "PV"}]
            } else if (calcInfo.calcField.isRepeat === "5") {
                countSql = ` count(distinct weCustomerKey) as UV `
                orderBySql = " order by UV desc "
                fieldNameArr = [{fieldAlias: "UV", fieldName: "UV"}]
            }
            let querySql = `select ${calcInfo.calcField.fieldName}, ${countSql} from ${tableName} where 1=1 ${filterSql} group by ${calcInfo.calcField.fieldName} ${orderBySql} `

            const tempResult = await BuryPointCardModel.statisticData(querySql);
            // if (tempResult && tempResult.length === 1) {
            //     result = tempResult[0]
            // } else if (tempResult && tempResult.length > 1) {
            //     result = tempResult
            // }
            const finalDataList = tempResult.slice(start, (start + 1) * pageSize)
            const fieldRes = await BuryPointFieldModel.getFieldListByKey(`'${calcInfo.calcField.fieldName}'`)
            const fieldResArr = [...fieldRes, ...fieldNameArr]
            result = {total: tempResult.length, dataList: finalDataList || [], fieldNameList: fieldResArr}
        } else if (dataType === "list") {
            const orderStr = order === "descend" ? "desc" : "asc"
            let queryTotalSql = ` select * from ${tableName} where 1=1 ${filterSql} and createdAt>='${startTime}' and createdAt<='${endTime}' order by createdAt ${orderStr} limit ${start},${pageSize} `
            const res = await BuryPointCardModel.statisticData(queryTotalSql);
            let queryTotalCountSql = ` select count(id) as count from ${tableName} where 1=1 ${filterSql} and createdAt>='${startTime}' and createdAt<='${endTime}' `
            const totalRes = await BuryPointCardModel.statisticData(queryTotalCountSql);
            let fieldKeys = "''"
            if (res && res.length) {
                const tempData = res[0]
                for(let key in tempData) {
                    if (key.indexOf("weFirstStepDay_") !== -1 || key === "id") {
                        continue
                    }
                    fieldKeys += `,'${key}'`
                }
            }
            let total = 0
            if (totalRes && totalRes.length) {
                total = totalRes[0].count * 1
            }
            // TODO 这里的逻辑需要调整，根据projectId获取字段的名称
            const fieldRes = await BuryPointFieldModel.getFieldListByKey(fieldKeys)

            result = {total, dataList: res || [], fieldNameList: fieldRes}
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200("success", result)
    }

    /**
     * @swagger
     * /buryPointTest/failList:
     *   post:
     *     tags:
     *       - 点位测试
     *     summary: 获取失败点位测试列表
     *     parameters:
     *       - name: projectId
     *         description: 所属项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointId
     *         description: 点位ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: page
     *         description: 页数(从1开始)
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 每页显示数量
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: date
     *         description: 日期
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async failList(ctx) {
        const req = JSON.parse(ctx.request.body)

        if (!req.page) {
            req.page = 1
        }
        if (!req.pageSize) {
            req.pageSize = 10
        }
        if (!req.projectId) {
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数缺少项目id')
            return;
        }
        if (!req.pointId) {
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数缺少点位id')
            return;
        }
        if (!req.date) {
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数缺少日期')
            return;
        }

        const startTime = req.date + " 00:00:00"
        const endTime = req.date + " 23:59:59"

        try {
            const res = await BuryPointFailLogModel.getList({...req, startTime, endTime})
            const { list, total } = res

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', { list, total })
        } catch (error) {
            console.log(error)
            ctx.response.status = 413;
            ctx.body = statusCode.ERROR_413('请求参数不合法')
        }
    }

    static async searchAllRecord(ctx) {
        const params = JSON.parse(ctx.request.body)
        const { userId, customerKey, searchDate, projectId = "" } = params
        // TODO 这里的逻辑需要调整，根据projectId获取点位列表
        const pointList = await BuryPointWarehouseModel.getListByProjectIdAndOldType(projectId)
        let result = {}
        const tableEndName = new Date(searchDate).Format("yyyyMMdd");
        let querySql = ""
        if (userId) {
            querySql = ` where weUserId = '${userId}'`
        } else if (customerKey) {
            querySql = ` where weCustomerKey = '${customerKey}'`
        }
        if (querySql) {
            for(let i = 0; i < pointList.length; i ++) {
                const { id, pointName } = pointList[i]
                const tableName = projectId + "_" + id + "_" + tableEndName;
                const searchSql = `select * from ${tableName} ${querySql}`
                const recordRes = await BuryPointCardModel.statisticData(searchSql);
                result[id] = {
                    name: pointName,
                    list: recordRes || []
                }
            }
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200("success", result)
    }

    static async searchFieldName(ctx) {
        const params = JSON.parse(ctx.request.body)
        const { fieldKeys } = params
        let fieldKeySql = "''"
        fieldKeys.forEach((key) => {
            fieldKeySql += `,'${key}'`
        })
        // TODO 这里的逻辑需要调整，根据projectId获取字段的名称
        const fieldRes = await BuryPointFieldModel.getFieldListByKey(fieldKeySql)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200("success", fieldRes)
    }

    /**
     * 导出数据
     * filterList : [{"fieldName":"stayTime","rule":"等于","value":"1"},{"fieldName":"weCustomerKey","rule":"等于","value":"2"}]
     * @param {*} ctx 
     */
    static async exportData(ctx){
        const params = Utils.parseQs(ctx.request.url)
        const { projectId, pointName ,selectedPointId, filterList = '[]', startNum = 0, endNum = 10, date, order = "descend" } = params;
        const startTime = date + " 00:00:00"
        const endTime = date + " 23:59:59"
        const tableEndName = new Date(date).Format("yyyyMMdd");
        const tableName = projectId + "_" + selectedPointId + "_" + tableEndName;

        if(startNum > endNum){
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
        if(endNum > 10000){
            endNum = 10000
        }
        // 获取筛选条件的数值类型
        let filterListArr = JSON.parse(filterList);
        for (let i = 0; i < filterListArr.length; i ++) {
            const { fieldName } = filterListArr[i]
            await BuryPointFieldModel.getFieldTypeByKey(fieldName).then((res) => {
                if (res && res.length) {
                    filterListArr[i].type = res[0].fieldType
                }
            })
        }

        let filterSql = ""
        let andOrStr = "and"
        if(filterListArr && filterListArr.length>0){
            filterListArr.forEach((filter) => {
                const { fieldName, rule, value, type = "",andOr="a" } = filter
                let valueStr = value
                if (type.toLowerCase() === "varchar") {
                    valueStr = value
                }
                if(andOr){
                    andOrStr = Utils.convertAndOr(andOr);
                }
                if (fieldName) {
                    filterSql += " "+ fieldName + Utils.convertOper(rule) + "'" + valueStr + "' " + andOrStr
                }
            })
            filterSql = " and (" +filterSql.substr(0, filterSql.lastIndexOf(andOrStr)) + ")";
        }
        const orderStr = order === "descend" ? "desc" : "asc"
        let queryTotalSql = ` select * from ${tableName} where 1=1 ${filterSql} and createdAt>='${startTime}' and createdAt<='${endTime}' order by createdAt ${orderStr} limit ${startNum},${endNum} `
        const res = await BuryPointCardModel.statisticData(queryTotalSql);

        if (!res) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('没有数据！')
            return
        }

        let fieldKeys = "''"
        if (res && res.length) {
            const tempData = res[0]
            for(let key in tempData) {
                if (key.indexOf("weFirstStepDay_") !== -1 || key === "id") {
                    continue
                }
                fieldKeys += `,'${key}'`
            }
        }
        // TODO 这里的逻辑需要调整，根据projectId获取字段的名称
        const fieldRes = await BuryPointFieldModel.getFieldListByKey(fieldKeys)
        const dateArray = [];//数量列表
        var title = ['用户id','点位名称'] //这是第一行 俗称列名
        for(let i = 0;i < fieldRes.length; i++){
            title.push(fieldRes[i].fieldAlias);
        }
        title.push('创建时间');
        dateArray.push(title);
        if(res){
            for(let i = 0;i < res.length; i++){
                let dataInfo = res[i]
                var arrInner = [];
                arrInner.push(dataInfo.weCustomerKey);
                arrInner.push(pointName);
                for(let j = 0;j < fieldRes.length; j++){
                    arrInner.push(dataInfo[fieldRes[j].fieldName]);
                }
                arrInner.push(dataInfo.createdAt);
                dateArray.push(arrInner);
            }
        }
        let filename = new Date().Format("yyyyMMddhhmmss")+ ".xlsx"
        const buffer = xlsx.build([{ name: 'sheet1', data: dateArray }]);
        const fileSize = buffer.length;
        ctx.response.status = 200;
        ctx.set('Content-disposition', 'attachment; filename=' + encodeURIComponent(filename))
        ctx.set('Content-type', 'application/vnd.openxmlformats')
        ctx.set('Content-Length', fileSize)
        ctx.body = buffer
    }

    /**
     * api导出数据接口
     * @param {} ctx 
     */
    static async apiExport(ctx) {
        const { purchaseCodeCardCount } = global.eventInfo
        if (purchaseCodeCardCount < 9999) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412("您当前的版本无法使用API查询功能，卡片无限版可调用！")
            return
        }
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { userId = "", calcInfo, projectId, selectedPointId, filterList, page = 0, pageSize = 10, date, order = "desc" } = params;
        const tableEndName = new Date(date).Format("yyyyMMdd");
        const tableName = projectId + "_" + selectedPointId + "_" + tableEndName;
        const start = (page - 1) * pageSize

        // 获取筛选条件的数值类型
        for (let i = 0; i < filterList.length; i ++) {
            const { fieldName } = filterList[i]
            await BuryPointFieldModel.getFieldTypeByKey(fieldName).then((res) => {
                if (res && res.length) {
                    filterList[i].type = res[0].fieldType
                }
            })
        }

        let filterSql = ""
        let andOrStr = "and"
        if(filterList && filterList.length>0){
            filterList.forEach((filter) => {
                const { fieldName, rule, value, type = "",andOr="a" } = filter
                let valueStr = value
                if (type.toLowerCase() === "varchar") {
                    valueStr = value
                }
                if(andOr){
                    andOrStr = Utils.convertAndOr(andOr);
                }
                if (fieldName) {
                    filterSql += " "+ fieldName + Utils.convertOper(rule) + "'" + valueStr + "' " + andOrStr
                }
            })
            filterSql = " and (" +filterSql.substr(0, filterSql.lastIndexOf(andOrStr)) + ")";
        }
        const orderStr = order

        let result = {}
        if (calcInfo && calcInfo.calcField) {
            let tableNamePre = Utils.setTableName(projectId + "_" + selectedPointId + "_", 0)
            let querySql = await TimerStatisticController.splicingSql(calcInfo.calcField, [], tableNamePre);
            const tempResult = await BuryPointCardModel.statisticData(`${querySql} ${filterSql}`);
            if (tempResult && tempResult.length === 1) {
                result = tempResult[0]
            } else if (tempResult && tempResult.length > 1) {
                result = tempResult
            }
        } else {
            let queryTotalSql = ` select * from ${tableName} where 1=1 ${filterSql} order by createdAt ${orderStr} limit ${start},${pageSize} `
            const res = await BuryPointCardModel.statisticData(queryTotalSql);
            let queryTotalCountSql = ` select count(id) as count from ${tableName} where 1=1 ${filterSql} `
            const totalRes = await BuryPointCardModel.statisticData(queryTotalCountSql);
            let total = 0
            if (totalRes && totalRes.length) {
                total = totalRes[0].count * 1
            }
            result = {total, dataList: res || []}
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200("success", result)
    }
}


/**
 * 初始化数据
 */
class CommonInitDataController {

    /**
     * 初始化通用字段
     * @param {*} projectId 
     * @param {*} nickname 
     */
    static async handleWeFieldData(projectId,nickname){
        //2、判断通用字段是否已经在项目中了
        for(let i=0;i<weFieldList.length;i++){
            let fieldDetail = weFieldList[i]
            let {fieldName,fieldAlias,fieldType,fieldLength,groupByFlag,fieldDesc,weType} = fieldDetail;
            const resWeField = await BuryPointFieldModel.existSameField(projectId,fieldName,fieldAlias,fieldType,fieldLength);
            if(!resWeField || (resWeField && resWeField.length === 0)){
                //新建
                fieldDetail.projectId = projectId
                fieldDetail.createBy = nickname
                let ret = await BuryPointFieldModel.create(fieldDetail);
            }
        }
    }
     /**
     * 初始化通用点位
     * @param {*} projectId 
     * @param {*} nickname 
     */
    static async handleWePointData(projectId,nickname){
        //2、判断通用字段是否已经在项目中了
        for(let i=0;i<wePointList.length;i++){
            let pointDetail = wePointList[i]
            let {pointName,pointDesc,weType,replacePointIdKey,fieldList} = pointDetail;
            let newFieldIds = "";
            for(let j=0;j<fieldList.length;j++){
                let fieldDetail = fieldList[j]
                let {fieldName,fieldAlias,fieldType,fieldLength,groupByFlag,fieldDesc,weType} = fieldDetail;
                const resWeField = await BuryPointFieldModel.existSameField(projectId,fieldName,fieldAlias,fieldType,fieldLength);
                if(!resWeField || (resWeField && resWeField.length === 0)){
                    //新建
                    fieldDetail.projectId = projectId
                    fieldDetail.createBy = nickname
                    let ret = await BuryPointFieldModel.create(fieldDetail);
                    newFieldIds = newFieldIds + ret.id + ",";
                }else{
                    newFieldIds = newFieldIds + resWeField[0].id + ",";
                }
            }
            newFieldIds = newFieldIds.substring(0, newFieldIds.lastIndexOf(','));
            //根据projectId 和新字段ids，查询是否有一样的点位，一样就不创建，直接用
            let pointInfo = await BuryPointWarehouseModel.getByProjectIdAndFieldIds(projectId,newFieldIds)
            if(pointInfo && pointInfo.length > 0){
                
            }else {
                pointDetail.fields=newFieldIds
                pointDetail.createBy=nickname
                pointDetail.projectId =projectId
                await BuryPointWarehouseModel.create(pointDetail);
            }
        }
    }

    /**
     * 初始化通用卡片(目前是心跳次数卡片)
     * @param {*} projectId 
     * @param {*} nickname 
     */
    static async handleWeCardData(projectId,pageId,nickname){
        //1、查询心跳检测点位id
        let wePontIdsRet = await BuryPointWarehouseModel.getWePointIdsByProjectId(projectId);
        let heartBeatPointId = wePontIdsRet && wePontIdsRet.length>0?wePontIdsRet[0].id:"";
        //2、判断通用字段是否已经在项目中了
        for(let i=0;i<weCardList.length;i++){
            let cardDetail = weCardList[i]
            cardDetail.createBy = nickname
            cardDetail.pageId = pageId
            let calcRuleJSON = JSON.parse(cardDetail.calcRule);
            let newCalcRule = []
            for (let j = 0; j < calcRuleJSON.length; j++) {
                //重新设置calcNameKey和点位id
                let calcData = calcRuleJSON[j];
                let calcName = calcData.calcName;
                calcData.calcNameKey = slugify(calcName).replace(/-/g, "") + new Date().Format("yyyyMMddhhmmss");
                calcData.prePoint.pointId = heartBeatPointId;     
                newCalcRule.push(calcData);
            }
            cardDetail.calcRule = JSON.stringify(newCalcRule);
            //4、创建卡片
            BuryPointCardModel.create(cardDetail);
        }
    }

    /**
     * 初始化通用点位和通用字段
     * @param {项目id} projectId 
     * @param {用户名} nickname 
     */
    static async initWeFieldAndPointData(projectId,nickname){
        //1、初始化通用点位
        await CommonInitDataController.handleWePointData(projectId,nickname);
        //2、初始化通用字段
        await CommonInitDataController.handleWeFieldData(projectId,nickname);
    }

    /**
     * 老字段为每个项目都创建一遍
     * @param {项目id} projectId 
     * @param {用户名} nickname 
     */
    static async handleOldFieldData(projectId,nickname){
       let oldFieldList =  await BuryPointFieldModel.getOldList();
       for(let i = 0;i<oldFieldList.length;i++){
            let {fieldName,fieldAlias,fieldType,fieldLength,groupByFlag,fieldDesc,weType,createBy} = oldFieldList[i];
            const res = await BuryPointFieldModel.existSameField(projectId,fieldName,fieldAlias,fieldType,fieldLength);
            if(res && res.length > 0){
                
            }else {
                //新建
                let req = {};
                req.weType = weType
                req.projectId = projectId
                req.fieldName = fieldName
                req.fieldAlias = fieldAlias
                req.fieldType = fieldType
                req.fieldLength = fieldLength
                req.groupByFlag = groupByFlag
                req.fieldDesc = fieldDesc
                req.createBy = createBy?createBy:nickname
                await BuryPointFieldModel.create(req);
            }
       }
    }

    /**
     * 
     * @param {*} projectId 
     * @param {*} nickname 
     */
    static async handleData(projectInfo,nickname){
        //遍历项目下所有分组，遍历分组下所有看板，遍历看板下所有卡片
        const {id,projectId,name,createBy} = projectInfo
        let newPointIdArray=[];
        let currDate = new Date().Format("yyyyMMddhhmmss");
        let groupList = await BuryPointProjectModel.getListByParentId(id)
        for(let i=0;i<groupList.length;i++){
            let pageList = await BuryPointProjectModel.getListByParentId(groupList[i].id)
            for(let j=0;j<pageList.length;j++){
                let pageId = pageList[j].id
                let cardList = await BuryPointCardModel.getByPageId(pageId)
                for(let k=0;k<cardList.length;k++){
                    let cardId = cardList[k].id
                    let type = cardList[k].type
                    let calcRuleJSON = JSON.parse(cardList[k].calcRule);
                    let newCalcRule = []
                    let pointAndStepNameList = []
                    for (let m = 0; m < calcRuleJSON.length;m++) {
                        //重新设置calcNameKey和点位id
                        let calcData = calcRuleJSON[m];
                        let prePoint = calcData.prePoint;
                        let pointId = prePoint.pointId;
                        //5、新建点位，判断逻辑：新建或者取存在的一个点位，名字重复就+"_copy"，不重复直接用改名字
                        let newPointId = await BuryPointWarehouseController.copyPoint(projectId, pointId, createBy);
                        newPointIdArray.push(newPointId);
                        calcData.prePoint.pointId = newPointId;
                        let endPoint = calcData.endPoint;
                        if(endPoint){
                            //6、新建点位，判断逻辑：新建或者取存在的一个点位，名字重复就+"_copy"，不重复直接用改名字
                            let newEndPointId = await BuryPointWarehouseController.copyPoint(projectId, endPoint.pointId, createBy);
                            newPointIdArray.push(newEndPointId);
                            calcData.endPoint.pointId = newEndPointId;
                        }       
                        newCalcRule.push(calcData);
                        if (type === 5) {
                            pointAndStepNameList.push(newPointId);
                        }
                    }
                    cardList[k].calcRule = JSON.stringify(newCalcRule);
                    //8、漏斗图创建点位和步骤关系
                    if (type === 5) {
                       BuryPointCardController.saveFunnelPointRelation(pointAndStepNameList, cardId);
                    }
                   //更新卡片
                   BuryPointCardModel.update(cardId,cardList[k])
                }
            }
        }
        //9、新建一个SDK发布
        //点位ids去重
        let newPointIdArraySetArr = [...new Set(newPointIdArray)];
        SdkReleaseController.createNewSdk(projectId,name + currDate,newPointIdArraySetArr,nickname)
    }

    /**
     * 初始化系统模板中的点位的字段
     * @param {*} projectId 
     * @param {*} nickname 
     */
    static async initWeTemplatePointAndField(projectId,templatePoint,nickname){
        let pointList = JSON.parse(templatePoint)
        let pointRelationList = []
        //2、判断通用字段是否已经在项目中了
        for(let i=0;i<pointList.length;i++){
            let pointRelation = {};
            let pointDetail = pointList[i]
            let {pointId,fieldList} = pointDetail;
            pointRelation.oldPointId = pointId
            let newFieldIds = "";
            let newPointId;
            for(let j=0;j<fieldList.length;j++){
                let fieldDetail = fieldList[j]
                let {fieldName,fieldAlias,fieldType,fieldLength} = fieldDetail;
                const resWeField = await BuryPointFieldModel.existSameField(projectId,fieldName,fieldAlias,fieldType,fieldLength);
                if(!resWeField || (resWeField && resWeField.length === 0)){
                    //新建
                    fieldDetail.projectId = projectId
                    fieldDetail.createBy = nickname
                    let ret = await BuryPointFieldModel.create(fieldDetail);
                    newFieldIds = newFieldIds + ret.id + ",";
                }else{
                    newFieldIds = newFieldIds + resWeField[0].id + ",";
                }
            }
            newFieldIds = newFieldIds.substring(0, newFieldIds.lastIndexOf(','));
             //根据projectId 和新字段ids，查询是否有一样的点位，一样就不创建，直接用
            let pointInfo = await BuryPointWarehouseModel.getByProjectIdAndFieldIds(projectId,newFieldIds)
            if(pointInfo && pointInfo.length > 0){
                newPointId = pointInfo[0].id;
            }else {
                pointDetail.fields = newFieldIds
                pointDetail.createBy = nickname
                pointDetail.projectId = projectId
                let newPointRet = await BuryPointWarehouseModel.create(pointDetail);
                newPointId = newPointRet.id
            }
            pointRelation.newPointId = newPointId
            pointRelationList.push(pointRelation);
        }
        return pointRelationList;
    }

    /**
     * 初始化系统模板中的点位的字段
     * @param {*} projectId 
     * @param {*} nickname 
     */
    static async getNewPointId(oldPointId,pointRelationList){
        //2、判断通用字段是否已经在项目中了
        for(let i=0;i<pointRelationList.length;i++){
            if(oldPointId === pointRelationList[i].oldPointId){
                return pointRelationList[i].newPointId
            } 
            
        }
    }


    /**
     * 通过计算规则，创建字段和点位
     * [
            {
                "calcName":"曝光量",
                "prePoint":{
                    "calcField":{
                        "fieldName":"weCustomerKey",
                        "isRepeat":"0"
                    },
                    "pointId":21,
                    "queryCriteria":[
                        {
                            "fieldName":"puGuangNeiRongKeGuiLei",
                            "rule":"等于",
                            "value":"webfunny价格页"
                        },
                        {
                            "fieldName":"yeMianLuJing",
                            "rule":"等于",
                            "value":"/price"
                        }
                    ]
                },
                "calcNameKey":"puguangliang20230221003738",
                "combineType":"a"
            },
       ]
     */

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
    static async refreshTokenList() {
        const configList = await ConfigModel.getAllConfigList()
        const tokenList = {}
        configList.forEach((item) => {
            tokenList[item.configName] = item.configValue
        })
        global.eventInfo.tokenListInMemory = tokenList
    }

    static async getConfig(configName) {
        const res = await ConfigModel.getConfigByConfigName(configName)
        return res
    }

    static async updateConfig(configName, data) {
        const res = await ConfigModel.getConfigByName(configName)
        if (res) {
            await ConfigModel.updateConfig(configName, data)
        } else {
            await ConfigModel.createConfig({configName, ...data})
        }
    }
}

class BuryPointFieldController {

    /**
     * @swagger
     * /buryPointField/create:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 创建
     *     parameters:
     *       - name: projectId 
     *         description: 项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: fieldAlias
     *         description: 字段名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: fieldType
     *         description: 字段类型
     *         in: formData
     *         required: true
     *         type: string
     *       - name: fieldLength
     *         description: 字段长度
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: fieldDesc
     *         description: 字段描述
     *         in: formData
     *         required: true
     *         type: string
     *       - name: groupByFlag
     *         description: 是否可归类：1-是，0-否
     *         in: formData
     *         required: false
     *         type: integer
     *       - name: weType
     *         description: 是否通用字段标识（1-通用字段，0-项目字段）
     *         in: formData
     *         required: false
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async create(ctx) {
        let req = JSON.parse(ctx.request.body);
        const {nickname} = ctx.user
        req.createBy = nickname
        if (req.projectId && req.fieldAlias && req.fieldType && req.fieldLength && req.fieldDesc) {
            //如果用户填了通用字段，提示不可用，因为创建表的时候，默认有个自增id字段了
            //通用字段：id,wfType,wfIsFirstDayBrowse,wfHapppenHour,wfHapppenMinute,wfCustomerKey,wfUserId,wfSysVersion,wfCity,wfCountry,wfSimpleUrl,wfBrowser,wfOs,wfDeviceSize,createdAt
            if (!Utils.checkFieldNameValid(req.fieldAlias)){
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.FIELD_CREATE_FAIL)}`)
                return
            }
            //数字类型，长度不能超过255
            //INT 4 -2147483648 2147483647
            //BIGINT 8 -9223372036854775808 9223372036854775807
            if (req.fieldType === 'INT'){
              if (req.fieldLength >= 255){
                 req.fieldLength = 255;
                 req.fieldType = 'BIGINT'
              }else if(req.fieldLength < 255 && req.fieldLength > 10){
                req.fieldType = 'BIGINT'
              }
            }
            //1、"用户id"转成拼音yong_hu_id;
            req.fieldName = Utils.pinYinToHump(req.fieldAlias);
            //同一个项目下，拼音转换后的字段不能重复
            const res = await BuryPointFieldModel.checkFieldName('',req.projectId,req.fieldAlias,'');
            let count = res[0].count
            if(count > 0){
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_FIELD_NAME_EXIST)}`)
                return
            }
            //通用字段标识：1-是，0-否
            req.weType = 0
            let ret = await BuryPointFieldModel.create(req);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
    }

    /**
     * @swagger
     * /buryPointField/detail:
     *   get:
     *     tags:
     *       - 字段仓库
     *     summary: 详情
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async detail(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        let id = param.id;
        if (id) {
            let data = await BuryPointFieldModel.detail(id);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', data)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail')
        }
    }

   /**
     * @swagger
     * /buryPointField/update:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 更新
     *     parameters:
     *       - name: id 
     *         description: 主键id
     *         in: formData
     *         required: true
     *         type: integer 
     *       - name: projectId 
     *         description: 项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: fieldAlias
     *         description: 字段名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: fieldType
     *         description: 字段类型
     *         in: formData
     *         required: true
     *         type: string
     *       - name: fieldLength
     *         description: 字段长度
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: fieldDesc
     *         description: 字段描述
     *         in: formData
     *         required: true
     *         type: string
     *       - name: groupByFlag
     *         description: 是否可归类：1-是，0-否
     *         in: formData
     *         required: false
     *         type: integer,
     *       - name: weType
     *         description: 是否通用字段标识（1-通用字段，0-项目字段）
     *         in: formData
     *         required: false
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async update(ctx) {
        let req = JSON.parse(ctx.request.body);
        let id = req.id;
        const {nickname} = ctx.user
        req.updateBy = nickname
        if (req) {
            if (!Utils.checkFieldNameValid(req.fieldAlias)){
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.FIELD_CREATE_FAIL)}`)
                return
            }
            //数字类型，长度不能超过255
            if (req.fieldType === 'INT'){
                if (req.fieldLength >= 255){
                   req.fieldLength = 255;
                   req.fieldType = 'BIGINT'
                }else if(req.fieldLength < 255 && req.fieldLength > 10){
                  req.fieldType = 'BIGINT'
                }
            }
            //数字INT类型，长度不能超过11
            if (req.fieldType === 'BIGINT'){
                if (req.fieldLength < 11){
                    req.fieldType = 'INT'
                }else if(req.fieldLength >= 255){
                    req.fieldLength = 255;
                }
            }
             //1、"用户id"转成拼音yong_hu_id;
             req.fieldName = Utils.pinYinToHump(req.fieldAlias);
             //同一个项目下，拼音转换后的字段不能重复
            const res = await BuryPointFieldModel.checkFieldName(id,req.projectId,req.fieldAlias,'');
             let count = res[0].count
             if(count > 0){
                 ctx.response.status = 412;
                 ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_PARAM_FAIL)}`)
                 return
             }
            await BuryPointFieldModel.update(id, req);
            let data = await BuryPointFieldModel.detail(id);
        
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_SUCCESS)}`, data);
        } else {
    
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_FAIL)}`)
        }
    }
   
   /**
     * @swagger
     * /buryPointField/delete:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 删除
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async delete(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param
        // 删除前，先检查所有点位仓库是否有该字段
        const resPointList = await BuryPointWarehouseModel.getAllList('');
        for (let i = 0 ; i < resPointList.length; i++) {
            const point = resPointList[i];
            const { pointName,fields } = point
            let fieldIdArray = fields.split(",")
            for (let j = 0;j<fieldIdArray.length; j++){
                if (parseInt(id,10) === parseInt(fieldIdArray[j],10)){
                    ctx.response.status = 412;
                    let message = `${Utils.b64DecodeUnicode(ConstMsg.FIELD_DELETE_FAIL_1)}`+ pointName +`${Utils.b64DecodeUnicode(ConstMsg.FIELD_DELETE_FAIL_2)}`
                    ctx.body = statusCode.ERROR_412(message)
                    return;
                }
            }
        }
        await BuryPointFieldModel.delete(id)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    
    }

    /**
     * @swagger
     * /buryPointField/page:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 获取分页列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string    
     *       - name: fieldType
     *         description: 字段类型
     *         in: formData
     *         required: false
     *         type: string 
     *       - name: fieldAlias
     *         description: 字段名称
     *         in: formData
     *         required: false
     *         type: string 
     *       - name: weType
     *         description: 是否通用字段标识（1-通用字段，0-项目字段）
     *         in: formData
     *         required: false
     *         type: integer
     *       - name: page
     *         description: 当前页
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 页面大小
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getPageList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const {projectId, fieldType="", fieldAlias="",weType="", page, pageSize } = params;
        if(projectId){
            const total = await BuryPointFieldModel.getPageCount(projectId,weType,fieldType,fieldAlias)
            const totalCount = total[0].count
            const res = await BuryPointFieldModel.getPageList(projectId,weType,fieldType,fieldAlias, page, pageSize)
            const resPointList = await BuryPointWarehouseModel.getAllList(projectId);
            for (let i = 0 ; i < res.length; i++) {
                const {id,weType} = res[i]
                let isEdit = 1
                if(weType && weType === 1){
                    isEdit = 0;
                }else{
                    // 是否可编辑，先检查所有点位仓库是否有该字段
                    for (let j = 0 ; j < resPointList.length; j++) {
                        const point = resPointList[j];
                        const { fields } = point
                        let fieldIdArray = fields.split(",")
                        for (let k = 0;k<fieldIdArray.length; k++){
                            if (parseInt(id,10) === parseInt(fieldIdArray[k],10)){
                                isEdit = 0;
                            }
                        }
                    }
                }
                res[i].isEdit = isEdit
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', {list: res,totalCount})
        }else{
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_FAIL)}`)
        }
        
    }

    /**
     * @swagger
     * /buryPointField/list:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 获取列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string    
     *       - name: fieldType
     *         description: 字段类型
     *         in: formData
     *         required: false
     *         type: string 
     *       - name: fieldAlias
     *         description: 字段名称
     *         in: formData
     *         required: false
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getNoWeList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId, fieldType="", fieldAlias="" } = params;
        if(projectId){
            const res = await BuryPointFieldModel.getList(projectId,0, fieldType,fieldAlias)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', res)
        }else{
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_FAIL)}`)
        }
    }

    /**
     * @swagger
     * /buryPointField/getListByPointId:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 通过点位id获取字段列表
     *     parameters:
     *       - name: pointId
     *         description: 点位id
     *         in: formData
     *         required: true
     *         type: string    
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getListByPointId(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { pointId } = params;
        if(pointId){
            const point = await BuryPointWarehouseModel.detail(pointId);
            const { fields } = point
            const res = [];
            const resList = await BuryPointFieldModel.getListByFieldIds(fields)
            for (let j = 0 ; j < resList.length; j++) {
                res.push(resList[j]);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', res)
        }else{
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_FAIL)}`)
        }
    }

    /**
     * @swagger
     * /buryPointField/getListAndWfByPointId:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 通过点位id获取项目字段和通用字段列表
     *     parameters:
     *       - name: pointId
     *         description: 点位id
     *         in: formData
     *         required: true
     *         type: integer    
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getListAndWfByPointId(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { pointId } = params;
        if(pointId){
            const point = await BuryPointWarehouseModel.detail(pointId);
            const { fields,projectId } = point
            const res = [];
            //1、首先获取通用字段
            //2、然后获取项目字段
            //3、内置id排在最上面，然后是项目字段，最后是其他通用字段
            const weFieldList = await BuryPointFieldModel.getListByProjectIdAndWeType(projectId,1);
            for (let j = 0 ; j < weFieldList.length; j++) {
                if(weFieldList[j].fieldName.toString().toLowerCase()=== 'wecustomerkey'){
                    res.push(weFieldList[j]);
                    break;
                }
            }
            const resList = await BuryPointFieldModel.getListByFieldIds(fields)
            for (let j = 0 ; j < resList.length; j++) {
                res.push(resList[j]);
            }
            for (let j = 0 ; j < weFieldList.length; j++) {
                if(weFieldList[j].fieldName.toString().toLowerCase()!== 'wecustomerkey'){
                    res.push(weFieldList[j]);
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', res)
        }else{
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_FAIL)}`)
        }
    }

    /**
     * @swagger
     * /buryPointField/getListAndWfByProjectId:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 通过项目id获取项目字段和通用字段列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string    
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getListAndWfByProjectId(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId } = params;
        if(projectId){
            const res = [];
            const resList = await BuryPointFieldModel.getListByProjectIdAndWeType(projectId,'')
            for (let i = 0 ; i < resList.length; i++) {
                let fieldInfo = {}
                //id,projectId,weType,fieldAlias,fieldName,fieldType,fieldLength,fieldDesc,groupByFlag
                fieldInfo.id  = resList[i].id
                fieldInfo.fieldName  = resList[i].fieldName
                fieldInfo.fieldAlias  = resList[i].fieldAlias
                fieldInfo.fieldType  = resList[i].fieldType
                fieldInfo.fieldDesc  = resList[i].fieldDesc
                fieldInfo.groupByFlag  = resList[i].groupByFlag
                fieldInfo.weType  = resList[i].weType
                res.push(fieldInfo);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', res)
        }else{
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_FAIL)}`)
        }
    }

    /**
     * @swagger
     * /buryPointField/getFieldCount:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 获取项目字段个数和通用字段个数
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getFieldCount(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId} = params;
        if(projectId){
            const total = await BuryPointFieldModel.getPageCount(projectId,0,'','')
            const projectCount = total[0].count
            const weTotal = await BuryPointFieldModel.getPageCount(projectId,1,'','')
            const weCount = weTotal[0].count
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', {projectCount,weCount})
        }else{
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail')
        }
        
    }

    /**
     * @swagger
     * /buryPointField/AllList:
     *   get:
     *     tags:
     *       - 字段仓库
     *     summary: 通过所有字段列表
     *     parameters:  
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getAllList(ctx) {
        const res = await BuryPointFieldModel.getAllList()
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

     /**
     * 复制字段
     * 参数：projectId-要复制到的项目id，fieldId-被复制的字段id
     * 逻辑：
     * 新建字段，判断是否一样的标准：fieldName，fieldAlias，fieldType，fieldLength都一样不用复制，不一样就新建一个字段
     * @param 
     * @returns {Promise.<void>}
     */
    /**
     * @swagger
     * /buryPointField/copy:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 复制字段
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string
     *       - name: fieldId
     *         description: 要复制的字段id
     *         in: formData
     *         required: true
     *         type: integer    
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
     static async copyField(projectId,fieldId,nickname) {
        const fieldDetail = await BuryPointFieldModel.detail(fieldId);
        let {fieldName,fieldAlias,fieldType,fieldLength,groupByFlag,fieldDesc,weType,createBy} = fieldDetail;
        const res = await BuryPointFieldModel.existSameField(projectId,fieldName,fieldAlias,fieldType,fieldLength);
        
        if(res && res.length > 0){
            return res[0].id;
        }else {
            //新建
            let req = {};
            req.weType = weType
            req.projectId = projectId
            req.fieldName = fieldName
            req.fieldAlias = fieldAlias
            req.fieldType = fieldType
            req.fieldLength = fieldLength
            req.groupByFlag = groupByFlag
            req.fieldDesc = fieldDesc
            req.createBy = createBy?createBy:nickname
            let ret = await BuryPointFieldModel.create(req);
            return ret.id;
        }
     }

     /**
     * 导入字段
     * 参数：projectId-要导入到的项目id，fieldId-被导入的字段id
     * 逻辑：
     * 新建字段，判断是否一样的标准：fieldName，fieldAlias，fieldType，fieldLength都一样不用复制，不一样就新建一个字段
     * @param 
     * @returns {Promise.<void>}
     */
    /**
     * @swagger
     * /buryPointField/fieldExport:
     *   post:
     *     tags:
     *       - 字段仓库
     *     summary: 导入字段
     *     parameters:
     *       - name: projectId
     *         description: 项目id(event101)
     *         in: formData
     *         required: true
     *         type: string
     *       - name: fieldIds
     *         description: 字段ids("1,2")
     *         in: formData
     *         required: false
     *         type: string    
     *       - name: allSelectProjectId
     *         description: 全选的项目id("event101")
     *         in: formData
     *         required: false
     *         type: string 
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async exportField(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId,fieldIds="",allSelectProjectId="" } = params;
        const { nickname } = ctx.user;
        if(projectId && (fieldIds || allSelectProjectId)){
            let fieldArray = [];
            if(allSelectProjectId){
                let resFieldIds = await BuryPointFieldModel.getIdsByProjectId(allSelectProjectId);
                for (let j = 0; j< resFieldIds.length; j++){
                    fieldArray.push(resFieldIds[j].id)
                }
            }
            if(fieldIds){
                let fieldIdArray = fieldIds.split(",");
                for (let i = 0; i< fieldIdArray.length; i++){
                    fieldArray.push(fieldIdArray[i]);
                }  
            }
            let countInfo = {};
            countInfo.successCount = 0;
            countInfo.repeatCount = 0;
            countInfo.repeatField = [];
            for (let i = 0; i< fieldArray.length; i++){
                // await BuryPointFieldController.copyField(projectId,fieldArray[i],nickname);
                const fieldDetail = await BuryPointFieldModel.detail(fieldArray[i]);
                let {fieldName,fieldAlias,fieldType,fieldLength,groupByFlag,fieldDesc,weType} = fieldDetail;
                const res = await BuryPointFieldModel.existSameField(projectId,fieldName,fieldAlias,fieldType,fieldLength);
                if(res && res.length > 0){
                    countInfo.repeatCount = countInfo.repeatCount + 1
                    countInfo.repeatField.push(fieldAlias)
                }else {
                    //新建
                    let req = {};
                    req.weType = weType
                    req.projectId = projectId
                    req.fieldName = fieldName
                    req.fieldAlias = fieldAlias
                    req.fieldType = fieldType
                    req.fieldLength = fieldLength
                    req.groupByFlag = groupByFlag
                    req.fieldDesc = fieldDesc
                    req.createBy = nickname
                    await BuryPointFieldModel.create(req);
                    countInfo.successCount = countInfo.successCount + 1
                }
            } 
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', countInfo)
        }else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail')
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
}

class SysInfoController {

    static async getSysInfo(ctx){
        const sysInfoData = {};

        const { purchaseCodeEndDate, purchaseCodeValid, purchaseCodeType,purchaseCodeCardCount } = global.eventInfo
        sysInfoData.isValid = purchaseCodeValid;
        //版本号
        sysInfoData.version = webfunnyVersion;
        //产品名称
        sysInfoData.productType = purchaseCodeType;
        //到期时间
        sysInfoData.endDate = purchaseCodeEndDate;
        
        //卡片总数(项目个数)
        const retCardCount = await BuryPointCardModel.getCountByNoSysType("");
        sysInfoData.cardCount = isNaN(retCardCount[0].count) ? 0 : retCardCount[0].count;
        sysInfoData.cardTotalCount = purchaseCodeCardCount;
        //项目总数
        const retProjectCount = await BuryPointProjectModel.getCountByNameAndType("",1);
        sysInfoData.projectCount = isNaN(retProjectCount[0].count) ? 0 : retProjectCount[0].count;
        //SDK发布总数
        const retSdkReleaseCount = await SdkReleaseModel.getPageCount("","","","");
        sysInfoData.sdkReleaseCount = isNaN(retSdkReleaseCount[0].count) ? 0 : retSdkReleaseCount[0].count;
        //点位总数
        const retPointCount = await BuryPointWarehouseModel.getPageCount("","","");
        sysInfoData.pointCount = isNaN(retPointCount[0].count) ? 0 : retPointCount[0].count;
        //点位字段总数
        const retPointFieldCount = await BuryPointFieldModel.getPageCount('','','', '');
        sysInfoData.pointFieldCount = isNaN(retPointFieldCount[0].count) ? 0 : retPointFieldCount[0].count;
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', sysInfoData)
    }

    /**
     * @swagger
     * /baseInfo:
     *   post:
     *     tags:
     *       - 系统信息
     *     summary: 系统信息
     *     parameters:    
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getBaseInfo(ctx){
        const baseInfoData = {};
        const { purchaseCodeType,purchaseCodeCardCount } = global.eventInfo
        //产品类型：23：黄金VIP,25,26,28：VIP版
        baseInfoData.productType = purchaseCodeType;
        if(purchaseCodeType === 23
            || purchaseCodeType === 25|| purchaseCodeType === 26
            || purchaseCodeType === 28){
            baseInfoData.isVIP = 1;
        }else {
            baseInfoData.isVIP = 0;
        }
        //卡片总数(项目个数)
        const retCardCount = await BuryPointCardModel.getCountByNoSysType("");
        let cardCount = isNaN(retCardCount[0].count) ? 0 : retCardCount[0].count;
        // baseInfoData.cardTotalCount = purchaseCodeCardCount;
        baseInfoData.cardSurplus = parseInt(purchaseCodeCardCount) - parseInt(cardCount);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', baseInfoData)
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

            const teamList = await TeamModel.getAllTeamList()
            let totalCount = 0
            teamList.forEach((team) => {
                totalCount ++
            })

            if ((global.eventInfo.purchaseCodeType === 0 ||
                (global.eventInfo.purchaseCodeType >= 30 && global.eventInfo.purchaseCodeType <= 33)) 
                && totalCount >= 2) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412('您好，个人(试用)版用户最多只能够创建一个团队，升级为正式版，则可以无限创建团队哦。')
                return
            }

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
        const projects = await BuryPointProjectModel.getProjectListByWebMonitorIds(webMonitorIds,"")
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

        // const res = await TeamModel.getTeamList(userId, userType)
        //改为从接口获取teamList
        // const response = await Utils.postJson(`http://${accountInfo.centerServerDomain}/wfManage/getTeamListWithoutToken`, {userId, userType}).catch((e) => {
        //     if (typeof e === "object") {
        //         log.printError(`http://${accountInfo.centerServerDomain}/wfManage/getTeamListWithoutToken ->` + JSON.stringify(e))
        //     } 
        // })

        const teamListRes = await Utils.requestForTwoProtocol("post", `${accountInfo.centerServerDomain}/wfManage/getTeamListWithoutToken`, {userId, userType})

        if (!teamListRes) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('团队列表获取失败！')
            return
        }

        const res = teamListRes.data
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
            const projects = await BuryPointProjectModel.getProjectListByWebMonitorIds(webMonitorIds,"")
            team.projects = projects
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async getTeams(ctx) {

        const { userId, userType } = ctx.user
        
        const teamListRes = await Utils.requestForTwoProtocol("post", MANAGE_API.GET_TEAMS, {userId, userType})

        if (!teamListRes) {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('团队列表获取失败！')
            return
        }

        const res = teamListRes.data
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
    if (userType !== "admin" || userType !== "superAdmin") {
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
    global.eventInfo.loginValidateCode = code
    return code
  }

  static async refreshValidateCode(ctx) {
    const code = UserController.setValidateCode()
    if (global.eventInfo.loginValidateCodeTimer) {
      clearInterval(global.eventInfo.loginValidateCodeTimer)
    } else {
      global.eventInfo.loginValidateCodeTimer = setInterval(() => {
        UserController.setValidateCode()
      }, 5 * 60 * 1000)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', code)
  }

  static async getValidateCode(ctx) {
    const code = global.eventInfo.loginValidateCode
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
    const loginValidateCode = global.eventInfo.loginValidateCode.toLowerCase()
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
      global.eventInfo.webfunnyTokenList.push(accessToken)
      UserController.setValidateCode()
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
    if (global.eventInfo.registerEmailCode[email]) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码发送太频繁', 1)
      return
    }
    global.eventInfo.registerEmailCode[email] = code
    // 邮箱验证失败次数清零
    global.eventInfo.registerEmailCodeCheckError[email] = 0
    // 1分钟后失效
    setTimeout(() => {
      delete global.eventInfo.registerEmailCode[email]
    }, 2 * 60 * 1000)
    const title = "注册验证码：" + code
    const content = "<p>用户你好!</p>" + 
    "<p>Webfunny注册的验证码为：" + code + "</p>" +
    "<p>如有疑问，请联系作者，微信号：webfunny2、webfunny_2020</p>"
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
    const registerEmailCode = global.eventInfo.registerEmailCode[email]
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
      const { localServerDomain } = accountInfo
      // 此处需要支持http协议
      const confirmUrl = `http://${localServerDomain}/server/register?name=${name}&email=${email}&password=${password}`
      const title = "管理员确认申请"
      const content = "<p>管理员你好!</p>" + 
      "<p>有用户申请注册你的监控系统，请点击注册链接，以完成注册：<a href='" + confirmUrl + "'>" + confirmUrl + "</a></p>" +
      "<p>如有疑问，请联系作者，微信号：webfunny2、webfunny_2020</p>"
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
    
    const registerEmailCodeCheckError = global.eventInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.eventInfo.registerEmailCode[email]
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
        "<p>如有疑问，请联系作者，微信号：webfunny2、webfunny_2020</p>"
        UserController.sendEmail(email, title, content)

        // 获取管理员账号
        const adminUser = await UserModel.getUserForAdmin()
        // 给管理员发送一条系统消息
        MessageModel.createMessage({
          userId: adminUser[0].userId,
          title: "用户注册通知",
          content: `您好，用户【${email}】正在申请注册webfunny账号，请及时处理！`,
          type: "sys",
          isRead: 0,
          link: `http://${accountInfo.localAssetsDomain}/webfunny_event/userList.html`
        })
        // 给管理员发送一封邮件
        const adminTitle = "用户注册通知"
        const adminContent = `
        <p>尊敬的管理员：</p>
        <p>您好，用户【${email}】正在申请注册webfunny账号，请及时处理！</p>
        <p>点击链接处理：http://${accountInfo.localAssetsDomain}/webfunny_event/userList.html</p>
        <p>如有疑问，请联系作者，微信号：webfunny2、webfunny_2020</p>
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

    const registerEmailCodeCheckError = global.eventInfo.registerEmailCodeCheckError
    if (registerEmailCodeCheckError[email] >= 3) {
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('验证码失败次数达到上限，请重新获取验证码！', 1)
      return
    }
    const registerEmailCode = global.eventInfo.registerEmailCode[email]
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
      "<p>如有疑问，请联系作者，微信号：webfunny2、webfunny_2020</p>"
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
      <p>如有疑问，请联系作者，微信号：webfunny2、webfunny_2020</p>
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
  /**
   * 保存token
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async storeTokenToMemory(ctx) {
    const param = JSON.parse(ctx.request.body)
    const { accessToken } = param

    // 判断token是否合法
    verify(accessToken, secret.sign, async (err, decode) => {
      if (err) {
        log.printError("token解析失败：", err)
        return
      }
      const { emailName } = decode
      const tokenList = global.eventInfo.tokenListInMemory || {}
      tokenList[emailName] = accessToken
      // 检查 emailName 对应的token是否存在
      const lastTokenInfo = await ConfigModel.getConfigByName(emailName)
      if (lastTokenInfo) {
        // 如果存在就更新
        await ConfigModel.updateConfig(emailName, {configValue: accessToken})
      } else {
        // 如果不存在，则新赠
        await ConfigModel.createConfig({configName: emailName, configValue: accessToken})
      }
    })

    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('Token存储完成！', 0)
  }
}

class BuryPointWarehouseController {
    /**
     * @swagger
     * /buryPointWarehouse/create:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 创建
     *     parameters:
     *       - name: projectId 
     *         description: 项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointName
     *         description: 点位名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointDesc
     *         description: 点位描述
     *         in: formData
     *         required: false
     *         type: string
     *       - name: fields
     *         description: 字段IDS
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async create(ctx) {
        let req = JSON.parse(ctx.request.body);
        const {nickname} = ctx.user
        req.createBy = nickname
        if (req.projectId && req.pointName && req.fields) {
            const res = await BuryPointWarehouseModel.checkName(req.projectId,req.pointName);
            let count = res[0].count
            if(count > 0){
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_POINT_NAME_EXIST)}`)
                return
            }
            req.weType = 0;
            let ret = await BuryPointWarehouseModel.create(req);
            //更新pointId为id
            await BuryPointWarehouseModel.updateByFields({id:ret.id, pointId:ret.id});
            //TODO 往缓存存放字段和点位信息
            const { fields,weType } = ret
            let buryPointFields = await BuryPointFieldModel.getSomeListByProjectIdAndWeType(fields,'','')
            let finalFieldList = [];
            if(weType && (weType ===2||weType === '2')){
                //获取项目字段
                finalFieldList = buryPointFields
            }else{
                // 获取通用字段
                const weFieldList = await BuryPointFieldModel.getSomeListByProjectIdAndWeType('',req.projectId,1);
                finalFieldList = [...buryPointFields, ...weFieldList]
            }
            const pointAndFields = global.eventInfo.pointAndFields
            let pointData = {}
            pointData.finalFieldList = finalFieldList
            pointData.pointId = ret.id
            pointData.weType = weType
            pointAndFields[pointId] = pointData

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '')
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
    }

    /**
     * @swagger
     * /buryPointWarehouse/update:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 更新
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: projectId 
     *         description: 项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointName
     *         description: 点位名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointDesc
     *         description: 点位描述
     *         in: formData
     *         required: false
     *         type: string
     *       - name: fields
     *         description: 字段IDS
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async update(ctx) {
        let req = JSON.parse(ctx.request.body);
        let id = req.id;
        const {nickname} = ctx.user
        req.updateBy = nickname
        if (req) {
            req.pointId = id
            await BuryPointWarehouseModel.update(id, req);

            //TODO 往缓存存放字段和点位信息
            const { pointId, fields,weType } = req
            let buryPointFields = await BuryPointFieldModel.getSomeListByProjectIdAndWeType(fields,'','')
            let finalFieldList = [];
            if(weType && (weType ===2||weType === '2')){
                //获取项目字段
                finalFieldList = buryPointFields
            }else{
                // 获取通用字段
                const weFieldList = await BuryPointFieldModel.getSomeListByProjectIdAndWeType('',req.projectId,1);
                finalFieldList = [...buryPointFields, ...weFieldList]
            }
            const pointAndFields = global.eventInfo.pointAndFields
            let pointData = {}
            pointData.finalFieldList = finalFieldList
            pointData.pointId = pointId
            pointData.weType = weType
            pointAndFields[pointId] = pointData

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail')
        }
    }

    /**
     * @swagger
     * /buryPointWarehouse/detail:
     *   get:
     *     tags:
     *       - 点位仓库
     *     summary: 详情
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async detail(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        let id = param.id;
        if (id) {
            let data = await BuryPointWarehouseModel.detail(id);
            const { fields } = data
            let buryPointFields = await BuryPointFieldModel.getListByFieldIds(fields)
            const point = {};
            point.id = id
            point.pointId = data.pointId
            point.weType = data.weType
            point.pointName = data.pointName
            point.projectId = data.projectId
            point.pointDesc = data.pointDesc
            point.weType = data.weType
            point.replacePointIdKey = data.replacePointIdKey
            point.fields = data.fields
            point.buryPointFieldList = buryPointFields
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', point)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail');
        }
    }

    /**
     * @swagger
     * /buryPointWarehouse/delete:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 删除
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async delete(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param
        // 删除前，先检查是否sdk发布还有该点位仓库
        const resSdkList = await SdkReleaseModel.getAllList();
        for (let i = 0 ; i < resSdkList.length; i++) {
            const sdk = resSdkList[i];
            const { releaseName,pointIds } = sdk
            let pointIdArray = pointIds.split(",")
            for (let j = 0;j<pointIdArray.length; j++){
                if (parseInt(id,10) === parseInt(pointIdArray[j],10)){
                    ctx.response.status = 412;
                    let message = `${Utils.b64DecodeUnicode(ConstMsg.POINT_DELETE_FAIL_1)}`+ releaseName +`${Utils.b64DecodeUnicode(ConstMsg.POINT_DELETE_FAIL_2)}`
                    ctx.body = statusCode.ERROR_412(message)
                    return;
                }
            }
        }    
        await BuryPointWarehouseModel.delete(id)
        //清空
        global.eventInfo.pointAndFields[id] = {}

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
        
    }

    /**
     * @swagger
     * /buryPointWarehouse/page:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 获取分页列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointName
     *         description: 点位名称
     *         in: formData
     *         required: false
     *         type: string
     *       - name: page
     *         description: 当前页
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 页面大小
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getPageList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId, pointName="", weType='',page, pageSize } = params;
        const total = await BuryPointWarehouseModel.getPageCount(projectId, pointName, weType)
        const totalCount = total[0].count
        const res = await BuryPointWarehouseModel.getPageList(projectId, pointName,weType, page, pageSize)
        const resSdkList = await SdkReleaseModel.getAllList();
        for (let i = 0; i < res.length; i ++) {
            const buryPointWarehouse = res[i]
            let fieldNames = '';
            const { fields } = buryPointWarehouse
            let buryPointFieldList = await BuryPointFieldModel.getListByFieldIds(fields)
            for(let j = 0; j < buryPointFieldList.length; j ++){
                fieldNames = fieldNames + buryPointFieldList[j].fieldAlias + ','
            }
            //第一种方法、将字符串中最后一个元素","逗号去掉，
            fieldNames = fieldNames.substring(0, fieldNames.lastIndexOf(','));
            buryPointWarehouse.fieldNames = fieldNames
            // 是否可编辑，先检查是否sdk发布还有该点位仓库
            let isEdit = 1
            for (let k = 0 ; k < resSdkList.length; k++) {
                const sdk = resSdkList[k];
                const { pointIds } = sdk
                let pointIdArray = pointIds.split(",")
                for (let s = 0;s<pointIdArray.length; s++){
                    if (parseInt(buryPointWarehouse.id,10) === parseInt(pointIdArray[s],10)){
                        isEdit = 0
                    }
                }
            }  
            buryPointWarehouse.isEdit = isEdit
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', {list: res,totalCount})
    }

    /**
     * @swagger
     * /buryPointWarehouse/list:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 获取列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointName
     *         description: 点位名称
     *         in: formData
     *         required: false
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId, pointName=""} = params;
        //只显示项目点位，不显示通用点位和备用点位
        const res = await BuryPointWarehouseModel.getList(projectId,pointName,0)
        for (let i = 0; i < res.length; i ++) {
            const buryPointWarehouse = res[i]
            let fieldNames = '';
            const { fields } = buryPointWarehouse
            let buryPointFieldList = await BuryPointFieldModel.getListByFieldIds(fields)
            for(let j = 0; j < buryPointFieldList.length; j ++){
                fieldNames = fieldNames + buryPointFieldList[j].fieldAlias + ','
            }
            //第一种方法、将字符串中最后一个元素","逗号去掉，
            fieldNames = fieldNames.substring(0, fieldNames.lastIndexOf(','));
            buryPointWarehouse.fieldNames = fieldNames
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
     * @swagger
     * /buryPointWarehouse/getProjectAndWeList:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 获取项目点位和通用点位列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointName
     *         description: 点位名称
     *         in: formData
     *         required: false
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getAllPointList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId, pointName=""} = params;
        // 获取通用字段
        const weFieldList = await BuryPointFieldModel.getListByProjectIdAndWeType(projectId,1);
        //显示项目点位0,通用点位1,备用点位2（老点位）
        const res = await BuryPointWarehouseModel.getAllListByProjectId(projectId);
        for (let i = 0; i < res.length; i ++) {
            const buryPointWarehouse = res[i]
            let fieldNames = '';
            let fieldIds = ''
            let { fields } = buryPointWarehouse
            const buryPointFieldList = await BuryPointFieldModel.getListByFieldIds(fields)
            
            const finalFieldList = [...buryPointFieldList, ...weFieldList]
            for(let j = 0; j < finalFieldList.length; j ++){
                fieldNames = fieldNames + finalFieldList[j].fieldAlias + ','
                fieldIds += finalFieldList[j].fieldName + ','
            }
            //第一种方法、将字符串中最后一个元素","逗号去掉，
            fieldNames = fieldNames.substring(0, fieldNames.lastIndexOf(','));
            fieldIds = fieldIds.substring(0, fieldIds.lastIndexOf(','));
            buryPointWarehouse.fieldNames = fieldNames
            buryPointWarehouse.fields = fieldIds
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
     * @swagger
     * /buryPointWarehouse/getProjectAndOldList:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 获取项目点位和备用点位列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointName
     *         description: 点位名称
     *         in: formData
     *         required: false
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getProjectAndOldList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId, pointName=""} = params;
        // 获取通用字段
        const weFieldList = await BuryPointFieldModel.getListByProjectIdAndWeType(projectId,1);
        //显示项目点位0,通用点位1,备用点位2（老点位）
        const res = await BuryPointWarehouseModel.getListByProjectIdAndOldType(projectId);
        for (let i = 0; i < res.length; i ++) {
            const buryPointWarehouse = res[i]
            let fieldNames = '';
            let fieldIds = ''
            let { fields } = buryPointWarehouse
            const buryPointFieldList = await BuryPointFieldModel.getListByFieldIds(fields)
            
            const finalFieldList = [...buryPointFieldList, ...weFieldList]
            for(let j = 0; j < finalFieldList.length; j ++){
                fieldNames = fieldNames + finalFieldList[j].fieldAlias + ','
                fieldIds += finalFieldList[j].fieldName + ','
            }
            //第一种方法、将字符串中最后一个元素","逗号去掉，
            fieldNames = fieldNames.substring(0, fieldNames.lastIndexOf(','));
            fieldIds = fieldIds.substring(0, fieldIds.lastIndexOf(','));
            buryPointWarehouse.fieldNames = fieldNames
            buryPointWarehouse.fields = fieldIds
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
     * @swagger
     * /buryPointWarehouse/AllList:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 获取所有点位列表
     *     parameters:
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getAllList(ctx) {
        const res = await BuryPointWarehouseModel.getAllList()
        for (let i = 0; i < res.length; i ++) {
            const buryPointWarehouse = res[i]
            let fieldNames = '';
            let fieldList = '';
            const { fields } = buryPointWarehouse
            let buryPointFieldList = await BuryPointFieldModel.getListByFieldIds(fields)
            for(let j = 0; j < buryPointFieldList.length; j ++){
                fieldNames = fieldNames + buryPointFieldList[j].fieldAlias + ','
                fieldList = fieldList + buryPointFieldList[j].fieldName + ','
            }
            fieldNames = fieldNames.substring(0, fieldNames.lastIndexOf(','));
            buryPointWarehouse.fieldNames = fieldNames
            fieldList = fieldList.substring(0, fieldList.lastIndexOf(','));
            buryPointWarehouse.fieldList = fieldList
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
     * 复制点位
     * 参数：
     *   projectId-要复制到的项目id，
     *   pointId-被复制的点位id
     *   fieldIds-新字段ids
     * 逻辑：
     *   新建点位，判断逻辑：根据projectId 和新字段ids，查询是否有一样的点位，
     *   一样就不创建，直接用，
     *   不一样就新建一个点位，名字重复就+"_copy"，不重复直接用改名字
     *   系统模板中：一开始没有点位和字段，要创建新的
     * @param ctx
     * @returns {Promise.<void>}
     */
    /**
     * @swagger
     * /buryPointWarehouse/copy:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 复制点位
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointId
     *         description: 点位id
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: createBy
     *         description: 
     *         in: formData
     *         required: false
     *         type: string    
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async copyPoint(projectId, pointId,nickname) {
        const pointDetail = await BuryPointWarehouseModel.detail(pointId);
        let {pointName,fields, pointDesc,weType,createBy} = pointDetail
        //老点位（备用点位）就直接返回pointId直接用
        if(weType && (weType === 2 || weType === '2' )){
            return pointId;
        }
        let newPoint = {};
        const res = await BuryPointWarehouseModel.checkName(projectId,pointName);
        let count = res[0].count
        if(count > 0){
            newPoint.pointName = pointName + '_copy'
        }else {
            newPoint.pointName = pointName 
        }
        let fieldList = fields.split(",");
        let newFieldIds = "";
        for(let i = 0;i<fieldList.length;i++){
            //新建字段，判断是否一样的标准：fieldName，fieldAlias，fieldType，fieldLength都一样才用，不一样就新建一个字段
            let retFieldId = await BuryPointFieldController.copyField(projectId,fieldList[i],nickname);
            newFieldIds = newFieldIds + retFieldId + ",";
        }
        newFieldIds = newFieldIds.substring(0, newFieldIds.lastIndexOf(','));
        //根据projectId 和新字段ids，查询是否有一样的点位，一样就不创建，直接用
        let pointInfo = await BuryPointWarehouseModel.getByProjectIdAndFieldIds(projectId,newFieldIds)
        if(pointInfo && pointInfo.length > 0){
            return pointInfo[0].id;
        }else {
            newPoint.createBy = createBy?createBy:nickname;
            newPoint.pointDesc = pointDesc;
            newPoint.fields = newFieldIds;
            newPoint.projectId = projectId;
            newPoint.weType = weType;
            let ret = await BuryPointWarehouseModel.create(newPoint);
            await BuryPointWarehouseModel.updateByFields({id:ret.id, pointId:ret.id});
            return ret.id;
        }
    }

     /**
     * 导入点位
     * 参数：
     *   projectId-要导入到的项目id，
     *   pointId-被导入的点位id
     * 逻辑：
     *   新建点位，判断逻辑：肯定会新建一个点位，名字重复就+"_copy"，不重复直接用改名字
     * @param ctx
     * @returns {Promise.<void>}
     */
    /**
     * @swagger
     * /buryPointWarehouse/pointExport:
     *   post:
     *     tags:
     *       - 点位仓库
     *     summary: 导入点位
     *     parameters:
     *       - name: projectId
     *         description: 项目id(event101)
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointIds
     *         description: 点位ids
     *         in: formData
     *         required: false
     *         type: string
     *       - name: allSelectProjectId
     *         description: 全选的项目id("event101")
     *         in: formData
     *         required: false
     *         type: string 
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async exportPoint(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { projectId,pointIds="",allSelectProjectId="" } = params;
        const {nickname} = ctx.user
        // let nickname = "小鱼儿"
        if(projectId && (pointIds||allSelectProjectId)){
            let pointArray = [];
            if(allSelectProjectId){
                let resPointIds = await BuryPointWarehouseModel.getIdsByProjetId(allSelectProjectId);
                for (let j = 0; j< resPointIds.length; j++){
                    pointArray.push(resPointIds[j].id)
                }
            }
            if(pointIds){
                let pointIdArray = pointIds.split(",");
                for (let i = 0; i< pointIdArray.length; i++){
                    pointArray.push(pointIdArray[i]);
                }
            }
            let countInfo = {};
            countInfo.successCount = 0;
            countInfo.repeatCount = 0;
            countInfo.repeatPoint = [];
            for (let i = 0; i< pointArray.length; i++){
                // await BuryPointWarehouseController.copyPoint(projectId,pointArray[i],nickname);
                const pointDetail = await BuryPointWarehouseModel.detail(pointArray[i]);
                let {pointName,fields, pointDesc} = pointDetail
                let newPoint = {};
                const res = await BuryPointWarehouseModel.checkName(projectId,pointName);
                let count = res[0].count
                if(count > 0){
                    newPoint.pointName = pointName + '_copy'
                }else {
                    newPoint.pointName = pointName 
                }
                let fieldList = fields.split(",");
                let newFieldIds = "";
                for(let i = 0;i<fieldList.length;i++){
                    //新建字段，判断是否一样的标准：fieldName，fieldAlias，fieldType，fieldLength都一样才用，不一样就新建一个字段
                    let retFieldId = await BuryPointFieldController.copyField(projectId,fieldList[i],nickname);
                    newFieldIds = newFieldIds + retFieldId + ",";
                }
                newFieldIds = newFieldIds.substring(0, newFieldIds.lastIndexOf(','));
                //根据projectId 和新字段ids，查询是否有一样的点位，一样就不创建，直接用
                let pointInfo = await BuryPointWarehouseModel.getByProjectIdAndFieldIds(projectId,newFieldIds)
                if(pointInfo && pointInfo.length > 0){
                    countInfo.repeatCount = countInfo.repeatCount + 1
                    countInfo.repeatPoint.push(pointInfo[0].pointName)
                }else {
                    newPoint.createBy = nickname;
                    newPoint.pointDesc = pointDesc;
                    newPoint.fields = newFieldIds;
                    newPoint.projectId = projectId;
                    newPoint.weType = 0;
                    let ret = await BuryPointWarehouseModel.create(newPoint);
                    await BuryPointWarehouseModel.updateByFields({id:ret.id, pointId:ret.id});
                    countInfo.successCount = countInfo.successCount + 1
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', countInfo)
        }else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail')
        }
    }
}

let webfunnyVersion = "1.5.42"
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
  // 接受并分类处理上传的日志
  static async handleLogInfoQueue() {
    CommonUpLog.handleLogInfoQueue()
  }

  // 接收消息队列里的信息
  static async startReceiveMsg() {
    try {
      const receiveMq = new RabbitMq()
      receiveMq.receiveQueueMsg("upload_log_event", async (logInfoStr, channelAck) => {
        try {
          const logInfo = JSON.parse(logInfoStr)
          //处理上报数据
          SdkReleaseController.handleUpEventData(logInfo);
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
   * 获取所有的表名
   */
  static async getAllTableList() {
    const res = await CommonModel.getAllTableList(accountInfo.mysqlConfig.write.dataBaseName)
    return res
  }

  /**
   * 启动数据删除
   */
  static async startDelete() {
    let countDay = parseInt(accountInfo.saveDays, 10) + 1
    const dateStr = Utils.addDays(0 - countDay).replace(/-/g, "")
    //获取所有event开头的表名
    const invalidTables = []
    const allTableList = await Common.getAllTableList();
    // console.log("数据库表:" + JSON.stringify(allTableList));
    allTableList.forEach((item) => {
      if (item.tableName.substr(item.tableName.length-8, item.tableName.length) < dateStr) {
        invalidTables.push(item.tableName)
      }
    })
    // console.log("删除数据库表:" + JSON.stringify(invalidTables));
    invalidTables.forEach(async (tableName) => {
      await Sequelize.dropSchema(tableName).then(() => {
        log.printInfo("成功删除数据库表: " + tableName)
      })
    })
    log.printInfo("表删除程序结束】")
  }

  static async deleteTableByWebMonitorId(webMonitorId, countDay) {
    log.printInfo("【根据projectId和pointId，即将开始表删除程序...")
    const dateStr = Utils.addDays(0 - countDay).replace(/-/g, "")

    const tables1 = [
      "BehaviorInfo",
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
   * 获取日志并发量列表
   */
  static async getConcurrencyByMinuteInHour(ctx) {
    const logCountInMinuteList = global.eventInfo.logCountInMinuteList
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {logCountInMinuteList})
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
    const { webfunnyNeedLogin, messageQueue, localServerDomain, localServerPort, localAssetsDomain, localAssetsPort, centerAssetsDomain, mainDomain, openMonitor } = accountInfo
    const { purchaseCodeEndDate, purchaseCodeValid, purchaseCodeType,purchaseCodeCardCount } = global.eventInfo
    //卡片总数(项目个数)
    const retCardCount = await BuryPointCardModel.getCountByNoSysType("");
    let cardUsedCount = isNaN(retCardCount[0].count) ? 0 : retCardCount[0].count;
    let cardLeaveCount = parseInt(purchaseCodeCardCount, 10) - parseInt(cardUsedCount, 10);

    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', 
      {
        cardLeaveCount,webfunnyVersion, webfunnyNeedLogin, messageQueue, purchaseCodeEndDate, purchaseCodeValid, pct: purchaseCodeType,
        localServerDomain, localServerPort, localAssetsDomain, localAssetsPort, centerAssetsDomain, mainDomain, adminUserCount, openMonitor
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

  static async test(ctx) {
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('success', {"Success":true,"IsSensitive":false,"SensitiveFields":[],"SensitiveLevel":"cell"})
  }
}


class BuryPointProjectController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = JSON.parse(ctx.request.body);
        const {nickname,companyId } = ctx.user
        req.createBy = nickname
        req.createBy = companyId
        if (req.name && req.type) {
            //项目
            let ret;
            if (req.type == 1) {
                const res = await BuryPointProjectModel.getCountByNameAndType(req.name, req.type);
                let count = res[0].count
                if(count > 0){
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_PROJECT_NAME_EXIST)}`)
                    return
                }
                //我的项目
                ret = await BuryPointProjectController.createNewProject(req.name,0,nickname,companyId);
                //默认创建该项目下的分组和分组下的页面
                let projectGroup = {};
                projectGroup.type = 2
                projectGroup.parentId = ret.id
                projectGroup.projectId = ret.projectId
                projectGroup.name = "默认分组"
                let projectGroupRet = await BuryPointProjectModel.create(projectGroup);
                let projectPage = {};
                projectPage.type = 3
                projectPage.parentId = projectGroupRet.id
                projectPage.projectId = ret.projectId
                projectPage.name = "默认页面"
                let pageRet = await BuryPointProjectModel.create(projectPage);
                //默认创建心跳检测数值卡片
                await CommonInitDataController.handleWeCardData(ret.projectId,pageRet.id,nickname);
            }else if (req.type == 2) {
                //分组
                if(req.parentId){
                    const res = await BuryPointProjectModel.getCountByNameAndParentAndType(req.name, req.parentId, req.type);
                    let count = res[0].count
                    if(count > 0){
                        ctx.response.status = 412;
                        ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_GROUP_NAME_EXIST)}`)
                        return
                    }
                    let parent = await BuryPointProjectModel.detail(req.parentId);
                    const {projectId} = parent
                    req.projectId = projectId
                    ret = await BuryPointProjectModel.create(req);
                }else {
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
                    return;
                }
            }else if (req.type == 3) {
                //页面
                if(req.parentId){
                    const res = await BuryPointProjectModel.getCountByNameAndParentAndType(req.name, req.parentId, req.type);
                    let count = res[0].count
                    if(count > 0){
                        ctx.response.status = 412;
                        ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_PAGE_NAME_EXIST)}`)
                        return
                    }
                    let parent = await BuryPointProjectModel.detail(req.parentId);
                    const {projectId} = parent
                    req.projectId = projectId
                    ret = await BuryPointProjectModel.create(req);
                }else {
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
                    return;
                }
            }
            const resProject = await BuryPointProjectModel.detail(ret.id);
            const project = {};
            project.id = resProject.id;
            project.projectId = resProject.projectId;
            project.title = resProject.name;
            project.parentId = resProject.parentId;
            project.key = resProject.id;
            project.type = resProject.type;
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, project)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
    }

    /**
     * 创建项目和项目下相关信息（通用字段、通用点位，分析表），返回项目信息
     * @param {*} projectInfo 
     * @param {*} nickname 
     * @returns 
     */
    static async createNewProject(projectName,sysType,nickname,companyId){
        let projectInfo = {}
        projectInfo.name = projectName
        projectInfo.sysType = sysType
        projectInfo.type = 1
        projectInfo.parentId = -1
        projectInfo.delStatus = 0
        projectInfo.createBy = nickname
        projectInfo.companyId = companyId
        let maxId = await BuryPointProjectModel.getMaxId();
        if(!maxId || maxId.length == 0 || maxId[0].maxId == null){
            projectInfo.projectId = "event101";
        }else{
            projectInfo.projectId = "event10" + (parseInt(maxId[0].maxId,10) + 1);
        }
        let ret = await BuryPointProjectModel.create(projectInfo);
        if(ret){
            //创建通用点位和通用字段
            await CommonInitDataController.initWeFieldAndPointData(projectInfo.projectId,nickname);
            //生成一个归类统计分析表
            let tableNameGroubBy = "BuryPointCardStatistics_" + projectInfo.projectId;
            CommonModel.createStatisticsTable(tableNameGroubBy);  
        }
        return ret;   
    }

    /**
     * 更新
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async update(ctx) {
        let req = JSON.parse(ctx.request.body);
        let id = req.id;
        const {nickname} = ctx.user
        req.updateBy = nickname
        if (req) {
            await BuryPointProjectModel.update(id, req);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_SUCCESS)}`, '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.UPDATE_FAIL)}`)
        }
    }

    /**
     * 删除
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id ,type} = param
        // 删除前，先检查是否还有
        if(id && type){
            if(type !== 3){
                // 删除分组前，先检查是否还有子项
                const resProject = await BuryPointProjectModel.getListByParentId(id);
                if (resProject.length > 0) {
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.PROJECT_DELETE_FAIL)}`)
                    return
                }
                if(type === 1){
                    // 删除项目前，先检查是否还有SDK发布在使用,有的话，删除掉SDK，提醒用户下线对应探针
                    const resBuryPointProject = await BuryPointProjectModel.detail(id);
                    SdkReleaseModel.deleteByProjectId(resBuryPointProject.projectId);
                    //解除模板关系，把模板projectId置为空
                    let updateTemplate = {}
                    updateTemplate.projectId = ''
                    updateTemplate.updateBy = nickname
                    BuryPointTemplateModel.updateProjectId(resBuryPointProject.projectId, updateTemplateDetail);
                }
            }else {
                // 删除页面前，先检查是否还有卡片
                const resCard = await BuryPointCardModel.checkName('',id);
                let count = resCard[0].count
                if(count > 0){
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.PROJECT_EXIST_CARD_DELETE_FAIL)}`)
                    return
                }
            }
            await BuryPointProjectModel.delete(id)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', "")
        }else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail')
        }
        
    }

    /**
     * tree
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async tree(ctx) {        
        const {userId, userType} = ctx.user
        const { teamProjectIds ,sysType=""} = JSON.parse(ctx.request.body)
        let projectList = []
        if (userType === USER_INFO.USER_TYPE_ADMIN || userType === USER_INFO.USER_TYPE_SUPERADMIN) {
            projectList = await BuryPointProjectModel.getAllProjectList(sysType)
        } else {
            projectList = await BuryPointProjectModel.getProjectListByWebMonitorIds(teamProjectIds,sysType)
        }

        // 如果激活码到期或者无效，永远只取第一个项目
        let result = projectList;
        // if (global.eventInfo.purchaseCodeValid && global.eventInfo.purchaseCodeValid === true) {
        //     result = projectList
        // } else if (projectList.length > 0) {
        //     result.push(projectList[0])
        // }
        let projectInfo = [];
        for (let i = 0; i < result.length; i ++) {
            const buryPointProject = result[i] 
            const { id } = buryPointProject
            const project = {};
            project.id = id;
            project.title = result[i].name;
            project.parentId = result[i].parentId;
            project.key = result[i].id;
            project.type = result[i].type;
            const groupList = await BuryPointProjectModel.getListByParentId(id);
            const groupInfo = [];
            for (let j = 0; j < groupList.length; j ++) {
                const buryPointGroup = groupList[j] 
                const { id } = buryPointGroup
                const group = {};
                group.id = id;
                group.parentId = groupList[j].parentId;
                group.title = groupList[j].name;
                group.key = groupList[j].id;
                group.type = groupList[j].type;
                const pageList = await BuryPointProjectModel.getListByParentId(id);
                const pageInfo = [];
                for (let k = 0; k < pageList.length; k ++) {
                    const page = {};
                    page.id = pageList[k].id;
                    page.parentId = pageList[k].parentId;
                    page.title = pageList[k].name;
                    page.key = pageList[k].id;
                    page.type = pageList[k].type;
                    pageInfo.push(page);
                }
                group.children = pageInfo;
                groupInfo.push(group);
            }
            project.children = groupInfo;
            projectInfo.push(project);
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', projectInfo)
    }

     /**
     * 得到项目下分组和看板
     * @param ctx
     * @returns {Promise.<void>}
     */
     static async getGroupAndPage(ctx) {        
        const { projectId } = JSON.parse(ctx.request.body)
        let groupInfoList = []
        let groupList = await BuryPointProjectModel.getProjectByProjectIdAndType(projectId, 2);
        for (let i = 0; i < groupList.length; i ++) {
            const buryPointGroup = groupList[i] 
            const { id } = buryPointGroup   
            const group = {};
            group.id = id;
            group.parentId = groupList[i].parentId;
            group.projectId = projectId;
            group.name = groupList[i].name;
            group.type = groupList[i].type;
            const pageList = await BuryPointProjectModel.getListByParentId(id);
            group.pageCount = pageList.length;
            const pageInfoList = [];
            for (let j = 0; j < pageList.length; j ++) {
                const page = {};
                page.id = pageList[j].id;
                page.parentId = pageList[j].parentId;
                page.name = pageList[j].name;
                page.type = pageList[j].type;
                page.projectId = projectId;
                pageInfoList.push(page);
            }
            group.pageList = pageInfoList;
            groupInfoList.push(group);
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', groupInfoList)
    }

    /**
     * 获取单个项目tree
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectTree(ctx) {        
        const { projectId } = JSON.parse(ctx.request.body)
        let groupInfoList = []
        if(projectId){
            let groupList = await BuryPointProjectModel.getProjectByProjectIdAndType(projectId, 2);
            for (let i = 0; i < groupList.length; i ++) {
                const buryPointGroup = groupList[i] 
                const { id } = buryPointGroup
                const group = {};
                group.id = id;
                group.parentId = groupList[i].parentId;
                group.title = groupList[i].name;
                group.key = groupList[i].id;
                group.type = groupList[i].type;
                const pageList = await BuryPointProjectModel.getListByParentId(id);
                group.pageCount = pageList.length;
                const pageInfo = [];
                for (let j = 0; j < pageList.length; j ++) {
                    const page = {};
                    page.id = pageList[j].id;
                    page.parentId = pageList[j].parentId;
                    page.title = pageList[j].name;
                    page.key = pageList[j].id;
                    page.type = pageList[j].type;
                    //2、查询所有卡片
                    let resCard = await BuryPointCardModel.coutCard('',page.id,'');
                    page.cardCount = resCard?resCard[0].count:0;
                    pageInfo.push(page);
                }
                group.children = pageInfo;
                groupInfoList.push(group);
            }
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', groupInfoList)

    }

    /**
     * 排序
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async sort(ctx) {
        let req = JSON.parse(ctx.request.body);
        let sortList = req.sortList;
        const { nickname } = ctx.user
        if (req) {
            for (let i = 0; i < sortList.length; i++) {
                const groupInfo = {};
                groupInfo.id = sortList[i].id
                groupInfo.sort = i + 1;
                groupInfo.updateBy = nickname
                await BuryPointProjectModel.update(sortList[i].id, groupInfo);
                let children = sortList[i].children;
                for (let j = 0; j < children.length; j++) {
                    const pageInfo = {};
                    pageInfo.id = children[j].id
                    pageInfo.sort = j + 1;
                    pageInfo.parentId = sortList[i].id;
                    pageInfo.updateBy = nickname
                    await BuryPointProjectModel.update(children[j].id, pageInfo);
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
        }
    }

    /**
     * 单个看板移动到其他分组
     * {
         "id":1, //看板id
         "parentId":1 //"分组ID"
        }
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async movePage(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { nickname } = ctx.user
        if (req) {
            req.updateBy = nickname
            await BuryPointProjectModel.update(req.id, req);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
        }
    }

    /**
     * getProjectList
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectList(ctx) {        
        const {userId, userType} = ctx.user
        const { teamProjectIds,sysType="" } = JSON.parse(ctx.request.body)
        // console.log("" + ctx.request.body);
        let projectList = []
        if (userType === USER_INFO.USER_TYPE_ADMIN || userType === USER_INFO.USER_TYPE_SUPERADMIN) {
            projectList = await BuryPointProjectModel.getAllProjectList(sysType)
        } else {
            projectList = await BuryPointProjectModel.getProjectListByWebMonitorIds(teamProjectIds,sysType)
        }
        // 如果激活码到期或者无效，永远只取第一个项目
        let result = projectList;
        // if (global.eventInfo.purchaseCodeValid && global.eventInfo.purchaseCodeValid === true) {
        //     result = projectList
        // } else if (projectList.length > 0) {
        //     result.push(projectList[0])
        // }
        let projectInfo = [];
        for (let i = 0; i < result.length; i ++) {
            const project = {};
            project.id = result[i].id;
            project.projectName = result[i].name;
            project.name = result[i].name;
            project.projectId = result[i].projectId;
            project.sysType = result[i].sysType;
            let reFieldCount = await BuryPointFieldModel.getPageCount(result[i].projectId,'','', '') ;
            project.fieldCount = isNaN(reFieldCount[0].count) ? 0 : reFieldCount[0].count;
            projectInfo.push(project);
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', projectInfo)
    }

    /**
     * 获取简单信息列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async projectSimpleListByWebmonitorIds(ctx) {
        const param = JSON.parse(ctx.request.body)
        const data = await BuryPointProjectModel.projectSimpleListByWebmonitorIds(param);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', data)
    }

    static async getAllProjectList(ctx) {
        const res = await BuryPointProjectModel.getAllProjectList("")
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async getAllList(ctx) {
        const res = await BuryPointProjectModel.getAllList()
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    static async addViewers(ctx) {
        const {webMonitorId, viewers} = JSON.parse(ctx.request.body)
        let res = await BuryPointProjectModel.updateProjectByField({projectId: webMonitorId, viewers, parentId: -1});
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
     * 复制看板到哪个项目哪个分组下
     * @param ctx
     * {
     *   "pageId":1,
     *   "newPageName":"看板新名称",
     *   "newProjectId":"event101",
     *   "newGroupId":12
     * }
     * 逻辑：
     * 1、根据pageId查询下面所有卡片
     * 2、遍历卡片，单个处理卡片，找到每个计算数据中的pointId
     * 3、根据pointId找到下面的点位字段
     * 4、根据字段名称判断该项目下是否有该点位字段，相同的字段名称的话，就新增一个字段+时间戳，key可以不变，
     * 比如性别字段：name就是性别20230404，key：xingBie
     * 5、点位也重新创建
     * 6、新建看板
    */
    /**
     * @swagger
     * /buryPointProject/copyPage:
     *   post:
     *     tags:
     *       - 项目管理
     *     summary: 复制看板
     *     parameters:
     *       - name: pageId
     *         description: 要复制的页面ID
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: newPageName
     *         description: 看板新名称
     *         in: formData
     *         required: true
     *         type: string 
     *       - name: newProjectId
     *         description: 新项目id（event101）
     *         in: formData
     *         required: true
     *         type: string 
     *       - name: newGroupId
     *         description: 新分组id
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async copyPage(ctx) {
        let req = JSON.parse(ctx.request.body);
        let pageId = req.pageId;
        let newPageName = req.newPageName;
        let newProjectId = req.newProjectId;
        let newGroupId = req.newGroupId;
        const { nickname } = ctx.user
        if (req) {
            //1、查询所有卡片
            let cardList = await BuryPointCardModel.getList('',pageId,'');
            //2、判断卡片余额
            let flag = await BuryPointCardController.judgeCardCount(cardList.length);
            if(flag === 1){
                ctx.response.status = 414;
                ctx.body = statusCode.ERROR_CARD_BALANCE_414("卡片余额不足")
                return
            }
            //3、检测新分组下是否有重名的看板，有的话加个时间戳
            let newPage = {};
            newPage.name = newPageName+ "_copy"
            newPage.projectId = newProjectId
            newPage.type = 3
            newPage.parentId = newGroupId
            newPage.createBy = nickname
            let retNewPage = await BuryPointProjectModel.create(newPage);
            let newPageId = retNewPage.id;
            let newPointIdArray = [];
            for(let i = 0;i < cardList.length;i++){
                let oldCard = cardList[i];
                let newCard = {};
                newCard.pageId = newPageId;
                newCard.name = oldCard.name;
                newCard.type = oldCard.type;
                newCard.sort = oldCard.sort;
                newCard.conversionCycle = oldCard.conversionCycle;
                newCard.groupByFlag = oldCard.groupByFlag;
                newCard.chartTableShow = oldCard.chartTableShow;
                newCard.togetherList = oldCard.togetherList;
                newCard.refreshFrequency = oldCard.refreshFrequency;
                let calcRuleJSON = JSON.parse(oldCard.calcRule);
                let newCalcRule = []
                let pointAndStepNameList = []
                for (let j = 0; j < calcRuleJSON.length; j++) {
                    //重新设置calcNameKey和点位id
                    let calcData = calcRuleJSON[j];
                    let calcName = calcData.calcName;
                    calcData.calcNameKey = slugify(calcName).replace(/-/g, "") + new Date().Format("yyyyMMddhhmmss");
                    let prePoint = calcData.prePoint;
                    let pointId = prePoint.pointId;
                    //3、新建点位，判断逻辑：新建或者取存在的一个点位，名字重复就+"_copy"，不重复直接用改名字
                    let newPointId = await BuryPointWarehouseController.copyPoint(newProjectId, pointId, nickname);
                    newPointIdArray.push(newPointId);
                    calcData.prePoint.pointId = newPointId;
                    let endPoint = calcData.endPoint;
                    if(endPoint){
                        //3、新建点位，判断逻辑：新建或者取存在的一个点位，名字重复就+"_copy"，不重复直接用改名字
                        let newEndPointId = await BuryPointWarehouseController.copyPoint(newProjectId, endPoint.pointId, nickname);
                        newPointIdArray.push(newEndPointId);
                        calcData.endPoint.pointId = newEndPointId;
                    }       
                    newCalcRule.push(calcData);
                    if (newCard.type === 5) {
                        pointAndStepNameList.push(newPointId);
                    }
                }
                newCard.calcRule = JSON.stringify(newCalcRule);
                //4、创建卡片
                let retCard = await BuryPointCardModel.create(newCard);
                //5、漏斗图创建点位和步骤关系
                if (newCard.type === 5) {
                    BuryPointCardController.saveFunnelPointRelation(pointAndStepNameList, retCard.id);
                }
            }
            //6、新建一个SDK发布
            // console.log("新点位 : " + JSON.stringify(newPointIdArray));
            //点位ids去重
            let newPointIdArraySetArr = [...new Set(newPointIdArray)];
            let newSdkRelease = {};
            newSdkRelease.projectId = newProjectId;
            newSdkRelease.releaseName = newPageName + '_copy';
            newSdkRelease.pointIds = newPointIdArraySetArr + "";
            newSdkRelease.releaseScript = "";
            newSdkRelease.status = 1;
            newSdkRelease.version = 'v1.0.0';
            newSdkRelease.createBy = nickname
            let ret = await SdkReleaseModel.create(newSdkRelease);
            if (ret) {
                let wePointIds = await BuryPointWarehouseModel.getPointIds(newProjectId, 1);
                if(wePointIds && wePointIds.length > 0){
                    for(let i=0;i<wePointIds.length;i++){
                        newPointIdArraySetArr.push(wePointIds[i].id);
                    }
                }
                //7、创建完成，要生成日志表表，选了几个点位仓库，就生成几张表
                for (let i = 0; i < newPointIdArraySetArr.length; i++) {
                    //默认生成今天的表
                    SdkReleaseController.createTableByDay(newProjectId, newPointIdArraySetArr[i], 0).catch((e) => {
                        log.printError("执行{" + newProjectId + "_" + newPointIdArraySetArr[i] + "}创建表报错：", e)
                    });
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
        }
    }

     /**
     * 项目导出为我的模块或者公共模板
     * 1、空数据：type=1,2，两个都生成
     * 2、我的模板存在了，点了保存，type=1，更新操作
     * 3、我的模板存在了，点了导出，type=1,2，更新或者新增
     * @param ctx
     * @returns {Promise.<void>}
     */
    /**
     * @swagger
     * /buryPointProject/templateExport:
     *   post:
     *     tags:
     *       - 项目管理
     *     summary: 项目导出
     *     parameters:
     *       - name: projectId
     *         description: 项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: type
     *         description: 导出模板类型：1-我的模板，2-公共模板("1,2")
     *         in: formData
     *         required: true
     *         type: string 
     *       - name: templateName
     *         description: 模板名称
     *         in: formData
     *         required: false
     *         type: string 
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async exportTemplate(ctx) {
        let req = JSON.parse(ctx.request.body);
        //projectId:项目id；type:1-公共模板，2-我的模版;templateName:模板名称
        const {projectId,type,templateName=""} = req
        const {nickname,userId} = ctx.user
        // let nickname = "小鱼儿"
        // let userId = 'f8589080-c886-11ed-9d76-09adb8624268'
        if (projectId && type) {
            //根据id查询分组和分组下的页面以及页面下的所有卡片
            let groupList = await BuryPointProjectModel.getProjectByProjectIdAndType(projectId, 2);
            let pageCount = 0
            let cardCount = 0
            let projectDetail = {};
            projectDetail.type = 1;
            projectDetail.projectId = projectId;
            let newGroupList = [];
            //点位id汇总
            let pointIds = [];
            for (let i = 0; i < groupList.length; i ++) {
                let groupDetail = {};
                groupDetail.id = groupList[i].id;
                groupDetail.name = groupList[i].name;
                groupDetail.type = groupList[i].type;
                groupDetail.sort = groupList[i].sort;
                let pageList = await BuryPointProjectModel.getListByParentId(groupList[i].id);
                pageCount = pageCount + pageList.length;
                let newPageList = [];
                for (let j = 0; j < pageList.length; j++) {
                    let pageDetail = {};
                    pageDetail.id = pageList[j].id;
                    pageDetail.name = pageList[j].name;
                    pageDetail.type = pageList[j].type;
                    pageDetail.sort = pageList[j].sort;
                    let cardList = await BuryPointCardModel.getList('',pageList[j].id,'');
                    cardCount = cardCount + cardList.length;
                    let newCardList = [];
                    for (let k = 0; k < cardList.length; k++) {
                        let cardDetail = {};
                        cardDetail.id = cardList[k].id
                        cardDetail.name = cardList[k].name;
                        cardDetail.type = cardList[k].type;
                        cardDetail.pageId = cardList[k].pageId;
                        cardDetail.conversionCycle = cardList[k].conversionCycle;
                        cardDetail.groupByFlag = cardList[k].groupByFlag;
                        cardDetail.chartTableShow = cardList[k].chartTableShow;
                        cardDetail.togetherList = cardList[k].togetherList
                        cardDetail.refreshFrequency = cardList[k].refreshFrequency
                        cardDetail.calcRule = cardList[k].calcRule
                        newCardList.push(cardDetail);
                        let calcRuleJSON = JSON.parse(cardList[k].calcRule)
                        for (let m = 0; m < calcRuleJSON.length;m++) {
                            let calcData = calcRuleJSON[m];
                            pointIds.push(calcData.prePoint.pointId);
                            let endPoint = calcData.endPoint;
                            if(endPoint){
                                pointIds.push(calcData.endPoint.pointId);
                            }       
                        }
                    }
                    pageDetail.cardList = newCardList
                    newPageList.push(pageDetail);
                }
                groupDetail.pageList = newPageList
                newGroupList.push(groupDetail);
            }
            projectDetail.groupList = newGroupList
            //点位ids去重
            let newPointIdArraySetArr = [...new Set(pointIds)];
            let pointList = [];
            for(let i=0;i<newPointIdArraySetArr.length;i++){
                let point = {}
                let pointId = newPointIdArraySetArr[i]
                let pointDetail = await BuryPointWarehouseModel.detail(pointId);
                point.pointId = pointId
                point.pointName = pointDetail.pointName
                point.pointDesc = pointDetail.pointDesc
                point.weType = pointDetail.weType
                point.replacePointIdKey = pointDetail.replacePointIdKey
                let buryPointFieldList = await BuryPointFieldModel.getListByFieldIds(pointDetail.fields)
                let fieldList = []
                for(let j = 0; j < buryPointFieldList.length; j ++){
                    let fieldDetail = {}
                    fieldDetail.fieldName = buryPointFieldList[j].fieldName
                    fieldDetail.fieldAlias = buryPointFieldList[j].fieldAlias
                    fieldDetail.fieldType = buryPointFieldList[j].fieldType
                    fieldDetail.fieldLength = buryPointFieldList[j].fieldLength
                    fieldDetail.fieldDesc = buryPointFieldList[j].fieldDesc
                    fieldDetail.groupByFlag = buryPointFieldList[j].groupByFlag
                    fieldDetail.weType = buryPointFieldList[j].weType
                    fieldList.push(fieldDetail)
                }
                point.fieldList = fieldList
                pointList.push(point);
            }
            let template = {};
            template.templatePoint = JSON.stringify(pointList);
            template.groupCount = groupList.length
            template.pageCount = pageCount
            template.cardCount = cardCount
            template.userId = userId
            template.detail = JSON.stringify(projectDetail);
            let typeArray = type.split(",");
            for(let i = 0;i < typeArray.length;i++){
                template.type = typeArray[i]
                if(template.type  === 1 || template.type  === '1'){
                    //我的模板：新增;公共模板：新增，不关联项目，没有projectId
                    template.projectId = projectId 
                    let existeTemplate = await BuryPointTemplateModel.existTempleta(projectId, '', userId);
                    if(existeTemplate && existeTemplate.length > 0){
                        template.updateBy = nickname;
                        await BuryPointTemplateModel.update(existeTemplate[0].id,template);
                    }else {
                        template.templateName = templateName
                        template.createBy = nickname;
                        await BuryPointTemplateModel.create(template);
                    }
                }else{
                    template.templateName = templateName
                    template.createBy = nickname;
                    await BuryPointTemplateModel.create(template);
                }
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', '');
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail')
        }
    }

    /**
     * @swagger
     * /buryPointProject/existTemplate:
     *   post:
     *     tags:
     *       - 项目管理
     *     summary: 项目是否有模板
     *     parameters:
     *       - name: projectId
     *         description: 项目ID
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async existTemplate(ctx){
        let req = JSON.parse(ctx.request.body);
        let projectId = req.projectId;
        const { userId } = ctx.user
        if(projectId){
            let res = await BuryPointTemplateModel.existTempleta(projectId, 1, userId);
            ctx.response.status = 200;
            if (res.length > 0) {
                ctx.body = statusCode.SUCCESS_200('success', '1');
            }else {
                ctx.body = statusCode.SUCCESS_200('success', '0');
            }
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail！')
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

    // const newString = `"purchase": {
    //   "purchaseCode": '${inputPurchaseCode}',
    //   "secretCode": '${inputSecretCode}',
    // }`
    // await fs.writeFile("./config_variable/config.json", newString, (err) => {
    //   if (err) {
    //     throw err;
    //   }
    // });

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


/**
 * 处理升级数据
 */
class WeHandleDataController {

    /**
     * 处理通用字段
     */
    /**
     * @swagger
     * /initWeFieldData:
     *   get:
     *     tags:
     *       - 处理数据
     *     summary: 处理通用字段数据
     *     parameters:
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async initWeFieldData(ctx){
        // const {nickname,userType} = ctx.user
        let nickname = "超级管理员"
        let userType = USER_INFO.USER_TYPE_SUPERADMIN
        //
        // if (userType !== USER_INFO.USER_TYPE_SUPERADMIN) {
        //     ctx.response.status = 200;
        //     ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')
        //     return
        // }
        //1、查询项目
        let projectList = await BuryPointProjectModel.getListByParentId(-1);
        for(let i=0;i<projectList.length;i++){
            const {projectId} = projectList[i]
            if(projectId === 'event101'){
                 await CommonInitDataController.handleWeFieldData(projectId,nickname)
            }
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')   
    }

    /**
     * 处理通用字段
     */
    /**
     * @swagger
     * /initWePointData:
     *   get:
     *     tags:
     *       - 处理数据
     *     summary: 处理通用点位数据
     *     parameters:
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async initWePointData(ctx){
        // const {nickname,userType} = ctx.user
        let nickname = "超级管理员"
        let userType = USER_INFO.USER_TYPE_SUPERADMIN
        //1、查询项目
        let projectList = await BuryPointProjectModel.getListByParentId(-1);
        for(let i=0;i<projectList.length;i++){
            const {projectId} = projectList[i]
            if(projectId === 'event101'){
                await CommonInitDataController.handleWePointData(projectId,nickname)
            }
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')
    }

    /**
     * 处理系统模板:
     * 1、从项目里面导出模板
     * 2、取出模板的detail字段里面内容，存到json文件中，文件给一个唯一的key标识，存在json中，防止重复创建
     * 3、默认生成两个模板：基础模板》一个简单的，只有demo里面6个卡片，创建项目；系统模板》一个是复杂点的，就是我们的电商模板，默认不创建项目
     * 4、怎么生成：
        拿到json中的唯一key，和模板表中字段key做比较，存在就更新，不存在就新增；
        模板创建项目：无限版都创建项目，非无限版只创建一个基础模板的项目
     * 5、系统项目每天不创建日志表
     */
    /**
     * @swagger
     * /initWeTemplateData:
     *   get:
     *     tags:
     *       - 处理数据
     *     summary: 处理系统模板
     *     parameters:
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async initWeTemplateData(ctx){
        // const {nickname,userType} = ctx.user
        let nickname = "webfunny"
        let userType = USER_INFO.USER_TYPE_SUPERADMIN
        if (weTemplateList && weTemplateList.length >0) {
            for(let i=0;i<weTemplateList.length;i++){
                //创建系统项目
                await WeHandleDataController.createWeProject(weTemplateList[i],nickname)    
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')
        }else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
    }

    static async createWeTemplateData(){
        log.printInfo("创建系统模板和项目开始");
        let nickname = "webfunny"
        if (weTemplateList && weTemplateList.length >0) {
            for(let i=0;i<weTemplateList.length;i++){
                //创建系统项目
                await WeHandleDataController.createWeProject(weTemplateList[i],nickname)    
            }
        }
    }


    /**
     * 埋点2.0升级
     * 字段和点位处理，跟项目绑定
     * 项目：sysType数据库sql新增该字段初始化0
     * 点位：weType数据库sql新增该字段初始化0
     * 字段：weType数据库sql新增该字段初始化0
     * 1、查询所有项目（设置sysType：0-我的项目，1-系统项目）
     * 2、遍历项目，查询每个项目的SDK发布
     * 3、遍历SDK发布，查询每个SDK下的点位
     * 4、遍历点位，查询每个点位下的字段（设置weType：0-项目点位，1-通用项目）
     * 5、遍历字段，为每个项目都创建一份字段（设置weType：0-项目字段，1-通用字段）
     * 6、遍历看板，为每个看板下的卡片找到对应的点位id
     */
    /**
     * @swagger
     * /upgradeVersion:
     *   get:
     *     tags:
     *       - 处理数据
     *     summary: 一键升级
     *     parameters:
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async upgradeVersion_2_0(ctx){
        // const {nickname,userType} = ctx.user
        let nickname = "超级管理员"
        let userType = USER_INFO.USER_TYPE_SUPERADMIN
        //1、查询项目
        let projectList = await BuryPointProjectModel.getListByParentIdAndSysType(-1,0);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, `升级中，${projectList.length*10}秒内请务在进行其他操作...`)
        for(let i=0;i<projectList.length;i++){
            const {projectId} = projectList[i]
            // if(projectId === 'event1075'){
                 //创建通用点位和通用字段
                CommonInitDataController.initWeFieldAndPointData(projectId,nickname);
                //升级字段，为每个项目重新创建一遍老的字段
                CommonInitDataController.handleOldFieldData(projectId,nickname)
                //升级字段，点位，卡片
                // CommonInitDataController.handleData(projectList[i],nickname)
            // }
        }
    }

    /**
     * 创建系统项目
     * @param {} weTemplate 
     */
    static async createWeProject(weTemplate,nickname){
        const { templateName, weKey,groupCount,pageCount,cardCount,templatePoint,detail } = weTemplate
        let existeTemplate = await BuryPointTemplateModel.existWeTempletaByWekey(weKey);
        if(existeTemplate && existeTemplate.length > 0){
            return
        }    
        let templateReq = {}
        templateReq.templateName = templateName
        templateReq.weKey = weKey
        templateReq.groupCount = groupCount
        templateReq.pageCount = pageCount
        templateReq.cardCount = cardCount
        templateReq.createBy = nickname;
        templateReq.templatePoint = "{}";
        templateReq.detail = "{}";
        templateReq.type = 3;
        let retTemplate = await BuryPointTemplateModel.create(templateReq);

        // let projectJson = JSON.parse(detail);
        let projectJson = detail;
        //1、新建项目
        let projectName = templateName + "项目";
        //系统项目:sysType = 1
        let retProject = await BuryPointProjectController.createNewProject(projectName,1,nickname,'');
        let newProjectId = retProject.projectId
        //2、创建系统项目下的点位和字段，并返回点位id的对应关系，为创建卡片找到对应的点位和字段
        let pointRelationList = await CommonInitDataController.initWeTemplatePointAndField(newProjectId,templatePoint,nickname);
        //3、新建分组
        let groupList = projectJson.groupList
        let newGroupList = [];
        //点位id汇总
        let pointIds = [];
        for(let i=0;i<groupList.length;i++){
            let groupInfo = {}
            groupInfo.name =  groupList[i].name;
            groupInfo.type = 2
            groupInfo.sort = groupList[i].sort
            groupInfo.parentId = retProject.id
            groupInfo.projectId = newProjectId
            groupInfo.createBy = nickname
            let retGroup = await BuryPointProjectModel.create(groupInfo);
            //3、新建看板
            let pageList = groupList[i].pageList
            
            //新模版分组
            let groupDetail = {}
            groupDetail.id = retGroup.id;
            groupDetail.name = groupList[i].name;
            groupDetail.type = groupList[i].type;
            groupDetail.sort = groupList[i].sort;
            let newPageList = [];

            for(let j=0;j<pageList.length;j++){
                let pageInfo = {}
                pageInfo.name =  pageList[j].name;
                pageInfo.type = 3
                pageInfo.sort = pageList[j].sort
                pageInfo.parentId = retGroup.id
                pageInfo.projectId = newProjectId
                pageInfo.createBy = nickname
                let retPage = await BuryPointProjectModel.create(pageInfo);
                //4、新建卡片
                let cardList = pageList[j].cardList
                
                //新模版看板
                let pageDetail = {};
                pageDetail.id = retPage.id;
                pageDetail.name = pageList[j].name;
                pageDetail.type = pageList[j].type;
                pageDetail.sort = pageList[j].sort;
                let newCardList = [];

                for(let k=0;k<cardList.length;k++){
                    let oldCard = cardList[k];
                    let newCard = {};
                    newCard.pageId = retPage.id;
                    newCard.name = oldCard.name;
                    newCard.type = oldCard.type;
                    newCard.sort = oldCard.sort;
                    newCard.conversionCycle = oldCard.conversionCycle;
                    newCard.groupByFlag = oldCard.groupByFlag;
                    newCard.chartTableShow = oldCard.chartTableShow;
                    newCard.togetherList = oldCard.togetherList;
                    newCard.refreshFrequency = oldCard.refreshFrequency;
                    let calcRuleJSON = JSON.parse(oldCard.calcRule);       
                    let newCalcRule = []
                    let pointAndStepNameList = []
                    for (let m = 0; m < calcRuleJSON.length;m++) {
                        //重新设置calcNameKey和点位id
                        let calcData = calcRuleJSON[m];
                        let calcName = calcData.calcName;
                        calcData.calcNameKey = slugify(calcName).replace(/-/g, "") + new Date().Format("yyyyMMddhhmmss");
                        let prePoint = calcData.prePoint;
                        let pointId = prePoint.pointId;
                        //5、得到新点位
                        let newPointId = await CommonInitDataController.getNewPointId(pointId,pointRelationList);
                        // newPointIdArray.push(newPointId);
                        calcData.prePoint.pointId = newPointId;
                        pointIds.push(newPointId);
                        let endPoint = calcData.endPoint;
                        if(endPoint){
                            //6、得到新点位
                            let newEndPointId = await CommonInitDataController.getNewPointId(pointId,pointRelationList);
                            // newPointIdArray.push(newEndPointId);
                            calcData.endPoint.pointId = newEndPointId;
                            pointIds.push(newEndPointId);
                        }       
                        newCalcRule.push(calcData);
                        if (newCard.type === 5) {
                            pointAndStepNameList.push(newPointId);
                        }
                    }
                    newCard.calcRule = JSON.stringify(newCalcRule);
                    newCard.createBy = nickname
                    //7、创建卡片
                    let retCard = await BuryPointCardModel.create(newCard);
                    //8、漏斗图创建点位和步骤关系
                    if (newCard.type === 5) {
                        BuryPointCardController.saveFunnelPointRelation(pointAndStepNameList, retCard.id);
                    }

                    //新模版卡片
                    let cardDetail = {};
                    cardDetail.id = retCard.id;
                    cardDetail.name = cardList[k].name;
                    cardDetail.type = cardList[k].type;
                    cardDetail.conversionCycle = cardList[k].conversionCycle;
                    cardDetail.groupByFlag = cardList[k].groupByFlag;
                    cardDetail.chartTableShow = cardList[k].chartTableShow;
                    cardDetail.togetherList = cardList[k].togetherList
                    cardDetail.refreshFrequency = cardList[k].refreshFrequency
                    cardDetail.calcRule = newCard.calcRule
                    newCardList.push(cardDetail);

                }
                pageDetail.cardList = newCardList
                newPageList.push(pageDetail);
            }
            groupDetail.pageList = newPageList
            newGroupList.push(groupDetail);
        }
        //最后更新还是创建模板
        let projectDetail = {};
        projectDetail.groupList = newGroupList
        //点位ids去重
        let newPointIdArraySetArr = [...new Set(pointIds)];
        let pointList = [];
        for(let i=0;i<newPointIdArraySetArr.length;i++){
            let point = {}
            let pointId = newPointIdArraySetArr[i]
            let pointDetail = await BuryPointWarehouseModel.detail(pointId);
            point.pointId = pointId
            point.pointName = pointDetail.pointName
            point.pointDesc = pointDetail.pointDesc
            point.weType = pointDetail.weType
            point.replacePointIdKey = pointDetail.replacePointIdKey
            let buryPointFieldList = await BuryPointFieldModel.getListByFieldIds(pointDetail.fields)
            let fieldList = []
            for(let j = 0; j < buryPointFieldList.length; j ++){
                let fieldDetail = {}
                fieldDetail.fieldName = buryPointFieldList[j].fieldName
                fieldDetail.fieldAlias = buryPointFieldList[j].fieldAlias
                fieldDetail.fieldType = buryPointFieldList[j].fieldType
                fieldDetail.fieldLength = buryPointFieldList[j].fieldLength
                fieldDetail.fieldDesc = buryPointFieldList[j].fieldDesc
                fieldDetail.groupByFlag = buryPointFieldList[j].groupByFlag
                fieldDetail.weType = buryPointFieldList[j].weType
                fieldList.push(fieldDetail)
            }
            point.fieldList = fieldList
            pointList.push(point);
        }
        let templateUpdate = {}
        templateUpdate.templatePoint = JSON.stringify(pointList);
        templateUpdate.projectId = newProjectId
        templateUpdate.detail = JSON.stringify(projectDetail);
        templateUpdate.id = retTemplate.id;
        await BuryPointTemplateModel.update(templateUpdate.id,templateUpdate);    
    }

    /**
     * {
    "cardId": 319,
    "type": 6,
    "cardName": "心跳次数",
    "conversionCycle": 1,
    "groupByFlag": 0,
    "chartTableShow": "chart",
    "togetherList": "total,average,yoyRatio,ringRatio",
    "refreshFrequency": 30,
    "refreshTime": "2023-04-29 23:26:42",
    "statisticList": [{
        "calcTotail": 1,
        "calcData": [],
        "calcName": "数量",
        "unit": "次"
    }]
}
     */
    static async createDemoTemplateData(){
        let newBaseTemplateCardList = []
        for(let i=0;i<baseTemplateCardList.length;i++){
            let cardDetail = baseTemplateCardList[i]
            let newStatisticDetail = []
            // console.log("cardDetail:" + JSON.stringify(cardDetail))
            for(let j=0;j<cardDetail.statisticList.length;j++){
                let statisticDetail = cardDetail.statisticList[j]
                let calcType = statisticDetail.calcType
                let newCalcData = []
                if(calcType){
                    for(let k = 0;k<30;k++){
                        let info = {}
                        info.count = Math.floor((Math.random()*100));
                        info.happenDate = "04-0" + k;
                        newCalcData.push(info);
                    }
                }else{
                    for(let k = 0;k<30;k++){
                        let info = {}
                        info.count = Math.floor((Math.random()*1000)+1000);
                        info.happenDate = "04-0" + k;
                        newCalcData.push(info);
                    }
                }
                statisticDetail.calcData = newCalcData
                newStatisticDetail.push(statisticDetail)
            }
            cardDetail.statisticList = newStatisticDetail
            newBaseTemplateCardList.push(cardDetail)
        }
        console.log(JSON.stringify(newBaseTemplateCardList))
    }
}

class SdkReleaseController {
    /**
     * @swagger
     * /sdkRelease/create:
     *   post:
     *     tags:
     *       - SDK发布
     *     summary: 创建
     *     parameters:
     *       - name: projectId 
     *         description: 项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: releaseName
     *         description: SDK名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointIds
     *         description: 点位ids
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async create(ctx) {
        let req = JSON.parse(ctx.request.body);
        const { nickname } = ctx.user
        req.createBy = nickname
        //根据选的点位和点位下的字段，调用生成脚本的模块，生成脚本，然后保存入库
        req.status = 1; //1发布成功，2发布失败
        req.version = 'v1.0.0';
        req.releaseScript = '';
        if (req.releaseName && req.projectId && req.pointIds && req.status && req.version) {
            // const res = await SdkReleaseModel.checkName('',req.releaseName, req.projectId).catch((e) => {
            //     log.error(e)
            // });
            // let count = (res)?res[0].count:0;
            // if (count > 0) {
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_NAME_EXIST)}`)
            //     return
            // }
            let poindIdArr = req.pointIds.split(",")
            await SdkReleaseController.createNewSdk(req.projectId,req.releaseName,poindIdArr,nickname)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_SUCCESS)}`, '')    
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_PARAM_FAIL)}`)
        }
    }

    /**
     * 创建sdk
     * @param {*} projectId 
     * @param {*} pointIds 
     * @param {*} nickname 
     * @returns 
     */
    static async createNewSdk(projectId,releaseName,pointIds,nickname){
        let newSdkRelease = {};
        newSdkRelease.projectId = projectId;
        newSdkRelease.releaseName = releaseName;
        newSdkRelease.pointIds = pointIds + "";
        newSdkRelease.releaseScript = "";
        newSdkRelease.status = 1;
        newSdkRelease.version = 'v1.0.0';
        newSdkRelease.createBy = nickname
        let ret = await SdkReleaseModel.create(newSdkRelease);
        if (ret) {
            //获取通用点位
            let wePointIds = await BuryPointWarehouseModel.getPointIds(projectId, 1);
            if(wePointIds && wePointIds.length > 0){
                for(let i=0;i<wePointIds.length;i++){
                    pointIds.push(wePointIds[i].id);
                }
            }
           //10、创建完成，要生成日志表表，选了几个点位仓库，就生成几张表
            for (let i = 0; i < pointIds.length; i++) {
                //默认生成今天的表
                SdkReleaseController.createTableByDay(projectId, pointIds[i], 0).catch((e) => {
                    log.printError("执行{" + projectId + "_" + pointIds[i] + "}创建表报错：", e)
                });
            }
        }
    }

    /**
     * 更新
     * 点位的变动，需要重新下载sdk，也将删除旧的日志表，今天的数据会丢失，请谨慎操作
     * @param ctx
     * @returns {Promise.<void>}
     */
    /**
     * @swagger
     * /sdkRelease/update:
     *   post:
     *     tags:
     *       - SDK发布
     *     summary: 更新
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: projectId 
     *         description: 项目ID
     *         in: formData
     *         required: true
     *         type: string
     *       - name: releaseName
     *         description: SDK名称
     *         in: formData
     *         required: true
     *         type: string
     *       - name: pointIds
     *         description: 点位ids
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async update(ctx) {
        let req = JSON.parse(ctx.request.body);
        let id = req.id;
        const { nickname } = ctx.user
        req.updateBy = nickname
        if (req) {
            const { projectId, pointIds } = req
            // const res = await SdkReleaseModel.checkName(id,req.releaseName, req.projectId).catch((e) => {
            //     log.error(e)
            // });
            // let count = (res)?res[0].count:0;
            // if (count > 0) {
            //     ctx.response.status = 412;
            //     ctx.body = statusCode.ERROR_412(`${Utils.b64DecodeUnicode(ConstMsg.CREATE_FAIL_NAME_EXIST)}`)
            //     return
            // }
            //和以前的点位作比较，移除的点位，要drop对应的日志表，
            //但是如果被同一个项目的其他sdk所用，也不支持删除日志表
            let oldRet = await SdkReleaseModel.detail(id);
            const oldPointIds = oldRet.pointIds;
            let ret = await SdkReleaseModel.update(id, req);
            if (ret) {
                //创建完成，要生成表，选了几个点位仓库，就生成几张表
                const pointIdArray = pointIds.split(",")
                //获取通用点位
                let wePointIds = await BuryPointWarehouseModel.getPointIds(projectId, 1);
                if(wePointIds && wePointIds.length > 0){
                    for(let i=0;i<wePointIds.length;i++){
                        pointIdArray.push(wePointIds[i].id);
                    }
                }
                for (let i = 0; i < pointIdArray.length; i++) {
                    //默认生成今天的表
                    SdkReleaseController.createTableByDay(projectId, pointIdArray[i], 0).catch((e) => {
                        log.printError("执行{" + projectId + "_" + pointIdArray[i] + "}创建表报错：", e)
                    });
                }
                SdkReleaseController.deleteLogTable(projectId, id, pointIdArray, oldPointIds);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('success', '');
            }
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail')
        }
    }

    /**
     * 编辑删除移除的点位日志表
     * 和以前的点位作比较，移除的点位，要drop对应的日志表，
     * 要比较两个点位列表是否有不一样的点位，有的话，再拿出来查询其他sdk是否有用到
     * 但是如果被同一个项目的其他sdk所用，也不支持删除日志表
     * @param {表名} invalidTables 
     */
    static async deleteLogTable(projectId, sdkId, pointIdArray, oldPointIds){
        const invalidTables = [];
        const oldPointIdArray = oldPointIds.split(",")
        //遍历老的，和新的比较，不一样再去查询是否其他sdk所用到
        var deletePointList = oldPointIdArray.filter(v => !pointIdArray.some((item) => item === v));
        for (let i = 0; i < deletePointList.length; i++) {
            const res = await SdkReleaseModel.checkPointIdByOthers(projectId, deletePointList[i],sdkId).catch((e) => {
                log.error(e)
            });
            let count = res[0].count
            if( count > 0){
                continue;
            }
            let tableName = Utils.setTableName(projectId + "_" + deletePointList[i] + "_", 0)
            invalidTables.push(tableName);     
        }
        if(invalidTables && invalidTables.length >0){
            let invalidTablesSet = new Set(invalidTables);
            let invalidTablesSetArr = [...invalidTablesSet];
            invalidTablesSetArr.forEach(async (tableName) => {
                await Sequelize.dropSchema(tableName).then(() => {
                    log.printInfo("成功删除日志表: " + tableName)
                })
            })
        }
        
    }

    /**
     * 删除
     * @param ctx
     * @returns {Promise.<void>}
     */
    /**
     * @swagger
     * /sdkRelease/delete:
     *   post:
     *     tags:
     *       - SDK发布
     *     summary: 删除
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async delete(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { id } = param
        // 删除前，先检查是否还有
        await SdkReleaseModel.delete(id)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', "")
    }

    /**
     * 获取sdk详情
     * 1、探针代码
     * 2、点位列表
     * @param {*} ctx 
     */
    /**
     * @swagger
     * /sdkRelease/detail:
     *   get:
     *     tags:
     *       - SDK发布
     *     summary: 详情
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async detail(ctx){
        const param = Utils.parseQs(ctx.request.url)
        let id = param.id;
        if (id) {
            let sdkRelease = await SdkReleaseModel.detail(id);
            const { projectId, pointIds, uploadDomain } = sdkRelease
            let sdkReleaseRes = {uploadDomain};
            sdkReleaseRes.projectId = projectId;
            let points = [];
            let wePointList = await BuryPointWarehouseModel.getList(projectId, '',1);
            let projectPointList = await BuryPointWarehouseModel.getListByPointIds(pointIds)
            for (let i = 0; i < projectPointList.length; i++) {
                const point = {}
                point.pointName = projectPointList[i].pointName
                point.pointId = projectPointList[i].id
                const pointData = await BuryPointWarehouseModel.detail(point.pointId);
                const { fields } = pointData
                const resFields = [];
                const resList = await BuryPointFieldModel.getListByFieldIdsAndWeType(fields,0)
                for (let j = 0 ; j < resList.length; j++) {
                    const resField = {};
                    resField.fieldName = resList[j].fieldName
                    resField.fieldAlias = resList[j].fieldAlias
                    resField.fieldType = resList[j].fieldType
                    resField.fieldDesc = resList[j].fieldDesc
                    resFields.push(resField);
                }
                point.fieldList = resFields
                points.push(point)
            }
            sdkReleaseRes.points = points
            //生成探针
            let releaseScriptH5 = await SdkReleaseController.getReleaseScript(sdkRelease, wePointList, projectPointList,"H5")
            sdkReleaseRes.h5Code = decodeURIComponent(releaseScriptH5)
            let releaseScriptUniapp = await SdkReleaseController.getReleaseScript(sdkRelease, wePointList, projectPointList, "Uniapp")
            sdkReleaseRes.uniappCode = decodeURIComponent(releaseScriptUniapp)
            let releaseScriptWechat = await SdkReleaseController.getReleaseScript(sdkRelease, wePointList, projectPointList, "Wechat")
            sdkReleaseRes.wechatCode = decodeURIComponent(releaseScriptWechat)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('success', sdkReleaseRes)
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('fail');
        }
    }
    /**
     * @swagger
     * /sdkRelease/page:
     *   post:
     *     tags:
     *       - SDK发布
     *     summary: 获取分页列表
     *     parameters:
     *       - name: projectId
     *         description: 项目id
     *         in: formData
     *         required: false
     *         type: string    
     *       - name: releaseName
     *         description: SDK名称
     *         in: formData
     *         required: false
     *         type: string 
     *       - name: teamProjectIds
     *         description: 所属项目ids
     *         in: formData
     *         required: false
     *         type: string 
     *       - name: status
     *         description: 状态
     *         in: formData
     *         required: false
     *         type: integer
     *       - name: page
     *         description: 当前页
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: pageSize
     *         description: 页面大小
     *         in: formData
     *         required: true
     *         type: integer
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async getPageList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { releaseName, teamProjectIds, projectId, status, page, pageSize } = params;
        const {userId, userType} = ctx.user
        let total = []
        let totalCount = 0
        let res = {} 
        if (userType === USER_INFO.USER_TYPE_ADMIN || userType === USER_INFO.USER_TYPE_SUPERADMIN) {
            total = await SdkReleaseModel.getPageCount(releaseName, '',projectId, status)
            res = await SdkReleaseModel.getPageList(releaseName, '',projectId, status, page, pageSize)
        } else {
            let projectList = "";
            if(teamProjectIds){
                const projectIdArray = teamProjectIds.split(",")
                for (let i = 0; i < projectIdArray.length; i++) {
                    if(projectIdArray[i].indexOf("event") != -1){
                        projectList = projectList + ',' + projectIdArray[i]
                    }
                }
            }
            total  = await SdkReleaseModel.getPageCount(releaseName, projectList, projectId, status)
            res = await SdkReleaseModel.getPageList(releaseName, projectList, projectId, status, page, pageSize)
        }
        totalCount = total[0].count
        for (let i = 0; i < res.length; i++) {
            const sdkRelease = res[i]
            const { projectId, pointIds } = sdkRelease
            let projectInfo = await BuryPointProjectModel.getProjectByProjectId(projectId)
            const { name } = projectInfo[0]
            sdkRelease.projectName = name;
            let points = [];
            let buryPointWarehouseList = await BuryPointWarehouseModel.getListByPointIds(pointIds)
            for (let j = 0; j < buryPointWarehouseList.length; j++) {
                const point = {}
                point.pointName = buryPointWarehouseList[j].pointName
                point.pointId = buryPointWarehouseList[j].id
                points.push(point)
            }
            sdkRelease.points = points
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', { list: res, totalCount })
    }

    /**
     * 列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getList(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { releaseName, projectId, status } = params;
        const res = await SdkReleaseModel.getList(releaseName, projectId, status)
        for (let i = 0; i < res.length; i++) {
            const sdkRelease = res[i]
            let pointNames = '';
            const { projectId, pointIds } = sdkRelease
            let projectInfo = await BuryPointProjectModel.getProjectByProjectId(projectId)
            const { name } = projectInfo[0]
            sdkRelease.projectName = name;
            let buryPointWarehouseList = await BuryPointWarehouseModel.getListByPointIds(pointIds)
            for (let j = 0; j < buryPointWarehouseList.length; j++) {
                pointNames = pointNames + buryPointWarehouseList[j].pointName + ","
            }
            pointNames = pointNames.substring(0, pointNames.lastIndexOf(','));
            sdkRelease.pointNames = pointNames
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
     * 全部
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getAllList(ctx) {
        const res = await SdkReleaseModel.getAllList()
        for (let i = 0; i < res.length; i++) {
            const sdkRelease = res[i]
            let pointNames = '';
            const { pointIds } = sdkRelease
            let buryPointWarehouseList = await BuryPointWarehouseModel.getListByPointIds(pointIds)
            for (let j = 0; j < buryPointWarehouseList.length; j++) {
                pointNames = pointNames + buryPointWarehouseList[j].pointName + ","
            }
            pointNames = pointNames.substring(0, pointNames.lastIndexOf(','));
            sdkRelease.pointNames = pointNames
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
    * 全部
    * @param ctx
    * @returns {Promise.<void>}
    */
    static async getAllList(ctx) {
        const res = await SdkReleaseModel.getAllList()
        for (let i = 0; i < res.length; i++) {
            const sdkRelease = res[i]
            let pointNames = '';
            const { pointIds } = sdkRelease
            let buryPointWarehouseList = await BuryPointWarehouseModel.getListByPointIds(pointIds)
            for (let j = 0; j < buryPointWarehouseList.length; j++) {
                pointNames = pointNames + buryPointWarehouseList[j].pointName + ","
            }
            pointNames = pointNames.substring(0, pointNames.lastIndexOf(','));
            sdkRelease.pointNames = pointNames
        }
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', res)
    }

    /**
     * 创建执行脚本请求
     */
    static async createReleaseScript(ctx) {
        let req = ctx.request.body
        const params = JSON.parse(req)
        const { id, type } = params;
        let sdkRelease = await SdkReleaseModel.detail(id)
        const { projectId, pointIds } = sdkRelease
        let wePointList = await BuryPointWarehouseModel.getList(projectId, '',1);
        let projectPointList = await BuryPointWarehouseModel.getListByPointIds(pointIds)
        let releaseScript = await SdkReleaseController.getReleaseScript(sdkRelease, wePointList,projectPointList, type)
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', releaseScript)
    }

    /**
     * 创建执行脚本方法
     * type取值H5，Uniapp，Wechat,Java
     */
    static async getReleaseScript(project, wePointList, projectPointList, type) {
        const { projectId, uploadDomain } = project
        let allPoints = [];
        let wePointIdList = []
        for (let i = 0; i < wePointList.length; i++) {
            allPoints.push(wePointList[i])
            const { id, weType,replacePointIdKey} = wePointList[i]
            let pointId = id
            wePointIdList.push({
                pointId,weType,replacePointIdKey
            });
        }
        for (let i = 0; i < projectPointList.length; i++) {
            allPoints.push(projectPointList[i])
        }
        let releaseScript = '';
        let typeFunction = 'window.';
        if (type == 'H5') {
            typeFunction = 'window.';
        } else if (type == 'Uniapp') {
            typeFunction = 'uni.';
        } else if (type == 'Wechat') {
            typeFunction = 'wx.';
        }
        for (let i = 0; i < allPoints.length; i++) {
            let point = allPoints[i]
            const { id, fields } = point
            let pointId = id;
            let buryPointFields = await BuryPointFieldModel.getListByFieldIds(fields)
            let fieldStr = '';
            for (let j = 0; j < buryPointFields.length; j++) {
                const field = buryPointFields[j];
                let { fieldName, fieldType, fieldLength } = field
                fieldType = Utils.convertFieldType(fieldType)
                fieldStr +=
                    `${fieldName}:{required:true,type:'${fieldType}',length:${fieldLength}},`;
            }
            releaseScript +=
                `${pointId}:{
                    fields:{${fieldStr}},
                    trackEvent(params){
                        if(${typeFunction}webfunnyEventValidateParams(params,this.fields)){
                            ${typeFunction}webfunnyEventUtils.setFirstActionTime('${pointId}');
                            var weFirstStepDay = ${typeFunction}webfunnyEventUtils.getFirstActionTime('${pointId}');
                            var customerInfo = ${typeFunction}webfunnyEventGetCustomerInfo();
                            for (var key in params) { if (typeof params[key] !== "number") { params[key] = ${typeFunction}webfunnyEventUtils.b64Code(params[key]) } };
                            ${typeFunction}webfunnyEventUtils.combineObject(params, {projectId: '${projectId}', pointId: '${pointId}'});
                            ${typeFunction}webfunnyEventUtils.combineObject(params, customerInfo);
                            ${typeFunction}webfunnyEventUtils.combineObject(params, {weFirstStepDay});
                            if(${typeFunction}WE_INIT_FLG === true){
                                ${typeFunction}webfunnyEventSendRequest([params]);
                            } else {
                                ${typeFunction}webfunnyEventStoreLogs(params);
                            }
                        }
                    }
                },`
        }
        releaseScript = releaseScript.replace(/[\n][ ]*/g, "")
        releaseScript = "{" + releaseScript + "}";
        // let eventTempleteCode = fs.readFileSync(`${path.resolve(__dirname, '..')}/lib/webfunny-track.web.umd.js`, 'utf-8');
        // eventTempleteCode = eventTempleteCode.replace(/$$$projectId$$$/g, projectId)
        let eventTempleteCode = ""
        let urlPath = "//";
        if (type == 'H5') {
            eventTempleteCode = fs.readFileSync(`${path.resolve(__dirname, '..')}/lib/webfunny-track.web.umd.js`, 'utf-8');
        } else if (type == 'Uniapp') {
            urlPath = "https://";
            eventTempleteCode = fs.readFileSync(`${path.resolve(__dirname, '..')}/lib/webfunny-track.uni.umd.js`, 'utf-8');
        } else if (type == 'Wechat') {
            urlPath = "https://";
            eventTempleteCode = fs.readFileSync(`${path.resolve(__dirname, '..')}/lib/webfunny-track.wx.umd.js`, 'utf-8');
        } else if (type == 'Java') {

        }
        // let eventCode = encodeURIComponent(eventTempleteCode.toString().replace(/\$\$\$webfunny-event-code\$\$\$/g, releaseScript));
        let uploadServerDomain = accountInfo.uploadServerDomain;
        if (!uploadServerDomain || uploadServerDomain === '' || uploadServerDomain === undefined) {
            uploadServerDomain = accountInfo.localServerDomain;
        }
        for (let i = 0; i < wePointIdList.length; i++) {
            const{ pointId, replacePointIdKey } = wePointIdList[i];
            eventTempleteCode = eventTempleteCode.replace(`$$$${replacePointIdKey}$$$`, pointId);
        }
        let finalUploadDomain = ""

        if (uploadDomain === null) {
            // null, 说明这个项目还未更新过uploadDomain，直接使用系统的
            finalUploadDomain = urlPath + uploadServerDomain
        } else if (uploadDomain === "") {
            // 空, 说明这个项目被用户主动设置了空uploadDomain，想使用location.origin进行上报
            finalUploadDomain = uploadDomain
        } else {
            // 有效, 正常赋值
            finalUploadDomain = urlPath + uploadDomain
        }

        let eventCodeNoEncode = eventTempleteCode.toString()
            .replace(/"\$\$\$webfunny-event-code\$\$\$"/g, releaseScript)
            .replace("$$$webfunny-event-domain$$$", finalUploadDomain)
            .replace(/\$\$\$projectId\$\$\$/g, projectId);
        let eventCode = encodeURIComponent(eventCodeNoEncode);
        return eventCode;
    }

    /**
     * 下载脚本文件
     * @param {}} ctx 
     */
    /**
     * @swagger
     * /sdkRelease/downLoad:
     *   get:
     *     tags:
     *       - SDK发布
     *     summary: 下载
     *     parameters:
     *       - name: id 
     *         description: 主键ID
     *         in: formData
     *         required: true
     *         type: integer 
     *       - name: type 
     *         description: 类型（H5，Uniapp，Wechat）
     *         in: formData
     *         required: true
     *         type: string
     *     responses: 
     *       200:
     *         description: '{"code":200,"msg":"success","data":[]}'
     */
    static async downloadScript(ctx) {
        const param = Utils.parseQs(ctx.request.url)
        let id = param.id;
        //TODO type取值H5，Uniapp，Wechat
        let type = param.type;
        //脚本写入文件
        const sdkPath = await SdkReleaseController.createScript(id, type);
        // 本地运行，可以改成 const path = `lib/` + sdkPath;
        const path = `event/lib/` + sdkPath;
        ctx.attachment(path);
        await send(ctx, path);
        /**
         * 定时任务 定时删除生成的脚本  开始 
         * */
        setTimeout(() => {
            //十分钟后删除脚本文件
            fs.unlinkSync(path);
        }, 6000 * 100);

    }

    /**
     * 生成脚本文件，返回路径
     * type取值H5，Uniapp，Wechat, Java
     */
    static async createScript(id, type) {
        let sdkRelease = await SdkReleaseModel.detail(id)
        const { projectId, pointIds } = sdkRelease
        let wePointList = await BuryPointWarehouseModel.getList(projectId, '',1);
        let projectPointList = await BuryPointWarehouseModel.getListByPointIds(pointIds)

        let releaseScript = await SdkReleaseController.getReleaseScript(sdkRelease, wePointList,projectPointList, type)

        const fs = require('fs');
        const path = require('path');
        const scriptPath = '../lib/';
        let templetePath = path.join(__dirname, scriptPath);
        let fileName = type + 'SdkReleaseScript' + new Date().Format('yyyyMMddhhmmss') + '.js';
        let targetFilePath = templetePath + fileName;
        let content = decodeURIComponent(releaseScript);
        fs.writeFile(targetFilePath, content, (err) => {
            if (err) throw err;
        });
        return fileName;
    }

    /**
     * 获取项目下卡片id和点位列表
     * @param {项目id} projectId 
     */
    static async getCardAndPointList(projectId) {
        let resList = [];
        if(global.eventInfo.funnelCardAndPointRelations[projectId]){
            resList = global.eventInfo.funnelCardAndPointRelations[projectId]
        }else{
            //找到项目下所有页面，页面下漏斗的数据
            let funnelCards = await BuryPointCardModel.getFunnelList(projectId);
            for (let j = 0; j < funnelCards.length; j++) {
                let cardReturn = {}
                const card = funnelCards[j];
                cardReturn.t = card.conversionCycle;
                cardReturn.c = card.id;
                //解析计算规则
                let calcRuleJson = JSON.parse(card.calcRule);
                if (calcRuleJson) {
                    let pointList = []
                    for (let k = 0; k < calcRuleJson.length; k++) {
                        let prePoint = calcRuleJson[k].prePoint;
                        let pointId = prePoint.pointId;
                        pointList.push(pointId);
                    }
                    cardReturn.s = pointList;
                }
                resList.push(cardReturn);
            }
            const funnelCardAndPointRelations = global.eventInfo.funnelCardAndPointRelations
            funnelCardAndPointRelations[projectId] = resList
        }
        return resList;
    }

    /**
    * 定时生成表
    */
    static async timerCreateTableByDay(day) {
        log.printInfo('定时执行生成今天和明天的表开始');
        const sdkReleaseList = await SdkReleaseModel.getAllList().catch((e) => {
            log.printError(e)
        });
        let createTableTimer = setInterval(async () => {
            //停掉timer
            if (createTableTimer && (sdkReleaseList && sdkReleaseList.length === 0)) {
                clearInterval(createTableTimer);
                return
            }
            let tempSdkRelease = sdkReleaseList.pop();
            //创建完成，要生成表，选了几个点位仓库，就生成几张表
            const { projectId, pointIds } = tempSdkRelease;
            const pointIdArray = pointIds.split(",")
            let wePointIds = await BuryPointWarehouseModel.getPointIds(projectId, 1);
            if(wePointIds && wePointIds.length > 0){
                for(let i=0;i<wePointIds.length;i++){
                    pointIdArray.push(wePointIds[i].id);
                }
            }
            for (let j = 0; j < pointIdArray.length; j++) {
                //默认生成今天和明天的表
                SdkReleaseController.createTableByDay(projectId, pointIdArray[j], day).catch((e) => {
                    log.printError("定时器执行{" + projectId + "_" + pointIdArray[j] + "}生成每天的表报错：", e)
                });
            }
        }, 10 * 1000);
        log.printInfo('定时执行生成今天和明天的表结束');
    }

    /**
     * 生成表：项目字段和通用字段
     */
    static async createTableByDay(projectId, pointId, day) {
        //创建表 表名：项目ID+点位仓库ID+日期
        let tableName = Utils.setTableName(projectId + "_" + pointId + "_", day);
        let rePoint = await BuryPointWarehouseModel.detail(pointId).catch((e) => {
            log.error(e)
        });
        if(rePoint){
            const { fields } = rePoint
            let fieldList = [];
            //项目字段
            fieldList = await BuryPointFieldModel.getListByFieldIds(fields).catch((e) => {
                log.error(e)
            });
            //通用字段
            const weFieldList = await BuryPointFieldModel.getListByProjectIdAndWeType(projectId,1);
            if(weFieldList && weFieldList.length >0){
                for (let i = 0 ; i < weFieldList.length; i++) {
                    fieldList.push(weFieldList[i]);
                }
            }
            CommonModel.createLogTable(tableName,fieldList).catch((e) => {
                log.error(e)
            });
        }
    }

    /**
     * 获取项目下卡片id和点位列表
     * @param {项目id} projectId 
     */
    static async getCardAndPointList(projectId) {
        let resList = [];
        //找到项目下所有页面，页面下漏斗的数据
        let funnelPages = await BuryPointProjectModel.getProjectByProjectIdAndType(projectId, 3);
        for (let i = 0; i < funnelPages.length; i++) {
            const page = funnelPages[i];
            let funnelCards = await BuryPointCardModel.getList("", page.id, 5);
            for (let j = 0; j < funnelCards.length; j++) {
                let cardReturn = {}
                const card = funnelCards[j];
                const { calcRule } = card
                cardReturn.t = card.conversionCycle;
                cardReturn.c = card.id;
                //解析计算规则
                let calcRuleJson = JSON.parse(calcRule);
                if (calcRuleJson) {
                    let pointList = []
                    for (let k = 0; k < calcRuleJson.length; k++) {
                        let prePoint = calcRuleJson[k].prePoint;
                        let pointId = prePoint.pointId;
                        pointList.push(pointId);
                    }
                    cardReturn.s = pointList;
                }
                resList.push(cardReturn);
            }
        }
        return resList;
    }
    /**
     * 更新上报域名
     */
    static async changeUploadDomain(ctx) {
        const params = JSON.parse(ctx.request.body)
        const { id, uploadDomain } = params;
        //找到项目下所有页面，页面下漏斗的数据
        await SdkReleaseModel.update(id, { uploadDomain })
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('success', 0);
    }
}

/**
 * 定时任务统计数据
 */
class TimerStatisticController {

    /**
     * 定时任务统计
     * @param type :类型
     * @returns {Promise.<void>}
     */
    static async test() {
        //TODO 统计数据入库统计表，重复就更新，不存在就插入
        // let existeData = await BuryPointCardModel.detail("49");
        // console.log(JSON.stringify(existeData));
        // TimerStatisticController.calculateDataPreDay('5', -1);
        TimerStatisticController.calculateDataPreDay('', 0);
    }

    /**
     * 定时任务统计
     * @param type :类型
     * @returns {Promise.<void>}
     */
    static async calculateDataPreDay(cardType, days) {
        //查询所有卡片，
        const resCards = await BuryPointCardModel.getAllList();
        let calcRuleTimer = setInterval(async () => {
            //停掉timer
            if (calcRuleTimer && resCards.length === 0) {
                clearInterval(calcRuleTimer);
                return
            }
            //删除最后一个，并返回最后一个
            let tempCard = resCards.pop();
            const { id,type,groupByFlag } = tempCard;
            if(type && type === 5){
                //漏斗图计算
                TimerStatisticController.calculateFunnelDataByCard(tempCard, days, 1);
            } else {
                //非漏斗图计算
                if(groupByFlag && groupByFlag === 1){
                    TimerStatisticController.calculateNoFunnelGroupByDataByCard(tempCard, days,1);
                }else {
                    TimerStatisticController.calculateNoFunnelDataByCard(tempCard, days,1);
                }
            }
            //更新卡片时间为刷新时间
            let updateCard = {};
            updateCard.id = id;
            updateCard.updateAt = new Date().Format("yyyy-MM-dd hh:mm:ss");
            BuryPointCardModel.update(id,updateCard);
        }, 10 * 1000);
    }

    /**
     * 定时任务统计
     * 归类的：2-多折线图，4-堆叠图,7-地图
     * 定时任务统计:
     * 不存在的记录，直接插入，存在的就更新
     * @param card :卡片
     * @param days :时间
     * @param refreshFlag :是否刷新操作，2-是，其他否
     * @returns {Promise.<void>}
     */
    static async calculateNoFunnelGroupByDataByCard(card, days, refreshFlag) {
        //type ：卡片类型，1-柱状图，2-多折线图，3-柱线图，4-堆叠图，5-漏斗图，6-数值，7-地图
        const { id, pageId, name, calcRule } = card
        //查询projectId
        let pageInfo = await BuryPointProjectModel.detail(pageId);
        if (pageInfo) {
            let projectId = pageInfo.projectId;
            //归类统计表：
            let statisticGroupByTableName = "BuryPointCardStatistics_" + projectId;
            //解析计算规则
            let calcRuleJson = JSON.parse(calcRule);
            //存放要新增或者更新的分析数据
            let saveOrUpdateCardStatisticList = [];
            let happenDate = new Date(new Date().getTime() + (parseInt(days,10)) * 86400000);
            for (let i = 0; i < calcRuleJson.length; i++) {
                let prePoint = calcRuleJson[i].prePoint;
                let calcName = calcRuleJson[i].calcName;                
                let pointIdPre = prePoint.pointId;
                let calcFieldPre = prePoint.calcField;
                let queryCriteriaPre = prePoint.queryCriteria;
                //查询天数偏移量,计算留存率，取值为0,-1.-2,-3到-6，老卡片没有day，默认为0（当天）
                let day = prePoint.day;
                if(!day || day === '' || day === undefined){
                    day = 0
                }
                //当天的数据
                let tableNamePre = Utils.setTableName(projectId + "_" + pointIdPre + "_", parseInt(days,10) + parseInt(day,10))
                let querySql = await TimerStatisticController.splicingGroupBySql(calcFieldPre, queryCriteriaPre, tableNamePre);
                let happenDateByDay = new Date(happenDate.getTime() + parseInt(day,10) * 86400000);
                //多个分组
                let groupByCountList = await TimerStatisticController.getCountByTableName(querySql)
                if(groupByCountList && groupByCountList.length > 0){
                    //统计数据入库统计表，重复就更新，不存在就插入
                    for(let j = 0; j < groupByCountList.length; j++){
                        let groupByName = groupByCountList[j].groupByName;
                        let count = groupByCountList[j].count;
                        const cardStatistic = {}
                        cardStatistic.pageId = pageId;
                        cardStatistic.cardId = id;
                        cardStatistic.cardName = name;
                        cardStatistic.count = isNaN(count) ? 0 : count;
                        cardStatistic.calcField = groupByName;
                        cardStatistic.happenDate = happenDateByDay.Format("yyyy-MM-dd") + ' 00:00:00';                         
                        cardStatistic.percentage = 0;
                        saveOrUpdateCardStatisticList.push(cardStatistic);
                        //报警：只统计当天的
                        if(days === 0 && refreshFlag !==2){
                            BuryPointAlarmMessageController.alarmNotice(id, name , calcName, groupByName, calcRuleJson[i].alarmId, pageId,card.alarmMembers,count,card.noticeWay);
                        }
                    }
                }else{
                     //报警：只统计当天的
                     if(days === 0 && refreshFlag !==2){
                        //更新卡片报警状态字段alarmStatus:0-不报警
                        let cardUpdate = {};
                        cardUpdate.id = id
                        cardUpdate.alarmStatus = 0
                        cardUpdate.updateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        BuryPointCardModel.update(id, cardUpdate);   
                    }
                }
             
                // if(statisticGroubByTableName && pageId && id && happenDateByDay){
                //     await SdkReleaseModel.deleteStatisticValues(
                //         statisticGroubByTableName,pageId,id,'',happenDateByDay.Format("yyyy-MM-dd"));
                // }
            }
            //批量操作
            // await TimerStatisticController.saveGroupByStatistic(statisticGroupByTableName,saveOrUpdateCardStatisticList);
            //批量操作
            await TimerStatisticController.saveOrUpdateGroupStatistic(statisticGroupByTableName,'', '',saveOrUpdateCardStatisticList);

        }
    }

    /**
     * 新增或者更新统计表数据
     * @param {*} countAndPercentageArr 
     * @param {*} saveCardStatisticList 
     * @param {*} updateCardStatisticList 
     */
    static async saveOrUpdateGroupStatistic(staticTableName,type,countAndPercentageArr,saveOrUpdateStatisticList){
        if (saveOrUpdateStatisticList.length > 0) {
            for (let i = 0; i < saveOrUpdateStatisticList.length; i++) {
                BuryPointCardStatisticsModel.createOrUpdate(saveOrUpdateStatisticList[i],staticTableName);
            }
        }
    }

     /**
     * 非归类的：1-柱状图，2-多折线图，3-柱线图，4-堆叠图，5-漏斗图，6-数值，7-地图
     * 定时任务统计
     * @param card :卡片
     * @param days :时间
     * @param refreshFlag :是否刷新操作，2-是，其他否
     * @returns {Promise.<void>}
     */
      static async calculateNoFunnelDataByCard(card, days,refreshFlag) {
        //type ：卡片类型，1-柱状图，2-多折线图，3-柱线图，4-堆叠图，5-漏斗图
        const { id, pageId, name, calcRule, type } = card
        //查询projectId
        let pageInfo = await BuryPointProjectModel.detail(pageId);
        if (pageInfo) {
            let projectId = pageInfo.projectId;
            //解析计算规则
            let calcRuleJson = JSON.parse(calcRule);
            if (calcRuleJson) {
                //存放每一步总数，好进行转化率计算
                let countAndPercentageArr = [];
                //存放要更新的分析数据
                let updateCardStatisticList = [];
                //存放要新增的分析数据
                let saveCardStatisticList = [];
                let happenDate = new Date(new Date().getTime() + parseInt(days,10) * 86400000);
                for (let i = 0; i < calcRuleJson.length; i++) {
                    let prePoint = calcRuleJson[i].prePoint;
                    let calcName = calcRuleJson[i].calcName;
                    let calcNameKey = calcRuleJson[i].calcNameKey;
                    let calcType = calcRuleJson[i].calcType;
                    let endPoint = calcRuleJson[i].endPoint;
                    //单位：老卡片为空
                    let unit = calcRuleJson[i].unit;

                    let pointIdPre = prePoint.pointId;
                    //查询天数偏移量,计算留存率，取值为0,-1.-2,-3到-6，老卡片没有day，默认为0（当天）
                    let day = prePoint.day;
                    if(!day || day === '' || day === undefined){
                        day = 0
                    }
                    let calcFieldPre = prePoint.calcField;
                    let queryCriteriaPre = prePoint.queryCriteria;
                    let fieldIndex = calcFieldPre.fieldIndex;

                    //当天的数据
                    let tableNamePre = Utils.setTableName(projectId + "_" + pointIdPre + "_", parseInt(days,10) + parseInt(day,10))
                    let querySql = await TimerStatisticController.splicingSql(calcFieldPre, queryCriteriaPre, tableNamePre);
                    let happenDateDay = new Date(happenDate.getTime() + parseInt(day,10) * 86400000);
                    let count = 0;
                    let countPre = await TimerStatisticController.getCount(tableNamePre, querySql)
                    if (calcType && endPoint) {
                        let pointIdEnd = endPoint.pointId;
                        let calcFieldEnd = endPoint.calcField;
                        let queryCriteriaEnd = endPoint.queryCriteria;
                        //查询天数偏移量,计算留存率，取值为0,-1.-2,-3到-6，老卡片没有day，默认为0（当天）
                        let day = endPoint.day;
                        if(!day || day === '' || day === undefined){
                            day = 0
                        }
                        //当天的数据
                        let tableNameEnd = Utils.setTableName(projectId + "_" + pointIdEnd + "_", parseInt(days,10) + parseInt(day,10))
                        let queryEndSql = await TimerStatisticController.splicingSql(calcFieldEnd, queryCriteriaEnd, tableNameEnd);
                        try {
                            let countEnd = await TimerStatisticController.getCount(tableNameEnd, queryEndSql);
                            if (calcType === '+') {
                                count = parseInt(countPre, 10) + parseInt(countEnd, 10);
                            } else if (calcType === '-') {
                                count = parseInt(countPre, 10) - parseInt(countEnd, 10);
                            } else if (calcType === '/') {
                                //单位是%的，就按照百分比计算
                                if((!unit) || unit === '' || (unit && unit != '%')){
                                   // 非百分比
                                   if (countEnd === 0) {
                                        count = 0;
                                    } else {
                                        count = Utils.toFixed(parseInt(countPre, 10) / parseInt(countEnd, 10), 2);
                                    }
                                }else{
                                    // 百分比，保存乘以100后的值
                                    if (countEnd === 0) {
                                        count = 0;
                                    } else {
                                        count = Utils.toFixed((parseInt(countPre, 10) / parseInt(countEnd, 10)) * 100, 2);
                                    }
                                    if(parseInt(count, 10)>100){
                                        count = 100
                                    }
                                }
                            } else {
                                count = parseInt(countPre, 10) * parseInt(countEnd, 10);;
                            }
                        } catch (e) {
                            log.error(e)
                        }
                    }else {
                        count = parseInt(countPre, 10)
                    }
                    //统计数据入库统计表，重复就更新，不存在就插入
                    //根据页面id，卡片id，计数名称，计数名称key，时间来查询已经统计过的数据
                    let existeData = await BuryPointCardStatisticsModel.getOne(pageId, id, '', calcNameKey, happenDateDay.Format("yyyy-MM-dd"));
                    if (existeData && existeData[0]) {
                        existeData[0].count = isNaN(count) ? 0 : count;
                        existeData[0].updateAt = new Date();
                        existeData[0].percentage = isNaN(existeData[0].percentage) ? 0 : existeData[0].percentage;
                        updateCardStatisticList.push(existeData[0]);
                    } else {
                        const cardStatistic = {}
                        cardStatistic.pageId = pageId;
                        cardStatistic.cardId = id;
                        cardStatistic.cardName = name;
                        cardStatistic.count = isNaN(count) ? 0 : count;
                        cardStatistic.calcField = calcName;
                        cardStatistic.calcFieldKey = calcNameKey;
                        cardStatistic.happenDate = happenDateDay.Format("yyyy-MM-dd hh:mm:ss");
                        cardStatistic.percentage = 0;
                        saveCardStatisticList.push(cardStatistic);
                    }
                    //报警：只统计当天的
                    if(days === 0 && refreshFlag !== 2){
                       BuryPointAlarmMessageController.alarmNotice(id, name , calcName, calcNameKey, calcRuleJson[i].alarmId, pageId,card.alarmMembers,count,card.noticeWay);
                    }
                }
                // console.log("要更新的：" + JSON.stringify(updateCardStatisticList));
                // console.log("要新增的：" + JSON.stringify(saveCardStatisticList));
                //批量操作
                await TimerStatisticController.saveOrUpdateStatistic(type, countAndPercentageArr,saveCardStatisticList,updateCardStatisticList);
            }
        }
    }

    /**
     * 5-漏斗图
     * 定时任务统计
     * @param card :卡片
     * @param days :时间
     * @param refreshFlag :是否刷新操作，2-是，其他否
     * @returns {Promise.<void>}
     */
    static async calculateFunnelDataByCard(card, days,refreshFlag) {
        //type ：卡片类型，1-柱状图，2-多折线图，3-柱线图，4-堆叠图，5-漏斗图
        const { id, pageId, name, calcRule, type, conversionCycle, statisticList } = card
        //查询projectId
        let pageInfo = await BuryPointProjectModel.detail(pageId);
        if (pageInfo) {
            let projectId = pageInfo.projectId;
            //解析计算规则
            let calcRuleJson = JSON.parse(calcRule);
            if (calcRuleJson) {
                //存放每一步总数，好进行转化率计算
                let countAndPercentageArr = [];
                //存放要更新的分析数据
                let updateCardStatisticList = [];
                //存放要新增的分析数据
                let saveCardStatisticList = [];
                let happenDate = new Date(new Date().getTime() + days * 86400000);
                let weFirstStepDay = happenDate.Format("yyyyMMdd");
                for (let i = 0; i < calcRuleJson.length; i++) {
                    let countAndPercentage = {};
                    let prePoint = calcRuleJson[i].prePoint;
                    let calcName = calcRuleJson[i].calcName;
                    let calcNameKey = calcRuleJson[i].calcNameKey;
                    let pointIdPre = prePoint.pointId;
                    let calcFieldPre = prePoint.calcField;
                    let queryCriteriaPre = prePoint.queryCriteria;
                    let fieldIndex = calcFieldPre.fieldIndex;
                    //查询天数偏移量,计算留存率，取值为0,-1.-2,-3到-6，老卡片没有day，默认为0（当天）
                    let day = prePoint.day;
                    if(!day || day === '' || day === undefined){
                        day = 0
                    }
                    //当天的数据
                    let tableNamePre = Utils.setTableName(projectId + "_" + pointIdPre + "_", parseInt(days,10) + parseInt(day,10))
                    let happenDateDay = new Date(happenDate.getTime() + day * 86400000)
                    let querySql = await TimerStatisticController.splicingSql(calcFieldPre, queryCriteriaPre, tableNamePre);
                    //如果是漏斗图，统计(weFirstStepDay_1 = 20220620) 的数据
                    //获取点位关系表
                    let cardIndexRes = await BuryPointRelationModel.getListByPointIdAndCardId(pointIdPre, id);
                    let stepColum = (cardIndexRes && cardIndexRes.length>0)?cardIndexRes[0].stepColum:-1;
                    // 今天时间减去7，然后计算fristStepDay = 1到 6 的数据，更新到对应统计表中
                    if (conversionCycle && conversionCycle > 1) {
                        //存放要更新的分析数据
                        let updateFunnelList = [];
                        //存放要新增的分析数据
                        let saveFunnelList = [];
                        for (let firstStepDay = 1; firstStepDay < conversionCycle; firstStepDay++) {
                            let calDate = new Date(happenDateDay.getTime() + (-1) * (86400000 * (firstStepDay)));
                            let calDateHappenDate = calDate.Format("yyyyMMdd");
                            let calDaySql = querySql + " and weFirstStepDay_" + stepColum + "='" + calDateHappenDate + "'";
                            let count = 0
                            if(stepColum === -1){
                                count = 0
                            }else{
                                const resCount = await BuryPointCardModel.statisticData(calDaySql);
                                count = (resCount) ? (isNaN(resCount[0].count) ? 0 : resCount[0].count) : 0;
                            }
                            await TimerStatisticController.summaryFunnelStatistics(pageId, id, name, calcName, calcNameKey, count, calDate, updateFunnelList, saveFunnelList);
                        }
                        // console.log("前六天要更新的数据：" + JSON.stringify(updateFunnelList));
                        // console.log("前六天要新增的数据:" + JSON.stringify(saveFunnelList));
                        //批量操作
                        await TimerStatisticController.saveOrUpdateFunnelList(saveFunnelList, updateFunnelList);
                    }
                    //计算今日数据
                    querySql = querySql + " and weFirstStepDay_" + stepColum + "='" + weFirstStepDay + "'";
                    // console.log("sql：" + querySql);
                    //转化周期是7的话，就查询7天的日志表，然后汇总
                    let count = 0
                    if(stepColum === -1){
                        count = 0
                    }else{
                        count = await TimerStatisticController.getCount(tableNamePre, querySql)
                    }
                    
                    //如果是漏斗图，统计每一步的人数，放在一个list中，进行下一步处理，更新到统计分析表中
                    //排序字段
                    countAndPercentage.fieldIndex = fieldIndex;
                    countAndPercentage.calcName = calcName;
                    countAndPercentage.count = count;
                    countAndPercentage.percentage = 0;
                    countAndPercentageArr.push(countAndPercentage);
                    //统计数据入库统计表，重复就更新，不存在就插入
                    //根据页面id，卡片id，计数名称，计数名称key，时间来查询已经统计过的数据
                    let existeData;
                    if (!calcNameKey || calcNameKey === '' || calcNameKey === undefined || calcNameKey === 'undefined') {
                        existeData = await BuryPointCardStatisticsModel.getOne(pageId, id, calcName, '', happenDateDay.Format("yyyy-MM-dd"));
                    }else {
                        existeData = await BuryPointCardStatisticsModel.getOne(pageId, id, '', calcNameKey, happenDateDay.Format("yyyy-MM-dd"));
                    }
                    if (existeData && existeData[0]) {
                        existeData[0].count = isNaN(count) ? 0 : count;
                        existeData[0].updateAt = new Date();
                        existeData[0].percentage = isNaN(existeData[0].percentage) ? 0 : existeData[0].percentage;
                        updateCardStatisticList.push(existeData[0]);
                    } else {
                        const cardStatistic = {}
                        cardStatistic.pageId = pageId;
                        cardStatistic.cardId = id;
                        cardStatistic.cardName = name;
                        cardStatistic.count = isNaN(count) ? 0 : count;
                        cardStatistic.calcField = calcName;
                        cardStatistic.calcFieldKey = calcNameKey;
                        cardStatistic.happenDate = happenDateDay.Format("yyyy-MM-dd hh:mm:ss");
                        cardStatistic.percentage = 0;
                        saveCardStatisticList.push(cardStatistic);
                    }
                    //报警：只统计当天的
                    if(days === 0 && refreshFlag !== 2){
                        BuryPointAlarmMessageController.alarmNotice(id, name , calcName, calcNameKey, calcRuleJson[i].alarmId, pageId,card.alarmMembers,count,card.noticeWay);
                    }
                }
                // console.log("要更新的：" + JSON.stringify(updateCardStatisticList));
                // console.log("要新增的：" + JSON.stringify(saveCardStatisticList));
                //批量操作
                await TimerStatisticController.saveOrUpdateStatistic(type, countAndPercentageArr,saveCardStatisticList,updateCardStatisticList);
            }
        }
    }

    /**
     * 新增或者更新漏斗数据：转化周期是7天的，计算fristStepDay = 1到 6 的数据，更新到对应统计表中
     * @param {*} saveFunnelList 
     * @param {*} updateFunnelList 
     */
    static async saveOrUpdateFunnelList(saveFunnelList, updateFunnelList){
        if (updateFunnelList.length > 0) {
            for (let i = 0; i < updateFunnelList.length; i++) {
                await BuryPointCardStatisticsModel.update(updateFunnelList[i].id, updateFunnelList[i]);
            }
        }
        if (saveFunnelList.length > 0) {
            let currTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            let values = [];
            for (let i = 0; i < saveFunnelList.length; i++) {
                let value = "(" + saveFunnelList[i].pageId + ","
                    + saveFunnelList[i].cardId + ","
                    + "'" + saveFunnelList[i].cardName + "',"
                    + saveFunnelList[i].count + ","
                    + "'" + saveFunnelList[i].calcField + "',"
                    + "'" + saveFunnelList[i].calcFieldKey + "',"
                    + "'" + saveFunnelList[i].happenDate + "',"
                    + (isNaN(saveFunnelList[i].percentage) ? 0 : saveFunnelList[i].percentage) + ","
                    + "'" + currTime +  "',"
                    + "'" + currTime + "')";
                values.push(value);
            }
            let keys = "pageId,cardId,cardName,count,calcField,calcFieldKey,happenDate,percentage,createdAt,updatedAt";
            await SdkReleaseModel.saveValues('BuryPointCardStatistics', keys, values);
        }
    }
    /**
     * 新增或者更新统计表数据
     * @param {*} countAndPercentageArr 
     * @param {*} saveCardStatisticList 
     * @param {*} updateCardStatisticList 
     */
    static async saveOrUpdateStatistic(type,countAndPercentageArr,saveCardStatisticList,updateCardStatisticList){
        if (updateCardStatisticList.length > 0) {
            if(type && type === 5){
                await TimerStatisticController.calcFunnelConversionRate(countAndPercentageArr, updateCardStatisticList);
            }
            for (let i = 0; i < updateCardStatisticList.length; i++) {
                await BuryPointCardStatisticsModel.update(updateCardStatisticList[i].id, updateCardStatisticList[i]);
            }
        }
        if (saveCardStatisticList.length > 0) {
            let currTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            if(type && type === 5){
                await TimerStatisticController.calcFunnelConversionRate(countAndPercentageArr, saveCardStatisticList)
            }
            let values = [];
            for (let i = 0; i < saveCardStatisticList.length; i++) {
                let value = "(" + saveCardStatisticList[i].pageId + ","
                    + saveCardStatisticList[i].cardId + ","
                    + "'" + saveCardStatisticList[i].cardName + "',"
                    + saveCardStatisticList[i].count + ","
                    + "'" + saveCardStatisticList[i].calcField + "',"
                    + "'" + saveCardStatisticList[i].calcFieldKey + "',"
                    + "'" + saveCardStatisticList[i].happenDate + "',"
                    + (isNaN(saveCardStatisticList[i].percentage) ? 0 : saveCardStatisticList[i].percentage) + ","
                    + "'" + currTime +  "',"
                    + "'" + currTime + "')";
                values.push(value);
            }
            let keys = "pageId,cardId,cardName,count,calcField,calcFieldKey,happenDate,percentage,createdAt,updatedAt";
            await SdkReleaseModel.saveValues('BuryPointCardStatistics', keys, values);
        }
    }

    /**
     * 新增或者更新归类统计表数据
     * @param {*} saveCardStatisticList 
     * @param {*} updateCardStatisticList 
     */
    static async saveOrUpdateGroupByStatistic(tableName,saveOrUpdateCardStatisticList){
        if (saveOrUpdateCardStatisticList.length > 0) {
            let values = [];
            let currDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            for (let i = 0; i < saveOrUpdateCardStatisticList.length; i++) {
                let value = "(" + saveOrUpdateCardStatisticList[i].pageId + ","
                    + saveOrUpdateCardStatisticList[i].cardId + ","
                    + "'" + saveOrUpdateCardStatisticList[i].cardName + "',"
                    + saveOrUpdateCardStatisticList[i].count + ","
                    + "'" + saveOrUpdateCardStatisticList[i].calcField + "',"
                    + "'" + saveOrUpdateCardStatisticList[i].happenDate + "',"
                    + "'" + currDate + "')";
                // values.push(value);
                await SdkReleaseModel.updateBatchStatisticValues(
                    tableName, 
                    value,
                    saveOrUpdateCardStatisticList[i].count,
                    currDate
                );
            }
        }
    }

    /**
     * 先删除在新增归类统计表数据
     * @param {*} saveCardStatisticList 
     * @param {*} updateCardStatisticList 
     */
    static async saveGroupByStatistic(tableName,saveOrupdateCardStatisticList){
        if (saveOrupdateCardStatisticList.length > 0) {
            let values = [];
            let currDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            for (let i = 0; i < saveOrupdateCardStatisticList.length; i++) {
                let value = "(" + saveOrupdateCardStatisticList[i].pageId + ","
                    + saveOrupdateCardStatisticList[i].cardId + ","
                    + "'" + saveOrupdateCardStatisticList[i].cardName + "',"
                    + saveOrupdateCardStatisticList[i].count + ","
                    + "'" + saveOrupdateCardStatisticList[i].calcField + "',"
                    + "'" + saveOrupdateCardStatisticList[i].happenDate + "',"
                    + "'" + currDate + "',"+ "'" + currDate + "')";
                    values.push(value);
            }
            let keys = "pageId,cardId,cardName,count,calcField,happenDate,createdAt,updatedAt";
            await SdkReleaseModel.saveValues(tableName, keys, values);
        }
    }

    /**
     * 漏斗图：计算每一步转化率
     * @returns {Promise.<void>}
     */
    static async calcFunnelConversionRate(countAndPercentageList, cardStatisticList) {
        //升序
        countAndPercentageList.sort(function (a, b) {
            return a.fieldIndex - b.fieldIndex;
        });
        let totalCount = 0;
        for (let i = 0; i < countAndPercentageList.length; i++) {
            totalCount = parseInt(totalCount, 10) + parseInt(countAndPercentageList[i].count, 10);
            if (i !== countAndPercentageList.length - 1) {
                if (parseInt(countAndPercentageList[i].count, 10) === 0) {
                    countAndPercentageList[i + 1].percentage = 0;
                } else {
                    countAndPercentageList[i + 1].percentage = Utils.toFixed((parseInt(countAndPercentageList[i + 1].count, 10) / parseInt(countAndPercentageList[i].count, 10)) * 100, 2);
                }
            }
        }
        if (totalCount === 0) {
            countAndPercentageList[0].percentage = 0;
        } else {
            countAndPercentageList[0].percentage =
                Utils.toFixed((parseInt(countAndPercentageList[countAndPercentageList.length - 1].count, 10) / parseInt(totalCount, 10)) * 100, 2);
        }
        // log.printInfo("计算后的数据:" + JSON.stringify(countAndPercentageList));
        for (let i = 0; i < countAndPercentageList.length; i++) {
            for (let j = 0; j < cardStatisticList.length; j++) {
                if (countAndPercentageList[i].calcName === cardStatisticList[j].calcField) {
                    cardStatisticList[j].percentage = isNaN(countAndPercentageList[i].percentage) ? 0 : countAndPercentageList[i].percentage
                }
            }
        }
        // log.printInfo("分析后的数据:" + JSON.stringify(cardStatisticList));
    }

    /**
     * 非归类的拼接sql
     * @param calcField :点位字段信息
     * @param queryCriteria :查询条件
     * @param tableName :表名
     * @returns {Promise.<void>}
     */
    static async splicingSql(calcField, queryCriteria, tableName) {
        let sumOrCountFlag = "count";
        //是否去重，1是，0否，2求和，3-求平均值，4-归类(pv)，5-归类(uv)
        if (calcField.isRepeat === '2' || calcField.isRepeat === 2) {
            sumOrCountFlag = "sum";
        } else if (calcField.isRepeat === '3' || calcField.isRepeat === 3) {
            sumOrCountFlag = "avg";
        } else {
            sumOrCountFlag = "count";
        } 
        let querySql = " select " + sumOrCountFlag + "(";
        if (calcField.isRepeat === '1' || calcField.isRepeat === 1
            || calcField.isRepeat === '5' || calcField.isRepeat === 5) {//去重
            querySql = querySql + "distinct " + calcField.fieldName;
        } else {//不去重
            querySql = querySql + calcField.fieldName;
        }
        querySql = querySql + ") as count from " + tableName;
        if (queryCriteria.length > 0) {
            // 获取 “且”-and 还是 “或”-or
            let andOr = calcField.andOr;
            //兼容老版本
            if (!calcField.andOr || calcField.andOr === undefined) {
                andOr = 'and'
            } else {
                andOr = Utils.convertAndOr(andOr);
            }
            var criteriaSql = ''
            for (let j = 0; j < queryCriteria.length; j++) {
                let fieldName = queryCriteria[j].fieldName;
                let rule = Utils.convertOper(queryCriteria[j].rule)
                let value = queryCriteria[j].value 
                if (rule === 'is null') {
                    criteriaSql = " " + criteriaSql + "("+ fieldName + " " + rule + " or " + fieldName + "='') " + andOr + " ";
                } else if (rule === 'is not null') {
                    criteriaSql = " " + criteriaSql + "("+ fieldName + " " + rule + " and " + fieldName + "!='') " + andOr + " ";
                } else if (rule === 'like') {
                    criteriaSql = " " + criteriaSql + fieldName + " " + rule + "  '%" + value + "%' " + andOr + " ";
                } else if (rule === 'in') {
                    let valueArray = value.split(",");
                    let valueListStr = '';
                    for (let k = 0; k < valueArray.length; k++) {
                        valueListStr +=  fieldName + " like '%" + valueArray[k]  + "%' "  + " or ";
                    }
                    valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('or'));
                    criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
                } else if (rule === 'not in') {
                    let valueArray = value.split(",");
                    let valueListStr = '';
                    for (let k = 0; k < valueArray.length; k++) {
                        valueListStr +=  fieldName + " not like '%" + valueArray[k]  + "%' "  + " and ";
                    }
                    valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('and'));
                    criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
                } else {
                    criteriaSql = criteriaSql + fieldName + " " + rule + " '" + value + "'" + " " + andOr + " ";
                }
            }
            criteriaSql = criteriaSql.substring(0, criteriaSql.lastIndexOf(andOr));
            querySql = querySql + " where 1=1 and (" + criteriaSql + ")";
        }else {
            querySql = querySql + " where 1=1 "
        }
        console.log(querySql)
        return querySql;
    }

    /**
     * 归类的拼接sql
     * select fangWenDiZhi as groupByName, count(weCustomerKey) as count 
     * from event10181_79_20230528 
     * where 1=1  and 字段 = '1' 
     * group by fangWenDiZhi
     * @param calcField :点位字段信息
     * @param queryCriteria :查询条件
     * @param tableName :表名
     * @returns {Promise.<void>}
     */
    static async splicingGroupBySql(calcField, queryCriteria, tableName) {
        let querySql = " select ";
        let sumOrCountFlag = "count";
        let fieldGroupByFlag = 0;
        let fieldGroupByName = '';
        //筛选条件有归类的话，拼接 groupByName查询字段
        for (let i = 0; i < queryCriteria.length; i++) {
            let fieldName = queryCriteria[i].fieldName;
            let rule = Utils.convertOper(queryCriteria[i].rule)
            if (rule === 'group by') {
                fieldGroupByFlag = 1;
                fieldGroupByName = fieldName;
                break
            } 
        }
        //是否去重，1是，0否，2求和，3-求平均值，4-归类(pv)，5-归类(uv)
        if (calcField.isRepeat === '2' || calcField.isRepeat === 2) {
            sumOrCountFlag = "sum";
        } else if (calcField.isRepeat === '3' || calcField.isRepeat === 3) {
            sumOrCountFlag = "avg";
        } else{
            sumOrCountFlag = "count";
        }
        if (fieldGroupByFlag === 1 && fieldGroupByName) {
            querySql = querySql + fieldGroupByName 
        }else {
            querySql = querySql + calcField.fieldName
        }
        querySql = querySql + " as groupByName, " + sumOrCountFlag + "("
        if (calcField.isRepeat === '5' || calcField.isRepeat === 5) {//归类去重
            querySql = querySql + " distinct weCustomerKey";
        } else if(calcField.isRepeat === '4' || calcField.isRepeat === 4){//归类不去重
            querySql = querySql + "weCustomerKey";
        }else if(calcField.isRepeat === '1' || calcField.isRepeat === 1){//groupby去重
            querySql = querySql + " distinct " + calcField.fieldName;
        }else {//groupby不去重
            querySql = querySql + calcField.fieldName;
        }
        querySql = querySql + ") as count from " + tableName;
        if (queryCriteria.length > 0) {
            // 获取 “且”-and 还是 “或”-or
            let andOr = calcField.andOr;
            //兼容老版本
            if (!calcField.andOr || calcField.andOr === undefined) {
                andOr = 'and'
            } else {
                andOr = Utils.convertAndOr(andOr);
            }
            var criteriaSql = ''
            var groupBySql = '';
            for (let j = 0; j < queryCriteria.length; j++) {
                let fieldName = queryCriteria[j].fieldName;
                let rule = Utils.convertOper(queryCriteria[j].rule)
                let value = queryCriteria[j].value
                if (rule === 'is null') {
                    criteriaSql = " " + criteriaSql + "("+ fieldName + " " + rule + " or " + fieldName + "='') " + andOr + " ";
                }  else if (rule === 'is not null') {
                    criteriaSql = " " + criteriaSql + "("+ fieldName + " " + rule + " and " + fieldName + "!='') " + andOr + " ";
                } else if (rule === 'like') {
                    criteriaSql = " " + criteriaSql + fieldName + " " + rule + "  %" + value + "% " + andOr + " ";
                } else if (rule === 'group by') {
                    // 筛选条件归类 ： where 字段 = '' and group by 字段
                    groupBySql =  " " + rule + " " + fieldName + " "
                } else if (rule === 'in') {
                    let valueArray = value.split(",");
                    let valueListStr = '';
                    for (let k = 0; k < valueArray.length; k++) {
                        valueListStr +=  fieldName + " like '%" + valueArray[k]  + "%' "  + " or ";
                    }
                    valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('or'));
                    criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
                } else if (rule === 'not in') {
                    let valueArray = value.split(",");
                    let valueListStr = '';
                    for (let k = 0; k < valueArray.length; k++) {
                        valueListStr +=  fieldName + " not like '%" + valueArray[k]  + "%' "  + " and ";
                    }
                    valueListStr = valueListStr.substring(0, valueListStr.lastIndexOf('and'));
                    criteriaSql = criteriaSql + " (" + valueListStr + ")" + " " + andOr + " ";
                } else {
                    criteriaSql = " " + criteriaSql + fieldName + " " + rule + " '" + value + "'" + " " + andOr + " ";
                }
            }
            criteriaSql = criteriaSql.substring(0, criteriaSql.lastIndexOf(andOr));
            if(criteriaSql){
                querySql = " " + querySql + " where 1=1 and (" + criteriaSql + ") " + groupBySql;
            }else {
                querySql = " " + querySql + " " + groupBySql;
            }
        }else {
            querySql = " " + querySql + " where 1=1 "
        }
        //计算条件归类 ： group by
        if ((calcField.isRepeat === '4' || calcField.isRepeat === 4)
            || (calcField.isRepeat === '5' || calcField.isRepeat === 5)) {
            querySql = " " + querySql + " group by " + calcField.fieldName;
        }
        console.log(querySql)
        return querySql;
    }

    /**
     * 汇总统计漏斗分析数据
     * @param calcField :点位字段信息
     * @param queryCriteria :查询条件
     * @param tableName :表名
     * @returns {Promise.<void>}
     */
    static async summaryFunnelStatistics(pageId, cardId, cardName, calcName, calcNameKey, count, calDate, updateFunnelList, saveFunnelList) {
        //统计数据入库统计表，重复就更新，不存在就插入
        //根据页面id，卡片id，计数名称，计数名称key，时间来查询已经统计过的数据
        let happenDateTime = calDate.Format("yyyy-MM-dd hh:mm:ss");
        let happenDate = calDate.Format("yyyy-MM-dd");
        let existeData = await BuryPointCardStatisticsModel.getOne(pageId, cardId, '', calcNameKey, happenDate);
        // console.log("数量：" + count + ":" + happenDate + "要更新的数据：" + JSON.stringify(existeData));
        if (existeData && existeData[0]) {
            existeData[0].count = parseInt((isNaN(count) ? 0 : count), 10);
            existeData[0].percentage = isNaN(existeData[0].percentage) ? 0 : existeData[0].percentage;
            existeData[0].updateAt = new Date();
            updateFunnelList.push(existeData[0]);
        } else {
            const cardStatistic = {}
            cardStatistic.pageId = pageId;
            cardStatistic.cardId = cardId;
            cardStatistic.cardName = cardName;
            cardStatistic.count = isNaN(count) ? 0 : count;
            cardStatistic.calcField = calcName;
            cardStatistic.calcFieldKey = calcNameKey;
            cardStatistic.happenDate = happenDateTime;
            cardStatistic.percentage = 0;
            saveFunnelList.push(cardStatistic);
        }
    }

    /**
     * 查询数量
     * 首先查询表名是否存在，不存在，count直接设置为0
     * @param {表名} tableName 
     * @returns 
     */
    static async getCount(tableName, querySql) {
        let count = 0;
        // let flag = await TimerStatisticController.checkTableName(tableName);
        // if (flag === true) {
        // console.log("统计查询sql：" + querySql);
        const resCount = await BuryPointCardModel.statisticData(querySql);
        count = (resCount) ? ((resCount.length === 0||isNaN(resCount[0].count) || resCount[0].count === null) ? 0 : resCount[0].count) : 0;
        // }else {
        //     count = 0;
        // }
        return count;
    }

    /**
     * 查询归类分析表
     * @param {表名} tableName 
     * @returns 
     */
    static async getCountByTableName(querySql) {
        const res = await BuryPointCardModel.statisticData(querySql);
        return res;
    }

    /**
   * 检测表名是否存在
   */
    static async checkTableName(tableName) {
        const checkTableRes = await CommonModel.checkTableName(tableName).catch((e) => {
            log.error(e)
        });
        if (checkTableRes && checkTableRes.length > 0 && checkTableRes[0].count > 0) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = {CommonUtil,BuryPointAlarmController,BuryPointAlarmMessageController,CommonUpLog,BuryPointCardStatisticsController,BuryPointTaskController,BuryPointTemplateController,BuryPointCardController,BuryPointFieldController,Common,BuryPointProjectController,TestController,BuryPointTestController,CommonInitDataController,ConfigController,FailController,MessageController,SysInfoController,TeamController,UserController,BuryPointWarehouseController,WeHandleDataController,SdkReleaseController,TimerStatisticController}