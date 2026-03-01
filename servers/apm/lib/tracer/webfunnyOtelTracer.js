/**
 * OpenTelemetry 追踪初始化
 * 替换 skywalking-backend-js
 * 使用 gRPC 协议连接自建 APM
 */
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const api = require('@opentelemetry/api');
const { AlwaysOnSampler } = require('@opentelemetry/sdk-trace-base');

// 存储运行时配置（供其他方法使用）
let runtimeConfig = null;

/**
 * 初始化 OpenTelemetry SDK
 * @param {Object} config - 完整配置对象（从 app.js 传入）
 * @param {string} config.serviceName - 服务名称
 * @param {string} config.serviceVersion - 服务版本
 * @param {string} config.serviceInstanceId - 服务实例 ID
 * @param {string} config.serviceNamespace - 服务命名空间
 * @param {string} config.deploymentEnvironment - 部署环境
 * @param {string} config.exporterEndpoint - OTLP 导出器地址（如 localhost:9013
 * @param {boolean} config.enabled - 是否启用追踪
 * @param {Array} config.ignoreUrls - 忽略追踪的 URL 列表
 * @param {Array} config.ignoreOutgoingUrls - 忽略的出站请求 URL 列表
 * @param {Object} config.clickhouse - ClickHouse 追踪配置
 * @param {Object} config.business - 业务方法追踪配置
 * @param {Object} config.performance - 性能阈值配置
 * @param {Object} config.debug - 调试配置
 * @returns {NodeSDK|null} SDK 实例
 */
