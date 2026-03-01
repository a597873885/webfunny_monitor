/**
 * gRPC 服务 - 使用 Protobuf 完整解析 SkyWalking 数据 + 数据入库
 */
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const log = require('../config/log')
const fs = require('fs')
const ApmStorageModel = require('../modules/apmStorage')
const SkyWalkingParser = require('../lib/skywalkingParser')

class GrpcServerProtobuf {
  constructor() {
    this.server = null
    this.saveToFile = false
    this.logDir = path.join(__dirname, '../logs/skywalking')
    this.parser = new SkyWalkingParser()
    this.apmStorage = new ApmStorageModel()
    
    // 确保日志目录存在
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
    
    // 全局去重 Map（跨 gRPC 连接）
    this.processedSegments = new Map() // key: segmentKey, value: timestamp
    this.processedSpans = new Map()    // key: spanKey, value: timestamp
    
    // 定时清理过期的去重记录（避免内存泄漏）
    this.startCleanupTimer()
  }
  
  /**
   * 启动定时清理任务
   * 每 5 分钟清理一次，删除 10 分钟前的记录
   */
  startCleanupTimer() {
    setInterval(() => {
      const now = Date.now()
      const expireTime = 10 * 60 * 1000 // 10 分钟
      
      // 清理过期的 Segment 记录
      let segmentCleaned = 0
      for (const [key, timestamp] of this.processedSegments.entries()) {
        if (now - timestamp > expireTime) {
          this.processedSegments.delete(key)
          segmentCleaned++
        }
      }
      
      // 清理过期的 Span 记录
      let spanCleaned = 0
      for (const [key, timestamp] of this.processedSpans.entries()) {
        if (now - timestamp > expireTime) {
          this.processedSpans.delete(key)
          spanCleaned++
        }
      }
      
      if (segmentCleaned > 0 || spanCleaned > 0) {
        console.log(`🧹 已清理过期去重记录: Segment=${segmentCleaned}, Span=${spanCleaned}`)
      }
    }, 5 * 60 * 1000) // 每 5 分钟执行一次
  }

