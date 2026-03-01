#!/bin/bash

echo "╔═══════════════════════════════════════════════════════╗"
echo "║          开始批量迁移数据                              ║"
echo "║   webfunny_cloud_db → webfunny_log_db_cluster         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  重要提示："
echo "  1. 建议先停止应用服务避免数据不一致"
echo "  2. 迁移过程中请勿中断"
echo "  3. 预计耗时取决于数据量"
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
node cross_database_migrate.js --batch \
  --source-db=webfunny_cloud_db \
  --target-db=webfunny_log_db_cluster \
  --host=http://8.133.201.61:8123 \
  --username=webfunny_user \
  --password=das345jdlka@0976sfda

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
  echo "1. 验证数据（查看迁移结果）"
  echo "   node check_tables.js"
  echo ""
  echo "2. 验证集群复制（数据应该在两个节点都有）"
  echo "   node -e \"const {client} = require('./config/db'); client.query({query: 'SELECT count() FROM Project', format: 'JSONEachRow'}).then(r => r.json()).then(d => console.log('Replica1:', d[0]));\""
  echo ""
  echo "3. 修改配置启用集群模式"
  echo "   编辑 config_variable/config.json"
  echo "   设置: cluster.enabled = true"
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
