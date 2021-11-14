/**
    * 这里是钉钉机器人（关键字）的相关配置
    * 关键字列表： 
    * 1. 警报
    */
  module.exports = {
      url: "", // 钉钉机器人的 webHook URL
      config: {
          "msgtype": "text",
          "text": {
              "content": ""
          },
          "at": {
              "atMobiles": [    // 想要@的成员列表
                  "000"
              ], 
              "isAtAll": false  // 是否@所有人
          }
        }
  }