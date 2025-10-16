/**
 * @file 市场情绪服务
 * @description 提供社交媒体情绪、市场情绪指标等数据
 */

import request from '@/utils/request';

export interface SentimentStock {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  sentiment: number; // 情绪分数 0-100
  volume: number;
  marketCap: number;
  mentions?: number; // 提及次数
  bullishCount?: number; // 看涨数量
  bearishCount?: number; // 看跌数量
}

export interface SocialTrend {
  symbol: string;
  name: string;
  mentions: number;
  sentiment: number;
  change24h: number;
  trendingRank: number;
}

export interface FearGreedIndex {
  value: number; // 0-100
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: string;
  components: {
    putCallRatio: number;
    vix: number;
    marketMomentum: number;
    marketVolatility: number;
    safeDemand: number;
    junkBondDemand: number;
    stockPriceStrength: number;
  };
}

/**
 * 情绪服务类
 */
class SentimentService {
  /**
   * 获取情绪追踪器数据
   * @description 获取社交媒体上最热门和最看涨的股票
   */
  async getSentimentTracker(params: {
    sortBy?: 'sentiment' | 'mentions' | 'change';
    page?: number;
    size?: number;
  }): Promise<{
    data: SentimentStock[];
    total: number;
  }> {
    const response = await request.get('/api/sentiment/tracker', { params });
    return response.data;
  }

  /**
   * 获取社交媒体趋势
   * @description 获取社交媒体上的热门股票讨论
   */
  async getSocialTrends(params: {
    platform?: 'twitter' | 'stocktwits' | 'reddit' | 'all';
    period?: '1h' | '24h' | '7d';
  }): Promise<{
    trends: SocialTrend[];
  }> {
    const response = await request.get('/api/sentiment/social-trends', {
      params,
    });
    return response.data;
  }

  /**
   * 获取恐慌贪婪指数
   * @description CNN 恐慌贪婪指数，衡量市场情绪
   */
  async getFearGreedIndex(): Promise<FearGreedIndex> {
    const response = await request.get('/api/sentiment/fear-greed');
    return response.data;
  }

  /**
   * 获取恐慌贪婪历史数据
   * @description 获取指定时间段的恐慌贪婪指数历史数据
   */
  async getFearGreedHistory(params: {
    period?: '1m' | '3m' | '6m' | '1y';
  }): Promise<{
    history: Array<{
      date: string;
      value: number;
      classification: string;
    }>;
  }> {
    const response = await request.get('/api/sentiment/fear-greed/history', {
      params,
    });
    return response.data;
  }

  /**
   * 获取特定股票的社交情绪
   * @description 获取特定股票在社交媒体上的情绪分析
   */
  async getStockSentiment(symbol: string): Promise<{
    symbol: string;
    sentiment: number;
    mentions: number;
    bullish: number;
    bearish: number;
    neutral: number;
    topMentions: Array<{
      platform: string;
      text: string;
      sentiment: string;
      timestamp: string;
    }>;
  }> {
    const response = await request.get(`/api/sentiment/stock/${symbol}`);
    return response.data;
  }

  /**
   * 获取市场情绪指标汇总
   * @description 获取多个维度的市场情绪指标
   */
  async getMarketSentimentSummary(): Promise<{
    fearGreedIndex: number;
    vixLevel: number;
    putCallRatio: number;
    advanceDeclineRatio: number;
    marketBreadth: number;
    overallSentiment: 'bullish' | 'neutral' | 'bearish';
  }> {
    const response = await request.get('/api/sentiment/market-summary');
    return response.data;
  }
}

export default new SentimentService();
