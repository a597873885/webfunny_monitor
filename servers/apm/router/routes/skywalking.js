// const SkyWalkingController = require('../../controllers/skywalking')
const { SkyWalkingController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 测试接口 - 用于验证HTTP接口是否正常
    router.get('/skywalking/test', async (ctx) => {
        ctx.body = {
            code: 200,
            msg: 'SkyWalking接口测试成功',
            data: {
                timestamp: new Date().toISOString(),
                endpoints: [
                    'POST /wfApm/v3/logs',
                    'POST /wfApm/v3/trace',
                    'POST /wfApm/v3/segments',
                    'POST /wfApm/v3/metrics'
                ],
                note: 'SkyWalking SDK默认使用gRPC协议，需要配置使用HTTP REST API'
            }
        }
    });

    // SkyWalking v3 API - 日志上报
    router.post('/v3/logs', SkyWalkingController.receiveLogs);
    
    // SkyWalking v3 API - 追踪数据上报
    router.post('/v3/trace', SkyWalkingController.receiveTrace);
    
    // SkyWalking v3 API - Segment上报
    router.post('/v3/segments', SkyWalkingController.receiveSegments);
    
    // SkyWalking v3 API - Metrics上报
    router.post('/v3/metrics', SkyWalkingController.receiveMetrics);
}

