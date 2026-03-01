#!/usr/bin/env node

/**
 * gRPC 服务入口
 * 用于接收 SkyWalking SDK 上报数据
 */

const { accountInfo } = require("../config/AccountConfig")

/**
 * 启动 gRPC 服务
 */
function startGrpcServer() {
  try {
    // 使用 Protobuf 完整解析版本（推荐）
    const GrpcServerProtobuf = require('./grpcServerProtobuf')
    const grpcServer = new GrpcServerProtobuf()
    
    // 如果想使用简单的字符串提取版本，取消下面两行注释，注释掉上面两行
    // const GrpcServer = require('./grpcServer')
    // const grpcServer = new GrpcServer()
    
    const grpcPort = accountInfo.grpcPort || 11800
    
    // 可选：启用保存数据到文件（默认关闭，如需启用请取消下一行注释）
    // grpcServer.enableSaveToFile(true)
    
    grpcServer.start(grpcPort)
    
    // 暴露 grpcServer 实例，便于其他模块访问
    global.grpcServer = grpcServer
    
    // 进程退出时关闭 gRPC 服务
    process.on('SIGTERM', () => {
      grpcServer.stop()
    })
    process.on('SIGINT', () => {
      grpcServer.stop()
      process.exit(0)
    })
    
    return grpcServer
  } catch (error) {
    console.error('gRPC 服务启动失败:', error.message)
    console.error(error.stack)
    console.log('提示：如需使用 SkyWalking gRPC 功能，请先安装依赖：npm install @grpc/grpc-js @grpc/proto-loader')
    return null
  }
}

module.exports = {
  startGrpcServer
}

