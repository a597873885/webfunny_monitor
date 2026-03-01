const commonRouter = require('./common')
const commonTableRouter = require('./commonTable')
const configRouter = require('./config')
const projectRouter = require('./project')
const skywalkingRouter = require('./skywalking')
const linkTracingRouter = require('./linkTracing')
const performanceOverviewRouter = require('./performanceOverview')
const metricsRouter = require('./metrics')
const errorsRouter = require('./errors')
const topologyRouter = require('./topology')
const databaseRouter = require('./database')
const schemaSyncRouter = require('./schemaSync')
const createRouter = (router) => {
  commonRouter(router)
  commonTableRouter(router)
  configRouter(router)
  projectRouter(router)
  skywalkingRouter(router)
  linkTracingRouter(router)
  performanceOverviewRouter(router)
  metricsRouter(router)
  errorsRouter(router)
  topologyRouter(router)
  databaseRouter(router)
  schemaSyncRouter(router)
}

module.exports = {
  createRouter
}