function initOtel(config = {}) {
  // 设置默认值
  const finalConfig = {
    serviceName: config.serviceName || 'unknown-service',
    serviceVersion: config.serviceVersion || '1.0.0',
    serviceInstanceId: config.serviceInstanceId || `instance-${Date.now()}`,
    serviceNamespace: config.serviceNamespace || 'default',
    deploymentEnvironment: config.deploymentEnvironment || 'production',
    exporterEndpoint: config.exporterEndpoint || 'localhost:9013',
    enabled: config.enabled !== undefined ? config.enabled : false,
    ignoreUrls: config.ignoreUrls || ['/health', '/ping'],
    ignoreOutgoingUrls: config.ignoreOutgoingUrls || [],
    clickhouse: config.clickhouse || { enabled: false },
    business: config.business || { enabled: false },
    performance: config.performance || { slowQueryThreshold: 1000, warnDuration: 500 },
    debug: config.debug || { logSpanCreation: false, logErrors: true },
  };

  // 存储运行时配置（供其他方法使用）
  runtimeConfig = finalConfig;

  if (!finalConfig.enabled) {
    console.log('🔕 OpenTelemetry 追踪已禁用');
    return null;
  }

  // 配置服务资源信息
  const resource = resourceFromAttributes({
    'service.name': finalConfig.serviceName,
    'service.version': finalConfig.serviceVersion,
    'service.namespace': finalConfig.serviceNamespace,
    'service.instance.id': finalConfig.serviceInstanceId,
    'deployment.environment': finalConfig.deploymentEnvironment,
  });

  // 配置 OTLP 导出器（连接到 APM 服务器的 gRPC 端口）
  // 注意：gRPC 导出器需要使用 http:// 前缀
  const exporterUrl = finalConfig.exporterEndpoint.startsWith('http') 
    ? finalConfig.exporterEndpoint 
    : `http://${finalConfig.exporterEndpoint}`;
    
  const traceExporter = new OTLPTraceExporter({
    url: exporterUrl,
  });
  
  console.log(`🔗 OTLP 导出器连接地址: ${exporterUrl}`);

  /**
   * 判断 URL 是否应该被忽略
   * @param {string} url - 请求 URL
   * @param {Array} ignorePatterns - 忽略模式列表
   * @returns {boolean} 是否忽略
   */
  const shouldIgnoreUrl = (url, ignorePatterns) => {
    if (!url || !ignorePatterns || ignorePatterns.length === 0) {
      return false;
    }
    
    return ignorePatterns.some(pattern => {
      // 如果是正则表达式
      if (pattern instanceof RegExp) {
        return pattern.test(url);
      }
      // 如果是函数
      if (typeof pattern === 'function') {
        return pattern(url);
      }
      // 如果是字符串，支持通配符 *
      if (typeof pattern === 'string') {
        // 精确匹配
        if (pattern === url) return true;
        // 包含匹配
        if (url.includes(pattern)) return true;
        // 通配符匹配（简单实现）
        if (pattern.includes('*')) {
          const regexPattern = pattern
            .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
            .replace(/\*/g, '.*'); // * 转为 .*
          return new RegExp(`^${regexPattern}$`).test(url);
        }
      }
      return false;
    });
  };

  // 合并自定义插桩配置
  const defaultInstrumentations = {
    '@opentelemetry/instrumentation-fs': {
      enabled: false, // 文件系统操作太多，通常不需要追踪
    },
    '@opentelemetry/instrumentation-http': {
      enabled: true,
      // 忽略不需要追踪的入站请求
      ignoreIncomingRequestHook: (request) => {
        const url = request.url || '';
        return shouldIgnoreUrl(url, finalConfig.ignoreUrls);
      },
      // 忽略不需要追踪的出站请求（可选）
      ignoreOutgoingRequestHook: (request) => {
        const url = request.path || request.url || '';
        const host = request.host || request.hostname || '';
        const port = request.port;
        
        // 构建包含端口的完整 URL，用于配置项匹配
        // 如果 host 中已经包含端口（格式：host:port），直接使用
        // 否则，如果有 port，则拼接 host:port
        let fullUrlWithPort = '';
        if (host) {
          if (host.includes(':')) {
            // host 已经包含端口
            fullUrlWithPort = `${host}${url}`;
          } else if (port) {
            // host 不包含端口，但有 port 字段，拼接 host:port
            fullUrlWithPort = `${host}:${port}${url}`;
          } else {
            // 没有端口信息
            fullUrlWithPort = `${host}${url}`;
          }
        } else {
          fullUrlWithPort = url;
        }
        
        // 也保留不带端口的 fullUrl（用于兼容）
        const fullUrl = host ? `${host}${url}` : url;
        
        // 调试信息对象（用于统一打印）
        const debugInfo = {
          fullUrl,
          fullUrlWithPort,
          host,
          port,
          url,
          request: {
            host: request.host,
            hostname: request.hostname,
            port: request.port,
            path: request.path,
            url: request.url,
            headers: request.headers ? Object.keys(request.headers) : [],
          },
          ignorePatterns: finalConfig.ignoreOutgoingUrls || []
        };
        
        // 使用配置的过滤规则（使用包含端口的完整 URL 进行匹配）
        // 同时检查 fullUrlWithPort 和 fullUrl，确保配置项能匹配到
        const shouldIgnoreByConfig = shouldIgnoreUrl(fullUrlWithPort, finalConfig.ignoreOutgoingUrls || []) || 
                                     shouldIgnoreUrl(fullUrl, finalConfig.ignoreOutgoingUrls || []);
        debugInfo.shouldIgnore = shouldIgnoreByConfig;
        
        if (shouldIgnoreByConfig) {
          // 如果配置项匹配，打印调试信息
          // console.log('[OpenTelemetry] 过滤请求 (配置项匹配):', debugInfo);
          return true;
        }
        
        // 调试日志：如果配置了 debug.logSpanCreation，打印所有出站请求信息（用于排查过滤问题）
        if (finalConfig.debug && finalConfig.debug.logSpanCreation) {
          console.log('[OpenTelemetry] 出站请求 (未匹配，将被追踪):', debugInfo);
        }
        
        return false;
      },
    },
    '@opentelemetry/instrumentation-koa': {
      enabled: true,
      // 忽略中间件层的追踪，避免中间件之间的嵌套关系
      // 中间件应该与路由处理逻辑同级，而不是相互嵌套
      ignoreLayersType: ['middleware'],
    },
    '@opentelemetry/instrumentation-mysql': {
      enabled: true,
    },
    '@opentelemetry/instrumentation-mysql2': {
      enabled: true,
    },
    '@opentelemetry/instrumentation-redis': {
      enabled: true,
    },
    '@opentelemetry/instrumentation-mongodb': {
      enabled: true,
    },
  };

  const instrumentationsConfig = { ...defaultInstrumentations, ...(config.instrumentations || {}) };

  // 创建 SDK 实例
  const sdk = new NodeSDK({
    resource,
    traceExporter,
    sampler: new AlwaysOnSampler(),  // 所有请求都采样
    instrumentations: [
      getNodeAutoInstrumentations(instrumentationsConfig),
    ],
  });

  // 启动 SDK
  sdk.start();
  console.log('✅ OpenTelemetry SDK 已启动');
  console.log(`📡 服务名称: ${finalConfig.serviceName}`);
  console.log(`📡 实例 ID: ${finalConfig.serviceInstanceId}`);
  console.log(`📡 导出器地址: ${finalConfig.exporterEndpoint}`);
  console.log('🎯 采样器: AlwaysOn (所有请求都被采样)');

  // 处理进程退出
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('OpenTelemetry SDK 已关闭'))
      .catch((error) => console.error('关闭 OpenTelemetry SDK 时出错', error))
      .finally(() => process.exit(0));
  });

  return sdk;
}

