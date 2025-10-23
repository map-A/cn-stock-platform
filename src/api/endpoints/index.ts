/**
 * API 端点定义
 * 集中管理所有 API 请求定义
 */

// 股票相关 API
export interface StockEndpoints {
  getQuote: (symbol: string) => Promise<any>;
  getHistory: (symbol: string, period: string) => Promise<any>;
  search: (keyword: string) => Promise<any>;
}

// 账户相关 API
export interface AccountEndpoints {
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  getProfile: () => Promise<any>;
}

// 策略相关 API
export interface StrategyEndpoints {
  list: () => Promise<any>;
  create: (data: any) => Promise<any>;
  backtest: (id: string) => Promise<any>;
}

export default {};
