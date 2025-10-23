/**
 * 市场情绪服务
 * 提供恐慌贪婪指数、市场情绪指标、投资者情绪等数据
 */

import request from '@/services/request';

/**
 * 恐慌贪婪指数接口
 */
export interface FearGreedIndex {
  /** 当前值（0-100） */
  value: number;
  /** 分类 */
  category: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed';
  /** 分类描述 */
  categoryText: string;
  /** 更新时间 */
  updateTime: string;
  /** 昨日值 */
  previousValue?: number;
  /** 变化 */
  change?: number;
}

/**
 * 恐慌贪婪指数历史数据接口
 */
export interface FearGreedHistory {
  /** 日期 */
  date: string;
  /** 值 */
  value: number;
  /** 分类 */
  category: string;
}

/**
 * 恐慌贪婪指数构成指标
 */
export interface FearGreedComponents {
  /** 市场动量（涨跌幅） */
  marketMomentum: {
    value: number;
    weight: number;
    description: string;
  };
  /** 股票强度（涨跌家数） */
  stockStrength: {
    value: number;
    weight: number;
    description: string;
  };
  /** 市场宽度（新高新低） */
  marketBreadth: {
    value: number;
    weight: number;
    description: string;
  };
  /** 看跌看涨期权比 */
  putCallRatio: {
    value: number;
    weight: number;
    description: string;
  };
  /** 波动率（VIX） */
  volatility: {
    value: number;
    weight: number;
    description: string;
  };
  /** 避险需求 */
  safeHavenDemand: {
    value: number;
    weight: number;
    description: string;
  };
  /** 垃圾债需求 */
  junkBondDemand: {
    value: number;
    weight: number;
    description: string;
  };
}

/**
 * 市场情绪指标
 */
export interface MarketSentiment {
  /** 恐慌贪婪指数 */
  fearGreedIndex: FearGreedIndex;
  /** 涨跌家数比 */
  advanceDeclineRatio: number;
  /** 新高新低比 */
  newHighLowRatio: number;
  /** 波动率指数 */
  volatilityIndex: number;
  /** 融资融券情绪 */
  marginSentiment: {
    financingBalance: number;
    financingBuyAmount: number;
    marginSellAmount: number;
    netFinancing: number;
  };
  /** 北向资金情绪 */
  northboundSentiment: {
    netInflow: number;
    buyAmount: number;
    sellAmount: number;
  };
}

/**
 * 投资者情绪调查
 */
export interface InvestorSentimentSurvey {
  /** 调查日期 */
  date: string;
  /** 看涨比例 */
  bullishPercent: number;
  /** 中性比例 */
  neutralPercent: number;
  /** 看跌比例 */
  bearishPercent: number;
  /** 样本数 */
  sampleSize: number;
  /** 牛熊指数 */
  bullBearIndex: number;
}

/**
 * 获取当前恐慌贪婪指数
 */
export async function getCurrentFearGreedIndex(): Promise<FearGreedIndex> {
  return request.get('/api/sentiment/fear-greed/current');
}

/**
 * 获取恐慌贪婪指数历史数据
 */
export async function getFearGreedHistory(
  startDate?: string,
  endDate?: string,
  period: 'day' | 'week' | 'month' = 'day',
): Promise<FearGreedHistory[]> {
  return request.get('/api/sentiment/fear-greed/history', {
    params: { startDate, endDate, period },
  });
}

/**
 * 获取恐慌贪婪指数构成指标
 */
export async function getFearGreedComponents(): Promise<FearGreedComponents> {
  return request.get('/api/sentiment/fear-greed/components');
}

/**
 * 获取市场情绪综合指标
 */
export async function getMarketSentiment(): Promise<MarketSentiment> {
  return request.get('/api/sentiment/market');
}

/**
 * 获取投资者情绪调查
 */
export async function getInvestorSentimentSurvey(
  startDate?: string,
  endDate?: string,
): Promise<InvestorSentimentSurvey[]> {
  return request.get('/api/sentiment/investor-survey', {
    params: { startDate, endDate },
  });
}

/**
 * 获取情绪指标趋势
 */
export async function getSentimentTrend(
  indicator: 'fear-greed' | 'advance-decline' | 'new-high-low' | 'volatility',
  days = 90,
): Promise<{
  date: string;
  value: number;
}[]> {
  return request.get(`/api/sentiment/trend/${indicator}`, {
    params: { days },
  });
}

/**
 * 获取情绪极值统计
 */
export async function getSentimentExtremes(
  period: 'week' | 'month' | 'quarter' | 'year' = 'month',
): Promise<{
  extremeFear: {
    count: number;
    avgValue: number;
    dates: string[];
  };
  fear: {
    count: number;
    avgValue: number;
  };
  neutral: {
    count: number;
    avgValue: number;
  };
  greed: {
    count: number;
    avgValue: number;
  };
  extremeGreed: {
    count: number;
    avgValue: number;
    dates: string[];
  };
}> {
  return request.get('/api/sentiment/extremes', {
    params: { period },
  });
}

/**
 * 获取情绪与市场表现关联分析
 */
export async function getSentimentMarketCorrelation(
  days = 90,
): Promise<{
  correlation: number;
  analysis: {
    sentimentValue: number;
    marketReturn: number;
    date: string;
  }[];
}> {
  return request.get('/api/sentiment/market-correlation', {
    params: { days },
  });
}

/**
 * 获取情绪预警信号
 */
export async function getSentimentAlerts(): Promise<{
  level: 'info' | 'warning' | 'danger';
  type: string;
  message: string;
  timestamp: string;
}[]> {
  return request.get('/api/sentiment/alerts');
}

/**
 * 订阅情绪提醒
 */
export async function subscribeSentimentAlert(
  threshold: {
    extremeFear?: boolean;
    extremeGreed?: boolean;
    customValue?: number;
  },
  channel: 'email' | 'sms' | 'push',
): Promise<{
  subscriptionId: string;
  success: boolean;
}> {
  return request.post('/api/sentiment/subscribe', {
    threshold,
    channel,
  });
}

/**
 * 取消情绪提醒订阅
 */
export async function unsubscribeSentimentAlert(subscriptionId: string): Promise<boolean> {
  return request.delete(`/api/sentiment/subscribe/${subscriptionId}`);
}

export default {
  getCurrentFearGreedIndex,
  getFearGreedHistory,
  getFearGreedComponents,
  getMarketSentiment,
  getInvestorSentimentSurvey,
  getSentimentTrend,
  getSentimentExtremes,
  getSentimentMarketCorrelation,
  getSentimentAlerts,
  subscribeSentimentAlert,
  unsubscribeSentimentAlert,
};
