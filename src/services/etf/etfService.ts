/**
 * ETF数据服务
 * 提供ETF列表、详情、持仓等核心数据接口
 */

import request from '../request';

export interface ETFInfo {
  code: string;
  name: string;
  type: 'stock' | 'bond' | 'commodity' | 'hybrid' | 'index';
  manager: string;
  managementFee: number;
  custodyFee: number;
  totalAssets: number;
  unitNetValue: number;
  accumulatedNetValue: number;
  foundDate: string;
  listingDate: string;
  trackingIndex?: string;
  trackingError?: number;
  premium: number;
  discount: number;
  turnoverRate: number;
  volume: number;
  amount: number;
  pe: number;
  pb: number;
  dividendYield: number;
  ytd: number;
  oneMonth: number;
  threeMonth: number;
  oneYear: number;
  threeYear: number;
}

export interface ETFHolding {
  stockCode: string;
  stockName: string;
  weight: number;
  shares: number;
  marketValue: number;
  changePercent: number;
  sector: string;
  industry: string;
}

export interface ETFProvider {
  providerId: string;
  providerName: string;
  totalETFs: number;
  totalAssets: number;
  avgManagementFee: number;
  foundedYear: string;
  topETFs: string[];
}

export interface ETFDividend {
  exDate: string;
  recordDate: string;
  paymentDate: string;
  dividendPerUnit: number;
  dividendYield: number;
}

export interface ETFPremiumDiscount {
  date: string;
  premium: number;
  discount: number;
  netValue: number;
  marketPrice: number;
}

export interface ETFFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  totalShares: number;
  totalAssets: number;
}

/**
 * 获取ETF列表
 */
export async function getETFList(params?: {
  type?: string;
  manager?: string;
  minAssets?: number;
  maxFee?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}): Promise<{
  list: ETFInfo[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request('/api/etf/list', {
    method: 'GET',
    params,
  });
}

/**
 * 获取ETF详情
 */
export async function getETFDetail(code: string): Promise<ETFInfo> {
  return request(`/api/etf/${code}`, {
    method: 'GET',
  });
}

/**
 * 获取ETF持仓明细
 */
export async function getETFHoldings(
  code: string,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<{
  holdings: ETFHolding[];
  total: number;
  asOfDate: string;
}> {
  return request(`/api/etf/${code}/holdings`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取ETF行业分布
 */
export async function getETFSectorDistribution(code: string): Promise<{
  sectors: Array<{
    sector: string;
    weight: number;
    value: number;
  }>;
  asOfDate: string;
}> {
  return request(`/api/etf/${code}/sector-distribution`, {
    method: 'GET',
  });
}

/**
 * 获取ETF地区分布
 */
export async function getETFRegionDistribution(code: string): Promise<{
  regions: Array<{
    region: string;
    weight: number;
    value: number;
  }>;
  asOfDate: string;
}> {
  return request(`/api/etf/${code}/region-distribution`, {
    method: 'GET',
  });
}

/**
 * 获取ETF溢价折价历史
 */
export async function getETFPremiumHistory(
  code: string,
  params?: {
    startDate?: string;
    endDate?: string;
  },
): Promise<ETFPremiumDiscount[]> {
  return request(`/api/etf/${code}/premium-history`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取ETF资金流向
 */
export async function getETFFlowHistory(
  code: string,
  params?: {
    startDate?: string;
    endDate?: string;
  },
): Promise<ETFFlowData[]> {
  return request(`/api/etf/${code}/flow-history`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取ETF分红历史
 */
export async function getETFDividends(code: string): Promise<ETFDividend[]> {
  return request(`/api/etf/${code}/dividends`, {
    method: 'GET',
  });
}

/**
 * 获取ETF提供商列表
 */
export async function getETFProviders(): Promise<ETFProvider[]> {
  return request('/api/etf/providers', {
    method: 'GET',
  });
}

/**
 * 获取某提供商的ETF列表
 */
export async function getProviderETFs(providerId: string): Promise<ETFInfo[]> {
  return request(`/api/etf/providers/${providerId}/etfs`, {
    method: 'GET',
  });
}

/**
 * 获取新发行ETF
 */
export async function getNewLaunchETFs(params?: {
  days?: number;
  page?: number;
  pageSize?: number;
}): Promise<{
  list: ETFInfo[];
  total: number;
}> {
  return request('/api/etf/new-launches', {
    method: 'GET',
    params,
  });
}

/**
 * 获取相似ETF
 */
export async function getSimilarETFs(code: string, limit?: number): Promise<ETFInfo[]> {
  return request(`/api/etf/${code}/similar`, {
    method: 'GET',
    params: { limit },
  });
}

/**
 * 获取ETF持有某股票的情况
 */
export async function getETFsByStock(stockCode: string): Promise<
  Array<{
    etfCode: string;
    etfName: string;
    weight: number;
    shares: number;
    marketValue: number;
  }>
> {
  return request(`/api/etf/by-stock/${stockCode}`, {
    method: 'GET',
  });
}

/**
 * 获取场内基金（中国特色）
 */
export async function getLOFList(params?: {
  type?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}): Promise<{
  list: ETFInfo[];
  total: number;
}> {
  return request('/api/etf/lof', {
    method: 'GET',
    params,
  });
}

export default {
  getETFList,
  getETFDetail,
  getETFHoldings,
  getETFSectorDistribution,
  getETFRegionDistribution,
  getETFPremiumHistory,
  getETFFlowHistory,
  getETFDividends,
  getETFProviders,
  getProviderETFs,
  getNewLaunchETFs,
  getSimilarETFs,
  getETFsByStock,
  getLOFList,
};
