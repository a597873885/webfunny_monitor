const commonRouter = require('./common')
const configRouter = require('./config')
const logDataRouter = require('./logData')
const traceDataRouter = require('./traceData')
const projectRouter = require('./logProject')

const createRouter = (router) => {
  commonRouter(router)
  configRouter(router)
  traceDataRouter(router)
  logDataRouter(router)
  projectRouter(router)
}

module.exports = {
  createRouter
}