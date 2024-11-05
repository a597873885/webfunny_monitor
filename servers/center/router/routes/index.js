const applicationConfigRouter = require('./applicationConfig')
const companyRouter = require('./company')
const flowDataInfoRouter = require('./flowDataInfoByHour')
const flowDataInfoByDayRouter = require('./flowDataInfoByDay')
const teamRouter = require('./team')
const userRouter = require('./user')
const userTokenRouter = require('./userToken')
const ProductRouter = require('./product')
// const OrderRouter = require('./order')
const ssoRouter = require('./sso')
const alarmListRouter = require('./alarmList')
const noticeTemplateRouter = require('./noticeTemplate')
const alarmRuleRouter = require('./alarmRule')
const alarmOverviewRouter = require('./alarmOverview')
const orderInfoRouter = require('./orderInfo')
const menuPermissionsRouter = require('./menuPermissions')

const createRouter = (router) => {
  applicationConfigRouter(router)
  companyRouter(router)
  flowDataInfoByDayRouter(router)
  flowDataInfoRouter(router)
  teamRouter(router)
  userRouter(router)
  userTokenRouter(router)
  ProductRouter(router)
  // OrderRouter(router)
  ssoRouter(router)
  alarmListRouter(router)
  noticeTemplateRouter(router)
  alarmRuleRouter(router)
  alarmOverviewRouter(router)
  orderInfoRouter(router)
  menuPermissionsRouter(router)
}

module.exports = {
  createRouter
}