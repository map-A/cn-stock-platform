/**
 * 风险管理API服务
 * 
 * 功能特性:
 * - 风险指标数据获取
 * - 风险预警管理
 * - 压力测试执行
 * - 合规检查服务
 * - 风险报告生成
 * 
 * 依据文档: API_DESIGN_GUIDE.md - 风险管理模块
 */

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type {
  RiskMetrics,
  RiskAlert,
  VaRResult,
  StressTestScenario,
  StressTestResult,
  ComplianceRule,
  ComplianceCheckResult,
  RiskReport,
  RiskConfiguration,
  ApiResponse,
  PaginatedResponse,
  GetRiskMetricsRequest,
  GetRiskAlertsRequest,
  RunStressTestRequest,
  GenerateRiskReportRequest,
} from '@/types/risk';

const API_PREFIX = '/api/v1/risk';

/**
 * 获取风险指标
 */
export async function getRiskMetrics(
  params?: GetRiskMetricsRequest
): Promise<ApiResponse<RiskMetrics>> {
  return request(`${API_PREFIX}/metrics`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取风险预警列表
 */
export async function getRiskAlerts(
  params?: GetRiskAlertsRequest
): Promise<PaginatedResponse<RiskAlert>> {
  return request(`${API_PREFIX}/alerts`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取单个风险预警详情
 */
export async function getRiskAlertDetail(
  alertId: string
): Promise<ApiResponse<RiskAlert>> {
  return request(`${API_PREFIX}/alerts/${alertId}`, {
    method: 'GET',
  });
}

/**
 * 处理风险预警
 */
export async function handleRiskAlert(
  alertId: string,
  action: 'handle' | 'ignore',
  note?: string
): Promise<ApiResponse<void>> {
  return request(`${API_PREFIX}/alerts/${alertId}/handle`, {
    method: 'POST',
    data: {
      action,
      note,
    },
  });
}

/**
 * 获取VaR计算结果
 */
export async function getVaRResults(params: {
  portfolioId: string;
  startDate?: string;
  endDate?: string;
  method?: 'parametric' | 'historical' | 'monte_carlo';
  confidence?: number;
}): Promise<ApiResponse<VaRResult[]>> {
  return request(`${API_PREFIX}/var`, {
    method: 'GET',
    params,
  });
}

/**
 * 计算VaR
 */
export async function calculateVaR(data: {
  portfolioId: string;
  method: 'parametric' | 'historical' | 'monte_carlo';
  confidence: number;
  holdingPeriod: number;
  lookbackPeriod?: number;
}): Promise<ApiResponse<VaRResult>> {
  return request(`${API_PREFIX}/var/calculate`, {
    method: 'POST',
    data,
  });
}

/**
 * 获取压力测试场景列表
 */
export async function getStressTestScenarios(): Promise<ApiResponse<StressTestScenario[]>> {
  return request(`${API_PREFIX}/stress-test/scenarios`, {
    method: 'GET',
  });
}

/**
 * 创建自定义压力测试场景
 */
export async function createStressTestScenario(
  scenario: Omit<StressTestScenario, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<StressTestScenario>> {
  return request(`${API_PREFIX}/stress-test/scenarios`, {
    method: 'POST',
    data: scenario,
  });
}

/**
 * 运行压力测试
 */
export async function runStressTest(
  request_data: RunStressTestRequest
): Promise<ApiResponse<StressTestResult>> {
  return request(`${API_PREFIX}/stress-test/run`, {
    method: 'POST',
    data: request_data,
  });
}

/**
 * 获取压力测试结果列表
 */
export async function getStressTestResults(params: {
  portfolioId: string;
  scenarioId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<StressTestResult>> {
  return request(`${API_PREFIX}/stress-test/results`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取压力测试结果详情
 */
export async function getStressTestResultDetail(
  resultId: string
): Promise<ApiResponse<StressTestResult>> {
  return request(`${API_PREFIX}/stress-test/results/${resultId}`, {
    method: 'GET',
  });
}

/**
 * 获取合规规则列表
 */
export async function getComplianceRules(params?: {
  category?: string;
  status?: string;
  isActive?: boolean;
}): Promise<ApiResponse<ComplianceRule[]>> {
  return request(`${API_PREFIX}/compliance/rules`, {
    method: 'GET',
    params,
  });
}

/**
 * 创建合规规则
 */
export async function createComplianceRule(
  rule: Omit<ComplianceRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<ComplianceRule>> {
  return request(`${API_PREFIX}/compliance/rules`, {
    method: 'POST',
    data: rule,
  });
}

/**
 * 更新合规规则
 */
export async function updateComplianceRule(
  ruleId: string,
  rule: Partial<ComplianceRule>
): Promise<ApiResponse<ComplianceRule>> {
  return request(`${API_PREFIX}/compliance/rules/${ruleId}`, {
    method: 'PUT',
    data: rule,
  });
}

/**
 * 运行合规检查
 */
export async function runComplianceCheck(params: {
  portfolioId: string;
  ruleIds?: string[];
  saveResults?: boolean;
}): Promise<ApiResponse<ComplianceCheckResult[]>> {
  return request(`${API_PREFIX}/compliance/check`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取合规检查结果
 */
export async function getComplianceCheckResults(params: {
  portfolioId: string;
  ruleId?: string;
  status?: 'pass' | 'warning' | 'violation';
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<ComplianceCheckResult>> {
  return request(`${API_PREFIX}/compliance/results`, {
    method: 'GET',
    params,
  });
}

/**
 * 生成风险报告
 */
export async function generateRiskReport(
  request_data: GenerateRiskReportRequest
): Promise<ApiResponse<RiskReport>> {
  return request(`${API_PREFIX}/reports/generate`, {
    method: 'POST',
    data: request_data,
  });
}

/**
 * 获取风险报告列表
 */
export async function getRiskReports(params: {
  portfolioId: string;
  reportType?: RiskReport['reportType'];
  startDate?: string;
  endDate?: string;
  status?: RiskReport['status'];
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<RiskReport>> {
  return request(`${API_PREFIX}/reports`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取风险报告详情
 */
export async function getRiskReportDetail(
  reportId: string
): Promise<ApiResponse<RiskReport>> {
  return request(`${API_PREFIX}/reports/${reportId}`, {
    method: 'GET',
  });
}

/**
 * 下载风险报告
 */
export async function downloadRiskReport(
  reportId: string,
  format: 'pdf' | 'excel' | 'html'
): Promise<Blob> {
  return request(`${API_PREFIX}/reports/${reportId}/download`, {
    method: 'GET',
    params: { format },
    responseType: 'blob',
  });
}

/**
 * 获取风险配置
 */
export async function getRiskConfiguration(
  portfolioId: string
): Promise<ApiResponse<RiskConfiguration>> {
  return request(`${API_PREFIX}/configuration/${portfolioId}`, {
    method: 'GET',
  });
}

/**
 * 更新风险配置
 */
export async function updateRiskConfiguration(
  portfolioId: string,
  configuration: Partial<RiskConfiguration>
): Promise<ApiResponse<RiskConfiguration>> {
  return request(`${API_PREFIX}/configuration/${portfolioId}`, {
    method: 'PUT',
    data: configuration,
  });
}

/**
 * 风险实时监控 WebSocket 连接
 */
export function createRiskMonitorWebSocket(
  portfolioId: string,
  onMessage: (data: any) => void,
  onError?: (error: Event) => void,
  onClose?: (event: CloseEvent) => void
): WebSocket {
  const wsUrl = `${process.env.WS_BASE_URL || 'ws://localhost:8000'}/ws/risk/monitor/${portfolioId}`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('风险监控 WebSocket 消息解析错误:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('风险监控 WebSocket 连接错误:', error);
    if (onError) {
      onError(error);
    }
  };

  ws.onclose = (event) => {
    console.log('风险监控 WebSocket 连接关闭:', event.code, event.reason);
    if (onClose) {
      onClose(event);
    }
  };

  return ws;
}

/**
 * 测试风险预警通知
 */
export async function testRiskAlertNotification(params: {
  method: 'email' | 'sms' | 'webhook';
  recipient: string;
  message?: string;
}): Promise<ApiResponse<void>> {
  return request(`${API_PREFIX}/alerts/test-notification`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取风险统计数据
 */
export async function getRiskStatistics(params: {
  portfolioId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<{
  var: { average: number; max: number; min: number; trend: Array<{ date: string; value: number }> };
  volatility: { average: number; max: number; min: number; trend: Array<{ date: string; value: number }> };
  drawdown: { max: number; current: number; trend: Array<{ date: string; value: number }> };
  alerts: { total: number; byLevel: Record<string, number>; byType: Record<string, number> };
  compliance: { score: number; violations: number; warnings: number };
}>> {
  return request(`${API_PREFIX}/statistics`, {
    method: 'GET',
    params,
  });
}

/**
 * 导出风险数据
 */
export async function exportRiskData(params: {
  portfolioId: string;
  dataType: 'metrics' | 'alerts' | 'stress_tests' | 'compliance' | 'all';
  format: 'csv' | 'excel' | 'json';
  startDate: string;
  endDate: string;
}): Promise<Blob> {
  return request(`${API_PREFIX}/export`, {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}