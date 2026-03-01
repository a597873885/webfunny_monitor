// const Common = require('../../controllers/common')
const { Common } = require("../../controllers/controllers.js")

module.exports = (router) => {
    // 初始化接口
    router.post('/initCf', Common.initCf);
    // 用户上传日志（h5）
    router.post('/upLog', Common.upLog);
    router.post('/upLogs', Common.upLogs);
    router.get('/upLog', Common.upLogGet);
    // 用户上传自定义日志（h5）
    router.post('/upMyLog', Common.upMyLog);
    // 用户上传日志 (小程序)
    router.post('/upMog', Common.upMog);
    // 用户上传debug日志
    router.post('/upDLog', Common.upDLog);
    // 上传拓展日志
    router.post('/uploadExtendLog', Common.uploadExtendLog);

    router.post('/otel/trace', Common.trace);

    // 获服务并发日志量
    router.post('/getConcurrencyByMinuteInHour', Common.getConcurrencyByMinuteInHour);

    // 获取导出随机码
    router.post('/getExportCode', Common.getExportCode)
    
    // 获取消费者状态，用于监控优化效果
    router.get('/getConsumerStatus', Common.getConsumerStatus)


    /**
     * Docker 心跳检测
     */
    router.get('/health', Common.dockerHealth);
    // 获取日志服务所有相关信息
    router.get('/getSysInfo', Common.getSysInfo); 
    // 应用中心基础信息
    router.get('/apmBaseInfo', Common.apmBaseInfo);

    /**
     * 测试接口
     */
    router.post('/test', Common.test);

    /**
     * 获取所有数据库表名
     */
    router.get('/getAllTableList', Common.getAllTableList);

    /**
     * 下载追踪工具文件
     */
    router.get('/downloadTracerFile', Common.downloadTracerFile);

    /**
     * 获取项目各项日志的总量（用于应用中心流量统计）
     */
    router.post('/getLogCountInfoByDay', Common.getLogCountInfoByDay);
}
