# gRPC 服务模块

本目录包含所有与 gRPC 服务相关的代码，用于接收 SkyWalking SDK 的数据上报。

## 目录结构

```
grpc/
├── index.js                 # gRPC 服务入口文件
├── grpcServer.js           # gRPC 服务（字符串提取版本）
├── grpcServerProtobuf.js   # gRPC 服务（Protobuf 完整解析版本，推荐）
└── README.md               # 本文件
```

## 文件说明

### index.js
- gRPC 服务的启动入口
- 导出 `startGrpcServer()` 函数供主服务调用
- 负责配置管理和进程信号处理

### grpcServerProtobuf.js（推荐使用）
- 使用 Protobuf 完整解析 SkyWalking 数据
- 支持以下服务：
  - **ManagementService**: 实例注册和心跳
  - **TraceSegmentReportService**: 追踪数据上报
  - **LogReportService**: 日志数据上报
  - **JVMMetricReportService**: JVM 指标上报
- 提供完整的数据解析和存储功能

### grpcServer.js（备选方案）
- 使用字符串提取的简化版本
- 适用于不需要完整 Protobuf 解析的场景

## 使用方法

在主服务文件中引入：

```javascript
const { startGrpcServer } = require('./grpc')
startGrpcServer()
```

## 配置

gRPC 服务端口在 `config/AccountConfig.js` 中配置：

```javascript
grpcPort: conf.grpc?.port || 11800
```

## 依赖项

- `@grpc/grpc-js`: gRPC 核心库
- `@grpc/proto-loader`: Protobuf 加载器

安装命令：
```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

## Proto 文件

Proto 定义文件位于 `../proto/` 目录：
- `Tracing.proto`: 追踪数据定义
- `Management.proto`: 管理服务定义
- `Logging.proto`: 日志服务定义
- `JVMMetric.proto`: JVM 指标定义
- `common.proto`: 公共定义

## 数据存储

接收到的数据通过 `../modules/apmStorage` 模块存储到 ClickHouse 数据库。

