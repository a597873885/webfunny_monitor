#!/bin/bash

echo "╔═══════════════════════════════════════════════════════╗"
echo "║          清理目标数据库                                ║"
echo "║   webfunny_log_db_cluster                             ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  警告："
echo "  • 此操作将删除目标数据库中的所有表"
echo "  • 删除操作不可恢复"
echo "  • 将在两个集群节点同时执行"
echo ""
echo "目标节点:"
echo "  • Replica1: 8.133.201.61:8123"
echo "  • Replica2: 106.14.26.133:8123"
echo ""
read -p "确认清理目标数据库？(输入 yes 继续) " -r
echo ""

if [[ ! $REPLY == "yes" ]]; then
  echo "❌ 取消清理"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "开始清理..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 执行清理脚本
node clean_target_database.js

EXIT_CODE=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ 清理完成！"
  echo ""
  echo "下一步:"
  echo "  1. 创建表结构: ./preview_migration.sh"
  echo "  2. 迁移数据: ./start_migration.sh"
else
  echo "❌ 清理失败，请查看错误信息"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

