/**
 * 清理目标数据库脚本
 * 删除 webfunny_log_db_cluster 中的所有表
 */

const { createClient } = require('@clickhouse/client')

class DatabaseCleaner {
  constructor() {
    this.nodes = [
      {
        name: 'Replica1 (8.133.201.61)',
        host: 'http://8.133.201.61:8123',
        username: 'webfunny_user',
        password: 'das345jdlka@0976sfda'
      },
      {
        name: 'Replica2 (106.14.26.133)',
        host: 'http://106.14.26.133:8123',
        username: 'default',
        password: 'D-012qe889caJ_#23@1Ayu1j'
      }
    ]
    
    this.targetDatabase = 'webfunny_log_db_cluster'
  }
  
  /**
   * 获取数据库中的所有表
   */
  async getTables(client) {
    try {
      const result = await client.query({
        query: `
          SELECT name, engine
          FROM system.tables
          WHERE database = '${this.targetDatabase}'
            AND engine NOT LIKE 'System%'
          ORDER BY name
        `,
        format: 'JSONEachRow'
      })
      
      return await result.json()
    } catch (err) {
      console.error(`   ❌ 获取表列表失败: ${err.message}`)
      return []
    }
  }
  
  /**
   * 删除表
   */
  async dropTable(client, tableName) {
    try {
      await client.command({
        query: `DROP TABLE IF EXISTS ${this.targetDatabase}.${tableName}`
      })
      return true
    } catch (err) {
      console.error(`   ❌ 删除失败: ${err.message}`)
      return false
    }
  }
  
  /**
   * 清理单个节点
   */
  async cleanNode(node) {
    console.log(`\n${'━'.repeat(60)}`)
    console.log(`清理节点: ${node.name}`)
    console.log(`${'━'.repeat(60)}\n`)
    
    const client = createClient({
      host: node.host,
      username: node.username,
      password: node.password
    })
    
    try {
      // 1. 获取表列表
      console.log('1️⃣  获取表列表...')
      const tables = await this.getTables(client)
      
      if (tables.length === 0) {
        console.log('   ℹ️  数据库中没有表\n')
        return {
          node: node.name,
          total: 0,
          deleted: 0,
          failed: 0
        }
      }
      
      console.log(`   找到 ${tables.length} 个表\n`)
      
      // 2. 删除所有表
      console.log('2️⃣  删除表...')
      
      let deleted = 0
      let failed = 0
      
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i]
        const progress = Math.round(((i + 1) / tables.length) * 100)
        
        process.stdout.write(`\r   进度: [${i + 1}/${tables.length}] ${progress}% - ${table.name}`)
        
        const success = await this.dropTable(client, table.name)
        
        if (success) {
          deleted++
        } else {
          failed++
        }
      }
      
      console.log('\n')
      
      // 3. 验证删除结果
      console.log('3️⃣  验证...')
      const remainingTables = await this.getTables(client)
      
      if (remainingTables.length === 0) {
        console.log(`   ✅ 节点清理完成`)
      } else {
        console.log(`   ⚠️  还剩 ${remainingTables.length} 个表`)
      }
      
      console.log('')
      console.log(`   总计: ${tables.length} 个表`)
      console.log(`   成功: ${deleted} 个`)
      if (failed > 0) {
        console.log(`   失败: ${failed} 个`)
      }
      
      return {
        node: node.name,
        total: tables.length,
        deleted,
        failed
      }
      
    } catch (err) {
      console.error(`\n   ❌ 清理节点失败: ${err.message}\n`)
      return {
        node: node.name,
        total: 0,
        deleted: 0,
        failed: 0,
        error: err.message
      }
    } finally {
      await client.close()
    }
  }
  
  /**
   * 执行清理
   */
  async clean() {
    console.log(`\n目标数据库: ${this.targetDatabase}`)
    console.log(`节点数量: ${this.nodes.length}\n`)
    
    const results = []
    
    // 清理每个节点
    for (const node of this.nodes) {
      const result = await this.cleanNode(node)
      results.push(result)
    }
    
    // 等待 ZooKeeper 清理元数据
    console.log(`\n${'━'.repeat(60)}`)
    console.log('等待 ZooKeeper 清理元数据...')
    console.log(`${'━'.repeat(60)}\n`)
    
    for (let i = 3; i > 0; i--) {
      process.stdout.write(`\r   等待 ${i} 秒...`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    console.log('\r   ✅ 等待完成\n')
    
    // 输出总结
    this.printSummary(results)
    
    // 返回是否全部成功
    const allSuccess = results.every(r => r.failed === 0 && !r.error)
    return allSuccess
  }
  
  /**
   * 打印总结
   */
  printSummary(results) {
    console.log(`\n${'═'.repeat(60)}`)
    console.log('清理总结')
    console.log(`${'═'.repeat(60)}\n`)
    
    const totalTables = results.reduce((sum, r) => sum + r.total, 0)
    const totalDeleted = results.reduce((sum, r) => sum + r.deleted, 0)
    const totalFailed = results.reduce((sum, r) => sum + r.failed, 0)
    
    results.forEach(r => {
      const status = r.error ? '❌' : (r.failed === 0 ? '✅' : '⚠️')
      console.log(`${status} ${r.node}`)
      if (r.error) {
        console.log(`   错误: ${r.error}`)
      } else {
        console.log(`   删除: ${r.deleted}/${r.total} 个表`)
        if (r.failed > 0) {
          console.log(`   失败: ${r.failed} 个表`)
        }
      }
      console.log('')
    })
    
    console.log(`${'─'.repeat(60)}`)
    console.log(`总计:`)
    console.log(`  • 表数量: ${totalTables}`)
    console.log(`  • 成功删除: ${totalDeleted}`)
    if (totalFailed > 0) {
      console.log(`  • 删除失败: ${totalFailed}`)
    }
    console.log('')
    
    if (totalFailed === 0) {
      console.log(`✅ 所有表已成功清理！`)
    } else {
      console.log(`⚠️  部分表清理失败`)
    }
  }
}

// 执行清理
if (require.main === module) {
  const cleaner = new DatabaseCleaner()
  
  cleaner.clean()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(err => {
      console.error('\n清理过程发生错误:', err.message)
      process.exit(1)
    })
}

module.exports = DatabaseCleaner

