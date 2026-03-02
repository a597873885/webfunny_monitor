<p align="center">
  <img width="360" src="https://www.webfunny.cn/resource/logo-letter.png"/>
</p>

<h3 align="center">前端监控 & Apm后端监控 & 埋点系统</h3>
<p align="center">Webfunny是一款集全链路监控和埋点系统于一体的大数据分析系统，我们致力于解决线上的疑难杂症和精细化分析业务数据；监控系统面向技术、埋点系统面向业务，两者配合使用，相得益彰。
</p>

<p align="center">
  <a href="https://github.com/a597873885/webfunny_monitor"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/a597873885/webfunny_monitor?style=social"></a>
  <a href="https://github.com/a597873885/webfunny_monitor"><img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/a597873885/webfunny_monitor"></a>
  <a href="https://github.com/a597873885/webfunny_monitor/commits"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/a597873885/webfunny_monitor"></a>
  <a href="https://github.com/a597873885/webfunny_monitor/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/a597873885/webfunny_monitor"></a>
  <a href="https://github.com/a597873885/webfunny_monitor/issues?q=is%3Aissue+is%3Aclosed"><img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed-raw/a597873885/webfunny_monitor"></a>
  <a href="#开源协议"><img alt="GitHub license" src="https://img.shields.io/github/license/a597873885/webfunny_monitor"></a>
</p>

---

## 🚀 立刻体验

