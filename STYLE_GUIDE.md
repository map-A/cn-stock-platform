# 📐 前端项目样式统一指南

## 项目概述

本指南详细说明了项目的色彩方案、布局规范、组件样式等，确保整个项目风格统一、视觉协调。

**参考项目**: Stocknear  
**设计风格**: 现代化深色主题  
**最后更新**: 2024-10-23

---

## 🎨 色彩方案

### 核心颜色

| 用途 | 颜色值 | 十六进制 | 说明 |
|------|-------|---------|------|
| 上升/正数 | 🟢 | #00FC50 | 亮绿色，代表上升趋势 |
| 下跌/负数 | 🔴 | #FF2F1F | 鲜红色，代表下跌趋势 |
| 中性/警告 | 🟠 | #FFA838 | 橙色，代表中立状态 |

### 背景颜色

| 用途 | 颜色值 | 应用场景 |
|------|-------|---------|
| 深色背景（主要） | #09090B | 页面主背景 |
| 卡片/面板 | #1E222D | 卡片、面板、对话框背景 |
| 次级背景 | #2A2E39 | 表格行、列表项背景 |
| 表格行背景 | #18181D | 表格交替行 |
| 强调背景 | #121217 | 特殊强调元素 |

### 文本颜色

| 用途 | 颜色值 | 对比度 |
|------|-------|--------|
| 主文本（亮） | #E5E7EB | 7.5:1 |
| 次文本（灰） | #9CA3AF | 4.5:1 |
| 边框颜色 | #2A2E39 | 分隔线 |

---

## 📐 布局规范

### 间距系统

```
基础单位：4px

标准间距：
  - 超小: 4px   (@spacing-xs)
  - 小: 8px     (@spacing-sm)
  - 中: 16px    (@spacing-md)
  - 大: 24px    (@spacing-lg)
  - 超大: 32px  (@spacing-xl)
```

### 圆角规范

```
8px   - 卡片、按钮、输入框等主要组件
4px   - 次级组件、标签
12px  - 大型容器、模态框
```

### 阴影规范

```
淡阴影:   0 2px 8px rgba(0, 0, 0, 0.15)
中阴影:   0 4px 12px rgba(0, 252, 80, 0.1)   // 关键信息
深阴影:   0 8px 24px rgba(0, 0, 0, 0.25)
```

---

## 🔤 字体规范

### 字体家族

```
主字体: AlibabaSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
备选字体: sans-serif
```

### 字体大小

| 场景 | 大小 | 权重 | 用途 |
|------|------|------|------|
| 大标题 H1 | 32px | 600 | 页面标题 |
| 小标题 H2 | 24px | 600 | 模块标题 |
| 标题 H3 | 18px | 600 | 组件标题 |
| 正文 Body | 14px | 400 | 主要文本 |
| 小文本 | 12px | 400 | 辅助文本 |
| 标签 | 11px | 400 | 标签、角标 |

---

## 🎯 组件样式指南

### 1. 卡片组件

```less
.card-container {
  background: @bg-dark-secondary;  // #1E222D
  border: 1px solid @color-border; // #2A2E39
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: @color-positive; // #00FC50
    box-shadow: 0 4px 12px rgba(0, 252, 80, 0.1);
    transform: translateY(-2px);
  }
}
```

### 2. 数据标签（价格、涨跌）

**上升** ✅
```tsx
<span style={{ color: '#00FC50' }}>
  <ArrowUpOutlined /> +2.50%
</span>
```

**下跌** ❌
```tsx
<span style={{ color: '#FF2F1F' }}>
  <ArrowDownOutlined /> -1.23%
</span>
```

**中性** ⚠️
```tsx
<span style={{ color: '#FFA838' }}>
  <MinusOutlined /> ±0.00%
</span>
```

### 3. 表格样式

```tsx
const getRowClassName = (record) => {
  if (record.change > 0) return 'row-positive';
  if (record.change < 0) return 'row-negative';
  return 'row-neutral';
};

// LESS 样式
.row-positive { color: #00FC50; }
.row-negative { color: #FF2F1F; }
.row-neutral  { color: #FFA838; }
```

### 4. 图表配色

```typescript
const chartColors = {
  positive: '#00FC50',   // 上升
  negative: '#FF2F1F',   // 下跌
  neutral: '#FFA838',    // 中性
  bg: '#09090B',         // 背景
  text: '#E5E7EB',       // 文本
  border: '#2A2E39',     // 边框
};
```

---

## ✨ 特殊效果

### 1. 脉冲发光

用于标示实时更新或活跃状态：

```less
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 252, 80, 0.7); }
  50%      { box-shadow: 0 0 0 8px rgba(0, 252, 80, 0); }
}

.pulse-glow {
  animation: pulse-glow 2s infinite;
}
```

