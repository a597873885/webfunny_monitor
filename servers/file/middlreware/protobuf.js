/**
 * protobuf格式处理
 */
const protobuf = require('protobufjs')
const path = require("path")
// Sample protobuf message definition
// const protoRoot = protobuf.loadSync(path.resolve(__dirname, '../') + '/opentelemetry/proto/collector/trace/v1/trace_service.proto');
// const YourMessage = protoRoot.lookupType('ExportTraceServiceRequest');
const protoRoot = protobuf.loadSync(path.resolve(__dirname, '../') + '/proto/file.proto');
const YourMessage = protoRoot.lookupType('Person');
module.exports = function () {
    return async function (ctx, next) {
      if (ctx.request.type === 'application/x-protobuf') {
        try {  
          // 读取请求体中的二进制数据  
          const protobufData = ctx.req
          console.log("ctx.request.body: ", protobufData)
      
          // // 解析Protobuf数据  
          const message = YourMessage.decode(protobufData);  

          console.log("message: " + message)
      
          // // 将解析后的数据附加到请求上下文，以便后续路由处理  
          ctx.state.protobufMessage = message;  
        } catch (err) {
          console.log(err)
          ctx.throw(400, 'Failed to parse Protobuf data');  
        }  
        await next();
      } else {
        await next();
      }
    }
}
