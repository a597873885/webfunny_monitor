/**
 * 部分接口数据做缓存
 */
const Utils = require('../../utils/utils')
const statusCode = require('../../utils/status-code')
const timerUtil = require("../../utils/timer")
const WebfunnyConfig = require("../../webfunny.config/index")
const crypto = require('crypto');

global.WebfunnyCacheDataList = {}

const defaultCacheDataTime = [0, 1, 5, 10, 30, 60]

// 缓存清理时间配置（分钟），优先从环境变量读取，否则从配置文件读取
const CACHE_CLEAN_TIME = parseInt(process.env.CACHE_CLEAN_TIME || WebfunnyConfig.otherConfig.cacheDataTime || '1', 10)

// 启动时校验配置值（只打印一次）
if (defaultCacheDataTime.indexOf(CACHE_CLEAN_TIME) === -1) {
  console.warn("CACHE_CLEAN_TIME并非枚举类型[0,1,5,10,30,60]，请重新设置...")
}

// 启动一个定时器，定时清理缓存（使用取模运算统一处理所有间隔）
timerUtil((time) => {
  // CACHE_CLEAN_TIME 为 0 时禁用清理
  if (CACHE_CLEAN_TIME === 0) return
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  // 当分钟数能被 CACHE_CLEAN_TIME 整除且为整秒时触发清理
  if (minutes % CACHE_CLEAN_TIME === 0 && seconds === 0) {
    global.WebfunnyCacheDataList = {}
  }
})

// 需要缓存的接口列表
const apiPaths = [
  //埋点系统
  "/wfEvent/buryPointCard/getCardListByIds",

  //监控系统
  // ===== 资源错误页面 =====
  "/wfMonitor/getResourceErrorOverview",      // 概览指标
  "/wfMonitor/getResourceErrorDistribution",  // 分布数据
  "/wfMonitor/getResourceErrorRank",          // 排行数据
  "/wfMonitor/getResourceErrorTrend",         // 趋势数据

  // ===== 页面性能页面 =====
  "/wfMonitor/getPageLoadOverview",                  // 概览指标
  "/wfMonitor/getPageLoadTimeDistribution",          // 加载时间分布
  "/wfMonitor/getPerformanceDataByTimeRange",        // 性能数据（时间范围）
  "/wfMonitor/getPerfDataForUrlByTimeRange",         // URL性能数据
  "/wfMonitor/getPerfDataForUrlByDaySimple",         // URL每日简单数据
  "/wfMonitor/getPerfDataForWaterfall",              // 瀑布图数据
  "/wfMonitor/getPerfDataForUrlDetail",              // URL详情数据
  "/wfMonitor/getPerfDataForMapByTimeRange",         // 地图数据
  "/wfMonitor/getPerfInfoByNetWorkByTimeRange",      // 网络维度数据
  "/wfMonitor/getPerfInfoByOsByTimeRange",           // 操作系统维度
  "/wfMonitor/getPerfInfoByBrowserByTimeRange",      // 浏览器维度
  "/wfMonitor/getPerfInfoByDeviceByTimeRange",       // 设备维度
  "/wfMonitor/getPerfInfoByCarrierByTimeRange",      // 运营商维度
  "/wfMonitor/getPercentileDataByTimeRange",         // 百分位数据
  "/wfMonitor/getFastSlowDataByTimeRange",           // 快慢数据

  // ===== 资源性能页面 =====
  "/wfMonitor/getResourcePerfOverview",          // 概览指标
  "/wfMonitor/getResourcePerfDistribution",      // 分布数据
  "/wfMonitor/getResourcePerfTrend",             // 趋势数据
  "/wfMonitor/getResourcePerfList",              // 资源列表
  "/wfMonitor/getResourcePerfRegionDist",        // 地域分布
  "/wfMonitor/getResourceListByPageKey",         // 按pageKey获取资源列表

  // ===== 接口性能页面 =====
  "/wfMonitor/getHttpLoadOverviewByTimeRange",           // 概览指标
  "/wfMonitor/getHttpLoadOverview",                      // 概览（旧接口）
  "/wfMonitor/getHttpLogDataByTimeRange",                // 日志数据（时间范围）
  "/wfMonitor/getHttpLogDataForUrlByTimeRange",          // URL维度日志数据
  "/wfMonitor/getHttpLogDataForUrlEnhancedByTimeRange",  // URL维度增强数据
  "/wfMonitor/getHttpPerfDetailByUrlByTimeRange",        // URL性能详情
  "/wfMonitor/getHttpPerfDataForMapByTimeRange",         // 地图数据
  "/wfMonitor/getHttpSuccessRateDataByTimeRange",        // 成功率数据
  "/wfMonitor/getHttpPercentileDataByTimeRange",         // 百分位数据
  "/wfMonitor/getHttpLoadTimeForGroupByTimeRange",       // 分组加载时间
  "/wfMonitor/getOperatorForGroupByTimeRange",           // 运营商分组
  "/wfMonitor/getMethodForGroupByTimeRange",             // 请求方法分组
  "/wfMonitor/getErrorCodeForGroupByTimeRange"           // 错误码分组
]
/**
 * 判断是否使用缓存数据
 */
module.exports = function () {
    return async function cacheDataMiddleware(ctx, next) {
      try {
        let finalProjectId = ""
        let finalApiPath = ""
        let wfParam = {}
        const { method, url, body } = ctx.request
        
        // 解析请求参数
        if (method.toLowerCase() === "get") {
            wfParam = Utils.parseQs(url)
        } else {
            // body 可能是 undefined（如果 bodyParser 还未执行）
            if (body === undefined || body === null) {
              await next()
              return
            }
            wfParam = typeof body === "string" ? JSON.parse(body) : body
        }
        // 自动解析参数
        ctx.wfParam = wfParam

        // 匹配是否属于缓存接口
        const apiIndex = apiPaths.indexOf(url)
        if (apiIndex === -1 || CACHE_CLEAN_TIME === 0) {
          await next()
          return
        }
        finalApiPath = apiPaths[apiIndex]

        const paramHash = crypto.createHash('md5').update(JSON.stringify(wfParam)).digest('hex');

        
        if (url.indexOf("/wfEvent/") !== -1) {
          // 埋点系统
          const { projectId } = wfParam
          finalProjectId = projectId
        } else if (url.indexOf("/wfMonitor/") !== -1) {
          // 监控系统
          const { webMonitorId } = wfParam
          finalProjectId = webMonitorId
        }

        let finalApiCacheKey = `${finalProjectId}${finalApiPath}/${paramHash}`
        // 有缓存结果
        if (global.WebfunnyCacheDataList[finalApiCacheKey]) {
          ctx.response.status = 200;
          ctx.body = statusCode.SUCCESS_200('success for cache', global.WebfunnyCacheDataList[finalApiCacheKey]);
          return
        }

        // 没有缓存结果，去接口重新获取
        ctx.apiCacheKey = finalApiCacheKey
        await next();

        // 接口返回后，自动缓存响应数据
        if (ctx.apiCacheKey && ctx.body && ctx.body.data) {
          global.WebfunnyCacheDataList[ctx.apiCacheKey] = ctx.body.data
        }
      } catch(e) {
        console.error('[cacheDataMiddleware] Error:', e)
        // await next()
      }
    }
}
