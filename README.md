# 中国A股分析平台

> 基于 React 18 + Umi 4 + Ant Design 5 + TypeScript 构建的现代化股票分析平台

## 📋 项目概述

本项目是对 [Stocknear Frontend](https://github.com/stocknear/frontend) 的全面重构，采用最新的技术栈，并适配中国A股市场特色功能。

### 核心技术栈

- **前端框架**: React 18 + Ant Design Pro v5
- **框架内核**: Umi 4 (基于 Vite)
- **UI 组件**: Ant Design v5 (Token 化主题)
- **状态管理**: Zustand + React Query
- **数据可视化**: AntV G2Plot
- **样式方案**: Less + CSS Modules
- **工程化**: pnpm + ESLint + Prettier + Husky
- **测试**: Vitest + Playwright

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:8000
```

### 构建

```bash
# 生产构建
pnpm build

# 预览构建结果
pnpm preview
```

### 代码检查

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint:fix

# Prettier 格式化
pnpm prettier
```

### 测试

```bash
# 单元测试
pnpm test

# E2E 测试
pnpm test:e2e
```

## 📁 项目结构

```
cn-stock-platform/
├── config/                 # Umi 配置
│   ├── config.ts          # 主配置文件
│   ├── routes.ts          # 路由配置
│   └── proxy.ts           # 代理配置
├── mock/                   # Mock 数据
├── public/                 # 静态资源
├── src/
│   ├── components/        # 全局组件
│   │   ├── Charts/       # 图表组件
│   │   ├── SearchBar/    # 搜索栏
│   │   ├── StockCard/    # 股票卡片
│   │   └── ...
│   ├── hooks/            # 自定义 Hooks
│   │   ├── useWebSocket.ts
│   │   ├── useStock.ts
│   │   └── ...
│   ├── layouts/          # 布局组件
│   │   ├── BasicLayout/
│   │   └── UserLayout/
│   ├── locales/          # 国际化
│   │   ├── zh-CN/
│   │   └── en-US/
│   ├── models/           # 状态管理 (Zustand)
│   │   ├── stock.ts     # 股票状态
│   │   ├── user.ts      # 用户状态
│   │   └── cache.ts     # 缓存管理
│   ├── pages/            # 页面组件
│   │   ├── Home/        # 首页
│   │   ├── Stock/       # 股票详情
│   │   │   ├── Detail/
│   │   │   └── components/
│   │   ├── Market/      # 市场数据
│   │   │   ├── Mover/   # 涨跌榜
│   │   │   ├── Flow/    # 资金流向
│   │   │   └── Calendar/ # 财报日历
│   │   ├── Analysis/    # 分析工具
│   │   │   ├── Screener/ # 选股器
│   │   │   └── ...
│   │   ├── ChinaFeatures/ # 中国特色功能
│   │   │   ├── DragonTiger/ # 龙虎榜
│   │   │   ├── Northbound/  # 北向资金
│   │   │   ├── Margin/      # 融资融券
│   │   │   └── Concept/     # 概念板块
│   │   └── User/        # 用户中心
│   ├── services/         # API 服务
│   │   ├── request.ts   # 请求封装
│   │   ├── stock.ts     # 股票 API
│   │   ├── market.ts    # 市场 API
│   │   └── ...
│   ├── utils/            # 工具函数
│   │   ├── format.ts    # 格式化工具
│   │   ├── validators.ts # 验证工具
│   │   └── ...
│   ├── constants/        # 常量定义
│   │   ├── market.ts    # 市场常量
│   │   └── api.ts       # API 路径
│   └── typings/          # TypeScript 类型
│       ├── stock.d.ts   # 股票类型
│       └── china-features.d.ts # 中国特色功能类型
├── tests/                # 测试文件
├── .eslintrc.js         # ESLint 配置
├── .prettierrc.js       # Prettier 配置
├── .umirc.ts            # Umi 配置
├── tsconfig.json        # TypeScript 配置
└── package.json
```

## 🎯 核心功能

### 基础功能

- ✅ 股票实时行情（WebSocket）
- ✅ K线图表（多周期）
- ✅ 分时图
- ✅ 股票搜索
- ✅ 自选股管理
- ✅ 市场涨跌榜
- ✅ 资金流向分析
- ✅ 财报日历

### 分析工具

- ✅ 选股器（多维度筛选）
- ✅ 技术指标分析
- ✅ 财务数据分析
- ✅ 股东持仓分析
- ✅ 新闻公告追踪

### 中国特色功能

- ✅ **龙虎榜**: 大单交易监控
- ✅ **北向资金**: 沪深港通资金流向
- ✅ **融资融券**: 两融余额追踪
- ✅ **概念板块**: 热点板块分析
- ✅ **大宗交易**: 大宗交易监控
- ✅ **ST预警**: 特别处理股票提示
- ✅ **涨跌停统计**: 涨跌停板分析

### 用户系统

- ✅ 登录注册
- ✅ 会员体系（Free/Pro/Premium）
- ✅ 通知系统
- ✅ 个人中心

## 🎨 设计规范

### 代码规范

#### 单文件行数限制

- UI组件: ≤ 150行
- 业务组件: ≤ 250行
- 页面组件: ≤ 300行（超过则拆分子组件）

#### 命名规范

```typescript
// 组件: PascalCase
StockDetailCard.tsx

// 函数: camelCase
formatStockPrice()

// 常量: UPPER_SNAKE_CASE
const API_BASE_URL = 'xxx';

// Hook: use前缀
useStockData()

// 类型: PascalCase + Interface/Type
interface StockQuote {}
type StockSymbol = string;
```

#### 目录规范

```
pages/Stock/Detail/
├── index.tsx              # 页面入口（≤100行）
├── components/            # 页面级组件
│   ├── PriceCard/
│   │   ├── index.tsx
│   │   ├── index.less
│   │   └── types.ts
│   └── ...
├── hooks/                 # 页面级 Hooks
│   └── useStockDetail.ts
├── services/              # 页面级 API
│   └── index.ts
└── index.less            # 页面样式
```

### TypeScript 规范

```typescript
// 1. 优先使用 interface
interface StockInfo {
  symbol: string;
  name: string;
  price: number;
}

// 2. 为 API 响应定义类型
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 3. 组件 Props 必须定义类型
interface StockCardProps {
  stock: StockInfo;
  onClick?: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  // ...
};
```

### 注释规范

```typescript
/**
 * 获取股票实时行情
 * @param symbol 股票代码（如：600000.SH）
 * @param options 请求选项
 * @returns Promise<StockQuote>
 */
export async function getStockQuote(
  symbol: string,
  options?: RequestOptions
): Promise<StockQuote> {
  // 实现
}
```

## 📊 数据源

### 行情数据

- 新浪财经 API
- 东方财富 API
- Tushare Pro
- 聚宽数据

### 实时推送

- 自建 WebSocket 服务
- 订阅机制
- 心跳保活
- 断线重连

### 缓存策略

- React Query: 服务端数据缓存
- Zustand: 全局状态管理
- LocalStorage: 持久化存储
- 缓存过期时间: 5分钟

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 下创建页面目录
2. 创建 `index.tsx` 作为页面入口
3. 在 `.umirc.ts` 中添加路由配置
4. 创建对应的 API 服务

### 添加新组件

1. 在 `src/components/` 下创建组件目录
2. 创建 `index.tsx` 和 `index.less`
3. 定义 `types.ts` 或使用内联类型
4. 编写组件文档和示例

### 添加新 API

1. 在 `src/services/` 中创建服务文件
2. 使用统一的 `request` 方法
3. 定义请求和响应类型
4. 添加错误处理

### 状态管理

```typescript
// 1. 定义状态
interface MyState {
  data: any;
  setData: (data: any) => void;
}

// 2. 创建 Store
export const useMyStore = create<MyState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));

// 3. 使用
const { data, setData } = useMyStore();
```

## 🧪 测试

### 单元测试

```typescript
// src/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from '../format';

describe('formatPrice', () => {
  it('应该正确格式化价格', () => {
    expect(formatPrice(123.456)).toBe('123.46');
    expect(formatPrice(undefined)).toBe('--');
  });
});
```

### 组件测试

```typescript
// src/components/StockCard/__tests__/index.test.tsx
import { render, screen } from '@testing-library/react';
import StockCard from '../index';

test('渲染股票卡片', () => {
  const stock = { symbol: '600000.SH', name: '浦发银行', price: 10.5 };
  render(<StockCard stock={stock} />);
  expect(screen.getByText('浦发银行')).toBeInTheDocument();
});
```

### E2E 测试

```typescript
// tests/stock-detail.spec.ts
import { test, expect } from '@playwright/test';

test('股票详情页加载', async ({ page }) => {
  await page.goto('/stock/600000.SH');
  await expect(page.locator('.stock-price')).toBeVisible();
});
```

## 📝 Git 规范

### Commit Message

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加龙虎榜功能
fix: 修复K线图显示错误
docs: 更新README文档
style: 代码格式化
refactor: 重构股票详情页
perf: 优化列表渲染性能
test: 添加单元测试
chore: 更新依赖版本
```

### 分支管理

- `main`: 主分支（生产环境）
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支

## 🚀 部署

### 构建

```bash
pnpm build
```

### 部署方式

- **Vercel**: 推荐，自动CI/CD
- **Nginx**: 传统部署方式
- **Docker**: 容器化部署

### 环境变量

```bash
# .env.production
API_URL=https://api.example.com
WS_URL=wss://ws.example.com
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📞 联系方式

- 项目地址: [GitHub](https://github.com/your-repo/cn-stock-platform)
- 问题反馈: [Issues](https://github.com/your-repo/cn-stock-platform/issues)

## 🙏 致谢

- [Stocknear](https://github.com/stocknear/frontend) - 原项目
- [Ant Design](https://ant.design/) - UI 组件库
- [Umi](https://umijs.org/) - 企业级前端框架
- [React](https://react.dev/) - 前端框架

---

**Made with ❤️ by China Stock Platform Team**