/**
 * 获取当前配置
 * @returns {Object} 当前运行时配置
 */
function getConfig() {
  return { ...runtimeConfig };
}

/**
 * 获取追踪配置（别名，保持兼容）
 * @returns {Object} 当前运行时配置
 */
function getTracingConfig() {
  return { ...runtimeConfig };
}

/**
 * 为 ClickHouse 查询添加追踪
 * @param {Function} queryFunction - 查询函数
 * @param {Object} options - 配置选项
 * @returns {Promise} 查询结果
 */
async function traceClickHouseQuery(queryFunction, options = {}) {
  const config = getTracingConfig();
  if (!config.enabled || !config.clickhouse?.enabled) {
    return await queryFunction();
  }

  const tracer = api.trace.getTracer('clickhouse');
  const { sql = '', peer = 'clickhouse-cluster:9000' } = options;

  // 只在有活跃的 Span 时才创建子 Span（避免定时任务污染）
  const activeSpan = api.trace.getActiveSpan();
  if (!activeSpan) {
    return await queryFunction();
  }

  return tracer.startActiveSpan('ClickHouse/query', {
    kind: api.SpanKind.CLIENT,
    attributes: {
      'db.system': 'clickhouse',
      'db.name': 'webfunny',
      'net.peer.name': peer,
      'db.statement': sql.substring(0, config.clickhouse?.maxSqlLength || 500),
    },
  }, async (span) => {
    try {
      const result = await queryFunction();
      
      if (config.clickhouse?.recordRows && result && result.data) {
        span.setAttribute('db.rows_affected', result.data.length || 0);
      }
      
      span.setStatus({ code: api.SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ 
        code: api.SpanStatusCode.ERROR, 
        message: error.message 
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * 为业务方法添加追踪（Controller/Model）
 * 支持同步和异步方法，保持原方法的返回类型
 * @param {string} operationName - 操作名称
 * @param {Function} businessFunction - 业务函数
 * @param {Object} tags - 自定义标签
 * @returns {*} 执行结果（同步方法返回值，异步方法返回 Promise）
 */
function traceBusinessMethod(operationName, businessFunction, tags = {}) {
  const config = getTracingConfig();
  if (!config || !config.enabled || !config.business?.enabled) {
    return businessFunction();
  }

  const tracer = api.trace.getTracer('business');
  
  // 检查是否有活跃的 Span
  const activeSpan = api.trace.getActiveSpan();
  
  // 如果没有活跃 Span，但这是 Controller 方法（以 Controller/ 开头），则创建根 Span
  // 这样可以确保 Controller 的调用链路能够被追踪到
  const shouldCreateRootSpan = !activeSpan && operationName.startsWith('Controller/');
  
  if (!activeSpan && !shouldCreateRootSpan) {
    // 既没有活跃 Span，也不是 Controller，则不追踪（避免定时任务污染）
    return businessFunction();
  }

  // 创建 Span 的配置
  const spanOptions = {
    kind: api.SpanKind.INTERNAL,
    attributes: {
      ...tags,
      // 如果是根 Span，添加标记
      'span.kind': shouldCreateRootSpan ? 'root' : 'child',
    },
  };

  // 如果有活跃 Span，作为子 Span；否则作为根 Span
  if (shouldCreateRootSpan) {
    // 创建根 Span（使用 context.with() 来设置新的上下文）
    const context = api.context.active();
    const span = tracer.startSpan(operationName, spanOptions, context);
    const newContext = api.trace.setSpan(context, span);
    
    return api.context.with(newContext, () => {
      try {
        const result = businessFunction();
        
        // 检测是否是 Promise（异步方法）
        if (result && typeof result.then === 'function') {
          // 异步方法：返回 Promise
          return result
            .then((value) => {
              span.setStatus({ code: api.SpanStatusCode.OK });
              span.end();
              return value;
            })
            .catch((error) => {
              // 检查错误是否已经被记录过（避免重复记录同一个错误）
              const isAlreadyRecorded = error.__otelRecorded;
              
              if (!isAlreadyRecorded) {
                span.recordException(error);
                // 标记错误已被记录，避免父级方法重复记录
                error.__otelRecorded = true;
                error.__otelRecordedBy = operationName;
              }
              
              span.setStatus({ 
                code: api.SpanStatusCode.ERROR, 
                message: isAlreadyRecorded ? undefined : error.message
              });
              span.end();
              throw error;
            });
        }
        
        // 同步方法：直接返回结果
        span.setStatus({ code: api.SpanStatusCode.OK });
        span.end();
        return result;
      } catch (error) {
        // 同步方法抛出异常
        const isAlreadyRecorded = error.__otelRecorded;
        
        if (!isAlreadyRecorded) {
          span.recordException(error);
          error.__otelRecorded = true;
          error.__otelRecordedBy = operationName;
        }
        
        span.setStatus({ 
          code: api.SpanStatusCode.ERROR, 
          message: isAlreadyRecorded ? undefined : error.message
        });
        span.end();
        throw error;
      }
    });
  } else {
    // 有活跃 Span，作为子 Span（原有逻辑）
    return tracer.startActiveSpan(operationName, spanOptions, (span) => {
      try {
        const result = businessFunction();
        
        // 检测是否是 Promise（异步方法）
        if (result && typeof result.then === 'function') {
          // 异步方法：返回 Promise
          return result
            .then((value) => {
              span.setStatus({ code: api.SpanStatusCode.OK });
              span.end();
              return value;
            })
            .catch((error) => {
              // 检查错误是否已经被记录过（避免重复记录同一个错误）
              const isAlreadyRecorded = error.__otelRecorded;
              
              if (!isAlreadyRecorded) {
                span.recordException(error);
                error.__otelRecorded = true;
                error.__otelRecordedBy = operationName;
              }
              
              span.setStatus({ 
                code: api.SpanStatusCode.ERROR, 
                message: isAlreadyRecorded ? undefined : error.message
              });
              span.end();
              throw error;
            });
        }
        
        // 同步方法：直接返回结果
        span.setStatus({ code: api.SpanStatusCode.OK });
        span.end();
        return result;
      } catch (error) {
        // 同步方法抛出异常
        const isAlreadyRecorded = error.__otelRecorded;
        
        if (!isAlreadyRecorded) {
          span.recordException(error);
          error.__otelRecorded = true;
          error.__otelRecordedBy = operationName;
        }
        
        span.setStatus({ 
          code: api.SpanStatusCode.ERROR, 
          message: isAlreadyRecorded ? undefined : error.message
        });
        span.end();
        throw error;
      }
    });
  }
}

/**
 * 包装 ClickHouse 客户端的 query 方法
 * @param {Object} clickhouseClient - ClickHouse 客户端实例
 * @param {Object} options - 配置选项
 */
function wrapClickHouseQuery(clickhouseClient, options = {}) {
  const config = getTracingConfig();
  if (!config.enabled || !config.clickhouse?.enabled) {
    return;
  }

  const originalQuery = clickhouseClient.query;
  const { serviceName = 'unknown' } = options;

  clickhouseClient.query = async function(sql, params) {
    return await traceClickHouseQuery(
      () => originalQuery.call(this, sql, params),
      { sql, peer: `clickhouse-${serviceName}:9000` }
    );
  };
}

/**
 * 包装 Controller 类
 * 保持原方法的同步/异步特性
 */
function wrapController(ControllerClass, controllerName = 'UnknownController', excludeMethods = []) {
  const config = getTracingConfig();
  if (!config.enabled || !config.business?.enabled || !config.business?.traceController) {
    return ControllerClass;
  }

  // 检查是否已经包装过（通过检查标记）
  if (ControllerClass.__otelWrapped) {
    return ControllerClass;
  }

  const methodNames = Object.getOwnPropertyNames(ControllerClass).filter(
    name => typeof ControllerClass[name] === 'function' && name !== 'constructor' && name !== 'length' && name !== 'name'
  );

  methodNames.forEach(methodName => {
    if (excludeMethods.includes(methodName)) {
      return;
    }

    const originalMethod = ControllerClass[methodName];
    
    // 检查方法是否已经被包装过（通过检查是否有标记）
    if (originalMethod.__otelWrapped) {
      return; // 已经包装过，跳过
    }
    
    // 使用普通函数包装，保持原方法的同步/异步特性
    ControllerClass[methodName] = function(...args) {
      return traceBusinessMethod(
        `Controller/${controllerName}.${methodName}`,
        () => originalMethod.apply(this, args),
        { 'code.function': methodName, 'code.namespace': controllerName }
      );
    };
    
    // 标记方法已包装
    ControllerClass[methodName].__otelWrapped = true;
  });

  // 标记类已包装
  ControllerClass.__otelWrapped = true;

  return ControllerClass;
}

/**
 * 包装 Model 类
 * 保持原方法的同步/异步特性
 */
function wrapModel(ModelClass, modelName = 'UnknownModel') {
  const config = getTracingConfig();
  if (!config.enabled || !config.business?.enabled || !config.business?.traceModel) {
    return ModelClass;
  }

  // 检查是否已经包装过（通过检查标记）
  if (ModelClass.__otelWrapped) {
    return ModelClass;
  }

  const methodNames = Object.getOwnPropertyNames(ModelClass).filter(
    name => typeof ModelClass[name] === 'function' && name !== 'constructor' && name !== 'length' && name !== 'name'
  );

  methodNames.forEach(methodName => {
    const originalMethod = ModelClass[methodName];
    
    // 检查方法是否已经被包装过（通过检查是否有标记）
    if (originalMethod.__otelWrapped) {
      return; // 已经包装过，跳过
    }
    
    // 使用普通函数包装，保持原方法的同步/异步特性
    ModelClass[methodName] = function(...args) {
      return traceBusinessMethod(
        `Model/${modelName}.${methodName}`,
        () => originalMethod.apply(this, args),
        { 'code.function': methodName, 'code.namespace': modelName }
      );
    };
    
    // 标记方法已包装
    ModelClass[methodName].__otelWrapped = true;
  });

  // 标记类已包装
  ModelClass.__otelWrapped = true;

  return ModelClass;
}

module.exports = {
  initOtel,
  getConfig,
  getTracingConfig,
  traceClickHouseQuery,
  traceBusinessMethod,
  wrapClickHouseQuery,
  wrapController,
  wrapModel,
};

