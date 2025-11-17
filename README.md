# 项目架构文档

## 📁 项目目录结构

```
src/
├── api/                    # API 层 - 与后端交互
│   ├── client.ts          # API 客户端配置
│   ├── interceptors.ts    # 请求/响应拦截器
│   └── endpoints/         # API 端点分类
│       ├── stock.ts
│       ├── account.ts
│       ├── strategy.ts
│       └── ...
│
├── components/            # React 组件库
│   ├── common/            # 通用组件
│   │   ├── LoadingSpinner/
│   │   ├── SearchBar/
│   │   └── ...
│   ├── business/          # 业务组件
│   │   ├── Account/
│   │   ├── Strategy/
│   │   └── ...
│   └── ui/                # 基础 UI 组件
│       ├── Button.tsx
│       ├── Input.tsx
│       └── ...
│
├── config/                # 配置文件
│   ├── defaultSettings.ts
│   ├── routes.ts
│   └── proxy.ts
│
├── constants/             # 全局常量
│   ├── api/              # API 常量
│   ├── enums/            # 枚举值
│   └── config/           # 配置常量
│
├── hooks/                 # React Hooks
│   ├── useApi/           # API 相关 Hooks
│   ├── useAuth/          # 认证 Hooks
│   └── useTheme/         # 主题 Hooks
│
├── layouts/               # 布局组件
│   ├── BasicLayout.tsx
│   └── UserLayout.tsx
│
├── pages/                 # 页面组件
│   ├── Account/
│   ├── Stock/
│   ├── Strategy/
│   └── ...
│
├── services/              # 业务逻辑服务
│   ├── modules/          # 业务模块
│   │   ├── stockService.ts
│   │   ├── accountService.ts
│   │   └── ...
│   └── request.ts        # 请求服务
│
├── stores/                # 状态管理（Zustand）
│   ├── modules/          # 状态模块
│   │   ├── cache.ts
│   │   ├── stock.ts
│   │   └── user.ts
│   └── watchlist.ts
│
├── styles/                # 全局样式
│   ├── global.less
│   └── global.style.ts
│
├── typings/               # TypeScript 类型定义
│   ├── global.d.ts       # 全局类型
│   ├── index.d.ts        # 导出类型
│   ├── stock.d.ts
│   └── ...
│
├── i18n/                  # 国际化
│   ├── en-US/
│   └── zh-CN/
│
├── utils/                 # 工具函数
│   ├── format.ts
│   ├── request.ts
│   └── notification.ts
│
├── app.tsx               # 主应用组件
└── global.tsx            # 全局初始化
```

## 📋 分层说明

