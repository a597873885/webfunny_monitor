/**
 * OpenTelemetry 追踪配置（统一配置文件）
 * 包含 SDK 配置和功能开关
 * 
 * 注意：配置已内联到 app.js 中，此文件仅作为向后兼容保留
 * 如需修改配置，请在 app.js 中修改 tracingConfig 对象
 */
const { version } = require("../package.json")
const WebfunnyConfig = require("../webfunny.config")
module.exports = {
  // ==================== SDK 配置 ====================
  ...WebfunnyConfig.otherConfig.selfMonitor,
  serviceVersion: version,
  
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
    /^\/static\//,          // 正则匹配：静态资源
  ],
  
  // 出站请求过滤（可选）
  // 支持：字符串（包含匹配）、通配符、正则表达式、函数
  // 注意：URL 会自动包含端口号（格式：host:port/path），可以根据需要配置不同的端口
  ignoreOutgoingUrls: [
    /:\/\/[\d.]+:8123/,                 // 正则匹配：完整 URL 格式（http://8.133.201.61:8123）
    /^[\d.]+:8123/,                      // 正则匹配：host:port 格式（8.133.201.61:8123）
    /[\d.]+:8123/,                       // 正则匹配：包含 8123 端口的请求（兜底匹配）
    // 示例：如果要过滤其他端口的数据库请求，可以添加：
    // /[\d.]+:3306/,                    // MySQL 默认端口
    // /[\d.]+:5432/,                    // PostgreSQL 默认端口
    // /[\d.]+:6379/,                    // Redis 默认端口
    // /^8\.133\.201\.61:/,              // 匹配特定 IP 的所有端口
  ],

  // ==================== 功能开关 ====================
  // ClickHouse 追踪
  clickhouse: {
    enabled: true,           // 是否启用 ClickHouse 查询追踪
    maxSqlLength: 500,       // SQL 最大长度
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
};
