
const Sequelize = require('sequelize');
const { accountInfo } = require('./AccountConfig');

const { write, read, dbType = 'mysql' } = accountInfo.mysqlConfig;

// ClickHouse 通过 MySQL 兼容协议接入，底层 dialect 仍是 mysql
const sequelizeDialect = dbType === 'clickhouse' ? 'mysql' : dbType;

const dialectOptionsMap = {
  mysql: {
    charset: "utf8mb4",
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  clickhouse: {
    charset: "utf8mb4",
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  postgres: {}
}

const readArray = []
if (read && read.length) {
  read.forEach((item) => {
    readArray.push({ host: item.ip, username: item.userName, password: item.password })
  })
}
const replication = {
  read: readArray,
  write: { host: write.ip, username: write.userName, password: write.password }
}

const configList = {
  host: write.ip,
  port: write.port,
  logging: (sql) => {
    if (accountInfo.printSql && accountInfo.printSql.center === true) {
      console.log(sql)
    }
  },
  dialect: sequelizeDialect,
  dialectOptions: dialectOptionsMap[dbType] || {},
  pool: {
    max: 500,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00'
}

let sequelize = null
if (read && read.length > 0) {
  configList.replication = replication
  sequelize = new Sequelize(write.dataBaseName, null, null, {
    ...configList
  })
} else {
  sequelize = new Sequelize(write.dataBaseName, write.userName, write.password, {
    ...configList
  })
}

module.exports = {
  sequelize: sequelize
}
