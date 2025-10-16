/**
 * 预测服务
 * 提供分析师预测和AI预测功能
 */

import { request } from '@umijs/max';

// 分析师预测
export interface AnalystRating {
  analystId: string;
  analystName: string;
  firmName: string;
  date: string;
  rating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  targetPrice: number;
  previousTargetPrice?: number;
}

export interface AnalystConsensus {
  stockCode: string;
  date: string;
  averageTargetPrice: number;
  highTargetPrice: number;
  lowTargetPrice: number;
  numberOfAnalysts: number;
  ratingDistribution: {
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
  };
  consensusRating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  priceTarget1Month: number;
  priceTarget3Month: number;
  priceTarget12Month: number;
}

export interface AnalystAccuracy {
  analystId: string;
  analystName: string;
  firmName: string;
  totalPredictions: number;
  accurateWithin10Percent: number;
  averageError: number;
  successRate: number;
  rank: number;
}

// AI预测
export interface AIPrediction {
  stockCode: string;
  date: string;
  model: 'lstm' | 'transformer' | 'ensemble';
  predictions: {
    day7: { price: number; confidence: number };
    day30: { price: number; confidence: number };
    day90: { price: number; confidence: number };
    day180: { price: number; confidence: number };
  };
  trend: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
  supportLevels: number[];
  resistanceLevels: number[];
}

export interface PredictionAccuracy {
  model: string;
  period: string;
  accuracy: number;
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Square Error
  historicalPerformance: {
    date: string;
    predicted: number;
    actual: number;
    error: number;
  }[];
}

// 盈利预测
export interface EarningsForecast {
  stockCode: string;
  fiscalYear: number;
  fiscalQuarter: number;
  consensusEPS: number;
  highEPS: number;
  lowEPS: number;
  numberOfEstimates: number;
  consensusRevenue: number;
  highRevenue: number;
  lowRevenue: number;
  lastUpdated: string;
}

/**
 * 获取分析师评级
 */
export async function getAnalystRatings(
  stockCode: string,
  params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  },
) {
  return request<API.Response<AnalystRating[]>>('/api/forecast/analyst-ratings', {
    method: 'GET',
    params: {
      stockCode,
      ...params,
    },
  });
}

/**
 * 获取分析师共识
 */
export async function getAnalystConsensus(stockCode: string) {
  return request<API.Response<AnalystConsensus>>('/api/forecast/analyst-consensus', {
    method: 'GET',
    params: { stockCode },
  });
}

/**
 * 获取分析师准确率排行
 */
export async function getAnalystAccuracy(params?: {
  limit?: number;
  industryCode?: string;
}) {
  return request<API.Response<AnalystAccuracy[]>>('/api/forecast/analyst-accuracy', {
    method: 'GET',
    params,
  });
}

/**
 * 获取AI预测
 */
export async function getAIPrediction(stockCode: string, model?: string) {
  return request<API.Response<AIPrediction>>('/api/forecast/ai-prediction', {
    method: 'GET',
    params: {
      stockCode,
      model,
    },
  });
}

/**
 * 获取预测准确率
 */
export async function getPredictionAccuracy(stockCode: string, model: string, period: string) {
  return request<API.Response<PredictionAccuracy>>('/api/forecast/accuracy', {
    method: 'GET',
    params: {
      stockCode,
      model,
      period,
    },
  });
}

/**
 * 获取盈利预测
 */
export async function getEarningsForecast(stockCode: string) {
  return request<API.Response<EarningsForecast[]>>('/api/forecast/earnings', {
    method: 'GET',
    params: { stockCode },
  });
}

/**
 * 计算共识评级
 */
