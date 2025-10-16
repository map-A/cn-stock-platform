/**
 * 回测服务
 * 提供策略回测功能
 */

import { apiClient } from './apiClient';

export interface BacktestStrategy {
  id?: string;
  name: string;
  type: 'technical' | 'fundamental' | 'custom';
  rules: BacktestRule[];
  initialCapital: number;
  positionSize: number;
  commission: number;
}

export interface BacktestRule {
  indicator: string;
  condition: 'crosses_above' | 'crosses_below' | 'greater_than' | 'less_than';
  value: number | string;
  action: 'buy' | 'sell';
}

export interface BacktestResult {
  summary: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    totalTrades: number;
    profitFactor: number;
  };
  equity: Array<{ date: string; value: number }>;
  trades: Array<{
    date: string;
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
    profit?: number;
  }>;
}

class BacktestService {
  async runBacktest(strategy: BacktestStrategy, symbol: string, startDate: string, endDate: string): Promise<BacktestResult> {
    const response = await apiClient.post('/api/backtest/run', {
      strategy,
      symbol,
      startDate,
      endDate,
    });
    return response.data;
  }

  async saveStrategy(strategy: BacktestStrategy): Promise<void> {
    await apiClient.post('/api/backtest/strategies', strategy);
  }

  async getStrategies(): Promise<BacktestStrategy[]> {
    const response = await apiClient.get('/api/backtest/strategies');
    return response.data;
  }

  async deleteStrategy(id: string): Promise<void> {
    await apiClient.delete(`/api/backtest/strategies/${id}`);
  }
}

export const backtestService = new BacktestService();
export default backtestService;
