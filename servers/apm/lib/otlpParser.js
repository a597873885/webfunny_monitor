const moment = require('moment');

/**
 * OpenTelemetry OTLP 数据解析器
 * 将 OTLP 格式转换为 SkyWalking 兼容的表结构
 */
class OtlpParser {
  constructor() {
    // SpanKind 到 SkyWalking spanType 的映射
    this.SPAN_KIND_MAP = {
      'SPAN_KIND_UNSPECIFIED': 'Local',
      'SPAN_KIND_INTERNAL': 'Local',
      'SPAN_KIND_SERVER': 'Entry',
      'SPAN_KIND_CLIENT': 'Exit',
      'SPAN_KIND_PRODUCER': 'Exit',
      'SPAN_KIND_CONSUMER': 'Entry',
    };

    // SpanStatus.Code 映射
    this.STATUS_CODE_MAP = {
      'STATUS_CODE_UNSET': 0,
      'STATUS_CODE_OK': 0,
      'STATUS_CODE_ERROR': 1,
    };
  }

  /**
   * 解析 OTLP Attributes 数组为对象
   * @param {Array} attributes - OTLP attributes 数组
   * @returns {Object} - 扁平化的属性对象
   */
  parseAttributes(attributes) {
    if (!attributes || !Array.isArray(attributes)) {
      return {};
    }

    const result = {};
    for (const attr of attributes) {
      if (!attr.key) continue;

      const value = attr.value;
      if (!value) continue;

      // 根据 value 类型提取实际值
      if (value.string_value !== undefined && value.string_value !== null) {
        result[attr.key] = value.string_value;
      } else if (value.int_value !== undefined && value.int_value !== null) {
        result[attr.key] = String(value.int_value);
      } else if (value.double_value !== undefined && value.double_value !== null) {
        result[attr.key] = String(value.double_value);
      } else if (value.bool_value !== undefined && value.bool_value !== null) {
        result[attr.key] = String(value.bool_value);
      } else if (value.array_value) {
        result[attr.key] = JSON.stringify(value.array_value);
      } else if (value.kvlist_value) {
        result[attr.key] = JSON.stringify(value.kvlist_value);
      }
    }

    return result;
  }

  /**
   * 从 attributes 推断 spanLayer
   * @param {Object} attributes - 扁平化的属性对象
   * @returns {String} - Http/Database/RPCFramework/MQ/Cache/Unknown
   */
  inferSpanLayer(attributes) {
    // HTTP 层
    if (attributes['http.method'] || attributes['http.url'] || attributes['http.target']) {
      return 'Http';
    }

    // 数据库层
    if (attributes['db.system'] || attributes['db.statement'] || attributes['db.name']) {
      return 'Database';
    }

    // RPC 层
    if (attributes['rpc.system'] || attributes['rpc.service'] || attributes['rpc.method']) {
      return 'RPCFramework';
    }

    // 消息队列层
    if (attributes['messaging.system'] || attributes['messaging.destination']) {
      return 'MQ';
    }

    // 缓存层
    if (attributes['db.system'] === 'redis' || attributes['db.system'] === 'memcached') {
      return 'Cache';
    }

    return 'Unknown';
  }

  /**
   * 将纳秒时间戳转换为毫秒
   * @param {String|Number} nanoTime - 纳秒时间戳
   * @returns {Number} - 毫秒时间戳
   */
  nanoToMillis(nanoTime) {
    if (!nanoTime) return 0;
    const nano = typeof nanoTime === 'string' ? parseInt(nanoTime, 10) : nanoTime;
    return Math.floor(nano / 1000000);
  }

  /**
   * 将字节数组转换为十六进制字符串
   * @param {Buffer|Uint8Array} bytes - 字节数组
   * @returns {String} - 十六进制字符串
   */
  bytesToHex(bytes) {
    if (!bytes || bytes.length === 0) return '';
    return Buffer.from(bytes).toString('hex');
  }

  /**
   * 将 SpanId 字节数组转换为数字
   * @param {Buffer|Uint8Array} bytes - 字节数组（8字节）
   * @returns {Number} - 数字形式的 SpanId
   */
  spanIdToNumber(bytes) {
    if (!bytes || bytes.length === 0) return -1;
    // 取前 4 字节转为 32 位整数（与 SkyWalking 兼容）
    const buffer = Buffer.from(bytes);
    if (buffer.length >= 4) {
      return buffer.readInt32BE(0);
    }
    return -1;
  }

  /**
   * 解析 OTLP Spans
   * @param {Array} spans - OTLP spans 数组
   * @param {Object} resourceAttrs - Resource 属性
   * @param {Object} scopeInfo - Instrumentation Scope 信息（包含 name 和 version）
   * @returns {Array} - 解析后的 Span 数组
   */
  parseSpans(spans, resourceAttrs, scopeInfo) {
    if (!spans || !Array.isArray(spans)) {
      return [];
    }

    return spans.map(span => this.parseSpan(span, resourceAttrs, scopeInfo));
  }

