#!/bin/bash

echo "╔═══════════════════════════════════════════════════════╗"
echo "║    跨服务器预览迁移（只创建表结构，不迁移数据）        ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "💡 配置方式："
echo "  方法1: 编辑 migration.config.js 文件（推荐）"
echo "  方法2: 修改本脚本中的参数（已注释）"
echo ""


# ============================================================
# 执行迁移
# ============================================================

# 如果使用配置文件，直接运行（推荐）
node cross_server_migrate.js --batch --structure-only

# 如果使用命令行参数，取消下面的注释并注释掉上面的命令
# node cross_server_migrate.js --batch --structure-only \
#   --source-host="${SOURCE_HOST}" \
#   --source-username="${SOURCE_USERNAME}" \
#   --source-password="${SOURCE_PASSWORD}" \
#   --source-db="${SOURCE_DB}" \
#   --target-host="${TARGET_HOST}" \
#   --target-username="${TARGET_USERNAME}" \
#   --target-password="${TARGET_PASSWORD}" \
#   --target-db="${TARGET_DB}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 提示："
echo "  • 已在目标服务器创建所有表结构（ReplicatedMergeTree）"
echo "  • 尚未迁移数据"
echo "  • 确认表结构无误后，运行以下命令开始数据迁移："
echo "    ./start_cross_server_migration.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

