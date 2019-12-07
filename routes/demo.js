const Router = require('koa-router')
const Demo = require('../controllers/demo')
const router = new Router({
    prefix: '/demo'
})
/**
 * 日志相关处理
 */
router.post('/upLog', Demo.upLog);

// 查询用户的行为列表
router.post('/query', Demo.searchBehaviorsRecord);


module.exports = router
