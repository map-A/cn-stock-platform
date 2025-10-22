/**
 * 回测系统 API 服务
 * 
 * 依据文档: MODULE_PROMPTS.md - 回测系统模块
 */

import { request } from '@umijs/max';
import type {
  BacktestRecord,
  BacktestConfig,
  BacktestResults,
  BacktestReport,
  ParameterOptimization,
  WalkForwardConfig,
} from '@/types/backtest';

// 基础路径
const API_PREFIX = '/api/v1/backtest';

/**
 * 回测记录管理
 */

// 获取回测历史记录
export async function getBacktestHistory(params?: {
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
  return request(`${API_PREFIX}/history`, {
    method: 'GET',
    params,
  });
}

// 获取回测记录详情
export async function getBacktestRecord(backtestId: string): Promise<BacktestRecord> {
  return request(`${API_PREFIX}/${backtestId}`, {
    method: 'GET',
  });
}

// 创建回测任务
export async function createBacktest(config: BacktestConfig): Promise<BacktestRecord> {
  return request(`${API_PREFIX}`, {
    method: 'POST',
    data: config,
  });
}

// 删除回测记录
export async function deleteBacktest(backtestId: string): Promise<void> {
  return request(`${API_PREFIX}/${backtestId}`, {
    method: 'DELETE',
  });
}

// 取消运行中的回测
export async function cancelBacktest(backtestId: string): Promise<void> {
  return request(`${API_PREFIX}/${backtestId}/cancel`, {
    method: 'POST',
  });
}

/**
 * 回测结果查询
 */

// 获取回测结果详情
export async function getBacktestResults(backtestId: string): Promise<BacktestResults> {
  return request(`${API_PREFIX}/${backtestId}/results`, {
    method: 'GET',
  });
}

// 获取回测进度
export async function getBacktestProgress(backtestId: string): Promise<{
  progress: number;
  status: string;
  message?: string;
  estimatedTimeRemaining?: number;
}> {
  return request(`${API_PREFIX}/${backtestId}/progress`, {
    method: 'GET',
  });
}

// 获取回测日志
export async function getBacktestLogs(
  backtestId: string,
  params?: {
    level?: 'debug' | 'info' | 'warning' | 'error';
    limit?: number;
  }
): Promise<Array<{
  timestamp: string;
  level: string;
  message: string;
  data?: any;
}>> {
  return request(`${API_PREFIX}/${backtestId}/logs`, {
    method: 'GET',
    params,
  });
}

/**
 * 回测报告生成
 */

// 生成回测报告
export async function generateBacktestReport(
  backtestId: string,
  options?: {
    format?: 'pdf' | 'html' | 'excel';
    sections?: string[];
    includeCharts?: boolean;
  }
): Promise<BacktestReport> {
  return request(`${API_PREFIX}/${backtestId}/report`, {
    method: 'POST',
    data: options,
  });
}

// 下载回测报告
export async function downloadBacktestReport(
  backtestId: string,
  format: 'pdf' | 'html' | 'excel' = 'pdf'
): Promise<{ downloadUrl: string }> {
  return request(`${API_PREFIX}/${backtestId}/report/download`, {
    method: 'GET',
    params: { format },
  });
}

/**
 * 参数优化
 */

// 创建参数优化任务
export async function createParameterOptimization(
  strategyId: string,
  config: ParameterOptimization & {
    startDate: string;
    endDate: string;
    initialCapital: number;
  }
): Promise<BacktestRecord> {
  return request(`${API_PREFIX}/optimization`, {
    method: 'POST',
    data: {
      strategyId,
      ...config,
    },
  });
}

// 获取参数优化结果
export async function getOptimizationResults(backtestId: string): Promise<{
  bestParameters: Record<string, any>;
  results: Array<{
    parameters: Record<string, any>;
    metrics: Record<string, number>;
  }>;
  surface?: any; // 3D优化曲面数据
}> {
  return request(`${API_PREFIX}/${backtestId}/optimization/results`, {
    method: 'GET',
  });
}

/**
 * 走势分析
 */

// 创建走势分析任务
export async function createWalkForwardAnalysis(
  strategyId: string,
  config: WalkForwardConfig & {
    startDate: string;
    endDate: string;
    initialCapital: number;
    optimizationParameters?: ParameterOptimization;
  }
): Promise<BacktestRecord> {
  return request(`${API_PREFIX}/walk-forward`, {
    method: 'POST',
    data: {
      strategyId,
      ...config,
    },
  });
}

// 获取走势分析结果
export async function getWalkForwardResults(backtestId: string): Promise<{
  periods: Array<{
    inSamplePeriod: string;
    outSamplePeriod: string;
    bestParameters: Record<string, any>;
    inSampleMetrics: Record<string, number>;
    outSampleMetrics: Record<string, number>;
  }>;
  aggregatedMetrics: Record<string, number>;
  stability: {
    parameterStability: Record<string, number>;
    performanceStability: number;
  };
}> {
  return request(`${API_PREFIX}/${backtestId}/walk-forward/results`, {
    method: 'GET',
  });
}

/**
 * 比较分析
 */

// 比较多个回测结果
export async function compareBacktests(backtestIds: string[]): Promise<{
  backtests: BacktestRecord[];
  comparison: {
    metrics: Record<string, Record<string, number>>;
    timeSeries: Array<{
      date: string;
      values: Record<string, number>;
    }>;
    ranking: Array<{
      backtestId: string;
      rank: number;
      score: number;
    }>;
  };
}> {
  return request(`${API_PREFIX}/compare`, {
    method: 'POST',
    data: { backtestIds },
  });
}

/**
 * 回测统计
 */

// 获取回测统计信息
export async function getBacktestStatistics(): Promise<{
  totalBacktests: number;
  completedBacktests: number;
  runningBacktests: number;
  avgExecutionTime: number;
  successRate: number;
  topPerformingStrategies: Array<{
    strategyId: string;
    strategyName: string;
    avgReturn: number;
    backtestCount: number;
  }>;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
}> {
  return request(`${API_PREFIX}/statistics`, {
    method: 'GET',
  });
}