/**
 * 分析师评级服务
 * 处理评级追踪、目标价变化、评级分布等
 */

import request from '@/utils/request';

export interface RatingChange {
  ticker: string;
  stockName: string;
  analystId: string;
  analystName: string;
  companyName: string;
  date: string;
  previousRating?: string;
  newRating: string;
  previousTarget?: number;
  newTarget: number;
  currentPrice: number;
  upside: number;
  marketCap: number;
}

export interface RatingDistribution {
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  total: number;
  consensus: string;
  avgPriceTarget: number;
}

export interface TopRatedStock {
  ticker: string;
  stockName: string;
  topAnalystCounter: number;
  topAnalystUpside: number;
  topAnalystPriceTarget: number;
  topAnalystRating: string;
  currentPrice: number;
  marketCap: number;
  sector: string;
  analysts: Array<{
    analystId: string;
    analystName: string;
    rating: string;
    priceTarget: number;
    analystScore: number;
  }>;
}

/**
 * 获取最新评级变化（分析师动态）
 */
export async function getLatestRatingChanges(params?: {
  page?: number;
  pageSize?: number;
  ratingType?: 'upgrade' | 'downgrade' | 'initiate' | 'maintain';
  minAnalystScore?: number;
}): Promise<{
  list: RatingChange[];
  total: number;
}> {
  return request.get('/api/analyst/rating-flow', { params });
}

/**
 * 获取股票的评级分布
 */
export async function getStockRatingDistribution(
  ticker: string,
): Promise<RatingDistribution> {
  return request.get(`/api/analyst/rating-distribution/${ticker}`);
}

/**
 * 获取顶级分析师推荐的强买股票
 */
export async function getTopAnalystStocks(params?: {
  minScore?: number;
  minRatings?: number;
  sortBy?: 'topAnalystCounter' | 'topAnalystUpside' | 'marketCap';
  order?: 'asc' | 'desc';
}): Promise<TopRatedStock[]> {
  return request.get('/api/analyst/top-stocks', { params });
}

/**
 * 获取评级变化趋势
 */
export async function getRatingTrend(
  ticker: string,
  period: '1M' | '3M' | '6M' | '1Y' = '3M',
): Promise<{
  timeline: string[];
  ratings: {
    strongBuy: number[];
    buy: number[];
    hold: number[];
    sell: number[];
    strongSell: number[];
  };
  priceTargets: {
    high: number[];
    avg: number[];
    low: number[];
  };
}> {
  return request.get(`/api/analyst/rating-trend/${ticker}`, {
    params: { period },
  });
}

/**
 * 获取目标价达成情况
 */
export async function getPriceTargetAccuracy(
  analystId: string,
  period: '1M' | '3M' | '6M' | '1Y' = '1Y',
): Promise<{
  achieved: number;
  missed: number;
  pending: number;
  avgDeviation: number;
  details: Array<{
    ticker: string;
    stockName: string;
    targetPrice: number;
    actualPrice: number;
    deviation: number;
    status: 'achieved' | 'missed' | 'pending';
  }>;
}> {
  return request.get(`/api/analyst/${analystId}/target-accuracy`, {
    params: { period },
  });
}

/**
 * 按行业获取评级变化
 */
export async function getRatingChangesByIndustry(
  industry: string,
  days: number = 30,
): Promise<RatingChange[]> {
  return request.get('/api/analyst/rating-changes/industry', {
    params: { industry, days },
  });
}

/**
 * 获取共识评级变化
 */
export async function getConsensusChanges(
  period: '1D' | '1W' | '1M' = '1W',
): Promise<
  Array<{
    ticker: string;
    stockName: string;
    previousConsensus: string;
    newConsensus: string;
    changeType: 'upgrade' | 'downgrade';
    date: string;
  }>
> {
  return request.get('/api/analyst/consensus-changes', { params: { period } });
}
