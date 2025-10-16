/**
 * 市场数据相关 API
 */
import { get } from './request';
import type { MarketMoverData } from '@/typings/stock';

/**
 * 获取市场涨跌榜
 * @param type 类型 (gainers: 涨幅榜, losers: 跌幅榜, active: 成交榜, amplitude: 振幅榜)
 * @param limit 数量限制
 */
export async function getMarketMovers(
  type: 'gainers' | 'losers' | 'active' | 'amplitude',
  limit: number = 50,
): Promise<MarketMoverData[]> {
  return get('/market/movers', { type, limit });
}

/**
 * 获取市场概览
 */
export async function getMarketOverview(): Promise<{
  sh: any;
  sz: any;
  cy: any;
  kc: any;
}> {
  return get('/market/overview');
}

/**
 * 获取涨跌统计
 */
export async function getMarketStatistics(): Promise<{
  rise: number;
  fall: number;
  flat: number;
}> {
  return get('/market/statistics');
}

/**
 * 获取财报日历
 * @param date 日期（YYYY-MM-DD）
 */
export async function getEarningsCalendar(date?: string): Promise<any[]> {
  return get('/market/earnings-calendar', { date });
}

/**
 * 获取资金流向
 * @param date 日期（YYYY-MM-DD）
 */
export async function getCapitalFlow(date?: string): Promise<any> {
  return get('/market/capital-flow', { date });
}

/**
 * 获取行业资金流向
 */
export async function getIndustryFlow(): Promise<any[]> {
  return get('/market/industry-flow');
}
