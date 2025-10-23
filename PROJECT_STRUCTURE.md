# 项目结构说明

## 当前项目结构

```
cn-stock-platform/
├── 📄 README.md                  # 项目说明
├── 📄 ARCHITECTURE.md            # 架构文档
├── 📄 STYLE_GUIDE.md            # 样式指南
├── 📄 COLOR_SCHEME.md           # 色彩方案
├── 📄 CODE_REVIEW_REPORT.md     # 代码审查报告
├── 📄 API_DOCUMENTATION.md      # API 文档
├── 📄 CONTRIBUTING.md           # 贡献指南
│
├── 📁 scripts/                  # 构建和工具脚本
│   └── generate-openapi-from-requests.sh
│
├── 📁 public/                   # 静态资源
│   ├── favicon.ico
│   ├── logo.svg
│   └── icons/
│
├── 📁 config.bak/              # 原始配置备份
│
├── 📁 docs/                     # 文档和生成的 API 规范
│   ├── api-spec.html           # Swagger UI
│   └── API_DOCS_GUIDE.md       # API 使用指南
│
├── 📁 mock/                     # Mock 数据
│   ├── user.ts
│   └── ...
│
├── 📁 src/                      # 源代码
│   ├── 📁 api/                  # API 层
│   │   ├── client.ts           # (需要创建)
│   │   ├── interceptors.ts      # (需要创建)
│   │   └── endpoints/           # (需要创建)
│   │
│   ├── 📁 components/           # React 组件
│   │   ├── 📁 ui/               # 基础 UI 组件
│   │   ├── 📁 common/           # 通用业务组件
│   │   │   ├── LoadingSpinner/
│   │   │   ├── SearchBar/
│   │   │   └── TabLayout/
│   │   └── 📁 business/         # 业务组件
│   │       ├── Account/
│   │       ├── Strategy/
│   │       └── ...
│   │
│   ├── 📁 config/               # 配置文件
│   │   ├── defaultSettings.ts
│   │   ├── routes.ts
│   │   └── proxy.ts
│   │
│   ├── 📁 constants/            # 全局常量
│   │   ├── 📁 api/              # API 端点常量
│   │   ├── 📁 enums/            # 枚举值
│   │   └── 📁 config/           # 配置常量
│   │
│   ├── 📁 hooks/                # React Hooks
│   │   ├── 📁 useApi/           # API 相关 Hooks
│   │   ├── 📁 useAuth/          # 认证 Hooks
│   │   └── 📁 useTheme/         # 主题 Hooks
│   │
│   ├── 📁 layouts/              # 布局组件
│   │   ├── BasicLayout.tsx      # (需要创建)
│   │   └── UserLayout.tsx       # (需要创建)
│   │
│   ├── 📁 pages/                # 页面组件
│   │   ├── 📁 Account/
│   │   ├── 📁 Stock/
│   │   ├── 📁 Strategy/
│   │   └── ...
│   │
│   ├── 📁 services/             # 业务服务层
│   │   ├── 📁 modules/          # 业务模块
│   │   │   ├── stockService.ts  # (需要迁移)
│   │   │   ├── accountService.ts # (需要迁移)
│   │   │   └── ...
│   │   └── request.ts
│   │
│   ├── 📁 stores/               # 状态管理 (Zustand)
│   │   ├── 📁 modules/          # 状态模块
│   │   │   ├── cache.ts
│   │   │   ├── stock.ts
│   │   │   └── user.ts
│   │   └── watchlist.ts
│   │
│   ├── 📁 styles/               # 全局样式
│   │   ├── global.less          # ✅ 已移动
│   │   └── global.style.ts      # ✅ 已移动
│   │
│   ├── 📁 typings/              # TypeScript 类型定义
│   │   ├── global.d.ts          # ✅ 已移动
│   │   ├── index.d.ts           # ✅ 已移动
│   │   ├── stock.d.ts           # ✅ 已移动
│   │   ├── backtest.ts          # ✅ 已移动
│   │   ├── strategy.ts          # ✅ 已移动
│   │   └── ...
│   │
│   ├── 📁 i18n/                 # 国际化
│   │   ├── 📁 en-US/            # ✅ 已移动
│   │   └── 📁 zh-CN/            # ✅ 已移动
│   │
│   ├── 📁 utils/                # 工具函数
│   │   ├── format.ts
│   │   ├── request.ts
│   │   └── notification.ts
│   │
│   ├── app.tsx                  # 主应用组件
│   ├── access.ts                # 权限控制
│   ├── request.ts               # 请求配置
│   └── requestErrorConfig.ts    # 错误处理
│
├── 📁 tests/                    # 测试文件
│   └── setupTests.jsx
│
├── 📁 types/                    # (已废弃，内容已迁移到 src/typings/)
│
├── 📄 package.json              # 项目依赖
├── 📄 tsconfig.json             # TypeScript 配置
├── 📄 jest.config.ts            # Jest 测试配置
├── 📄 biome.json                # Biome 代码格式化配置
├── 📄 pnpm-lock.yaml            # 包管理锁文件
└── 📄 openapi.json              # 自动生成的 OpenAPI 规范
```

## 状态说明

- ✅ 已完成迁移
- 📝 需要创建
- ⚠️  需要重构

## 下一步计划

### 阶段 1: 完成基础设施 (立即)

1. **创建 API 客户端**
   - [ ] `src/api/client.ts` - 配置 HTTP 客户端
   - [ ] `src/api/interceptors.ts` - 请求/响应拦截

2. **创建常量管理**
   - [ ] `src/constants/api/endpoints.ts` - API 端点常量
   - [ ] `src/constants/enums/index.ts` - 业务枚举值
   - [ ] `src/constants/config/index.ts` - 系统配置常量

3. **创建基础 Hooks**
   - [ ] `src/hooks/useApi/` - API 请求 Hook
   - [ ] `src/hooks/useAuth/` - 认证 Hook
   - [ ] `src/hooks/useTheme/` - 主题切换 Hook

### 阶段 2: 迁移现有代码 (本周)

1. **整理 Services**
   - [ ] 整合 `src/services/*.ts` 到 `src/services/modules/`
   - [ ] 统一命名规范

2. **优化 Components**
   - [ ] 业务组件分类到 `business/`
   - [ ] 通用组件保留在 `common/`

### 阶段 3: 代码优化 (下周)

1. **路径别名**
   - [ ] 更新所有导入路径使用 `@/` 别名
   - [ ] 验证编译和运行

2. **代码审查**
   - [ ] 检查代码遵循分层规则
   - [ ] 优化依赖关系

## 导入路径别名

在 `tsconfig.json` 中配置：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/api/*": ["src/api/*"],
      "@/components/*": ["src/components/*"],
      "@/services/*": ["src/services/*"],
      "@/stores/*": ["src/stores/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/typings/*": ["src/typings/*"]
    }
  }
}
```

## 文件命名规范

```
组件:          PascalCase      (e.g., StockCard.tsx)
Hooks:         camelCase       (e.g., useStock.ts)
Services:      camelCase       (e.g., stockService.ts)
Stores:        camelCase       (e.g., watchlist.ts)
Utilities:     camelCase       (e.g., format.ts)
Constants:     UPPER_CASE      (e.g., API_ENDPOINTS.ts)
Types:         PascalCase      (e.g., Stock.d.ts)
```

## 相关文档

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 详细架构说明
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - 代码风格
