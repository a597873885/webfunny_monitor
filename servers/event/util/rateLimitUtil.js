const ipAccessMap = new Map();
const apiStartTimes = new Map();
const DEFAULT_WINDOW_DURATION = 9 * 60 * 1000; // 10分钟，单位毫秒
// 新增：IP访问频率限制相关的常量和Map
const IP_RATE_LIMIT = {
  MAX_REQUESTS: 100,           // 1分钟内最大请求次数
  WINDOW_SIZE: 60 * 1000,     // 检查窗口大小（1分钟）
  BLOCK_DURATION: 60 * 60 * 1000  // 限制时长（1小时）
};
const ipRateLimitMap = new Map(); // 存储IP访问记录和限制状态

/**
 * 检查并更新IP访问频率
 * @param {string} ip 客户端IP
 * @returns {Object} 检查结果
 */
function checkIpRate(ip) {
  const now = Date.now();
  let ipInfo = ipRateLimitMap.get(ip);

  // 如果IP信息不存在，创建新的记录
  if (!ipInfo) {
    ipInfo = {
      requests: [],    // 存储请求时间戳
      blocked: false,  // 是否被限制
      blockUntil: 0    // 限制解除时间
    };
    ipRateLimitMap.set(ip, ipInfo);
  }

  // 如果IP被限制，检查是否可以解除限制
  if (ipInfo.blocked) {
    if (now >= ipInfo.blockUntil) {
      // 解除限制
      ipInfo.blocked = false;
      ipInfo.blockUntil = 0;
      ipInfo.requests = [];
    } else {
      // 仍在限制期内
      const remainingTime = Math.ceil((ipInfo.blockUntil - now) / 1000); // 剩余秒数
      return {
        shouldLimit: true,
        reason: `IP访问频率过高，请等待${remainingTime}秒后重试`,
        statusCode: 429
      };
    }
  }

  // 清理超过检查窗口的请求记录
  const windowStart = now - IP_RATE_LIMIT.WINDOW_SIZE;
  ipInfo.requests = ipInfo.requests.filter(time => time > windowStart);

  // 添加新的请求记录
  ipInfo.requests.push(now);

  // 检查是否超过限制
  if (ipInfo.requests.length > IP_RATE_LIMIT.MAX_REQUESTS) {
    ipInfo.blocked = true;
    ipInfo.blockUntil = now + IP_RATE_LIMIT.BLOCK_DURATION;
    return {
      shouldLimit: true,
      reason: '访问频率超过限制（1分钟内超过100次），已限制访问1小时',
      statusCode: 429
    };
  }

  return {
    shouldLimit: false,
    reason: null,
    statusCode: 200
  };
}

/**
 * 检查请求是否应该被限制
 * @param {string} apiKey API的唯一标识符
 * @param {string} clientIp 客户端IP
 * @param {Object} options 配置选项
 * @returns {Object} 包含是否限制和原因的对象
 */
function checkRateLimit(apiKey, clientIp, options = {}) {
  const {
    windowDuration = DEFAULT_WINDOW_DURATION,
    enableTimeWindow = true,
    enableIpLimit = true
  } = options;
  
  const result = {
    shouldLimit: false,
    reason: null,
    statusCode: 200
  };

  // 首先检查IP访问频率
  const ipRateCheck = checkIpRate(clientIp);
  if (ipRateCheck.shouldLimit) {
    return ipRateCheck;
  }

  //key是api+ip
  let apiIpKey = `${apiKey}:${clientIp}`;
  // 初始化API开始时间（如果不存在）
  if (enableTimeWindow && !apiStartTimes.has(apiIpKey)) {
    apiStartTimes.set(apiIpKey, Date.now());//第一次调用直接放过
  }else if (enableTimeWindow){//检查时间窗口，超过第一次，要判断是否在有效时间范围内
     const apiStartTime = apiStartTimes.get(apiIpKey);
     const currentTime = Date.now();
        
     if (currentTime - apiStartTime < windowDuration) {
        result.shouldLimit = true;
        result.reason = 'API接口九分钟内只允许同一个IP调一次，请稍后再试';
        result.statusCode = 403;
        return result;
    }
  }
  if (enableTimeWindow && apiStartTimes.get(apiIpKey)){//检查时间窗口有效，重置时间
     const apiStartTime = apiStartTimes.get(apiIpKey);
     const currentTime = Date.now();
     if (currentTime - apiStartTime > windowDuration) {
        apiStartTimes.set(apiIpKey, currentTime);
     }
  }
  // 检查IP限制
  if (enableIpLimit) {
    const ipKey = `${apiKey}:${clientIp}`;
    
    if (ipAccessMap.has(ipKey)) {
      result.shouldLimit = true;
      result.reason = 'You have already accessed this API endpoint';
      result.statusCode = 429;
      return result;
    }
    
    // 记录IP访问
    ipAccessMap.set(ipKey, Date.now());
  }
  
  return result;
}

/**
 * 获取客户端IP
 * @param {Object} req Express请求对象
 * @returns {string} 客户端IP
 */
function getClientIp(ctx) {
  return ctx.req.headers['x-forwarded-for'] ||
            ctx.req.connection.remoteAddress ||
            ctx.req.socket.remoteAddress ||
         (ctx.req.connection.socket ? ctx.req.connection.socket.remoteAddress : null);
}

/**
 * 清理过期的IP限制记录（可选：定期调用此函数以防止内存泄漏）
 */
function cleanupIpRateLimits() {
  const now = Date.now();
  for (const [ip, info] of ipRateLimitMap.entries()) {
    // 清理已解除限制且没有最近请求的IP记录
    if (!info.blocked) {
      const hasRecentRequests = info.requests.some(time => time > now - IP_RATE_LIMIT.WINDOW_SIZE);
      if (!hasRecentRequests) {
        ipRateLimitMap.delete(ip);
      }
    }
    // 清理限制已过期的IP记录
    else if (now >= info.blockUntil) {
      ipRateLimitMap.delete(ip);
    }
  }
}

// 可选：设置定期清理任务
setInterval(cleanupIpRateLimits, 5 * 60 * 1000); // 每5分钟清理一次

module.exports = {
  checkRateLimit,
  getClientIp
};