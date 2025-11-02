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
  const response = await request(`${API_PREFIX}`, {
    method: 'GET',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      category: params.category,
      keyword: params.keyword,
      sentiment: params.sentiment,
      importance: params.importance,
      startDate: params.startDate,
      endDate: params.endDate,
      stockCode: params.stockCode,
      sortBy: params.sortBy || 'publishedAt',
      sortOrder: params.sortOrder || 'desc',
      token: '123',
    },
  });
  
  // 处理响应格式 - 返回的是 {code, message, data}
  if (response && response.data) {
    const mapImportance = (value: number | string | undefined): 'high' | 'medium' | 'low' => {
      if (typeof value === 'string') return value as any;
      if (typeof value === 'number') {
        if (value >= 8) return 'high';
        if (value >= 5) return 'medium';
        return 'low';
      }
      return 'medium';
    };
    
    const items = (response.data.items || []).map((item: any) => ({
      ...item,
      relatedStocks: item.stocks || [],
      summary: item.summary || item.content || '',
      importance: mapImportance(item.importance),
    }));
    
    return {
      items,
      total: response.data.total || 0,
      page: response.data.page || 1,
      pageSize: response.data.page_size || 20,
      hasNext: (response.data.page * response.data.page_size) < response.data.total,
    };
  }
  
  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    hasNext: false,
  };
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
  try {
    const response = await request(`${API_PREFIX}/sentiment`, {
      method: 'GET',
      params: {
        startDate,
        endDate,
        token: '123',
      },
    });
    
    // 返回模拟的情绪数据
    if (response && response.data) {
      return response.data || [];
    }
    
    // 如果没有数据，返回模拟数据
    return [
      { date: '2025-11-02', overallSentiment: 'neutral', sentimentScore: 0.5, positiveCount: 5, negativeCount: 3, neutralCount: 7, totalCount: 15, trendDirection: 'stable', confidenceLevel: 0.8 },
      { date: '2025-11-01', overallSentiment: 'positive', sentimentScore: 0.6, positiveCount: 6, negativeCount: 2, neutralCount: 7, totalCount: 15, trendDirection: 'up', confidenceLevel: 0.75 },
    ] as any;
  } catch (error) {
    console.error('获取市场情绪失败:', error);
    return [];
  }
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
  // 返回模拟数据
  return Promise.resolve([
    { keyword: '下跌', frequency: 45, sentiment: 'negative', relatedStocks: ['600519', '000858'], trendScore: 0.5, importance: 'high' },
    { keyword: '上涨', frequency: 38, sentiment: 'positive', relatedStocks: ['600036'], trendScore: 0.3, importance: 'high' },
    { keyword: '利好', frequency: 32, sentiment: 'positive', relatedStocks: ['000858', '300750'], trendScore: 0.2, importance: 'medium' },
    { keyword: '政策', frequency: 28, sentiment: 'neutral', relatedStocks: [], trendScore: 0.1, importance: 'medium' },
    { keyword: '涨停', frequency: 25, sentiment: 'positive', relatedStocks: ['688111'], trendScore: -0.1, importance: 'low' },
  ] as any);
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
 * 获取热门新闻
 */
export async function getTrendingNews(
  category?: string,
  limit: number = 10
): Promise<NewsItem[]> {
  try {
    const response = await request(`${API_PREFIX}`, {
      method: 'GET',
      params: { 
        category, 
        limit,
        page: 1,
        pageSize: limit,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
        token: '123',
      },
    });
    
    if (response && response.data && response.data.items) {
      return response.data.items.slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error('获取热门新闻失败:', error);
    return [];
  }
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