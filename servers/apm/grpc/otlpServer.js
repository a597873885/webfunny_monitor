const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { CommonUpLog } = require('../controllers/controllers');

class OtlpGrpcServer {
  constructor(port = 9013) {
    this.port = port;
    this.server = null;
    
    // 全局去重 Map（防止重复数据）
    this.processedSpans = new Map();
    this.processedSegments = new Map(); // Segment 去重 Map
    this.cleanupTimer = null; // 保存定时器引用
    this.startCleanupTimer();
  }

  /**
   * 启动定时清理任务，防止 Map 无限增长
   */
  startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const timeout = 5 * 60 * 1000; // 5分钟

      for (const [key, timestamp] of this.processedSpans.entries()) {
        if (now - timestamp > timeout) {
          this.processedSpans.delete(key);
        }
      }

      // 清理 Segment 去重 Map
      for (const [key, timestamp] of this.processedSegments.entries()) {
        if (now - timestamp > timeout) {
          this.processedSegments.delete(key);
        }
      }

    }, 60 * 1000); // 每分钟清理一次
  }

  /**
   * 加载 OpenTelemetry Protobuf 定义
   */
  loadProto() {
    const PROTO_PATH = path.join(__dirname, '../proto/opentelemetry/proto/collector/trace/v1/trace_service.proto');
    
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [
        path.join(__dirname, '../proto') // 包含根目录
      ]
    });

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    return protoDescriptor.opentelemetry.proto.collector.trace.v1;
  }

  /**
   * 处理 Export 请求
   */
  async export(call, callback) {
    try {
      const request = call.request;
      
      // 调用 CommonUpLog 处理数据
      const result = await CommonUpLog.handleOtlpData(request, this.processedSpans, this.processedSegments);

      if (!result.success) {
        // 如果处理失败，返回错误
        callback({
          code: grpc.status.INTERNAL,
          message: result.error || '处理失败'
        });
        return;
      }

      // 返回成功响应
      callback(null, { partial_success: {} });
    } catch (error) {
      console.error('❌ [OTLP] 处理数据失败:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: error.message
      });
    }
  }


  /**
   * 启动 gRPC 服务器
   */
  start() {
    return new Promise((resolve, reject) => {
      try {
        const TraceService = this.loadProto().TraceService;
        
        this.server = new grpc.Server();
        
        // 注册服务
        this.server.addService(TraceService.service, {
          Export: this.export.bind(this)
        });

        // 绑定端口
        // 注意：新版本的 @grpc/grpc-js 不需要手动调用 start()，bindAsync 会自动启动服务器
        this.server.bindAsync(
          `0.0.0.0:${this.port}`,
          grpc.ServerCredentials.createInsecure(),
          (err, port) => {
            if (err) {
              console.error('❌ [OTLP] gRPC 服务启动失败:', err);
              reject(err);
              return;
            }

            // 已移除 this.server.start() - 新版本 @grpc/grpc-js 会自动启动
            console.log(`✅ [OTLP] gRPC 服务已启动，监听端口: ${port}`);
            resolve();
          }
        );
      } catch (error) {
        console.error('❌ [OTLP] gRPC 服务初始化失败:', error);
        reject(error);
      }
    });
  }

  /**
   * 停止 gRPC 服务器
   */
  stop() {
    return new Promise((resolve) => {
      // 清除定时器，防止阻止进程退出
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = null;
        console.log('✅ [OTLP] 清理定时器已停止');
      }
      
      if (this.server) {
        // 使用 forceShutdown 强制关闭，确保端口立即释放
        this.server.forceShutdown();
        console.log('✅ [OTLP] gRPC 服务已停止');
        this.server = null;
        resolve();
      } else {
        resolve();
      }
    });
  }
}

module.exports = OtlpGrpcServer;

