# 股票筛选器 - 快速参考指南

## 🚀 新增功能速览

### 1. 技术指标面板 📊
**位置**: 图表区域 → 单股K线图下方

**功能**:
- RSI 相对强弱指标图
  - 实时 RSI 曲线
  - 超买区（70）和超卖区（30）标记线
  - 区域填充效果
- MACD 指标图
  - DIF（差离值）线
  - DEA（信号线）线
  - MACD 柱状图（红绿柱）

**使用方法**:
```typescript
// 在 ChartArea 中已自动集成
<IndicatorPanel
  symbol={stock.symbol}
  name={stock.name}
  data={{ dates, rsi, macd }}
/>
```

---

### 2. 多周期切换 📅
**位置**: K线图右上角

**功能**:
- 日K线图
- 周K线图
- 月K线图

**使用方法**:
```typescript
<MiniKLineChart
  symbol="600000"
  name="浦发银行"
  data={klineData}
  onPeriodChange={(period) => {
    // period: 'daily' | 'weekly' | 'monthly'
    console.log('周期切换到:', period);
  }}
/>
```

---

### 3. 52周价格区间 📈
**位置**: 股票详情抽屉 → 价格区间部分

**功能**:
- 显示52周最高价和最低价
- 当前价格在区间中的位置（进度条）
- 视觉化展示价格强弱

**数据字段**:
```typescript
interface ScreenerResult {
  // ... 其他字段
  high52Week?: number;  // 52周最高价
  low52Week?: number;   // 52周最低价
}
```

---

### 4. 资金流向分析 💰
**位置**: 股票详情抽屉 → 资金流向部分

**功能**:
- 主力净流入金额
- 主力净流入占比
- 超大单/大单/中单/小单净流入占比
- 红绿进度条可视化

**数据字段**:
```typescript
interface ScreenerResult {
  mainNetInflow?: number;        // 主力净流入（万元）
  mainNetInflowRatio?: number;   // 主力净流入占比
  hugeOrderRatio?: number;       // 超大单占比
  largeOrderRatio?: number;      // 大单占比
  mediumOrderRatio?: number;     // 中单占比
  smallOrderRatio?: number;      // 小单占比
}
```

---

### 5. 完整表达式解析器 🔍

#### 词法分析器（Lexer）
**文件**: `src/pages/Screener/utils/expressionParser.ts`

**功能**:
- Token 识别和分类
- 支持数字、字符串、标识符、中文
- 运算符和符号解析
- 精确的行号、列号定位

**使用示例**:
```typescript
import { Lexer } from '@/pages/Screener/utils/expressionParser';

const lexer = new Lexer('市盈率PE < 30 AND ROE > 15');
const { tokens, errors } = lexer.tokenize();

// tokens: [
//   { type: 'IDENTIFIER', value: '市盈率PE', line: 1, column: 1 },
//   { type: 'LT', value: '<', line: 1, column: 9 },
//   { type: 'NUMBER', value: '30', line: 1, column: 11 },
//   { type: 'AND', value: 'AND', line: 1, column: 14 },
//   ...
// ]
```

#### 语法分析器（Parser）
**功能**:
- 生成抽象语法树（AST）
- 支持二元表达式、逻辑表达式、一元表达式
- 详细的语法错误报告

**使用示例**:
```typescript
import { parseExpression } from '@/pages/Screener/utils/expressionParser';

const result = parseExpression('(PE < 30) AND (ROE > 15)');

// result.ast: {
//   type: 'LogicalExpression',
//   operator: 'AND',
//   left: { type: 'BinaryExpression', ... },
//   right: { type: 'BinaryExpression', ... }
// }
```

---

### 6. 规则转换工具 🔄
**文件**: `src/pages/Screener/utils/ruleToExpression.ts`

#### 规则 → 表达式
```typescript
import { rulesToExpression } from '@/pages/Screener/utils/ruleToExpression';

const rules = [
  {
    id: '1',
    field: 'peRatio',
    operator: 'lt',
    value: 30,
    logicalOperator: 'AND'
  },
  {
    id: '2',
    field: 'roe',
    operator: 'gt',
    value: 15
  }
];

const expression = rulesToExpression(rules);
// "市盈率PE < 30\nAND 净资产收益率ROE > 15"
```

#### 表达式 → 规则
```typescript
import { expressionToRules } from '@/pages/Screener/utils/ruleToExpression';

const expression = '市盈率PE < 30 AND ROE > 15';
const rules = expressionToRules(expression);
// 返回规则数组
```

---

### 7. 虚拟滚动工具 ⚡
**文件**: `src/pages/Screener/utils/performance.ts`

**功能**:
- 大数据量表格性能优化
- 只渲染可见区域的行
- 支持自定义 overscan

