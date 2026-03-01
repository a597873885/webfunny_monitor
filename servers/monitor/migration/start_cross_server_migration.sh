#!/bin/bash

echo "╔═══════════════════════════════════════════════════════╗"
echo "║          跨服务器批量迁移数据                          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "💡 配置方式："
echo "  方法1: 编辑 migration.config.js 文件（推荐）"
echo "  方法2: 修改本脚本中的参数（已注释）"
echo ""


# ============================================================
# 以下内容无需修改
# ============================================================


echo "⚠️  重要提示："
echo "  1. 跨服务器迁移速度取决于网络带宽"
echo "  2. 建议先停止应用服务避免数据不一致"
echo "  3. 迁移过程中请勿中断"
echo "  4. 预计耗时取决于数据量和网络速度"
echo ""
read -p "确认开始迁移？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "取消迁移"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "开始迁移..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 记录开始时间
START_TIME=$(date +%s)

# 执行迁移
# 如果使用配置文件，直接运行（推荐）
node cross_server_migrate.js --batch

# 如果使用命令行参数，取消下面的注释并注释掉上面的命令
# node cross_server_migrate.js --batch \
#   --source-host="${SOURCE_HOST}" \
#   --source-username="${SOURCE_USERNAME}" \
#   --source-password="${SOURCE_PASSWORD}" \
#   --source-db="${SOURCE_DB}" \
#   --target-host="${TARGET_HOST}" \
#   --target-username="${TARGET_USERNAME}" \
#   --target-password="${TARGET_PASSWORD}" \
#   --target-db="${TARGET_DB}" \
#   --batch-size="${BATCH_SIZE}"

EXIT_CODE=$?

# 记录结束时间
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ 迁移完成！"
  echo ""
  echo "总耗时: ${MINUTES}分${SECONDS}秒"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "下一步操作："
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "1. 验证目标服务器数据"
  echo "   登录目标服务器 ClickHouse 客户端执行："
  echo "   SELECT count() FROM ${TARGET_DB}.表名;"
  echo ""
  echo "2. 验证集群复制（如果使用集群模式）"
  echo "   检查数据是否在所有节点都有"
  echo ""
  echo "3. 修改应用配置指向新服务器"
  echo "   编辑 config_variable/config.json"
  echo "   更新数据库连接配置"
  echo ""
  echo "4. 重启服务"
  echo "   pm2 restart monitor_server"
  echo ""
else
  echo "❌ 迁移失败，请查看上面的错误信息"
  echo ""
  echo "总耗时: ${MINUTES}分${SECONDS}秒"
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

