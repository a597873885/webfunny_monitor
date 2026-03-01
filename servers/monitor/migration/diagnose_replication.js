/**
 * ClickHouse 集群复制诊断工具
 * 
 * 功能：
 * 1. 检查两个节点的表引擎
 * 2. 检查两个节点的数据行数
 * 3. 检查 ZooKeeper 配置
 * 4. 诊断复制问题并提供解决方案
 */

const { createClient } = require('@clickhouse/client')

class ReplicationDiagnoser {
  constructor() {
    // 加载配置
    try {
      const config = require('./migration.config.js')
      this.config = config
      
      // 需要两个节点配置来检查复制
      this.node1 = {
        host: config.source?.host || config.target?.host,
        username: config.source?.username || config.target?.username,
        password: config.source?.password || config.target?.password,
        database: config.target?.database
      }
      
      // 如果配置了第二个目标节点
      if (config.target2) {
        this.node2 = {
          host: config.target2.host,
          username: config.target2.username,
          password: config.target2.password,
          database: config.target2.database
        }
      } else {
        // 尝试从应用配置加载
        try {
          const { client } = require('../config/local_db')
          if (client && client._clusterManager) {
            const nodes = client._clusterManager.nodes
            if (nodes.length >= 2) {
              this.node1 = {
                host: `http://${nodes[0].ip}:${nodes[0].port}`,
                username: nodes[0].userName,
                password: nodes[0].password,
                database: nodes[0].dataBaseName
              }
              this.node2 = {
                host: `http://${nodes[1].ip}:${nodes[1].port}`,
                username: nodes[1].userName,
                password: nodes[1].password,
                database: nodes[1].dataBaseName
              }
              console.log('✅ 从应用配置加载了集群节点信息')
            }
          }
        } catch (err) {
          console.log('⚠️  无法从应用配置加载集群信息')
        }
      }
      
      if (!this.node2) {
        throw new Error('需要配置两个节点才能诊断复制问题')
      }
      
    } catch (err) {
      throw new Error(`配置加载失败: ${err.message}`)
    }
    
    // 创建客户端
    this.client1 = createClient({
      host: this.node1.host,
      username: this.node1.username,
      password: this.node1.password
    })
    
    this.client2 = createClient({
      host: this.node2.host,
      username: this.node2.username,
      password: this.node2.password
    })
  }
  
  /**
   * 获取数据库中的所有表
   */
  async getTables(client, database) {
    const result = await client.query({
      query: `
        SELECT name, engine, total_rows as rows
        FROM system.tables
        WHERE database = '${database}'
          AND engine LIKE '%MergeTree%'
        ORDER BY name
      `,
      format: 'JSONEachRow'
    })
    
    const tables = await result.json()
    return tables.map(t => ({
      name: t.name,
      engine: t.engine,
      rows: parseInt(t.rows) || 0
    }))
  }
  
  /**
   * 获取表的建表语句
   */
  async getCreateTable(client, database, table) {
    try {
      const result = await client.query({
        query: `SHOW CREATE TABLE ${database}.${table}`,
        format: 'JSONEachRow'
      })
      
      const data = await result.json()
      return data[0]?.statement || ''
    } catch (err) {
      return `错误: ${err.message}`
    }
  }
  
  /**
   * 检查 ZooKeeper 配置
   */
  async checkZooKeeper(client) {
    try {
      const result = await client.query({
        query: `SELECT * FROM system.zookeeper WHERE path = '/'`,
        format: 'JSONEachRow'
      })
      
      await result.json()
      return true
    } catch (err) {
      return false
    }
  }
  
  /**
   * 检查宏配置
   */
  async getMacros(client) {
    try {
      const result = await client.query({
        query: `SELECT macro, substitution FROM system.macros`,
        format: 'JSONEachRow'
      })
      
      const data = await result.json()
      const macros = {}
      data.forEach(row => {
        macros[row.macro] = row.substitution
      })
      return macros
    } catch (err) {
      return null
    }
  }
  
