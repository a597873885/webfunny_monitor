# ClickHouse 数据库迁移工具使用指南

## 📖 快速开始

### 步骤 1: 配置数据库连接

**推荐方式：使用配置文件**

```bash
# 1. 复制配置示例文件
cp migration.config.example.js migration.config.js

# 2. 编辑配置文件
vim migration.config.js
# 或使用其他编辑器
```

编辑 `migration.config.js`，填入实际的数据库信息：

```javascript
module.exports = {
  source: {
    host: 'http://8.133.201.61:8123',
    username: 'webfunny_user',
    password: '你的密码',
    database: 'webfunny_cloud_db'
  },
  target: {
    host: 'http://106.14.26.133:8123',
    username: 'default',
    password: '你的密码',
    database: 'webfunny_cloud_db_cluster'
  },
  options: {
    batchSize: 10000,
    debug: false
  }
}
```

### 步骤 2: 选择迁移方式

#### 方式 A: 跨服务器迁移

从服务器 A 迁移到服务器 B：

```bash
# 预览（只创建表结构，不迁移数据）
./preview_cross_server_migration.sh

# 确认无误后，开始完整迁移
./start_cross_server_migration.sh
```

#### 方式 B: 同服务器迁移

在同一台服务器上，从数据库 A 迁移到数据库 B：

```bash
# 预览
./preview_migration.sh

# 开始迁移
./start_migration.sh
```

---

## 🎯 两种迁移方式对比

| 特性 | 同服务器迁移 | 跨服务器迁移 |
|------|-------------|-------------|
| **使用脚本** | `cross_database_migrate.js` | `cross_server_migrate.js` |
| **适用场景** | 同一台服务器内 | 两台不同服务器间 |
| **迁移速度** | ⚡ 快（INSERT SELECT） | 🐢 较慢（取决于网络） |
| **配置复杂度** | 简单 | 稍复杂 |
| **推荐场景** | 本地升级、引擎转换 | 服务器迁移、异地备份 |

---

## 📁 文件说明

```
migration/
├── migration.config.js              # 配置文件（需创建，包含敏感信息）
├── migration.config.example.js      # 配置示例文件
├── .gitignore                       # Git 忽略配置文件
│
├── cross_server_migrate.js          # 跨服务器迁移核心脚本
├── cross_database_migrate.js        # 同服务器迁移核心脚本
│
├── preview_cross_server_migration.sh   # 跨服务器预览
├── start_cross_server_migration.sh     # 跨服务器执行
├── preview_migration.sh                # 同服务器预览
├── start_migration.sh                  # 同服务器执行
│
├── clean_target_database.js         # 清理目标数据库
├── clean_target_database.sh         # 清理脚本
│
├── CROSS_SERVER_MIGRATION_GUIDE.md  # 详细使用指南
├── ENGINE_CONVERSION_FIX.md         # 引擎转换修复说明
└── README.md                        # 本文档
```

---

## ⚙️ 配置说明

### 配置文件结构

```javascript
{
  source: {      // 源服务器配置
    host: '',    // 服务器地址（含协议和端口）
    username: '',
    password: '',
    database: '' // 源数据库名
  },
  target: {      // 目标服务器配置
    host: '',    // 跨服务器迁移才需要
    username: '',
    password: '',
    database: '' // 目标数据库名
  },
  options: {     // 迁移选项
    batchSize: 10000,  // 每批行数
    debug: false,      // 调试模式
    timeout: 300000    // 超时时间（毫秒）
  }
}
```

### 配置优先级

**配置文件 < 命令行参数**

命令行参数会覆盖配置文件的值。

### 批次大小建议

| 数据量 | 网络条件 | 推荐批次大小 |
|--------|---------|-------------|
| < 100万行 | 局域网 | 20000 - 50000 |
| < 100万行 | 公网 | 10000 - 20000 |
| > 100万行 | 局域网 | 10000 - 20000 |
| > 100万行 | 公网 | 5000 - 10000 |

---

## 🚀 使用示例

### 示例 1: 使用配置文件（推荐）

```bash
# 1. 配置 migration.config.js
# 2. 直接运行
./start_cross_server_migration.sh
```

### 示例 2: 使用命令行参数

```bash
node cross_server_migrate.js --batch \
  --source-host=http://8.133.201.61:8123 \
  --source-username=webfunny_user \
  --source-password=密码 \
  --source-db=webfunny_cloud_db \
  --target-host=http://106.14.26.133:8123 \
  --target-username=default \
  --target-password=密码 \
  --target-db=webfunny_cloud_db_cluster
```

### 示例 3: 只预览，不实际迁移

```bash
node cross_server_migrate.js --batch --dry-run
```

### 示例 4: 只创建表结构

```bash
node cross_server_migrate.js --batch --structure-only
```

### 示例 5: 启用调试模式

在 `migration.config.js` 中设置：
```javascript
options: {
  debug: true  // 显示详细SQL
}
```

