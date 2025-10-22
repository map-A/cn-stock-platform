/**
 * 现金流量表服务
 * 提供现金流量数据获取和分析功能
 */

import request from 'umi-request';

export interface OperatingCashFlow {
  cashFromOperations: number; // 经营活动现金流入
  cashPaidForGoods: number; // 购买商品支付的现金
  cashPaidToEmployees: number; // 支付给职工的现金
  taxesPaid: number; // 支付的各项税费
  otherOperatingCash: number;
  netOperatingCashFlow: number; // 经营活动现金流量净额
}

export interface InvestingCashFlow {
  cashFromInvestments: number; // 投资活动现金流入
  cashPaidForAssets: number; // 购建固定资产支付的现金
  cashPaidForInvestments: number; // 投资支付的现金
  otherInvestingCash: number;
  netInvestingCashFlow: number; // 投资活动现金流量净额
}

export interface FinancingCashFlow {
  cashFromFinancing: number; // 筹资活动现金流入
  cashPaidForDebt: number; // 偿还债务支付的现金
  dividendsPaid: number; // 分配股利支付的现金
  interestPaid: number; // 支付利息的现金
  otherFinancingCash: number;
  netFinancingCashFlow: number; // 筹资活动现金流量净额
}

export interface CashFlowData {
  date: string;
  reportType: 'Q1' | 'Q2' | 'Q3' | 'annual';
  operating: OperatingCashFlow;
  investing: InvestingCashFlow;
  financing: FinancingCashFlow;
  netCashFlow: number; // 现金及现金等价物净增加额
  beginningCash: number; // 期初现金
  endingCash: number; // 期末现金
  freeCashFlow: number; // 自由现金流
}

export interface CashFlowAnalysis {
  operatingCashFlowMargin: number; // 经营现金流利润率
  cashFlowToDebt: number; // 现金流负债比
  cashFlowCoverage: number; // 现金流覆盖率
  freeCashFlowYield: number; // 自由现金流收益率
  cashConversionCycle: number; // 现金转换周期
  quality: 'excellent' | 'good' | 'fair' | 'poor'; // 现金流质量评级
}

/**
 * 获取现金流量表数据
 */
export async function getCashFlow(
  stockCode: string,
  params?: {
    startDate?: string;
    endDate?: string;
    reportType?: 'Q1' | 'Q2' | 'Q3' | 'annual';
  },
) {
  return request<API.Response<CashFlowData[]>>('/api/financial/cash-flow', {
    method: 'GET',
    params: {
      stockCode,
      ...params,
    },
  });
}

/**
 * 获取现金流分析结果
 */
export async function getCashFlowAnalysis(stockCode: string, date: string) {
  return request<API.Response<CashFlowAnalysis>>('/api/financial/cash-flow/analysis', {
    method: 'GET',
    params: {
      stockCode,
      date,
    },
  });
}

/**
 * 计算自由现金流
 * FCF = 经营活动现金流 - 资本支出
 */
export function calculateFreeCashFlow(data: CashFlowData): number {
  const capex = Math.abs(data.investing.cashPaidForAssets);
  return data.operating.netOperatingCashFlow - capex;
}

/**
 * 计算经营现金流利润率
 */
export function calculateOperatingCashFlowMargin(
  operatingCashFlow: number,
  revenue: number,
): number {
  if (revenue === 0) return 0;
  return (operatingCashFlow / revenue) * 100;
}

/**
 * 评估现金流质量
 */
export function assessCashFlowQuality(data: CashFlowData): CashFlowAnalysis['quality'] {
  const { operating, investing, financing } = data;
  
  // 优秀：经营现金流为正，投资现金流为负（扩张），筹资现金流为负（偿债分红）
  if (
    operating.netOperatingCashFlow > 0 &&
    investing.netInvestingCashFlow < 0 &&
    financing.netFinancingCashFlow < 0
  ) {
    return 'excellent';
  }
  
  // 良好：经营现金流为正，其他为负
  if (operating.netOperatingCashFlow > 0) {
    return 'good';
  }
  
  // 一般：经营现金流为负，但总现金流为正
  if (data.netCashFlow > 0) {
    return 'fair';
  }
  
  // 较差：总现金流为负
  return 'poor';
}

/**
 * 计算现金流趋势
 */
export function calculateCashFlowTrend(data: CashFlowData[]): {
  trend: 'improving' | 'stable' | 'declining';
  growth: number;
} {
  if (data.length < 2) {
    return { trend: 'stable', growth: 0 };
  }
  
  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sortedData.slice(-3);
  
  const growthRates = recent.slice(1).map((item, index) => {
    const prev = recent[index];
    if (prev.operating.netOperatingCashFlow === 0) return 0;
    return (
      (item.operating.netOperatingCashFlow - prev.operating.netOperatingCashFlow) /
      Math.abs(prev.operating.netOperatingCashFlow)
    );
  });
  
  const avgGrowth = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  
  if (avgGrowth > 0.1) return { trend: 'improving', growth: avgGrowth * 100 };
  if (avgGrowth < -0.1) return { trend: 'declining', growth: avgGrowth * 100 };
  return { trend: 'stable', growth: avgGrowth * 100 };
}

/**
 * 导出现金流量表数据为 CSV
 */
export function exportCashFlowToCSV(data: CashFlowData[]): string {
  const headers = [
    '日期',
    '报告类型',
    '经营活动现金流',
    '投资活动现金流',
    '筹资活动现金流',
    '现金净增加额',
    '自由现金流',
  ];
  
  const rows = data.map(item => [
    item.date,
    item.reportType,
    item.operating.netOperatingCashFlow,
    item.investing.netInvestingCashFlow,
    item.financing.netFinancingCashFlow,
    item.netCashFlow,
    item.freeCashFlow,
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}
