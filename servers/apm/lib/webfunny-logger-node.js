/**
 * WebFunny Logger SDK for Node.js
 * 专为 Node.js 环境设计的日志上报 SDK
 * 
 * @example
 * const WebFunnyLogger = require('./webfunny-logger-node');
 * 
 * const logger = new WebFunnyLogger({
 *   projectId: 'your_project_id',
 *   apiUrl: 'http://localhost:8029/wfLog',
 *   batchSize: 10,
 *   flushInterval: 3000,
 *   userId: 'optional_user_id'
 * });
 * 
 * logger.info('用户登录', { userId: '12345', ip: '127.0.0.1' });
 * logger.error('数据库连接失败', { error: err.message });
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');
const os = require('os');

class WebFunnyLogger {
  constructor(options = {}) {
    // 必填配置
    if (!options.projectId) {
      throw new Error('[WebFunnyLogger] projectId is required');
    }
    if (!options.apiUrl) {
      throw new Error('[WebFunnyLogger] apiUrl is required');
    }

    // 基础配置
    this.projectId = options.projectId;
    this.apiUrl = options.apiUrl;
    this.userId = options.userId || '';
    
    // 批量上报配置
    this.batchSize = options.batchSize || 10;
    this.flushInterval = options.flushInterval || 3000;
    this.maxQueueSize = options.maxQueueSize || 1000; // 最大队列长度
    
    // 日志队列
    this.logQueue = [];
    this.timer = null;
    this.isFlushing = false;
    
    // 统计信息
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
      dropped: 0
    };
    
    // 环境信息
    this.env = {
      hostname: os.hostname(),
      platform: os.platform(),
      nodeVersion: process.version,
      pid: process.pid
    };
    
    // 是否启用调试
    this.debug = options.debug || false;
    
    // 初始化
    this.init();
  }

  /**
   * 初始化 SDK
   */
  init() {
    // 启动定时上报
    this.startAutoFlush();
    
    // 监听进程退出事件
    this.setupExitHandlers();
    
    if (this.debug) {
      console.log('[WebFunnyLogger] SDK initialized', {
        projectId: this.projectId,
        apiUrl: this.apiUrl,
        batchSize: this.batchSize,
        flushInterval: this.flushInterval
      });
    }
  }

  /**
   * 设置进程退出处理
   */
  setupExitHandlers() {
    const exitHandler = async (signal) => {
      if (this.debug) {
        console.log(`[WebFunnyLogger] Received ${signal}, flushing logs...`);
      }
      await this.flush();
      this.destroy();
    };

    // 正常退出
    process.on('beforeExit', () => exitHandler('beforeExit'));
    
    // Ctrl+C
    process.on('SIGINT', async () => {
      await exitHandler('SIGINT');
      process.exit(0);
    });
    
    // Kill 信号
    process.on('SIGTERM', async () => {
      await exitHandler('SIGTERM');
      process.exit(0);
    });
    
    // 未捕获异常
    process.on('uncaughtException', async (err) => {
      this.error('Uncaught Exception', {
        error: err.message,
        stack: err.stack,
        tags: 'uncaught-exception'
      });
      await this.flush();
    });
    
    // 未处理的 Promise 拒绝
    process.on('unhandledRejection', async (reason, promise) => {
      this.error('Unhandled Promise Rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : '',
        tags: 'unhandled-rejection'
      });
      await this.flush();
    });
  }

  /**
   * 记录日志（通用方法）
   * @param {string} level - 日志级别
   * @param {string} message - 日志消息
   * @param {object} data - 附加数据
   */
  log(level, message, data = {}) {
    const logData = {
      dataId: this.generateUUID(),
      happenDate: this.getCurrentTime(),
      userId: data.userId || this.userId || '',
      secondId: data.secondId || '',
      thirdInfo: data.thirdInfo || '',
      logLevel: level,
      message: message,
      tags: data.tags || '',
      content: JSON.stringify({
        ...data,
        env: this.env
      }),
      monitorIp: '', // 由服务端获取
      country: '',
      province: '',
      city: '',
      webMonitorId: this.projectId
    };

    this.addToQueue(logData);
  }

  /**
   * Debug 级别日志
   */
  debug(message, data) {
    this.log('debug', message, data);
  }

  /**
   * Info 级别日志
   */
  info(message, data) {
    this.log('info', message, data);
  }

  /**
   * Warn 级别日志
   */
  warn(message, data) {
    this.log('warn', message, data);
  }

  /**
   * Error 级别日志
   */
  error(message, data) {
    this.log('error', message, data);
  }

  /**
   * Fatal 级别日志
   */
  fatal(message, data) {
    this.log('fatal', message, data);
  }

  /**
   * 添加日志到队列
   */
  addToQueue(logData) {
    // 队列满了，丢弃最旧的日志
    if (this.logQueue.length >= this.maxQueueSize) {
      this.logQueue.shift();
      this.stats.dropped++;
      if (this.debug) {
        console.warn('[WebFunnyLogger] Queue is full, dropping oldest log');
      }
    }

    this.logQueue.push(logData);
    this.stats.total++;

    // 达到批量大小立即上报
    if (this.logQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * 启动自动上报定时器
   */
  startAutoFlush() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      if (this.logQueue.length > 0 && !this.isFlushing) {
        this.flush();
      }
    }, this.flushInterval);

    // 防止定时器阻止进程退出
    if (this.timer.unref) {
      this.timer.unref();
    }
  }

  /**
   * 立即上报所有日志
   */
  async flush() {
    if (this.logQueue.length === 0 || this.isFlushing) return;

    this.isFlushing = true;
    const logs = [...this.logQueue];
    this.logQueue = [];

    try {
      await this.sendLogs(logs);
      this.stats.success += logs.length;
      
      if (this.debug) {
        console.log(`[WebFunnyLogger] Successfully flushed ${logs.length} logs`);
      }
    } catch (error) {
      this.stats.failed += logs.length;
      
      if (this.debug) {
        console.error('[WebFunnyLogger] Flush failed:', error.message);
      }
      
      // 失败的日志重新加入队列（最多重试一次）
      if (!logs[0]._retried) {
        logs.forEach(log => {
          log._retried = true;
          if (this.logQueue.length < this.maxQueueSize) {
            this.logQueue.push(log);
          }
        });
      }
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * 发送日志到服务器
   */
  sendLogs(logs) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(`${this.apiUrl}/uploadLogs`);
      const client = urlObj.protocol === 'https:' ? https : http;
      const postData = JSON.stringify({ logs });

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': `WebFunnyLogger-Node/${this.env.nodeVersion}`
        },
        timeout: 10000 // 10秒超时
      };

      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', chunk => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ code: 200, message: 'success' });
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * 获取当前时间
   */
  getCurrentTime() {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * 生成 UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      queueLength: this.logQueue.length
    };
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
      dropped: 0
    };
  }

  /**
   * 销毁 SDK
   */
  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    if (this.debug) {
      console.log('[WebFunnyLogger] SDK destroyed', this.getStats());
    }
  }
}

module.exports = WebFunnyLogger;
