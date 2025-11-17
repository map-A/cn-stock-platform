/**
 * 预设筛选器配置
 */

import type { SavedScreener } from '../types';

// 预设筛选器
export const PRESET_SCREENERS: SavedScreener[] = [
  {
    id: 'preset_high_growth_low_valuation',
    name: '高成长低估值',
    description: 'EPS增长>20%, PE<30, ROE>10%',
    isPreset: true,
    filters: {
      fundamental: {
        epsGrowthMin: 20,
        peMax: 30,
        roeMin: 10,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset_rsi_oversold',
    name: 'RSI超卖',
    description: 'RSI(14)<30, 成交量>均量',
    isPreset: true,
    filters: {
      technical: {
        rsi: {
          enabled: true,
          period: 14,
          condition: 'oversold',
          maxValue: 30,
        },
        volume: {
          enabled: true,
          condition: 'above_average',
          multiplier: 1,
        },
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset_golden_cross',
    name: '金叉突破',
    description: 'MA5上穿MA20, 放量',
    isPreset: true,
    filters: {
      technical: {
        ma: {
          enabled: true,
          shortPeriod: 5,
          longPeriod: 20,
          condition: 'cross_up',
        },
        volume: {
          enabled: true,
          condition: 'breakout',
          multiplier: 1.5,
        },
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset_low_valuation_blue_chip',
    name: '低估蓝筹',
    description: 'PE<15, 市值>100亿, 股息率>3%',
    isPreset: true,
    filters: {
      basic: {
        marketCapMin: 10000000000, // 100亿
      },
      fundamental: {
        peMax: 15,
        dividendYieldMin: 3,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset_macd_golden_cross',
    name: 'MACD金叉',
    description: 'MACD DIF上穿DEA, 柱状图>0',
    isPreset: true,
    filters: {
      technical: {
        macd: {
          enabled: true,
          condition: 'golden_cross',
        },
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset_high_roe',
    name: '高ROE稳定盈利',
    description: 'ROE>15%, 净利率>10%, 资产负债率<60%',
    isPreset: true,
    filters: {
      fundamental: {
        roeMin: 15,
        netProfitMarginMin: 10,
        debtRatioMax: 60,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset_breakout',
    name: '突破新高',
    description: '价格>MA60, 放量突破',
    isPreset: true,
    filters: {
      technical: {
        ma: {
          enabled: true,
          shortPeriod: 5,
          longPeriod: 60,
          condition: 'above',
        },
        volume: {
          enabled: true,
          condition: 'breakout',
          multiplier: 2,
        },
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset_value_investing',
    name: '价值投资',
    description: 'PE<20, PB<3, ROE>10%, 股息率>2%',
    isPreset: true,
    filters: {
      fundamental: {
        peMax: 20,
        pbMax: 3,
        roeMin: 10,
        dividendYieldMin: 2,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 获取预设筛选器
export const getPresetScreener = (id: string): SavedScreener | undefined => {
  return PRESET_SCREENERS.find(preset => preset.id === id);
};

// 获取所有预设筛选器
export const getAllPresetScreeners = (): SavedScreener[] => {
  return PRESET_SCREENERS;
};
