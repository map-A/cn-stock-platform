# 国际化迁移指南

## 状态

✅ **已完成的工作：**
1. 创建了 `src/locales` 目录结构（Umi 标准位置）
2. 备份了旧的 `src/i18n` 目录至 `src/i18n.backup`
3. 创建了 `tables.ts` 文件，包含所有通用表格列名称的翻译
4. 更新了主 locale 文件导入新的 `tables.ts`
5. 完全国际化了 `/pages/Screener/index.tsx` 页面作为示例

## 尚需更新的页面

### 表格列硬编码的页面（需要使用 i18n）：

1. **Options 相关页面**
   - `/pages/Options/Screener/index.tsx` - Options 筛选器
   - `/pages/Options/OptionsTracker/index.tsx` - 期权跟踪器
   - `/pages/Options/Calculator/index.tsx` - 期权计算器
   - `/pages/Options/OptionsCalculator/index.tsx` - 期权计算器（另一个）

2. **日历页面**
   - `/pages/Calendar/EarningsCalendar.tsx` - 收益日历
   - `/pages/Calendar/DividendsCalendar.tsx` - 分红日历

3. **分析师页面**
   - `/pages/Analyst/index.tsx` - 分析师排名
   - `/pages/Analyst/Flow.tsx` - 分析师动态
   - `/pages/Analyst/Detail.tsx` - 分析师详情
   - `/pages/Analyst/TopStocks.tsx` - 顶级分析师推荐

4. **其他分析页面**
   - `/pages/Analysis/Screener/index.tsx`
   - `/pages/Analysis/DarkPool/index.tsx`
   - `/pages/Analysis/Sentiment/index.tsx`
   - `/pages/Lists/` 下的各个列表页面

## 现有翻译资源

### `tables.ts` 中已定义的翻译 key：

#### 通用表格列：
- `table.columns.symbol` - 股票代码 / Symbol
- `table.columns.name` - 名称 / Name
- `table.columns.price` - 价格 / Price
- `table.columns.latestPrice` - 最新价 / Latest Price
- `table.columns.change` - 涨跌 / Change
- `table.columns.changePercent` - 涨跌% / Change %
- `table.columns.volume` - 成交量 / Volume
- `table.columns.marketCap` - 市值 / Market Cap
- `table.columns.peRatio` - 市盈率 / P/E Ratio
- `table.columns.pbRatio` - 市净率 / P/B Ratio
- `table.columns.dividendYield` - 股息率 / Dividend Yield
- `table.columns.industry` - 行业 / Industry

#### Options 相关列：
- `table.columns.optionsContract` - 合约代码 / Contract
- `table.columns.underlying` - 标的 / Underlying
- `table.columns.strikePrice` - 行权价 / Strike
- `table.columns.expiryDate` - 到期日 / Expiry
- `table.columns.openInterest` - 持仓量 / Open Interest
- `table.columns.impliedVolatility` - 隐含波动率 / IV
- `table.columns.delta` - Delta / Delta
- `table.columns.gamma` - Gamma / Gamma
- `table.columns.theta` - Theta / Theta
- `table.columns.vega` - Vega / Vega
- `table.columns.rho` - Rho / Rho

#### 日历相关列：
- `table.columns.earningsDate` - 财报日期 / Earnings Date
- `table.columns.period` - 财年/季度 / Period
- `table.columns.expectedEPS` - 预期EPS / Expected EPS
- `table.columns.actualEPS` - 实际EPS / Actual EPS
- `table.columns.epsSurprise` - EPS惊喜度 / EPS Surprise
- `table.columns.dividendType` - 分红类型 / Dividend Type
- `table.columns.dividendFrequency` - 分红频率 / Dividend Frequency

#### 分析师相关列：
- `table.columns.analyst` - 分析师 / Analyst
- `table.columns.score` - 评分 / Score
- `table.columns.successRate` - 成功率 / Success Rate
- `table.columns.averageReturn` - 平均回报 / Average Return
- `table.columns.rating` - 评级 / Rating
- `table.columns.targetPrice` - 目标价 / Target Price
- `table.columns.upside` - 上涨空间 / Upside

### 按钮文本：
- `button.search` - 搜索 / Search
- `button.reset` - 重置 / Reset
- `button.export` - 导出 / Export
- `button.save` - 保存 / Save
- `button.cancel` - 取消 / Cancel
- `button.delete` - 删除 / Delete
- `button.edit` - 编辑 / Edit

### 消息文本：
- `message.success` - 操作成功 / Operation successful
- `message.error` - 操作失败 / Operation failed
- `message.filterFailed` - 筛选失败 / Filter failed
- `message.saveSuccess` - 保存成功 / Saved successfully
- `message.exportSuccess` - 导出成功 / Exported successfully

## 更新页面的步骤

### 1. 添加 `useIntl` hook
```typescript
import { useIntl } from '@umijs/max';

const MyComponent: React.FC = () => {
  const intl = useIntl();
  // ...
};
```

### 2. 替换表格列标题
从：
```typescript
const columns = [
  {
    title: '股票代码',
    dataIndex: 'symbol',
    // ...
  },
];
```

改为：
```typescript
const columns = [
  {
    title: intl.formatMessage({ id: 'table.columns.symbol' }),
    dataIndex: 'symbol',
    // ...
  },
];
```

### 3. 替换按钮文本、标签和消息
从：
```typescript
<Button onClick={handleSearch}>搜索</Button>
message.error('筛选失败');
```

改为：
```typescript
<Button onClick={handleSearch}>{intl.formatMessage({ id: 'button.search' })}</Button>
message.error(intl.formatMessage({ id: 'message.filterFailed' }));
```

### 4. 添加缺失的 i18n key

如果页面有特定的文本，需要在 `pages.ts` 中添加新的 key。例如：

在 `src/locales/zh-CN/pages.ts` 中添加：
```typescript
'pages.myPage.title': '我的页面标题',
'pages.myPage.description': '我的页面描述',
```

在 `src/locales/en-US/pages.ts` 中添加对应的英文翻译：
```typescript
'pages.myPage.title': 'My Page Title',
'pages.myPage.description': 'My Page Description',
```

## 快速参考：中文 → i18n Key 映射

| 中文 | i18n Key |
|------|----------|
| 股票代码 | `table.columns.symbol` |
| 股票名称 | `table.columns.name` |
| 最新价 | `table.columns.latestPrice` |
| 涨跌幅 | `table.columns.changePercent` |
| 成交量 | `table.columns.volume` |
| 市值 | `table.columns.marketCap` |
| 市盈率 | `table.columns.peRatio` |
| 市净率 | `table.columns.pbRatio` |
| 股息率 | `table.columns.dividendYield` |
| 行业 | `table.columns.industry` |
| 搜索 | `button.search` |
| 重置 | `button.reset` |
| 导出 | `button.export` |
| 保存 | `button.save` |
| 取消 | `button.cancel` |
| 操作成功 | `message.success` |
| 操作失败 | `message.error` |

## 验证

构建项目以检查是否有 i18n key 未定义的错误：
```bash
npm run build
```

运行项目并在浏览器中切换语言以验证翻译是否正确显示：
```bash
npm run dev
```

## 下一步

1. 逐个更新列出的页面
2. 在 Screener 页面的修改上参考应用相同的模式
3. 添加任何特定页面所需的新翻译 key
4. 测试所有页面的中英文显示效果
