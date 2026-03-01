const commonRouter = require('./common')
const commonTableRouter = require('./commonTable')
const configRouter = require('./config')
const projectRouter = require('./project')
const sourceMapFileRouter = require('./sourceMapFile')

const createRouter = (router) => {
  commonRouter(router)
  commonTableRouter(router)
  configRouter(router)
  projectRouter(router)
  sourceMapFileRouter(router)
}

module.exports = {
  createRouter
}