var fs = require('fs');
const path = require('path')
require('colors')
const rootPath = path.resolve(__dirname, "..")

/**
 * 初始化 selfMonitor 配置文件
 * 生成 webfunny.config/selfMonitor.js
 */
const setSelfMonitorConfig = () => {
  const selfMonitorConfigPath = rootPath + "/webfunny.config/selfMonitor.js"
  fs.readFile(selfMonitorConfigPath, "utf8", (err) => {
    if (err) {
      console.log("× " + selfMonitorConfigPath + " 配置文件不存在，即将创建...")
      
      // 生成 serviceInstanceId（格式：webfunny_YYYYMMDD_HHMMSS_pro）
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const serviceInstanceId = `webfunny_${year}${month}${day}_${hours}${minutes}${seconds}_pro`
      
      var selfMonitorConfigFile = `/**
 * OpenTelemetry 追踪配置（Webfunny 自监控专用）
 * 
 * 注意：此配置为 Webfunny 内部自监控使用
 * 客户项目请参考 APM 应用设置页的部署文档，使用通用配置
 */
module.exports = {
  enabled: false,  // 自监控全局开关
  serviceName: 'Webfunny本地测试',
  serviceInstanceId: '${serviceInstanceId}',
  serviceNamespace: 'webfunny',
  deploymentEnvironment: 'local',
  exporterEndpoint: 'localhost:9013',
  serviceVersion: "1.0.0",

  // 前端监控开关
  feMonitor: {
    enabled: false, // 是否启用前端监控
    uploadDomain: 'http://www.xxx.com/',
    webMonitorId: 'webfunny_20260101_xxxx_pro',
  },
  
  // URL 过滤（这些 URL 不会被追踪）
  // 支持：字符串（包含匹配）、通配符（*/upLog）、正则表达式、函数
  ignoreUrls: [
    '/health',
    '/ping',
    '/favicon.ico',
    '/wfMonitor/initCf',
    '/wfMonitor/upLogs',
    '/wfMonitor/upMog',
    '/wfMonitor/upMyLog',
    '/wfEvent/initCf',
    '/wfEvent/upEvents',
    '/wfLog/upLog',
    '*/upLog',              // 通配符匹配
    /^\\/static\\//,          // 正则匹配：静态资源
  ],
  
  // 出站请求过滤（可选）
  // 支持：字符串（包含匹配）、通配符、正则表达式、函数
  // 注意：URL 会自动包含端口号（格式：host:port/path），可以根据需要配置不同的端口
  ignoreOutgoingUrls: [
    /:\\/\\/[\\d.]+:8123/,                 // 正则匹配：完整 URL 格式（http://8.133.201.61:8123）
    /^[\\d.]+:8123/,                      // 正则匹配：host:port 格式（8.133.201.61:8123）
    /[\\d.]+:8123/,                       // 正则匹配：包含 8123 端口的请求（兜底匹配）
    // 示例：如果要过滤其他端口的数据库请求，可以添加：
    // /[\\d.]+:3306/,                    // MySQL 默认端口
    // /[\\d.]+:5432/,                    // PostgreSQL 默认端口
    // /[\\d.]+:6379/,                    // Redis 默认端口
    // /^8\\.133\\.201\\.61:/,              // 匹配特定 IP 的所有端口
  ],

  // ==================== 功能开关 ====================
  // ClickHouse 追踪
  clickhouse: {
    enabled: true,           // 是否启用 ClickHouse 查询追踪
    maxSqlLength: 5000,       // SQL 最大长度
    recordRows: true,        // 是否记录返回行数
    recordDuration: true,    // 是否记录执行时间
  },

  // 业务方法追踪（Controller/Model）
  business: {
    enabled: true,           // 是否启用业务方法追踪
    traceController: true,   // 是否追踪 Controller
    traceModel: true,        // 是否追踪 Model
    traceService: false,     // 是否追踪 Service（暂未实现）
    
    // 排除列表：不追踪这些方法
    excludeMethods: [
      'getUserTokenDetailByToken',
      'checkToken',
    ],
    
    // 路径匹配配置（目录名和文件名配合匹配）
    // 如果不配置，使用默认值：servers/*/controllers/controllers.js 和 servers/*/modules/models.js
    pathMatch: {
      // Controller 匹配配置
      controller: {
        dirNames: ['controllers'],        // 目录名（支持多个，只要路径中包含任一目录名即可）
        fileNames: ['controllers.js'],     // 文件名（支持多个，只要路径以任一文件名结尾即可）
        // 示例：匹配 controllers/controllers.js 或 src/controllers/controllers.js
      },
      // Model 匹配配置
      model: {
        dirNames: ['modules'],             // 目录名（支持多个）
        fileNames: ['models.js'],          // 文件名（支持多个）
        // 示例：匹配 modules/models.js 或 src/modules/models.js
      },
    },
  },

  // ==================== 高级配置 ====================
  // 性能阈值
  performance: {
    slowQueryThreshold: 1000,  // 慢查询阈值（ms）
    warnDuration: 500,         // 警告耗时（ms）
  },

  // 调试配置
  debug: {
    logSpanCreation: false,   // 是否打印 Span 创建日志
    logErrors: true,          // 是否打印追踪错误
  },

  // ==================== 采样器配置 ====================
  // 采样器配置
  sampler: {
    type: 'alwaysOn',         // 采样器类型：'alwaysOn' | 'alwaysOff' | 'traceIdRatio' | 'parentBased'
    ratio: 1.0,               // 采样率（0.0 - 1.0），仅用于 traceIdRatio 和 parentBased
    // 说明：
    // - alwaysOn: 采样所有请求（100%）
    // - alwaysOff: 不采样任何请求（0%）
    // - traceIdRatio: 基于 TraceId 的随机采样，ratio 为采样率（如 0.5 表示 50%）
    // - parentBased: 基于父 Span 的采样，如果父 Span 已采样则采样，否则根据 ratio 决定
  },
}
`
      fs.writeFile(selfMonitorConfigPath, selfMonitorConfigFile, (err) => {
        if (err) throw err;
        console.log("√ " + selfMonitorConfigPath + " 配置文件创建完成！");
      });
    } else {
      console.log("√ " + selfMonitorConfigPath + " 配置文件已存在！")
    }
  });
}

const run = async () => {
  // 确保 webfunny.config 目录存在
  fs.mkdir(rootPath + "/webfunny.config", function(err) {
    if (err) {
      console.log(`= 文件夹 ${rootPath}/webfunny.config 已经存在`)
    } else {
      console.log(`= 创建文件夹 ${rootPath}/webfunny.config`)
    }
    setSelfMonitorConfig()
  })
}

run()

