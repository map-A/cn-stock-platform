/**
 * 财务比率服务
 * 提供各类财务比率计算和分析功能
 */

import { request } from '@umijs/max';

// 盈利能力比率
export interface ProfitabilityRatios {
  roe: number; // 净资产收益率
  roa: number; // 总资产收益率
  grossProfitMargin: number; // 毛利率
  netProfitMargin: number; // 净利率
  operatingProfitMargin: number; // 营业利润率
  ebitdaMargin: number; // EBITDA利润率
  roic: number; // 投入资本回报率
}

// 偿债能力比率
export interface SolvencyRatios {
  currentRatio: number; // 流动比率
  quickRatio: number; // 速动比率
  cashRatio: number; // 现金比率
  debtToEquity: number; // 资产负债率
  debtToAssets: number; // 产权比率
  interestCoverage: number; // 利息保障倍数
  equityMultiplier: number; // 权益乘数
}

// 营运能力比率
export interface EfficiencyRatios {
  assetTurnover: number; // 总资产周转率
  inventoryTurnover: number; // 存货周转率
  receivablesTurnover: number; // 应收账款周转率
  payablesTurnover: number; // 应付账款周转率
  workingCapitalTurnover: number; // 营运资本周转率
  fixedAssetTurnover: number; // 固定资产周转率
  daysInventoryOutstanding: number; // 存货周转天数
  daysSalesOutstanding: number; // 应收账款周转天数
  daysPayableOutstanding: number; // 应付账款周转天数
  cashConversionCycle: number; // 现金转换周期
}

// 成长能力比率
export interface GrowthRatios {
  revenueGrowth: number; // 营收增长率
  netIncomeGrowth: number; // 净利润增长率
  epsGrowth: number; // EPS增长率
  assetGrowth: number; // 总资产增长率
  equityGrowth: number; // 净资产增长率
  operatingCashFlowGrowth: number; // 经营现金流增长率
}

// 估值比率
export interface ValuationRatios {
  pe: number; // 市盈率
  pb: number; // 市净率
  ps: number; // 市销率
  pcf: number; // 市现率
  peg: number; // PEG比率
  evToEbitda: number; // EV/EBITDA
  evToSales: number; // EV/销售额
  dividendYield: number; // 股息率
  payoutRatio: number; // 股息支付率
}

export interface FinancialRatios {
  date: string;
  profitability: ProfitabilityRatios;
  solvency: SolvencyRatios;
  efficiency: EfficiencyRatios;
  growth: GrowthRatios;
  valuation: ValuationRatios;
  dupontAnalysis: DupontAnalysis;
}

// 杜邦分析
export interface DupontAnalysis {
  roe: number;
  netProfitMargin: number; // 销售净利率
  assetTurnover: number; // 总资产周转率
  equityMultiplier: number; // 权益乘数
  breakdown: {
    profitability: number; // 盈利能力贡献
    efficiency: number; // 营运效率贡献
    leverage: number; // 财务杠杆贡献
  };
}

/**
 * 获取财务比率数据
 */
export async function getFinancialRatios(
  stockCode: string,
  params?: {
    startDate?: string;
    endDate?: string;
  },
) {
  return request<API.Response<FinancialRatios[]>>('/api/financial/ratios', {
    method: 'GET',
    params: {
      stockCode,
      ...params,
    },
  });
}

/**
 * 获取行业平均财务比率
 */
export async function getIndustryAverageRatios(industryCode: string) {
  return request<API.Response<FinancialRatios>>('/api/financial/ratios/industry-average', {
    method: 'GET',
    params: {
      industryCode,
    },
  });
}

/**
 * 计算杜邦分析
 */
export function calculateDupontAnalysis(
  netIncome: number,
  revenue: number,
  totalAssets: number,
  equity: number,
): DupontAnalysis {
  const netProfitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
  const assetTurnover = totalAssets > 0 ? revenue / totalAssets : 0;
  const equityMultiplier = equity > 0 ? totalAssets / equity : 0;
  const roe = equity > 0 ? (netIncome / equity) * 100 : 0;
  
  return {
    roe,
    netProfitMargin,
    assetTurnover,
    equityMultiplier,
    breakdown: {
      profitability: netProfitMargin,
      efficiency: assetTurnover * 100,
      leverage: (equityMultiplier - 1) * 100,
    },
  };
}

/**
 * 计算财务健康度评分
 */
