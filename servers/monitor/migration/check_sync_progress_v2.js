/**
 * 检查复制队列进度（使用配置文件）
 */

const { createClient } = require('@clickhouse/client')

async function checkProgress() {
  const config = require('./migration.config.js')
  
  const node2 = {
    host: config.target2.host,
    username: config.target2.username,
    password: config.target2.password
  }
  
  const database = config.target2.database
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`检查节点2复制队列状态`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
  
  const client = createClient({
    host: node2.host,
    username: node2.username,
    password: node2.password
  })
  
  try {
    // 检查复制队列
    const result = await client.query({
      query: `SELECT count() as queue_size FROM system.replication_queue WHERE database = '${database}'`,
      format: 'JSONEachRow'
    })
    
    const data = await result.json()
    const queueSize = data[0].queue_size
    
    console.log(`当前队列大小: ${queueSize}\n`)
    
    if (queueSize === '0' || queueSize === 0) {
      console.log(`✅ 复制队列已清空，数据应该已同步！\n`)
      console.log(`运行完整诊断工具确认:`)
      console.log(`node diagnose_replication.js\n`)
      return true
    } else {
      console.log(`⏳ 还有 ${queueSize} 个任务在处理中\n`)
      
      // 显示前5个任务的表
      const tablesResult = await client.query({
        query: `
          SELECT 
            table,
            count() as tasks,
            max(last_exception) as last_error
          FROM system.replication_queue 
          WHERE database = '${database}'
          GROUP BY table
          ORDER BY tasks DESC
          LIMIT 5
        `,
        format: 'JSONEachRow'
      })
      
      const tables = await tablesResult.json()
      
      if (tables.length > 0) {
        console.log(`任务最多的表:`)
        tables.forEach(t => {
          console.log(`  - ${t.table}: ${t.tasks} 个任务`)
          if (t.last_error) {
            const errorPreview = t.last_error.substring(0, 100)
            console.log(`    最后错误: ${errorPreview}...`)
          }
        })
        console.log('')
      }
      
      console.log(`如果10分钟后队列仍不减少，请检查:`)
      console.log(`1. 是否已在节点2添加主机名映射`)
      console.log(`2. 能否 ping 通 d0d1c46ac5c6`)
      console.log(`3. 查看详细状态: node check_replication_status.js\n`)
      
      return false
    }
    
  } catch (err) {
    console.error(`❌ 检查失败: ${err.message}\n`)
    return false
  } finally {
    await client.close()
  }
}

checkProgress()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch(err => {
    console.error('\n检查失败:', err.message)
    process.exit(1)
  })

