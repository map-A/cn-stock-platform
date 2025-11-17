/**
 * 筛选选项配置
 */

import type { OperatorOption, FieldOption } from '../types';

// 市场选项
export const MARKET_OPTIONS = [
  { label: '沪市主板', value: 'SH_MAIN' },
  { label: '深市主板', value: 'SZ_MAIN' },
  { label: '创业板', value: 'CHINEXT' },
  { label: '科创板', value: 'STAR' },
  { label: '北交所', value: 'BSE' },
];

// 市值预设选项
export const MARKET_CAP_PRESETS = [
  { label: '不限', value: 'unlimited', min: undefined, max: undefined },
  { label: '小盘股 (< 50亿)', value: 'small', min: 0, max: 5000000000 },
  { label: '中盘股 (50-200亿)', value: 'medium', min: 5000000000, max: 20000000000 },
  { label: '大盘股 (200-1000亿)', value: 'large', min: 20000000000, max: 100000000000 },
  { label: '超大盘股 (> 1000亿)', value: 'mega', min: 100000000000, max: undefined },
  { label: '自定义', value: 'custom', min: undefined, max: undefined },
];

// 比较运算符选项
export const OPERATOR_OPTIONS: OperatorOption[] = [
  { value: 'gt', label: '大于', symbol: '>', applicableTypes: ['number'] },
  { value: 'gte', label: '大于等于', symbol: '≥', applicableTypes: ['number'] },
  { value: 'lt', label: '小于', symbol: '<', applicableTypes: ['number'] },
  { value: 'lte', label: '小于等于', symbol: '≤', applicableTypes: ['number'] },
  { value: 'eq', label: '等于', symbol: '=', applicableTypes: ['number', 'string', 'enum'] },
  { value: 'neq', label: '不等于', symbol: '≠', applicableTypes: ['number', 'string', 'enum'] },
  { value: 'between', label: '介于', symbol: '⋯', applicableTypes: ['number'] },
  { value: 'in', label: '属于', symbol: '∈', applicableTypes: ['enum'] },
];

// 逻辑运算符选项
export const LOGICAL_OPERATOR_OPTIONS = [
  { label: '并且 (AND)', value: 'AND' },
  { label: '或者 (OR)', value: 'OR' },
];

// 技术指标周期选项
export const MA_PERIOD_OPTIONS = [
  { label: 'MA5', value: 5 },
  { label: 'MA10', value: 10 },
  { label: 'MA20', value: 20 },
  { label: 'MA30', value: 30 },
  { label: 'MA60', value: 60 },
  { label: 'MA120', value: 120 },
  { label: 'MA250', value: 250 },
];

// RSI周期选项
export const RSI_PERIOD_OPTIONS = [
  { label: '6日', value: 6 },
  { label: '12日', value: 12 },
  { label: '14日', value: 14 },
  { label: '24日', value: 24 },
];

// RSI条件选项
export const RSI_CONDITION_OPTIONS = [
  { label: '超卖 (RSI < 30)', value: 'oversold' },
  { label: '超买 (RSI > 70)', value: 'overbought' },
  { label: '自定义', value: 'custom' },
];

// MACD条件选项
export const MACD_CONDITION_OPTIONS = [
  { label: '金叉 (DIF上穿DEA)', value: 'golden_cross' },
  { label: '死叉 (DIF下穿DEA)', value: 'death_cross' },
  { label: '柱状图为正', value: 'histogram_positive' },
  { label: '柱状图为负', value: 'histogram_negative' },
];

// MA交叉条件选项
export const MA_CROSS_CONDITION_OPTIONS = [
  { label: '上穿', value: 'cross_up' },
  { label: '下穿', value: 'cross_down' },
  { label: '在上方', value: 'above' },
  { label: '在下方', value: 'below' },
];

// 波动率选项
export const VOLATILITY_OPTIONS = [
  { label: '高波动', value: 'high' },
  { label: '中波动', value: 'medium' },
  { label: '低波动', value: 'low' },
];

