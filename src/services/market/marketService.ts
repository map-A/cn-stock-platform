/**
 * 市场数据服务
 */

import request from '@/utils/request';

/**
 * 热图数据项
 */
export interface HeatmapItem {
  ticker: string;
  name: string;
  price: number;
  changesPercentage: number;
  marketCap: number;
  volume: number;
  sector: string;
}

/**
 * 获取市场热图数据
 */
export async function getMarketHeatmap(params?: {
  type?: 'sp500' | 'nasdaq' | 'dow' | 'all';
  groupBy?: 'sector' | 'industry';
}): Promise<HeatmapItem[]> {
  return request('/api/market/heatmap', { params });
}

/**
 * 恐慌贪婪指数数据
 */
export interface FearGreedData {
  value: number; // 0-100
  rating: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: string;
  indicators: {
    marketMomentum: number;
    stockPriceBreadth: number;
    stockPriceStrength: number;
    putCallRatio: number;
    marketVolatility: number;
    safeHavenDemand: number;
    junkBondDemand: number;
  };
  history: Array<{
    date: string;
    value: number;
    rating: string;
  }>;
}

/**
 * 获取恐慌贪婪指数
 */
export async function getFearGreedIndex(): Promise<FearGreedData> {
  return request('/api/market/fear-greed-index');
}

/**
 * 板块轮动数据
 */
export interface SectorRotationData {
  sectors: Array<{
    name: string;
    returns1W: number;
    returns1M: number;
    returns3M: number;
    returns6M: number;
    returns1Y: number;
    momentum: number;
    strength: 'Strong' | 'Moderate' | 'Weak';
  }>;
  rotationPhase: 'Early Cycle' | 'Mid Cycle' | 'Late Cycle' | 'Recession';
  recommendation: string;
}

/**
 * 获取板块轮动数据
 */
export async function getSectorRotation(): Promise<SectorRotationData> {
  return request('/api/market/sector-rotation');
}

export default {
  getMarketHeatmap,
  getFearGreedIndex,
  getSectorRotation,
};
