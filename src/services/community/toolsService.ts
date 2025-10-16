/**
 * @file 工具服务
 * @description 提供股票对比、回测等工具功能
 */

import request from '@/utils/request';

export interface ComparisonData {
  symbols: string[];
  metrics: {
    [key: string]: {
      label: string;
      values: { [symbol: string]: number | string };
      change?: { [symbol: string]: number };
    };
  };
}

export interface BacktestParams {
  symbols: string[];
  strategy: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  rebalanceFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  parameters?: Record<string, any>;
}

export interface BacktestResult {
  id: string;
  symbols: string[];
  strategy: string;
  period: {
    start: string;
    end: string;
  };
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    trades: number;
  };
  equity: Array<{
    date: string;
    value: number;
  }>;
  trades: Array<{
    date: string;
    symbol: string;
    action: 'buy' | 'sell';
    price: number;
    quantity: number;
    value: number;
  }>;
  benchmark?: {
    totalReturn: number;
    annualizedReturn: number;
  };
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: Array<{
    name: string;
    type: 'number' | 'string' | 'boolean';
    default: any;
    min?: number;
    max?: number;
    options?: string[];
  }>;
}

/**
 * 工具服务类
 */
class ToolsService {
  /**
   * 股票对比
   * @description 对比多个股票的关键指标
   */
  async compareStocks(symbols: string[]): Promise<ComparisonData> {
    const response = await request.post('/api/tools/compare', { symbols });
    return response.data;
  }

  /**
   * 获取可用的回测策略
   * @description 获取所有可用的回测策略列表
   */
  async getStrategies(): Promise<Strategy[]> {
    const response = await request.get('/api/tools/strategies');
    return response.data;
  }

  /**
   * 运行回测
   * @description 执行股票回测策略
   */
  async runBacktest(params: BacktestParams): Promise<BacktestResult> {
    const response = await request.post('/api/tools/backtest/run', params);
    return response.data;
  }

  /**
   * 获取回测结果
   * @description 获取已保存的回测结果
   */
  async getBacktestResult(id: string): Promise<BacktestResult> {
    const response = await request.get(`/api/tools/backtest/${id}`);
    return response.data;
  }

  /**
   * 获取历史回测列表
   * @description 获取用户的历史回测记录
   */
  async getBacktestHistory(params: {
    page?: number;
    size?: number;
  }): Promise<{
    backtests: Array<{
      id: string;
      name: string;
      strategy: string;
      created: string;
      performance: {
        totalReturn: number;
        sharpeRatio: number;
      };
    }>;
    total: number;
  }> {
    const response = await request.get('/api/tools/backtest/history', {
      params,
    });
    return response.data;
  }

  /**
   * 删除回测结果
   * @description 删除指定的回测结果
   */
  async deleteBacktest(id: string): Promise<{ success: boolean }> {
    const response = await request.delete(`/api/tools/backtest/${id}`);
    return response.data;
  }

  /**
   * 导出回测报告
   * @description 导出回测结果为PDF或Excel
   */
  async exportBacktest(params: {
    id: string;
    format: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await request.get(`/api/tools/backtest/${params.id}/export`, {
      params: { format: params.format },
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * 计算股票相关性
   * @description 计算多个股票之间的相关性矩阵
   */
  async calculateCorrelation(params: {
    symbols: string[];
    period?: '1m' | '3m' | '6m' | '1y' | '2y';
  }): Promise<{
    correlationMatrix: number[][];
    symbols: string[];
  }> {
    const response = await request.post('/api/tools/correlation', params);
    return response.data;
  }

  /**
   * 投资组合优化
   * @description 基于现代投资组合理论优化资产配置
   */
  async optimizePortfolio(params: {
    symbols: string[];
    objective: 'max-return' | 'min-risk' | 'max-sharpe';
    constraints?: {
      minWeight?: number;
      maxWeight?: number;
    };
  }): Promise<{
    weights: { [symbol: string]: number };
    expectedReturn: number;
    expectedRisk: number;
    sharpeRatio: number;
  }> {
    const response = await request.post('/api/tools/portfolio-optimize', params);
    return response.data;
  }
}

export default new ToolsService();