**使用示例**:
```typescript
import { calculateVirtualScroll } from '@/pages/Screener/utils/performance';

const result = calculateVirtualScroll(scrollTop, {
  itemHeight: 50,        // 每行高度
  containerHeight: 600,  // 容器高度
  itemCount: 10000,      // 总行数
  overscan: 3            // 预渲染行数
});

// result: {
//   startIndex: 10,        // 起始索引
//   endIndex: 25,          // 结束索引
//   offsetY: 500,          // Y轴偏移
//   totalHeight: 500000,   // 总高度
//   visibleItemCount: 12   // 可见行数
// }
```

---

### 8. 批量处理工具 🔄
**功能**: 避免大量数据处理阻塞主线程

**使用示例**:
```typescript
import { processInChunks } from '@/pages/Screener/utils/performance';

const largeArray = new Array(10000).fill(0).map((_, i) => i);

const results = await processInChunks(
  largeArray,
  (item, index) => item * 2,  // 处理函数
  100                          // 每批处理100个
);
```

---

### 9. 性能监控器 ⏱️
**功能**: 监控代码执行时间

**使用示例**:
```typescript
import { PerformanceMonitor } from '@/pages/Screener/utils/performance';

const monitor = new PerformanceMonitor();

// 方式1: 手动标记
monitor.start('数据筛选');
// ... 执行筛选逻辑
const duration = monitor.end('数据筛选');
console.log(`耗时: ${duration}ms`);

// 方式2: 同步函数
monitor.measure('排序', () => {
  data.sort((a, b) => a.price - b.price);
});

// 方式3: 异步函数
await monitor.measureAsync('加载数据', async () => {
  await fetchData();
});
```

---

## 📋 完整功能清单

### 左侧筛选面板
- [x] 基本筛选（市场、行业、板块、市值、价格、成交量）
- [x] 技术指标（MA、RSI、MACD、KDJ、BOLL、成交量）
- [x] 财务指标（PE、PB、ROE、EPS、毛利率、净利率等）
- [x] 自定义规则（动态添加/删除）
- [x] 高级表达式模式

### 右侧结果面板
- [x] 数据表格（排序、分页、选择）
- [x] K线图（日/周/月切换）
- [x] 技术指标面板（RSI + MACD）
- [x] 多股对比（雷达图、散点图）
- [x] 股票详情抽屉

### 底部管理区
- [x] 保存的筛选器
- [x] 预设模板
- [x] 快速加载

### 工具功能
- [x] 导出 CSV
- [x] 保存筛选器
- [x] 键盘快捷键
- [x] 性能优化

---

## 🎯 开发最佳实践

### 1. 类型安全
```typescript
// 始终使用类型定义
import type { ScreenerResult, FilterCondition } from '@/pages/Screener/types';

const result: ScreenerResult = {
  symbol: '600000',
  name: '浦发银行',
  // ...
};
```

### 2. 性能优化
```typescript
// 使用防抖处理输入
import { debounce } from '@/pages/Screener/utils/performance';

const handleSearch = debounce((value: string) => {
  // 搜索逻辑
}, 300);

// 使用虚拟滚动处理大数据
const virtualResult = calculateVirtualScroll(scrollTop, config);
```

### 3. 错误处理
```typescript
// 始终捕获错误
try {
  const result = await screenerService.filter(filters);
} catch (error) {
  message.error('筛选失败，请重试');
  console.error('筛选错误:', error);
}
```

### 4. 代码复用
```typescript
// 使用 Hooks 封装逻辑
const { results, loading, error, filter } = useScreener();

// 使用工具函数
const expression = rulesToExpression(rules);
const rules = expressionToRules(expression);
```

---

## 🔧 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run tsc

# 代码格式化
npm run format

# 运行测试
npm run test
```

---

## 📚 相关文档

- [SCREENER_TODO.md](./SCREENER_TODO.md) - 完整的开发计划
- [SCREENER_COMPLETED.md](./SCREENER_COMPLETED.md) - 功能完成总结
- [README.md](./README.md) - 项目说明

---

## 🆘 常见问题

### Q: 如何添加新的筛选字段？
A: 
1. 在 `types/index.ts` 中添加字段定义
2. 在 `constants/filters.ts` 中添加字段选项
3. 在对应的筛选组件中添加 UI

### Q: 如何自定义K线图样式？
A: 修改 `MiniKLineChart.tsx` 中的 ECharts 配置

### Q: 如何提升大数据量性能？
A: 
1. 使用虚拟滚动：`calculateVirtualScroll`
2. 使用批量处理：`processInChunks`
3. 添加防抖节流：`debounce` / `throttle`

### Q: 如何添加新的预设筛选器？
A: 在 `constants/presets.ts` 中添加新的配置

---

**更新时间**: 2025-11-17  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪
