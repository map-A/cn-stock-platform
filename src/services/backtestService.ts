/**
 * 回测服务 - 统一API接口
 * 提供策略回测功能
 */

import { request } from '@umijs/max';
import { apiClient } from './apiClient';

// 基础路径
const API_PREFIX = '/api/v1/backtest';

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

export interface BacktestConfig {
  strategyId: string | number;
  name?: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  symbols?: string[];
  benchmark?: string;
  parameters?: Record<string, any>;
}

export interface BacktestRecord {
  id: string | number;
  name?: string;
  strategy_id: string | number;
  strategyName?: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_capital?: number;
  return_percent?: number;
  max_drawdown?: number;
  sharpe_ratio?: number;
  win_rate?: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  created_at?: string;
  updated_at?: string;
  startDate?: string;
  endDate?: string;
  totalReturn?: number;
  maxDrawdown?: number;
  sharpeRatio?: number;
  createdAt?: string;
}

class BacktestService {
  async runBacktest(strategy: BacktestStrategy, symbol: string, startDate: string, endDate: string): Promise<BacktestResult> {
    const response = await apiClient.post(`${API_PREFIX}/run`, {
      strategy,
      symbol,
      startDate,
      endDate,
    });
    return response.data;
  }

  async saveStrategy(strategy: BacktestStrategy): Promise<void> {
    await apiClient.post(`${API_PREFIX}/strategies`, strategy);
  }

  async getStrategies(): Promise<BacktestStrategy[]> {
    const response = await apiClient.get(`${API_PREFIX}/strategies`);
    return response.data;
  }

  async deleteStrategy(id: string): Promise<void> {
    await apiClient.delete(`${API_PREFIX}/strategies/${id}`);
  }

  // 获取回测历史列表
  async getBacktests(params?: { page?: number; pageSize?: number; strategyId?: string; status?: string }): Promise<{
    items: BacktestRecord[];
    total: number;
    page: number;
    page_size: number;
  }> {
    try {
      const response = await apiClient.get(`${API_PREFIX}/history`, { params });
      if (response.data?.items) {
        return response.data;
      }
      return {
        items: Array.isArray(response.data) ? response.data : [],
        total: Array.isArray(response.data) ? response.data.length : 0,
        page: params?.page || 1,
        page_size: params?.pageSize || 10,
      };
    } catch (error) {
      console.error('Failed to fetch backtests:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        page_size: 10,
      };
    }
  }

  // 获取回测历史（兼容旧API）
  async getBacktestHistory(params?: {
    strategyId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    items: BacktestRecord[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const result = await this.getBacktests(params);
    return {
      ...result,
      pageSize: result.page_size,
    };
  }

  // 获取回测详情
  async getBacktestDetail(backtestId: string): Promise<BacktestRecord> {
    const response = await apiClient.get(`${API_PREFIX}/${backtestId}`);
    return response.data;
  }

  // 获取回测记录（兼容）
  async getBacktestRecord(backtestId: string): Promise<BacktestRecord> {
    return this.getBacktestDetail(backtestId);
  }

  // 创建回测任务
  async createBacktest(data: BacktestConfig | {
    strategy_id: number;
    name?: string;
    start_date: string;
    end_date: string;
    initial_capital: number;
  }): Promise<BacktestRecord> {
    const response = await apiClient.post(`${API_PREFIX}`, data);
    return response.data;
  }

  // 删除回测记录
  async deleteBacktest(backtestId: string): Promise<void> {
    await apiClient.delete(`${API_PREFIX}/${backtestId}`);
  }

  // 取消运行中的回测
  async cancelBacktest(backtestId: string): Promise<void> {
    await apiClient.post(`${API_PREFIX}/${backtestId}/cancel`);
  }

  // 获取回测结果
  async getBacktestResults(backtestId: string): Promise<any> {
    const response = await apiClient.get(`${API_PREFIX}/${backtestId}/results`);
    return response.data;
  }

  // 获取回测进度
  async getBacktestProgress(backtestId: string): Promise<{
    progress: number;
    status: string;
    message?: string;
    estimatedTimeRemaining?: number;
  }> {
    const response = await apiClient.get(`${API_PREFIX}/${backtestId}/progress`);
    return response.data;
  }
}

export const backtestService = new BacktestService();

// 导出便捷方法
export const getBacktests = backtestService.getBacktests.bind(backtestService);
export const getBacktestHistory = backtestService.getBacktestHistory.bind(backtestService);
export const getBacktestDetail = backtestService.getBacktestDetail.bind(backtestService);
export const getBacktestRecord = backtestService.getBacktestRecord.bind(backtestService);
export const createBacktest = backtestService.createBacktest.bind(backtestService);
export const deleteBacktest = backtestService.deleteBacktest.bind(backtestService);
export const cancelBacktest = backtestService.cancelBacktest.bind(backtestService);
export const getBacktestResults = backtestService.getBacktestResults.bind(backtestService);
export const getBacktestProgress = backtestService.getBacktestProgress.bind(backtestService);

export default backtestService;
