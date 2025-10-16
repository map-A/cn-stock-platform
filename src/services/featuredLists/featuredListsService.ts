/**
 * 特色列表服务
 * 提供各种股票筛选列表的API接口
 */

import request from '@/utils/request';

/**
 * 股票基本信息
 */
export interface StockListItem {
  ticker: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  marketCap: number;
  volume: number;
  sector?: string;
  industry?: string;
  country?: string;
  exchange?: string;
}

/**
 * 列表响应
 */
export interface ListResponse<T = StockListItem> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ==================== 高分红类 ====================

/**
 * 高分红股票项
 */
export interface DividendStock extends StockListItem {
  dividendYield: number;
  dividendPerShare: number;
  payoutRatio: number;
  exDividendDate: string;
  paymentDate: string;
}

/**
 * 获取最佳分红股票
 */
export async function getTopDividendStocks(params?: PaginationParams): Promise<ListResponse<DividendStock>> {
  return request('/api/lists/top-dividend-stocks', { params });
}

/**
 * 获取月度分红股票
 */
export async function getMonthlyDividendStocks(params?: PaginationParams): Promise<ListResponse<DividendStock>> {
  return request('/api/lists/monthly-dividend-stocks', { params });
}

/**
 * 获取分红ETF
 */
export async function getDividendETFs(params?: PaginationParams): Promise<ListResponse<DividendStock>> {
  return request('/api/lists/dividend-etfs', { params });
}

/**
 * 获取REITs股票
 */
export async function getREITStocks(params?: PaginationParams): Promise<ListResponse<DividendStock>> {
  return request('/api/lists/reit-stocks', { params });
}

// ==================== 期权特色 ====================

/**
 * 期权活跃股票项
 */
export interface OptionsStock extends StockListItem {
  optionVolume: number;
  putCallRatio: number;
  impliedVolatility: number;
  openInterest: number;
}

/**
 * 获取最高Call成交量股票
 */
export async function getHighestCallVolume(params?: PaginationParams): Promise<ListResponse<OptionsStock>> {
  return request('/api/lists/highest-call-volume', { params });
}

/**
 * 获取最高Put成交量股票
 */
export async function getHighestPutVolume(params?: PaginationParams): Promise<ListResponse<OptionsStock>> {
  return request('/api/lists/highest-put-volume', { params });
}

/**
 * 获取最高持仓量股票
 */
export async function getHighestOpenInterest(params?: PaginationParams): Promise<ListResponse<OptionsStock>> {
  return request('/api/lists/highest-open-interest', { params });
}

/**
 * 获取最高权利金股票
 */
export async function getHighestOptionPremium(params?: PaginationParams): Promise<ListResponse<OptionsStock>> {
  return request('/api/lists/highest-option-premium', { params });
}

/**
 * 获取最高IV Rank股票
 */
export async function getHighestIVRank(params?: PaginationParams): Promise<ListResponse<OptionsStock>> {
  return request('/api/lists/highest-iv-rank', { params });
}

// ==================== 财务特色 ====================

/**
 * 财务特色股票项
 */
export interface FinancialStock extends StockListItem {
  revenue?: number;
  netIncome?: number;
  eps?: number;
  pe?: number;
  pb?: number;
  roe?: number;
  debtToEquity?: number;
}

/**
 * 获取最高营收股票
 */
export async function getHighestRevenue(params?: PaginationParams): Promise<ListResponse<FinancialStock>> {
  return request('/api/lists/highest-revenue', { params });
}

/**
 * 获取最多员工股票
 */
export async function getMostEmployees(params?: PaginationParams): Promise<ListResponse<FinancialStock>> {
  return request('/api/lists/most-employees', { params });
}

/**
 * 获取最多回购股票
 */
export async function getMostBuybacks(params?: PaginationParams): Promise<ListResponse<FinancialStock>> {
  return request('/api/lists/most-buybacks', { params });
}

/**
 * 获取低价股（仙股）
 */
export async function getPennyStocks(params?: PaginationParams): Promise<ListResponse<FinancialStock>> {
  return request('/api/lists/penny-stocks', { params });
}

/**
 * 获取高市值股票
 */
export async function getMegaCapStocks(params?: PaginationParams): Promise<ListResponse<FinancialStock>> {
  return request('/api/lists/mega-cap-stocks', { params });
}

// ==================== 交易特色 ====================

/**
 * 交易特色股票项
 */
export interface TradingStock extends StockListItem {
  rsi?: number;
  shortInterest?: number;
  shortRatio?: number;
  ftdShares?: number;
}

