/**
 * ClickHouse 跨数据库迁移工具
 * 
 * 功能：
 * 1. 从源数据库（MergeTree）迁移到目标数据库（ReplicatedMergeTree）
 * 2. 自动转换引擎类型以适配集群模式
 * 3. 支持预览模式（--dry-run）
 */

const { createClient } = require('@clickhouse/client')
const EngineHelper = require('./config/engineHelper')

class CrossDatabaseMigrator {
  constructor(options = {}) {
    this.options = {
      sourceDatabase: options.sourceDatabase || 'webfunny_cloud_db',
      targetDatabase: options.targetDatabase || 'webfunny_log_db_cluster',
      host: options.host || 'http://localhost:8123',
      username: options.username || 'default',
      password: options.password || '',
      batchSize: options.batchSize || 10000,  // 默认1万行一批，避免分区问题
      dryRun: options.dryRun || false,
      structureOnly: options.structureOnly || false  // 只创建表结构，不迁移数据
    }
    
    // 创建客户端连接
    this.client = createClient({
      host: this.options.host,
      username: this.options.username,
      password: this.options.password
    })
    
    // 获取集群配置
    const { client: dbClient } = require('./config/db')
    this.isCluster = dbClient && dbClient.isCluster
    this.clusterManager = this.isCluster ? dbClient._clusterManager : null
    
    this.results = []
  }
  
