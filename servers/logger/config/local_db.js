
const Sequelize = require('sequelize');
const { accountInfo } = require('./AccountConfig');

const {write, read} = accountInfo.mysqlConfig;

// const readArray = []
// if (read && read.length) {
//   read.forEach((item) => {
//     readArray.push({host: item.ip, port: item.port, username: item.userName, password: item.password})
//   })
// }
// const replication = {
//   read: readArray,
//   write: { host: write.ip, port: write.port, username: write.userName, password: write.password }
// }

// const configList = {
//   host: write.ip,
//   port: write.port,
//   logging: (sql) => {
//     // 这里处理sql的日志，暂时不打印
//     console.log(sql)
//   },
//   dialect: 'mysql',
//   // operatorsAliases: false,
//   dialectOptions: {
//     charset: "utf8mb4",
//     supportBigNumbers: true,
//     bigNumberStrings: true
//   },
//   pool: {
//     max: 500,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//   timezone: '+08:00' //东八时区
// }
// let sequelize = null
// if (read && read.length > 0) {
//   configList.replication = replication
//   sequelize = new Sequelize(write.dataBaseName, null, null, {
//     ...configList
//   })
// } else {
//   // 下一个迭代数据库
//   sequelize = new Sequelize(write.dataBaseName, write.userName, write.password, {
//     ...configList
//   })
// }


const { createClient } = require('@clickhouse/client');

const client = createClient({
  host: `http://${write.ip}:${write.port}`,
  username: write.userName,
  password: write.password,
  database: write.dataBaseName
})



module.exports = {
  sequelize: client,
}
