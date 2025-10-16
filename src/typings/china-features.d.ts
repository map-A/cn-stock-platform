/**
 * 中国股市特色功能类型定义
 */

/** 龙虎榜数据 */
export interface DragonTigerData {
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 交易日期 */
  tradeDate: string;
  /** 上榜原因 */
  reason: string;
  /** 收盘价 */
  closePrice: number;
  /** 涨跌幅 (%) */
  changePercent: number;
  /** 龙虎榜买入额 (元) */
  buyAmount: number;
  /** 龙虎榜卖出额 (元) */
  sellAmount: number;
  /** 龙虎榜净额 (元) */
  netAmount: number;
  /** 明细 */
  details?: DragonTigerDetail[];
}

/** 龙虎榜明细 */
export interface DragonTigerDetail {
  /** 营业部名称 */
  broker: string;
  /** 买入额 (元) */
  buyAmount: number;
  /** 卖出额 (元) */
  sellAmount: number;
  /** 净额 (元) */
  netAmount: number;
  /** 类型 (1: 买方, 2: 卖方) */
  type: 1 | 2;
}

/** 北向资金数据 */
export interface NorthboundData {
  /** 日期 */
  date: string;
  /** 沪股通净流入 (亿元) */
  hsgNetInflow: number;
  /** 深股通净流入 (亿元) */
  szgNetInflow: number;
  /** 北向资金合计净流入 (亿元) */
  totalNetInflow: number;
  /** 沪股通余额 (亿元) */
  hsgBalance: number;
  /** 深股通余额 (亿元) */
  szgBalance: number;
}

/** 北向资金持仓 */
export interface NorthboundHolding {
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 持股数量 (股) */
  shares: number;
  /** 持股市值 (元) */
  marketValue: number;
  /** 持股比例 (%) */
  percentage: number;
  /** 较上日变化 (股) */
  changeShares: number;
  /** 较上日变化 (%) */
  changePercent: number;
  /** 日期 */
  date: string;
}

/** 融资融券数据 */
export interface MarginData {
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 日期 */
  date: string;
  /** 融资余额 (元) */
  marginBalance: number;
  /** 融资买入额 (元) */
  marginBuyAmount: number;
  /** 融资偿还额 (元) */
  marginRepayAmount: number;
  /** 融资净买入 (元) */
  marginNetBuy: number;
  /** 融券余额 (元) */
  shortBalance: number;
  /** 融券卖出量 (股) */
  shortSellVolume: number;
  /** 融券偿还量 (股) */
  shortRepayVolume: number;
  /** 融券净卖出 (股) */
  shortNetSell: number;
  /** 融资融券余额 (元) */
  totalBalance: number;
}

/** 大宗交易数据 */
export interface BlockTradeData {
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 交易日期 */
  tradeDate: string;
  /** 成交价 (元) */
  price: number;
  /** 成交量 (股) */
  volume: number;
  /** 成交额 (元) */
  amount: number;
  /** 买方营业部 */
  buyer?: string;
  /** 卖方营业部 */
  seller?: string;
  /** 折溢价率 (%) */
  premiumRate: number;
}

/** 概念板块 */
export interface ConceptSector {
  /** 板块代码 */
  code: string;
  /** 板块名称 */
  name: string;
  /** 成分股数量 */
  stockCount: number;
  /** 平均涨跌幅 (%) */
  avgChangePercent: number;
  /** 上涨数量 */
  riseCount: number;
  /** 下跌数量 */
  fallCount: number;
  /** 领涨股 */
  leadingStock?: {
    symbol: string;
    name: string;
    changePercent: number;
  };
  /** 板块热度 */
  popularity?: number;
}

/** 概念板块成分股 */
export interface ConceptStock {
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 最新价 */
  price: number;
  /** 涨跌幅 (%) */
  changePercent: number;
  /** 所属概念 */
  concepts: string[];
}

/** ST股票预警 */
export interface STWarning {
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** ST类型 (*ST, ST, S*ST, SST) */
  stType: '*ST' | 'ST' | 'S*ST' | 'SST';
  /** 预警原因 */
  reason: string;
  /** ST日期 */
  stDate: string;
  /** 是否有退市风险 */
  delistRisk: boolean;
  /** 备注 */
  remark?: string;
}

