/**
 * SkyWalking 数据解析器
 * 正确解析 gRPC Protobuf 数据结构
 */
const fs = require('fs')
const path = require('path')

// SpanType 枚举（来自 common.proto）
const SpanType = {
  0: 'Entry',
  1: 'Exit',
  2: 'Local',
  Entry: 0,
  Exit: 1,
  Local: 2
}

// SpanLayer 枚举（来自 common.proto）
const SpanLayer = {
  0: 'Unknown',
  1: 'Database',
  2: 'RPCFramework',
  3: 'Http',
  4: 'MQ',
  5: 'Cache',
  Unknown: 0,
  Database: 1,
  RPCFramework: 2,
  Http: 3,
  MQ: 4,
  Cache: 5
}

class SkyWalkingParser {
  constructor() {
    // 创建日志目录
    this.logDir = path.join(__dirname, '../logs/skywalking')
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  /**
   * 解析 Trace Segment（SegmentObject）
   * @param {Object} segment - gRPC 自动解析后的 SegmentObject
   * @returns {Object} 格式化后的数据
   */
  parseTraceSegment(segment) {
    if (!segment) {
      return null
    }

    // 直接从 Protobuf 解析后的对象中提取字段
    const result = {
      type: 'TraceSegment',
      timestamp: new Date().toISOString(),
      
      // SegmentObject 的字段（来自 Tracing.proto）
      traceId: segment.traceId || '',
      traceSegmentId: segment.traceSegmentId || '',
      service: segment.service || '',
      serviceInstance: segment.serviceInstance || '',
      isSizeLimited: segment.isSizeLimited || false,
      
      // 解析 Spans 数组
      spans: this.parseSpans(segment.spans || [])
    }

    return result
  }

  /**
   * 解析 Spans 数组
   * @param {Array} spans - SpanObject 数组
   * @returns {Array} 格式化后的 Span 数组
   */
  parseSpans(spans) {
    if (!Array.isArray(spans) || spans.length === 0) {
      return []
    }

    return spans.map(span => {
      // 提取 HTTP 相关 tags
      const httpUrl = this.getTagValue(span.tags, 'http.url')
      const httpMethod = this.getTagValue(span.tags, 'http.method')
      const httpStatusCode = this.getTagValue(span.tags, 'http.status_code')
      const dbType = this.getTagValue(span.tags, 'db.type')
      const dbInstance = this.getTagValue(span.tags, 'db.instance')
      const dbStatement = this.getTagValue(span.tags, 'db.statement')

      // 计算 duration（毫秒）
      const duration = span.endTime && span.startTime 
        ? Number(span.endTime) - Number(span.startTime)
        : 0

      // 处理 spanType 和 spanLayer（Protobuf 自动解析后已经是字符串）
      // 如果是数字，转换为字符串；如果已经是字符串，直接使用
      let finalSpanType = 'Unknown'
      let finalSpanLayer = 'Unknown'
      
      if (typeof span.spanType === 'number') {
        // 数字枚举值 -> 字符串名称
        finalSpanType = SpanType[span.spanType] || 'Unknown'
      } else if (typeof span.spanType === 'string') {
        // 已经是字符串名称，直接使用（Protobuf 自动解析）
        finalSpanType = span.spanType
      }
      
      if (typeof span.spanLayer === 'number') {
        finalSpanLayer = SpanLayer[span.spanLayer] || 'Unknown'
      } else if (typeof span.spanLayer === 'string') {
        finalSpanLayer = span.spanLayer
      }
      
      return {
        spanId: span.spanId !== undefined ? span.spanId : 0,
        parentSpanId: span.parentSpanId !== undefined ? span.parentSpanId : -1,
        startTime: span.startTime ? Number(span.startTime) : Date.now(),
        endTime: span.endTime ? Number(span.endTime) : Date.now(),
        duration: duration,
        operationName: span.operationName || 'unknown',
        peer: span.peer || '',
        spanType: finalSpanType,
        spanLayer: finalSpanLayer,
        componentId: span.componentId || 0,
        isError: span.isError || false,
        skipAnalysis: span.skipAnalysis || false,
        
        // HTTP 信息
        httpUrl: httpUrl || '',
        httpMethod: httpMethod || '',
        httpStatusCode: httpStatusCode || '',
        
        // 数据库信息
        dbType: dbType || '',
        dbInstance: dbInstance || '',
        dbStatement: dbStatement || '',
        
        // Tags（转换为 JSON 字符串）
        tagsJson: this.tagsToJson(span.tags),
        
        // Refs（引用关系）
        refs: this.parseRefs(span.refs),
        
        // Logs（错误日志）
        logs: this.parseLogs(span.logs)
      }
    })
  }

  /**
   * 从 tags 数组中获取指定 key 的值
   * @param {Array} tags - KeyStringValuePair 数组
   * @param {string} key - 要查找的 key
   * @returns {string} 找到的值，或空字符串
   */
  getTagValue(tags, key) {
    if (!Array.isArray(tags)) return ''
    const tag = tags.find(t => t.key === key)
    return tag ? tag.value : ''
  }

  /**
   * 将 tags 数组转换为 JSON 对象字符串
   * @param {Array} tags - KeyStringValuePair 数组
   * @returns {string} JSON 字符串
   */
  tagsToJson(tags) {
    if (!Array.isArray(tags) || tags.length === 0) {
      console.log('⚠️  [Parser] Tags is empty or not array:', tags)
      return '{}'
    }
    
    const obj = {}
    tags.forEach(tag => {
      if (tag.key) {
        obj[tag.key] = tag.value || ''
      }
    })
    
    const result = JSON.stringify(obj)
    // if (Object.keys(obj).length > 0) {
    //   console.log('✅ [Parser] Tags parsed:', result.substring(0, 100))
    // }
    
    return result
  }

  /**
   * 解析 Refs（引用关系）
   * @param {Array} refs - SegmentReference 数组
   * @returns {Array} 格式化后的 Refs 数组
   */
  parseRefs(refs) {
    if (!Array.isArray(refs) || refs.length === 0) {
      return []
    }

    return refs.map(ref => ({
      refType: ref.refType === 0 ? 'CrossProcess' : 'CrossThread',
      traceId: ref.traceId || '',
      parentTraceSegmentId: ref.parentTraceSegmentId || '',
      parentSpanId: ref.parentSpanId || 0,
      parentService: ref.parentService || '',
      parentServiceInstance: ref.parentServiceInstance || '',
      parentEndpoint: ref.parentEndpoint || '',
      networkAddressUsedAtPeer: ref.networkAddressUsedAtPeer || ''
    }))
  }

  /**
   * 解析 Logs（错误日志）
   * @param {Array} logs - Log 数组
   * @returns {Array} 格式化后的 Logs 数组
   */
  parseLogs(logs) {
    if (!Array.isArray(logs) || logs.length === 0) {
      return []
    }

    return logs.map(log => {
      const logData = {}
      if (Array.isArray(log.data)) {
        log.data.forEach(pair => {
          if (pair.key) {
            logData[pair.key] = pair.value || ''
          }
        })
      }

      return {
        time: log.time ? Number(log.time) : Date.now(),
        isError: logData['event'] === 'error' || logData['error.kind'] !== undefined,
        errorKind: logData['error.kind'] || '',
        message: logData['message'] || '',
        stack: logData['stack'] || '',
        data: logData
      }
    })
  }

  /**
   * 解析 Instance Properties（服务实例属性）
   * @param {Object} instanceProps - InstanceProperties 对象
   * @returns {Object} 格式化后的数据
   */
  parseInstanceProperties(instanceProps) {
    if (!instanceProps) {
      return null
    }

    const result = {
      type: 'InstanceProperties',
      timestamp: new Date().toISOString(),
      service: instanceProps.service || '',
      serviceInstance: instanceProps.serviceInstance || '',
      properties: {}
    }

    // 解析 properties 数组
    if (Array.isArray(instanceProps.properties)) {
      instanceProps.properties.forEach(prop => {
        if (prop.key) {
          result.properties[prop.key] = prop.value || ''
        }
      })
    }

    return result
  }

  /**
   * 解析 Log Data（日志数据）
   * @param {Object} logData - LogData 对象
   * @returns {Object} 格式化后的数据
   */
  parseLog(logData) {
    if (!logData) {
      return null
    }

    const result = {
      type: 'Log',
      timestamp: new Date().toISOString(),
      service: logData.service || '',
      serviceInstance: logData.serviceInstance || '',
      timestamp_ms: logData.timestamp ? Number(logData.timestamp) : Date.now(),
      endpoint: logData.endpoint || '',
      traceContext: null,
      body: null,
      tags: {}
    }

    // 解析 traceContext
    if (logData.traceContext) {
      result.traceContext = {
        traceId: logData.traceContext.traceId || '',
        traceSegmentId: logData.traceContext.traceSegmentId || '',
        spanId: logData.traceContext.spanId || 0
      }
    }

    // 解析 body（LogDataBody）
    if (logData.body) {
      if (logData.body.text) {
        result.body = {
          type: 'text',
          text: logData.body.text.text || ''
        }
      } else if (logData.body.json) {
        result.body = {
          type: 'json',
          json: logData.body.json.json || ''
        }
      } else if (logData.body.yaml) {
        result.body = {
          type: 'yaml',
          yaml: logData.body.yaml.yaml || ''
        }
      }
    }

    // 解析 tags
    if (Array.isArray(logData.tags && logData.tags.data)) {
      logData.tags.data.forEach(pair => {
        if (pair.key) {
          result.tags[pair.key] = pair.value || ''
        }
      })
    }

    return result
  }

  /**
   * 解析 Metrics Data（JVM 指标数据）
   * @param {Object} metricData - JVMMetricCollection 对象
   * @returns {Object} 格式化后的数据
   */
  parseMetrics(metricData) {
    if (!metricData) {
      return null
    }

    const result = {
      type: 'Metrics',
      timestamp: new Date().toISOString(),
      service: metricData.service || '',
      serviceInstance: metricData.serviceInstance || '',
      metrics: []
    }

    // 解析 metrics 数组
    if (Array.isArray(metricData.metrics)) {
      metricData.metrics.forEach(metric => {
        const metricItem = {
          timestamp_ms: metric.time ? Number(metric.time) : Date.now()
        }

        // CPU 指标
        if (metric.cpu) {
          metricItem.cpu = {
            usagePercent: metric.cpu.usagePercent || 0
          }
        }

        // Memory 指标
        if (Array.isArray(metric.memory)) {
          metricItem.memory = metric.memory.map(mem => ({
            isHeap: mem.isHeap || false,
            init: mem.init ? Number(mem.init) : 0,
            max: mem.max ? Number(mem.max) : 0,
            used: mem.used ? Number(mem.used) : 0,
            committed: mem.committed ? Number(mem.committed) : 0
          }))
        }

        // Memory Pool 指标
        if (Array.isArray(metric.memoryPool)) {
          metricItem.memoryPool = metric.memoryPool.map(pool => ({
            type: pool.type || 0,
            init: pool.init ? Number(pool.init) : 0,
            max: pool.max ? Number(pool.max) : 0,
            used: pool.used ? Number(pool.used) : 0,
            committed: pool.committed ? Number(pool.committed) : 0
          }))
        }

        // GC 指标
        if (Array.isArray(metric.gc)) {
          metricItem.gc = metric.gc.map(gc => ({
            phrase: gc.phrase || 0,
            count: gc.count ? Number(gc.count) : 0,
            time: gc.time ? Number(gc.time) : 0
          }))
        }

        // Thread 指标
        if (metric.thread) {
          metricItem.thread = {
            liveCount: metric.thread.liveCount || 0,
            daemonCount: metric.thread.daemonCount || 0,
            peakCount: metric.thread.peakCount || 0,
            runnableStateThreadCount: metric.thread.runnableStateThreadCount || 0,
            blockedStateThreadCount: metric.thread.blockedStateThreadCount || 0,
            waitingStateThreadCount: metric.thread.waitingStateThreadCount || 0,
            timedWaitingStateThreadCount: metric.thread.timedWaitingStateThreadCount || 0
          }
        }

        result.metrics.push(metricItem)
      })
    }

    return result
  }

  /**
   * 格式化打印解析结果
   * @param {Object} data - 解析后的数据
   */
  printFormatted(data) {
    if (!data) {
      console.log('❌ 无数据')
      return
    }

    console.log(`==================== SkyWalking ${data.type} 上报 ====================`)
    
    if (data.type === 'TraceSegment') {
      console.log(`📋 Trace 信息:`)
      console.log(`  TraceID: ${data.traceId}`)
      console.log(`  SegmentID: ${data.traceSegmentId}`)
      console.log(`  Service: ${data.service}`)
      console.log(`  Instance: ${data.serviceInstance}`)
      console.log(`  Spans: ${data.spans.length} 个`)
      
      if (data.spans.length > 0) {
        console.log(`\n🔍 Span 详情:`)
        data.spans.forEach((span, index) => {
          console.log(`  [${index + 1}] ${span.operationName}`)
          console.log(`      SpanID: ${span.spanId}, ParentID: ${span.parentSpanId}`)
          console.log(`      Type: ${span.spanType}, Layer: ${span.spanLayer}`)
          console.log(`      Duration: ${span.duration}ms`)
          if (span.httpUrl) {
            console.log(`      HTTP: ${span.httpMethod} ${span.httpUrl} (${span.httpStatusCode})`)
          }
          if (span.dbType) {
            console.log(`      DB: ${span.dbType} - ${span.dbInstance}`)
          }
          if (span.isError) {
            console.log(`      ❌ 错误: ${span.logs.length} 条日志`)
          }
        })
      }
    } else if (data.type === 'InstanceProperties') {
      console.log(`📋 实例信息:`)
      console.log(`  Service: ${data.service}`)
      console.log(`  Instance: ${data.serviceInstance}`)
      console.log(`  Properties:`)
      Object.entries(data.properties).forEach(([key, value]) => {
        console.log(`    ${key}: ${value}`)
      })
    } else if (data.type === 'Log') {
      console.log(`📋 日志信息:`)
      console.log(`  Service: ${data.service}`)
      console.log(`  Instance: ${data.serviceInstance}`)
      console.log(`  Endpoint: ${data.endpoint}`)
      if (data.traceContext) {
        console.log(`  TraceID: ${data.traceContext.traceId}`)
      }
      if (data.body) {
        console.log(`  内容 (${data.body.type}): ${JSON.stringify(data.body).substring(0, 200)}`)
      }
    } else if (data.type === 'Metrics') {
      console.log(`📋 指标信息:`)
      console.log(`  Service: ${data.service}`)
      console.log(`  Instance: ${data.serviceInstance}`)
      console.log(`  Metrics: ${data.metrics.length} 条`)
    }
    
    console.log('================================================================\n')
  }

  /**
   * 保存数据到文件（用于调试）
   * @param {Object} data - 要保存的数据
   * @param {string} type - 数据类型
   * @returns {Object} 保存的文件路径
   */
  saveToFile(data, type = 'unknown') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const jsonFile = path.join(this.logDir, `${type}_${timestamp}.json`)
    
    fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2))
    
    return { jsonFile }
  }
}

module.exports = SkyWalkingParser
