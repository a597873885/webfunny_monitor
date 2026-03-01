# ClickHouse 集群部署实战指南

> 本文总结了在生产环境中部署 ClickHouse 双节点集群的完整过程，包括数据迁移、常见问题及解决方案。

## 目录

- [1. 架构概述](#1-架构概述)
- [2. 环境准备](#2-环境准备)
- [3. ClickHouse 配置](#3-clickhouse-配置)
- [4. 数据迁移方案](#4-数据迁移方案)
- [5. 常见问题与解决方案](#5-常见问题与解决方案)
- [6. 验证和监控](#6-验证和监控)
- [7. 最佳实践](#7-最佳实践)

---

## 1. 架构概述

### 1.1 集群架构

```
┌─────────────────────────────────────────────────────────┐
│                    ZooKeeper 集群                        │
│            (协调 ReplicatedMergeTree 复制)               │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
┌───────▼──────────┐                ┌────────▼─────────┐
│   节点1 (zk1)    │◄───复制数据────►│   节点2 (zk2)    │
│  192.168.1.10    │                │  192.168.1.20    │
│                  │                │                  │
│ HTTP: 8123       │                │ HTTP: 8123       │
│ Native: 9000     │                │ Native: 9000     │
│ Interserver:9009 │                │ Interserver:9009 │
└──────────────────┘                └──────────────────┘
```

### 1.2 关键概念

- **ReplicatedMergeTree**：支持数据自动复制的表引擎
- **Interserver端口(9009)**：节点间传输数据的专用端口
- **ZooKeeper**：协调副本元数据和复制任务
- **Shard（分片）**：数据分布的基本单位
- **Replica（副本）**：同一分片的数据副本

---

## 2. 环境准备

### 2.1 服务器要求

| 组件 | 配置要求 |
|------|----------|
| CPU | 4核+ |
| 内存 | 8GB+ |
| 磁盘 | SSD, 100GB+ |
| 网络 | 节点间延迟 < 5ms |

### 2.2 端口清单

| 端口 | 用途 | 是否必须对外开放 |
|------|------|------------------|
| 8123 | HTTP 接口 | 是（用户访问） |
| 9000 | Native 客户端 | 可选 |
| 9009 | **Interserver 通信** | **是（节点间必须）** |
| 2181 | ZooKeeper | 是（内部通信） |

⚠️ **最容易遗漏的配置**：节点间的 **9009 端口**必须互通！

### 2.3 防火墙/安全组配置

**在两个节点都执行：**

```bash
# 开放 9009 端口
sudo firewall-cmd --permanent --add-port=9009/tcp
sudo firewall-cmd --reload

# 验证
sudo firewall-cmd --list-ports
```

**云服务器安全组：**
- 添加入站规则：TCP 9009，来源为对方节点IP

---

## 3. ClickHouse 配置

### 3.1 Docker 部署注意事项

#### ❌ 常见错误

```bash
# 缺少 9009 端口映射
docker run -d \
  -p 8123:8123 \
  -p 9000:9000 \
  clickhouse/clickhouse-server
```

#### ✅ 正确配置

```bash
docker run -d \
  --name clickhouse-server \
  -p 8123:8123 \
  -p 9000:9000 \
  -p 9009:9009 \              # ← 关键！
  -v /data/clickhouse:/var/lib/clickhouse \
  -v /etc/clickhouse-server:/etc/clickhouse-server \
  clickhouse/clickhouse-server:24.3
```

### 3.2 配置文件

#### 3.2.1 启用 Interserver 端口

**编辑 `config.xml` 或在 `config.d/` 下创建：**

```xml
<clickhouse>
    <!-- 节点间通信端口 -->
    <interserver_http_port>9009</interserver_http_port>
    
    <!-- 重要：指定使用真实IP，而不是容器主机名 -->
    <interserver_http_host>192.168.1.10</interserver_http_host>
</clickhouse>
```

💡 **为什么需要 `interserver_http_host`？**
- Docker 容器默认使用容器ID作为主机名（如 `d0d1c46ac5c6`）
- 其他节点无法解析这个主机名
- 显式指定真实IP可避免DNS问题

#### 3.2.2 集群配置

**`config.d/remote_servers.xml`：**

```xml
<clickhouse>
    <remote_servers>
        <log_cluster>
            <shard>
                <replica>
                    <host>192.168.1.10</host>
                    <port>9000</port>
                </replica>
                <replica>
                    <host>192.168.1.20</host>
                    <port>9000</port>
                </replica>
            </shard>
        </log_cluster>
    </remote_servers>
</clickhouse>
```

#### 3.2.3 宏定义

**节点1 (`config.d/macros.xml`)：**

```xml
<clickhouse>
    <macros>
        <cluster>log_cluster</cluster>
        <shard>01</shard>
        <replica>replica_1</replica>
    </macros>
</clickhouse>
```

**节点2 (`config.d/macros.xml`)：**

```xml
<clickhouse>
    <macros>
        <cluster>log_cluster</cluster>
        <shard>01</shard>
        <replica>replica_2</replica>  <!-- ← 必须不同 -->
    </macros>
</clickhouse>
```

#### 3.2.4 ZooKeeper 配置

```xml
<clickhouse>
    <zookeeper>
        <node>
            <host>zk1</host>
            <port>2181</port>
        </node>
        <node>
            <host>zk2</host>
            <port>2181</port>
        </node>
    </zookeeper>
</clickhouse>
```

### 3.3 主机名映射

**如果使用主机名（如 zk1, zk2），必须配置 `/etc/hosts`：**

**节点1：**
```bash
127.0.0.1 zk1
192.168.1.20 zk2
```

**节点2：**
```bash
192.168.1.10 zk1
127.0.0.1 zk2
```

**Docker 容器内也需要配置！**

```bash
# 进入容器
docker exec -it clickhouse-server bash

# 添加映射
echo "127.0.0.1 zk1" >> /etc/hosts
echo "192.168.1.20 zk2" >> /etc/hosts

# 退出并重启
exit
docker restart clickhouse-server
```

💡 **推荐做法**：挂载主机的 `/etc/hosts` 到容器
```bash
docker run -v /etc/hosts:/etc/hosts:ro ...
```

---

## 4. 数据迁移方案

### 4.1 单节点 → 集群模式迁移

#### 迁移工具

项目提供了自动化迁移工具：
- `cross_database_migrate.js` - 同服务器，跨数据库迁移
- `cross_server_migrate.js` - 跨服务器迁移
- `migration.config.js` - 集中配置

#### 配置示例

**`migration.config.js`：**

```javascript
module.exports = {
  source: {
    host: 'http://192.168.1.10:8123',
    username: 'default',
    password: '',
    database: 'webfunny_cloud_db'  // 旧的单节点库
  },
  
  target: {
    host: 'http://192.168.1.10:8123',
    username: 'default',
    password: '',
    database: 'webfunny_cloud_db_cluster'  // 新的集群库
  },
  
  target2: {
    host: 'http://192.168.1.20:8123',
    username: 'default',
    password: '',
    database: 'webfunny_cloud_db_cluster'
  },
  
  options: {
    batchSize: 10000,
    isCluster: true,  // 自动转换为 ReplicatedMergeTree
    debug: false,
    timeout: 300000
  }
}
```

#### 迁移步骤

```bash
# 1. 预览（只创建表结构，不迁移数据）
bash preview_cross_server_migration.sh

# 2. 检查表结构是否正确
# 特别确认引擎是否为 ReplicatedMergeTree

# 3. 正式迁移
bash start_cross_server_migration.sh
```

### 4.2 引擎自动转换

迁移工具会自动将表引擎转换：

```sql
-- 源表（单节点）
CREATE TABLE test (
    id UInt64,
    name String
) ENGINE = MergeTree()
ORDER BY id;

-- 自动转换为（集群）
CREATE TABLE test (
    id UInt64,
    name String
) ENGINE = ReplicatedMergeTree(
    '/clickhouse/tables/{database}/{shard}/test',
    '{replica}'
)
ORDER BY id;
```

### 4.3 数据复制流程

```
┌──────────┐
│ 源数据库  │
└─────┬────┘
      │
      │ 迁移工具读取
      ▼
┌──────────┐    INSERT    ┌──────────┐
│  节点1   │─────────────►│  节点1   │
│ 集群库   │              │ 新表     │
└──────────┘              └────┬─────┘
                               │
                               │ ReplicatedMergeTree
                               │ 自动复制
                               ▼
                          ┌──────────┐
                          │  节点2   │
                          │ 新表     │
                          └──────────┘
```

💡 **关键点**：
- 只向**节点1插入数据**
- **节点2的数据由 ReplicatedMergeTree 自动复制**
- 不需要手动同步

---

## 5. 常见问题与解决方案

### 5.1 数据不自动同步

#### 症状
```sql
SELECT count() FROM table;
-- 节点1: 1000000
-- 节点2: 0
```

#### 诊断

**使用诊断工具：**
```bash
node diagnose_replication.js
```

或手动检查：
```sql
-- 查看复制队列
SELECT 
    table,
    count() as queue_size,
    max(last_exception) as last_error
FROM system.replication_queue
WHERE database = 'webfunny_cloud_db_cluster'
GROUP BY table;

-- 查看副本状态
SELECT 
    table,
    total_replicas,
    active_replicas,
    queue_size,
    absolute_delay
FROM system.replicas
WHERE database = 'webfunny_cloud_db_cluster';
```

#### 原因1：DNS 解析失败

**错误信息：**
```
Not found address of host: d0d1c46ac5c6. (DNS_ERROR)
```

**原因**：节点使用了容器主机名，其他节点无法解析

**解决方案A：添加主机名映射（快速）**

在无法解析的节点上：
```bash
echo "192.168.1.10 d0d1c46ac5c6" | sudo tee -a /etc/hosts
```

**解决方案B：配置真实IP（永久）**

在 ClickHouse 配置中指定：
```xml
<interserver_http_host>192.168.1.10</interserver_http_host>
```

然后清空数据库重新迁移。

#### 原因2：端口9009无法连接

**错误信息：**
```
Connection refused
Poco::Exception. Code: 1000, e.code() = 111
```

**诊断步骤：**

```bash
# 1. 检查端口是否监听（在节点1）
sudo netstat -tlnp | grep 9009

# 2. 检查能否连接（在节点2）
telnet 192.168.1.10 9009
# 或
nc -zv 192.168.1.10 9009
```

**解决方案：**

**问题A：端口未监听**

原因：`<interserver_http_port>` 未配置或被注释

解决：
```bash
# 检查配置
docker exec clickhouse-server grep interserver_http_port /etc/clickhouse-server/config.xml

# 如果被注释，取消注释或添加
# 重启容器
docker restart clickhouse-server
```

**问题B：防火墙阻止**
```bash
sudo firewall-cmd --permanent --add-port=9009/tcp
sudo firewall-cmd --reload
```

**问题C：安全组未开放**

登录云服务商控制台，添加入站规则。

**问题D：Docker端口未映射**
```bash
# 检查
docker port clickhouse-server | grep 9009

# 如果没有，需要重新创建容器
docker stop clickhouse-server
docker run -d -p 9009:9009 ...
```

#### 原因3：集群配置错误

**错误信息：**
```
Cannot resolve host (zk1), error 0: Host not found.
```

**原因**：集群配置中的主机名无法解析

**解决方案：**

在**容器内**添加 `/etc/hosts`：
```bash
docker exec -it clickhouse-server bash
echo "127.0.0.1 zk1" >> /etc/hosts
echo "192.168.1.20 zk2" >> /etc/hosts
exit
docker restart clickhouse-server
```

或使用真实IP修改 `remote_servers.xml`。

### 5.2 表引擎是 MergeTree 而不是 ReplicatedMergeTree

#### 症状
```sql
SHOW CREATE TABLE test;
-- 显示 ENGINE = MergeTree() 而不是 ReplicatedMergeTree
```

#### 原因
- 迁移时 `isCluster: true` 未生效
- 或配置文件加载错误

#### 解决方案
```bash
# 1. 检查配置
cat migration.config.js | grep isCluster

# 2. 确认为 true

# 3. 清空数据库
node clean_target_database.js

# 4. 重新迁移
bash start_cross_server_migration.sh
```

### 5.3 副本数显示为1

#### 症状
```sql
SELECT total_replicas FROM system.replicas LIMIT 1;
-- 显示 1
```

#### 原因
- 两个节点的表是独立创建的，没有形成复制关系
- ZooKeeper 路径不一致

#### 解决方案

**必须清空重建！**

```bash
# 在两个节点都删除数据库
clickhouse-client --query="DROP DATABASE IF EXISTS webfunny_cloud_db_cluster"

# 重新创建（使用 ON CLUSTER）
clickhouse-client --query="CREATE DATABASE webfunny_cloud_db_cluster ON CLUSTER '{cluster}'"

# 重新迁移
bash start_cross_server_migration.sh
```

### 5.4 复制队列积压

#### 症状
```sql
SELECT count() FROM system.replication_queue;
-- 显示大量任务
```

#### 可能原因
- 网络慢
- 节点性能不足
- 一次性插入数据过多

#### 解决方案

**等待自动处理**（推荐）：
- ClickHouse 会自动处理队列
- 正常情况下，每秒可处理数百个任务

**手动触发（如果卡住）：**
```sql
-- 重启副本复制
SYSTEM RESTART REPLICAS;

-- 或针对特定表
SYSTEM RESTART REPLICA table_name;
```

**优化性能：**
```sql
-- 调整复制相关参数
SET max_replica_delay_for_distributed_queries = 300;
SET replication_alter_partitions_sync = 2;
```

---

## 6. 验证和监控

### 6.1 复制状态检查

```sql
-- 1. 查看副本配置
SELECT 
    database,
    table,
    zookeeper_path,
    replica_name,
    total_replicas,
    active_replicas
FROM system.replicas
WHERE database = 'webfunny_cloud_db_cluster'
LIMIT 5;
```

**正常输出：**
```
database                    | table      | total_replicas | active_replicas
----------------------------|------------|----------------|----------------
webfunny_cloud_db_cluster  | test       | 2              | 2
```

### 6.2 数据一致性检查

```bash
# 使用诊断工具
node diagnose_replication.js

# 或手动对比行数
clickhouse-client --host=192.168.1.10 --query="
SELECT table, count() as cnt 
FROM webfunny_cloud_db_cluster.* 
GROUP BY table 
ORDER BY table"

clickhouse-client --host=192.168.1.20 --query="
SELECT table, count() as cnt 
FROM webfunny_cloud_db_cluster.* 
GROUP BY table 
ORDER BY table"
```

### 6.3 监控指标

**关键指标：**

```sql
-- 复制延迟
SELECT 
    table,
    absolute_delay,
    queue_size
FROM system.replicas
WHERE absolute_delay > 60;  -- 延迟超过60秒

-- 失败的复制任务
SELECT 
    table,
    count() as failures
FROM system.replication_queue
WHERE num_tries > 3
GROUP BY table;

-- 只读副本（通常表示有问题）
SELECT 
    table,
    is_readonly,
    last_queue_update_exception
FROM system.replicas
WHERE is_readonly = 1;
```

---

## 7. 最佳实践

### 7.1 部署前检查清单

- [ ] 两个节点的 9009 端口互通
- [ ] Docker 容器映射了 9009 端口
- [ ] 配置了 `<interserver_http_port>9009</interserver_http_port>`
- [ ] 配置了 `<interserver_http_host>真实IP</interserver_http_host>`
- [ ] 集群配置中的主机名能解析（或用IP）
- [ ] 两个节点的 `{replica}` 宏不同
- [ ] ZooKeeper 正常运行
- [ ] 防火墙/安全组规则正确

### 7.2 配置建议

#### 使用真实IP，避免主机名

❌ **不推荐：**
```xml
<host>zk1</host>
<host>zk2</host>
```

✅ **推荐：**
```xml
<host>192.168.1.10</host>
<host>192.168.1.20</host>
```

#### Docker 容器持久化配置

```bash
docker run -d \
  --name clickhouse-server \
  -p 8123:8123 \
  -p 9000:9000 \
  -p 9009:9009 \
  -v /data/clickhouse:/var/lib/clickhouse \          # 数据持久化
  -v /etc/clickhouse-server:/etc/clickhouse-server \ # 配置持久化
  -v /etc/hosts:/etc/hosts:ro \                      # 主机名映射
  --restart=always \                                  # 自动重启
  clickhouse/clickhouse-server:24.3
```

#### 配置文件分离

```
/etc/clickhouse-server/
├── config.xml                    # 主配置
└── config.d/
    ├── network.xml              # 网络配置
    ├── remote_servers.xml       # 集群配置
    ├── macros.xml              # 宏定义
    └── zookeeper.xml           # ZooKeeper配置
```

### 7.3 迁移建议

1. **先测试，后迁移**
   ```bash
   # 预览模式，只创建表结构
   bash preview_cross_server_migration.sh
   ```

2. **小批量迁移**
   - 先迁移几个小表测试
   - 验证复制正常后再迁移大表

3. **监控复制进度**
   ```bash
   # 定期检查
   node check_sync_progress_v2.js
   ```

4. **业务低峰期迁移**
   - 避免影响线上业务
   - 预留足够时间处理问题

### 7.4 故障恢复

#### 单节点故障

**节点2故障：**
- 节点1继续提供服务
- 节点2恢复后，自动从节点1同步数据

**节点1故障：**
- 切换应用到节点2
- 节点1恢复后，自动追赶数据

#### 数据不一致

```bash
# 1. 停止写入
# 2. 对比数据
node diagnose_replication.js

# 3. 如果差异大，重新迁移
# 清空节点2
clickhouse-client --host=节点2 --query="DROP DATABASE IF EXISTS xxx"

# 从节点1重新复制
# ClickHouse 会自动处理
```

### 7.5 性能优化

#### 插入优化

```sql
-- 批量插入
INSERT INTO table VALUES (...), (...), (...);  -- 推荐

-- 避免单行插入
INSERT INTO table VALUES (...);  -- 不推荐
```

#### 复制优化

```xml
<clickhouse>
    <!-- 增加复制线程数 -->
    <background_schedule_pool_size>16</background_schedule_pool_size>
    
    <!-- 增加复制超时 -->
    <replicated_fetches_http_connection_timeout>30</replicated_fetches_http_connection_timeout>
</clickhouse>
```

---

## 8. 总结

### 关键要点

1. **9009端口是灵魂**
   - 必须监听
   - 必须互通
   - 容器必须映射

2. **主机名 vs IP**
   - Docker环境强烈建议用IP
   - 如用主机名，确保所有地方都能解析

3. **ReplicatedMergeTree 是自动的**
   - 配置正确后，数据会自动同步
   - 不需要手动触发复制

4. **先诊断，再修复**
   - 使用诊断工具定位问题
   - 不要盲目重启或清空数据

### 排查顺序

遇到复制问题时，按此顺序检查：

1. 端口9009是否监听？
2. 端口9009是否互通？
3. 主机名是否能解析？
4. 表引擎是否为 ReplicatedMergeTree？
5. 副本数是否为2？
6. 复制队列是否有错误？

### 参考资源

- [ClickHouse 官方文档](https://clickhouse.com/docs/)
- [ReplicatedMergeTree 引擎](https://clickhouse.com/docs/engines/table-engines/mergetree-family/replication)
- [集群和分布式DDL](https://clickhouse.com/docs/operations/distributed-coordination)

---

## 附录：快速命令参考

```bash
# ===== 端口检查 =====
sudo netstat -tlnp | grep 9009           # 检查端口监听
telnet IP 9009                            # 测试连接
nc -zv IP 9009                            # 测试连接（推荐）

# ===== Docker =====
docker ps | grep clickhouse               # 查看容器
docker port CONTAINER                     # 查看端口映射
docker logs CONTAINER                     # 查看日志
docker exec -it CONTAINER bash            # 进入容器
docker restart CONTAINER                  # 重启容器

# ===== ClickHouse =====
clickhouse-client --query="..."           # 执行SQL
clickhouse-client -m                      # 交互模式

# 查看副本状态
SELECT * FROM system.replicas WHERE database = 'xxx';

# 查看复制队列
SELECT * FROM system.replication_queue WHERE database = 'xxx';

# 重启复制
SYSTEM RESTART REPLICAS;

# ===== 防火墙 =====
sudo firewall-cmd --list-ports            # 查看开放端口
sudo firewall-cmd --permanent --add-port=9009/tcp
sudo firewall-cmd --reload

# ===== 迁移工具 =====
bash preview_cross_server_migration.sh    # 预览
bash start_cross_server_migration.sh      # 迁移
node diagnose_replication.js              # 诊断
node check_sync_progress_v2.js            # 进度
```

---

**最后更新：** 2025-11-24  
**适用版本：** ClickHouse 24.3+, Docker 20.10+

