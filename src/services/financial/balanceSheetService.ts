/**
 * 资产负债表服务
 * 提供资产负债表数据获取和计算功能
 */

import { request } from '@umijs/max';

export interface BalanceSheetAssets {
  // 流动资产
  cash: number;
  receivables: number;
  inventory: number;
  prepayments: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  
  // 非流动资产
  ppe: number; // 固定资产
  intangibleAssets: number;
  longTermInvestments: number;
  deferredTaxAssets: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;
  
  totalAssets: number;
}

export interface BalanceSheetLiabilities {
  // 流动负债
  payables: number;
  shortTermDebt: number;
  advanceReceipts: number;
  employeeBenefits: number;
  taxesPayable: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  
  // 非流动负债
  longTermDebt: number;
  bondsPayable: number;
  deferredTaxLiabilities: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  
  totalLiabilities: number;
}

export interface BalanceSheetEquity {
  shareCapital: number; // 股本
  capitalReserve: number; // 资本公积
  surplusReserve: number; // 盈余公积
  retainedEarnings: number; // 未分配利润
  treasuryStock: number; // 库存股
  otherEquity: number;
  totalEquity: number;
}

export interface BalanceSheetData {
  date: string;
  reportType: 'Q1' | 'Q2' | 'Q3' | 'annual'; // 季报类型
  assets: BalanceSheetAssets;
  liabilities: BalanceSheetLiabilities;
  equity: BalanceSheetEquity;
}

export interface BalanceSheetComparison {
  current: BalanceSheetData;
  previous: BalanceSheetData;
  yoy: Record<string, number>; // 同比变化率
  qoq: Record<string, number>; // 环比变化率
}

/**
 * 获取资产负债表数据
 */
export async function getBalanceSheet(
  stockCode: string,
  params?: {
    startDate?: string;
    endDate?: string;
    reportType?: 'Q1' | 'Q2' | 'Q3' | 'annual';
  },
) {
  return request<API.Response<BalanceSheetData[]>>('/api/financial/balance-sheet', {
    method: 'GET',
    params: {
      stockCode,
      ...params,
    },
  });
}

/**
 * 获取资产负债表对比数据
 */
export async function getBalanceSheetComparison(
  stockCode: string,
  currentDate: string,
  compareDate: string,
) {
  return request<API.Response<BalanceSheetComparison>>('/api/financial/balance-sheet/compare', {
    method: 'GET',
    params: {
      stockCode,
      currentDate,
      compareDate,
    },
  });
}

/**
 * 计算资产负债率
 */
export function calculateAssetLiabilityRatio(data: BalanceSheetData): number {
  if (data.assets.totalAssets === 0) return 0;
  return (data.liabilities.totalLiabilities / data.assets.totalAssets) * 100;
}

/**
 * 计算流动比率
 */
export function calculateCurrentRatio(data: BalanceSheetData): number {
  if (data.liabilities.totalCurrentLiabilities === 0) return 0;
  return data.assets.totalCurrentAssets / data.liabilities.totalCurrentLiabilities;
}

/**
 * 计算速动比率
 */
export function calculateQuickRatio(data: BalanceSheetData): number {
  if (data.liabilities.totalCurrentLiabilities === 0) return 0;
  const quickAssets = data.assets.totalCurrentAssets - data.assets.inventory;
  return quickAssets / data.liabilities.totalCurrentLiabilities;
}

/**
 * 计算权益乘数
 */
export function calculateEquityMultiplier(data: BalanceSheetData): number {
  if (data.equity.totalEquity === 0) return 0;
  return data.assets.totalAssets / data.equity.totalEquity;
}

/**
 * 导出资产负债表数据为 CSV
 */
export function exportBalanceSheetToCSV(data: BalanceSheetData[]): string {
  const headers = [
    '日期',
    '报告类型',
    '流动资产',
    '非流动资产',
    '总资产',
    '流动负债',
    '非流动负债',
    '总负债',
    '股东权益',
  ];
  
  const rows = data.map(item => [
    item.date,
    item.reportType,
    item.assets.totalCurrentAssets,
    item.assets.totalNonCurrentAssets,
    item.assets.totalAssets,
    item.liabilities.totalCurrentLiabilities,
    item.liabilities.totalNonCurrentLiabilities,
    item.liabilities.totalLiabilities,
    item.equity.totalEquity,
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
