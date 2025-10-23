/**
 * 财务报表服务
 * 提供利润表、资产负债表、现金流量表数据
 */
import request from '@/services/request';

export interface FinancialQueryParams {
  stockCode: string;
  period?: 'Q' | 'Y'; // Q: 季度, Y: 年度
  limit?: number;
}

/**
 * 获取利润表数据
 */
export async function getIncomeStatement(params: FinancialQueryParams) {
  return request('/api/financial/income-statement', {
    method: 'GET',
    params,
  });
}

/**
 * 获取资产负债表数据
 */
export async function getBalanceSheet(params: FinancialQueryParams) {
  return request('/api/financial/balance-sheet', {
    method: 'GET',
    params,
  });
}

/**
 * 获取现金流量表数据
 */
export async function getCashFlow(params: FinancialQueryParams) {
  return request('/api/financial/cash-flow', {
    method: 'GET',
    params,
  });
}

/**
 * 获取完整财务报表（三表合一）
 */
export async function getCompleteFinancials(params: FinancialQueryParams) {
  return request('/api/financial/complete', {
    method: 'GET',
    params,
  });
}
