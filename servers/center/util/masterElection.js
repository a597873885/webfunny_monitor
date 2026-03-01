const { MasterLockModel } = require('../modules/models')
const Utils = require('./utils')
const os = require('os')

/**
 * Master 选举机制
 * 基于数据库租约锁实现分布式 Master 选举
 */
class MasterElection {
    constructor(options = {}) {
        // 锁的key
        this.lockKey = options.lockKey || 'center-master-lock'
        // 锁超时时间（秒），默认30秒
        this.lockTimeout = options.lockTimeout || 30
        // 续约间隔（秒），默认10秒
        this.renewInterval = options.renewInterval || 10
        // 当前节点是否为Master
        this.isMaster = false
        // 节点ID
        this.nodeId = Utils.getUuid()
        // 节点IP
        this.nodeIp = this.getLocalIp()
        // 心跳定时器
        this.heartbeatTimer = null
        // 清理过期锁定时器
        this.cleanupTimer = null
        // 选举回调函数
        this.onBecomeMaster = options.onBecomeMaster || null
        this.onLoseMaster = options.onLoseMaster || null
        
        console.log(`[MasterElection] 节点启动: ${this.nodeId} (${this.nodeIp})`.green)
    }

    /**
     * 获取本机IP地址
     * @returns {string}
     */
    getLocalIp() {
        const interfaces = os.networkInterfaces()
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                // 跳过内部和非IPv4地址
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address
                }
            }
        }
        return '127.0.0.1'
    }

    /**
     * 尝试获取Master锁
     * @returns {Promise<boolean>}
     */
    async tryAcquireLock() {
        try {
            const now = new Date()
            const expireTime = new Date(now.getTime() + this.lockTimeout * 1000)
            
            // 1. 查询当前锁状态
            const lockInfo = await MasterLockModel.getLock(this.lockKey)
            
            // 2. 如果没有锁或锁已过期，尝试获取
            if (!lockInfo || new Date(lockInfo.expireTime) < now) {
                const success = await MasterLockModel.tryAcquireLock(
                    this.lockKey,
                    this.nodeId,
                    this.nodeIp,
                    expireTime
                )
                
                if (success) {
                    const wasMaster = this.isMaster
                    this.isMaster = true
                    
                    if (!wasMaster) {
                        console.log(`[MasterElection] 🎉 节点 ${this.nodeId} 成为 Master`.yellow)
                        if (this.onBecomeMaster) {
                            this.onBecomeMaster()
                        }
                    }
                    return true
                }
            } 
            // 3. 如果当前节点已经是Master，续约
            else if (lockInfo.nodeId === this.nodeId) {
                const renewed = await MasterLockModel.renewLock(
                    this.lockKey,
                    this.nodeId,
                    expireTime
                )
                
                if (renewed) {
                    this.isMaster = true
                    return true
                } else {
                    // 续约失败，说明失去了Master身份
                    const wasMaster = this.isMaster
                    this.isMaster = false
                    
                    if (wasMaster) {
                        console.log(`[MasterElection] ⚠️  节点 ${this.nodeId} 失去 Master 身份`.red)
                        if (this.onLoseMaster) {
                            this.onLoseMaster()
                        }
                    }
                    return false
                }
            }
            
            // 4. 其他节点持有锁
            const wasMaster = this.isMaster
            this.isMaster = false
            
            if (wasMaster) {
                console.log(`[MasterElection] ⚠️  节点 ${this.nodeId} 失去 Master 身份`.red)
                if (this.onLoseMaster) {
                    this.onLoseMaster()
                }
            }
            
            return false
        } catch (error) {
            console.error('[MasterElection] 获取Master锁失败:', error)
            this.isMaster = false
            return false
        }
    }

    /**
     * 启动心跳机制
     */
    startHeartbeat() {
        // 立即尝试获取锁
        this.tryAcquireLock()
        
        // 定期心跳续约
        this.heartbeatTimer = setInterval(async () => {
            await this.tryAcquireLock()
        }, this.renewInterval * 1000)
        
        // 定期清理过期的锁（只在Master节点执行）
        this.cleanupTimer = setInterval(async () => {
            if (this.isMaster) {
                try {
                    const cleaned = await MasterLockModel.cleanExpiredLocks()
                    if (cleaned > 0) {
                        console.log(`[MasterElection] 清理了 ${cleaned} 个过期锁`)
                    }
                } catch (error) {
                    console.error('[MasterElection] 清理过期锁失败:', error)
                }
            }
        }, 60 * 1000) // 每分钟清理一次
        
        // console.log(`[MasterElection] 心跳机制已启动，续约间隔: ${this.renewInterval}秒`.green)
    }

    /**
     * 停止心跳机制
     */
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
            this.heartbeatTimer = null
        }
        
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer)
            this.cleanupTimer = null
        }
        
        console.log(`[MasterElection] 心跳机制已停止`.yellow)
    }

    /**
     * 主动释放锁
     */
    async releaseLock() {
        if (this.isMaster) {
            try {
                await MasterLockModel.deleteLock(this.lockKey, this.nodeId)
                this.isMaster = false
                console.log(`[MasterElection] 节点 ${this.nodeId} 主动释放 Master 锁`.yellow)
            } catch (error) {
                console.error('[MasterElection] 释放锁失败:', error)
            }
        }
    }

    /**
     * 判断当前节点是否为Master
     * @returns {boolean}
     */
    isMasterNode() {
        return this.isMaster
    }

    /**
     * 获取当前Master信息
     * @returns {Promise<object|null>}
     */
    async getMasterInfo() {
        try {
            const lockInfo = await MasterLockModel.getLock(this.lockKey)
            if (lockInfo && new Date(lockInfo.expireTime) > new Date()) {
                return {
                    nodeId: lockInfo.nodeId,
                    nodeIp: lockInfo.nodeIp,
                    expireTime: lockInfo.expireTime,
                    isSelf: lockInfo.nodeId === this.nodeId
                }
            }
            return null
        } catch (error) {
            console.error('[MasterElection] 获取Master信息失败:', error)
            return null
        }
    }

    /**
     * 优雅关闭
     */
    async shutdown() {
        console.log(`[MasterElection] 节点 ${this.nodeId} 正在关闭...`.yellow)
        this.stopHeartbeat()
        await this.releaseLock()
        console.log(`[MasterElection] 节点 ${this.nodeId} 已关闭`.green)
    }
}

module.exports = MasterElection