export function calculateConsensusRating(
  distribution: AnalystConsensus['ratingDistribution'],
): 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell' {
  const total =
    distribution.strongBuy +
    distribution.buy +
    distribution.hold +
    distribution.sell +
    distribution.strongSell;
  
  if (total === 0) return 'hold';
  
  // 加权评分：强烈买入=5, 买入=4, 持有=3, 卖出=2, 强烈卖出=1
  const weightedScore =
    (distribution.strongBuy * 5 +
      distribution.buy * 4 +
      distribution.hold * 3 +
      distribution.sell * 2 +
      distribution.strongSell * 1) /
    total;
  
  if (weightedScore >= 4.5) return 'strong_buy';
  if (weightedScore >= 3.5) return 'buy';
  if (weightedScore >= 2.5) return 'hold';
  if (weightedScore >= 1.5) return 'sell';
  return 'strong_sell';
}

/**
 * 分析评级变化趋势
 */
export function analyzeRatingTrend(ratings: AnalystRating[]): {
  trend: 'upgrading' | 'downgrading' | 'stable';
  recentChanges: number;
  momentum: number;
} {
  if (ratings.length < 2) {
    return { trend: 'stable', recentChanges: 0, momentum: 0 };
  }
  
  const sortedRatings = [...ratings].sort((a, b) => b.date.localeCompare(a.date));
  const recent = sortedRatings.slice(0, 10);
  
  const ratingToScore = (rating: AnalystRating['rating']): number => {
    const scores = {
      strong_buy: 5,
      buy: 4,
      hold: 3,
      sell: 2,
      strong_sell: 1,
    };
    return scores[rating];
  };
  
  let upgradeCount = 0;
  let downgradeCount = 0;
  
  for (let i = 0; i < recent.length - 1; i++) {
    const currentScore = ratingToScore(recent[i].rating);
    const previousScore = ratingToScore(recent[i + 1].rating);
    
    if (currentScore > previousScore) upgradeCount++;
    else if (currentScore < previousScore) downgradeCount++;
  }
  
  const momentum = (upgradeCount - downgradeCount) / (recent.length - 1);
  
  let trend: 'upgrading' | 'downgrading' | 'stable';
  if (momentum > 0.3) trend = 'upgrading';
  else if (momentum < -0.3) trend = 'downgrading';
  else trend = 'stable';
  
  return {
    trend,
    recentChanges: upgradeCount + downgradeCount,
    momentum,
  };
}

/**
 * 计算预测可信度
 */
export function calculatePredictionCredibility(
  consensus: AnalystConsensus,
  accuracy: AnalystAccuracy[],
): {
  credibilityScore: number;
  factors: {
    analystCount: number;
    averageAccuracy: number;
    targetPriceRange: number;
    consensusStrength: number;
  };
} {
  // 分析师数量评分 (0-25)
  const analystCountScore = Math.min(consensus.numberOfAnalysts / 20, 1) * 25;
  
  // 平均准确率评分 (0-25)
  const avgAccuracy = accuracy.length > 0
    ? accuracy.reduce((sum, a) => sum + a.successRate, 0) / accuracy.length
    : 0;
  const accuracyScore = avgAccuracy * 25;
  
  // 目标价一致性评分 (0-25)
  const priceRange =
    ((consensus.highTargetPrice - consensus.lowTargetPrice) / consensus.averageTargetPrice) * 100;
  const rangeScore = Math.max(0, 25 - priceRange);
  
  // 评级共识强度评分 (0-25)
  const total =
    consensus.ratingDistribution.strongBuy +
    consensus.ratingDistribution.buy +
    consensus.ratingDistribution.hold +
    consensus.ratingDistribution.sell +
    consensus.ratingDistribution.strongSell;
  
  const maxRating = Math.max(
    consensus.ratingDistribution.strongBuy,
    consensus.ratingDistribution.buy,
    consensus.ratingDistribution.hold,
    consensus.ratingDistribution.sell,
    consensus.ratingDistribution.strongSell,
  );
  
  const consensusStrength = total > 0 ? (maxRating / total) * 25 : 0;
  
  const credibilityScore = analystCountScore + accuracyScore + rangeScore + consensusStrength;
  
  return {
    credibilityScore,
    factors: {
      analystCount: analystCountScore,
      averageAccuracy: accuracyScore,
      targetPriceRange: rangeScore,
      consensusStrength,
    },
  };
}
