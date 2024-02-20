const alarmRouter = require('./alarm')
const alarmRuleRouter = require('./alarmRule')
const commonRouter = require('./common')
const commonTableRouter = require('./commonTable')
const configRouter = require('./config')
const customerPvRouter = require('./customerPv')
const customerPvLeaveRouter = require('./customerPvLeave')
const customerStayTimeRouter = require('./customerStayTime')
const extendBehaviorInfoRouter = require('./extendBehaviorInfo')
const failRouter = require('./fail')
const httpErrorHandleListRouter = require('./httpErrorHandleList')
const httpErrorInfoRouter = require('./httpErrorInfo')
const httpLogInfoRouter = require('./httpLogInfo')
const ignoreErrorRouter = require('./ignoreError')
const javascriptErrorInfoRouter = require('./javascriptErrorInfo')
const jsErrorHandleListRouter = require('./jsErrorHandleList')
const messageRouter = require('./message')
const pageLoadInfoRouter = require('./pageLoadInfo')
const projectRouter = require('./project')
const resourceLoadInfoRouter = require('./resourceLoadInfo')

// walkingfunny相关接口，统一管理
const walkingfunnyRouter = require('./walkingfunny')

const createRouter = (router) => {
  alarmRouter(router)
  alarmRuleRouter(router)
  commonRouter(router)
  commonTableRouter(router)
  configRouter(router)
  customerPvRouter(router)
  customerPvLeaveRouter(router)
  customerStayTimeRouter(router)
  extendBehaviorInfoRouter(router)
  failRouter(router)
  httpErrorHandleListRouter(router)
  httpErrorInfoRouter(router)
  httpLogInfoRouter(router)
  ignoreErrorRouter(router)
  javascriptErrorInfoRouter(router)
  jsErrorHandleListRouter(router)
  messageRouter(router)
  pageLoadInfoRouter(router)
  projectRouter(router)
  resourceLoadInfoRouter(router)
  
  walkingfunnyRouter(router)
}

module.exports = {
  createRouter
}