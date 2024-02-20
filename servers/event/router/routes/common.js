const { Common } = require("../../controllers/controllers")

module.exports = (router) => {
  // 获取日志服务所有相关信息
  router.get('/getSysInfo', Common.getSysInfo);
  // 获服务并发日志量
  router.post('/getConcurrencyByMinuteInHour', Common.getConcurrencyByMinuteInHour);
  /**
     * Docker 心跳检测
     */
  router.get('/health', Common.dockerHealth);
}