export function calculateFinancialHealthScore(ratios: FinancialRatios): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  weaknesses: string[];
} {
  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // 盈利能力评分 (30分)
  if (ratios.profitability.roe > 15) {
    score += 10;
    strengths.push('ROE优秀');
  } else if (ratios.profitability.roe < 5) {
    weaknesses.push('ROE较低');
  } else {
    score += 5;
  }
  
  if (ratios.profitability.netProfitMargin > 10) {
    score += 10;
    strengths.push('净利率优秀');
  } else if (ratios.profitability.netProfitMargin < 3) {
    weaknesses.push('净利率较低');
  } else {
    score += 5;
  }
  
  if (ratios.profitability.grossProfitMargin > 30) {
    score += 10;
    strengths.push('毛利率优秀');
  } else if (ratios.profitability.grossProfitMargin < 15) {
    weaknesses.push('毛利率较低');
  } else {
    score += 5;
  }
  
  // 偿债能力评分 (25分)
  if (ratios.solvency.currentRatio > 2) {
    score += 8;
    strengths.push('流动性充足');
  } else if (ratios.solvency.currentRatio < 1) {
    weaknesses.push('流动性不足');
  } else {
    score += 4;
  }
  
  if (ratios.solvency.debtToEquity < 0.5) {
    score += 8;
    strengths.push('负债率健康');
  } else if (ratios.solvency.debtToEquity > 1.5) {
    weaknesses.push('负债率偏高');
  } else {
    score += 4;
  }
  
  if (ratios.solvency.interestCoverage > 5) {
    score += 9;
    strengths.push('利息保障充足');
  } else if (ratios.solvency.interestCoverage < 2) {
    weaknesses.push('利息保障不足');
  } else {
    score += 4;
  }
  
  // 营运能力评分 (20分)
  if (ratios.efficiency.assetTurnover > 1) {
    score += 10;
    strengths.push('资产周转率优秀');
  } else if (ratios.efficiency.assetTurnover < 0.5) {
    weaknesses.push('资产周转率较低');
  } else {
    score += 5;
  }
  
  if (ratios.efficiency.cashConversionCycle < 60) {
    score += 10;
    strengths.push('现金周转快');
  } else if (ratios.efficiency.cashConversionCycle > 120) {
    weaknesses.push('现金周转慢');
  } else {
    score += 5;
  }
  
  // 成长能力评分 (15分)
  if (ratios.growth.revenueGrowth > 20) {
    score += 8;
    strengths.push('营收高增长');
  } else if (ratios.growth.revenueGrowth < 0) {
    weaknesses.push('营收负增长');
  } else {
    score += 4;
  }
  
  if (ratios.growth.netIncomeGrowth > 20) {
    score += 7;
    strengths.push('利润高增长');
  } else if (ratios.growth.netIncomeGrowth < 0) {
    weaknesses.push('利润负增长');
  } else {
    score += 3;
  }
  
  // 估值合理性 (10分)
  if (ratios.valuation.pe > 0 && ratios.valuation.pe < 20) {
    score += 5;
    strengths.push('估值合理');
  } else if (ratios.valuation.pe > 50) {
    weaknesses.push('估值偏高');
  } else {
    score += 2;
  }
  
  if (ratios.valuation.pb > 0 && ratios.valuation.pb < 3) {
    score += 5;
  } else {
    score += 2;
  }
  
  // 评级
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 40) grade = 'D';
  else grade = 'F';
  
  return { score, grade, strengths, weaknesses };
}

/**
 * 比较财务比率与行业平均
 */
export function compareWithIndustry(
  stockRatios: FinancialRatios,
  industryRatios: FinancialRatios,
): Record<string, 'above' | 'below' | 'equal'> {
  const comparison: Record<string, 'above' | 'below' | 'equal'> = {};
  
  const compareValue = (stock: number, industry: number): 'above' | 'below' | 'equal' => {
    const diff = Math.abs(stock - industry) / industry;
    if (diff < 0.05) return 'equal';
    return stock > industry ? 'above' : 'below';
  };
  
  comparison.roe = compareValue(stockRatios.profitability.roe, industryRatios.profitability.roe);
  comparison.roa = compareValue(stockRatios.profitability.roa, industryRatios.profitability.roa);
  comparison.netProfitMargin = compareValue(
    stockRatios.profitability.netProfitMargin,
    industryRatios.profitability.netProfitMargin,
  );
  comparison.debtToEquity = compareValue(
    stockRatios.solvency.debtToEquity,
    industryRatios.solvency.debtToEquity,
  );
  comparison.currentRatio = compareValue(
    stockRatios.solvency.currentRatio,
    industryRatios.solvency.currentRatio,
  );
  
  return comparison;
}
