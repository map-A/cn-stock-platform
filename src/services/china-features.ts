/**
 * 中国特色功能 API
 */
import request from './request';
import type {
  DragonTigerData,
  NorthboundData,
  NorthboundHolding,
  MarginData,
  BlockTradeData,
  ConceptSector,
  ConceptStock,
  LimitStatistics,
  LimitUpData,
  LongHuBangRecord,
  NorthMoneyFlow,
  NorthMoneyStock,
  MarginTradeStock,
  Concept,
  Sector,
} from '@/typings/china-features';

/**
 * 获取龙虎榜列表
 */
export async function getLongHuBangList(params: {
  date: string;
  type: string;
}): Promise<LongHuBangRecord[]> {
  return request('/china-features/longhubang/list', {
    method: 'GET',
    params,
  });
}

/**
 * 获取龙虎榜详情
 */
export async function getLongHuBangDetail(symbol: string, date: string): Promise<any> {
  return request(`/china-features/longhubang/detail/${symbol}`, {
    method: 'GET',
    params: { date },
  });
}

/**
 * 获取龙虎榜数据（旧接口，保留兼容）
 * @param date 日期（YYYY-MM-DD）
 */
export async function getDragonTigerList(date?: string): Promise<DragonTigerData[]> {
  return request('/china-features/dragon-tiger', { params: { date } });
}

/**
 * 获取龙虎榜详情
 * @param symbol 股票代码
 * @param date 日期
 */
export async function getDragonTigerDetail(
  symbol: string,
  date: string,
): Promise<DragonTigerData> {
  return get(`/china-features/dragon-tiger/${symbol}`, { date });
}

/**
 * 获取北向资金流向
 */
export async function getNorthMoneyFlow(params: {
  startDate: string;
  endDate: string;
}): Promise<NorthMoneyFlow[]> {
  return request('/china-features/north-money/flow', {
    method: 'GET',
    params,
  });
}

/**
 * 获取北向资金TOP榜单
 */
export async function getNorthMoneyTop(params: {
  sortBy: string;
  limit: number;
}): Promise<NorthMoneyStock[]> {
  return request('/china-features/north-money/top', {
    method: 'GET',
    params,
  });
}

/**
 * 获取北向资金流向（旧接口）
 * @param date 日期
 */
export async function getNorthboundFlow(date?: string): Promise<NorthboundData> {
  return request('/china-features/northbound/flow', { params: { date } });
}

/**
 * 获取北向资金持仓
 * @param limit 数量限制
 */
export async function getNorthboundHoldings(limit: number = 50): Promise<NorthboundHolding[]> {
  return request('/china-features/northbound/holdings', { params: { limit } });
}

/**
 * 获取个股北向资金持仓
 * @param symbol 股票代码
 */
export async function getStockNorthbound(symbol: string): Promise<NorthboundHolding[]> {
  return get(`/china-features/northbound/stock/${symbol}`);
}

/**
 * 获取融资融券概览
 */
export async function getMarginTradeOverview(params: {
  startDate: string;
  endDate: string;
}): Promise<any[]> {
  return request('/china-features/margin-trade/overview', {
    method: 'GET',
    params,
  });
}

/**
 * 获取融资融券TOP榜单
 */
export async function getMarginTradeTop(params: {
  sortBy: string;
  limit: number;
}): Promise<MarginTradeStock[]> {
  return request('/china-features/margin-trade/top', {
    method: 'GET',
    params,
  });
}

/**
 * 获取融资融券数据（旧接口）
 * @param symbol 股票代码
 * @param days 天数
 */
export async function getMarginData(symbol: string, days: number = 30): Promise<MarginData[]> {
  return request(`/china-features/margin/${symbol}`, { params: { days } });
}

/**
 * 获取融资融券排行
 * @param type 类型 (balance: 余额, buy: 买入)
 */
export async function getMarginRanking(
  type: 'balance' | 'buy',
  limit: number = 50,
): Promise<MarginData[]> {
  return request('/china-features/margin/ranking', { params: { type, limit } });
}

/**
 * 获取大宗交易
 * @param date 日期
 */
export async function getBlockTrades(date?: string): Promise<BlockTradeData[]> {
  return get('/china-features/block-trades', { date });
}

/**
 * 获取个股大宗交易
 * @param symbol 股票代码
 */
export async function getStockBlockTrades(symbol: string): Promise<BlockTradeData[]> {
  return get(`/china-features/block-trades/${symbol}`);
}

/**
 * 获取概念列表
 */
export async function getConceptList(params: { sortBy: string }): Promise<Concept[]> {
  return request('/china-features/concepts/list', {
    method: 'GET',
    params,
  });
}

/**
 * 获取行业板块列表
 */
export async function getSectorList(params: { sortBy: string }): Promise<Sector[]> {
  return request('/china-features/sectors/list', {
    method: 'GET',
    params,
  });
}

/**
 * 获取概念详情（包含成分股）
 */
export async function getConceptDetail(conceptId: string): Promise<any> {
  return request(`/china-features/concepts/detail/${conceptId}`, {
    method: 'GET',
  });
}

/**
 * 获取热门概念板块（旧接口）
 */
export async function getHotConcepts(limit: number = 20): Promise<ConceptSector[]> {
  return request('/china-features/concepts/hot', { params: { limit } });
}

/**
 * 获取概念板块成分股
 * @param code 板块代码
 */
export async function getConceptStocks(code: string): Promise<ConceptStock[]> {
  return request(`/china-features/concepts/${code}/stocks`);
}

/**
 * 获取涨跌停统计
 * @param date 日期
 */
export async function getLimitStatistics(date?: string): Promise<LimitStatistics> {
  return get('/china-features/limit/statistics', { date });
}

/**
 * 获取涨停板列表
 * @param date 日期
 */
export async function getLimitUpList(date?: string): Promise<LimitUpData[]> {
  return get('/china-features/limit/up', { date });
}

/**
 * 获取跌停板列表
 * @param date 日期
 */
export async function getLimitDownList(date?: string): Promise<LimitUpData[]> {
  return get('/china-features/limit/down', { date });
}