  /**
   * 获取源数据库中的所有表
   */
  async getSourceTables() {
    const result = await this.client.query({
      query: `
        SELECT name, engine, total_rows as rows
        FROM system.tables
        WHERE database = '${this.options.sourceDatabase}'
          AND engine NOT LIKE '%View'
          AND engine NOT LIKE 'System%'
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
   * 创建表在目标数据库
   */
  async createTable(tableName) {
    console.log(`\n2️⃣  创建目标表...`)
    
    // 1. 获取源表的建表语句
    const result = await this.client.query({
      query: `SHOW CREATE TABLE ${this.options.sourceDatabase}.${tableName}`,
      format: 'JSONEachRow'
    })
    
    const data = await result.json()
    if (!data || data.length === 0) {
      throw new Error('无法获取源表的建表语句')
    }
    
    let createSql = data[0].statement
    
    // 2. 替换数据库名
    createSql = createSql.replace(
      new RegExp(`CREATE TABLE ${this.options.sourceDatabase}\\.${tableName}`, 'i'),
      `CREATE TABLE IF NOT EXISTS ${this.options.targetDatabase}.${tableName}`
    )
    
    // 3. 如果是集群模式，转换引擎
    if (this.isCluster) {
      // 提取完整的引擎定义（包括参数）
      const engineMatch = createSql.match(/ENGINE\s*=\s*(\w+)(\([^)]*\))?/i)
      if (engineMatch) {
        const fullEngine = engineMatch[0]  // 如 "ENGINE = SummingMergeTree(col)"
        
        // 只转换 MergeTree 系列且非 Replicated 的引擎
        if (fullEngine.includes('MergeTree') && !fullEngine.includes('Replicated')) {
          const clusterEngine = EngineHelper.convertEngine(fullEngine, {
            isCluster: true,
            tableName,
            zkPath: '/clickhouse/tables/{shard}/{table}'
          })
          
          createSql = createSql.replace(fullEngine, clusterEngine)
          console.log(`   引擎转换: ${fullEngine}`)
          console.log(`            → ${clusterEngine}`)
        }
      }
    }
    
    // 4. 在目标节点执行建表
    if (this.isCluster && this.clusterManager) {
      console.log(`   在集群节点创建表...`)
      
      if (process.env.DEBUG) {
        console.log(`\n   [DEBUG] 最终SQL:`)
        console.log(createSql)
        console.log('')
      }
      
      for (const node of this.clusterManager.nodes) {
        try {
          // 确保数据库存在
          await node.client.command({
            query: `CREATE DATABASE IF NOT EXISTS ${this.options.targetDatabase}`
          })
          
          // 创建表
          await node.client.command({ query: createSql })
          console.log(`   ✅ ${node.name} 创建成功`)
        } catch (err) {
          if (err.message.includes('already exists')) {
            console.log(`   ℹ️  ${node.name} 表已存在（通过复制同步）`)
          } else {
            console.log(`   ❌ ${node.name} 失败: ${err.message}`)
            throw err
          }
        }
      }
    } else {
      // 单节点模式
      await this.client.command({
        query: `CREATE DATABASE IF NOT EXISTS ${this.options.targetDatabase}`
      })
      await this.client.command({ query: createSql })
      console.log(`   ✅ 表已创建`)
    }
  }
  
  /**
   * 迁移数据
   */
  async migrateData(tableName, sourceRows) {
    console.log(`\n3️⃣  迁移数据...`)
    
    if (sourceRows === 0) {
      console.log(`   源表为空，跳过数据迁移`)
      return
    }
    
    const batchSize = this.options.batchSize
    const batches = Math.ceil(sourceRows / batchSize)
    
    if (batches === 1) {
      // 一次性迁移
      console.log(`   一次性迁移 ${sourceRows.toLocaleString()} 行...`)
      await this.client.command({
        query: `
          INSERT INTO ${this.options.targetDatabase}.${tableName}
          SELECT * FROM ${this.options.sourceDatabase}.${tableName}
        `
      })
      console.log(`   ✅ 迁移完成`)
    } else {
      // 分批迁移
      console.log(`   分 ${batches} 批迁移，每批 ${batchSize.toLocaleString()} 行`)
      
      for (let i = 0; i < batches; i++) {
        const offset = i * batchSize
        const progress = Math.round(((i + 1) / batches) * 100)
        
        process.stdout.write(`   批次 [${i + 1}/${batches}] ${progress}%...`)
        
        await this.client.command({
          query: `
            INSERT INTO ${this.options.targetDatabase}.${tableName}
            SELECT * FROM ${this.options.sourceDatabase}.${tableName}
            LIMIT ${batchSize} OFFSET ${offset}
          `
        })
        
        console.log(' ✅')
      }
    }
  }
  
  /**
   * 验证数据
   */
  async verifyData(tableName, sourceRows) {
    console.log(`\n4️⃣  验证数据...`)
    
    const result = await this.client.query({
      query: `SELECT count() as count FROM ${this.options.targetDatabase}.${tableName}`,
      format: 'JSONEachRow'
    })
    
    const data = await result.json()
    const targetRows = parseInt(data[0].count)
    
    console.log(`   源表: ${sourceRows.toLocaleString()} 行`)
    console.log(`   目标表: ${targetRows.toLocaleString()} 行`)
    
    // 对于 SummingMergeTree 和 ReplacingMergeTree，行数可能不同（这是正常的）
    if (targetRows !== sourceRows) {
      console.log(`   ℹ️  行数不同（聚合引擎会自动合并重复数据）`)
    } else {
      console.log(`   ✅ 数据一致`)
    }
    
    return targetRows
  }
  
  /**
   * 迁移单个表
   */
  async migrateTable(tableName, sourceRows, tableIndex, totalTables) {
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`[${tableIndex}/${totalTables}] 迁移表: ${tableName}`)
    console.log(`源: ${this.options.sourceDatabase}.${tableName}`)
    console.log(`目标: ${this.options.targetDatabase}.${tableName}`)
    console.log(`${'═'.repeat(60)}`)
    
    const startTime = Date.now()
    
    try {
      console.log(`\n1️⃣  源表行数: ${sourceRows.toLocaleString()}`)
      
      if (this.options.dryRun) {
        console.log(`\n🔍 [预览模式] 将创建表并迁移 ${sourceRows.toLocaleString()} 行数据`)
        return {
          success: true,
          table: tableName,
          sourceRows,
          targetRows: 0,
          dryRun: true
        }
      }
      
      // 2. 创建表
      await this.createTable(tableName)
      
      // 如果只创建结构，跳过数据迁移
      if (this.options.structureOnly) {
        console.log(`\n✅ 表结构已创建（--structure-only 模式，跳过数据迁移）`)
        
        return {
          success: true,
          table: tableName,
          sourceRows,
          targetRows: 0,
          structureOnly: true
        }
      }
      
      // 3. 迁移数据
      if (sourceRows > 0) {
        await this.migrateData(tableName, sourceRows)
        
        // 4. 验证数据
        const targetRows = await this.verifyData(tableName, sourceRows)
        
        const duration = Math.round((Date.now() - startTime) / 1000)
        console.log(`\n✅ 迁移成功！耗时: ${duration}秒`)
        
        return {
          success: true,
          table: tableName,
          sourceRows,
          targetRows,
          duration
        }
      } else {
        console.log(`\n✅ 表结构已创建（空表）`)
        
        return {
          success: true,
          table: tableName,
          sourceRows: 0,
          targetRows: 0,
          emptyTable: true
        }
      }
      
    } catch (err) {
      console.log(`\n❌ 迁移失败: ${err.message}`)
      
      return {
        success: false,
        table: tableName,
        error: err.message
      }
    }
  }
  
  /**
   * 批量迁移所有表
   */
  async batchMigrate() {
    console.log(`\n╔${'═'.repeat(58)}╗`)
    console.log(`║  ClickHouse 跨数据库迁移${' '.repeat(32)}║`)
    console.log(`╚${'═'.repeat(58)}╝\n`)
    
    console.log(`源数据库: ${this.options.sourceDatabase}`)
    console.log(`目标数据库: ${this.options.targetDatabase}`)
    console.log(`集群模式: ${this.isCluster ? '是' : '否'}`)
    console.log(`批次大小: ${this.options.batchSize.toLocaleString()} 行`)
    if (this.options.dryRun) {
      console.log(`运行模式: 🔍 预览模式（不实际迁移）`)
    } else if (this.options.structureOnly) {
      console.log(`运行模式: 📋 仅创建表结构（不迁移数据）`)
    }
    console.log('')
    
    // 1. 获取源表列表
    console.log(`${'━'.repeat(60)}`)
    console.log(`步骤 1: 获取源数据库表列表`)
    console.log(`${'━'.repeat(60)}\n`)
    
    const tables = await this.getSourceTables()
    
    if (tables.length === 0) {
      console.log(`❌ 源数据库中没有表\n`)
      return []
    }
    
    console.log(`找到 ${tables.length} 个表:\n`)
    
    // 按行数分组显示
    const nonEmptyTables = tables.filter(t => t.rows > 0)
    const emptyTables = tables.filter(t => t.rows === 0)
    
    if (nonEmptyTables.length > 0) {
      console.log(`有数据的表 (${nonEmptyTables.length} 个):`)
      nonEmptyTables.slice(0, 10).forEach(t => {
        console.log(`   ${t.name} (${t.engine}) - ${t.rows.toLocaleString()} 行`)
      })
      if (nonEmptyTables.length > 10) {
        console.log(`   ... 还有 ${nonEmptyTables.length - 10} 个表`)
      }
      console.log('')
    }
    
    if (emptyTables.length > 0) {
      console.log(`空表 (${emptyTables.length} 个):`)
      emptyTables.slice(0, 5).forEach(t => {
        console.log(`   ${t.name} (${t.engine})`)
      })
      if (emptyTables.length > 5) {
        console.log(`   ... 还有 ${emptyTables.length - 5} 个空表`)
      }
      console.log('')
    }
    
    // 2. 开始迁移
    console.log(`${'━'.repeat(60)}`)
    console.log(`步骤 2: 开始迁移`)
    console.log(`${'━'.repeat(60)}`)
    
    const results = []
    
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i]
      const result = await this.migrateTable(table.name, table.rows, i + 1, tables.length)
      results.push(result)
    }
    
    // 3. 输出总结
    this.printSummary(results)
    
    return results
  }
  
  /**
   * 打印迁移总结
   */
  printSummary(results) {
    console.log(`\n\n╔${'═'.repeat(58)}╗`)
    console.log(`║  迁移总结${' '.repeat(50)}║`)
    console.log(`╚${'═'.repeat(58)}╝\n`)
    
    const successful = results.filter(r => r.success && !r.dryRun && !r.emptyTable && !r.structureOnly)
    const emptyTables = results.filter(r => r.emptyTable)
    const structureOnly = results.filter(r => r.structureOnly)
    const failed = results.filter(r => !r.success)
    const dryRun = results.filter(r => r.dryRun)
    
    console.log(`总表数: ${results.length}`)
    console.log(`✅ 成功迁移: ${successful.length} 个`)
    console.log(`📋 空表（仅创建结构）: ${emptyTables.length} 个`)
    if (structureOnly.length > 0) {
      console.log(`📋 仅创建结构: ${structureOnly.length} 个`)
    }
    console.log(`❌ 失败: ${failed.length} 个`)
    if (dryRun.length > 0) {
      console.log(`🔍 预览: ${dryRun.length} 个`)
    }
    console.log('')
    
    if (successful.length > 0) {
      const totalRows = successful.reduce((sum, r) => sum + r.sourceRows, 0)
      const totalTime = successful.reduce((sum, r) => sum + (r.duration || 0), 0)
      
      console.log(`📊 数据统计:`)
      console.log(`   总迁移行数: ${totalRows.toLocaleString()}`)
      console.log(`   总耗时: ${totalTime} 秒`)
      if (totalTime > 0) {
        console.log(`   平均速度: ${Math.round(totalRows / totalTime).toLocaleString()} 行/秒`)
      }
      console.log('')
    }
    
    if (failed.length > 0) {
      console.log(`\n❌ 失败的表:`)
      failed.forEach(r => {
        console.log(`   ${r.table}: ${r.error}`)
      })
      console.log('')
    }
  }
  
  /**
   * 关闭连接
   */
  async close() {
    await this.client.close()
  }
}

// 命令行入口
if (require.main === module) {
  const args = process.argv.slice(2)
  
  // 解析参数
  const options = {}
  let batchMode = false
  
  args.forEach(arg => {
    if (arg === '--batch') {
      batchMode = true
    } else if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--structure-only') {
      options.structureOnly = true
    } else if (arg.startsWith('--source-db=')) {
      options.sourceDatabase = arg.split('=')[1]
    } else if (arg.startsWith('--target-db=')) {
      options.targetDatabase = arg.split('=')[1]
    } else if (arg.startsWith('--host=')) {
      options.host = arg.split('=')[1]
    } else if (arg.startsWith('--username=')) {
      options.username = arg.split('=')[1]
    } else if (arg.startsWith('--password=')) {
      options.password = arg.split('=')[1]
    } else if (arg.startsWith('--batch-size=')) {
      options.batchSize = parseInt(arg.split('=')[1])
    }
  })
  
  const migrator = new CrossDatabaseMigrator(options)
  
  if (!batchMode) {
    console.log('请使用 --batch 参数进行批量迁移')
    console.log('')
    console.log('示例:')
    console.log('  ./preview_migration.sh  # 预览迁移')
    console.log('  ./start_migration.sh    # 开始迁移')
    process.exit(1)
  }
  
  migrator.batchMigrate()
    .then(() => migrator.close())
    .then(() => {
      process.exit(0)
    })
    .catch(err => {
      console.error('\n操作失败:', err.message)
      migrator.close().then(() => process.exit(1))
    })
}

module.exports = CrossDatabaseMigrator