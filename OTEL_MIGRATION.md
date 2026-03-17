# 从 SkyWalking SDK 迁移到 OpenTelemetry

## ✅ 已完成的迁移工作

### 1. 安装依赖
```bash
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-grpc @opentelemetry/exporter-trace-otlp-proto @opentelemetry/exporter-trace-otlp-http @opentelemetry/resources @opentelemetry/semantic-conventions
```

### 2. 创建文件
- `utils/otelTracer.js` - OpenTelemetry 追踪封装
- `config/otelConfig.js` - OpenTelemetry 配置

### 3. 修改文件
- `app.js` - 使用 OpenTelemetry 替换 SkyWalking SDK
- `utils/autoTracer.js` - 改用 otelTracer
- `servers/monitor/config/node_clickhouse.js` - 改用 otelTracer
- `servers/event/config/node_clickhouse.js` - 改用 otelTracer
- `servers/logger/config/node_clickhouse.js` - 改用 otelTracer
- `servers/center/config/node_clickhouse.js` - 改用 otelTracer

## 🎯 OpenTelemetry vs SkyWalking SDK 的关键区别

### Context 管理
- **SkyWalking**: 使用 `ContextManager.current`，容易出现污染
- **OpenTelemetry**: 使用 `api.trace.getActiveSpan()`，更加稳定和可靠

### Span 创建
- **SkyWalking**: `context.newExitSpan()`, `context.newLocalSpan()`
- **OpenTelemetry**: `tracer.startActiveSpan()` 统一 API

### 判断是否在 HTTP 请求中
- **SkyWalking**: 需要检查 `context.spanStack[0].spanType === 0`
- **OpenTelemetry**: `api.trace.getActiveSpan()` 为 null 表示没有活跃 Span

## ⚠️ 注意事项

### 1. Node.js 版本要求
- OpenTelemetry 需要 Node.js >= 18.19.0
- 当前版本：v16.16.0（可能有兼容性问题）
- 建议：升级到 Node.js 18+ 或 20+

### 2. 导出器地址
- 默认：`http://localhost:11800`
- 可通过 `config/otelConfig.js` 修改
- 或通过环境变量 `OTEL_EXPORTER_OTLP_ENDPOINT` 配置

### 3. 与 APM 服务器的兼容性
- APM 服务器需要支持 OTLP 协议
- 如果使用 SkyWalking 后端，需要 9.0+ 版本
- 或者使用 OpenTelemetry Collector 转换数据格式

## 🔧 配置选项

在 `config/otelConfig.js` 中可以配置：
- `serviceName` - 服务名称
- `serviceVersion` - 服务版本
- `exporterEndpoint` - OTLP 导出器地址
- `exporterProtocol` - 导出协议（grpc | http/protobuf | http/json）
- `exporterHeaders` - 自定义请求头（用于认证等）
- `samplerType` - 采样器类型
- `samplerRatio` - 采样率

在 `config/tracingConfig.js` 中可以控制：
- `enabled` - 总开关
- `clickhouse.enabled` - ClickHouse 追踪开关
- `business.enabled` - Controller/Model 追踪开关

## ☁️ 对接云服务（如阿里云）

支持的导出协议：
- `grpc` - gRPC 协议（默认，连接自建 APM，端口通常 4317）
- `http/protobuf` - HTTP/Protobuf 协议（阿里云、AWS X-Ray 等）
- `http/json` - HTTP/JSON 协议

### 阿里云配置示例

在 `webfunny.config.js` 的 `selfMonitor` 配置中修改：

```javascript
selfMonitor: {
  enabled: true,
  serviceName: 'Webfunny_online',
  serviceInstanceId: `webfunny-${require("os").hostname()}`,
  deploymentEnvironment: 'prod',
  
  // 切换到阿里云
  exporterProtocol: 'http/protobuf',
  exporterEndpoint: 'http://tracing-analysis-dc-sh.aliyuncs.com/adapt_xxx@xxx/api/otlp/traces',
  exporterHeaders: {},  // 如需认证在此添加
}
```

### 自建 APM 配置示例

```javascript
selfMonitor: {
  enabled: true,
  serviceName: 'Webfunny_online',
  
  // 使用 gRPC 协议（默认）
  exporterProtocol: 'grpc',
  exporterEndpoint: 'localhost:4317',
}
```

### 协议对比

| 协议 | 端口 | 适用场景 |
|------|------|---------|
| grpc | 4317 | 自建 APM、SigNoz、Jaeger |
| http/protobuf | 4318 | 阿里云、AWS、大多数云服务 |
| http/json | 4318 | 调试、简单场景 |

## 🚀 启动测试

1. 重启应用
2. 查看控制台是否有 "✅ OpenTelemetry SDK 已启动"
3. 发起 HTTP 请求测试
4. 查看 APM 服务器是否收到数据

## 📝 预期改进

1. ✅ **Context 污染问题彻底解决** - OTel 使用 `getActiveSpan()` 判断，不会污染定时任务
2. ✅ **traceId 重复问题解决** - OTel 的 traceId 生成机制更加可靠
3. ✅ **更好的自动插桩** - 支持更多框架和库
4. ✅ **标准化** - 可以随时切换到其他 APM 后端

## 🔙 回滚方案

如果 OpenTelemetry 出现问题，可以快速回滚：

1. 在 `app.js` 中注释掉 OpenTelemetry，恢复 SkyWalking 代码
2. 将各个 `node_clickhouse.js` 的 `require('./otelTracer')` 改回 `require('./clickhouseTracer')`
3. 将 `autoTracer.js` 改回使用 `clickhouseTracer`
4. 重启应用

## ⚠️ 已知限制

1. **Node.js 版本** - 可能需要升级 Node.js
2. **APM 服务器协议** - 需要确认是否支持 OTLP
3. **数据格式** - Span 的字段名可能有差异，需要验证

## 📊 下一步

测试应用启动，查看是否有报错。如果启动成功，需要验证：
1. 数据是否正确上报到 APM 服务器
2. traceId 是否还会重复
3. Context 污染是否解决

