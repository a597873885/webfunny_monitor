
const defaultConfig = require("../bin/mysqlConfig")
const Sequelize = require('sequelize');
const sequelize = new Sequelize(defaultConfig.dataBaseName, defaultConfig.userName, defaultConfig.password, {
  host: defaultConfig.ip,
  dialect: 'mysql',
  logging: (sql) => {
    // 这里处理sql的日志，暂时不打印
    // console.log(sql.length)
  },
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
