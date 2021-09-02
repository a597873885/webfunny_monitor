const Sequelize = require('sequelize');
const {accountInfo} = require('./AccountConfig');
const {getenv} = require('../util/utils');

const replication = {
  read: accountInfo.mysqlConfig.read,
  write: accountInfo.mysqlConfig.write
}
const configList = {
  host: accountInfo.mysqlConfig.write.ip,
  port: accountInfo.mysqlConfig.write.port,
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
    max: parseInt(getenv('MYSQL_POOL_MAX', '500'), 10),
    min: parseInt(getenv('MYSQL_POOL_MIN', '0'), 10),
    acquire: parseInt(getenv('MYSQL_POOL_ACQUIRE','30000'), 10),
    idle: parseInt(getenv('MYSQL_POOL_IDLE', '10000'), 10)
  },
  timezone: '+08:00' //东八时区
}
if (accountInfo.mysqlConfig.read && accountInfo.mysqlConfig.read.length > 0) {
  configList.replication = replication
}
// 下一个迭代数据库
const sequelize = new Sequelize(accountInfo.mysqlConfig.write.dataBaseName, accountInfo.mysqlConfig.write.userName, accountInfo.mysqlConfig.write.password, {
  ...configList
})

module.exports = {
  sequelize: sequelize
}
