// const FlowDataInfoByHourController = require('../../controllers/flowDataInfoByHour')
const { FlowDataInfoByHourController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 存储流量信息
    router.post('/createFlowData', FlowDataInfoByHourController.createFlowDataInfoByHour);
}
