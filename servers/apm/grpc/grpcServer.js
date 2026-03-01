/**
 * gRPC 服务 - 用于接收 SkyWalking SDK 上报的数据
 */
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const log = require('../config/log')
const SkyWalkingParser = require('../lib/skywalkingParser')
const ApmStorageModel = require('../modules/apmStorage')

/**
 * 从 Buffer 中提取可读字符串
 * @param {Buffer} buffer 
 * @returns {Array} 可读字符串数组
 */
function extractReadableStrings(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) return []
  
  const strings = []
  let current = ''
  
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i]
    // 可打印的 ASCII 字符 (32-126) 或常见的 UTF-8 字符
    if ((byte >= 32 && byte <= 126) || byte >= 128) {
      current += String.fromCharCode(byte)
    } else {
      if (current.length > 3) {  // 至少 4 个字符才算有效字符串
        strings.push(current)
      }
      current = ''
    }
  }
  
  if (current.length > 3) {
    strings.push(current)
  }
  
  return strings
}

/**
 * 格式化显示 SkyWalking 数据
 * @param {Buffer} buffer 
 * @param {string} type 数据类型
 */
function displaySkywalkingData(buffer, type = 'Unknown') {
  console.log(`==================== SkyWalking ${type} 上报 ====================`)
  console.log(`Buffer 长度: ${buffer ? buffer.length : 0} bytes`)
  
  if (buffer && buffer.length > 0) {
    // 提取可读字符串
    const strings = extractReadableStrings(buffer)
    
    if (strings.length > 0) {
      console.log('\n【提取的可读信息】')
      strings.forEach((str, index) => {
        // 过滤掉一些无意义的字符串
        if (str.length > 1 && !str.match(/^[\x00-\x1F]+$/)) {
          console.log(`  ${index + 1}. ${str}`)
        }
      })
    }
    
    // 对于小数据，也显示 hex
    if (buffer.length < 500) {
      console.log('\n【原始 Hex】')
      console.log(buffer.toString('hex').substring(0, 200) + (buffer.length > 100 ? '...' : ''))
    }
  }
  
  console.log('================================================================\n')
}

