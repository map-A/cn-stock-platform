# 配色方案文档

## 项目配色参考 (Stocknear 风格)

本项目采用现代化深色主题配色方案，灵感来自 [Stocknear](https://stocknear.com)。

### 核心颜色

| 颜色      | 十六进制  | 用途                | 说明              |
|----------|---------|-------------------|-----------------|
| 正/上升  | #00FC50 | 上涨、成功、正数   | 亮绿色，代表上升 |
| 负/下降  | #FF2F1F | 下跌、错误、负数   | 鲜红色，代表下跌 |
| 中性     | #FFA838 | 警告、中性指标     | 橙色，代表中性   |

### 背景颜色

| 颜色               | 十六进制  | 用途         |
|------------------|---------|-----------|
| 深色背景（主要）  | #09090B | 页面背景   |
| 主色调卡片/面板  | #1E222D | 卡片背景   |
| 次级背景         | #2A2E39 | 表格/组件  |
| 表格背景         | #18181D | 表格行     |
| 深黑色           | #121217 | 强调背景   |

### 文本颜色

| 颜色               | 十六进制  | 用途    |
|------------------|---------|--------|
| 主文本（浅）     | #E5E7EB | 主要文本 |
| 次文本（灰）     | #9CA3AF | 辅助文本 |
| 边框颜色         | #2A2E39 | 组件边框 |

## 应用方式

### 1. 全局样式变量 (`src/global.less`)

所有主题颜色都定义为 LESS 变量，可在全局样式中使用：

```less
@primary-dark: #1e222d;
@secondary-dark: #2a2e39;
@background-dark: #09090b;
@color-positive: #00fc50;
@color-negative: #ff2f1f;
@color-neutral: #ffa838;
```

### 2. Ant Design 主题配置 (`.umirc.ts`)

通过 Ant Design 的主题 API 统一配置：

```typescript
antd: {
  dark: true,
  theme: {
    token: {
      colorPrimary: '#00FC50',
      colorSuccess: '#00FC50',
      colorError: '#FF2F1F',
      colorWarning: '#FFA838',
      colorText: '#E5E7EB',
      colorTextSecondary: '#9CA3AF',
      colorBgBase: '#09090B',
      colorBorder: '#2A2E39',
    },
  },
}
```

### 3. 使用示例

#### HTML 中使用颜色类

```html
<!-- 上升/正数 -->
<span class="positive">+12.34%</span>

<!-- 下降/负数 -->
<span class="negative">-5.67%</span>

<!-- 中性 -->
<span class="neutral">±0.00%</span>
```

#### Less/CSS 中使用变量

```less
.my-component {
  background: @primary-dark;
  color: @text-light;
  border: 1px solid @color-positive;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 252, 80, 0.15);
  }
}
```

#### React 组件中的内联样式

```tsx
<Card style={{ 
  background: '#1e222d',
  borderColor: '#00fc50',
}}>
  内容
</Card>
```

## 特殊效果

### 1. 脉冲发光效果

用于标示活跃状态：

```less
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 252, 80, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(0, 252, 80, 0);
  }
}

.pulse-glow {
  animation: pulse-glow 2s infinite;
}
```

### 2. 悬停效果

所有卡片和可交互元素都有悬停效果：

```less
.card-container {
  transition: all 0.3s ease;
  
  &:hover {
    border-color: @color-positive;
    box-shadow: 0 4px 12px rgba(0, 252, 80, 0.1);
    transform: translateY(-2px);
  }
}
```

### 3. 渐变文本效果

用于 Hero 标题：

```less
.gradient-text {
  background: linear-gradient(90deg, #00fc50 0%, #ffa838 50%, #00fc50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## 响应式设计

所有颜色在深色/浅色模式下都有考虑：

- **深色模式**：默认启用，提供最佳对比度
- **高对比度**：正数 (#00FC50) 和负数 (#FF2F1F) 在所有背景下清晰可见

## 最佳实践

1. **一致性**：始终使用定义的颜色变量，避免硬编码
2. **对比度**：确保文本与背景有足够的对比度
3. **渐变**：使用颜色的透明度版本 (rgba) 创建渐变和阴影
4. **动画**：使用颜色动画时，始终包含过渡效果
5. **可访问性**：不仅依赖颜色来传达信息，结合符号或文字

## 常见用例

### 数字变化指示

```tsx
const value = 12.34;
const isPositive = value >= 0;

<Statistic
  value={value}
  valueStyle={{ color: isPositive ? '#00fc50' : '#ff2f1f' }}
  prefix={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
/>
```

### 列表项状态

```tsx
const getRowClassName = (record) => {
  if (record.change > 0) return 'row-positive';
  if (record.change < 0) return 'row-negative';
  return 'row-neutral';
};
```

### 图表色彩

```tsx
const chartColors = {
  positive: '#00FC50',
  negative: '#FF2F1F',
  neutral: '#FFA838',
};
```

---

**更新时间**: 2024年10月
**参考项目**: [Stocknear Frontend](https://github.com/stocknear/frontend)
