/**
 * @file 新闻服务
 * @description 提供市场新闻、公司公告、新闻流等数据服务
 */

import request from '@/utils/request';

export interface NewsItem {
  id: string;
  symbol?: string;
  symbolList?: string[];
  title: string;
  text: string;
  source: string;
  url: string;
  publishedDate: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  changesPercentage?: number;
  assetType?: string;
}

export interface MarketNewsParams {
  page?: number;
  size?: number;
  type?: 'general' | 'forex' | 'crypto' | 'stock';
}

export interface CompanyNewsParams {
  symbol: string;
  page?: number;
  size?: number;
}

export interface PressReleaseParams {
  symbol?: string;
  page?: number;
  size?: number;
}

/**
 * 新闻服务类
 */
class NewsService {
  /**
   * 获取新闻流数据
   * @description 获取实时市场新闻流，展示股价变动原因
   */
  async getNewsFlow(params: {
    page?: number;
    size?: number;
  }): Promise<{
    data: NewsItem[];
    total: number;
  }> {
    const response = await request.get('/api/news/flow', { params });
    return response.data;
  }

  /**
   * 获取市场新闻
   * @description 获取市场通用新闻、外汇新闻、加密货币新闻等
   */
  async getMarketNews(params: MarketNewsParams): Promise<{
    data: NewsItem[];
    total: number;
  }> {
    const response = await request.get('/api/news/market', { params });
    return response.data;
  }

  /**
   * 获取公司新闻
   * @description 获取特定公司的新闻
   */
  async getCompanyNews(params: CompanyNewsParams): Promise<{
    data: NewsItem[];
    total: number;
  }> {
    const response = await request.get(`/api/news/company/${params.symbol}`, {
      params: { page: params.page, size: params.size },
    });
    return response.data;
  }

  /**
   * 获取公司公告
   * @description 获取公司官方新闻稿和公告
   */
  async getPressReleases(params: PressReleaseParams): Promise<{
    data: NewsItem[];
    total: number;
  }> {
    const response = await request.get('/api/news/press-releases', { params });
    return response.data;
  }

  /**
   * 搜索新闻
   * @description 按关键词搜索新闻
   */
  async searchNews(params: {
    query: string;
    page?: number;
    size?: number;
  }): Promise<{
    data: NewsItem[];
    total: number;
  }> {
    const response = await request.get('/api/news/search', { params });
    return response.data;
  }

  /**
   * 获取热门新闻话题
   * @description 获取当前市场热议的新闻话题
   */
  async getTrendingTopics(): Promise<{
    topics: Array<{
      keyword: string;
      count: number;
      sentiment: string;
    }>;
  }> {
    const response = await request.get('/api/news/trending-topics');
    return response.data;
  }
}

export default new NewsService();
