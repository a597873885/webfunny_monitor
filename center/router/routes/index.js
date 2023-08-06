const applicationConfigRouter = require('./applicationConfig')
const companyRouter = require('./company')
const flowDataInfoRouter = require('./flowDataInfoByHour')
const flowDataInfoByDayRouter = require('./flowDataInfoByDay')
const teamRouter = require('./team')
const userRouter = require('./user')
const userTokenRouter = require('./userToken')
const ssoRouter = require('./sso')

const createRouter = (router) => {
  applicationConfigRouter(router)
  companyRouter(router)
  flowDataInfoByDayRouter(router)
  flowDataInfoRouter(router)
  teamRouter(router)
  userRouter(router)
  userTokenRouter(router)
  ssoRouter(router)
}

module.exports = {
  createRouter
}