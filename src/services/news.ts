/**
 * 新闻分析模块 API 服务
 * 
 * 依据文档: API_DESIGN_GUIDE.md - 新闻分析模块
 */

import { request } from '@umijs/max';
import type {
  NewsItem,
  NewsFilterParams,
  NewsListResponse,
  MarketSentiment,
  StockNewsRelation,
  KeywordAnalysis,
  NewsImpact,
  NewsSummaryStats,
  NewsSubscription,
  NewsSearchSuggestion,
  NewsDetail,
} from '@/types/news';

// 基础路径
const API_PREFIX = '/api/v1/news';

/**
 * 获取新闻列表
 */
export async function getNewsList(params: NewsFilterParams): Promise<NewsListResponse> {
  return request(`${API_PREFIX}`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取新闻详情
 */
export async function getNewsDetail(newsId: string): Promise<NewsDetail> {
  return request(`${API_PREFIX}/${newsId}`, {
    method: 'GET',
  });
}

/**
 * 获取市场情绪指标
 */
export async function getMarketSentiment(
  startDate?: string,
  endDate?: string
): Promise<MarketSentiment[]> {
  return request(`${API_PREFIX}/sentiment`, {
    method: 'GET',
    params: {
      startDate,
      endDate,
    },
  });
}

/**
 * 获取股票新闻关联分析
 */
export async function getStockNewsRelation(
  stockCode: string,
  days: number = 30
): Promise<StockNewsRelation> {
  return request(`${API_PREFIX}/stocks/${stockCode}/analysis`, {
    method: 'GET',
    params: { days },
  });
}

/**
 * 获取关键词分析
 */
export async function getKeywordAnalysis(
  timeframe: '1d' | '7d' | '30d' = '7d'
): Promise<KeywordAnalysis[]> {
  return request(`${API_PREFIX}/keywords`, {
    method: 'GET',
    params: { timeframe },
  });
}

/**
 * 获取新闻影响评估
 */
export async function getNewsImpact(
  newsId: string,
  stockCode?: string
): Promise<NewsImpact[]> {
  return request(`${API_PREFIX}/${newsId}/impact`, {
    method: 'GET',
    params: stockCode ? { stockCode } : {},
  });
}

/**
 * 获取新闻摘要统计
 */
export async function getNewsSummaryStats(
  timeRange: '1d' | '7d' | '30d' = '7d'
): Promise<NewsSummaryStats> {
  return request(`${API_PREFIX}/summary`, {
    method: 'GET',
    params: { timeRange },
  });
}

/**
 * 获取新闻搜索建议
 */
export async function getNewsSearchSuggestions(
  query: string
): Promise<NewsSearchSuggestion[]> {
  return request(`${API_PREFIX}/suggestions`, {
    method: 'GET',
    params: { q: query },
  });
}

/**
 * 创建新闻订阅
 */
export async function createNewsSubscription(
  subscription: Omit<NewsSubscription, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<NewsSubscription> {
  return request(`${API_PREFIX}/subscriptions`, {
    method: 'POST',
    data: subscription,
  });
}

/**
 * 获取用户新闻订阅
 */
export async function getUserSubscriptions(): Promise<NewsSubscription[]> {
  return request(`${API_PREFIX}/subscriptions`, {
    method: 'GET',
  });
}

/**
 * 更新新闻订阅
 */
export async function updateNewsSubscription(
  subscriptionId: string,
  updates: Partial<NewsSubscription>
): Promise<NewsSubscription> {
  return request(`${API_PREFIX}/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    data: updates,
  });
}

/**
 * 删除新闻订阅
 */
export async function deleteNewsSubscription(subscriptionId: string): Promise<void> {
  return request(`${API_PREFIX}/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
  });
}

/**
 * 标记新闻为已读
 */
export async function markNewsAsRead(newsId: string): Promise<void> {
  return request(`${API_PREFIX}/${newsId}/read`, {
    method: 'POST',
  });
}

/**
 * 获取热门新闻
 */
export async function getTrendingNews(
  category?: string,
  limit: number = 10
): Promise<NewsItem[]> {
  return request(`${API_PREFIX}/trending`, {
    method: 'GET',
    params: { category, limit },
  });
}

/**
 * 获取相关新闻
 */
export async function getRelatedNews(
  newsId: string,
  limit: number = 5
): Promise<NewsItem[]> {
  return request(`${API_PREFIX}/${newsId}/related`, {
    method: 'GET',
    params: { limit },
  });
}

/**
 * 新闻反馈
 */
export async function submitNewsFeedback(
  newsId: string,
  feedback: {
    relevant: boolean;
    sentiment: 'accurate' | 'inaccurate';
    comment?: string;
  }
): Promise<void> {
  return request(`${API_PREFIX}/${newsId}/feedback`, {
    method: 'POST',
    data: feedback,
  });
}