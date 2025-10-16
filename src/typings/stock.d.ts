/**
 * 股票相关类型定义
 */

/** 股票基本信息 */
export interface StockInfo {
  /** 股票代码 (如: 600000.SH, 000001.SZ) */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 交易所 (SH: 上交所, SZ: 深交所, BJ: 北交所) */
  exchange: 'SH' | 'SZ' | 'BJ';
  /** 行业 */
  industry?: string;
  /** 板块 */
  sector?: string;
  /** 上市日期 */
  listDate?: string;
  /** 是否ST */
  isST?: boolean;
  /** 总股本 */
  totalShares?: number;
  /** 流通股本 */
  floatShares?: number;
  /** 总市值 */
  totalMarketCap?: number;
  /** 流通市值 */
  floatMarketCap?: number;
}

/** 股票实时行情 */
export interface StockQuote {
  /** 股票代码 */
  symbol: string;
  /** 最新价 */
  price: number;
  /** 涨跌额 */
  change: number;
  /** 涨跌幅 (%) */
  changePercent: number;
  /** 开盘价 */
  open: number;
  /** 最高价 */
  high: number;
  /** 最低价 */
  low: number;
  /** 昨收价 */
  preClose: number;
  /** 成交量 (手) */
  volume: number;
  /** 成交额 (元) */
  amount: number;
  /** 换手率 (%) */
  turnoverRate?: number;
  /** 市盈率 (TTM) */
  pe?: number;
  /** 市净率 */
  pb?: number;
  /** 涨停价 */
  limitUp?: number;
  /** 跌停价 */
  limitDown?: number;
  /** 更新时间 */
  updateTime: string;
  /** 市场状态 */
  marketStatus: 'open' | 'closed' | 'pre_open' | 'after_close';
}

/** K线数据点 */
export interface KLineData {
  /** 时间戳 */
  time: string;
  /** 开盘价 */
  open: number;
  /** 最高价 */
  high: number;
  /** 最低价 */
  low: number;
  /** 收盘价 */
  close: number;
  /** 成交量 */
  volume: number;
  /** 成交额 */
  amount?: number;
}

/** 图表数据 */
export interface StockChart {
  /** 股票代码 */
  symbol: string;
  /** 周期 */
  period: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'MAX';
  /** K线数据 */
  data: KLineData[];
}

/** 分时数据点 */
export interface TimeShareData {
  /** 时间 */
  time: string;
  /** 价格 */
  price: number;
  /** 均价 */
  avgPrice?: number;
  /** 成交量 */
  volume: number;
}

/** 财务指标 */
export interface FinancialMetrics {
  /** 股票代码 */
  symbol: string;
  /** 报告期 */
  reportDate: string;
  /** 营业收入 */
  revenue: number;
  /** 净利润 */
  netProfit: number;
  /** 毛利率 (%) */
  grossMargin: number;
  /** 净利率 (%) */
  netMargin: number;
  /** ROE (%) */
  roe: number;
  /** ROA (%) */
  roa: number;
  /** 资产负债率 (%) */
  debtToAsset: number;
  /** 流动比率 */
  currentRatio: number;
  /** 速动比率 */
  quickRatio: number;
  /** 每股收益 (EPS) */
  eps: number;
  /** 每股净资产 */
  bvps: number;
}

/** 股东信息 */
export interface ShareholderInfo {
  /** 股东名称 */
  name: string;
  /** 持股数量 (股) */
  shares: number;
  /** 持股比例 (%) */
  percentage: number;
  /** 股东类型 (1: 个人, 2: 机构) */
  type: 1 | 2;
  /** 变动情况 */
  change?: number;
  /** 报告期 */
  reportDate: string;
}

/** 新闻 */
export interface StockNews {
  /** 新闻ID */
  id: string;
  /** 标题 */
  title: string;
  /** 摘要 */
  summary?: string;
  /** 来源 */
  source: string;
  /** 发布时间 */
  publishTime: string;
  /** 链接 */
  url?: string;
  /** 相关股票 */
  relatedSymbols?: string[];
}

/** 公告 */
export interface StockAnnouncement {
  /** 公告ID */
  id: string;
  /** 股票代码 */
  symbol: string;
  /** 标题 */
  title: string;
  /** 公告类型 */
  type: string;
  /** 发布时间 */
  publishTime: string;
  /** PDF链接 */
  pdfUrl?: string;
}

/** 涨跌榜数据 */
export interface MarketMoverData {
  /** 排名 */
  rank: number;
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 最新价 */
  price: number;
  /** 涨跌额 */
  change: number;
  /** 涨跌幅 (%) */
  changePercent: number;
  /** 成交量 (手) */
  volume: number;
  /** 成交额 (元) */
  amount: number;
  /** 换手率 (%) */
  turnoverRate: number;
  /** 振幅 (%) */
  amplitude?: number;
}
