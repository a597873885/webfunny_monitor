/**
  * 这里是企业微信机器人的相关配置
  */
 module.exports = {
     url: "", // 企业微信机器人的 webHook URL
     config: {
         "msgtype": "text",
         "text": {
             "content": "我只是一个机器人测试，请忽略我",
             "mentioned_list":["xxx",],
             "mentioned_mobile_list":["182xxxx4111"]  // 将要艾特的人
         }
     }
 }