  /**
   * 执行诊断
   */
  async diagnose() {
    console.log(`\n╔${'═'.repeat(58)}╗`)
    console.log(`║  ClickHouse 集群复制诊断${' '.repeat(32)}║`)
    console.log(`╚${'═'.repeat(58)}╝\n`)
    
    console.log(`节点1: ${this.node1.host}`)
    console.log(`节点2: ${this.node2.host}`)
    console.log(`数据库: ${this.node1.database}\n`)
    
    const issues = []
    
    // 1. 检查 ZooKeeper
    console.log(`${'━'.repeat(60)}`)
    console.log(`1. 检查 ZooKeeper 配置`)
    console.log(`${'━'.repeat(60)}\n`)
    
    const zk1 = await this.checkZooKeeper(this.client1)
    const zk2 = await this.checkZooKeeper(this.client2)
    
    console.log(`节点1 ZooKeeper: ${zk1 ? '✅ 连接正常' : '❌ 连接失败'}`)
    console.log(`节点2 ZooKeeper: ${zk2 ? '✅ 连接正常' : '❌ 连接失败'}\n`)
    
    if (!zk1 || !zk2) {
      issues.push({
        type: 'critical',
        title: 'ZooKeeper 连接失败',
        description: 'ReplicatedMergeTree 需要 ZooKeeper 来协调复制',
        solution: '请在 ClickHouse 配置文件中配置 ZooKeeper 连接'
      })
    }
    
    // 2. 检查宏配置
    console.log(`${'━'.repeat(60)}`)
    console.log(`2. 检查宏配置（{shard}, {replica}）`)
    console.log(`${'━'.repeat(60)}\n`)
    
    const macros1 = await this.getMacros(this.client1)
    const macros2 = await this.getMacros(this.client2)
    
    console.log(`节点1 宏配置:`)
    if (macros1) {
      console.log(`   shard: ${macros1.shard || '❌ 未配置'}`)
      console.log(`   replica: ${macros1.replica || '❌ 未配置'}`)
    } else {
      console.log(`   ❌ 无法获取宏配置`)
    }
    
    console.log(`\n节点2 宏配置:`)
    if (macros2) {
      console.log(`   shard: ${macros2.shard || '❌ 未配置'}`)
      console.log(`   replica: ${macros2.replica || '❌ 未配置'}`)
    } else {
      console.log(`   ❌ 无法获取宏配置`)
    }
    console.log('')
    
    if (!macros1?.shard || !macros1?.replica || !macros2?.shard || !macros2?.replica) {
      issues.push({
        type: 'critical',
        title: '宏配置缺失',
        description: 'ReplicatedMergeTree 需要 {shard} 和 {replica} 宏',
        solution: '在 ClickHouse 配置文件的 <macros> 部分添加 shard 和 replica'
      })
    }
    
    // 3. 检查表引擎和数据
    console.log(`${'━'.repeat(60)}`)
    console.log(`3. 检查表引擎和数据同步`)
    console.log(`${'━'.repeat(60)}\n`)
    
    const tables1 = await this.getTables(this.client1, this.node1.database)
    const tables2 = await this.getTables(this.client2, this.node2.database)
    
    console.log(`节点1 表数量: ${tables1.length}`)
    console.log(`节点2 表数量: ${tables2.length}\n`)
    
    if (tables1.length !== tables2.length) {
      issues.push({
        type: 'warning',
        title: '表数量不一致',
        description: `节点1有${tables1.length}个表，节点2有${tables2.length}个表`,
        solution: '确保在两个节点都创建了表'
      })
    }
    
    // 对比每个表
    const tableMap2 = {}
    tables2.forEach(t => {
      tableMap2[t.name] = t
    })
    
    console.log(`表对比:\n`)
    console.log(`${'表名'.padEnd(40)} | ${'节点1'.padEnd(15)} | ${'节点2'.padEnd(15)} | 状态`)
    console.log(`${'-'.repeat(90)}`)
    
    for (const table1 of tables1) {
      const table2 = tableMap2[table1.name]
      
      if (!table2) {
        console.log(`${table1.name.padEnd(40)} | ${table1.rows.toString().padEnd(15)} | ${'不存在'.padEnd(15)} | ❌`)
        issues.push({
          type: 'error',
          title: `表 ${table1.name} 只存在于节点1`,
          description: '表未在节点2创建',
          solution: `在节点2执行建表语句，或使用迁移工具重新创建`
        })
        continue
      }
      
      // 检查引擎
      const isReplicated1 = table1.engine.includes('Replicated')
      const isReplicated2 = table2.engine.includes('Replicated')
      
      if (!isReplicated1 || !isReplicated2) {
        console.log(`${table1.name.padEnd(40)} | ${table1.rows.toString().padEnd(15)} | ${table2.rows.toString().padEnd(15)} | ⚠️  非复制引擎`)
        issues.push({
          type: 'warning',
          title: `表 ${table1.name} 不是 ReplicatedMergeTree`,
          description: `节点1: ${table1.engine}, 节点2: ${table2.engine}`,
          solution: '使用 ALTER TABLE 转换为 ReplicatedMergeTree，或重新创建表'
        })
        continue
      }
      
      // 检查数据
      if (table1.rows !== table2.rows) {
        console.log(`${table1.name.padEnd(40)} | ${table1.rows.toString().padEnd(15)} | ${table2.rows.toString().padEnd(15)} | ❌ 数据不同步`)
        issues.push({
          type: 'error',
          title: `表 ${table1.name} 数据不同步`,
          description: `节点1: ${table1.rows}行, 节点2: ${table2.rows}行`,
          solution: '检查复制队列，或使用 SYSTEM SYNC REPLICA 命令同步'
        })
      } else {
        console.log(`${table1.name.padEnd(40)} | ${table1.rows.toString().padEnd(15)} | ${table2.rows.toString().padEnd(15)} | ✅`)
      }
    }
    
    // 4. 输出问题总结和解决方案
    this.printSummary(issues)
    
    return issues
  }
  
