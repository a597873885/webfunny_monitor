const commonRouter = require('./common')
const configRouter = require('./config')
const logInfosRouter = require('./logInfos')
const logDataRouter = require('./logData')

const createRouter = (router) => {
  commonRouter(router)
  configRouter(router)
  logInfosRouter(router)
  logDataRouter(router)
}

module.exports = {
  createRouter
}