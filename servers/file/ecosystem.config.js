/**
 * PM2 生态配置文件
 * 用途：统一管理 PM2 应用配置，支持多环境部署
 * 
 * 使用方法：
 *   本地环境: pm2 start ecosystem.config.js --env local   (config.json)
 *   开发环境: pm2 start ecosystem.config.js --env dev     (config.dev.json)
 *   预发环境: pm2 start ecosystem.config.js --env stag    (config.stag.json)
 *   生产环境: pm2 start ecosystem.config.js --env pro     (config.pro.json)
 *   查看状态: pm2 list
 *   查看日志: pm2 logs apm_server
 *   重启服务: pm2 restart apm_server
 */

module.exports = {
  apps: [
    {
      // 应用名称
      name: 'apm_server',
      
      // 启动脚本
      script: './config/apm_server.js',
      
      // 工作目录
      cwd: './',
      
      // 实例数量（cluster 模式）
      // - 开发环境：1 个实例
      // - 生产环境：根据 CPU 核心数自动调整（max 表示最大核心数）
      instances: 1,
      
      // 运行模式
      // - fork: 单进程模式（默认）
      // - cluster: 集群模式（适用于生产环境，支持负载均衡）
      exec_mode: 'fork',
      
      // 自动重启配置
      autorestart: true,
      
      // 监听文件变化自动重启（仅开发环境）
      watch: false,
      
      // 忽略监听的文件/目录
      ignore_watch: [
        'node_modules',
        'logs',
        'dist',
        '.git'
      ],
      
      // 最大内存限制（超过后自动重启）
      max_memory_restart: '1G',
      
      // 环境变量
      // NODE_ENV 对应配置文件：
      //   local -> config.json
      //   dev   -> config.dev.json
      //   stag  -> config.stag.json
      //   pro   -> config.pro.json
      env: {
        NODE_ENV: 'local',
        PORT: 8027
      },
      
      env_local: {
        NODE_ENV: 'local',
        PORT: 8027
      },
      
      env_dev: {
        NODE_ENV: 'dev',
        PORT: 8027
      },
      
      env_stag: {
        NODE_ENV: 'stag',
        PORT: 8027
      },
      
      env_pro: {
        NODE_ENV: 'pro',
        PORT: 8027
      },
      
      // 日志配置
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      
      // 合并日志（将所有实例的日志合并到一个文件）
      merge_logs: true,
      
      // 日志文件最大大小（需要安装 pm2-logrotate）
      // pm2 install pm2-logrotate
      // pm2 set pm2-logrotate:max_size 100M
      // pm2 set pm2-logrotate:retain 10
      
      // 启动延迟（毫秒）
      listen_timeout: 10000,
      
      // 优雅关闭超时时间（毫秒）
      kill_timeout: 5000,
      
      // 进程异常退出后的重启延迟（毫秒）
      restart_delay: 4000,
      
      // 最小运行时间，低于此时间被认为是异常重启（毫秒）
      min_uptime: '10s',
      
      // 异常重启次数限制（在 min_uptime 时间内）
      max_restarts: 10,
      
      // 启动参数
      args: '',
      
      // Node.js 参数
      node_args: '',
      
      // 进程优先级（-20 到 19，越小优先级越高）
      // nice: 0,
      
      // 是否在启动时自动重启（崩溃后）
      autorestart: true,
      
      // 启动后立即保存进程列表
      // pm2 save
      
      // Cron 重启（定时重启）
      // cron_restart: '0 0 * * *',  // 每天凌晨重启
      
      // 实例启动间隔（cluster 模式下）
      instance_var: 'INSTANCE_ID',
      
      // 是否合并集群日志
      merge_logs: true,
      
      // 错误日志分割大小
      // max_size: '100M',
      
      // 错误日志保留数量
      // retain: 10,
      
      // 启动后执行的命令
      // post_update: ['npm install', 'echo "应用已更新"'],
      
      // 等待应用准备就绪的信号
      // wait_ready: true,
    }
  ],
  
  // 部署配置（可选）
  deploy: {
    // 生产环境部署
    pro: {
      user: 'webfunny',
      host: ['192.168.1.100'],  // 可以是数组，支持多台服务器
      ref: 'origin/master',
      repo: 'git@your-gitlab.com:webfunny/apm_server_clickhouse.git',
      path: '/www/webfunny/backend/apm_server_clickhouse',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env pro',
      'pre-setup': 'echo "准备部署环境"'
    },
    
    // 预发环境部署
    stag: {
      user: 'webfunny',
      host: '192.168.1.101',
      ref: 'origin/master',
      repo: 'git@your-gitlab.com:webfunny/apm_server_clickhouse.git',
      path: '/www/webfunny/backend/apm_server_clickhouse',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env stag'
    },
    
    // 开发环境部署
    dev: {
      user: 'webfunny',
      host: '192.168.1.102',
      ref: 'origin/dev',
      repo: 'git@your-gitlab.com:webfunny/apm_server_clickhouse.git',
      path: '/www/webfunny/backend/apm_server_clickhouse',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env dev'
    }
  }
};

/**
 * PM2 常用命令：
 * 
 * 启动应用（按环境）：
 *   pm2 start ecosystem.config.js --env local  # 本地环境 (config.json)
 *   pm2 start ecosystem.config.js --env dev    # 开发环境 (config.dev.json)
 *   pm2 start ecosystem.config.js --env stag   # 预发环境 (config.stag.json)
 *   pm2 start ecosystem.config.js --env pro    # 生产环境 (config.pro.json)
 * 
 * 停止应用：
 *   pm2 stop apm_server
 *   pm2 stop all
 * 
 * 重启应用：
 *   pm2 restart apm_server
 *   pm2 reload apm_server  # 零停机重启
 * 
 * 删除应用：
 *   pm2 delete apm_server
 *   pm2 delete all
 * 
 * 查看状态：
 *   pm2 list
 *   pm2 status
 * 
 * 查看详情：
 *   pm2 info apm_server
 *   pm2 describe apm_server
 * 
 * 查看日志：
 *   pm2 logs apm_server
 *   pm2 logs apm_server --lines 100
 *   pm2 logs apm_server --err  # 只看错误日志
 * 
 * 清空日志：
 *   pm2 flush
 * 
 * 监控：
 *   pm2 monit
 * 
 * 保存进程列表：
 *   pm2 save
 * 
 * 恢复进程列表：
 *   pm2 resurrect
 * 
 * 开机自启：
 *   pm2 startup
 *   pm2 save
 * 
 * 更新 PM2：
 *   pm2 update
 * 
 * 部署命令：
 *   pm2 deploy ecosystem.config.js pro setup    # 首次部署
 *   pm2 deploy ecosystem.config.js pro          # 更新部署
 *   pm2 deploy ecosystem.config.js pro revert 1 # 回滚
 */

