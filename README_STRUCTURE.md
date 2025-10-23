# 📚 项目结构完善指南

### ✅ 已完成

#### 1. 目录结构标准化
- [x] API 层独立（`src/api/`）
- [x] 业务服务层（`src/services/modules/`）
- [x] 状态管理层（`src/stores/modules/`）
- [x] React Hooks 集中管理（`src/hooks/`）
- [x] 常量管理（`src/constants/`）
- [x] 类型定义集中（`src/typings/`）
- [x] 国际化（`src/i18n/`）
- [x] 全局样式（`src/styles/`）

#### 2. 文件组织
- [x] 类型定义从 `types/` 迁移到 `src/typings/`
- [x] 模型从 `src/models/` 迁移到 `src/stores/modules/`
- [x] 国际化从 `src/locales/` 迁移到 `src/i18n/`
- [x] 样式从 `src/global.*` 迁移到 `src/styles/`
- [x] 配置文件备份（`config.bak/`）

#### 3. 索引文件创建
- [x] `src/typings/index.ts` - 类型导出
- [x] `src/hooks/index.ts` - Hooks 导出
- [x] `src/constants/index.ts` - 常量导出
- [x] `src/stores/index.ts` - 状态导出
- [x] `src/services/index.ts` - 服务导出

#### 4. 文档完善
- [x] `ARCHITECTURE.md` - 架构详解
- [x] `PROJECT_STRUCTURE.md` - 结构说明
- [x] `CONTRIBUTING.md` - 贡献指南
- [x] `STYLE_GUIDE.md` - 代码风格

### ⏳ 待完成

#### 1. 代码导入路径更新
- [ ] 批量更新相对导入为 `@/` 别名
- [ ] 验证所有导入路径正确
- [ ] 运行 TypeScript 检查

#### 2. 组件分类优化
- [ ] 将业务组件细分到 `src/components/business/`
- [ ] 保留通用组件在 `src/components/common/`
- [ ] 优化组件依赖关系

#### 3. 服务层整理
- [ ] 创建 `src/services/modules/` 中的服务类
- [ ] 统一服务命名规范
- [ ] 整合 API 调用逻辑

#### 4. 常量管理
- [ ] 创建 `src/constants/api/` 中的 API 端点常量
- [ ] 创建 `src/constants/enums/` 中的枚举值
- [ ] 创建 `src/constants/config/` 中的配置常量

#### 5. Hooks 创建
- [ ] `src/hooks/useApi/` - API 请求 Hook
- [ ] `src/hooks/useAuth/` - 认证相关 Hook
- [ ] `src/hooks/useTheme/` - 主题相关 Hook

#### 6. 布局组件
- [ ] 创建 `src/layouts/BasicLayout.tsx`
- [ ] 创建 `src/layouts/UserLayout.tsx`

---

## 📖 文档指南

### 快速了解项目
1. 阅读 [ARCHITECTURE.md](./ARCHITECTURE.md) - 理解整体架构
2. 阅读 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 了解目录结构
3. 阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) - 学习开发规范

### 开发参考
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - 代码风格和色彩规范
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API 接口文档

---

## 🚀 立即开始

### 1. 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生成 OpenAPI 文档
./scripts/generate-openapi-from-requests.sh
```

### 2. 代码检查

```bash
# 类型检查
pnpm type-check

# 代码格式化
pnpm format

# Linting
pnpm lint
```

### 3. 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

---

## 📋 项目核心特性

### 1️⃣ 清晰的分层架构
```
Pages (页面)
  ↓
Components (组件)
  ↓
Hooks (业务逻辑 Hook)
  ↓
Services (业务服务)
  ↓
Stores (全局状态)
  ↓
API (后端交互)
```

### 2️⃣ 统一的导入方式
```typescript
// ✅ 推荐
import { useStock } from '@/hooks';
import { StockService } from '@/services';
import { API_ENDPOINTS } from '@/constants';
import type { Stock } from '@/typings';

// ❌ 避免
import { useStock } from '../../../../../hooks';
```

### 3️⃣ 规范的命名约定
| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `StockCard.tsx` |
| Hooks | useXxx | `useStock.ts` |
| 服务 | xxxService | `stockService.ts` |
| 常量 | UPPER_CASE | `API_ENDPOINTS.ts` |
| 类型 | PascalCase | `Stock.d.ts` |

### 4️⃣ 完善的文档体系
- 架构文档：ARCHITECTURE.md
- 结构说明：PROJECT_STRUCTURE.md
- 开发指南：CONTRIBUTING.md
- 风格指南：STYLE_GUIDE.md
- API 文档：API_DOCUMENTATION.md

---

## ✨ 最佳实践

### 添加新功能时

1. **分析功能需求**
   - 是否需要新的 API 端点？
   - 是否需要全局状态管理？
   - 是否需要复用某些 Hooks？

2. **创建必要的文件**
   ```bash
   # API 端点
   src/api/endpoints/xxx.ts

   # 业务服务
   src/services/modules/xxxService.ts

   # 状态管理
   src/stores/modules/xxx.ts

   # React Hook
   src/hooks/useXxx/index.ts

   # 组件
   src/components/business/Xxx/index.tsx
   ```

3. **遵循规范**
   - 类型定义统一放在 `src/typings/`
   - 常量定义统一放在 `src/constants/`
   - 更新对应的 `index.ts` 导出

4. **生成 API 文档**
   ```bash
   ./scripts/generate-openapi-from-requests.sh
   ```

### 代码审查要点

- [ ] 导入路径是否使用 `@/` 别名？
- [ ] 类型定义是否完整？
- [ ] 是否遵循命名规范？
- [ ] 是否有不必要的相对导入？
- [ ] API 文档是否已更新？

---

## 🎯 项目目标

本项目遵循以下软件工程原则：

✨ **关注点分离** - 每个目录有明确的职责
✨ **DRY 原则** - 代码复用，避免重复
✨ **SOLID 原则** - 设计模式和最佳实践
✨ **可维护性** - 清晰的代码结构和文档
✨ **可扩展性** - 新功能添加不影响现有代码
✨ **可测试性** - 业务逻辑与 UI 分离

---

## 📞 获取帮助

1. **查看相关文档** - 大多数问题都有文档答案
2. **查看示例代码** - 参考现有模式实现新功能
3. **提交 Issue** - 报告 bug 或提出改进建议
4. **参与讨论** - 分享想法和最佳实践

---

**项目基于企业级软件工程标准设计，旨在提供高质量、易维护的代码库。** 🚀

