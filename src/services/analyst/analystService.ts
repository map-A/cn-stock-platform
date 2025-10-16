/**
 * 分析师数据服务
 * 提供分析师列表、排名、详情等核心数据接口
 */

import request from '@/utils/request';

export interface AnalystInfo {
  analystId: string;
  analystName: string;
  companyName: string;
  analystScore: number;
  rank: number;
  successRate: number;
  avgReturn: number;
  totalRatings: number;
  lastRating: string;
  coverageCount: number;
  numOfAnalysts?: number;
}

export interface AnalystStats {
  totalAnalysts: number;
  avgSuccessRate: number;
  avgReturn: number;
  topPerformer: AnalystInfo;
}

export interface AnalystRating {
  ticker: string;
  stockName: string;
  date: string;
  rating: string;
  priceTarget: number;
  currentPrice: number;
  upside: number;
  marketCap: number;
  sector: string;
  industry: string;
  ratings?: number;
}

/**
 * 获取顶级分析师列表
 */
export async function getTopAnalysts(params?: {
  limit?: number;
  sortBy?: 'successRate' | 'avgReturn' | 'totalRatings';
  order?: 'asc' | 'desc';
}): Promise<AnalystInfo[]> {
  return request.get('/api/analyst/top-analysts', { params });
}

/**
 * 获取分析师详情
 */
export async function getAnalystDetail(analystId: string): Promise<{
  analystInfo: AnalystInfo;
  ratingsList: AnalystRating[];
  performanceHistory: Array<{
    date: string;
    successRate: number;
    avgReturn: number;
  }>;
}> {
  return request.get(`/api/analyst/${analystId}`);
}

/**
 * 获取分析师统计数据
 */
export async function getAnalystStats(): Promise<AnalystStats> {
  return request.get('/api/analyst/stats');
}

/**
 * 搜索分析师
 */
export async function searchAnalysts(keyword: string): Promise<AnalystInfo[]> {
  return request.get('/api/analyst/search', {
    params: { keyword },
  });
}

/**
 * 获取分析师覆盖的股票列表
 */
export async function getAnalystCoverage(
  analystId: string,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<{
  list: AnalystRating[];
  total: number;
}> {
  return request.get(`/api/analyst/${analystId}/coverage`, { params });
}

/**
 * 获取分析师评级变化历史
 */
export async function getAnalystRatingHistory(
  analystId: string,
  ticker?: string,
): Promise<
  Array<{
    date: string;
    ticker: string;
    stockName: string;
    rating: string;
    priceTarget: number;
    outcome?: 'success' | 'fail' | 'pending';
  }>
> {
  return request.get(`/api/analyst/${analystId}/rating-history`, {
    params: { ticker },
  });
}

/**
 * 比较多个分析师
 */
export async function compareAnalysts(analystIds: string[]): Promise<{
  analysts: AnalystInfo[];
  comparison: {
    successRate: number[];
    avgReturn: number[];
    totalRatings: number[];
  };
}> {
  return request.post('/api/analyst/compare', { analystIds });
}
