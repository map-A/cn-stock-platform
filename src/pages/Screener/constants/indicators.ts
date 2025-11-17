/**
 * 技术指标和财务指标配置
 */

import type { IndicatorConfig } from '../types';

// 技术指标配置
export const TECHNICAL_INDICATORS: IndicatorConfig[] = [
  {
    key: 'ma5',
    label: 'MA5',
    type: 'technical',
    category: '均线',
    unit: '元',
    description: '5日移动平均线',
    defaultVisible: true,
  },
  {
    key: 'ma10',
    label: 'MA10',
    type: 'technical',
    category: '均线',
    unit: '元',
    description: '10日移动平均线',
    defaultVisible: true,
  },
  {
    key: 'ma20',
    label: 'MA20',
    type: 'technical',
    category: '均线',
    unit: '元',
    description: '20日移动平均线',
    defaultVisible: false,
  },
  {
    key: 'ma60',
    label: 'MA60',
    type: 'technical',
    category: '均线',
    unit: '元',
    description: '60日移动平均线',
    defaultVisible: false,
  },
  {
    key: 'rsi',
    label: 'RSI',
    type: 'technical',
    category: '动量指标',
    description: '相对强弱指标',
    defaultVisible: true,
  },
  {
    key: 'macd',
    label: 'MACD',
    type: 'technical',
    category: '趋势指标',
    description: 'MACD指标',
    defaultVisible: false,
  },
  {
    key: 'macdSignal',
    label: 'MACD信号线',
    type: 'technical',
    category: '趋势指标',
    description: 'MACD信号线',
    defaultVisible: false,
  },
  {
    key: 'macdHistogram',
    label: 'MACD柱',
    type: 'technical',
    category: '趋势指标',
    description: 'MACD柱状图',
    defaultVisible: false,
  },
  {
    key: 'kdj_k',
    label: 'KDJ-K',
    type: 'technical',
    category: '动量指标',
    description: 'KDJ指标K值',
    defaultVisible: false,
  },
  {
    key: 'kdj_d',
    label: 'KDJ-D',
    type: 'technical',
    category: '动量指标',
    description: 'KDJ指标D值',
    defaultVisible: false,
  },
  {
    key: 'kdj_j',
    label: 'KDJ-J',
    type: 'technical',
    category: '动量指标',
    description: 'KDJ指标J值',
    defaultVisible: false,
  },
];

// 财务指标配置
export const FUNDAMENTAL_INDICATORS: IndicatorConfig[] = [
  {
    key: 'peRatio',
    label: '市盈率PE',
    type: 'fundamental',
    category: '估值指标',
    description: '市盈率（市价/每股收益）',
    defaultVisible: true,
  },
  {
    key: 'pbRatio',
    label: '市净率PB',
    type: 'fundamental',
    category: '估值指标',
    description: '市净率（市价/每股净资产）',
    defaultVisible: true,
  },
  {
    key: 'roe',
    label: 'ROE',
    type: 'fundamental',
    category: '盈利能力',
    unit: '%',
    description: '净资产收益率',
    defaultVisible: true,
  },
  {
    key: 'eps',
    label: 'EPS',
    type: 'fundamental',
    category: '盈利能力',
    unit: '元',
    description: '每股收益',
    defaultVisible: false,
  },
  {
    key: 'grossProfitMargin',
    label: '毛利率',
    type: 'fundamental',
    category: '盈利能力',
    unit: '%',
    description: '毛利率',
    defaultVisible: false,
  },
  {
    key: 'netProfitMargin',
    label: '净利率',
    type: 'fundamental',
    category: '盈利能力',
    unit: '%',
    description: '净利率',
    defaultVisible: false,
  },
  {
    key: 'epsGrowth',
    label: 'EPS增长率',
    type: 'fundamental',
    category: '成长能力',
    unit: '%',
    description: 'EPS同比增长率',
    defaultVisible: false,
  },
  {
    key: 'revenueGrowth',
    label: '营收增长率',
    type: 'fundamental',
    category: '成长能力',
    unit: '%',
    description: '营业收入同比增长率',
    defaultVisible: false,
  },
  {
    key: 'debtRatio',
    label: '资产负债率',
    type: 'fundamental',
    category: '偿债能力',
    unit: '%',
    description: '资产负债率',
    defaultVisible: false,
  },
  {
    key: 'dividendYield',
    label: '股息率',
    type: 'fundamental',
    category: '分红能力',
    unit: '%',
    description: '股息率',
    defaultVisible: false,
  },
];

// 所有指标配置
export const ALL_INDICATORS: IndicatorConfig[] = [
  ...TECHNICAL_INDICATORS,
  ...FUNDAMENTAL_INDICATORS,
];

// 获取指标配置
export const getIndicatorConfig = (key: string): IndicatorConfig | undefined => {
  return ALL_INDICATORS.find(indicator => indicator.key === key);
};

// 获取默认显示的指标
export const getDefaultVisibleIndicators = (): IndicatorConfig[] => {
  return ALL_INDICATORS.filter(indicator => indicator.defaultVisible);
};

// 按分类分组指标
export const groupIndicatorsByCategory = (indicators: IndicatorConfig[]) => {
  const grouped: Record<string, IndicatorConfig[]> = {};
  
  indicators.forEach(indicator => {
    if (!grouped[indicator.category]) {
      grouped[indicator.category] = [];
    }
    grouped[indicator.category].push(indicator);
  });
  
  return grouped;
};
