/**
 * AI策略模块 API 服务
 * 
 * 依据文档: MODULE_PROMPTS.md - 策略管理模块
 */

import { request } from '@umijs/max';
import type {
  StrategyInfo,
  StrategyConfig,
  StrategyParameters,
  BacktestConfig,
  BacktestResult,
  StrategyExecution,
  StrategyPerformance,
  StrategyDeployment,
  StrategyTemplate,
  StrategySignal,
  StrategyLog,
} from '@/types/strategy';

// 基础路径
const API_PREFIX = '/api/v1/strategies';

/**
 * 策略基础管理
 */

// 获取策略列表
export async function getStrategies(params?: {
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  keyword?: string;
}): Promise<{
  items: StrategyInfo[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request(`${API_PREFIX}`, {
    method: 'GET',
    params,
  });
}

// 获取策略详情
export async function getStrategy(strategyId: string): Promise<StrategyInfo> {
  return request(`${API_PREFIX}/${strategyId}`, {
    method: 'GET',
  });
}

// 创建策略
export async function createStrategy(strategy: Omit<StrategyInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<StrategyInfo> {
  return request(`${API_PREFIX}`, {
    method: 'POST',
    data: strategy,
  });
}

// 更新策略
export async function updateStrategy(strategyId: string, updates: Partial<StrategyInfo>): Promise<StrategyInfo> {
  return request(`${API_PREFIX}/${strategyId}`, {
    method: 'PUT',
    data: updates,
  });
}

// 删除策略
export async function deleteStrategy(strategyId: string): Promise<void> {
  return request(`${API_PREFIX}/${strategyId}`, {
    method: 'DELETE',
  });
}

/**
 * 策略配置管理
 */

// 获取策略配置列表
export async function getStrategyConfigs(strategyId: string): Promise<StrategyConfig[]> {
  return request(`${API_PREFIX}/${strategyId}/configs`, {
    method: 'GET',
  });
}

// 获取策略配置详情
export async function getStrategyConfig(strategyId: string, configId: string): Promise<StrategyConfig> {
  return request(`${API_PREFIX}/${strategyId}/configs/${configId}`, {
    method: 'GET',
  });
}

// 创建策略配置
export async function createStrategyConfig(
  strategyId: string,
  config: Omit<StrategyConfig, 'id' | 'strategyId' | 'createdAt' | 'updatedAt'>
): Promise<StrategyConfig> {
  return request(`${API_PREFIX}/${strategyId}/configs`, {
    method: 'POST',
    data: config,
  });
}

// 更新策略配置
export async function updateStrategyConfig(
  strategyId: string,
  configId: string,
  updates: Partial<StrategyConfig>
): Promise<StrategyConfig> {
  return request(`${API_PREFIX}/${strategyId}/configs/${configId}`, {
    method: 'PUT',
    data: updates,
  });
}

// 删除策略配置
export async function deleteStrategyConfig(strategyId: string, configId: string): Promise<void> {
  return request(`${API_PREFIX}/${strategyId}/configs/${configId}`, {
    method: 'DELETE',
  });
}

/**
 * 回测管理
 */

// 创建回测任务
export async function createBacktest(config: BacktestConfig): Promise<{ backtestId: string }> {
  return request(`${API_PREFIX}/backtests`, {
    method: 'POST',
    data: config,
  });
}

// 获取回测结果
export async function getBacktestResult(backtestId: string): Promise<BacktestResult> {
  return request(`${API_PREFIX}/backtests/${backtestId}`, {
    method: 'GET',
  });
}

// 获取策略的回测历史
export async function getStrategyBacktests(strategyId: string): Promise<BacktestResult[]> {
  return request(`${API_PREFIX}/${strategyId}/backtests`, {
    method: 'GET',
  });
}

// 取消回测任务
export async function cancelBacktest(backtestId: string): Promise<void> {
  return request(`${API_PREFIX}/backtests/${backtestId}/cancel`, {
    method: 'POST',
  });
}

/**
 * 实时执行管理
 */

// 启动策略执行
export async function startStrategyExecution(
  strategyId: string,
  configId: string,
  options?: {
    environment?: 'paper' | 'live';
    capital?: number;
  }
): Promise<{ executionId: string }> {
  return request(`${API_PREFIX}/${strategyId}/execute`, {
    method: 'POST',
    data: { configId, ...options },
  });
}

// 停止策略执行
export async function stopStrategyExecution(executionId: string): Promise<void> {
  return request(`${API_PREFIX}/executions/${executionId}/stop`, {
    method: 'POST',
  });
}

// 获取策略执行状态
export async function getStrategyExecution(executionId: string): Promise<StrategyExecution> {
  return request(`${API_PREFIX}/executions/${executionId}`, {
    method: 'GET',
  });
}

// 获取策略执行列表
export async function getStrategyExecutions(params?: {
  strategyId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  items: StrategyExecution[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request(`${API_PREFIX}/executions`, {
    method: 'GET',
    params,
  });
}

/**
 * 策略信号和监控
 */

// 获取策略信号
export async function getStrategySignals(
  strategyId: string,
  params?: {
    startTime?: string;
    endTime?: string;
    symbol?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<{
  items: StrategySignal[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request(`${API_PREFIX}/${strategyId}/signals`, {
    method: 'GET',
    params,
  });
}

// 获取策略绩效分析
export async function getStrategyPerformance(
  strategyId: string,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly',
  startDate?: string,
  endDate?: string
): Promise<StrategyPerformance> {
  return request(`${API_PREFIX}/${strategyId}/performance`, {
    method: 'GET',
    params: { period, startDate, endDate },
  });
}

/**
 * 策略部署管理
 */

// 部署策略
export async function deployStrategy(deployment: Omit<StrategyDeployment, 'id' | 'deployedAt' | 'lastHealthCheck'>): Promise<StrategyDeployment> {
  return request(`${API_PREFIX}/deployments`, {
    method: 'POST',
    data: deployment,
  });
}

// 获取部署列表
export async function getStrategyDeployments(params?: {
  strategyId?: string;
  environment?: string;
  status?: string;
}): Promise<StrategyDeployment[]> {
  return request(`${API_PREFIX}/deployments`, {
    method: 'GET',
    params,
  });
}

// 更新部署配置
export async function updateStrategyDeployment(
  deploymentId: string,
  updates: Partial<StrategyDeployment>
): Promise<StrategyDeployment> {
  return request(`${API_PREFIX}/deployments/${deploymentId}`, {
    method: 'PUT',
    data: updates,
  });
}

// 停止部署
export async function stopStrategyDeployment(deploymentId: string): Promise<void> {
  return request(`${API_PREFIX}/deployments/${deploymentId}/stop`, {
    method: 'POST',
  });
}

/**
 * 策略模板管理
 */

// 获取策略模板列表
export async function getStrategyTemplates(params?: {
  type?: string;
  category?: string;
  difficulty?: string;
  keyword?: string;
}): Promise<StrategyTemplate[]> {
  return request(`${API_PREFIX}/templates`, {
    method: 'GET',
    params,
  });
}

// 获取策略模板详情
export async function getStrategyTemplate(templateId: string): Promise<StrategyTemplate> {
  return request(`${API_PREFIX}/templates/${templateId}`, {
    method: 'GET',
  });
}

// 从模板创建策略
export async function createStrategyFromTemplate(
  templateId: string,
  strategyName: string,
  customParameters?: Partial<StrategyParameters>
): Promise<StrategyInfo> {
  return request(`${API_PREFIX}/templates/${templateId}/create`, {
    method: 'POST',
    data: { strategyName, customParameters },
  });
}

/**
 * 策略统计和报告
 */

// 获取策略统计信息
export async function getStrategyStats(): Promise<{
  totalStrategies: number;
  activeStrategies: number;
  testingStrategies: number;
  avgWinRate: number;
  avgReturn: number;
  totalTrades: number;
}> {
  return request(`${API_PREFIX}/stats`, {
    method: 'GET',
  });
}

// 生成策略报告
export async function generateStrategyReport(
  strategyId: string,
  reportType: 'performance' | 'risk' | 'comprehensive',
  period?: { startDate: string; endDate: string }
): Promise<{ reportUrl: string }> {
  return request(`${API_PREFIX}/${strategyId}/reports`, {
    method: 'POST',
    data: { reportType, period },
  });
}

// 获取策略日志
export async function getStrategyLogs(
  strategyId: string,
  params?: {
    level?: 'info' | 'warning' | 'error';
    startTime?: string;
    endTime?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<{
  items: StrategyLog[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request(`${API_PREFIX}/${strategyId}/logs`, {
    method: 'GET',
    params,
  });
}

// 获取多因子模型
export async function getMultiFactorModel(strategyId: string): Promise<any> {
  return request(`${API_PREFIX}/${strategyId}/multi-factor`, {
    method: 'GET',
  });
}

// 获取因子分析
export async function getFactorAnalysis(strategyId: string): Promise<any> {
  return request(`${API_PREFIX}/${strategyId}/factor-analysis`, {
    method: 'GET',
  });
}

// 获取回测交易记录
export async function getBacktestTrades(backtestId: string): Promise<any[]> {
  return request(`${API_PREFIX}/backtests/${backtestId}/trades`, {
    method: 'GET',
  });
}

// 获取策略比较数据
export async function getStrategyComparison(strategyIds: string[]): Promise<any> {
  return request(`${API_PREFIX}/comparison`, {
    method: 'POST',
    data: { strategyIds },
  });
}

// 获取基准数据
export async function getBenchmarkData(benchmark: string, startDate: string, endDate: string): Promise<any> {
  return request(`${API_PREFIX}/benchmark`, {
    method: 'GET',
    params: { benchmark, startDate, endDate },
  });
}

// 获取性能警报
export async function getPerformanceAlert(strategyId: string): Promise<any[]> {
  return request(`${API_PREFIX}/${strategyId}/alerts`, {
    method: 'GET',
  });
}