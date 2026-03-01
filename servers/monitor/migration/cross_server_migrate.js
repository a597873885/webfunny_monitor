/**
 * ClickHouse 跨服务器数据库迁移工具
 * 
 * 功能：
 * 1. 支持从服务器A的数据库迁移到服务器B的数据库
 * 2. 自动转换引擎类型以适配集群模式
 * 3. 支持预览模式（--dry-run）
 * 4. 支持仅创建表结构模式（--structure-only）
 */

const { createClient } = require('@clickhouse/client')
const EngineHelper = require('../config/engineHelper')

class CrossServerMigrator {
  constructor(options = {}) {
    this.options = {
      // 源服务器配置
      sourceHost: options.sourceHost || 'http://localhost:8123',
      sourceUsername: options.sourceUsername || 'default',
      sourcePassword: options.sourcePassword || '',
      sourceDatabase: options.sourceDatabase || 'webfunny_cloud_db',
      
      // 目标服务器配置
      targetHost: options.targetHost || 'http://localhost:8123',
      targetUsername: options.targetUsername || 'default',
      targetPassword: options.targetPassword || '',
      targetDatabase: options.targetDatabase || 'webfunny_cloud_db_cluster',
      
      // 迁移配置
      batchSize: options.batchSize || 10000,
      dryRun: options.dryRun || false,
      structureOnly: options.structureOnly || false
    }
    
    // 创建源服务器客户端
    this.sourceClient = createClient({
      host: this.options.sourceHost,
      username: this.options.sourceUsername,
      password: this.options.sourcePassword
    })
    
    // 创建目标服务器客户端
    this.targetClient = createClient({
      host: this.options.targetHost,
      username: this.options.targetUsername,
      password: this.options.targetPassword
    })
    
    // 检查是否为跨服务器迁移
    this.isCrossServer = this.options.sourceHost !== this.options.targetHost
    
    // 获取集群配置（仅用于目标服务器）
    // 优先级：1. 配置文件 > 2. 自动检测
    if (options.isCluster !== undefined) {
      // 使用配置文件中明确指定的值
      this.isCluster = options.isCluster
      this.clusterManager = null
      
      if (this.isCluster) {
        console.log(`[集群模式] 配置文件指定为集群模式，将自动转换引擎为 ReplicatedMergeTree`)
        
        // 尝试加载集群管理器（如果配置了的话）
        try {
          const { client: dbClient } = require('../config/local_db')
          if (dbClient && dbClient._clusterManager) {
            this.clusterManager = dbClient._clusterManager
            console.log(`   ✅ 已加载集群管理器，支持多节点创建表`)
          }
        } catch (err) {
          console.log(`   ℹ️  未加载集群管理器，将在主节点创建表`)
        }
      } else {
        console.log(`[单节点模式] 配置文件指定为单节点模式，使用普通 MergeTree 引擎`)
      }
    } else {
      // 自动检测集群配置
      try {
        const { client: dbClient } = require('../config/local_db')
        this.isCluster = dbClient && dbClient.isCluster
        this.clusterManager = this.isCluster ? dbClient._clusterManager : null
        
        if (this.isCluster) {
          console.log(`[集群模式] 自动检测到集群配置，将自动转换引擎为 ReplicatedMergeTree`)
        } else {
          console.log(`[单节点模式] 自动检测为单节点模式，使用普通 MergeTree 引擎`)
        }
      } catch (err) {
        // 如果无法加载集群配置，默认非集群模式
        console.log(`[单节点模式] 无法检测集群配置，使用普通 MergeTree 引擎`)
        this.isCluster = false
        this.clusterManager = null
      }
    }
    
    this.results = []
  }
  
