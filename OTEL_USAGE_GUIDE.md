# OpenTelemetry 使用指南

本文档介绍如何在项目中使用 OpenTelemetry 进行分布式追踪。

## 📋 目录

- [快速开始](#快速开始)
- [初始化配置](#初始化配置)
- [自动追踪功能](#自动追踪功能)
- [手动追踪方法](#手动追踪方法)
- [配置说明](#配置说明)
- [错误处理](#错误处理)
- [常见场景](#常见场景)
- [故障排查](#故障排查)

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-grpc @opentelemetry/exporter-trace-otlp-proto @opentelemetry/exporter-trace-otlp-http @opentelemetry/resources @opentelemetry/semantic-conventions
```

### 2. 在 `app.js` 中初始化

在 `app.js` 文件的最开始（**必须在所有 require 之前**）添加以下代码：

```javascript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 OpenTelemetry 初始化（必须在所有 require 之前引入）
// 配置文件：config/tracingConfig.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { initOtel } = require('./utils/otelTracer');
// const { initOtel } = require('./utils/otelTracerForArms');  // 阿里云 ARMS 使用此文件

// 初始化 OpenTelemetry（配置在 config/tracingConfig.js 中）
// 如果需要覆盖配置，可以传入参数：initOtel({ serviceName: '...' })
initOtel();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 自动追踪加载器（必须在 Koa 等框架加载之前）
// 零侵入方案：自动包装所有 Controller 和 Model，无需修改业务代码
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
require('./utils/autoTracer');
```

### 3. 配置追踪参数

编辑 `config/tracingConfig.js` 文件，配置服务名称、导出器地址等参数。

---

## ⚙️ 初始化配置

### 基本初始化

最简单的初始化方式，使用配置文件中的默认设置：

```javascript
const { initOtel } = require('./utils/otelTracer');
initOtel();
```

### 自定义配置初始化

如果需要覆盖配置文件中的某些参数，可以在初始化时传入：

```javascript
initOtel({
  serviceName: 'my-custom-service',
  serviceVersion: '2.0.0',
  exporterEndpoint: 'http://localhost:4317',
  enabled: true
});
```

### 支持的配置参数

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `serviceName` | string | 服务名称 | `unknown-service` |
| `serviceVersion` | string | 服务版本 | `1.0.0` |
| `serviceInstanceId` | string | 服务实例 ID | `instance-${Date.now()}` |
| `serviceNamespace` | string | 服务命名空间 | `default` |
| `deploymentEnvironment` | string | 部署环境 | `production` |
| `exporterEndpoint` | string | OTLP 导出器地址 | `localhost:4317` |
| `enabled` | boolean | 是否启用追踪 | `true` |
| `ignoreUrls` | Array | 忽略追踪的 URL 列表 | `['/health', '/ping']` |

---

## 🎯 自动追踪功能

### 零侵入自动追踪

项目实现了零侵入的自动追踪方案，无需修改任何业务代码即可追踪：

- ✅ **HTTP 请求**：自动追踪所有 Koa 路由
- ✅ **数据库查询**：自动追踪 MySQL、ClickHouse、Redis、MongoDB
- ✅ **Controller 方法**：自动追踪所有 Controller 类的方法
- ✅ **Model 方法**：自动追踪所有 Model 类的方法

### 自动追踪的工作原理

1. **HTTP 请求追踪**：通过 `@opentelemetry/instrumentation-koa` 自动插桩
2. **数据库追踪**：通过 `@opentelemetry/instrumentation-mysql` 等自动插桩
3. **业务方法追踪**：通过 `autoTracer.js` 拦截 `require()`，自动包装 Controller 和 Model

### 自动追踪的文件路径规则

- **Controller**：`servers/*/controllers/controllers.js`
- **Model**：`servers/*/modules/models.js`

### 启用/禁用自动追踪

在 `config/tracingConfig.js` 中配置：

```javascript
module.exports = {
  enabled: true,  // 总开关
  
  // ClickHouse 追踪
  clickhouse: {
    enabled: true,  // 是否启用 ClickHouse 查询追踪
  },
  
  // 业务方法追踪
  business: {
    enabled: true,           // 是否启用业务方法追踪
    traceController: true,   // 是否追踪 Controller
    traceModel: true,        // 是否追踪 Model
  },
};
```

---

## 🔧 手动追踪方法

### 1. 追踪 ClickHouse 查询

```javascript
const { traceClickHouseQuery } = require('./utils/otelTracer');

// 方式一：直接包装查询函数
const result = await traceClickHouseQuery(
  async () => {
    return await clickhouseClient.query('SELECT * FROM users');
  },
  {
    sql: 'SELECT * FROM users',
    peer: 'clickhouse-cluster:9000'
  }
);

// 方式二：包装 ClickHouse 客户端（推荐）
const { wrapClickHouseQuery } = require('./utils/otelTracer');
wrapClickHouseQuery(clickhouseClient, { serviceName: 'monitor' });
// 之后所有的 query 调用都会自动追踪
```

### 2. 追踪业务方法

```javascript
const { traceBusinessMethod } = require('./utils/otelTracer');

// 同步方法
const result = traceBusinessMethod(
  'User/getUserById',
  () => {
    return userModel.findById(id);
  },
  { 'user.id': id }  // 自定义标签
);

// 异步方法
const result = await traceBusinessMethod(
  'User/createUser',
  async () => {
    return await userModel.create(userData);
  },
  { 'user.email': userData.email }
);
```

### 3. 手动包装 Controller/Model

```javascript
const { wrapController, wrapModel } = require('./utils/otelTracer');

// 包装 Controller
const UserController = wrapController(UserControllerClass, 'UserController');

// 包装 Model
const UserModel = wrapModel(UserModelClass, 'UserModel');

// 包装并排除特定方法（只对当前 Controller 生效）
const AuthController = wrapController(
  AuthControllerClass, 
  'AuthController',
  ['checkToken', 'refreshToken']  // 这些方法不会被追踪
);
```

**排除方法的两种方式：**

1. **全局排除**：在 `config/tracingConfig.js` 中配置 `business.excludeMethods`，对所有 Controller/Model 生效
2. **局部排除**：调用 `wrapController()` 时传入第三个参数，只对当前类生效

**何时使用排除：**
- 高频调用的方法（如 token 验证）
- 简单的工具方法（如数据格式化）
- 不需要监控的内部方法

---

## 📝 配置说明

### 配置文件位置

配置文件：`config/tracingConfig.js`

### 配置文件依赖关系

**重要说明：** `config/tracingConfig.js` 会从 `webfunny.config/index.js` 中读取部分基础配置：

```javascript
const { version } = require("../package.json")
const WebfunnyConfig = require("../webfunny.config")

module.exports = {
  // ==================== SDK 配置 ====================
  ...WebfunnyConfig.otherConfig.selfMonitor,  // 👈 从这里读取基础配置
  serviceVersion: version,
  // ...
}
```

**在 `webfunny.config/index.js` 中配置：**

```javascript
const otherConfig = {
  // ... 其他配置
  
  "selfMonitor": {               // 自监控配置
    "enabled": true,               // 总开关：是否开启监控
    "serviceName": 'Webfunny本地测试',
    "serviceInstanceId": 'webfunny_20251222_145226_pro',
    "serviceNamespace": 'webfunny',
    "deploymentEnvironment": 'local',
    
    // OTLP 导出器配置（APM 服务器地址）
    "exporterEndpoint": 'localhost:4317',  // gRPC 协议
    "armsEndpoint": '',                     // 阿里云 ARMS 地址（可选）
  },
}
```

**配置优先级：**
1. `initOtel()` 传入的参数（最高优先级）
2. `config/tracingConfig.js` 中的配置
3. `webfunny.config/index.js` 中的配置（通过 spread 操作符合并）

### 完整配置示例

```javascript
const { version } = require("../package.json")
const WebfunnyConfig = require("../webfunny.config")

module.exports = {
  // ==================== SDK 配置 ====================
  enabled: true,
  serviceName: 'webfunny-monitor',
  serviceVersion: version,
  serviceInstanceId: `webfunny-${require("os").hostname()}`,
  serviceNamespace: 'default',
  deploymentEnvironment: 'production',
  exporterEndpoint: 'http://localhost:4317',  // 或 'http://localhost:4318' (HTTP)
  
  // ==================== URL 过滤 ====================
  // 这些 URL 不会被追踪
  ignoreUrls: [
    '/health',
    '/ping',
    '/favicon.ico',
    '*/upLog',              // 通配符匹配
    /^\/static\//,          // 正则匹配：静态资源
  ],
  
  // 出站请求过滤（可选）
  ignoreOutgoingUrls: [
    /:\/\/[\d.]+:8123/,     // 正则匹配：包含 8123 端口的请求
  ],
  
  // ==================== 功能开关 ====================
  // ClickHouse 追踪
  clickhouse: {
    enabled: true,
    maxSqlLength: 500,       // SQL 最大长度
    recordRows: true,        // 是否记录返回行数
  },
  
  // 业务方法追踪
  business: {
    enabled: true,
    traceController: true,   // 是否追踪 Controller 方法
    traceModel: true,        // 是否追踪 Model 方法
    excludeMethods: [        // 排除列表：不追踪这些方法（全局生效）
      'getUserTokenDetailByToken',  // 高频调用的 token 验证方法
      'checkToken',                  // 避免产生大量无用 Span
      // 添加更多需要排除的方法名...
    ],
  },
  
  // ==================== 高级配置 ====================
  performance: {
    slowQueryThreshold: 1000,  // 慢查询阈值（ms）
    warnDuration: 500,         // 警告耗时（ms）
  },
  
  debug: {
    logSpanCreation: false,   // 是否打印 Span 创建日志
    logErrors: true,          // 是否打印追踪错误
  },
};
```

### 导出器协议选择

项目支持两种追踪器：

1. **`otelTracer.js`** - 使用 gRPC 协议（默认，端口 4317）
   - 适用于：自建 APM、SigNoz、Jaeger
   ```javascript
   const { initOtel } = require('./utils/otelTracer');
   ```

2. **`otelTracerForArms.js`** - 使用 HTTP/Protobuf 协议（端口 4318）
   - 适用于：阿里云 ARMS、AWS X-Ray、大多数云服务
   ```javascript
   const { initOtel } = require('./utils/otelTracerForArms');
   ```

### 协议对比

| 协议 | 端口 | 适用场景 | 导出器类 |
|------|------|---------|---------|
| gRPC | 4317 | 自建 APM、SigNoz、Jaeger | `OTLPTraceExporter` (gRPC) |
| http/protobuf | 4318 | 阿里云、AWS、大多数云服务 | `OTLPTraceExporter` (HTTP) |
| http/json | 4318 | 调试、简单场景 | `OTLPTraceExporter` (HTTP) |

### 阿里云 ARMS 配置示例

**步骤 1：修改 `webfunny.config/index.js`**

```javascript
const otherConfig = {
  // ... 其他配置
  
  "selfMonitor": {
    "enabled": true,
    "serviceName": 'Webfunny_online',
    "serviceInstanceId": 'webfunny_prod_001',
    "serviceNamespace": 'webfunny',
    "deploymentEnvironment": 'prod',
    
    // 阿里云 ARMS 配置
    "armsEndpoint": 'http://tracing-analysis-dc-sh.aliyuncs.com/adapt_xxx@xxx/api/otlp/traces',
    "exporterEndpoint": 'localhost:4317',  // 自建 APM 地址（备用）
  },
}
```

**步骤 2：在 `config/tracingConfig.js` 中添加 ARMS 请求头（可选）**

```javascript
module.exports = {
  // ... 其他配置（会自动从 webfunny.config 读取）
  
  // 如果 ARMS 需要认证，在此添加请求头
  armsHeaders: {
    'Authorization': 'Bearer your-token',
  },
};
```

**步骤 3：在 `app.js` 中切换到 ARMS 追踪器**

```javascript
// 注释掉默认的 gRPC 追踪器
// const { initOtel } = require('./utils/otelTracer');

// 使用阿里云 ARMS 追踪器（HTTP/Protobuf 协议）
const { initOtel } = require('./utils/otelTracerForArms');
initOtel();
```

### 实际集成示例

项目中已经在多个 ClickHouse 配置文件中集成了追踪功能，无需手动修改业务代码。

**示例：`servers/monitor/config/node_clickhouse.js`**

```javascript
const { client } = require('../config/db')
const WebfunnyClickHouse = require("webfunny-clickhouse")

// 引入 OpenTelemetry 追踪工具（可插拔）
const { wrapClickHouseQuery } = require('../../../utils/otelTracer')

class NodeClickhouse extends WebfunnyClickHouse {
  constructor(schemaPath = "") {
    super({ schemaPath: schemaPath ? path.resolve(__dirname, schemaPath) : "", client, showSql })
    
    // 👇 自动包装 query 方法，添加 OpenTelemetry 追踪（受配置控制）
    wrapClickHouseQuery(this, { serviceName: 'monitor' })
  }
  // ... 其他方法
}

module.exports = NodeClickhouse
```

**工作原理：**
1. `wrapClickHouseQuery()` 会拦截 `this.query()` 方法
2. 在每次查询前自动创建 Span，记录 SQL 语句
3. 查询完成后记录执行时间、返回行数等信息
4. 所有追踪数据自动上报到 APM 服务器

**已集成的服务：**
- ✅ `servers/monitor/config/node_clickhouse.js` - 监控服务
- ✅ `servers/event/config/node_clickhouse.js` - 埋点服务
- ✅ `servers/logger/config/node_clickhouse.js` - 日志服务
- ✅ `servers/center/config/node_clickhouse.js` - 应用中心
- ✅ `servers/file/config/node_clickhouse.js` - 文件服务

**追踪效果：**
```
HTTP Request: GET /api/getUserList
  └─ Controller/MonitorUserController.getUserList
      └─ Model/MonitorUserModel.findAll
          └─ ClickHouse/query (SELECT * FROM users WHERE ...)
              ├─ db.system: clickhouse
              ├─ db.statement: SELECT * FROM users...
              ├─ db.rows_affected: 150
              └─ duration: 45ms
```

---

## ⚠️ 错误处理

### 在中间件中记录异常

项目在 `app.js` 中已经集成了异常追踪：

```javascript
app.use(async (ctx, next) => {
  const start = new Date()
  let ms = 0
  try {
    await next();
    ms = new Date() - start
  } catch (error) {
    ms = new Date() - start
    // 在 OTEL 追踪上下文中记录异常
    const activeSpan = otelApi.trace.getActiveSpan();
    if (activeSpan) {
      activeSpan.recordException(error);
      activeSpan.setStatus({ 
        code: otelApi.SpanStatusCode.ERROR, 
        message: error.message 
      });
    }
    // 记录异常日志
    log.error(ctx, error, ms);
    ctx.response.status = 500;
    ctx.body = statusCode.ERROR_500('服务器异常，请检查 logs/error 目录下日志文件', "")
  }
})
```

### 手动记录异常

```javascript
const otelApi = require('@opentelemetry/api');

try {
  // 业务代码
} catch (error) {
  const activeSpan = otelApi.trace.getActiveSpan();
  if (activeSpan) {
    activeSpan.recordException(error);
    activeSpan.setStatus({ 
      code: otelApi.SpanStatusCode.ERROR, 
      message: error.message 
    });
  }
  throw error;
}
```

---

## 💡 常见场景

### 场景 1：追踪定时任务

定时任务默认不会被追踪（因为没有活跃的 Span）。如果需要追踪定时任务，可以手动创建 Span：

```javascript
const otelApi = require('@opentelemetry/api');
const { traceBusinessMethod } = require('./utils/otelTracer');

// 创建根 Span
const tracer = otelApi.trace.getTracer('scheduler');
tracer.startActiveSpan('Scheduler/dailyReport', async (span) => {
  try {
    // 在 Span 内部调用业务方法，会自动创建子 Span
    await traceBusinessMethod('Report/generateDaily', async () => {
      return await reportService.generateDaily();
    });
    
    span.setStatus({ code: otelApi.SpanStatusCode.OK });
  } catch (error) {
    span.recordException(error);
    span.setStatus({ 
      code: otelApi.SpanStatusCode.ERROR, 
      message: error.message 
    });
  } finally {
    span.end();
  }
});
```

### 场景 2：添加自定义标签

```javascript
const otelApi = require('@opentelemetry/api');

const activeSpan = otelApi.trace.getActiveSpan();
if (activeSpan) {
  activeSpan.setAttribute('user.id', userId);
  activeSpan.setAttribute('user.email', userEmail);
  activeSpan.setAttribute('request.type', 'api');
}
```

### 场景 3：过滤特定请求

在 `config/tracingConfig.js` 中配置：

```javascript
ignoreUrls: [
  '/health',
  '/ping',
  '/metrics',
  '*/upLog',              // 通配符匹配所有包含 upLog 的路径
  /^\/static\//,          // 正则匹配：所有 /static/ 开头的路径
  (url) => url.includes('debug'),  // 函数匹配：包含 debug 的 URL
],
```

### 场景 4：追踪外部 HTTP 请求

外部 HTTP 请求会自动被追踪（通过 `@opentelemetry/instrumentation-http`）。如果需要过滤某些请求：

```javascript
ignoreOutgoingUrls: [
  /:\/\/[\d.]+:8123/,     // 过滤 ClickHouse 请求
  /:\/\/[\d.]+:3306/,     // 过滤 MySQL 请求
  'internal-service',     // 过滤包含此字符串的请求
],
```

---

## 🔍 故障排查

### 1. 检查初始化是否成功

启动应用后，查看控制台输出：

```
✅ OpenTelemetry SDK 已启动
📡 服务名称: webfunny-monitor
📡 实例 ID: webfunny-hostname
📡 导出器地址: http://localhost:4317
🎯 采样器: AlwaysOn (所有请求都被采样)
🎯 [AutoTracer] 自动追踪加载器已启用
   - Controller 自动包装: ✅
   - Model 自动包装: ✅
```

如果没有看到这些输出，检查：
- `config/tracingConfig.js` 中 `enabled` 是否为 `true`
- 是否正确引入了 `initOtel()`
- 是否在所有 require 之前初始化

### 2. 检查数据是否上报

- 查看 APM 服务器是否收到数据
- 检查导出器地址是否正确
- 检查网络连接是否正常

### 3. 检查自动追踪是否生效

启用调试日志：

```javascript
// config/tracingConfig.js
debug: {
  logSpanCreation: true,  // 打印 Span 创建日志
  logErrors: true,
}
```

### 4. 常见问题

**Q: 定时任务被追踪了，导致 traceId 重复？**

A: 定时任务默认不会被追踪。如果出现此问题，检查是否有活跃的 Span 被污染。确保定时任务在独立的上下文中运行。

**Q: 某些请求没有被追踪？**

A: 检查 `ignoreUrls` 配置，确认该 URL 是否在忽略列表中。

**Q: 数据没有上报到 APM 服务器？**

A: 
1. 检查导出器地址是否正确
2. 检查协议是否匹配（gRPC vs HTTP）
3. 检查网络连接
4. 查看控制台是否有错误信息

**Q: Node.js 版本要求？**

A: OpenTelemetry 建议使用 Node.js >= 18.19.0。如果使用 Node.js 16，可能会有兼容性问题。

**Q: ClickHouse 查询没有被追踪？**

A: 
1. 确认 `config/tracingConfig.js` 中 `clickhouse.enabled` 为 `true`
2. 检查 `node_clickhouse.js` 中是否调用了 `wrapClickHouseQuery(this, { serviceName: '...' })`
3. 检查是否在 HTTP 请求上下文中（定时任务中的查询不会被追踪）

**Q: Controller/Model 方法没有被追踪？**

A:
1. 确认 `config/tracingConfig.js` 中 `business.enabled` 为 `true`
2. 确认 `business.traceController` 或 `business.traceModel` 为 `true`
3. 检查方法名是否在 `excludeMethods` 列表中
4. 确认文件路径匹配 `servers/*/controllers/controllers.js` 或 `servers/*/modules/models.js`

### 5. 快速诊断流程

如果追踪没有生效，按照以下流程排查：

```bash
# 1. 检查服务是否启动成功（查看控制台输出）
✅ OpenTelemetry SDK 已启动
📡 服务名称: webfunny-monitor
📡 实例 ID: webfunny-hostname
📡 导出器地址: http://localhost:4317
🎯 采样器: AlwaysOn (所有请求都被采样)
🎯 [AutoTracer] 自动追踪加载器已启用
   - Controller 自动包装: ✅
   - Model 自动包装: ✅

# 2. 检查配置文件（webfunny.config/index.js）
selfMonitor.enabled = true  ✅
selfMonitor.exporterEndpoint = "localhost:4317"  ✅

# 3. 检查追踪配置（config/tracingConfig.js）
enabled = true  ✅
clickhouse.enabled = true  ✅
business.enabled = true  ✅

# 4. 检查 APM 服务器
telnet localhost 4317  # gRPC 端口是否可访问
telnet localhost 4318  # HTTP 端口是否可访问

# 5. 启用调试日志
# 在 config/tracingConfig.js 中设置：
debug.logSpanCreation = true
debug.logErrors = true

# 6. 发起测试请求
curl http://localhost:9011/api/test
# 查看控制台输出是否有 Span 创建日志
```

---

## 📚 相关文件

- `app.js` - 应用入口，初始化 OpenTelemetry
- `utils/otelTracer.js` - OpenTelemetry 追踪封装（gRPC）
- `utils/otelTracerForArms.js` - OpenTelemetry 追踪封装（HTTP/Protobuf，阿里云）
- `utils/autoTracer.js` - 自动追踪加载器
- `config/tracingConfig.js` - 追踪配置文件

---

## 🔗 相关文档

- [OpenTelemetry 官方文档](https://opentelemetry.io/docs/)
- [OTEL_MIGRATION.md](./OTEL_MIGRATION.md) - 从 SkyWalking 迁移指南

---

## 📝 更新日志

### v1.1.0 (2026-01-12)
- ✨ 新增：补充配置文件依赖关系说明
- ✨ 新增：阿里云 ARMS 配置分步骤指导
- ✨ 新增：实际集成示例（`node_clickhouse.js`）
- ✨ 新增：`excludeMethods` 使用说明（全局/局部）
- ✨ 新增：常见问题解答（ClickHouse/Controller/Model 追踪问题）
- ✨ 新增：快速诊断流程
- 🐛 修复：优化配置示例和注释

### v1.0.0 (2025-12-22)
- ✅ 初始版本，支持基本的 OpenTelemetry 追踪功能
- ✅ 支持自动追踪 HTTP 请求、数据库查询、Controller/Model 方法
- ✅ 支持零侵入的自动包装方案
- ✅ 支持多种导出器协议（gRPC、HTTP/Protobuf）

---

**如有问题，请查看故障排查章节或联系技术支持。**