### 1. API 层 (`src/api/`)
负责与后端 API 交互
- **client.ts**: 配置 axios/fetch 客户端
- **interceptors.ts**: 请求/响应拦截
- **endpoints/**: 按功能分类的 API 端点

### 2. 业务逻辑层 (`src/services/`)
复杂业务逻辑和数据处理
- **modules/**: 各业务模块的服务（stock、account 等）
- 不涉及 UI 展示，专注数据处理

### 3. 状态管理层 (`src/stores/`)
使用 Zustand 管理全局状态
- **modules/**: 按功能分类的状态模块
- 缓存、用户信息、股票数据等

### 4. UI 层 (`src/components/`)
- **ui/**: 可复用的基础 UI 组件
- **common/**: 通用业务组件（Header、Sidebar 等）
- **business/**: 特定业务的复杂组件

### 5. 页面层 (`src/pages/`)
完整的页面组件
- 组合多个 components
- 处理路由和页面级逻辑

## 🔄 数据流

```
用户交互
    ↓
Page Component
    ↓
Business Component
    ↓
Hooks / Services
    ↓
Store (Zustand)
    ↓
API Client
    ↓
Backend API
```

## 📦 关键文件说明

| 文件 | 用途 |
|------|------|
| `src/api/client.ts` | HTTP 客户端配置 |
| `src/constants/` | 枚举值、API 路径常量 |
| `src/hooks/` | 可复用的 React Hooks |
| `src/services/modules/` | 业务逻辑（不依赖 UI） |
| `src/stores/` | 全局状态管理 |
| `src/typings/` | 所有 TypeScript 类型定义 |
| `src/config/routes.ts` | 路由配置 |

## 🎯 最佳实践

### 1. 组件命名
```
- 页面组件: PascalCase + Page 后缀 (e.g., StockDetailPage)
- 业务组件: PascalCase (e.g., StockCard)
- 通用组件: PascalCase (e.g., LoadingSpinner)
- Hooks: camelCase + use 前缀 (e.g., useStock)
```

### 2. 导入路径
```typescript
// ✅ 推荐使用别名
import { useStock } from '@/hooks';
import { StockService } from '@/services/modules';

// ❌ 避免相对路径
import { useStock } from '../../../../../hooks';
```

### 3. 组件结构
```typescript
// 1. Imports
import { FC } from 'react';

// 2. Types
interface Props { ... }

// 3. Component
const Component: FC<Props> = (props) => { ... }

// 4. Exports
export default Component;
```

### 4. Service 层
```typescript
// services/modules/stockService.ts
export class StockService {
  static async getQuote(symbol: string) { ... }
  static parseData(data: any) { ... }
}
```

### 5. 状态管理
```typescript
// stores/modules/stock.ts
export const useStockStore = create((set) => ({
  stocks: [],
  setStocks: (stocks) => set({ stocks }),
}))
```

## 🚀 开发工作流

1. **新功能开发**
   - 在 `src/pages/` 创建页面
   - 在 `src/components/business/` 创建业务组件
   - 在 `src/services/modules/` 创建业务逻辑
   - 在 `src/stores/` 管理状态
   - 在 `src/api/endpoints/` 定义 API

2. **代码重用**
   - 可复用组件放到 `src/components/common/`
   - Hooks 放到 `src/hooks/`
   - 工具函数放到 `src/utils/`

3. **类型安全**
   - 所有 API 响应定义在 `src/typings/`
   - Service 参数和返回值需要类型注解
   - 严格使用 TypeScript



我在项目/Users/mm/Documents/quant-lab/cn-stock-platform/src/pages/Strategy和
/Users/mm/Documents/quant-lab/cn-stock-platform/src/pages/Backtest 中写了两个页面，我觉得不够专业。
现在我要生成一个专业的策略与回测功能。以下是我的需求，请你理解下面的需求，然后整理一份todo文档。在/Users/mm/Documents/quant-lab/cn-stock-platform/src/pages 下实现我的前端开发的需求。旧的Strategy和backtest可以删除，他们用到的旧的组件，引用都删除
---

# 目标简介

* 支持两类用户路径：

  1. **非编程用户（图形化/模板流程）**：拖拽 / 配置式构建策略、可视化回测与回放。
  2. **编程用户（代码/研究环境）**：内置代码 IDE、完整参数化、回测脚本执行、扩展库支持。
* 两条路径实时**互导互转**：可视化策略可以“导出”为代码，代码策略可以“生成”可视化视图（尽可能自动映射常见指标与规则）。
* UX 原则：统一导航、简洁设定、强提示与版本可逆、回测/实盘流程无缝衔接。

---

# 路由（React + Ant Design Pro 风格）

```
/dashboard
/strategies           -> 策略管理（列表）     
/strategy/:id         -> 策略详情（双模式：Visual / Code）
/backtests            -> 回测管理（任务列表）
/backtest/:id         -> 回测结果详情页
/replay               -> 交互回放（历史回放 / 训练）
/data                 -> 数据管理（历史行情、因子）
/strategy/analytics            -> 策略比较 / 参数优化仪表盘
```

---

# 全局 UI 布局（文本可视化草图）

```
+---------------------------------------------------------------------------------+
| TOP NAV: Logo | Dashboard | 策略 | 回测 | 回放 | 数据 | 分析 | 用户(菜单) | 搜索 |
+---------------------------------------------------------------------------------+
| Sider:                               | Main Content Area                        |
| - 我的策略                           |  Breadcrumbs / Page Title                |
| - 创建新策略                         |                                          |
| - 回测历史                           |  [Controls area: mode tabs / actions]    |
| - 数据源管理                         |                                          |
| - 模板市场                           |                                          |
+--------------------------------------+-------------------------------------------+
|                                                                       |         |
|  左侧栏 (可折叠)                                                      | right   |
|  - 资源树 / 策略变量                                                   | panel   |
|  - 可切换显示模板、示例策略                                            | (context|
|                                                                       |  help)  |
+-----------------------------------------------------------------------+---------+
```

---

# 关键页面详解（含文本草图、组件与交互）

## A. 策略列表（/strategies）

```
+---------------------------------------------------------------+
| Header: 搜索栏 | 新建策略(下拉: 可视化/代码模板) | 导入 | 导出 |
+---------------------------------------------------------------+
| Filters: 状态 | 类型(日内/波段/期权) | 标签 | 最近回测 |
+---------------------------------------------------------------+
| Table: 策略名 | 类型 | 作者 | 最新回测 | 状态 | 操作(编辑/回测/克隆/删除) |
+---------------------------------------------------------------+
```

**功能点**

* 支持按标签/资产/回测结果筛选、排序。
* 批量操作：批量回测、批量启用/禁用。
* 每行有“可视化预览/快速回测”快捷动作（弹出小窗显示收益曲线快照）。

---

## B. 策略详情（/strategy/:id） — 双模式视图（核心）

页面顶部：Mode 切换按钮（Visual | Code | Hybrid）

### B1. Visual Mode（可视化 / 非编程用户）

```
+---------------------------------+---------------------------------+
| 左：可视化组件库（指标/信号）   | 右：策略工作区（流程画布/步骤列表） |
| - MA, RSI, MACD, ATR, Candle   | +---------------------------------+
| - Entry / Exit blocks          | | 步骤1: 指标A (MA 10>20)         |
| - Position Sizing              | | 步骤2: 条件: RSI < 30           |
| - Risk Rules (stop/take)       | | 步骤3: 执行: 市价买入           |
|                                | +---------------------------------+
| Drag & Drop → 链接节点形成策略流程                                    |
+----------------------------------------------------------------------+
| 底部：参数面板（可批量生成参数表）  | 按钮: 保存模板 | 导出为代码 | 测试单条数据 |
+----------------------------------------------------------------------+
```

**特点**

* 模块化组件：每个模块有可配置表单（周期、阈值、持续时间）。
* 支持“回放模式”快速在选定时间段内可视化策略执行（秒级反馈或通过小样本数据）。
* “导出为代码”会把可视化逻辑映射为标准策略脚本（Python/JS），保留注释与参数表。

### B2. Code Mode（编程用户）

```
+-------------------------------------------+-------------------+
| 左：代码编辑器 (Monaco)                   | 右：实时预览 / 控制 |
| - 文件树: main.py / params.json / utils   | - 参数快照         |
| - Run locally / Run cloud / Lint / Test   | - 单步回测（Sample）|
|                                           | - 导出回测任务     |
+-------------------------------------------+-------------------+
| 底部：终端 / 日志 / 回测历史                 | 操作: 保存 | 运行回测 |
+-------------------------------------------+---------------------------------+
```

**特点**

* 内置 IDE 支持语法高亮、自动补全（策略 SDK）、代码片段、单元测试框架。
* 提供“可视化映射”面板（右侧）展示：若代码含标准指标/信号，可自动生成对应的 Visual 流程图（仅对识别到的结构有效）。

### B3. Hybrid（混合）

同时显示 Visual 画布与 Code 编辑器，修改一端会实时同步到另一端（或按“Sync”按钮进行同步）。需要实现双向转换器（Visual → Code 与 Code → Visual），对复杂逻辑降级提示并允许用户手动调整。

---

## C. 回测创建 / 提交（Quick & Advanced）

```
+-----------------------------+---------------------------------+
| 左：回测配置                | 右：快速结果预览(运行中/完成)    |
| - 策略选择: 下拉             | - Top KPIs: 总收益/年化/回撤等   |
| - 时间段: start/end         | - Equity curve (interactive)    |
| - 数据源: tick/1m/1d        | - 交易明细 (分页)               |
| - 初始资金/手续费/滑点/杠杆  | - 回测日志 / 警告                |
| - 参数化表 (支持批量回测)    |                                 |
| Buttons: Run Backtest | Save Config | Optimize | Cancel |
+--------------------------------------------------------------+
```

**交互**

* 支持**并行批量回测**（参数扫描）和**分布式回测队列**（后端处理），前端显示任务进度、每个任务的 KPI 快照。
* 长任务通过 WebSocket 推送进度与日志，并可在任意时刻中断或查看中间结果。

---

## D. 回测结果详情（/backtest/:id）

```
+--------------------------------------------------------------+
| Top Banner: Key KPIs (总收益、年化、最大回撤、夏普、交易数)  |
+--------------------------------------------------------------+
| Left: Charts (tab)                | Right: Panels            |
| - Equity Curve (主图)             | - 参数摘要               |
| - Drawdown                        | - 交易明细表（分页/过滤) |
| - 持仓/仓位图                      | - 回测设置按钮(复制/重新跑)|
| - 单笔盈亏分布                     | - 版本/注释             |
+--------------------------------------------------------------+
| Bottom: Strategy Walkthrough（回放/逐笔回测）               |
| - 时间轴滑块可播放策略执行，支持 step-by-step 或 speed 控制   |
+--------------------------------------------------------------+
```

**特点**

* 图表交互丰富：缩放、悬停序列信息、选择时间段重新计算 KPIs。
* 可导出 CSV/Excel，包括完整交易日志、订单簿快照（若可用）。

---

## E. 回放 / 训练页面（Replay）

* 以 FX Replay 思路：把历史行情“回放”，支持人为交互（以训练交易执行、检验信号在真实tick下的敏感性）。
* 在 Visual 策略工作区可直接切换到 “回放” 模式，实盘/回测行为可视化，支持逐笔停顿、模拟滑点、手动干预。

---

# 核心功能与实现细节（技术侧要点）

## 1. 双向策略表达（Visual <-> Code）

* **中间表示（IR）**：设计一套 JSON Schema 表示策略（指标、条件、执行、风控）。Visual 编辑器直接编辑 IR，Code 编辑器通过代码生成/解析器把代码转换为 IR（或反之）。
* **限制与补偿**：对于无法自动映射的复杂代码，Code→Visual 给出“部分可视化”或“需要人工映射”的提示，并在 Visual 上显示“自定义脚本节点”。

## 2. 回测任务处理

* 前端提交回测任务到后端（REST POST /api/backtests），后端返回任务 id。前端通过 WebSocket /api/backtests/{id}/ws 订阅日志与进度。
* 支持“参数扫表”时返回 summary 列表，前端提供 heatmap / table 快速筛选最优参数组合。

## 3. 图表与可视化库建议
* **交互性/通用图表**：ECharts（国内团队熟悉，支持大数据量交互）用于 KPI 面板、热力图、参数扫描可视化。
* **回放可视化**：自定义 canvas / WebGL 层显示逐笔交易与订单簿快照（必要时使用 WebGL 提升性能）。

## 4. 代码编辑器与文件系统

* 使用 **Monaco Editor**（VS Code 引擎）嵌入，支持语法、lint、自动补全；后端暴露策略 SDK 类型定义以支持 Intellisense。
* 文件树支持策略脚本、参数 JSON、依赖库（用户脚本包），并支持版本切换。

## 5. 数据管理

* 数据页面展示可用标的、时间范围、数据质量指标（缺失率、复权类型）。支持用户上传私有数据（CSV）并做映射。
* 提供“示例数据 / 快速回测样本”用于 Visual 模式即时预览。

## 6. 版本与审批流

* **策略版本**：每次保存策略生成版本（semver-like），可以回滚。版本与回测任务绑定（回测引用策略版本 id）。
* **审核/发布流程**（团队版）：策略发布到“生产/实盘”需审批（可审计更改），并生成变更日志。

## 7. 权限与多用户

* 角色：Admin / Developer / Analyst / Viewer。权限控制策略编辑、回测提交、数据上传、发布权限。
* 团队共享策略库、模板市场（内部/外部）。

## 8. 性能与伸缩

* 回测采用分布式队列（Kubernetes + Celery / Ray / Dask），前端只负责提交、展示与交互。
* 前端对大型数据（tick 级）仅请求必要切片（分页 / Downsampling），减少网络与渲染压力。

---

# UX 细节与可用性建议

* **新手引导（Onboarding）**：首次进入显示“快速开始”流程 — 选择模板 → 运行 1 分钟回测 → 查看结果。
* **模板市场**：内置常用策略模板（均线交叉、RSI 策略、布林带），并分等级（初级/中级/高级）和标签。
* **交互提示**：Visual 编辑器操作带即时提示（例如，“该节点可能导致高频交易，请设置频率限制”）。
* **错误与可恢复性**：代码和可视化编辑均提供撤销/重做与自动草稿保存。
* **导出/共享**：策略可导出为 zip（代码 + params + README），或直接生成分享链接（只读/可编辑权限）。

---

# Ant Design Pro + React 组件映射（便于开发）

* 页面容器：`ProLayout`、`PageContainer`
* 表单与参数：`Form`、`ProForm`（支持动态表单生成）
* 表格 / 列表：`ProTable`
* 模态 / 操作确认：`Modal`、`Popconfirm`
* 文件树：`rc-tree` 或 `react-sortable-tree`
* 编辑器：`Monaco Editor` React 封装
* 通知/Toast：`message` / `notification`
* 实时通信：`WebSocket` + `Antd` 进度条组件



下面是把 **策略详情（含 Visual / Code / Hybrid）**、**回测创建与结果页**、**回放（Replay）页** 三个重要页面，做成更细致的 **可视化文本草图（ASCII / Markdown）**。每个页面都包含：整体布局、各组件位置、交互说明、常用操作与开发字段（便于前端/后端对接）。

# 策略详情页 — 双模式（Visual / Code / Hybrid）

```
PAGE: /strategy/:id
TopBar: [Logo] [Dashboard] [策略] [回测] [回放] [数据] [用户 ▼]  Search: [______]

+---------------------------------------------------------------------------------------------+
| Breadcrumb: Home / 策略 / <策略名>                     Mode: [Visual] [Code] [Hybrid] [Run] |
+---------------------------------------------------------------------------------------------+

Main layout: 3-column responsive (Wide desktop)
+---------------------------+----------------------------------------------+--------------------+
| LEFT PALETTE (collapsed)  | CENTER: WORKSPACE                             | RIGHT: PROPS PANEL |
| (可折叠)                  |                                              | (上下两部分)       |
|                           | +------------------------------------------+ | +----------------+ |
| - Components              | | Canvas / Code Editor (depends on mode)   | | | Params         | |
|   • Indicators (MA, RSI)  | |                                          | | | - initial_cap:  | |
|   • Entry/Exit blocks     | |  Visual Mode: Flow canvas                 | | | - commission:   | |
|   • Risk Rules            | |  - draggable nodes                         | | | - params json   | |
|   • Position Sizing       | |  - link / conditions                      | | | [Save Params]   | |
| - Templates               | |  - mini-preview (sample equity)           | | +----------------+ |
| - Examples                | |                                          | | +----------------+ |
|                           | |  Code Mode: Monaco Editor (monospace)     | | | Version        | |
|                           | |  - file tabs: main.py | params.json       | | | - v1.2.0       | |
|                           | |  - run / lint / format buttons            | | | [Revert]       | |
|                           | +------------------------------------------+ | +----------------+ |
|                           |                                              |                    |
|                           | Bottom strip: [Preview Sample] [Export Code] |                    |
+---------------------------+----------------------------------------------+--------------------+

VISUAL MODE — details:
- Canvas area shows nodes: (Indicator nodes) -> (Condition nodes) -> (Order nodes)
- Node click opens small modal / inline form to edit parameters.
- Drag + connect to add flow. Right-panel shows node-level props, test sample button.
- Quick actions: [Run Quick Sample] (uses last 1 week of data) => shows overlay equity sparkline.

CODE MODE — details:
- Monaco editor with file-tree on left of the editor (main.py, utils.py, params.json)
- Right panel shows: Detected params (auto parsed), quick-run buttons, lint output.
- Buttons above editor: [Save] [Run Backtest] [Quick Sample] [Export Snapshot]

HYBRID MODE:
- Split view: left half Canvas, right half Code editor
- Two sync modes: Auto-Sync (live) / Manual Sync (press [Sync Visual→Code] or [Sync Code→Visual])
- For unsupported code constructs, Visual shows a "CustomScript" node with raw code badge.

KEY INTERACTIONS:
- Create node: drag from palette → drop on canvas.
- Convert Visual → Code: [Export Code] generates annotated Python/JS.
- Convert Code → Visual: parser tries to map standard indicators/conditions. If partial, mark nodes "manual mapping required".

NOTES (dev):
- IR Schema: nodes[] with ids, type, params.
- API endpoints: GET /api/strategies/:id, POST /api/strategies/:id/save, POST /api/strategies/:id/compile
- WebSocket for quick-sample logs: /ws/strategies/:id/logs
```

---

# 回测创建页 & 回测结果页

```
PAGE: /backtests (列表)  &  /backtest/:id (详情)

A) Backtests List (管理页)
+---------------------------------------------------------------------------------+
| Header: [New Backtest ▼]  Search: [strategy/name/id]  Filters: status/date/asset |
+---------------------------------------------------------------------------------+
| Table:                                                                         |
|  # | Backtest Name | Strategy | Params Tag | Start - End | Status | KPIs (mini) |
|----|---------------|----------|------------|-------------|--------|------------|
| 1  | BT_MA_2025    | MA_Cross | {p1=10}    | 2020-01-01.. | Done   | ROI:8% ...|
|    | Actions: [View] [Clone] [Cancel] [Export]                                   |
+---------------------------------------------------------------------------------+

B) Create / Configure Backtest (modal or page)
+---------------------------------------------+-------------------------------+
| Left: Config Form                            | Right: Live Summary / Preview |
| - Strategy: [select dropdown]                 | - Quick KPIs (estimates)      |
| - Version: [v1.2.0]                           | - Equity sparkline (sample)   |
| - Time range: [start] [end]                   | - Warnings: data gaps         |
| - Data source: [primary] [alternative]        | - Estimated run time          |
| - Initial capital: [100000]                   | - Memory/CPU hint             |
| - Commission, Slippage, Min Size              | - Param table preview         |
| - Param sweep: add param grid (auto expand)   | Buttons: [Run] [Save Config]  |
+---------------------------------------------+-------------------------------+

C) Backtest Result Page (/backtest/:id)
Top Banner:
+---------------------------------------------------------------------------------+
| Backtest: BT_MA_2025         Strategy: MA_Cross (v1.2.0)   Status: DONE         |
| KPIs: Total Return: 12.4%  | Annualized: 8.6%  | Max Drawdown: -6.1% | Sharpe:1.24 |
+---------------------------------------------------------------------------------+

Main area: two-column
+-------------------------------+----------------------------------------------+
| LEFT TABS (Charts)            | RIGHT PANELS                                 |
| - [Equity Curve]              | - Summary Card (params + config)             |
| - [Drawdown]                  | - Trade Log (filter: win/loss, size, symbol) |
| - [Positions / Exposure]      | - Orders / Execution details                  |
| - [Single Trade P/L]          | - Alerts / Warnings (data integrity)         |
|                               | - Related Backtests (versions / clones)      |
+-------------------------------+----------------------------------------------+

Charts area details:
- Equity Curve: interactive, hover shows date & equity. Range selector below (1m, 3m, 1y, All).
- Drawdown: max drop segments highlighted.
- Positions: stacked area showing net exposure over time.
- Single-trade scatter: x=time, y=profit, size=trade size; click points reveal trade row.

Bottom: Replay mini-player (linked to Replay page)
- Timeline slider + Play / Pause / Step Forward / Step Backward
- Speed control: 0.25x / 0.5x / 1x / 2x / 5x
- Checkbox: Show orders / Show fills / Show market data overlays

Actions:
- [Export Results CSV] [Export Trades CSV] [Create Report (PDF)] [Rerun with changes]
- For batch param-sweep, show heatmap: paramA vs paramB colored by metric (Sharpe/Return).

NOTES (dev):
- APIs: POST /api/backtests start => returns taskId; GET /api/backtests/:id/results
- WS: /ws/backtests/:taskId for live logs & partial results
- Frontend should request downsampled series for charting; support pagination for trade logs.
```

---

# 回放（Replay / Training）页面

```
PAGE: /replay

Purpose: 以“真实市场回放”方式观察策略在 tick/bar 级别的行为，适合训练与调试。

Layout:
+---------------------------------------------------------------------------------+
| Header: Choose Market / Symbol [AAPL]  Timeframe: [1m / tick / 1s]  Date: [____]|
+---------------------------------------------------------------------------------+

Main:
+--------------------------------------------------------------+-----------------+
| Left: Controls & Layers                                       | Right: Context   |
| - Time selector / Range picker                                | - Order book     |
| - Playback controls: [<<] [<] [Play] [>] [>>]  Speed slider   | - Current ticks  |
| - Mode: Auto-play / Step-by-step / Manual (pause to exec)     | - Strategy status|
| - Inject manual order (simulate)                              | - Logs / Alerts  |
| - Toggle overlays: show indicators / show signals / show fills |                 |
+--------------------------------------------------------------+-----------------+

Center Canvas:
- Large price chart (TradingView/LWC). As playhead moves:
  - Visual nodes highlight executed signals on chart (entry markers, exit markers)
  - Trade tooltip shows order details, latency, simulated slippage
- Below chart: mini-trades table for current timeframe (auto-scroll)

Right Context:
- Order Book snapshot (if available) / Depth chart
- Account summary: cash, positions, unrealized P/L
- Step controls: Step Size [1 bar / N ticks], Auto-advance checkbox

Use Cases:
- QA: reproduce a trade => inspect the exact tick when signal triggered
- Training: trader interacts with replay, places manual overrides, records decisions
- Debug: show execution latency, reject reasons in simulated environment

Buttons:
[Save Replay Session] [Export Clip (start->end)] [Annotate] [Create Issue]

NOTES (dev):
- Streaming: server must supply time-sliced market data (chunked). WS endpoint /ws/replay/:sessionId
- For large tick data, precompute downsampled levels for UI and fetch high-res only when zooming.
```

