const nodemailer = require('nodemailer')
  /**
   * 自己配置邮箱，bin/useCusEmailSys.js 参数改为true
   */
  const sendEmail = (email, title, content, user, pass) => {
      const company = "webfunny.cn"
      let transporter = nodemailer.createTransport({
          host: "smtp.163.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: { user,pass }
      });
      // send mail with defined transport object
      transporter.sendMail({
          from: "'" + company + "' <" + user + ">", // sender address
          to: email, // list of receivers
          subject: title, // Subject line
          text: content, // plain text body
          html: content // html body
      });
  }
  module.exports = sendEmail