> 🖥️ **在线 Demo**（无需注册）→ [点击直接体验](https://www.webfunny.cn/wf_center/main)　纯demo数据，即刻体验
>
> 🎁 **免费社区版**（个人/小团队首选）→ [免费申请](https://webfunny.com/price?showFreeModal=community)　填写信息即可获取，免费私有化部署
>
> 💼 **企业版试用**（30天全功能）→ [申请试用](https://webfunny.com/price?showFreeModal=test)　自行填写获取授权码

| 方式 | 链接 | 说明 |
|---|---|---|
| **SaaS 云服务** | [国内服务](https://cloud.webfunny.com/wf_center/main) [海外服务](https://global.webfunny.com/wf_center/main) | 注册后免费体验 |
| **私有化部署** | [查看部署文档](https://www.webfunny.com/desMonitor) | 支持 Docker 一键部署 |
| **官网** | [www.webfunny.com](https://www.webfunny.com) | 价格 / 文档 / 案例 |

---

## ✨ 为什么选择 Webfunny

- **全链路监控 + 埋点三合一**：前端监控、APM 后端监控、业务埋点三套系统合一，从用户浏览器到后端服务到数据库，从技术到业务，全栈可观测；
- **一键私有化部署**：仅需 Node.js 环境，支持 Docker，10 分钟完成部署，运维成本极低
- **无代码入侵**：引入一段探针代码，自动采集错误、性能、用户行为，无需修改业务逻辑
- **支持亿级日活**：底层针对大流量场景优化，支持集群版，高可用场景，不怕业务规模扩张
- **源码可购买 & 支持二次开发**：数据完全自主可控，支持按需定制

---

## 📊 核心功能

### 前端监控系统（面向技术团队）

<p>
  <img width="800" src="https://www.webfunny.cn/resource/webfunny_home.png"/>
</p>

| 功能 | 说明 |
|---|---|
| 实时流量 & 大屏 | PV/UV/新访客/跳出率实时展示，支持全屏大屏模式 |
| 用户细查 & 行为回放 | 通过 userId 精准定位用户，完整复现行为轨迹 |
| 代码错误分析 | 自动聚合归类，支持 SourceMap 源码定位，支持指派处理 |
| 接口 & 页面性能 | 加载瀑布图、慢接口 Top10、地域性能分布 |
| 远程调试 | 实时连线用户设备，查看控制台、localStorage、Cookie |
| 录屏回放 | 录制用户操作过程，高效还原事故现场 |
| 智能告警 | 多指标告警规则，支持邮件 / Webhook 通知 |

### APM 后端监控系统（面向后端 & 运维团队）

<p>
  <img width="800" src="https://www.webfunny.cn/resource/apm_topology.png"/>
</p>

| 功能 | 说明 |
|---|---|
| 应用概览 | P99/P95/P50 响应时间趋势、请求量、错误率、慢调用、慢 SQL 一屏汇总 |
| 链路追踪 | 分布式全链路追踪，快速定位跨服务的性能瓶颈和异常节点 |
| 接口分析 | 后端接口请求量、响应耗时、成功率多维分析，支持慢接口 Top 排行 |
| 数据库监控 | SQL 执行分析，支持多数据库类型 |
| 慢 SQL 分析 | 100ms / 200ms / 500ms 多档阈值过滤，按服务、数据库、关键字检索 |
| 服务拓扑图 | 可视化展示服务间调用关系与依赖，快速识别故障影响面 |
| 错误分析 | 后端异常聚合分析，支持按时间、服务维度查看错误趋势 |

### 埋点系统（面向业务团队）

<p>
  <img width="800" src="https://www.webfunny.cn/resource/event_home.png?t=1"/>
</p>

| 功能 | 说明 |
|---|---|
| 可视化看板 | 柱状图、漏斗图、热力图、留存分析等多种卡片类型 |
| 漏斗 & 转化分析 | 自定义业务流程，精确计算每步流失率 |
| 可视化圈选埋点 | 无需开发介入，产品经理直接在页面圈选埋点 |
| 字段 & 点位仓库 | 统一管理埋点字段，支持跨应用复用 |
| 数据导出 & API | 支持 Excel 导出，支持 API 对接下游数据系统 |

### 支持平台

| 类型 | 平台 |
|---|---|
| Web 前端 | H5、PC/Web |
| 小程序 | 微信小程序、支付宝小程序 |
| 跨端框架 | Flutter、UniApp、Taro |
| 原生平台 | 鸿蒙、安卓、iOS |

---

## 🆚 对比 Sentry / 神策 / GrowingIO

| | Webfunny | Sentry | 神策 / GrowingIO |
|---|---|---|---|
| 前端错误监控 | ✅ | ✅ | ❌ |
| 前端性能监控 | ✅ 更全面 | 🟡 基础 | ❌ |
| APM 后端监控 | ✅ 链路追踪、慢SQL、JVM | 🟡 基础 | ❌ |
| 用户行为细查 | ✅ 超全面 | 🟡 仅错误相关 | ✅ |
| 业务埋点 & 漏斗 | ✅ | ❌ | ✅ |
| 私有化部署 | ✅ 一键部署 | 🟡 复杂、硬件要求高 | 🟡 价格极高 |
| 源码购买 | ✅ | ❌ | ❌ |
| 价格（私有化） | 💰 数千元起 | 💰💰💰 国外定价 | 💰💰💰 数十万起 |

---

## ⚡ 快速安装

### Docker 安装（推荐）

```bash
# 详细步骤见文档
docker-compose up -d
```

[👉 查看完整 Docker 部署文档](https://www.webfunny.com/desMonitor?blogUrl=128&menuKey=menu2&blogKey=2-0)

### 本地安装

```bash
git clone https://github.com/a597873885/webfunny_monitor.git
cd webfunny_monitor
npm install && npm run bootstrap
npm install pm2 -g  # 已安装可跳过
npm run prd
# 访问 http://localhost:8008/webfunny_center/main.html
```

[👉 查看服务器部署文档](https://www.webfunny.com/desMonitor)　　[👉 查看历史版本](https://www.webfunny.com/version)

---

## 🏢 部分企业用户

> 已服务 200+ 企业，覆盖互联网、金融、教育、国企等多个行业

---

## 💬 联系我们

- 官网：[www.webfunny.com](https://www.webfunny.com)
- 邮箱：webfunny@163.com
- 电话：189 3095 0656
- 微信客服：webfunny2

<img width="150" src="https://www.webfunny.cn/resource/webfunny2.png"/>
