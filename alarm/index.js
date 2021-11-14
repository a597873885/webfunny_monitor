const sendEmail = require('../util_cus/sendEmail');
  const dingDing = require('../alarm/dingding')
  const weiXin = require('../alarm/weixin')
  const feiSHu = require('../alarm/feishu')
  const Utils = require('../util/utils')
  const AccountConfig = require('../config/AccountConfig')
  const { accountInfo } = AccountConfig
  const AlarmNames = require('./alarmName')
  
  const alarmCallback = (project, rule, users) => {
      const { projectName, projectType, chooseHook } = project
      const {type, happenCount, compareType, limitValue} = rule
      const compareStr = compareType === "up" ? ">=" : "<"
      const projectHook = chooseHook ? JSON.parse(chooseHook) : {value: "", name: "", webHook: ""}
      /**生成警报配置 */
      // 添加用户手机号
      users.forEach((user) => {
          dingDing.config.at.atMobiles.push(user.phone)
          weiXin.config.text.mentioned_mobile_list.push(user.phone)
      })
      // 生成警报内容
      const contentStr = type + "警报！" +
          "您的" + projectType + "项目【" + projectName + "】发出警报：" +
          type + "数量 " + compareStr + " " + limitValue + " 已经发生" + happenCount + "次了，请及时处理。"
      dingDing.config.text.content = contentStr
      weiXin.config.text.content = contentStr
      feiSHu.config.content.text = contentStr
      switch(projectHook.value) {
          case "dingding":
              // 1. 通知钉钉机器人
              Utils.postJson(projectHook.webHook, dingDing.config)  // 钉钉机器人
              break
          case "weixin":
              // 2. 通知微信机器人
              Utils.postJson(projectHook.webHook, weiXin.config)  // 微信机器人
              break
          case "feishu":
              // 3. 通知飞书机器人
              Utils.postJson(projectHook.webHook, feiSHu.config)  // 飞书机器人
              break
          default:
              break
      }
  
      // 4. 发送邮件通知
      if (users && users.length && accountInfo.emailUser && accountInfo.emailPassword) {
          users.forEach((user) => {
              const email = user.emailName
              sendEmail(email, AlarmNames[type] + "警报！", contentStr, accountInfo.emailUser, accountInfo.emailPassword)
          })
      }
  }
  module.exports = {
      alarmCallback
  }