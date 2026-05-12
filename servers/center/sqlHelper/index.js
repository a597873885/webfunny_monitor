const { accountInfo } = require('../config/AccountConfig')
const dbType = (accountInfo.mysqlConfig && accountInfo.mysqlConfig.dbType) || 'mysql'

module.exports = require(`./${dbType}`)