  /**
   * 解析单个 OTLP Span
   * @param {Object} span - OTLP span 对象
   * @param {Object} resourceAttrs - Resource 属性
   * @param {Object} scopeInfo - Instrumentation Scope 信息（包含 name 和 version）
   * @returns {Object} - 解析后的 Span 对象（兼容 SkyWalking 表结构）
   */
  parseSpan(span, resourceAttrs, scopeInfo) {
    const attributes = this.parseAttributes(span.attributes || []);
    
    // 添加 Instrumentation Library 信息到 attributes（用于埋点组件识别）
    if (scopeInfo) {
      if (scopeInfo.name) {
        attributes['otel.library.name'] = scopeInfo.name;
      }
      if (scopeInfo.version) {
        attributes['otel.library.version'] = scopeInfo.version;
      }
    }
    
    // 提取基本信息
    const traceId = this.bytesToHex(span.trace_id);
    const spanId = this.spanIdToNumber(span.span_id);
    const parentSpanId = span.parent_span_id && span.parent_span_id.length > 0 
      ? this.spanIdToNumber(span.parent_span_id) 
      : -1;

    // 时间相关
    const startTime = this.nanoToMillis(span.start_time_unix_nano);
    const endTime = this.nanoToMillis(span.end_time_unix_nano);
    const duration = endTime - startTime;

    // SpanKind 映射到 spanType
    const spanKind = span.kind || 'SPAN_KIND_INTERNAL';
    const spanType = this.SPAN_KIND_MAP[spanKind] || 'Local';

    // 推断 spanLayer
    const spanLayer = this.inferSpanLayer(attributes);

    // 错误状态
    const status = span.status || {};
    const statusCode = status.code || 'STATUS_CODE_UNSET';
    
    // 支持两种格式：字符串（'STATUS_CODE_ERROR'）和数字（2）
    let isError = 0;
    if (typeof statusCode === 'number') {
      // 数字格式：0=UNSET, 1=OK, 2=ERROR
      isError = statusCode === 2 ? 1 : 0;
    } else if (typeof statusCode === 'string') {
      // 字符串格式：使用映射表
      isError = this.STATUS_CODE_MAP[statusCode] || 0;
    }
    
    // 额外检查：如果有 exception 事件，也标记为错误
    const events = span.events || [];
    const hasExceptionEvent = events.some(e => e.name === 'exception');
    if (hasExceptionEvent) {
      isError = 1;
    }

    // 提取 HTTP 相关信息
    const httpUrl = attributes['http.url'] || attributes['http.target'] || '';
    const httpMethod = attributes['http.method'] || '';
    const httpStatusCode = attributes['http.status_code'] || '';

    // 提取数据库相关信息
    const dbType = attributes['db.system'] || '';
    const dbInstance = attributes['db.name'] || '';
    const dbStatement = attributes['db.statement'] || '';

    // 提取 peer 信息
    const peer = attributes['net.peer.name'] || 
                 attributes['net.peer.ip'] || 
                 attributes['peer.service'] || 
                 attributes['server.address'] || '';

    // 提取服务信息（优先使用 Resource，其次用 Span attributes）
    const service = resourceAttrs['service.name'] || attributes['service.name'] || 'unknown-service';
    const serviceInstance = resourceAttrs['service.instance.id'] || attributes['service.instance.id'] || 'unknown-instance';

    // 生成更有意义的 operationName
    let operationName = span.name || 'unknown';
    
    // 如果 operationName 太简单（只有 HTTP 方法或 SQL 操作），尝试补充更多信息
    const simpleOperations = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'query'];
    if (simpleOperations.includes(operationName.toUpperCase()) || operationName.length <= 10) {
      if (httpUrl) {
        // HTTP 请求：保留完整 URI（去掉查询参数）
        const urlWithoutQuery = httpUrl.split('?')[0];
        operationName = `${httpMethod || operationName} ${urlWithoutQuery}`;
      } else if (dbStatement) {
        // 数据库操作：提取 SQL 前 50 字符
        const shortStatement = dbStatement.length > 50 
          ? dbStatement.substring(0, 50) + '...' 
          : dbStatement;
        operationName = `${dbType || 'DB'}: ${shortStatement}`;
      }
    }

    // 构建兼容 SkyWalking 的 Span 对象
    return {
      traceId,
      segmentId: '', // OTLP 无 segmentId 概念，留空
      spanId,
      parentSpanId, // 已经是 -1 或数字
      service,
      serviceInstance,
      operationName,
      spanType,
      spanLayer,
      peer,
      startTime,
      endTime,
      duration,
      isError,
      componentId: 0, // OTLP 无 componentId，固定为 0
      httpUrl,
      httpMethod,
      httpStatusCode,
      dbType,
      dbInstance,
      dbStatement,
      tagsJson: JSON.stringify(attributes),
      
      // 保留原始 OTLP 数据（用于调试）
      _otlp: {
        traceState: span.trace_state || '',
        spanKind: spanKind,
        statusMessage: status.message || '',
        events: span.events || [],
        links: span.links || [],
      }
    };
  }

  /**
   * 解析 OTLP Resource 为服务实例信息
   * @param {Object} resource - OTLP resource 对象
   * @returns {Object} - 服务实例信息
   */
  parseServiceInstance(resource) {
    const attributes = this.parseAttributes(resource.attributes || []);

    return {
      service: attributes['service.name'] || 'unknown-service',
      serviceInstance: attributes['service.instance.id'] || 'unknown-instance',
      layer: attributes['telemetry.sdk.language'] || 'Unknown',
      hostname: attributes['host.name'] || '',
      ipv4: attributes['host.ip'] || '',
      processNo: attributes['process.pid'] || '',
      language: attributes['telemetry.sdk.language'] || '',
      propertiesJson: JSON.stringify(attributes),
    };
  }
}

module.exports = OtlpParser;

