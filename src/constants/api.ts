/**
 * API 路径常量
 */

export const API_BASE_URL = process.env.API_URL || '/api';
export const WS_BASE_URL = process.env.WS_URL || 'ws://localhost:8000';

/** 股票相关接口 */
export const STOCK_API = {
  QUOTE: '/stock/quote',
  INFO: '/stock/info',
  CHART: '/stock/chart',
  SEARCH: '/stock/search',
  HOT: '/stock/hot',
  WATCHLIST: '/stock/watchlist',
} as const;

/** 市场相关接口 */
export const MARKET_API = {
  MOVERS: '/market/movers',
  OVERVIEW: '/market/overview',
  STATISTICS: '/market/statistics',
  EARNINGS: '/market/earnings-calendar',
  CAPITAL_FLOW: '/market/capital-flow',
} as const;

/** cn特色功能接口 */
export const CHINA_FEATURES_API = {
  DRAGON_TIGER: '/china-features/dragon-tiger',
  NORTHBOUND: '/china-features/northbound',
  MARGIN: '/china-features/margin',
  BLOCK_TRADES: '/china-features/block-trades',
  CONCEPTS: '/china-features/concepts',
  LIMIT: '/china-features/limit',
} as const;

/** WebSocket 频道 */
export const WS_CHANNELS = {
  STOCK_QUOTE: '/stock',
  MARKET_OVERVIEW: '/market/overview',
  NORTHBOUND_FLOW: '/northbound/flow',
} as const;
