// SkyWalking 核心数据表（用于动态创建）
// 注意：只包含需要按 serviceInstance 动态分表的表
module.exports = [
    "../schema/apmTraceSegment",      // Trace 追踪数据
    "../schema/apmSpanInfo",          // Span 详细信息
    "../schema/apmServiceInstance",   // 服务实例信息
    "../schema/apmErrorInfo",         // 错误详情（每次错误一条记录）
    "../schema/apmErrorHandleList", // 错误聚合管理表（后续功能，暂时不创建）
    "../schema/apmLogInfo",           // 应用日志
    "../schema/apmMetricsInfo"        // JVM 性能指标
]