  /**
   * 获取源数据库中的所有表
   */
  async getSourceTables() {
    const result = await this.sourceClient.query({
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
    
    // 1. 从源服务器获取建表语句
    const result = await this.sourceClient.query({
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
      const engineMatch = createSql.match(/ENGINE\s*=\s*(\w+)(\([^)]*\))?/i)
      if (engineMatch) {
        const fullEngine = engineMatch[0]
        
        // 只转换 MergeTree 系列且非 Replicated 的引擎
        if (fullEngine.includes('MergeTree') && !fullEngine.includes('Replicated')) {
          const clusterEngine = EngineHelper.convertEngine(fullEngine, {
            isCluster: true,
            tableName,
            databaseName: this.options.targetDatabase,  // 传递数据库名
            zkPath: '/clickhouse/tables/{database}/{shard}/{table}'  // 使用完整路径
          })
          
          createSql = createSql.replace(fullEngine, clusterEngine)
          console.log(`   引擎转换: ${fullEngine}`)
          console.log(`            → ${clusterEngine}`)
        }
      }
    }
    
    // 4. 在目标服务器执行建表
    if (this.isCluster && this.clusterManager) {
      console.log(`   在集群节点创建表...`)
      
      if (process.env.DEBUG) {
        console.log(`\n   [DEBUG] 最终SQL:`)
        console.log(createSql)
        console.log('')
      }
      
      for (const node of this.clusterManager.nodes) {
        try {
          await node.client.command({
            query: `CREATE DATABASE IF NOT EXISTS ${this.options.targetDatabase}`
          })
          
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
      // 单节点模式或跨服务器
      await this.targetClient.command({
        query: `CREATE DATABASE IF NOT EXISTS ${this.options.targetDatabase}`
      })
      await this.targetClient.command({ query: createSql })
      console.log(`   ✅ 表已创建`)
    }
  }
  
  /**
   * 迁移数据（跨服务器）
   */
  async migrateData(tableName, sourceRows) {
    console.log(`\n3️⃣  迁移数据...`)
    
    if (sourceRows === 0) {
      console.log(`   源表为空，跳过数据迁移`)
      return
    }
    
    const batchSize = this.options.batchSize
    const batches = Math.ceil(sourceRows / batchSize)
    
    console.log(`   迁移模式: ${this.isCrossServer ? '跨服务器' : '同服务器'}`)
    
    if (this.isCrossServer) {
      // 跨服务器：需要读取数据后插入
      console.log(`   分 ${batches} 批迁移，每批 ${batchSize.toLocaleString()} 行`)
      
      for (let i = 0; i < batches; i++) {
        const offset = i * batchSize
        const progress = Math.round(((i + 1) / batches) * 100)
        
        process.stdout.write(`   批次 [${i + 1}/${batches}] ${progress}%...`)
        
        try {
          // 从源服务器读取数据
          const result = await this.sourceClient.query({
            query: `
              SELECT * FROM ${this.options.sourceDatabase}.${tableName}
              LIMIT ${batchSize} OFFSET ${offset}
            `,
            format: 'JSONEachRow'
          })
          
          const rows = await result.json()
          
          if (rows.length > 0) {
            // 插入到目标服务器
            await this.targetClient.insert({
              table: `${this.options.targetDatabase}.${tableName}`,
              values: rows,
              format: 'JSONEachRow'
            })
          }
          
          console.log(' ✅')
        } catch (err) {
          console.log(` ❌`)
          throw new Error(`批次 ${i + 1} 迁移失败: ${err.message}`)
        }
      }
    } else {
      // 同服务器：使用 INSERT SELECT（更快）
      if (batches === 1) {
        console.log(`   一次性迁移 ${sourceRows.toLocaleString()} 行...`)
        await this.targetClient.command({
          query: `
            INSERT INTO ${this.options.targetDatabase}.${tableName}
            SELECT * FROM ${this.options.sourceDatabase}.${tableName}
          `
        })
        console.log(`   ✅ 迁移完成`)
      } else {
        console.log(`   分 ${batches} 批迁移，每批 ${batchSize.toLocaleString()} 行`)
        
        for (let i = 0; i < batches; i++) {
          const offset = i * batchSize
          const progress = Math.round(((i + 1) / batches) * 100)
          
          process.stdout.write(`   批次 [${i + 1}/${batches}] ${progress}%...`)
          
          await this.targetClient.command({
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
  }
  
  /**
   * 验证数据
   */
  async verifyData(tableName, sourceRows) {
    console.log(`\n4️⃣  验证数据...`)
    
    // 查询源表行数
    const sourceResult = await this.sourceClient.query({
      query: `SELECT count() as count FROM ${this.options.sourceDatabase}.${tableName}`,
      format: 'JSONEachRow'
    })
    const sourceData = await sourceResult.json()
    const actualSourceRows = parseInt(sourceData[0].count)
    
    // 查询目标表行数
    const targetResult = await this.targetClient.query({
      query: `SELECT count() as count FROM ${this.options.targetDatabase}.${tableName}`,
      format: 'JSONEachRow'
    })
    const targetData = await targetResult.json()
    const targetRows = parseInt(targetData[0].count)
    
    console.log(`   源表: ${actualSourceRows.toLocaleString()} 行`)
    console.log(`   目标表: ${targetRows.toLocaleString()} 行`)
    
    // 对于聚合引擎，行数可能不同
    if (targetRows !== actualSourceRows) {
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
    console.log(`源: ${this.options.sourceHost} / ${this.options.sourceDatabase}.${tableName}`)
    console.log(`目标: ${this.options.targetHost} / ${this.options.targetDatabase}.${tableName}`)
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
    console.log(`║  ClickHouse 跨服务器数据库迁移${' '.repeat(28)}║`)
    console.log(`╚${'═'.repeat(58)}╝\n`)
    
    console.log(`源服务器: ${this.options.sourceHost}`)
    console.log(`源数据库: ${this.options.sourceDatabase}`)
    console.log(`目标服务器: ${this.options.targetHost}`)
    console.log(`目标数据库: ${this.options.targetDatabase}`)
    console.log(`跨服务器: ${this.isCrossServer ? '是' : '否'}`)
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
    await this.sourceClient.close()
    await this.targetClient.close()
  }
}

// 命令行入口
if (require.main === module) {
  const args = process.argv.slice(2)
  
  // 1. 尝试加载配置文件
  let config = {}
  try {
    config = require('./migration.config.js')
    console.log('✅ 已加载配置文件: migration.config.js')
  } catch (err) {
    console.log('ℹ️  未找到配置文件，将使用命令行参数或默认值')
  }
  
  // 2. 从配置文件初始化选项
  const options = {
    sourceHost: config.source?.host,
    sourceUsername: config.source?.username,
    sourcePassword: config.source?.password,
    sourceDatabase: config.source?.database,
    targetHost: config.target?.host,
    targetUsername: config.target?.username,
    targetPassword: config.target?.password,
    targetDatabase: config.target?.database,
    batchSize: config.options?.batchSize,
    isCluster: config.options?.isCluster  // 添加集群模式配置
  }
  
  let batchMode = false
  
  // 3. 命令行参数可以覆盖配置文件
  args.forEach(arg => {
    if (arg === '--batch') {
      batchMode = true
    } else if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--structure-only') {
      options.structureOnly = true
    } else if (arg.startsWith('--source-host=')) {
      options.sourceHost = arg.split('=')[1]
    } else if (arg.startsWith('--source-username=')) {
      options.sourceUsername = arg.split('=')[1]
    } else if (arg.startsWith('--source-password=')) {
      options.sourcePassword = arg.split('=')[1]
    } else if (arg.startsWith('--source-db=')) {
      options.sourceDatabase = arg.split('=')[1]
    } else if (arg.startsWith('--target-host=')) {
      options.targetHost = arg.split('=')[1]
    } else if (arg.startsWith('--target-username=')) {
      options.targetUsername = arg.split('=')[1]
    } else if (arg.startsWith('--target-password=')) {
      options.targetPassword = arg.split('=')[1]
    } else if (arg.startsWith('--target-db=')) {
      options.targetDatabase = arg.split('=')[1]
    } else if (arg.startsWith('--batch-size=')) {
      options.batchSize = parseInt(arg.split('=')[1])
    } else if (arg.startsWith('--cluster')) {
      // 支持 --cluster 或 --no-cluster
      if (arg === '--cluster') {
        options.isCluster = true
      } else if (arg === '--no-cluster') {
        options.isCluster = false
      }
    }
  })
  
  // 4. 启用调试模式（如果配置文件中设置）
  if (config.options?.debug) {
    process.env.DEBUG = '1'
  }
  
  const migrator = new CrossServerMigrator(options)
  
  if (!batchMode) {
    console.log('请使用 --batch 参数进行批量迁移')
    console.log('')
    console.log('方法 1: 使用配置文件（推荐）')
    console.log('  1. 编辑 migration.config.js 配置数据库连接')
    console.log('  2. 运行: ./preview_cross_server_migration.sh  # 预览迁移')
    console.log('  3. 运行: ./start_cross_server_migration.sh    # 开始迁移')
    console.log('')
    console.log('方法 2: 使用命令行参数')
    console.log('  node cross_server_migrate.js --batch \\')
    console.log('    --source-host=http://源服务器:8123 \\')
    console.log('    --source-username=用户名 \\')
    console.log('    --source-password=密码 \\')
    console.log('    --source-db=源数据库 \\')
    console.log('    --target-host=http://目标服务器:8123 \\')
    console.log('    --target-username=用户名 \\')
    console.log('    --target-password=密码 \\')
    console.log('    --target-db=目标数据库')
    console.log('')
    console.log('注意: 命令行参数优先级高于配置文件')
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

module.exports = CrossServerMigrator

