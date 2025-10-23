/**
 * 行业数据服务
 * 提供行业分类、行业数据、行业表现等功能
 */

import request from '@/services/request';

/**
 * 行业信息接口
 */
export interface Industry {
  /** 行业代码 */
  code: string;
  /** 行业名称 */
  name: string;
  /** 所属板块 */
  sector: string;
  /** 行业描述 */
  description?: string;
  /** 股票数量 */
  stockCount: number;
  /** 总市值 */
  totalMarketCap: number;
  /** 平均市盈率 */
  avgPE?: number;
  /** 平均市净率 */
  avgPB?: number;
  /** 涨跌幅 */
  changePercent?: number;
  /** 成交额 */
  volume?: number;
  /** 换手率 */
  turnoverRate?: number;
}

/**
 * 板块信息接口
 */
export interface Sector {
  /** 板块代码 */
  code: string;
  /** 板块名称 */
  name: string;
  /** 板块描述 */
  description?: string;
  /** 包含的行业列表 */
  industries: string[];
  /** 股票数量 */
  stockCount: number;
  /** 总市值 */
  totalMarketCap: number;
  /** 涨跌幅 */
  changePercent?: number;
  /** 成交额 */
  volume?: number;
}

/**
 * 行业表现接口
 */
export interface IndustryPerformance {
  /** 行业代码 */
  code: string;
  /** 行业名称 */
  name: string;
  /** 日涨跌幅 */
  dayChange: number;
  /** 周涨跌幅 */
  weekChange: number;
  /** 月涨跌幅 */
  monthChange: number;
  /** 年涨跌幅 */
  yearChange: number;
  /** 成交额 */
  volume: number;
  /** 资金流入 */
  moneyFlow: number;
  /** 领涨股票 */
  topGainer?: {
    symbol: string;
    name: string;
    changePercent: number;
  };
  /** 领跌股票 */
  topLoser?: {
    symbol: string;
    name: string;
    changePercent: number;
  };
}

/**
 * 行业资金流向接口
 */
export interface IndustryMoneyFlow {
  /** 行业代码 */
  code: string;
  /** 行业名称 */
  name: string;
  /** 日期 */
  date: string;
  /** 主力净流入 */
  mainNetInflow: number;
  /** 超大单净流入 */
  superLargeNetInflow: number;
  /** 大单净流入 */
  largeNetInflow: number;
  /** 中单净流入 */
  mediumNetInflow: number;
  /** 小单净流入 */
  smallNetInflow: number;
  /** 主力净流入占比 */
  mainNetInflowRatio: number;
}

/**
 * 行业个股列表接口
 */
export interface IndustryStock {
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 当前价格 */
  price: number;
  /** 涨跌幅 */
  changePercent: number;
  /** 市值 */
  marketCap: number;
  /** 成交额 */
  volume: number;
  /** 市盈率 */
  pe?: number;
  /** 市净率 */
  pb?: number;
  /** 行业权重 */
  weight?: number;
}

/**
 * 获取所有板块列表
 */
export async function getSectorList(): Promise<Sector[]> {
  return request.get('/api/industry/sectors');
}

/**
 * 获取板块详情
 */
export async function getSectorDetail(code: string): Promise<Sector> {
  return request.get(`/api/industry/sectors/${code}`);
}

/**
 * 获取所有行业列表
 */
export async function getIndustryList(): Promise<Industry[]> {
  return request.get('/api/industry/industries');
}

/**
 * 获取板块下的行业列表
 */
export async function getIndustriesBySector(sectorCode: string): Promise<Industry[]> {
  return request.get(`/api/industry/sectors/${sectorCode}/industries`);
}

/**
 * 获取行业详情
 */
export async function getIndustryDetail(code: string): Promise<Industry> {
  return request.get(`/api/industry/industries/${code}`);
}

/**
 * 获取行业表现数据
 */
export async function getIndustryPerformance(
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y' = '1d',
): Promise<IndustryPerformance[]> {
  return request.get('/api/industry/performance', {
    params: { timeRange },
  });
}

/**
 * 获取行业资金流向
 */
export async function getIndustryMoneyFlow(
  code: string,
  startDate?: string,
  endDate?: string,
): Promise<IndustryMoneyFlow[]> {
  return request.get(`/api/industry/industries/${code}/money-flow`, {
    params: { startDate, endDate },
  });
}

/**
 * 获取行业个股列表
 */
export async function getIndustryStocks(
  code: string,
  sortBy: 'changePercent' | 'volume' | 'marketCap' = 'marketCap',
  order: 'asc' | 'desc' = 'desc',
  page = 1,
  pageSize = 20,
): Promise<{
  data: IndustryStock[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request.get(`/api/industry/industries/${code}/stocks`, {
    params: { sortBy, order, page, pageSize },
  });
}

/**
 * 获取行业对比数据
 */
export async function compareIndustries(
  codes: string[],
  metrics: string[] = ['changePercent', 'volume', 'marketCap'],
): Promise<{
  industries: Industry[];
  comparison: Record<string, any>;
}> {
  return request.post('/api/industry/compare', {
    codes,
    metrics,
  });
}

/**
 * 搜索行业
 */
export async function searchIndustries(keyword: string): Promise<Industry[]> {
  return request.get('/api/industry/search', {
    params: { keyword },
  });
}

/**
 * 获取行业轮动数据
 */
export async function getIndustryRotation(
  days = 30,
): Promise<{
  date: string;
  leaders: IndustryPerformance[];
  laggards: IndustryPerformance[];
}[]> {
  return request.get('/api/industry/rotation', {
    params: { days },
  });
}

/**
 * 获取行业相关性分析
 */
export async function getIndustryCorrelation(
  code: string,
  period = 90,
): Promise<{
  industry: string;
  correlation: number;
}[]> {
  return request.get(`/api/industry/industries/${code}/correlation`, {
    params: { period },
  });
}

/**
 * 获取行业估值分析
 */
export async function getIndustryValuation(code: string): Promise<{
  current: {
    pe: number;
    pb: number;
    ps: number;
  };
  historical: {
    pePercentile: number;
    pbPercentile: number;
    psPercentile: number;
  };
  comparison: {
    vsMarket: {
      pe: number;
      pb: number;
    };
    vsSector: {
      pe: number;
      pb: number;
    };
  };
}> {
  return request.get(`/api/industry/industries/${code}/valuation`);
}

export default {
  getSectorList,
  getSectorDetail,
  getIndustryList,
  getIndustriesBySector,
  getIndustryDetail,
  getIndustryPerformance,
  getIndustryMoneyFlow,
  getIndustryStocks,
  compareIndustries,
  searchIndustries,
  getIndustryRotation,
  getIndustryCorrelation,
  getIndustryValuation,
};
