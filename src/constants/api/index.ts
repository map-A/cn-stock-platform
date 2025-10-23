/**
 * API 端点常量
 * 集中管理所有 API 请求端点
 */

export const API_ENDPOINTS = {
  // 股票相关
  STOCK: {
    QUOTE: '/stock/quote',
    HISTORY: '/stock/history',
    SEARCH: '/stock/search',
    LIST: '/stock/list',
  },

  // 账户相关
  ACCOUNT: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },

  // 策略相关
  STRATEGY: {
    LIST: '/strategy/list',
    GET: '/strategy/get',
    CREATE: '/strategy/create',
    UPDATE: '/strategy/update',
    DELETE: '/strategy/delete',
    BACKTEST: '/strategy/backtest',
  },

  // 回测相关
  BACKTEST: {
    LIST: '/backtest/list',
    GET: '/backtest/get',
    CREATE: '/backtest/create',
    RESULT: '/backtest/result',
  },

  // 投资组合相关
  PORTFOLIO: {
    LIST: '/portfolio/list',
    GET: '/portfolio/get',
    CREATE: '/portfolio/create',
    UPDATE: '/portfolio/update',
  },

  // 风险相关
  RISK: {
    ANALYSIS: '/risk/analysis',
    VAR: '/risk/var',
    STRESS_TEST: '/risk/stress-test',
  },

  // 交易相关
  TRADE: {
    HISTORY: '/trade/history',
    STATISTICS: '/trade/statistics',
    PERFORMANCE: '/trade/performance',
  },

  // 新闻分析
  NEWS: {
    LIST: '/news/list',
    ANALYSIS: '/news/analysis',
  },
} as const;

export default API_ENDPOINTS;
