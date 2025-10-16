/**
 * 市场相关常量
 */

/** 交易所代码映射 */
export const EXCHANGE_MAP = {
  SH: '上海证券交易所',
  SZ: '深圳证券交易所',
  BJ: '北京证券交易所',
} as const;

/** 交易时间配置 */
export const TRADING_HOURS = {
  // 集合竞价
  callAuction: {
    morning: { start: '09:15', end: '09:25' },
  },
  // 连续竞价
  continuous: {
    morning: { start: '09:30', end: '11:30' },
    afternoon: { start: '13:00', end: '15:00' },
  },
  // 盘后交易（科创板、创业板）
  afterHours: {
    start: '15:05',
    end: '15:30',
  },
} as const;

/** 涨跌停限制 */
export const LIMIT_RULES = {
  main: { up: 10, down: -10 }, // 主板
  star: { up: 20, down: -20 }, // 科创板
  chinext: { up: 20, down: -20 }, // 创业板
  beijing: { up: 30, down: -30 }, // 北交所
  st: { up: 5, down: -5 }, // ST股票
} as const;

/** 股票板块类型 */
export const BOARD_TYPE = {
  MAIN: 'main', // 主板
  STAR: 'star', // 科创板
  CHINEXT: 'chinext', // 创业板
  BEIJING: 'beijing', // 北交所
  ST: 'st', // ST股票
} as const;

/** 市场状态 */
export const MARKET_STATUS = {
  CLOSED: 'closed', // 休市
  PRE_OPEN: 'pre_open', // 盘前
  CALL_AUCTION: 'call_auction', // 集合竞价
  OPEN: 'open', // 交易中
  AFTER_CLOSE: 'after_close', // 盘后
} as const;

/** 时间周期 */
export const TIME_PERIODS = [
  { label: '分时', value: '1D' },
  { label: '5日', value: '5D' },
  { label: '1月', value: '1M' },
  { label: '3月', value: '3M' },
  { label: '6月', value: '6M' },
  { label: '1年', value: '1Y' },
  { label: '今年', value: 'YTD' },
  { label: '全部', value: 'MAX' },
] as const;

/** 涨跌榜类型 */
export const MOVER_TYPES = {
  GAINERS: 'gainers', // 涨幅榜
  LOSERS: 'losers', // 跌幅榜
  ACTIVE: 'active', // 成交榜
  AMPLITUDE: 'amplitude', // 振幅榜
} as const;
