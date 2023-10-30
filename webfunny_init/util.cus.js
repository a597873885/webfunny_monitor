var fs = require('fs');
var path = require('path');
const fetch = require('node-fetch')
const rootPath = path.resolve(__dirname, "..")

/**
 * 初始化util_cus目录
 */
var cusUtilPathArray = [rootPath + '/util_cus/index.js', rootPath + '/util_cus/sendEmail.js']
var cusUtilFileArray = [
  `const sendEmail = require("./sendEmail")

  module.exports = {
      sendEmail
  }`,
  `const nodemailer = require('nodemailer')
  const WebfunnyConfig = require("../webfunny.config")
  const { otherConfig } = WebfunnyConfig
  /**
   * 自己配置邮箱：在 bin/useCusEmailSys.js文件中 参数改为true，并配置自己的163邮箱和密码
   * @param targetEmail 目标邮箱地址
   * @param emailTitle 邮件标题
   * @param emailContent 邮件正文
   * @param user 系统邮箱地址（不传参，则默认使用配置的邮箱地址）
   * @param pass 系统邮箱密码（不传参，则默认使用配置的邮箱密码）
   */
  const sendEmail = (targetEmail, emailTitle, emailContent, user = otherConfig.emailUser, pass = otherConfig.emailPassword) => {
      const company = "webfunny"
      let transporter = nodemailer.createTransport({
          host: "smtp.163.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: { user,pass }
      });
      // send mail with defined transport object
      transporter.sendMail({
          from: "'" + company + "' <" + user + ">", // sender address
          to: targetEmail, // list of receivers
          subject: emailTitle, // Subject line
          text: emailContent, // plain text body
          html: emailContent // html body
      });
  }
  module.exports = sendEmail`
]
fs.mkdir( rootPath + "/util_cus", function(err){
  if ( err ) { 
    console.log(`= 文件夹 ${rootPath}/util_cus 已经存在`)
  } else {
    console.log(`= 创建文件夹 ${rootPath}/util_cus`)
  }
  cusUtilPathArray.forEach((path, index) => {
      fs.readFile(path, "", (err) => {
          if (err) {
              console.log("× " + path + " 配置文件不存在，即将创建...")
              fs.writeFile(path, cusUtilFileArray[index], (err) => {
                  if (err) throw err;
                  console.log("√ " + path + " 配置文件创建完成！");
              });
          } else {
              console.log("√ " + path + " 配置文件已存在！")
          }
      });
  })
});
