/**
 * 分析工具相关 API
 */
import { get, post } from './request';
import type {
  ScreenerParams,
  ScreenerResult,
  DarkPoolData,
  DarkPoolStats,
  DepartmentTrack,
  MarketSentiment,
  StockSentiment,
  SentimentHistory,
  TrendingStock,
} from '@/typings/analysis';

/**
 * 股票筛选
 * @param params 筛选参数
 */
export async function screenStock(params: ScreenerParams): Promise<{
  list: ScreenerResult[];
  total: number;
}> {
  return post('/analysis/screener', params);
}

/**
 * 保存筛选条件
 * @param name 条件名称
 * @param params 筛选参数
 */
export async function saveScreenerCondition(
  name: string,
  params: ScreenerParams,
): Promise<{ id: string }> {
  return post('/analysis/screener/save', { name, params });
}

/**
 * 获取保存的筛选条件列表
 */
export async function getScreenerConditions(): Promise<Array<{
  id: string;
  name: string;
  params: ScreenerParams;
  createTime: string;
}>> {
  return get('/analysis/screener/conditions');
}

/**
 * 获取行业列表
 */
export async function getIndustryList(): Promise<string[]> {
  return get('/analysis/industry-list');
}

/**
 * 获取板块列表
 */
export async function getSectorList(): Promise<string[]> {
  return get('/analysis/sector-list');
}

/**
 * 获取大宗交易列表
 * @param date 日期（YYYY-MM-DD）
 * @param symbol 股票代码（可选）
 */
export async function getDarkPoolList(
  date?: string,
  symbol?: string,
): Promise<{
  list: DarkPoolData[];
  stats: DarkPoolStats;
}> {
  return get('/analysis/darkpool/list', { date, symbol });
}

/**
 * 获取个股大宗交易历史
 * @param symbol 股票代码
 * @param days 天数
 */
export async function getStockDarkPoolHistory(
  symbol: string,
  days: number = 30,
): Promise<DarkPoolData[]> {
  return get(`/analysis/darkpool/stock/${symbol}`, { days });
}

/**
 * 获取营业部追踪
 * @param days 天数
 */
export async function getDepartmentTrack(
  days: number = 30,
): Promise<DepartmentTrack[]> {
  return get('/analysis/darkpool/departments', { days });
}

/**
 * 获取市场情绪指标
 * @param date 日期（可选）
 */
export async function getMarketSentiment(
  date?: string,
): Promise<MarketSentiment> {
  return get('/analysis/sentiment/market', { date });
}

/**
 * 获取情绪历史数据
 * @param days 天数
 */
export async function getSentimentHistory(
  days: number = 30,
): Promise<SentimentHistory[]> {
  return get('/analysis/sentiment/history', { days });
}

/**
 * 获取个股情绪
 * @param symbol 股票代码
 */
export async function getStockSentiment(
  symbol: string,
): Promise<StockSentiment> {
  return get(`/analysis/sentiment/stock/${symbol}`);
}

/**
 * 获取热搜股票
 * @param limit 数量限制
 */
export async function getTrendingStocks(
  limit: number = 20,
): Promise<TrendingStock[]> {
  return get('/analysis/sentiment/trending', { limit });
}

/**
 * 获取情绪排行
 * @param type 类型（positive: 正面情绪, negative: 负面情绪）
 * @param limit 数量限制
 */
export async function getSentimentRanking(
  type: 'positive' | 'negative',
  limit: number = 50,
): Promise<StockSentiment[]> {
  return get('/analysis/sentiment/ranking', { type, limit });
}
