/**
 * 期权高级功能服务
 * 提供期权筛选、计算、希腊字母等高级分析功能
 */

import request from '../request';

export interface OptionsChain {
  expiryDate: string;
  strike: number;
  call: OptionsContract;
  put: OptionsContract;
}

export interface OptionsContract {
  contractSymbol: string;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  inTheMoney: boolean;
  intrinsicValue: number;
  timeValue: number;
  breakeven: number;
}

export interface OptionsGreeks {
  strike: number;
  expiryDate: string;
  type: 'call' | 'put';
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  totalDelta: number;
  totalGamma: number;
}

export interface MaxPainData {
  expiryDate: string;
  maxPainStrike: number;
  strikes: Array<{
    strike: number;
    totalPain: number;
    callPain: number;
    putPain: number;
    callOI: number;
    putOI: number;
  }>;
}

export interface UnusualActivity {
  contractSymbol: string;
  ticker: string;
  type: 'call' | 'put';
  strike: number;
  expiryDate: string;
  volume: number;
  openInterest: number;
  volumeOIRatio: number;
  premium: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tradeSize: 'large' | 'medium' | 'small';
  timestamp: string;
}

export interface VolatilitySurface {
  strike: number;
  expiryDate: string;
  impliedVolatility: number;
  historicalVolatility: number;
  ivPercentile: number;
  ivRank: number;
}

/**
 * 获取期权链数据
 */
export async function getOptionsChain(
  ticker: string,
  expiryDate?: string,
): Promise<OptionsChain[]> {
  return request(`/api/options/${ticker}/chain`, {
    method: 'GET',
    params: { expiryDate },
  });
}

/**
 * 获取期权合约详情
 */
export async function getContractDetail(contractSymbol: string): Promise<OptionsContract> {
  return request(`/api/options/contract/${contractSymbol}`, {
    method: 'GET',
  });
}

/**
 * 期权筛选器
 */
export async function screenOptions(params: {
  minVolume?: number;
  maxVolume?: number;
  minOpenInterest?: number;
  minIV?: number;
  maxIV?: number;
  minDelta?: number;
  maxDelta?: number;
  type?: 'call' | 'put' | 'all';
  expiryFrom?: string;
  expiryTo?: string;
  minPremium?: number;
  maxPremium?: number;
  page?: number;
  pageSize?: number;
}): Promise<{
  list: OptionsContract[];
  total: number;
}> {
  return request('/api/options/screen', {
    method: 'GET',
    params,
  });
}

/**
 * 期权计算器 - Black-Scholes定价
 */
export async function calculateOptionPrice(params: {
  stockPrice: number;
  strikePrice: number;
  timeToExpiry: number;
  riskFreeRate: number;
  volatility: number;
  dividendYield?: number;
  optionType: 'call' | 'put';
}): Promise<{
  price: number;
  greeks: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
  };
  intrinsicValue: number;
  timeValue: number;
}> {
  return request('/api/options/calculate', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取希腊字母按到期日分组
 */
export async function getGreeksByExpiry(
  ticker: string,
  greek: 'delta' | 'gamma',
): Promise<{
  expiries: Array<{
    expiryDate: string;
    totalCall: number;
    totalPut: number;
    netExposure: number;
  }>;
}> {
  return request(`/api/options/${ticker}/greeks/${greek}/by-expiry`, {
    method: 'GET',
  });
}

/**
 * 获取希腊字母按行权价分组
 */
export async function getGreeksByStrike(
  ticker: string,
  greek: 'delta' | 'gamma',
  expiryDate?: string,
): Promise<{
  strikes: Array<{
    strike: number;
    totalCall: number;
    totalPut: number;
    netExposure: number;
  }>;
}> {
  return request(`/api/options/${ticker}/greeks/${greek}/by-strike`, {
    method: 'GET',
    params: { expiryDate },
  });
}

/**
 * 获取持仓量按到期日
 */
export async function getOpenInterestByExpiry(ticker: string): Promise<{
  expiries: Array<{
    expiryDate: string;
    callOI: number;
    putOI: number;
    totalOI: number;
    putCallRatio: number;
  }>;
}> {
  return request(`/api/options/${ticker}/oi/by-expiry`, {
    method: 'GET',
  });
}

/**
 * 获取持仓量按行权价
 */
export async function getOpenInterestByStrike(
  ticker: string,
  expiryDate?: string,
): Promise<{
  strikes: Array<{
    strike: number;
    callOI: number;
    putOI: number;
    totalOI: number;
  }>;
}> {
  return request(`/api/options/${ticker}/oi/by-strike`, {
    method: 'GET',
    params: { expiryDate },
  });
}

/**
 * 获取最大痛点
 */
export async function getMaxPain(ticker: string, expiryDate?: string): Promise<MaxPainData> {
  return request(`/api/options/${ticker}/max-pain`, {
    method: 'GET',
    params: { expiryDate },
  });
}

/**
 * 获取最热合约
 */
export async function getHottestContracts(
  ticker: string,
  sortBy: 'volume' | 'openInterest' | 'premium',
  limit?: number,
): Promise<OptionsContract[]> {
  return request(`/api/options/${ticker}/hottest`, {
    method: 'GET',
    params: { sortBy, limit },
  });
}

/**
 * 获取异常活动
 */
export async function getUnusualActivity(params?: {
  ticker?: string;
  minVolume?: number;
  minPremium?: number;
  sentiment?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  list: UnusualActivity[];
  total: number;
}> {
  return request('/api/options/unusual-activity', {
    method: 'GET',
    params,
  });
}

/**
 * 获取波动率分析
 */
export async function getVolatilityAnalysis(ticker: string): Promise<{
  currentIV: number;
  historicalIV: number;
  ivPercentile: number;
  ivRank: number;
  hvPercentile: number;
  termStructure: Array<{
    expiryDate: string;
    daysToExpiry: number;
    impliedVolatility: number;
  }>;
  surface: VolatilitySurface[];
}> {
  return request(`/api/options/${ticker}/volatility`, {
    method: 'GET',
  });
}

/**
 * 获取期权策略盈亏分析
 */
export async function analyzeStrategy(params: {
  legs: Array<{
    action: 'buy' | 'sell';
    type: 'call' | 'put';
    strike: number;
    expiryDate: string;
    quantity: number;
    premium: number;
  }>;
  stockPrice: number;
  priceRange?: [number, number];
}): Promise<{
  maxProfit: number;
  maxLoss: number;
  breakevens: number[];
  profitLoss: Array<{
    price: number;
    pl: number;
  }>;
}> {
  return request('/api/options/strategy/analyze', {
    method: 'POST',
    data: params,
  });
}

export default {
  getOptionsChain,
  getContractDetail,
  screenOptions,
  calculateOptionPrice,
  getGreeksByExpiry,
  getGreeksByStrike,
  getOpenInterestByExpiry,
  getOpenInterestByStrike,
  getMaxPain,
  getHottestContracts,
  getUnusualActivity,
  getVolatilityAnalysis,
  analyzeStrategy,
};
