const Sequelize = require('sequelize');
const sequelize = new Sequelize('monitor_db_test', 'jeffery', 'a321657216', {
  host: '47.101.196.168',
  dialect: 'mysql',
  operatorsAliases: false,
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
