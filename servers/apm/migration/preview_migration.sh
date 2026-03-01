#!/bin/bash

echo "╔═══════════════════════════════════════════════════════╗"
echo "║    预览迁移（只创建表结构，不迁移数据）               ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

node cross_database_migrate.js --batch --structure-only \
  --source-db=webfunny_cloud_db \
  --target-db=webfunny_log_db_cluster \
  --host=http://8.133.201.61:8123 \
  --username=webfunny_user \
  --password=das345jdlka@0976sfda

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 提示："
echo "  • 已创建所有表结构（ReplicatedMergeTree）"
echo "  • 尚未迁移数据"
echo "  • 确认表结构无误后，运行以下命令开始数据迁移："
echo "    ./start_migration.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