/**
 * 获取超买股票
 */
export async function getOverboughtStocks(params?: PaginationParams): Promise<ListResponse<TradingStock>> {
  return request('/api/lists/overbought-stocks', { params });
}

/**
 * 获取超卖股票
 */
export async function getOversoldStocks(params?: PaginationParams): Promise<ListResponse<TradingStock>> {
  return request('/api/lists/oversold-stocks', { params });
}

/**
 * 获取最多做空股票
 */
export async function getMostShortedStocks(params?: PaginationParams): Promise<ListResponse<TradingStock>> {
  return request('/api/lists/most-shorted-stocks', { params });
}

/**
 * 获取最多未交割股票
 */
export async function getMostFTDShares(params?: PaginationParams): Promise<ListResponse<TradingStock>> {
  return request('/api/lists/most-ftd-shares', { params });
}

/**
 * 获取SPAC股票
 */
export async function getSPACStocks(params?: PaginationParams): Promise<ListResponse<TradingStock>> {
  return request('/api/lists/spac-stocks', { params });
}

// ==================== 行业主题 ====================

/**
 * 获取比特币ETF
 */
export async function getBitcoinETFs(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/bitcoin-etfs', { params });
}

/**
 * 获取以太坊ETF
 */
export async function getEthereumETFs(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/ethereum-etfs', { params });
}

/**
 * 获取加密货币ETF
 */
export async function getCryptoETFs(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/crypto-etfs', { params });
}

/**
 * 获取备兑看涨ETF
 */
export async function getCoveredCallETFs(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/covered-call-etfs', { params });
}

/**
 * 获取清洁能源股票
 */
export async function getCleanEnergyStocks(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/clean-energy-stocks', { params });
}

/**
 * 获取电动车股票
 */
export async function getElectricVehicleStocks(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/electric-vehicle-stocks', { params });
}

/**
 * 获取汽车公司股票
 */
export async function getCarCompanyStocks(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/car-company-stocks', { params });
}

/**
 * 获取社交媒体股票
 */
export async function getSocialMediaStocks(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/social-media-stocks', { params });
}

/**
 * 获取移动游戏股票
 */
export async function getMobileGamesStocks(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/mobile-games-stocks', { params });
}

/**
 * 获取电竞股票
 */
export async function getEsportsStocks(params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request('/api/lists/esports-stocks', { params });
}

// ==================== 按行业/板块/交易所 ====================

/**
 * 按行业获取股票
 */
export async function getStocksByIndustry(industry: string, params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request(`/api/lists/industry/${industry}`, { params });
}

/**
 * 按板块获取股票
 */
export async function getStocksBySector(sector: string, params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request(`/api/lists/sector/${sector}`, { params });
}

/**
 * 按交易所获取股票
 */
export async function getStocksByExchange(exchange: string, params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request(`/api/lists/exchange/${exchange}`, { params });
}

/**
 * 按国家获取股票
 */
export async function getStocksByCountry(country: string, params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request(`/api/lists/country/${country}`, { params });
}

/**
 * 按市值分类获取股票
 */
export async function getStocksByMarketCap(category: 'mega' | 'large' | 'mid' | 'small' | 'micro', params?: PaginationParams): Promise<ListResponse<StockListItem>> {
  return request(`/api/lists/market-cap/${category}`, { params });
}

export default {
  // 高分红类
  getTopDividendStocks,
  getMonthlyDividendStocks,
  getDividendETFs,
  getREITStocks,
  
  // 期权特色
  getHighestCallVolume,
  getHighestPutVolume,
  getHighestOpenInterest,
  getHighestOptionPremium,
  getHighestIVRank,
  
  // 财务特色
  getHighestRevenue,
  getMostEmployees,
  getMostBuybacks,
  getPennyStocks,
  getMegaCapStocks,
  
  // 交易特色
  getOverboughtStocks,
  getOversoldStocks,
  getMostShortedStocks,
  getMostFTDShares,
  getSPACStocks,
  
  // 行业主题
  getBitcoinETFs,
  getEthereumETFs,
  getCryptoETFs,
  getCoveredCallETFs,
  getCleanEnergyStocks,
  getElectricVehicleStocks,
  getCarCompanyStocks,
  getSocialMediaStocks,
  getMobileGamesStocks,
  getEsportsStocks,
  
  // 分类
  getStocksByIndustry,
  getStocksBySector,
  getStocksByExchange,
  getStocksByCountry,
  getStocksByMarketCap,
};
