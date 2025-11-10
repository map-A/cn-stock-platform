/**
 * 分析工具相关类型定义
 */

/**
 * 选股器筛选参数
 */
export interface ScreenerParams {
  // 价格范围
  priceMin?: number;
  priceMax?: number;
  
  // 市值范围（亿）
  marketCapMin?: number;
  marketCapMax?: number;
  
  // 涨跌幅范围（%）
  changePercentMin?: number;
  changePercentMax?: number;
  
  // 成交量范围（万手）
  volumeMin?: number;
  volumeMax?: number;
  
  // 市盈率范围
  peMin?: number;
  peMax?: number;
  
  // 市净率范围
  pbMin?: number;
  pbMax?: number;
  
  // ROE范围（%）
  roeMin?: number;
  roeMax?: number;
  
  // 换手率范围（%）
  turnoverRateMin?: number;
  turnoverRateMax?: number;
  
  // 行业筛选
  industry?: string[];
  
  // 板块筛选
  sector?: string[];
  
  // 交易所
  exchange?: ('SH' | 'SZ' | 'BJ')[];
  
  // 排序字段
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 选股器结果
 */
export interface ScreenerResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  amount: number;
  marketCap: number;
  pe?: number;
  pb?: number;
  roe?: number;
  turnoverRate: number;
  industry?: string;
  sector?: string;
}

/**
 * 大宗交易数据
 */
export interface DarkPoolData {
  id: string;
  symbol: string;
  name: string;
  date: string;
  price: number;
  volume: number;
  amount: number;
  // 折溢价率（%）
  premiumRate: number;
  // 买方营业部
  buyerDepartment: string;
  // 卖方营业部
  sellerDepartment: string;
  // 成交价格占当日收盘价比例
  priceRatio: number;
}

/**
 * 大宗交易统计
 */
export interface DarkPoolStats {
  totalCount: number;
  totalAmount: number;
  avgPremiumRate: number;
  // 折价交易数量
  discountCount: number;
  // 溢价交易数量
  premiumCount: number;
}

/**
 * 营业部追踪数据
 */
export interface DepartmentTrack {
  department: string;
  // 买入次数
  buyCount: number;
  // 买入金额
  buyAmount: number;
  // 卖出次数
  sellCount: number;
  // 卖出金额
  sellAmount: number;
  // 净买入金额
  netAmount: number;
  // 涉及股票
  stocks: string[];
}

/**
 * 市场情绪指标
 */
export interface MarketTradeSentiment {
  date: string;
  // 市场情绪指数（0-100）
  sentimentIndex: number;
  // 恐慌贪婪指数（0-100）
  fearGreedIndex: number;
  // 涨停家数
  limitUpCount: number;
  // 跌停家数
  limitDownCount: number;
  // 涨跌比
  advanceDeclineRatio: number;
  // 资金情绪
  capitalSentiment: 'bullish' | 'bearish' | 'neutral';
  // 量能情绪
  volumeSentiment: 'active' | 'sluggish' | 'normal';
}

/**
 * 个股情绪数据
 */
export interface StockSentiment {
  symbol: string;
  name: string;
  // 情绪指数（0-100）
  sentimentScore: number;
  // 关注度（热度）
  attention: number;
  // 社交媒体提及次数
  socialMentions: number;
  // 新闻数量
  newsCount: number;
  // 正面/负面/中性新闻占比
  newsSentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  // 机构评级
  analystRating?: {
    buy: number;
    hold: number;
    sell: number;
  };
  // 最近一周涨跌幅
  weeklyChange: number;
}

/**
 * 情绪历史数据
 */
export interface SentimentHistory {
  date: string;
  sentimentIndex: number;
  fearGreedIndex: number;
}

/**
 * 热搜股票
 */
export interface TrendingStock {
  rank: number;
  symbol: string;
  name: string;
  changePercent: number;
  searchVolume: number;
  searchChange: number; // 搜索量变化
}
