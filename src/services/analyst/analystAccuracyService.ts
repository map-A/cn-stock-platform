/**
 * 分析师准确率统计服务
 * 提供准确率分析、排行榜、预测准确度等数据
 */

import request from '@/utils/request';

export interface AccuracyMetrics {
  analystId: string;
  analystName: string;
  companyName: string;
  overallAccuracy: number;
  shortTermAccuracy: number; // 1个月
  mediumTermAccuracy: number; // 3个月
  longTermAccuracy: number; // 1年
  priceTargetAccuracy: number;
  timingAccuracy: number;
  totalPredictions: number;
  successfulPredictions: number;
}

export interface SectorAccuracy {
  sector: string;
  accuracy: number;
  totalRatings: number;
  successCount: number;
  avgReturn: number;
  bestAnalysts: Array<{
    analystId: string;
    analystName: string;
    accuracy: number;
  }>;
}

export interface AccuracyTrend {
  period: string;
  accuracy: number;
  predictions: number;
  successful: number;
}

/**
 * 获取分析师准确率详情
 */
export async function getAnalystAccuracy(
  analystId: string,
): Promise<AccuracyMetrics> {
  return request.get(`/api/analyst/${analystId}/accuracy`);
}

/**
 * 获取准确率排行榜
 */
export async function getAccuracyLeaderboard(params?: {
  period?: '1M' | '3M' | '6M' | '1Y' | 'ALL';
  sector?: string;
  minRatings?: number;
  limit?: number;
}): Promise<AccuracyMetrics[]> {
  return request.get('/api/analyst/accuracy/leaderboard', { params });
}

/**
 * 获取行业准确率统计
 */
export async function getSectorAccuracy(
  period: '1M' | '3M' | '6M' | '1Y' = '1Y',
): Promise<SectorAccuracy[]> {
  return request.get('/api/analyst/accuracy/by-sector', { params: { period } });
}

/**
 * 获取准确率趋势
 */
export async function getAccuracyTrend(
  analystId: string,
  period: '1Y' | '2Y' | '5Y' = '1Y',
): Promise<AccuracyTrend[]> {
  return request.get(`/api/analyst/${analystId}/accuracy/trend`, {
    params: { period },
  });
}

/**
 * 比较分析师准确率
 */
export async function compareAnalystAccuracy(
  analystIds: string[],
): Promise<{
  metrics: AccuracyMetrics[];
  comparison: {
    labels: string[];
    overallAccuracy: number[];
    shortTermAccuracy: number[];
    longTermAccuracy: number[];
    priceTargetAccuracy: number[];
  };
}> {
  return request.post('/api/analyst/accuracy/compare', { analystIds });
}

/**
 * 获取评级类型准确率
 */
export async function getRatingTypeAccuracy(
  analystId: string,
): Promise<{
  strongBuy: { accuracy: number; count: number };
  buy: { accuracy: number; count: number };
  hold: { accuracy: number; count: number };
  sell: { accuracy: number; count: number };
  strongSell: { accuracy: number; count: number };
}> {
  return request.get(`/api/analyst/${analystId}/accuracy/by-rating-type`);
}

/**
 * 获取目标价偏差分析
 */
export async function getPriceTargetDeviation(
  analystId: string,
): Promise<{
  avgDeviation: number;
  medianDeviation: number;
  positiveDeviation: number;
  negativeDeviation: number;
  distribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}> {
  return request.get(`/api/analyst/${analystId}/price-target-deviation`);
}

/**
 * 获取最佳/最差预测案例
 */
export async function getBestWorstCases(
  analystId: string,
  type: 'best' | 'worst',
  limit: number = 10,
): Promise<
  Array<{
    ticker: string;
    stockName: string;
    date: string;
    rating: string;
    priceTarget: number;
    entryPrice: number;
    currentPrice: number;
    returnRate: number;
    outcome: string;
  }>
> {
  return request.get(`/api/analyst/${analystId}/cases/${type}`, {
    params: { limit },
  });
}

/**
 * 获取分析师专长领域
 */
export async function getAnalystExpertise(analystId: string): Promise<{
  bestSectors: Array<{
    sector: string;
    accuracy: number;
    ratingsCount: number;
    avgReturn: number;
  }>;
  bestStockTypes: Array<{
    type: string; // 'large-cap', 'mid-cap', 'small-cap', 'growth', 'value'
    accuracy: number;
    count: number;
  }>;
  specialization: string;
}> {
  return request.get(`/api/analyst/${analystId}/expertise`);
}
