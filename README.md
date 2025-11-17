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

在项目的/workspaces/cn-stock-platform/src/pages/Market 路径中，我写了一些使用scichart 库的一些包含图表页面，现在我不想使用scichart了，我想改用
echarts-for-react 来呈现这些图表。请你移除scichart的使用，改用echarts-for-react，
