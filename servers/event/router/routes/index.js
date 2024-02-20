const buryPointAlarmRouter = require('./buryPointAlarm')
const buryPointAlarmMessageRouter = require('./buryPointAlarmMessage')
const buryPointCardRouter = require('./buryPointCard')
const buryPointFieldRouter = require('./buryPointField')
const buryPointProjectRouter = require('./buryPointProject')
const sdkReleaseRouter = require('./buryPointSdkRelease')
const buryPointTestRouter = require('./buryPointTest')
const buryPointTaskRouter = require('./buryPointTask')
const buryPointTemplateRouter = require('./buryPointTemplate')
const buryPointWarehouseRouter = require('./buryPointWarehouse')
const commonRouter = require('./common')
const commonUpLogRouter = require('./commonUpLog')
const sysInfoRouter = require('./sysInfo')
const timerStatisticRouter = require('./timerStatistic')
const weHandleDataRouter = require('./weHandleData')

const createRouter = (router) => {
  buryPointFieldRouter(router)
  buryPointWarehouseRouter(router)
  buryPointAlarmRouter(router)
  buryPointAlarmMessageRouter(router)
  buryPointCardRouter(router)
  buryPointProjectRouter(router)
  buryPointTaskRouter(router)
  commonRouter(router)
  commonUpLogRouter(router)
  sdkReleaseRouter(router)
  sysInfoRouter(router)
  timerStatisticRouter(router)
  weHandleDataRouter(router)
  buryPointTestRouter(router)
  buryPointTemplateRouter(router)
}

module.exports = {
  createRouter
}