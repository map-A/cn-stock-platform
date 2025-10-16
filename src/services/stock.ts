/**
 * 股票相关 API
 */
import { get, post, del } from './request';
import type {
  StockInfo,
  StockQuote,
  StockChart,
  TimeShareData,
  FinancialMetrics,
  ShareholderInfo,
  StockNews,
  StockAnnouncement,
} from '@/typings/stock';

/**
 * 获取股票实时行情
 * @param symbol 股票代码 (如: 600000.SH)
 */
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  return get(`/stock/quote/${symbol}`);
}

/**
 * 批量获取股票行情
 * @param symbols 股票代码数组
 */
export async function getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  return post('/stock/quotes', { symbols });
}

/**
 * 获取股票基本信息
 * @param symbol 股票代码
 */
export async function getStockInfo(symbol: string): Promise<StockInfo> {
  return get(`/stock/info/${symbol}`);
}

/**
 * 获取股票K线数据
 * @param symbol 股票代码
 * @param period 周期
 */
export async function getStockChart(
  symbol: string,
  period: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'MAX',
): Promise<StockChart> {
  return get(`/stock/chart/${symbol}`, { period });
}

/**
 * 获取分时数据
 * @param symbol 股票代码
 */
export async function getTimeShareData(symbol: string): Promise<TimeShareData[]> {
  return get(`/stock/timeshare/${symbol}`);
}

/**
 * 搜索股票
 * @param keyword 关键词（代码或名称）
 */
export async function searchStock(keyword: string): Promise<StockInfo[]> {
  return get('/stock/search', { q: keyword, limit: 10 });
}

/**
 * 获取热门股票
 * @param limit 数量限制
 */
export async function getHotStocks(limit: number = 10): Promise<StockInfo[]> {
  return get('/stock/hot', { limit });
}

/**
 * 获取财务指标
 * @param symbol 股票代码
 * @param periods 报告期数量
 */
export async function getFinancialMetrics(
  symbol: string,
  periods: number = 4,
): Promise<FinancialMetrics[]> {
  return get(`/stock/financial/${symbol}`, { periods });
}

/**
 * 获取股东信息
 * @param symbol 股票代码
 * @param type 股东类型 (1: 个人, 2: 机构)
 */
export async function getShareholders(
  symbol: string,
  type?: 1 | 2,
): Promise<ShareholderInfo[]> {
  return get(`/stock/shareholders/${symbol}`, { type });
}

/**
 * 获取股票新闻
 * @param symbol 股票代码
 * @param page 页码
 * @param pageSize 每页数量
 */
export async function getStockNews(
  symbol: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<{
  list: StockNews[];
  total: number;
}> {
  return get(`/stock/news/${symbol}`, { page, pageSize });
}

/**
 * 获取公司公告
 * @param symbol 股票代码
 * @param page 页码
 * @param pageSize 每页数量
 */
export async function getAnnouncements(
  symbol: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<{
  list: StockAnnouncement[];
  total: number;
}> {
  return get(`/stock/announcements/${symbol}`, { page, pageSize });
}

/**
 * 获取自选股列表
 */
export async function getWatchlist(): Promise<StockInfo[]> {
  return get('/stock/watchlist');
}

/**
 * 添加自选股
 * @param symbol 股票代码
 */
export async function addToWatchlist(symbol: string): Promise<void> {
  return post('/stock/watchlist', { symbol });
}

/**
 * 删除自选股
 * @param symbol 股票代码
 */
export async function removeFromWatchlist(symbol: string): Promise<void> {
  return del(`/stock/watchlist/${symbol}`);
}

/**
 * 批量添加自选股
 * @param symbols 股票代码数组
 */
export async function batchAddToWatchlist(symbols: string[]): Promise<void> {
  return post('/stock/watchlist/batch', { symbols });
}

/**
 * 检查是否在自选股中
 * @param symbol 股票代码
 */
export async function isInWatchlist(symbol: string): Promise<boolean> {
  return get(`/stock/watchlist/check/${symbol}`);
}

/**
 * 获取股票对比数据
 * @param symbols 股票代码数组
 */
export async function compareStocks(symbols: string[]): Promise<any> {
  return post('/stock/compare', { symbols });
}
