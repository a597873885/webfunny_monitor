const Sequelize = require('sequelize');
const { accountInfo } = require('./AccountConfig');

const {write, read} = accountInfo.mysqlConfig;
const replication = {
  read: read,
  write: { host: write.ip, username: write.userName, password: write.password }
}
const configList = {
  host: write.ip,
  port: write.port,
  logging: (sql) => {
    // 这里处理sql的日志，暂时不打印
    // console.log(sql)
  },
  dialect: 'mysql',
  // operatorsAliases: false,
  dialectOptions: {
    charset: "utf8mb4",
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 500,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00' //东八时区
}
if (read && read.length > 0) {
  configList.replication = replication
}
// 下一个迭代数据库
const sequelizeNext = new Sequelize(write.dataBaseName, write.userName, write.password, {
  ...configList
});

const emailConfig = {
  user: "jiang1125712@163.com", // generated ethereal user
  pass: "yingwei1125712" // generated ethereal password
}
const defaultUser = {
  user: "597873885@qq.com", // generated ethereal user
  pass: "123456" // generated ethereal password
}
module.exports = {
  sequelizeNext,
  emailConfig,
  defaultUser
}