class GrpcServer {
  constructor() {
    this.server = null
    this.parser = new SkyWalkingParser()
    this.apmStorage = new ApmStorageModel()
    this.saveToFile = false  // 是否保存原始数据到文件，默认关闭
    
    // 全局去重 Set（跨 gRPC 连接）
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
   * 启动 gRPC 服务
   * @param {number} port - gRPC 服务端口，默认 11800
   */
  start(port = 11800) {
    try {
      // 创建 gRPC 服务器
      this.server = new grpc.Server()

      // 注册服务 - 管理服务（心跳、实例注册）
      this.registerManagementService()
      
      // 注册服务 - 追踪上报服务
      this.registerTraceService()
      
      // 注册服务 - 日志上报服务
      this.registerLogService()
      
      // 注册服务 - Metrics上报服务
      this.registerMetricsService()

      // 绑定端口并启动
      const bindAddress = `0.0.0.0:${port}`
      this.server.bindAsync(
        bindAddress,
        grpc.ServerCredentials.createInsecure(),
        (error, bindPort) => {
          if (error) {
            console.error('gRPC 服务启动失败:', error)
            log.printError('gRPC 服务启动失败:', error)
            return
          }
          console.log(`✓ gRPC 服务已启动，监听端口: ${bindPort}`.green)
          log.printInfo(`gRPC 服务已启动，监听端口: ${bindPort}`)
          // 注意：新版本 @grpc/grpc-js 不需要手动调用 start()，bindAsync 会自动启动
        }
      )
    } catch (error) {
      console.error('gRPC 服务启动异常:', error)
      log.printError('gRPC 服务启动异常:', error)
    }
  }

  /**
   * 注册管理服务（心跳、实例注册等）
   */
  registerManagementService() {
    // 定义管理服务
    const managementService = {
      // 实例注册
      reportInstanceProperties: async (call, callback) => {
        try {
          const instanceData = call.request
          
          // 使用新的解析器
          const parsed = this.parser.parseInstanceProperties(instanceData)
          this.parser.printFormatted(parsed)
          
          // 输出 JSON 格式
          console.log('📄 JSON 格式:')
          console.log(JSON.stringify(parsed, null, 2))
          console.log('')
          
          log.printInfo('SkyWalking 实例注册: ' + (parsed.service || ''))
          
          // 保存到数据库
          if (parsed.service && parsed.serviceInstance) {
            await this.apmStorage.saveServiceInstance(parsed)
          }
          
          // 返回成功响应（空对象即可）
          callback(null, {})
        } catch (error) {
          console.error('❌ 处理实例注册异常:', error)
          callback(null, {})
        }
      },
      
      // 心跳上报
      keepAlive: async (call, callback) => {
        try {
          const heartbeat = call.request
          const data = this.parser.extractKeyValues(heartbeat)
          
          console.log(`💓 SkyWalking 心跳 - ${data.timestamp} (${data.raw_length} bytes)`)
          if (data.parsed.service) {
            console.log(`   服务: ${data.parsed.service}`)
          }
          
          log.printInfo('SkyWalking 心跳')
          
          // 更新心跳
          if (data.parsed.service && data.parsed.serviceInstance) {
            await this.apmStorage.updateHeartbeat(data.parsed)
          }
          
          // 返回成功响应
          callback(null, {})
        } catch (error) {
          console.error('❌ 处理心跳异常:', error)
          callback(null, {})
        }
      }
    }

    // 动态定义服务（简化版本，直接处理 Buffer）
    this.server.addService({
      reportInstanceProperties: {
        path: '/skywalking.v3.ManagementService/reportInstanceProperties',
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from([]),
        requestDeserialize: (value) => value,  // 直接返回 Buffer
        responseSerialize: (value) => Buffer.from([]),
        responseDeserialize: (value) => value
      },
      keepAlive: {
        path: '/skywalking.v3.ManagementService/keepAlive',
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from([]),
        requestDeserialize: (value) => value,  // 直接返回 Buffer
        responseSerialize: (value) => Buffer.from([]),
        responseDeserialize: (value) => value
      }
    }, managementService)
  }

  /**
   * 注册追踪服务
   */
  registerTraceService() {
    // 保存 this 引用（避免在嵌套回调中丢失上下文）
    const self = this
    
    // 定义追踪服务
    const traceService = {
      // 收集 Trace Segment
      collect: (call, callback) => {
        const segments = []
        
        call.on('data', async (segment) => {
          try {
            segments.push(segment)
            
            // 使用新的解析器
            const parsed = self.parser.parseTraceSegment(segment)
            
            // 生成唯一标识：traceId + traceSegmentId
            const segmentKey = `${parsed.traceId}_${parsed.traceSegmentId}`
            
            // 调试：检查去重 Map 状态
            console.log(`🔍 检查 Segment: ${segmentKey}, Map大小: ${self.processedSegments.size}`)
            
            // 检查是否已处理过（全局去重，跨连接）
            if (self.processedSegments.has(segmentKey)) {
              console.log(`⚠️  重复的 Segment，已跳过: ${segmentKey}`)
              return
            }
            
            // 记录已处理（存储时间戳用于后续清理）
            self.processedSegments.set(segmentKey, Date.now())
            console.log(`✅ 新 Segment 已记录: ${segmentKey}`)
            
            self.parser.printFormatted(parsed)
            
            // 输出 JSON 格式（便于程序处理）
            console.log('📄 JSON 格式:')
            console.log(JSON.stringify(parsed, null, 2))
            console.log('')
            
            // 可选：保存到文件
            if (self.saveToFile) {
              const files = self.parser.saveToFile(segment, 'trace')
              console.log(`💾 已保存到: ${files.jsonFile}`)
            }
            
            log.printInfo('SkyWalking Trace Segment 上报: ' + JSON.stringify(parsed.trace))
            
            // 保存到数据库
            if (parsed.service && parsed.serviceInstance && parsed.traceId) {
              // 保存完整的 Segment
              await self.apmStorage.saveTraceSegment(parsed)
              
              // 保存 Span 明细（传入全局去重 Map）
              console.log('🔍 调试: self =', typeof self, ', self.processedSpans =', typeof self.processedSpans, ', size =', self.processedSpans?.size);
              await self.apmStorage.saveSpans(parsed, self.processedSpans)
              
              // 保存错误信息（如果有）
              if (parsed.spans && parsed.spans.some(span => span.isError)) {
                await self.apmStorage.saveErrors(parsed)
              }
            }
          } catch (error) {
            console.error('❌ 处理 Trace Segment 异常:', error)
            log.printError('处理 Trace Segment 异常:', error)
          }
        })
        
        call.on('end', () => {
          console.log(`✅ 本次共接收 ${segments.length} 个 Segment\n`)
          callback(null, Buffer.from([]))
        })
        
        call.on('error', (error) => {
          console.error('❌ 接收 Trace Segment 异常:', error)
          log.printError('接收 Trace Segment 异常:', error)
        })
      },
      
      // 收集 Trace Segment (单次调用)
      collectInSync: (call, callback) => {
        const segment = call.request
        displaySkywalkingData(segment, 'Trace (Sync)')
        log.printInfo('SkyWalking Trace (Sync) 上报')
        
        callback(null, Buffer.from([]))
      }
    }

    // 动态定义服务
    this.server.addService({
      collect: {
        path: '/skywalking.v3.TraceSegmentReportService/collect',
        requestStream: true,
        responseStream: false,
        requestSerialize: (value) => Buffer.from([]),
        requestDeserialize: (value) => value,
        responseSerialize: (value) => Buffer.from([]),
        responseDeserialize: (value) => value
      },
      collectInSync: {
        path: '/skywalking.v3.TraceSegmentReportService/collectInSync',
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from([]),
        requestDeserialize: (value) => value,
        responseSerialize: (value) => Buffer.from([]),
        responseDeserialize: (value) => value
      }
    }, traceService)
  }

  /**
   * 注册日志服务
   */
  registerLogService() {
    // 定义日志服务
    const logService = {
      // 收集日志
      collect: (call, callback) => {
        const logs = []
        
        call.on('data', async (logData) => {
          try {
            logs.push(logData)
            
            // 解析日志数据
            const parsed = this.parser.parseLog(logData)
            
            console.log('==================== SkyWalking Log 上报 ====================')
            console.log('📄 解析结果:')
            console.log(JSON.stringify(parsed, null, 2))
            console.log('================================================================\n')
            
            log.printInfo('SkyWalking Log 上报')
            
            // 保存到数据库
            if (parsed.service && parsed.serviceInstance) {
              await this.apmStorage.saveLog(parsed)
            }
          } catch (error) {
            console.error('❌ 处理日志异常:', error)
            log.printError('处理日志异常:', error)
          }
        })
        
        call.on('end', () => {
          console.log(`✓ 本次共接收 ${logs.length} 条日志\n`)
          callback(null, Buffer.from([]))
        })
        
        call.on('error', (error) => {
          console.error('接收日志异常:', error)
          log.printError('接收日志异常:', error)
        })
      }
    }

    // 动态定义服务
    this.server.addService({
      collect: {
        path: '/skywalking.v3.LogReportService/collect',
        requestStream: true,
        responseStream: false,
        requestSerialize: (value) => Buffer.from([]),
        requestDeserialize: (value) => value,
        responseSerialize: (value) => Buffer.from([]),
        responseDeserialize: (value) => value
      }
    }, logService)
  }

  /**
   * 注册 Metrics 服务
   */
  registerMetricsService() {
    // 定义 Metrics 服务
    const metricsService = {
      // 收集 Metrics
      collect: (call, callback) => {
        const metrics = []
        
        call.on('data', async (metricData) => {
          try {
            metrics.push(metricData)
            
            // 解析 Metrics 数据
            const parsed = this.parser.parseMetrics(metricData)
            
            console.log('==================== SkyWalking Metrics 上报 ====================')
            console.log('📄 解析结果:')
            console.log(JSON.stringify(parsed, null, 2))
            console.log('================================================================\n')
            
            log.printInfo('SkyWalking Metrics 上报')
            
            // 保存到数据库
            if (parsed.service && parsed.serviceInstance && parsed.metrics) {
              await this.apmStorage.saveMetrics(parsed)
            }
          } catch (error) {
            console.error('❌ 处理 Metrics 异常:', error)
            log.printError('处理 Metrics 异常:', error)
          }
        })
        
        call.on('end', () => {
          console.log(`✓ 本次共接收 ${metrics.length} 个 Metrics\n`)
          callback(null, Buffer.from([]))
        })
        
        call.on('error', (error) => {
          console.error('接收 Metrics 异常:', error)
          log.printError('接收 Metrics 异常:', error)
        })
      }
    }

    // 动态定义服务
    this.server.addService({
      collect: {
        path: '/skywalking.v3.JVMMetricReportService/collect',
        requestStream: true,
        responseStream: false,
        requestSerialize: (value) => Buffer.from([]),
        requestDeserialize: (value) => value,
        responseSerialize: (value) => Buffer.from([]),
        responseDeserialize: (value) => value
      }
    }, metricsService)
  }

  /**
   * 启用/禁用保存到文件
   * @param {boolean} enable 
   */
  enableSaveToFile(enable = true) {
    this.saveToFile = enable
    console.log(`${enable ? '✓' : '✗'} 数据保存到文件: ${enable ? '已启用' : '已禁用'}`)
    if (enable) {
      console.log(`  文件保存路径: ${this.parser.logDir}`)
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

module.exports = GrpcServer

