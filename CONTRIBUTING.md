# 贡献指南

感谢您对本项目的贡献！这份指南将帮助您理解项目结构和开发流程。

## 📋 目录

- [项目概览](#项目概览)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交 PR](#提交-pr)
- [常见问题](#常见问题)

## 项目概览

**中国股票平台** 是一个现代化的股票分析和交易工具。

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **样式方案**: Less + CSS-in-JS
- **API 文档**: OpenAPI 3.0

详见 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 开发环境设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd cn-stock-platform
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 生成 API 文档

```bash
./scripts/generate-openapi-from-requests.sh
```

## 代码规范

### 1. 分层原则

```
Page (pages/)
  └─ Component (components/)
      └─ Hooks (hooks/)
          └─ Service (services/)
              └─ API (api/)
                  └─ Store (stores/)
```

### 2. TypeScript 规范

```typescript
// ✅ 良好实践
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export const useUser = (): UserProfile | null => {
  // ...
}

// ❌ 避免
interface UserProfile {
  id: any;
  name: any;
}

const useUser = () => {
  // ...
}
```

### 3. 组件规范

```typescript
// src/components/business/StockCard/index.tsx
import { FC, memo } from 'react';
import { Stock } from '@/typings';
import styles from './index.less';

interface StockCardProps {
  stock: Stock;
  onClick?: () => void;
}

/**
 * 股票卡片组件
 * @param props - 组件 Props
 */
const StockCard: FC<StockCardProps> = memo(({ stock, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      {/* 组件内容 */}
    </div>
  );
});

StockCard.displayName = 'StockCard';

export default StockCard;
```

### 4. 服务层规范

```typescript
// src/services/modules/stockService.ts
import { Stock, StockQuote } from '@/typings';

export class StockService {
  /**
   * 获取股票报价
   * @param symbol - 股票代码
   * @returns 股票报价数据
   */
  static async getQuote(symbol: string): Promise<StockQuote> {
    const response = await api.get(`/stock/quote/${symbol}`);
    return response.data;
  }

  /**
   * 解析股票数据
   */
  static parseQuoteData(data: any): Stock {
    return {
      symbol: data.symbol,
      price: parseFloat(data.price),
      // ...
    };
  }
}
```

### 5. Hooks 规范

```typescript
// src/hooks/useStock/index.ts
import { useQuery } from '@tanstack/react-query';
import { StockService } from '@/services/modules';

export const useStock = (symbol: string) => {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => StockService.getQuote(symbol),
  });
};
```

### 6. 样式规范

```less
// src/components/business/StockCard/index.less
@import '@/styles/global.less';

.card {
  background: @bg-dark-secondary;
  border: 1px solid @color-border;
  border-radius: 8px;
  padding: @spacing-md;
  transition: all 0.3s ease;

  &:hover {
    border-color: @color-positive;
    box-shadow: 0 4px 12px rgba(0, 252, 80, 0.1);
    transform: translateY(-2px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price {
    font-size: 18px;
    font-weight: 600;
    color: @text-light;
  }

  .change {
    &.positive {
      color: @color-positive;
    }

    &.negative {
      color: @color-negative;
    }
  }
}
```

### 7. 错误处理

```typescript
// 正确的错误处理
try {
  const data = await StockService.getQuote(symbol);
  setStock(data);
} catch (error) {
  if (error instanceof AxiosError) {
    showErrorNotification(error.response?.data?.message || 'API 错误');
  } else {
    showErrorNotification('未知错误');
  }
}
```

## 提交 PR

### 1. 创建分支

```bash
# 特性分支
git checkout -b feature/description

# 修复分支
git checkout -b fix/description

# 文档分支
git checkout -b docs/description
```

### 2. 提交信息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**:
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 样式（不影响代码逻辑）
- `refactor`: 重构
- `test`: 测试
- `chore`: 其他

**示例**:
```
feat(stock): 添加股票对比功能

- 实现股票对比组件
- 新增对比分析 API
- 更新路由配置

Closes #123
```

### 3. 代码检查

提交前运行：

```bash
# 代码格式化
pnpm format

# 类型检查
pnpm type-check

# Linting
pnpm lint

# 测试
pnpm test
```

### 4. PR 模板

```markdown
## 描述
简要说明这个 PR 的目的。

## 类型
- [ ] 新功能
- [ ] 修复
- [ ] 文档更新
- [ ] 性能优化

## 关联 Issue
Closes #123

## 变更

- 修改项 1
- 修改项 2
- ...

## 测试
如何验证这个 PR？

## 截图（如适用）
```

## 常见问题

### Q: 如何添加新的 API 端点？

**A**: 
1. 在 `src/services/modules/` 创建或修改服务文件
2. 在 `src/api/endpoints/` 添加 API 定义（如适用）
3. 运行 `./scripts/generate-openapi-from-requests.sh` 生成新的 OpenAPI 文档
4. 提交时包含 `openapi.json` 的更新

### Q: 如何创建新组件？

**A**:
```bash
# 1. 选择位置
# - 通用: src/components/common/
# - 业务: src/components/business/
# - UI: src/components/ui/

# 2. 创建文件夹
mkdir -p src/components/business/MyComponent

# 3. 创建文件
touch src/components/business/MyComponent/index.tsx
touch src/components/business/MyComponent/index.less
```

### Q: 如何更新样式规范？

**A**: 
1. 检查 [STYLE_GUIDE.md](./STYLE_GUIDE.md) 和 [COLOR_SCHEME.md](./COLOR_SCHEME.md)
2. 使用全局 LESS 变量而不是硬编码颜色
3. 遵循命名规范

### Q: 项目中的 Hook 都在哪里？

**A**: 
- API 相关: `src/hooks/useApi/`
- 认证相关: `src/hooks/useAuth/`
- 主题相关: `src/hooks/useTheme/`
- 通用 Hooks: `src/hooks/`

### Q: 如何修改 API 调用？

**A**:
1. 修改 `src/services/modules/` 中的服务
2. 如需更改端点，修改 `src/api/endpoints/`
3. 运行生成脚本重新生成 OpenAPI 文档

## 资源

- [项目结构](./PROJECT_STRUCTURE.md)
- [架构文档](./ARCHITECTURE.md)
- [样式指南](./STYLE_GUIDE.md)
- [API 文档](./API_DOCUMENTATION.md)

## 联系我们

如有问题或建议，请提交 Issue 或 Discussion。

---

感谢您的贡献！🎉
