// const FlowDataInfoByDayController = require('../../controllers/flowDataInfoByDay')
const { FlowDataInfoByDayController } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 获取总流量信息
    router.get('/getTotalFlowData', FlowDataInfoByDayController.getTotalFlowData);
    // 获取流量趋势数据
    router.get('/getFlowTrendData', FlowDataInfoByDayController.getFlowTrendData);
    // 获取流量列表数据
    router.get('/getFlowTableListData', FlowDataInfoByDayController.getFlowTableListData);
    // 获取流量列表数据
    router.get('/getFlowListByCompanyIdAndProjectIds', FlowDataInfoByDayController.getFlowListByCompanyIdAndProjectIds);
}