  /**
   * 打印问题总结
   */
  printSummary(issues) {
    console.log(`\n\n╔${'═'.repeat(58)}╗`)
    console.log(`║  问题总结和解决方案${' '.repeat(38)}║`)
    console.log(`╚${'═'.repeat(58)}╝\n`)
    
    if (issues.length === 0) {
      console.log(`✅ 未发现问题，集群复制工作正常！\n`)
      return
    }
    
    const critical = issues.filter(i => i.type === 'critical')
    const errors = issues.filter(i => i.type === 'error')
    const warnings = issues.filter(i => i.type === 'warning')
    
    console.log(`发现 ${issues.length} 个问题:`)
    console.log(`   ⛔ 严重: ${critical.length} 个`)
    console.log(`   ❌ 错误: ${errors.length} 个`)
    console.log(`   ⚠️  警告: ${warnings.length} 个\n`)
    
    // 显示严重问题
    if (critical.length > 0) {
      console.log(`\n⛔ 严重问题（必须修复）:\n`)
      critical.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.title}`)
        console.log(`   ${issue.description}`)
        console.log(`   💡 解决方案: ${issue.solution}\n`)
      })
    }
    
    // 显示错误
    if (errors.length > 0) {
      console.log(`\n❌ 错误:\n`)
      errors.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.title}`)
        console.log(`   ${issue.description}`)
        console.log(`   💡 解决方案: ${issue.solution}\n`)
      })
    }
    
    // 显示警告
    if (warnings.length > 0) {
      console.log(`\n⚠️  警告:\n`)
      warnings.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.title}`)
        console.log(`   ${issue.description}`)
        console.log(`   💡 解决方案: ${issue.solution}\n`)
      })
    }
    
    // 通用修复建议
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`常见修复方法:`)
    console.log(`${'═'.repeat(60)}\n`)
    
    console.log(`1. 配置 ZooKeeper（如果未配置）`)
    console.log(`   编辑 /etc/clickhouse-server/config.xml:`)
    console.log(`   <zookeeper>`)
    console.log(`       <node>`)
    console.log(`           <host>zookeeper地址</host>`)
    console.log(`           <port>2181</port>`)
    console.log(`       </node>`)
    console.log(`   </zookeeper>\n`)
    
    console.log(`2. 配置宏（{shard}, {replica}）`)
    console.log(`   编辑 /etc/clickhouse-server/config.xml:`)
    console.log(`   <macros>`)
    console.log(`       <shard>01</shard>`)
    console.log(`       <replica>replica1</replica>  <!-- 节点1 -->`)
    console.log(`       <!-- 或 replica2 for 节点2 -->`)
    console.log(`   </macros>\n`)
    
    console.log(`3. 手动同步复制（如果数据不一致）`)
    console.log(`   在数据少的节点执行:`)
    console.log(`   SYSTEM SYNC REPLICA 数据库.表名;\n`)
    
    console.log(`4. 重新创建表（如果引擎不正确）`)
    console.log(`   使用迁移工具重新执行:`)
    console.log(`   ./start_cross_server_migration.sh\n`)
  }
  
  /**
   * 关闭连接
   */
  async close() {
    await this.client1.close()
    await this.client2.close()
  }
}

// 命令行入口
if (require.main === module) {
  const diagnoser = new ReplicationDiagnoser()
  
  diagnoser.diagnose()
    .then(() => diagnoser.close())
    .then(() => {
      console.log('')
      process.exit(0)
    })
    .catch(err => {
      console.error('\n诊断失败:', err.message)
      console.error('\n💡 提示: 确保 migration.config.js 中配置了两个节点，或应用配置中启用了集群模式')
      process.exit(1)
    })
}

module.exports = ReplicationDiagnoser