  /**
   * 加载 Proto 文件
   */
  loadProto() {
    const PROTO_PATH = path.join(__dirname, '../proto/Tracing.proto')
    const MANAGEMENT_PROTO_PATH = path.join(__dirname, '../proto/Management.proto')
    const LOGGING_PROTO_PATH = path.join(__dirname, '../proto/Logging.proto')
    const JVMMETRIC_PROTO_PATH = path.join(__dirname, '../proto/JVMMetric.proto')
    
    const packageDefinition = protoLoader.loadSync(
      [PROTO_PATH, MANAGEMENT_PROTO_PATH, LOGGING_PROTO_PATH, JVMMETRIC_PROTO_PATH],
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [path.join(__dirname, '../proto')]
      }
    )
    
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
    return protoDescriptor.skywalking.v3
  }

  /**
   * 启动 gRPC 服务
   * @param {number} port - gRPC 服务端口，默认 11800
   */
  start(port = 11800) {
    try {
      console.log('正在加载 Protobuf 定义...')
      const proto = this.loadProto()
      
      // 创建 gRPC 服务器
      this.server = new grpc.Server()

      // 注册管理服务
      this.server.addService(proto.ManagementService.service, {
        reportInstanceProperties: this.handleInstanceProperties.bind(this),
        keepAlive: this.handleKeepAlive.bind(this)
      })

      // 注册追踪服务
      this.server.addService(proto.TraceSegmentReportService.service, {
        collect: this.handleTraceSegments.bind(this),
        collectInSync: this.handleTraceSegmentSync.bind(this)
      })

      // 注册日志服务
      this.server.addService(proto.LogReportService.service, {
        collect: this.handleLogs.bind(this)
      })

      // 注册JVM指标服务
      this.server.addService(proto.JVMMetricReportService.service, {
        collect: this.handleJVMMetrics.bind(this)
      })

      // 绑定端口并启动
      const bindAddress = `0.0.0.0:${port}`
      this.server.bindAsync(
        bindAddress,
        grpc.ServerCredentials.createInsecure(),
        (error, bindPort) => {
          if (error) {
            console.error('❌ gRPC 服务启动失败:', error)
            log.printError('gRPC 服务启动失败:', error)
            return
          }
          console.log(`✅ gRPC 服务已启动（Protobuf 完整解析），监听端口: ${bindPort}`.green)
          log.printInfo(`gRPC 服务已启动（Protobuf），监听端口: ${bindPort}`)
        }
      )
    } catch (error) {
      console.error('❌ gRPC 服务启动异常:', error)
      log.printError('gRPC 服务启动异常:', error)
    }
  }

  /**
   * 处理实例注册
   */
  handleInstanceProperties(call, callback) {
    try {
      const instanceProps = call.request
      
      console.log('\n' + '='.repeat(70))
      console.log('📋 SkyWalking 实例注册')
      console.log('='.repeat(70))
      console.log('🏷️  服务信息：')
      console.log(`  服务名: ${instanceProps.service}`)
      console.log(`  实例名: ${instanceProps.serviceInstance}`)
      console.log(`  层级: ${instanceProps.layer || 'N/A'}`)
      
      if (instanceProps.properties && instanceProps.properties.length > 0) {
        console.log('\n📝 实例属性：')
        instanceProps.properties.forEach(prop => {
          console.log(`  ${prop.key}: ${prop.value}`)
        })
      }
      console.log('='.repeat(70) + '\n')
      
      // 保存到数据库
      this.apmStorage.saveServiceInstance(instanceProps).catch(err => {
        log.printError('保存服务实例失败:', err)
      })
      
      // 返回空的 Commands
      callback(null, { commands: [] })
    } catch (error) {
      console.error('❌ 处理实例注册异常:', error)
      callback(null, { commands: [] })
    }
  }

  /**
   * 处理心跳
   */
  handleKeepAlive(call, callback) {
    try {
      const ping = call.request
      console.log(`💓 心跳: ${ping.service} / ${ping.serviceInstance}`)
      
      log.printInfo('SkyWalking 心跳: ' + ping.service)
      
      // 更新心跳
      this.apmStorage.updateHeartbeat(ping).catch(err => {
        log.printError('更新心跳失败:', err)
      })
      
      callback(null, { commands: [] })
    } catch (error) {
      console.error('❌ 处理心跳异常:', error)
      callback(null, { commands: [] })
    }
  }

  /**
   * 处理追踪数据（流式）
   */
  handleTraceSegments(call, callback) {
    const segments = []
    
    call.on('data', (segment) => {
      segments.push(segment)
      this.processSegment(segment)
    })
    
    call.on('end', () => {
      console.log(`✅ 本次共接收 ${segments.length} 个 Trace Segment\n`)
      callback(null, { commands: [] })
    })
    
    call.on('error', (error) => {
      console.error('❌ 接收 Trace Segment 异常:', error)
      log.printError('接收 Trace Segment 异常:', error)
    })
  }

  /**
   * 处理追踪数据（同步）
   */
  handleTraceSegmentSync(call, callback) {
    try {
      const segment = call.request
      this.processSegment(segment)
      callback(null, { commands: [] })
    } catch (error) {
      console.error('❌ 处理 Trace Segment 异常:', error)
      callback(null, { commands: [] })
    }
  }

  /**
   * 处理日志数据
   */
  handleLogs(call, callback) {
    const logs = []
    
    call.on('data', (logData) => {
      logs.push(logData)
      this.processLog(logData)
    })
    
    call.on('end', () => {
      console.log(`✅ 本次共接收 ${logs.length} 条日志\n`)
      callback(null, { commands: [] })
    })
    
    call.on('error', (error) => {
      console.error('❌ 接收日志异常:', error)
      log.printError('接收日志异常:', error)
    })
  }

  /**
   * 处理JVM指标数据
   */
  handleJVMMetrics(call, callback) {
    try {
      const metricsCollection = call.request
      this.processMetrics(metricsCollection)
      callback(null, { commands: [] })
    } catch (error) {
      console.error('❌ 处理JVM指标异常:', error)
      callback(null, { commands: [] })
    }
  }

  /**
   * 处理单个日志
   */
  processLog(logData) {
    console.log('\n' + '='.repeat(70))
    console.log('📝 SkyWalking 日志')
    console.log('='.repeat(70))
    console.log(`  服务: ${logData.service}`)
    console.log(`  实例: ${logData.serviceInstance}`)
    console.log(`  端点: ${logData.endpoint || 'N/A'}`)
    console.log(`  时间: ${new Date(parseInt(logData.timestamp)).toISOString()}`)
    
    if (logData.traceContext) {
      console.log(`  Trace ID: ${logData.traceContext.traceId || 'N/A'}`)
    }
    
    if (logData.body) {
      console.log(`  内容: ${JSON.stringify(logData.body).substring(0, 200)}`)
    }
    
    console.log('='.repeat(70) + '\n')
    
    // 保存到数据库
    this.apmStorage.saveLog(logData).catch(err => {
      log.printError('保存日志失败:', err)
    })
  }

  /**
   * 处理指标数据
   */
  processMetrics(metricsCollection) {
    console.log('\n' + '='.repeat(70))
    console.log('📊 SkyWalking JVM 指标')
    console.log('='.repeat(70))
    console.log(`  服务: ${metricsCollection.service}`)
    console.log(`  实例: ${metricsCollection.serviceInstance}`)
    console.log(`  指标数量: ${metricsCollection.metrics ? metricsCollection.metrics.length : 0}`)
    
    if (metricsCollection.metrics && metricsCollection.metrics.length > 0) {
      const metric = metricsCollection.metrics[0]
      console.log(`\n  📈 最新指标:`)
      console.log(`    时间: ${new Date(parseInt(metric.time)).toISOString()}`)
      if (metric.cpu) {
        console.log(`    CPU: ${metric.cpu.usagePercent.toFixed(2)}%`)
      }
      if (metric.memory) {
        metric.memory.forEach(mem => {
          const type = mem.isHeap ? 'Heap' : 'NonHeap'
          console.log(`    ${type}: ${(mem.used / 1024 / 1024).toFixed(2)} MB / ${(mem.max / 1024 / 1024).toFixed(2)} MB`)
        })
      }
      if (metric.thread) {
        console.log(`    线程: ${metric.thread.liveCount} (活跃: ${metric.thread.runnableStateThreadCount})`)
      }
    }
    
    console.log('='.repeat(70) + '\n')
    
    // 保存到数据库
    this.apmStorage.saveMetrics(metricsCollection).catch(err => {
      log.printError('保存指标失败:', err)
    })
  }

  /**
   * 处理单个 Segment
   */
  async processSegment(segment) {
    // 使用 parser 解析 Segment（提取 tags 等详细信息）
    const parsed = this.parser.parseTraceSegment(segment)
    
    // Segment 级别去重
    const segmentKey = `${parsed.traceId}_${parsed.traceSegmentId}`
    
    if (this.processedSegments.has(segmentKey)) {
      console.log(`⚠️  重复的 Segment，已跳过: ${segmentKey}`)
      return
    }
    
    // 记录已处理
    this.processedSegments.set(segmentKey, Date.now())
    
    // 打印 Segment 基本信息
    console.log(`📊 Segment 接收: Service=${parsed.service}, Instance=${parsed.serviceInstance}, TraceID=${parsed.traceId.substring(0, 16)}..., Spans=${parsed.spans ? parsed.spans.length : 0}`)
    
    // console.log('\n' + '='.repeat(70))
    // console.log('🔍 SkyWalking Trace Segment')
    // console.log('='.repeat(70))
    
    // 基本信息
    // console.log('📊 基本信息：')
    // console.log(`  Trace ID: ${segment.traceId}`)
    // console.log(`  Segment ID: ${segment.traceSegmentId}`)
    // console.log(`  服务: ${segment.service}`)
    // console.log(`  实例: ${segment.serviceInstance}`)
    // console.log(`  Spans 数量: ${segment.spans ? segment.spans.length : 0}`)
    
    // 处理每个 Span
    if (segment.spans && segment.spans.length > 0) {
      segment.spans.forEach((span, index) => {
        // console.log(`\n🔸 Span #${index + 1}:`)
        // console.log(`  Span ID: ${span.spanId}`)
        // console.log(`  Parent Span ID: ${span.parentSpanId}`)
        // console.log(`  操作名称: ${span.operationName}`)
        // console.log(`  Span 类型: ${this.getSpanTypeName(span.spanType)}`)
        // console.log(`  Span 层级: ${this.getSpanLayerName(span.spanLayer)}`)
        // console.log(`  开始时间: ${new Date(parseInt(span.startTime)).toISOString()}`)
        // console.log(`  结束时间: ${new Date(parseInt(span.endTime)).toISOString()}`)
        // console.log(`  耗时: ${parseInt(span.endTime) - parseInt(span.startTime)} ms`)
        
        // if (span.peer) {
        //   console.log(`  Peer: ${span.peer}`)
        // }
        
        // if (span.isError) {
        //   console.log(`  ⚠️  错误: 是`)
        // }
        
        // Tags
        // if (span.tags && span.tags.length > 0) {
        //   console.log(`\n  📌 Tags:`)
        //   span.tags.forEach(tag => {
        //     console.log(`    ${tag.key}: ${tag.value}`)
        //   })
        // }
        
        // // Logs
        // if (span.logs && span.logs.length > 0) {
        //   console.log(`\n  📝 Logs:`)
        //   span.logs.forEach((logEntry, logIndex) => {
        //     console.log(`    Log #${logIndex + 1} (${new Date(parseInt(logEntry.time)).toISOString()}):`)
        //     logEntry.data.forEach(item => {
        //       console.log(`      ${item.key}: ${item.value}`)
        //     })
        //   })
        // }
        
        // // References
        // if (span.refs && span.refs.length > 0) {
        //   console.log(`\n  🔗 References:`)
        //   span.refs.forEach((ref, refIndex) => {
        //     console.log(`    Ref #${refIndex + 1}:`)
        //     console.log(`      Type: ${this.getRefTypeName(ref.refType)}`)
        //     console.log(`      Parent Service: ${ref.parentService}`)
        //     console.log(`      Parent Endpoint: ${ref.parentEndpoint}`)
        //   })
        // }
      })
    }
    
    const json = this.segmentToJSON(segment)
    
    // 可选：保存到文件
    if (this.saveToFile) {
      this.saveSegmentToFile(segment, json)
    }
    
    log.printInfo(`SkyWalking Trace: ${parsed.traceId}`)
    
    // 保存到数据库（使用 parser 解析后的数据）
    try {
      await this.apmStorage.saveTraceSegment(parsed)
      await this.apmStorage.saveSpans(parsed, this.processedSpans)
      await this.apmStorage.saveErrors(parsed)
    } catch (error) {
      log.printError('保存 Trace 数据失败:', error)
    }
  }

  /**
   * 将 Segment 转换为 JSON
   */
  segmentToJSON(segment) {
    return {
      traceId: segment.traceId,
      traceSegmentId: segment.traceSegmentId,
      service: segment.service,
      serviceInstance: segment.serviceInstance,
      isSizeLimited: segment.isSizeLimited,
      spans: segment.spans ? segment.spans.map(span => ({
        spanId: span.spanId,
        parentSpanId: span.parentSpanId,
        startTime: parseInt(span.startTime),
        endTime: parseInt(span.endTime),
        duration: parseInt(span.endTime) - parseInt(span.startTime),
        operationName: span.operationName,
        peer: span.peer,
        spanType: this.getSpanTypeName(span.spanType),
        spanLayer: this.getSpanLayerName(span.spanLayer),
        componentId: span.componentId,
        isError: span.isError,
        tags: span.tags ? span.tags.reduce((obj, tag) => {
          obj[tag.key] = tag.value
          return obj
        }, {}) : {},
        logs: span.logs ? span.logs.map(log => ({
          time: parseInt(log.time),
          data: log.data ? log.data.reduce((obj, item) => {
            obj[item.key] = item.value
            return obj
          }, {}) : {}
        })) : [],
        refs: span.refs ? span.refs.map(ref => ({
          refType: this.getRefTypeName(ref.refType),
          traceId: ref.traceId,
          parentTraceSegmentId: ref.parentTraceSegmentId,
          parentSpanId: ref.parentSpanId,
          parentService: ref.parentService,
          parentServiceInstance: ref.parentServiceInstance,
          parentEndpoint: ref.parentEndpoint,
          networkAddress: ref.networkAddressUsedAtPeer
        })) : []
      })) : []
    }
  }

  /**
   * 保存到文件
   */
  saveSegmentToFile(segment, json) {
    try {
      const timestamp = Date.now()
      const filename = `trace_${segment.traceId}_${timestamp}.json`
      const filepath = path.join(this.logDir, filename)
      
      fs.writeFileSync(filepath, JSON.stringify(json, null, 2))
      console.log(`💾 已保存到: ${filepath}`)
    } catch (error) {
      console.error('保存文件失败:', error)
    }
  }

  /**
   * 辅助方法：获取 Span 类型名称
   */
  getSpanTypeName(type) {
    const types = { 0: 'Entry', 1: 'Exit', 2: 'Local' }
    return types[type] || `Unknown(${type})`
  }

  /**
   * 辅助方法：获取 Span 层级名称
   */
  getSpanLayerName(layer) {
    const layers = { 
      0: 'Unknown', 
      1: 'Database', 
      2: 'RPCFramework', 
      3: 'Http', 
      4: 'MQ', 
      5: 'Cache' 
    }
    return layers[layer] || `Unknown(${layer})`
  }

  /**
   * 辅助方法：获取引用类型名称
   */
  getRefTypeName(type) {
    const types = { 0: 'CrossProcess', 1: 'CrossThread' }
    return types[type] || `Unknown(${type})`
  }

  /**
   * 启用/禁用保存到文件
   */
  enableSaveToFile(enable = true) {
    this.saveToFile = enable
    console.log(`${enable ? '✓' : '✗'} 数据保存到文件: ${enable ? '已启用' : '已禁用'}`)
    if (enable) {
      console.log(`  文件保存路径: ${this.logDir}`)
    }
  }

  /**
   * 停止 gRPC 服务
   */
  stop() {
    if (this.server) {
      this.server.tryShutdown((error) => {
        if (error) {
          console.error('gRPC 服务停止失败:', error)
        } else {
          console.log('gRPC 服务已停止')
        }
      })
    }
  }
}

module.exports = GrpcServerProtobuf