// 布林带条件选项
export const BOLL_CONDITION_OPTIONS = [
  { label: '价格在上轨之上', value: 'above_upper' },
  { label: '价格在下轨之下', value: 'below_lower' },
  { label: '价格在中轨附近', value: 'in_middle' },
];

// 成交量条件选项
export const VOLUME_CONDITION_OPTIONS = [
  { label: '放量突破', value: 'breakout' },
  { label: '高于均量', value: 'above_average' },
  { label: '低于均量', value: 'below_average' },
];

// PE类型选项
export const PE_TYPE_OPTIONS = [
  { label: 'TTM市盈率', value: 'ttm' },
  { label: '静态市盈率', value: 'static' },
];

// 字段选项（用于自定义规则）
export const FIELD_OPTIONS: FieldOption[] = [
  // 基本指标
  { value: 'price', label: '股价', type: 'number', category: 'basic', unit: '元' },
  { value: 'changePercent', label: '涨跌幅', type: 'number', category: 'basic', unit: '%' },
  { value: 'volume', label: '成交量', type: 'number', category: 'basic', unit: '股' },
  { value: 'amount', label: '成交额', type: 'number', category: 'basic', unit: '元' },
  { value: 'marketCap', label: '市值', type: 'number', category: 'basic', unit: '元' },
  { value: 'circulationMarketCap', label: '流通市值', type: 'number', category: 'basic', unit: '元' },
  
  // 技术指标
  { value: 'ma5', label: 'MA5', type: 'number', category: 'technical', unit: '元' },
  { value: 'ma10', label: 'MA10', type: 'number', category: 'technical', unit: '元' },
  { value: 'ma20', label: 'MA20', type: 'number', category: 'technical', unit: '元' },
  { value: 'ma60', label: 'MA60', type: 'number', category: 'technical', unit: '元' },
  { value: 'rsi', label: 'RSI', type: 'number', category: 'technical' },
  { value: 'macd', label: 'MACD', type: 'number', category: 'technical' },
  { value: 'macdSignal', label: 'MACD信号线', type: 'number', category: 'technical' },
  { value: 'macdHistogram', label: 'MACD柱状图', type: 'number', category: 'technical' },
  { value: 'kdj_k', label: 'KDJ-K', type: 'number', category: 'technical' },
  { value: 'kdj_d', label: 'KDJ-D', type: 'number', category: 'technical' },
  { value: 'kdj_j', label: 'KDJ-J', type: 'number', category: 'technical' },
  
  // 财务指标
  { value: 'peRatio', label: '市盈率PE', type: 'number', category: 'fundamental' },
  { value: 'pbRatio', label: '市净率PB', type: 'number', category: 'fundamental' },
  { value: 'roe', label: '净资产收益率ROE', type: 'number', category: 'fundamental', unit: '%' },
  { value: 'eps', label: '每股收益EPS', type: 'number', category: 'fundamental', unit: '元' },
  { value: 'grossProfitMargin', label: '毛利率', type: 'number', category: 'fundamental', unit: '%' },
  { value: 'netProfitMargin', label: '净利率', type: 'number', category: 'fundamental', unit: '%' },
  { value: 'epsGrowth', label: 'EPS增长率', type: 'number', category: 'fundamental', unit: '%' },
  { value: 'revenueGrowth', label: '营收增长率', type: 'number', category: 'fundamental', unit: '%' },
  { value: 'debtRatio', label: '资产负债率', type: 'number', category: 'fundamental', unit: '%' },
  { value: 'dividendYield', label: '股息率', type: 'number', category: 'fundamental', unit: '%' },
];

// 获取字段显示名称
export const getFieldLabel = (fieldValue: string): string => {
  const field = FIELD_OPTIONS.find(f => f.value === fieldValue);
  return field ? field.label : fieldValue;
};

// 获取运算符显示名称
export const getOperatorLabel = (operatorValue: string): string => {
  const operator = OPERATOR_OPTIONS.find(op => op.value === operatorValue);
  return operator ? operator.label : operatorValue;
};

// 获取运算符符号
export const getOperatorSymbol = (operatorValue: string): string => {
  const operator = OPERATOR_OPTIONS.find(op => op.value === operatorValue);
  return operator ? operator.symbol : operatorValue;
};
