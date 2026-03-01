#!/usr/bin/env node

/**
 * gRPC 服务启动配置
 * 统一管理所有 gRPC 服务的启动和停止
 */

const { accountInfo } = require("./AccountConfig")
const { startGrpcServer } = require('../grpc')
const OtlpGrpcServer = require('../grpc/otlpServer')

class GrpcServerManager {
  constructor() {
    this.skywalkingGrpcServer = null  // SkyWalking gRPC 服务实例
    this.otelGrpcServer = null        // OTEL gRPC 服务实例
  }

  /**
   * 启动所有 gRPC 服务
   */
  async startAll() {
    try {
      // 1. 启动 SkyWalking gRPC 服务
      const grpcPort = accountInfo.grpcPort || 11800
      console.log(`🚀 正在启动 SkyWalking gRPC 服务，端口: ${grpcPort}`)
      this.skywalkingGrpcServer = startGrpcServer()
      
      if (this.skywalkingGrpcServer) {
        console.log(`✅ SkyWalking gRPC 服务启动成功，端口: ${grpcPort}`)
      } else {
        console.warn(`⚠️  SkyWalking gRPC 服务启动失败，可能缺少依赖`)
      }

      // 2. 启动 OTEL gRPC 服务
      const otelGrpcPort = accountInfo.otelGrpcPort || 9013
      console.log(`🚀 正在启动 OTEL gRPC 服务，端口: ${otelGrpcPort}`)
      this.otelGrpcServer = new OtlpGrpcServer(otelGrpcPort)
      
      try {
        await this.otelGrpcServer.start()
        console.log(`✅ OTEL gRPC 服务启动成功，端口: ${otelGrpcPort}`)
      } catch (err) {
        console.error('❌ OTEL gRPC 服务启动失败:', err)
      }

      return {
        skywalking: this.skywalkingGrpcServer,
        otel: this.otelGrpcServer
      }
    } catch (error) {
      console.error('❌ gRPC 服务启动异常:', error)
      throw error
    }
  }

  /**
   * 停止所有 gRPC 服务
   */
  async stopAll() {
    const promises = []

    // 停止 SkyWalking gRPC 服务
    if (this.skywalkingGrpcServer && this.skywalkingGrpcServer.stop) {
      console.log('🔄 正在停止 SkyWalking gRPC 服务...')
      promises.push(
        new Promise((resolve) => {
          this.skywalkingGrpcServer.stop()
          console.log('✅ SkyWalking gRPC 服务已停止')
          resolve()
        })
      )
    }

    // 停止 OTEL gRPC 服务
    if (this.otelGrpcServer && this.otelGrpcServer.stop) {
      console.log('🔄 正在停止 OTEL gRPC 服务...')
      promises.push(
        this.otelGrpcServer.stop().then(() => {
          console.log('✅ OTEL gRPC 服务已停止')
        })
      )
    }

    await Promise.all(promises)
    console.log('👋 所有 gRPC 服务已完全关闭')
  }

  /**
   * 仅启动 SkyWalking gRPC 服务
   */
  startSkyWalking() {
    const grpcPort = accountInfo.grpcPort || 11800
    console.log(`🚀 正在启动 SkyWalking gRPC 服务，端口: ${grpcPort}`)
    this.skywalkingGrpcServer = startGrpcServer()
    
    if (this.skywalkingGrpcServer) {
      console.log(`✅ SkyWalking gRPC 服务启动成功，端口: ${grpcPort}`)
    } else {
      console.warn(`⚠️  SkyWalking gRPC 服务启动失败，可能缺少依赖`)
    }
    
    return this.skywalkingGrpcServer
  }

  /**
   * 仅启动 OTEL gRPC 服务
   */
  async startOTEL() {
    const otelGrpcPort = accountInfo.otelGrpcPort || 9013
    console.log(`🚀 正在启动 OTEL gRPC 服务，端口: ${otelGrpcPort}`)
    this.otelGrpcServer = new OtlpGrpcServer(otelGrpcPort)
    
    try {
      await this.otelGrpcServer.start()
      console.log(`✅ OTEL gRPC 服务启动成功，端口: ${otelGrpcPort}`)
      return this.otelGrpcServer
    } catch (err) {
      console.error('❌ OTEL gRPC 服务启动失败:', err)
      throw err
    }
  }
}

// 导出单例实例和类
const grpcServerManager = new GrpcServerManager()

module.exports = {
  GrpcServerManager,
  grpcServerManager
}

