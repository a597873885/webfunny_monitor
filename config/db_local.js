/**
 * 你可以在这个文件里配置你自己的数据库
 */
const defaultConfig = {
  ip: "180.76.183.218",                 // mysql数据库所在云服务器的ip地址
  dataBaseName: "webfunny_db",       // 数据库名称（如：webfunny_db）
  userName: "root",           // mysql的登录名
  password: "webfunny_db_customer"            // mysql的登录密码
}
const Sequelize = require('sequelize');
const sequelize = new Sequelize(defaultConfig.dataBaseName, defaultConfig.userName, defaultConfig.password, {
  host: defaultConfig.ip,
  dialect: 'mysql',
  dialectOptions: {
    charset: "utf8mb4",
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00' //东八时区
});

module.exports = {
  sequelize: sequelize
}