### 2. 悬停效果

```less
.interactive-element {
  transition: all 0.3s ease;
  
  &:hover {
    border-color: @color-positive;
    box-shadow: 0 4px 12px rgba(0, 252, 80, 0.1);
    transform: translateY(-2px);
  }
}
```

### 3. 渐变文本

```less
.gradient-text {
  background: linear-gradient(90deg, #00fc50 0%, #ffa838 50%, #00fc50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 4. 高亮效果

```less
.highlight {
  box-shadow: 0 0 16px rgba(0, 252, 80, 0.3);
  border-color: @color-positive;
  background: rgba(0, 252, 80, 0.05);
}
```

---

## 📱 响应式设计

### 断点规范

```less
@media (max-width: 1200px) {
  // 大屏幕 (平板横向)
}

@media (max-width: 768px) {
  // 中等屏幕 (平板竖向)
}

@media (max-width: 480px) {
  // 小屏幕 (手机)
}
```

### 适配原则

1. **移动优先**: 先设计移动版本，再逐级扩展
2. **流动布局**: 使用百分比、flex 等弹性布局
3. **可触及性**: 保证触摸区域至少 44x44px

---

## 🔗 全局样式变量（LESS）

### 在 `src/global.less` 中定义

```less
/* 核心颜色 */
@color-positive: #00fc50;
@color-negative: #ff2f1f;
@color-neutral: #ffa838;

/* 背景 */
@bg-dark-primary: #09090b;
@bg-dark-secondary: #1e222d;
@bg-dark-tertiary: #2a2e39;

/* 文本 */
@text-light: #e5e7eb;
@text-secondary: #9ca3af;

/* 间距 */
@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;
```

### 使用示例

```less
// 在组件样式文件中导入使用
.my-component {
  background: @bg-dark-secondary;
  color: @text-light;
  padding: @spacing-md;
  border-color: @color-border;
  
  &.positive { color: @color-positive; }
  &.negative { color: @color-negative; }
}
```

---

## 🎓 最佳实践

### ✅ 应该做

1. **使用 LESS 变量** - 不要硬编码颜色值
   ```less
   // ✅ 正确
   color: @color-positive;
   
   // ❌ 错误
   color: #00fc50;
   ```

2. **使用 CSS 类** - 优于内联样式
   ```tsx
   // ✅ 正确
   <span className="positive">+2.50%</span>
   
   // ❌ 不推荐
   <span style={{ color: '#00fc50' }}>+2.50%</span>
   ```

3. **保持一致的间距** - 使用标准间距值
   ```less
   // ✅ 正确
   padding: @spacing-md;
   
   // ❌ 避免
   padding: 15px; padding: 17px;
   ```

4. **统一过渡效果** - 使用一致的动画时间
   ```less
   transition: all 0.3s ease; // 标准过渡
   ```

### ❌ 不应该做

1. **不使用随意的颜色** - 必须来自规范
2. **不混用亮色和深色** - 保持整体风格
3. **不过度使用阴影** - 可能降低性能
4. **不创建新的颜色变量** - 使用现有的

---

## 🔄 迁移检查清单

当更新现有组件时：

- [ ] 颜色值已更新为规范值
- [ ] 使用 LESS 变量而非硬编码
- [ ] 悬停效果已实现
- [ ] 响应式设计已验证
- [ ] 对比度满足 WCAG AA 标准 (4.5:1)
- [ ] 已在不同屏幕尺寸上测试
- [ ] 已在深色模式中测试

---

## 📊 颜色对比度检查

确保文本可读性（WCAG 2.1 标准）：

| 文本颜色 | 背景颜色 | 对比度 | 标准 |
|---------|---------|--------|------|
| #E5E7EB | #09090B | 7.5:1  | ✅ AAA |
| #9CA3AF | #1E222D | 4.8:1  | ✅ AA |
| #00FC50 | #09090B | 4.2:1  | ⚠️ AA* |
| #FF2F1F | #09090B | 3.8:1  | ⚠️ AA* |

*绿色和红色作为信息指示符时可接受，但关键文本应使用主文本颜色

---

## 🔗 参考资源

- [COLOR_SCHEME.md](../COLOR_SCHEME.md) - 详细的颜色方案文档
- [Stocknear 项目](https://github.com/stocknear/frontend) - 参考项目
- [WCAG 对比度检查工具](https://contrast-ratio.com/)
- [Ant Design 主题定制](https://ant.design/docs/react/customize-theme-cn)

---

## 📞 反馈与改进

如果发现样式不一致或有改进建议，请：

1. 提交 Issue 说明问题
2. 提供截图对比
3. 建议改进方案
4. 创建 PR 并更新文档

---

**版本**: 1.0.0  
**创建时间**: 2024-10-23  
**维护者**: Frontend Team