或通过环境变量：
```bash
DEBUG=1 ./start_cross_server_migration.sh
```

---

## ✅ 验证迁移结果

### 1. 检查表数量

```sql
-- 源数据库
SELECT count() FROM system.tables WHERE database = '源数据库名';

-- 目标数据库
SELECT count() FROM system.tables WHERE database = '目标数据库名';
```

### 2. 检查表引擎

```sql
-- 应该看到 ReplicatedMergeTree
SELECT name, engine 
FROM system.tables 
WHERE database = '目标数据库名' 
  AND engine LIKE '%Replicated%';
```

### 3. 检查数据行数

```sql
-- 对比每个表的行数
SELECT count() FROM 源数据库.表名;
SELECT count() FROM 目标数据库.表名;
```

### 4. 验证集群复制（如果使用集群）

在不同节点查询，数据应该一致：

```bash
# 节点1
clickhouse-client --host=节点1IP --query="SELECT count() FROM 数据库.表名"

# 节点2
clickhouse-client --host=节点2IP --query="SELECT count() FROM 数据库.表名"
```

---

## 🔧 高级功能

### 清理目标数据库

如果需要重新迁移，先清理目标数据库：

```bash
node clean_target_database.js
```

**注意**: 此操作会删除目标数据库的所有表！

### 自定义批次大小

```bash
node cross_server_migrate.js --batch --batch-size=5000
```

### 跳过某些表

暂不支持，如需此功能请修改脚本的 `getSourceTables()` 方法。

---

## ⚠️ 注意事项

### 1. 数据一致性

- ✅ **建议**: 迁移前停止应用服务
- ✅ **建议**: 在业务低峰期进行
- ⚠️ **警告**: 迁移过程中不要写入源数据库

### 2. 网络要求

- ✅ 确保源和目标服务器网络互通
- ✅ 防火墙开放 8123 端口
- ✅ 网络稳定，避免频繁中断

### 3. 权限要求

**源服务器**:
- `SELECT` 权限
- 能访问 `system.tables`

**目标服务器**:
- `CREATE DATABASE` 权限
- `CREATE TABLE` 权限
- `INSERT` 权限

### 4. 磁盘空间

- ✅ 目标服务器需要足够的磁盘空间
- ✅ 建议预留 2 倍数据大小的空间

### 5. 集群配置

如果目标是集群模式，确保：
- ✅ `config_variable/config.json` 中 `cluster.enabled = true`
- ✅ ZooKeeper 已正确配置
- ✅ ClickHouse 宏 `{shard}` 和 `{replica}` 已定义

---

## 🐛 故障排查

### 问题 1: 连接超时

**错误**: `Connection timeout`

**解决**:
```bash
# 测试连接
telnet 服务器IP 8123

# 检查防火墙
sudo firewall-cmd --list-ports
```

### 问题 2: 权限不足

**错误**: `Access denied`

**解决**:
```sql
-- 授予权限
GRANT ALL ON *.* TO 用户名;
```

### 问题 3: 引擎没有转换

**错误**: 表仍然是 `MergeTree` 而不是 `ReplicatedMergeTree`

**解决**:
1. 检查 `config_variable/config.json` 中 `cluster.enabled` 是否为 `true`
2. 查看 `ENGINE_CONVERSION_FIX.md` 文档
3. 确认集群配置已正确加载

### 问题 4: 内存不足

**错误**: `Memory limit exceeded`

**解决**:
- 减小批次大小: `--batch-size=5000`
- 增加 ClickHouse 内存限制

### 问题 5: 迁移中断

如果迁移过程中断：
- ✅ 重新运行脚本（已存在的表会被跳过）
- ✅ 或手动迁移失败的表

---

## 📞 获取帮助

- 详细指南: `CROSS_SERVER_MIGRATION_GUIDE.md`
- 引擎转换: `ENGINE_CONVERSION_FIX.md`
- ClickHouse 官方文档: https://clickhouse.com/docs

---

## 🔒 安全建议

1. **不要提交配置文件到 Git**
   - `migration.config.js` 已在 `.gitignore` 中
   - 只提交 `migration.config.example.js`

2. **使用只读用户读取源数据库**
   - 创建专用的迁移用户
   - 只授予必要的权限

3. **保护密码**
   - 不要在命令行中直接输入密码
   - 使用配置文件或环境变量

4. **备份数据**
   - 迁移前备份源数据库
   - 保留备份直到确认迁移成功

---

## 📝 版本历史

### v2.0.0 (2025-11-24)
- ✅ 支持配置文件管理
- ✅ 修复引擎转换问题
- ✅ 添加跨服务器迁移
- ✅ 优化日志输出

### v1.0.0 (原版本)
- ✅ 基础迁移功能
- ✅ 同服务器迁移

---

## 📄 许可证

请参考项目根目录的 LICENSE 文件。

