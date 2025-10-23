/**
 * 系统配置常量
 * 集中管理项目配置参数
 */

/** API 配置 */
export const API_CONFIG = {
  BASE_URL: process.env.API_URL || '/api',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;

/** 认证配置 */
export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  REFRESH_TOKEN_KEY: 'refresh_token',
  LOGIN_PATH: '/user/login',
  LOGOUT_PATH: '/user/logout',
} as const;

/** 应用配置 */
export const APP_CONFIG = {
  APP_NAME: '中国股票平台',
  VERSION: '1.0.0',
  LOCALE: 'zh-CN',
  THEME: 'dark',
} as const;

/** 分页配置 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE_NUMBER: 1,
  MAX_PAGE_SIZE: 100,
} as const;

/** 缓存配置 */
export const CACHE_CONFIG = {
  STOCK_CACHE_TIME: 5 * 60 * 1000, // 5 分钟
  USER_CACHE_TIME: 10 * 60 * 1000, // 10 分钟
  STRATEGY_CACHE_TIME: 15 * 60 * 1000, // 15 分钟
} as const;

/** 业务规则 */
export const BUSINESS_RULES = {
  MAX_WATCHLIST_SIZE: 50,
  MAX_PORTFOLIO_SIZE: 100,
  MIN_ORDER_AMOUNT: 100,
  MAX_ORDER_AMOUNT: 1000000,
} as const;

export default {
  API_CONFIG,
  AUTH_CONFIG,
  APP_CONFIG,
  PAGINATION_CONFIG,
  CACHE_CONFIG,
  BUSINESS_RULES,
};