/** 涨跌停统计 */
export interface LimitStatistics {
  /** 日期 */
  date: string;
  /** 涨停数量 */
  limitUpCount: number;
  /** 跌停数量 */
  limitDownCount: number;
  /** 涨停开板数量 */
  limitUpOpenCount: number;
  /** 涨停封板率 (%) */
  limitUpSealRate: number;
  /** 炸板率 (%) */
  limitUpBrokenRate: number;
}

/** 涨停板数据 */
export interface LimitUpData {
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 涨停价 */
  limitUpPrice: number;
  /** 首次涨停时间 */
  firstLimitUpTime: string;
  /** 涨停原因 */
  reason?: string;
  /** 连板天数 */
  consecutiveDays: number;
  /** 封单量 (手) */
  sealVolume: number;
  /** 封单金额 (元) */
  sealAmount: number;
  /** 是否开板 */
  isOpened: boolean;
  /** 开板次数 */
  openTimes: number;
}

/** 龙虎榜记录（Phase 4新增） */
export interface LongHuBangRecord {
  /** 排名 */
  rank: number;
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 收盘价 */
  closePrice: number;
  /** 涨跌幅 */
  changePercent: number;
  /** 上榜原因 */
  reason: string;
  /** 买入金额 */
  buyAmount: number;
  /** 卖出金额 */
  sellAmount: number;
  /** 净额 */
  netAmount: number;
  /** 机构参与数 */
  institutionCount: number;
  /** 成交额占比 */
  amountRatio: number;
}

/** 北向资金流向（Phase 4新增） */
export interface NorthMoneyFlow {
  /** 日期 */
  date: string;
  /** 净流入 */
  netAmount: number;
  /** 沪股通净流入 */
  shNetAmount: number;
  /** 深股通净流入 */
  szNetAmount: number;
  /** 买入额 */
  buyAmount: number;
  /** 卖出额 */
  sellAmount: number;
}

/** 北向资金个股（Phase 4新增） */
export interface NorthMoneyStock {
  /** 排名 */
  rank: number;
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 最新价 */
  price: number;
  /** 涨跌幅 */
  changePercent: number;
  /** 持股数量 */
  holdingAmount: number;
  /** 持股市值 */
  holdingValue: number;
  /** 持股占流通股比 */
  holdingPercent: number;
  /** 今日净流入 */
  todayNetAmount: number;
  /** 5日净流入 */
  fiveDayNetAmount: number;
}

/** 融资融券个股（Phase 4新增） */
export interface MarginTradeStock {
  /** 排名 */
  rank: number;
  /** 股票代码 */
  symbol: string;
  /** 股票名称 */
  name: string;
  /** 最新价 */
  price: number;
  /** 涨跌幅 */
  changePercent: number;
  /** 融资余额 */
  marginBalance: number;
  /** 融资买入额 */
  marginBuy: number;
  /** 融资偿还额 */
  marginRepay: number;
  /** 融资净买入 */
  marginNet: number;
  /** 融券余额 */
  shortBalance: number;
  /** 融资占比 */
  marginRatio: number;
}

/** 概念（Phase 4新增） */
export interface Concept {
  /** 概念代码 */
  code: string;
  /** 概念名称 */
  name: string;
  /** 涨跌幅 */
  changePercent: number;
  /** 成分股数量 */
  stockCount: number;
  /** 领涨股 */
  leadingStock: string;
  /** 涨停数 */
  riseLimit: number;
  /** 总市值 */
  totalMarketCap: number;
  /** 净流入 */
  netAmount: number;
  /** 热度排名 */
  hotRank: number;
}

/** 行业板块（Phase 4新增） */
export interface Sector {
  /** 排名 */
  rank: number;
  /** 板块代码 */
  code: string;
  /** 板块名称 */
  name: string;
  /** 涨跌幅 */
  changePercent: number;
  /** 成分股数量 */
  stockCount: number;
  /** 领涨股 */
  leadingStock: string;
  /** 总市值 */
  totalMarketCap: number;
  /** 净流入 */
  netAmount: number;
}

