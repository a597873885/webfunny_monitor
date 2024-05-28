const { Common } = require("../../controllers/controllers")

module.exports = (router) => {
  // 获取日志服务所有相关信息
  router.get('/getSysInfo', Common.getSysInfo);
  // 获服务并发日志量
  router.post('/getConcurrencyByMinuteInHour', Common.getConcurrencyByMinuteInHour);
  // 获取某一天所有项目的日志总量
  router.post('/getLogCountInfoByDay', Common.getLogCountInfoByDay);
  /**
     * Docker 心跳检测
     */
  router.get('/health', Common.dockerHealth);
  /**
   * echarts相关的静态数据
   */
  router.get('/getEchartStatic', Common.getEchartStatic);
}
